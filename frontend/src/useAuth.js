// src/hooks/useAuth.js
import { useState, useEffect } from "react";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { app } from "../firebaseConfig"; // Import your initialized firebase app

const auth = getAuth(app);

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for session changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
      } else {
        // No user? Sign them in quietly in the background
        try {
          const userCredential = await signInAnonymously(auth);
          setUser(userCredential.user);
        } catch (error) {
          console.error("Anonymous Auth Error:", error);
        } finally {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
};