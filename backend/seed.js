const admin = require('firebase-admin');
const serviceAccount = require('./firebase.json');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const hospitals = [
  { 
    name: "The Ottawa Hospital - Civic Campus", 
    address: "1053 Carling Ave, Ottawa",
    lat: 45.3925, 
    lng: -75.7225, 
    current_wait_mins: 185, 
    capacity_level: "High",
    specialties: ["Trauma", "Neurology", "General"] 
  },
  { 
    name: "The Ottawa Hospital - General Campus", 
    address: "501 Smyth Rd, Ottawa",
    lat: 45.4011, 
    lng: -75.6420, 
    current_wait_mins: 210, 
    capacity_level: "Critical",
    specialties: ["Cancer Care", "General", "Emergency"] 
  },
  { 
    name: "Queensway Carleton Hospital", 
    address: "3045 Baseline Rd, Nepean",
    lat: 45.3350, 
    lng: -75.8115, 
    current_wait_mins: 95, 
    capacity_level: "Moderate",
    specialties: ["Surgery", "General", "Orthopedics"] 
  },
  { 
    name: "Montfort Hospital", 
    address: "713 Montreal Rd, Ottawa",
    lat: 45.4450, 
    lng: -75.6395, 
    current_wait_mins: 55, 
    capacity_level: "Normal",
    specialties: ["Bilingual Services", "General", "Emergency"] 
  },
  { 
    name: "CHEO (Children's Hospital of Eastern Ontario)", 
    address: "401 Smyth Rd, Ottawa",
    lat: 45.4015, 
    lng: -75.6375, 
    current_wait_mins: 40, 
    capacity_level: "Normal",
    specialties: ["Pediatrics", "Neonatal"] 
  }
];

async function seed() {
  try {
    const batch = db.batch();
    
    // First, clear existing hospitals to avoid duplicates during testing
    const existingHospitals = await db.collection('hospitals').get();
    existingHospitals.forEach(doc => batch.delete(doc.ref));

    hospitals.forEach(h => {
      const ref = db.collection('hospitals').doc();
      batch.set(ref, h);
    });

    await batch.commit();
    console.log("✅ Ottawa Hospitals seeded successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    process.exit();
  }
}

seed();