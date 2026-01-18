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
app.post('/api/patient/check-in', async (req, res) => {
  console.log("-----------------------");
  console.log("🚀 HIT CHECK-IN ROUTE");

try {
  const { firstName, lastName, dob, email, symptoms, healthCard, waitAtHome, address } = req.body;
  const hospitalId = "ottawa-general"; 
  const HOSPITAL_ADDRESS = "The Ottawa Hospital - Civic Campus, Ottawa, ON";

  // 1. Create the Dynamic Link
  // If address exists, it creates a "Point A to Point B" route
  // If address is missing, it just pins the Hospital
  const origin = address ? encodeURIComponent(address) : "";
  const destination = encodeURIComponent(HOSPITAL_ADDRESS);

  const googleMapsUrl = origin 
    ? `https://www.google.com/search?q=https://www.google.com/maps/dir/%3Fapi%3D11{origin}&destination=${destination}&travelmode=driving`
    : `https://www.google.com/maps/dir/?api=14{destination}`;

    // 1. Calculate Triage Category
    const symptomScore = triageAlgorithms.calculateSymptomScore(symptoms);
    const urgencyCategory = triageAlgorithms.categoryFromWeightedAverage(symptomScore);
    
    // 2. Fetch current queue 
    const snapshot = await db.collection('patient_sessions').get();
    const currentQueue = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        urgencyCategory: Number(data.urgencyCategory) || 5, 
        checkInTime: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        hospitalId: data.hospitalId || hospitalId 
      };
    });

    // 3. Run Wait-Time Algorithms
    const nowISO = new Date().toISOString();
    let patientsAhead = triageAlgorithms.numPatientsAhead(urgencyCategory, nowISO, currentQueue, hospitalId) || 0;
    let totalMinsAhead = triageAlgorithms.minutesAhead(urgencyCategory, nowISO, currentQueue, hospitalId) || 0;
    let waitTime = Math.round(triageAlgorithms.estimatedWaitTime(totalMinsAhead));

    if (!waitTime || waitTime < 10) { waitTime = 10; }

    // 4. Save Patient
    const patientData = {
      firstName: firstName || "Unknown",
      lastName: lastName || "Patient",
      dob: dob || "",
      email: email || "",
      symptoms: typeof symptoms === 'object' 
        ? Object.entries(symptoms).map(([name, sev]) => `${name} (Level ${sev})`).join(", ")
        : symptoms,
      healthCard: healthCard || "",
      waitAtHome: waitAtHome || false,
      status: waitAtHome ? 'Waiting at Home' : 'In Waiting Room',
      urgencyCategory: urgencyCategory || 5,
      hospitalId: hospitalId,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('patient_sessions').add(patientData);

    // 5. Email with FIX for the Link
    const mailOptions = {
    from: '"QuickER Ottawa" <yasmin31.mahdi@gmail.com>',
    to: email,
    subject: `Confirmed: ${waitTime} min wait at QuickER`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #ddd; padding: 20px; border-radius: 12px; color: #333;">
        <h2 style="color: #2563eb;">Check-in Successful</h2>
        <p>Hello <strong>${firstName}</strong>,</p>
        
        <div style="background: #f0f7ff; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #cce3ff; text-align: center;">
          <p style="margin: 0; color: #1e40af; font-size: 13px; font-weight: bold; text-transform: uppercase;">Estimated Wait</p>
          <h1 style="margin: 5px 0; color: #1e3a8a; font-size: 48px;">${waitTime} <span style="font-size: 20px;">mins</span></h1>
        </div>

        <div style="text-align: center; margin: 25px 0;">
          <a href="${googleMapsUrl}" style="background-color: #2563eb; color: white; padding: 14px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Get Directions from Your Location
          </a>
          <p style="font-size: 11px; color: #666; margin-top: 10px;">
            Starting from: ${address || "Current Location"}
          </p>
        </div>

        <div style="background: #fffbeb; border: 1px solid #fef3c7; padding: 15px; border-radius: 8px;">
           <p style="margin:0; color: #92400e;"><strong>Travel Tip:</strong> Google Maps shows a ${waitTime}-minute drive. Please leave when your wait time matches your commute!</p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${email} with directions link.`);

    return res.json({ 
      success: true, 
      id: docRef.id,
      waitTime: waitTime,
      patientsAhead: patientsAhead
    });

  } catch (error) {
    console.error("❌ Check-in Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. GET: Live Queue for Dashboard
app.get('/api/hospital/:id/queue', async (req, res) => {
  console.log(`🔍 FETCHING QUEUE FOR: ${req.params.id}`);
  
  try {
    const snapshot = await db.collection('patient_sessions')
      .orderBy('createdAt', 'desc') 
      .get();
    
    const queue = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        firstName: data.firstName || "Unknown",
        lastName: data.lastName || "",
        symptoms: data.symptoms || "No symptoms",
        status: data.status || "Waiting",
        waitAtHome: data.waitAtHome || false,
        urgencyCategory: data.urgencyCategory || 5,
        createdAt: data.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || "Just now"
      };
    });

    console.log(`✅ Sent ${queue.length} patients to Dashboard.`);
    res.json(queue); 
    
  } catch (error) {
    console.error("❌ Dashboard Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch queue" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));