import { useEffect, useState } from "react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EmergencyDisclaimerModal, { STORAGE_KEY } from "@/components/EmergencyDisclaimer";

const SURVEYMONKEY_SRC =
  "https://widget.surveymonkey.com/collect/website/js/tRaiETqnLgj758hTBazgdw_2BaTULZu7wJhT5NAfLeM2cEy_2B6av6yujJTlHYYB_2FKas.js";

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

  useEffect(() => {
  if (document.getElementById("smcx-sdk")) return;

  (window as any).SMCX = (window as any).SMCX || [];

  const container = document.getElementById("smcx-container");
  if (!container) return;

  const script = document.createElement("script");
  script.id = "smcx-sdk";
  script.type = "text/javascript";
  script.async = true;
  script.src = SURVEYMONKEY_SRC;

  container.appendChild(script);

  return () => {
    script.remove();
  };
}, []);


  return (
    <div className="min-h-screen bg-background">
      <EmergencyDisclaimerModal
        open={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
        rememberChoice
      />

      <Header />

      <main className="pt-24">
        {/* Widget mounts into the page when the script loads */}
        <div id="smcx-container" />
      </main>

      <Footer />
    </div>
  );
};

export default Form;
