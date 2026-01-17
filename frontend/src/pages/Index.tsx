import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import WaitTimeDisplay from "@/components/WaitTimeDisplay";
import CheckInForm from "@/components/CheckInForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <CheckInForm />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
