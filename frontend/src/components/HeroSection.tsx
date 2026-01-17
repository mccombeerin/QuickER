import { Clock, Users, Shield } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse-soft" />
          Now accepting virtual check-ins
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
          Skip the waiting room.
          <br />
          <span className="text-primary">Check in from anywhere.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Start your ER visit before you arrive. Complete your check-in online and get updates on your estimated wait time.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-card shadow-soft">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-foreground">Save Time</p>
              <p className="text-sm text-muted-foreground">Skip paperwork</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 rounded-xl bg-card shadow-soft">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-foreground">Real-time Updates</p>
              <p className="text-sm text-muted-foreground">Know your wait</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 rounded-xl bg-card shadow-soft">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-foreground">Secure & Private</p>
              <p className="text-sm text-muted-foreground">HIPAA compliant</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
