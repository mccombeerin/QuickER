const express = require('express');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. Firebase Admin Setup
// Ensure your serviceAccountKey.json is in the same folder!
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// 2. Email Setup
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'yasmin31.mahdi@gmail.com',
    pass: process.env.EMAIL_PASS // Ensure this is set in your .env file
  },
  tls: { rejectUnauthorized: false }
});

// 3. POST: Patient Check-in
app.post('/api/patient/check-in', async (req, res) => {
  try {
    const { firstName, lastName, dob, email, symptoms, healthCard } = req.body;

    const patientData = {
      firstName: firstName || "Unknown",
      lastName: lastName || "Patient",
      dob: dob || "",
      email: email || "",
      symptoms: symptoms || "No symptoms provided",
      healthCard: healthCard || "",
      status: 'En-Route',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // 1. Save to patient_sessions (This is what the dashboard reads)
    const docRef = await db.collection('patient_sessions').add(patientData);

    // 2. Send the pretty email from your teammate's update
    const mailOptions = {
      from: '"QuickER Ottawa" <yasmin31.mahdi@gmail.com>',
      to: email,
      subject: `Your Emergency Routing Confirmed`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #d32f2f;">QuickER Routing Active</h2>
          <p>Hello <strong>${firstName}</strong>,</p>
          <p>We have processed your triage. Your data has been sent ahead to the nursing station.</p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px;">
            <p><strong>Status:</strong> En-Route</p>
            <p><strong>Estimated Triage:</strong> Digital check-in complete.</p>
          </div>
          <p>Please proceed to your recommended hospital immediately.</p>
        </div>
      `
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.error("Email failed:", err);
      else console.log("Email sent successfully!");
    });

    // 3. Send the response back to the frontend
    res.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error("Check-in Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. GET: Live Queue (Demo Version - Shows ALL patients)
app.get('/api/hospital/:id/queue', async (req, res) => {
  try {
    // We fetch ALL sessions and sort by newest first
    const snapshot = await db.collection('patient_sessions')
      .orderBy('createdAt', 'desc')
      .limit(15)
      .get();
    
    let queue = [];
    snapshot.forEach(doc => {
      queue.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(queue);
  } catch (error) {
    console.error("Queue Fetch Error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));