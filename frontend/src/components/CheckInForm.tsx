import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";



const CheckInForm = () => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    symptoms: "",
    heartrate: "",
    address: "",
    healthCardNumber: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    toast({
      title: "Check-in successful!",
      description: "You'll receive updates via SMS.",
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <section className="py-12 px-4" id="check-in">
        <div className="container mx-auto max-w-2xl">
          <div className="rounded-2xl bg-card p-8 md:p-12 shadow-card text-center">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              You're Checked In!
            </h2>
            <p className="text-muted-foreground mb-6">
              Your estimated wait time is approximately <span className="font-semibold text-foreground">25 minutes</span>.
              We'll send updates to your phone.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium">
              Queue Position: #5
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4" id="check-in">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Virtual Check-In
          </h2>
          <p className="text-muted-foreground">
            Complete this form to secure your place in line
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="rounded-2xl bg-card p-6 md:p-8 shadow-card space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                required
                className="h-12"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstName">Address</Label>
              <Input
                id="address"
                placeholder="123 Street, Ottawa ON"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="healthCardNumber">Health Card Number</Label>
              <Input
                id="healthCardNumber"
                placeholder="9999-999-999-XX"
                value={formData.healthCardNumber}
                onChange={(e) => handleChange("healthCardNumber", e.target.value)}
                required
                className="h-12"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="symptoms">Describe Your Symptoms</Label>
            <Textarea
              id="symptoms"
              placeholder="Please describe what brought you to the ER today..."
              value={formData.symptoms}
              onChange={(e) => handleChange("symptoms", e.target.value)}
              required
              className="min-h-[100px] resize-none"
            />
          </div>
          
          <div className="pt-4">
            <Button
              type="submit"
              size="lg"
              className="w-full h-14 text-base font-semibold shadow-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Complete Check-In
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center">
            By checking in, you agree to our privacy policy. Your information is protected under HIPAA regulations.
          </p>
        </form>
      </div>
    </section>
  );
};

export default CheckInForm;
