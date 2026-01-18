import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Set this to your hospital destination
const HOSPITAL_DESTINATION = "The Ottawa Hospital - Civic Campus, Ottawa, ON";

const DirectionsForm = () => {
  const { toast } = useToast();
  const [address, setAddress] = useState("");
  const [isOpening, setIsOpening] = useState(false);

  // No-key embedded map preview (updates as they type)
  const mapSrc = useMemo(() => {
    const query = address.trim() ? address.trim() : HOSPITAL_DESTINATION;
    return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  }, [address]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = address.trim();
    if (!trimmed) {
      toast({
        title: "Enter an address",
        description: "Please type your starting address to get directions.",
        variant: "destructive",
      });
      return;
    }

    setIsOpening(true);

    const mapsUrl =
      "https://www.google.com/maps/dir/?api=1" +
      `&origin=${encodeURIComponent(trimmed)}` +
      `&destination=${encodeURIComponent(HOSPITAL_DESTINATION)}` +
      "&travelmode=driving";

    // Directions + ETA will show in Google Maps (new tab)
    window.open(mapsUrl, "_blank", "noopener,noreferrer");

    toast({
      title: "Opening directions",
      description: "Google Maps will open in a new tab with ETA and routes.",
    });

    setIsOpening(false);
  };

  return (
    <section className="py-12 px-4" id="directions">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Get Directions
          </h2>
          <p className="text-muted-foreground">
            Enter your address to preview the map and open directions with ETA.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-card p-6 md:p-8 shadow-card space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="address">Your address</Label>
            <Input
              id="address"
              placeholder="123 Street, Ottawa ON"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="h-12"
              autoComplete="street-address"
            />
          </div>

          <div className="rounded-2xl bg-muted/20 p-3 md:p-4">
            <div className="text-sm font-semibold text-foreground mb-2">
              Map preview
            </div>
            <iframe
              title="Map preview"
              className="w-full h-[380px] rounded-xl border bg-background"
              loading="lazy"
              src={mapSrc}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Preview only. Directions and ETA open in Google Maps.
            </p>
          </div>

          <Button type="submit" className="h-12 w-full" disabled={isOpening}>
            {isOpening ? "Opening..." : "Get directions & ETA"}
          </Button>

          <p className="text-xs text-muted-foreground">
            If this is a life-threatening emergency, call emergency services.
          </p>
        </form>
      </div>
    </section>
  );
};

export default DirectionsForm;
