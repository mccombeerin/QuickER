import { Clock, Users } from "lucide-react";

const WaitTimeDisplay = () => {
  // In a real app, this would come from an API
  const estimatedWait = 25;
  const patientsAhead = 4;
  
  return (
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="rounded-2xl gradient-hero p-6 md:p-8 shadow-card">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-xl font-semibold text-primary-foreground mb-2">
                Current Wait Time
              </h2>
              <p className="text-primary-foreground/80 text-sm">
                Central Emergency Department
              </p>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-5 h-5 text-primary-foreground/80" />
                  <span className="text-4xl font-bold text-primary-foreground">
                    {estimatedWait}
                  </span>
                  <span className="text-lg text-primary-foreground/80">min</span>
                </div>
                <p className="text-sm text-primary-foreground/70">Est. wait time</p>
              </div>
              
              <div className="w-px h-16 bg-primary-foreground/20" />
              
              <div className="text-center">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-5 h-5 text-primary-foreground/80" />
                  <span className="text-4xl font-bold text-primary-foreground">
                    {patientsAhead}
                  </span>
                </div>
                <p className="text-sm text-primary-foreground/70">Patients ahead</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WaitTimeDisplay;
