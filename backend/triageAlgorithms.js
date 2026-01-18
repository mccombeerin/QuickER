// Change ACTIVE_SLOTS to 1 so 1 patient = 1 full wait block
const ACTIVE_SLOTS = 1; 

// Increase these slightly so the impact of a patient is visible
const AVERAGE_MINS_CRITICAL = 40;     // Cat 1
const AVERAGE_MINS_EMERGENT = 30;     // Cat 2
const AVERAGE_MINS_URGENT = 20;       // Cat 3
const AVERAGE_MINS_NONURGENT = 15;     // Cat 4
const AVERAGE_MINS_MINOR_COMPLAINT = 10; // Cat 5

const WEIGHTS = {
    "Head trauma": 5,
    "High fever": 3,
    "Chest pain": 5,
    "Difficulty breathing": 5,
    "Bodily pain": 1,
};

function calculateSymptomScore(symptoms) {
    if (!symptoms || typeof symptoms !== 'object') return 0;
    
    let weightedSum = 0;
    let totalWeight = 0;

    for (const [symptom, severity] of Object.entries(symptoms)) {
        const weight = WEIGHTS[symptom];
        if (weight === undefined) continue; 

        weightedSum += severity * weight;
        totalWeight += weight;
    }

    if (totalWeight === 0) return 0;
    return weightedSum / totalWeight;
}

function categoryFromWeightedAverage(avg) {
    if (avg >= 8.0) return 1;
    if (avg >= 6.5) return 2;
    if (avg >= 5.0) return 3;
    if (avg >= 3.5) return 4;
    return 5;
}

function numPatientsAhead(
    userUrgency,
    createdAt, 
    queueTable,
    hospitalId,
    allowedStatuses = ["Waiting at Home", "In Waiting Room", "waiting", "queued"]
) {
    const userTime = Date.parse(createdAt);

    return queueTable.filter((row) => {
        const rowTime = Date.parse(row.checkInTime);
        const rowUrgency = Number(row.urgencyCategory);
        const currentUserUrgency = Number(userUrgency);

        return (
            row.hospitalId === hospitalId &&
            allowedStatuses.includes(row.status) &&
            // A person is ahead if:
            (
                rowUrgency < currentUserUrgency || // 1. They are more urgent (1 < 3)
                (rowUrgency === currentUserUrgency && rowTime < userTime) // 2. Same urgency, but arrived first
            )
        );
    }).length;
}

function minutesAhead(
    userUrgency,
    createdAt,
    queueTable,
    hospitalId,
    allowedStatuses = ["Waiting at Home", "In Waiting Room", "waiting", "queued"]
) {
    const userTime = Date.parse(createdAt);

    const rowsAhead = queueTable.filter((row) => {
        const rowTime = Date.parse(row.checkInTime);
        const rowUrgency = Number(row.urgencyCategory);
        const currentUserUrgency = Number(userUrgency);

        return (
            row.hospitalId === hospitalId &&
            allowedStatuses.includes(row.status) &&
            (
                rowUrgency < currentUserUrgency || 
                (rowUrgency === currentUserUrgency && rowTime < userTime)
            )
        );
    });

    const minsByCategory = {
        1: AVERAGE_MINS_CRITICAL,
        2: AVERAGE_MINS_EMERGENT,
        3: AVERAGE_MINS_URGENT,
        4: AVERAGE_MINS_NONURGENT,
        5: AVERAGE_MINS_MINOR_COMPLAINT
    };

    return rowsAhead.reduce((sum, row) => {
        const perPatient = minsByCategory[Number(row.urgencyCategory)] ?? 0;
        return sum + perPatient;
    }, 0);
}

function estimatedWaitTime(totalMinsAhead, activeSlots = ACTIVE_SLOTS) {
    // Prevent division by zero
    const slots = activeSlots > 0 ? activeSlots : 1;
    return totalMinsAhead / slots;
}

// THE MISSING PIECE:
module.exports = {
    calculateSymptomScore,
    categoryFromWeightedAverage,
    numPatientsAhead,
    minutesAhead,
    estimatedWaitTime
};