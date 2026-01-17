import { useEffect } from "react";
import { getAuth, signInAnonymously } from "firebase/auth";
import { app } from "src/lib/firebase";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const auth = getAuth(app);
    signInAnonymously(auth)
      .then(() => console.log("✅ Anonymous Session Active"))
      .catch((err) => console.error("❌ Auth Error:", err));
  }, []);

  return <>{children}</>;
};