import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const HospitalDashboard = () => {
  const [patients, setPatients] = useState([]);

  const fetchQueue = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/hospital/ottawa-general/queue");
      const data = await response.json();
      setPatients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, []);

  // Helper to safely render symptoms (prevents Object crash)
  const formatSymptoms = (symptoms: any) => {
    if (typeof symptoms === "string") return symptoms;
    if (typeof symptoms === "object" && symptoms !== null) {
      return Object.entries(symptoms)
        .map(([key, val]) => `${key}: ${val}`)
        .join(", ");
    }
    return "No symptoms listed";
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Live ER Triage Queue</h1>
        <Badge variant="outline" className="animate-pulse bg-green-100 text-green-700 border-green-200">
          Live Updates Active
        </Badge>
      </div>

      <div className="rounded-md border shadow-sm bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-bold">Patient Name</TableHead>
              <TableHead className="font-bold">Symptom Summary</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="text-right font-bold">Check-in Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
  {patients.length > 0 ? (
    patients.map((patient, index) => {
      // 1. Calculate critical status for this specific patient
      const symptomText = formatSymptoms(patient.symptoms);
      const isCritical = /chest|breath|heart|trauma/i.test(symptomText);

      return (
        // 2. Add a red background if critical
        <TableRow key={patient.id || index} className={isCritical ? "bg-red-50/50" : ""}>
          <TableCell className="font-medium">
            {patient.firstName || "Unknown"} {patient.lastName || ""}
          </TableCell>
          <TableCell className="italic text-slate-600">
            {symptomText}
          </TableCell>
          <TableCell>
            {/* 3. Change Badge color and add pulse animation if critical */}
            <Badge 
              className={`
                ${isCritical ? "bg-red-600 animate-pulse" : (patient.waitAtHome ? "bg-amber-500" : "bg-blue-500")}
                text-white
              `}
            >
              {isCritical ? "CRITICAL" : (patient.status || 'En-Route')}
            </Badge>
          </TableCell>
          <TableCell className="text-right font-mono">
            {patient.createdAt?._seconds 
              ? new Date(patient.createdAt._seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
              : 'Just now'}
          </TableCell>
        </TableRow>
      );
    })
  ) : (
    <TableRow>
      <TableCell colSpan={4} className="text-center py-20 text-slate-400">
        No patients currently in the queue.
      </TableCell>
    </TableRow>
  )}
</TableBody>
        </Table>
      </div>
    </div>
  );
};

export default HospitalDashboard;