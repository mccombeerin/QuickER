import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import WaitTimeDisplay from "@/components/WaitTimeDisplay";
import DirectionsForm from "@/components/DirectionsForm";
import Footer from "@/components/Footer";

const Wait = () => {

  const navigate = useNavigate();


  return (
    <div className="min-h-screen bg-background">

      <Header />

      <main className = "pt-24">
        <WaitTimeDisplay />
        <DirectionsForm />
      </main>

      <Footer />
    </div>
  );
};

export default Wait;
