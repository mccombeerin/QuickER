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

      <main className = "pt-24">
        <CheckInForm />
      </main>

      <Footer />
    </div>
  );
};

export default Form;