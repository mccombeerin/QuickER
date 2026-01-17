const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const nodemailer = require('nodemailer');
const serviceAccount = require('./firebase.json');
require('dotenv').config();

// 1. Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();

// 2. Middleware
app.use(cors({ origin: '*' })); // This allows any frontend to talk to your backend
app.use(express.json());

// 3. Email Transporter Configuration (Unified)
// Make sure to set your credentials here or in a .env file
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587, // Changed from 465
  secure: false, // Must be false for port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false // Helps bypass local network security blocks
  }
});

// --- ENDPOINT 1: GET RANKED HOSPITALS ---
app.post('/api/recommend-hospitals', async (req, res) => {
  try {
    const { userLat, userLng, severity } = req.body;
    const snapshot = await db.collection('hospitals').get();
    let hospitals = [];
    snapshot.forEach(doc => hospitals.push({ id: doc.id, ...doc.data() }));

    const ranked = hospitals.map(h => {
      const distance = Math.sqrt(Math.pow(h.lat - userLat, 2) + Math.pow(h.lng - userLng, 2));
      const waitWeight = severity === 'high' ? 0.5 : 1.2;
      const score = (distance * 100) + (h.current_wait_mins * waitWeight);
      return { ...h, score, distance: (distance * 111).toFixed(1) };
    }).sort((a, b) => a.score - b.score);

    res.json(ranked);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ENDPOINT 2: PATIENT CHECK-IN & NOTIFICATION ---
app.post('/api/patient/check-in', async (req, res) => {
  try {
    const { 
      firstName, lastName, dob, email, address, 
      healthCard, symptoms, userLat, userLng 
    } = req.body;

    const snapshot = await db.collection('hospitals').get();
    let hospitals = [];
    snapshot.forEach(doc => hospitals.push({ id: doc.id, ...doc.data() }));

    const ranked = hospitals.map(h => {
      const distance = Math.sqrt(Math.pow(h.lat - userLat, 2) + Math.pow(h.lng - userLng, 2));
      const score = (distance * 100) + h.current_wait_mins;
      return { ...h, score };
    }).sort((a, b) => a.score - b.score);

    const bestHospital = ranked[0];

    const patientSession = {
      firstName, lastName, dob, email, address,
      healthCard: healthCard.replace(/\d(?=\d{4})/g, "*"),
      symptoms,
      assignedHospitalId: bestHospital.id,
      assignedHospitalName: bestHospital.name,
      status: "en_route",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('patient_sessions').add(patientSession);

    // --- EMAIL LOGIC ---
    const mailOptions = {
      from: '"QuickER Ottawa" <YOUR_EMAIL@gmail.com>',
      to: email,
      subject: `Your Emergency Routing: ${bestHospital.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #d32f2f;">QuickER Routing Active</h2>
          <p>Hello <strong>${firstName}</strong>,</p>
          <p>We have processed your triage. Please head to the following location:</p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px;">
            <p><strong>Hospital:</strong> ${bestHospital.name}</p>
            <p><strong>Address:</strong> ${bestHospital.address}</p>
            <p><strong>Current Est. Wait:</strong> ${bestHospital.current_wait_mins} mins</p>
          </div>
          <p>Your data has been sent ahead to the nursing station.</p>
        </div>
      `
    };

    // THIS LINE TRIGGERS THE ACTUAL EMAIL SENDING
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.error("Email failed:", err);
      else console.log("Email sent successfully!");
    });

    res.json({
      success: true,
      sessionId: docRef.id,
      recommendation: {
        hospitalName: bestHospital.name,
        address: bestHospital.address,
        waitTime: bestHospital.current_wait_mins
      }
    });

  } catch (error) {
    console.error("Check-in Error:", error);
    res.status(500).json({ error: "Failed to process check-in" });
  }
});

// --- ENDPOINT 3: HOSPITAL INBOUND QUEUE ---
app.get('/api/hospital/:hospitalId/queue', async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const snapshot = await db.collection('patient_sessions')
      .where('assignedHospitalId', '==', hospitalId)
      .where('status', '==', 'en_route')
      .get(); // Note: orderBy requires a Firestore index, keeping it simple for now

    let queue = [];
    snapshot.forEach(doc => queue.push({ id: doc.id, ...doc.data() }));
    res.json(queue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 QuickER Backend Live on Port ${PORT}`);
});