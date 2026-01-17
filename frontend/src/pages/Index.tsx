import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import WaitTimeDisplay from "@/components/WaitTimeDisplay";
import CheckInForm from "@/components/CheckInForm";
import Footer from "@/components/Footer";
import EmergencyDisclaimerModal, {
  STORAGE_KEY,
} from "@/components/EmergencyDisclaimer";

const Index = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const navigate = useNavigate();

useEffect(() => {
  const acknowledged = sessionStorage.getItem(STORAGE_KEY) === "true";
  if (!acknowledged) setShowDisclaimer(true);
}, []);


  return (
    <div className="min-h-screen bg-background">
      <EmergencyDisclaimerModal
        open={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
        rememberChoice
      />

      <Header />

      <main>
        <HeroSection />

        {/* Get Started Button */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => navigate("/Form")}
            className="px-12 py-5 text-lg font-semibold rounded-2xl
                       bg-primary text-primary-foreground
                       hover:opacity-95 transition
                       shadow-soft"
          >
            Get Started
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
