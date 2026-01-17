const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const serviceAccount = require('./firebase.json'); // Your private key file

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// --- THE SMART ALGORITHM ENDPOINT ---
app.post('/api/recommend-hospitals', async (req, res) => {
  try {
    const { userLat, userLng, severity } = req.body; 
    
    // 1. Fetch all hospitals from Firestore
    const snapshot = await db.collection('hospitals').get();
    let hospitals = [];
    snapshot.forEach(doc => hospitals.push({ id: doc.id, ...doc.data() }));

    // 2. Simple Mock Algorithm (Distance + Wait Time)
    const rankedHospitals = hospitals.map(h => {
        // Simple distance math (Pythagorean) for MVP
        const distance = Math.sqrt(
            Math.pow(h.lat - userLat, 2) + Math.pow(h.lng - userLng, 2)
        );
        
        // Scoring: Lower is better. 
        // We weight wait_time heavier for low severity cases.
        const waitWeight = severity === 'high' ? 0.2 : 1.0;
        const score = (distance * 10) + (h.current_wait_mins * waitWeight);

        return { ...h, score, distance: distance.toFixed(2) };
    }).sort((a, b) => a.score - b.score);

    res.json(rankedHospitals);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`QuickER Backend running on port ${PORT}`));