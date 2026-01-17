const admin = require('firebase-admin');
const serviceAccount = require('./firebase.json');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const hospitals = [
  { name: "City Central Hospital", lat: 40.71, lng: -74.00, current_wait_mins: 120, specialties: ["trauma"] },
  { name: "Westside Urgent Care", lat: 40.73, lng: -74.05, current_wait_mins: 15, specialties: ["general"] },
  { name: "North Health Clinic", lat: 40.80, lng: -73.95, current_wait_mins: 45, specialties: ["pediatrics"] }
];

async function seed() {
  const batch = db.batch();
  hospitals.forEach(h => {
    const ref = db.collection('hospitals').doc();
    batch.set(ref, h);
  });
  await batch.commit();
  console.log("Hospitals seeded successfully!");
  process.exit();
}

seed();