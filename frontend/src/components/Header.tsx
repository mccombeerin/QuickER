import { Activity, Phone } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center shadow-button">
            <Activity className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl text-foreground">QuickER</span>
        </div>
        
        <div className="flex items-center gap-4">
          <a 
            href="tel:911" 
            className="flex items-center gap-2 text-urgent font-semibold hover:opacity-80 transition-opacity"
          >
            <Phone className="w-7 h-7" />
            <span className="hidden sm:inline">Call 911 for Life-Threatening Conditions</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
