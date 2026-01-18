import { useEffect, useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import WaitTimeDisplay from "@/components/WaitTimeDisplay";
import CheckInForm from "@/components/CheckInForm";
import Footer from "@/components/Footer";
import EmergencyDisclaimerModal, {
  STORAGE_KEY,
} from "@/components/EmergencyDisclaimer";

const Form = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  // 1. ADD STATE: To store the check-in results from the server
  const [checkInData, setCheckInData] = useState<{
    waitTime: number;
    patientsAhead: number;
  } | null>(null);

  useEffect(() => {
    let acknowledged = false;
    try {
      acknowledged = localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      // ignore storage access issues
    }
    if (!acknowledged) {
      setShowDisclaimer(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <EmergencyDisclaimerModal
        open={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
        rememberChoice
      />

      <Header />

      <main className="pt-24 pb-12">
        {/* 2. CONDITIONAL RENDERING: 
            If checkInData is null, show the form. 
            If checkInData has a value, show the results. */}
        {!checkInData ? (
          <CheckInForm onComplete={(data) => setCheckInData(data)} />
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center mb-8 px-4">
              <h1 className="text-4xl font-bold text-blue-600 mb-2">Check-in Confirmed</h1>
              <p className="text-slate-600">Please see your estimated wait details below.</p>
            </div>

            {/* 3. PASS PROPS: Send the real server data to the display component */}
            <WaitTimeDisplay 
              estimatedWait={checkInData.waitTime} 
              patientsAhead={checkInData.patientsAhead} 
            />

            <div className="mt-8 text-center">
              <button 
                onClick={() => setCheckInData(null)} 
                className="text-sm text-slate-500 hover:text-blue-600 transition-colors"
              >
                ← Back to check-in
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Form;