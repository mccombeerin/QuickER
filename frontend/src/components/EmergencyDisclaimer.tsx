import { useEffect } from "react";
import { X, ShieldAlert } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  /** If true, hides future popups after user closes it once */
  rememberChoice?: boolean;
};

const STORAGE_KEY = "emergency_disclaimer_ack_v1";

export default function EmergencyDisclaimerModal({
  open,
  onClose,
  rememberChoice = true,
}: Props) {
  // Close on Escape
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleClose = () => {
    if (rememberChoice) {
      try {
        localStorage.setItem(STORAGE_KEY, "true");
      } catch {
        // ignore (private mode / blocked storage)
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <button
        aria-label="Close disclaimer"
        onClick={handleClose}
        className="absolute inset-0 bg-black/50"
      />

      {/* Modal */}
      <div className="relative z-10 w-[min(92vw,520px)] rounded-2xl bg-card shadow-soft border border-border p-6">
        {/* X button */}

        <div className="flex items-start gap-3">
          <div className="mt-1 rounded-xl bg-accent p-2">
            <ShieldAlert className="h-6 w-6 text-primary" />
          </div>

          <div className="text-left">
            <h2 className="text-lg font-semibold text-foreground">
              Emergency Notice
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              If this is an immediate or life-threatening emergency, call{" "}
              <span className="font-semibold text-foreground">911</span>{" "}
              right now. This tool is for virtual check-in and wait-time updates
              only.
            </p>

            <div className="mt-5 flex gap-3">
              <button
                onClick={handleClose}
                className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-primary-foreground font-medium hover:opacity-95"
              >
                Continue
              </button>

              <a
                href="tel:911"
                className="inline-flex items-center justify-center rounded-xl border border-border px-4 py-2 font-medium hover:bg-accent"
              >
                Call 911
              </a>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              Press Esc to close.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export { STORAGE_KEY };
