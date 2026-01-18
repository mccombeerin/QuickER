import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const HospitalDashboard = () => {
  const [patients, setPatients] = useState([]);

  const fetchQueue = async () => {
    try {
      // 'any' works here because our backend GET route ignores the ID for the demo
      const response = await fetch("http://localhost:5000/api/hospital/any/queue");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000); // Auto-refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b pb-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-primary uppercase">
            Live Triage Portal
          </h1>
          <p className="text-muted-foreground mt-1 font-medium text-lg">
            Ottawa General Hospital • Emergency Department
          </p>
        </div>
        <Badge variant="outline" className="animate-pulse bg-green-50 text-green-700 border-green-200 px-3 py-1 font-bold">
          ● Live Sync Active
        </Badge>
      </div>

      <div className="rounded-xl border shadow-2xl overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-slate-50 border-b">
            <TableRow>
              <TableHead className="font-bold text-slate-900 py-4">Patient Name</TableHead>
              <TableHead className="font-bold text-slate-900 py-4">Symptoms / Conditions</TableHead>
              <TableHead className="font-bold text-slate-900 py-4">Priority Status</TableHead>
              <TableHead className="font-bold text-slate-900 py-4 text-right">Check-in Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.length > 0 ? (
              patients.map((patient) => {
                // Logic to highlight critical cases
                const symptoms = (patient.symptoms || "").toLowerCase();
                const isCritical = symptoms.includes('chest') || 
                                   symptoms.includes('breath') || 
                                   symptoms.includes('heart');

                return (
                  <TableRow key={patient.id} className="hover:bg-slate-50/80 transition-colors border-b">
                    <TableCell className="font-bold text-lg text-slate-800 py-4">
                      {patient.firstName} {patient.lastName}
                    </TableCell>
                    
                    <TableCell className="max-w-md text-slate-600 font-medium py-4 italic">
                      "{patient.symptoms || "No symptoms listed"}"
                    </TableCell>
                    
                    <TableCell className="py-4">
                      <Badge 
                        className={`font-black px-4 py-1 uppercase tracking-wider ${
                          isCritical 
                          ? "bg-red-600 animate-bounce text-white shadow-md" 
                          : "bg-blue-600 text-white"
                        }`}
                      >
                        {isCritical ? "Critical" : (patient.status || 'En-Route')}
                      </Badge>
                    </TableCell>
                    
                    <TableCell className="text-right text-slate-500 font-mono font-bold py-4">
                      {patient.createdAt?._seconds 
                        ? new Date(patient.createdAt._seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                        : 'New'}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-24 text-muted-foreground italic">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-lg">Waiting for incoming triage data...</p>
                  </div>
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