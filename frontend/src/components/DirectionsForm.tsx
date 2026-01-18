import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const HOSPITAL_DESTINATION = "The Ottawa Hospital - Civic Campus, Ottawa, ON";

const DirectionsForm = () => {
  const { toast } = useToast();
  const [address, setAddress] = useState("");
  const [isOpening, setIsOpening] = useState(false);

  // FIX: Using the official Google Maps Embed URL structure
  const mapSrc = useMemo(() => {
    const query = address.trim() ? `${address.trim()}, ${HOSPITAL_DESTINATION}` : HOSPITAL_DESTINATION;
    // This is the standard "view" mode URL
    return `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY_HERE&q=${encodeURIComponent(query)}`;
    
    // NOTE: If you truly have NO API KEY, use this "search" fallback instead:
    // return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
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

    // FIX: Standard Google Maps Directions URL
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(trimmed)}&destination=${encodeURIComponent(HOSPITAL_DESTINATION)}&travelmode=driving`;

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
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Get Directions</h2>
          <p className="text-muted-foreground">Enter your address to see the route to the Civic Campus.</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl bg-card p-6 md:p-8 shadow-lg border space-y-6 bg-white">
          <div className="space-y-2">
            <Label htmlFor="address">Your starting address</Label>
            <Input
              id="address"
              placeholder="e.g. 100 Laurier Ave W, Ottawa, ON"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="h-12"
            />
          </div>

          <div className="rounded-2xl bg-slate-50 p-3 md:p-4 border">
            <div className="text-sm font-semibold text-foreground mb-2">Map Preview</div>
            <iframe
              title="Map preview"
              className="w-full h-[300px] rounded-xl border bg-white"
              loading="lazy"
              src={mapSrc.includes("YOUR_GOOGLE_MAPS_API_KEY") 
                ? `https://maps.google.com/maps?q=${encodeURIComponent(address || HOSPITAL_DESTINATION)}&output=embed` 
                : mapSrc}
            />
          </div>

          <Button type="submit" className="h-12 w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isOpening}>
            {isOpening ? "Opening..." : "Get directions & ETA"}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default DirectionsForm;