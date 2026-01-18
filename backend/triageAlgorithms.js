const AVERAGE_MINS_CRITICAL = 25;
const AVERAGE_MINS_EMERGENT = 18;
const AVERAGE_MINS_URGENT = 12;
const AVERAGE_MINS_NONURGENT = 8;
const AVERAGE_MINS_MINOR_COMPLAINT = 6;

const ACTIVE_SLOTS = 6; //number of doctors available to treat patients

WEIGHTS = {
    headTrauma: 5,
    highFever: 3,
    chestPain: 5,
    difficultyBreathing: 5,
    bodilyPain: 1,
    };

function calculateSymptomScore(symptoms) {
    let weightedSum = 0;
    let totalWeight = 0;

    for (const [symptom, severity] of Object.entries(symptoms)) {
        const weight = WEIGHTS[symptom];

        if (weight === undefined) continue; // safety check

        weightedSum += severity * weight;
        totalWeight += weight;
    }

    // No symptoms selected
    if (totalWeight === 0) {
        return 0;
    }

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
    createdAt, // ISO string
    queueTable,
    hospitalId,
    allowedStatuses = ["waiting", "queued"]
    ) {
    const userTime = Date.parse(createdAt); // ISO → ms

    return queueTable.filter((row) =>
        row.hospitalId === hospitalId &&
        allowedStatuses.includes(row.status) &&
        Date.parse(row.checkInTime) < userTime &&
        Number(row.urgencyCategory) <= Number(userUrgency)
    ).length;
}

function minutesAhead(
    userUrgency,
    createdAt, // ISO string
    queueTable,
    hospitalId,
    allowedStatuses = ["waiting", "queued"]
    ) {
    const userTime = Date.parse(createdAt);

    const rowsAhead = queueTable.filter((row) =>
        row.hospitalId === hospitalId &&
        allowedStatuses.includes(row.status) &&
        Date.parse(row.checkInTime) < userTime &&
        Number(row.urgencyCategory) <= Number(userUrgency)
    );

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
    return totalMinsAhead/activeSlots;
}

