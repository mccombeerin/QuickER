export const AVERAGE_MINS_CRITICAL = 25;
export const AVERAGE_MINS_EMERGENT = 18;
export const AVERAGE_MINS_URGENT = 12;
export const AVERAGE_MINS_NONURGENT = 8;
export const AVERAGE_MINS_MINOR_COMPLAINT = 6;

export const ACTIVE_SLOTS = 6; //number of doctors available to treat patients

const WEIGHTS = {
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

export function numTypePatient(patientType, queueTable, hospitalId, allowedStatuses = ["waiting", "queued"]) {
    return queueTable.filter((row) =>
        row.hospitalId === hospitalId &&
        row.urgencyCategory === patientType &&
        allowedStatuses.includes(row.status)
    ).length;
}

export function totalMinutesAhead(numCriticalPatients, numEmergentPatients, numUrgentPatients, numNonurgentPatients, NumMinorComplantPatients) {
    criticalMins = numCriticalPatients * AVERAGE_MINS_CRITICAL;
    emergentMins = numEmergentPatients * AVERAGE_MINS_EMERGENT;
    urgentMins = numUrgentPatients * AVERAGE_MINS_URGENT;
    nonurgentMins = numNonurgentPatients * AVERAGE_MINS_NONURGENT;
    minorComplaintMins = NumMinorComplantPatients * AVERAGE_MINS_MINOR_COMPLAINT;

    totalMinsAhead = criticalMins + emergentMins + urgentMins + nonurgentMins + minorComplaintMins;
    return totalMinsAhead;
}

export function estimatedWaitTime(totalMinsAhead, ACTIVE_SLOTS) {
    return totalMinsAhead/ACTIVE_SLOTS;
}

