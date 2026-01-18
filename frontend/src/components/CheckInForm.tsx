import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch"; 

const SYMPTOMS_LIST = [
  "Head trauma",
  "High fever",
  "Chest pain",
  "Difficulty breathing",
  "Bodily pain",
] as const;

const SEVERITY_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);

type SymptomsMap = Record<string, number>;

type FormData = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;

  // keeping both sets so neither side loses fields:
  phone: string;
  email: string;

  address: string;
  heartrate: string;
  healthCardNumber: string;

  symptoms: SymptomsMap; // symptom -> severity
};

const CheckInForm = () => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [waitAtHome, setWaitAtHome] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    address: "",
    heartrate: "",
    healthCardNumber: "",
    symptoms: {},
  });

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      dob: formData.dateOfBirth,
      email: formData.email,
      address: formData.address,
      healthCard: formData.healthCardNumber,
      // We send a string of symptoms for the dashboard/email
      symptoms: Object.keys(formData.symptoms).join(", ") || "No symptoms listed",
      waitAtHome: waitAtHome,
      userLat: 45.4236, 
      userLng: -75.7009
    };

    const response = await fetch('http://localhost:5000/api/patient/check-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.success) {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Use optional chaining so it doesn't crash if recommendation is missing
      const hospital = result.recommendation?.hospitalName || "The Ottawa Hospital";
      
      toast({
        title: "Check-in successful!",
        description: `Your spot is reserved at ${hospital}`,
      });
    } else {
      throw new Error(result.error || "Server rejected check-in");
    }
  } catch (error) {
    console.error("Connection failed:", error);
    setIsSubmitting(false);
    toast({
      variant: "destructive",
      title: "Connection Error",
      description: "Could not reach the hospital server. Please try again.",
    });
  }
};

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSymptom = (symptom: string) => {
    setFormData((prev) => {
      const isChecked = Object.prototype.hasOwnProperty.call(prev.symptoms, symptom);

      if (isChecked) {
        const { [symptom]: _removed, ...rest } = prev.symptoms;
        return { ...prev, symptoms: rest };
      }

      return {
        ...prev,
        symptoms: { ...prev.symptoms, [symptom]: 1 },
      };
    });
  };

  const setSeverity = (symptom: string, severity: number) => {
    setFormData((prev) => ({
      ...prev,
      symptoms: { ...prev.symptoms, [symptom]: severity },
    }));
  };

if (isSubmitted) {
    return (
      <section className="py-12 px-4" id="check-in">
        <div className="container mx-auto max-w-2xl">
          <div className="rounded-2xl bg-card p-6 md:p-8 shadow-card text-center space-y-3 border-t-4 border-blue-500">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              You’re checked in ✅
            </h2>
            <p className="text-muted-foreground">
              {waitAtHome 
                ? "You've chosen to wait at home. Please monitor your email for your 'head to hospital' alert!" 
                : "We’ve received your info. Please take a seat in the waiting area."}
            </p>
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

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-card p-6 md:p-8 shadow-card space-y-6"
        >
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
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

          {/* Optional fields (keep or delete if you don’t want them) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="(555) 555-5555"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="heartrate">Heart Rate</Label>
              <Input
                id="heartrate"
                placeholder="e.g. 80"
                value={formData.heartrate}
                onChange={(e) => handleChange("heartrate", e.target.value)}
                className="h-12"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Check off any symptoms that warrant your visit to the ER:</Label>

            <div className="space-y-3 rounded-xl border p-4">
              {SYMPTOMS_LIST.map((symptom) => {
                const checked = Object.prototype.hasOwnProperty.call(
                  formData.symptoms,
                  symptom
                );
                const severity = formData.symptoms[symptom] ?? 1;

                return (
                  <div key={symptom} className="space-y-2">
                    <label className="flex items-center justify-between gap-4 cursor-pointer select-none">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="h-4 w-4"
                          checked={checked}
                          onChange={() => toggleSymptom(symptom)}
                        />
                        <span className="text-sm text-foreground">{symptom}</span>
                      </div>

                      {checked && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            Severity
                          </span>
                          <select
                            className="h-9 rounded-md border bg-background px-2 text-sm"
                            value={severity}
                            onChange={(e) =>
                              setSeverity(symptom, Number(e.target.value))
                            }
                          >
                            {SEVERITY_OPTIONS.map((n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
            <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-xl border border-blue-100 my-4">
              <div className="space-y-0.5">
                <Label className="text-blue-900 font-bold">Wait at Home?</Label>
                <p className="text-xs text-blue-700">Get notified via email when your turn is close.</p>
              </div>
              <Switch 
                checked={waitAtHome}
                onCheckedChange={setWaitAtHome}
              />
            </div>
          <Button type="submit" className="h-12 w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Check In"}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default CheckInForm;

