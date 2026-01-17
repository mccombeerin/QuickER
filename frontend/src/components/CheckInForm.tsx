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

  const SYMPTOMS_LIST = [
    "Head trauma",
    "High fever",
    "Chest pain",
    "Difficulty breathing",
    "Bodily pain",
  ] as const;

  const SEVERITY_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phone: "",
    symptoms: {} as Record<string, number>, // ✅ symptom -> severity
    heartrate: "",
    address: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Optional: require at least one symptom selected
    // if (Object.keys(formData.symptoms).length === 0) {
    //   setIsSubmitting(false);
    //   toast({ title: "Please select at least one symptom." });
    //   return;
    // }

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    toast({
      title: "Check-in successful!",
      description: "You'll receive updates via SMS.",
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSymptom = (symptom: string) => {
    setFormData((prev) => {
      const isChecked = Object.prototype.hasOwnProperty.call(prev.symptoms, symptom);

      // uncheck -> remove it
      if (isChecked) {
        const { [symptom]: _, ...rest } = prev.symptoms;
        return { ...prev, symptoms: rest };
      }

      // check -> add with default severity
      return {
        ...prev,
        symptoms: { ...prev.symptoms, [symptom]: 1 }, // default = 1 (change to 5 if you want)
      };
    });
  };

  const setSeverity = (symptom: string, severity: number) => {
    setFormData((prev) => ({
      ...prev,
      symptoms: { ...prev.symptoms, [symptom]: severity },
    }));
  };

  // ... keep your isSubmitted return block exactly the same ...

  return (
    <section className="py-12 px-4" id="check-in">
      <div className="container mx-auto max-w-2xl">
        {/* ... keep the rest of your form exactly the same above ... */}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-card p-6 md:p-8 shadow-card space-y-6"
        >
          {/* ... your existing fields ... */}

          {/* ✅ Symptoms + severity dropdowns */}
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

                      {/* Dropdown appears only when checked */}
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

            {/* Optional: show what was selected */}
            {/* <pre className="text-xs text-muted-foreground">
              {JSON.stringify(formData.symptoms, null, 2)}
            </pre> */}
          </div>

          {/* ... your submit button and footer ... */}
        </form>
      </div>
    </section>
  );
};


export default CheckInForm;
