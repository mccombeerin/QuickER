const triageAlgorithms = require('./triageAlgorithms.js');
const express = require('express');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. Firebase Admin Setup
const serviceAccount = require('./firebase.json');
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
    pass: process.env.EMAIL_PASS 
  },
  tls: { rejectUnauthorized: false }
});

// 3. POST: Patient Check-in
// 3. POST: Patient Check-in
app.post('/api/patient/check-in', async (req, res) => {
  console.log("-----------------------");
  console.log("🚀 HIT CHECK-IN ROUTE");

  try {
    const { firstName, lastName, dob, email, symptoms, healthCard, waitAtHome } = req.body;

    const patientData = {
      firstName: firstName || "Unknown",
      lastName: lastName || "Patient",
      dob: dob || "",
      email: email || "",
      symptoms: symptoms || "No symptoms provided",
      healthCard: healthCard || "",
      waitAtHome: waitAtHome || false,
      status: waitAtHome ? 'Waiting at Home' : 'In Waiting Room',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // 1. Save to Firestore
    const docRef = await db.collection('patient_sessions').add(patientData);
    console.log("✅ Patient Saved with ID:", docRef.id);

    // 2. Run Triage (Demo Logic)
    try {
        const symptomScore = triageAlgorithms.calculateSymptomScore(symptoms);
        const urgencyCategory = triageAlgorithms.categoryFromWeightedAverage(symptomScore);
        await db.collection('hospital_queues').add({
          userId: docRef.id,
          urgencyCategory,
          status: "waiting",
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log("⚖️ Triage Score:", urgencyCategory);
    } catch (algoErr) {
        console.log("⚠️ Triage algorithm step skipped");
    }

    // 3. Prepare Email
    const mailOptions = {
      from: '"QuickER Ottawa" <yasmin31.mahdi@gmail.com>',
      to: email,
      subject: waitAtHome ? `Home-Wait Confirmed: QuickER` : `Check-in Confirmed: QuickER`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #ddd; padding: 20px;">
          <h2 style="color: #2563eb;">Check-in Successful</h2>
          <p>Hello ${firstName},</p>
          ${waitAtHome 
            ? `<p><strong>You are waiting at home.</strong> We will alert you when a bed is ready.</p>` 
            : `<p>Please wait in the hospital lobby.</p>`}
        </div>
      `
    };

    // 4. Send Email in background (don't make user wait for it)
    transporter.sendMail(mailOptions).catch(err => console.error("📧 Email failed:", err));

    // 5. SEND FINAL RESPONSE (Only do this ONCE)
    return res.json({ 
      success: true, 
      id: docRef.id,
      recommendation: { hospitalName: "The Ottawa Hospital - General Campus" } 
    });

  } catch (error) {
    console.error("❌ Check-in Error:", error);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
});

// 4. GET: Live Queue
app.get('/api/hospital/:id/queue', async (req, res) => {
  const hospitalId = req.params.id;
  console.log(`Hospital ID requested: ${hospitalId}`);

  try {
    const snapshot = await db.collection('patient_sessions')
      .orderBy('createdAt', 'desc')
      .limit(15)
      .get();
    
    let queue = [];
    snapshot.forEach(doc => {
      queue.push({ id: doc.id, ...doc.data() });
    });
    
    // Always return an array, even if empty
    res.json(queue);
  } catch (error) {
    console.error("Queue Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch queue" });
  }
});

// Ensure this route is at the bottom of server.js (before app.listen)
app.get('/api/hospital/:id/queue', async (req, res) => {
  try {
    const snapshot = await db.collection('patient_sessions')
      .orderBy('createdAt', 'desc')
      .limit(15)
      .get();
    
    const queue = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        // Mapping potential mismatches:
        firstName: data.firstName || data.patientName?.split(' ')[0] || "Unknown",
        lastName: data.lastName || data.patientName?.split(' ')[1] || "Patient",
        symptoms: data.symptoms || data.condition || "Not listed",
        status: data.status || data.urgency || "Waiting",
        createdAt: data.createdAt || null
      };
    });
    
    res.json(queue);
  } catch (error) {
    console.error("Queue Fetch Error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));