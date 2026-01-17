


/*

export const AVERAGE_MINS_CRITICAL = 25;
export const AVERAGE_MINS_EMERGENT = 18;
export const AVERAGE_MINS_URGENT = 12;
export const AVERAGE_MINS_NONURGENT = 8;
export const AVERAGE_MINS_MINOR_COMPLAINT = 6;

export const ACTIVE_SLOTS = 6;

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

*/