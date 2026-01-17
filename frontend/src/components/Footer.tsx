import { Activity, MapPin, Phone, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12 px-4 mt-12">
      <div className="container mx-auto max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground">QuickER</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Making emergency care more accessible through virtual check-in technology.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>123 Medical Center Dr.</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Hours</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Emergency: 24/7</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-4" />
                <span>Virtual Check-in: 24/7</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} QuickER. All rights reserved.</p>
          <p className="mt-2">
            <span className="text-urgent font-medium">Emergency?</span> Call 911 immediately for life-threatening conditions.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
