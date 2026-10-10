import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface MiningOrderModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const MiningOrderModal: React.FC<MiningOrderModalProps> = ({
  open,
  setOpen,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;

    const timer = window.setTimeout(() => {
      setOpen(false);
      navigate("/product");
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [open, navigate, setOpen]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-5 backdrop-blur-[2px]">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="mining-order-title"
        className="relative w-full max-w-95 border border-neutral-200 bg-white px-7 py-9 text-center shadow-2xl sm:px-10 sm:py-11"
      >
        {/* Status indicator */}
        <div className="mx-auto flex h-17 w-17 items-center justify-center border border-amber-300/70 bg-amber-50">
          <svg
            className="h-8 w-8 text-amber-700"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
            <path d="m4.5 7.7 7.5 4.5 7.5-4.5" />
            <path d="M12 12.2V21" />
          </svg>
        </div>

        {/* Heading */}
        <p className="mt-7 text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-500">
          Order Processing
        </p>

        <h2
          id="mining-order-title"
          className="mt-3 text-2xl font-light tracking-tight text-neutral-900 sm:text-[28px]"
        >
          Mining Order
        </h2>

        <p className="mx-auto mt-3 max-w-65 text-sm leading-6 text-neutral-500">
          Please wait while we process your order. This will only take a moment.
        </p>

        {/* Progress indicator */}
        <div className="mt-8">
          <div className="h-0.5 w-full overflow-hidden bg-neutral-100">
            <div className="h-full w-1/3 animate-[mining-progress_1.2s_ease-in-out_infinite] bg-amber-600" />
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.16em] text-neutral-400">
              Processing
            </span>

            <span className="flex items-center gap-1.5 text-xs text-neutral-600">
              <span className="h-1.5 w-1.5 animate-pulse bg-amber-600" />
              Please wait
            </span>
          </div>
        </div>

        <div className="mt-7 border-t border-neutral-100 pt-5">
          <p className="text-xs leading-5 text-neutral-400">
            You will be redirected automatically.
          </p>
        </div>

        <style>{`
          @keyframes mining-progress {
            0% {
              transform: translateX(-110%);
            }
            100% {
              transform: translateX(330%);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default MiningOrderModal;