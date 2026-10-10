import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pickaxe } from "lucide-react";

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

    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => {
      setOpen(false);
      navigate("/product");
    }, 3000);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [open, navigate, setOpen]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60  flex items-center justify-center z-50"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="mining-order-title"
        className="mining-scene relative flex min-h-97.5 w-full max-w-95 flex-col items-center justify-center overflow-hidden border border-neutral-200 bg-white px-6 py-10 text-center shadow-2xl"
      >
        {/* Subtle gray ambient light */}
        <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-300/40 blur-[65px]" />

        {/* Monochrome particles */}
        {Array.from({ length: 16 }).map((_, i) => (
          <span
            key={i}
            className="mining-particle absolute rounded-full bg-black"
            style={{
              left: `${8 + ((i * 23) % 84)}%`,
              top: `${12 + ((i * 31) % 76)}%`,
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              animationDelay: `${(i % 7) * 0.18}s`,
              animationDuration: `${1 + (i % 4) * 0.35}s`,
            }}
          />
        ))}

        {/* Mining animation */}
        <div className="relative flex h-44 w-44 items-center justify-center">
          <div className="absolute inset-2 animate-[spin_18s_linear_infinite] rounded-full border border-dashed border-neutral-300" />

          <div className="absolute inset-6 rounded-full border border-neutral-200" />

          {/* Floating stone fragments */}
          <div className="mining-stone absolute bottom-7 left-8 h-7 w-7 rotate-12 bg-linear-to-br from-neutral-500 to-neutral-900 shadow-lg">
            <div className="absolute left-1 top-1 h-2 w-2 bg-white/30" />
          </div>

          <div className="mining-stone-two absolute right-7 top-8 h-5 w-5 -rotate-12 bg-linear-to-br from-neutral-400 to-neutral-800" />

          {/* Main rock */}
          <div className="mining-main-rock absolute flex h-23.5 w-23.5 items-center justify-center">
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 h-full w-full"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M27 10 69 15 91 43 81 76 51 94 18 77 8 43Z"
                fill="#262626"
                stroke="#525252"
                strokeWidth="1.5"
              />

              <path
                d="M27 10 42 43 8 43M42 43 81 76M42 43 51 94M42 43 91 43M42 43 69 15"
                stroke="#737373"
                strokeWidth="1.5"
              />

              <path
                d="m27 10 42 5-27 28Z"
                fill="#525252"
                opacity=".8"
              />

              <path
                d="m42 43 12-7 8 10-10 11-10-5Z"
                fill="#FFFFFF"
                className="mining-crystal"
              />
            </svg>

            {/* Swinging black pickaxe */}
            <div className="mining-pickaxe absolute -right-5 -top-4 z-10">
              <Pickaxe
                className="h-19 w-19 text-black drop-shadow-[0_0_8px_rgba(0,0,0,0.2)]"
                strokeWidth={2}
              />
            </div>

            {/* Impact flash */}
            <div className="mining-flash absolute right-1 top-1 h-8 w-8 rounded-full bg-black/30 blur-xl" />
          </div>

          {/* Flying sparks */}
          <span className="mining-spark absolute right-7 top-14 h-1.5 w-1.5 bg-black" />

          <span className="mining-spark mining-spark-two absolute right-12 top-6 h-1 w-1 bg-neutral-500" />

          <span className="mining-spark mining-spark-three absolute bottom-9 right-5 h-2 w-2 bg-black" />
        </div>

        {/* Heading */}
        <div className="relative mt-4">
          <h2
            id="mining-order-title"
            className="text-2xl font-semibold tracking-tight text-black"
          >
            Mining Order
          </h2>

          <p className="mt-2 text-xs tracking-wide text-neutral-500">
            Processing your order...
          </p>
        </div>

        {/* Black progress bar */}
        <div className="relative mt-8 h-0.5 w-40 overflow-hidden bg-neutral-200">
          <div className="mining-line h-full bg-black" />
        </div>

        <style>{`
          @keyframes pickaxe-hit {
            0%, 100% {
              transform: rotate(-48deg) translate(0, 0);
            }
            35% {
              transform: rotate(15deg) translate(5px, 5px);
            }
            48% {
              transform: rotate(23deg) translate(6px, 7px);
            }
            65% {
              transform: rotate(-25deg) translate(-2px, -2px);
            }
          }

          @keyframes stone-shake {
            0%, 35%, 100% {
              transform: translateX(0);
            }
            40% {
              transform: translateX(-3px) rotate(-2deg);
            }
            45% {
              transform: translateX(3px) rotate(2deg);
            }
            50% {
              transform: translateX(-2px);
            }
          }

          @keyframes particle-float {
            0% {
              transform: translateY(12px) scale(.5);
              opacity: 0;
            }
            35% {
              opacity: .7;
            }
            100% {
              transform: translateY(-32px) scale(1.3);
              opacity: 0;
            }
          }

          @keyframes crystal-glow {
            0%, 100% {
              opacity: .55;
              filter: drop-shadow(0 0 2px #737373);
            }
            50% {
              opacity: 1;
              filter: drop-shadow(0 0 8px #000000);
            }
          }

          @keyframes impact-flash {
            0%, 35%, 100% {
              opacity: 0;
              transform: scale(.3);
            }
            42% {
              opacity: .65;
              transform: scale(1.5);
            }
            52% {
              opacity: .15;
              transform: scale(2);
            }
          }

          @keyframes mining-line {
            from {
              width: 0%;
            }
            to {
              width: 100%;
            }
          }

          .mining-pickaxe {
            transform-origin: 72% 78%;
            animation: pickaxe-hit .65s ease-in-out infinite;
          }

          .mining-main-rock {
            animation: stone-shake .65s ease-in-out infinite;
          }

          .mining-stone {
            animation: particle-float 1.5s ease-in-out infinite;
          }

          .mining-stone-two {
            animation: particle-float 1.8s .3s ease-in-out infinite;
          }

          .mining-particle {
            animation: particle-float 1.3s ease-out infinite;
          }

          .mining-crystal {
            animation: crystal-glow .8s ease-in-out infinite;
          }

          .mining-flash,
          .mining-spark {
            animation: impact-flash .65s ease-out infinite;
          }

          .mining-spark-two {
            animation-delay: .2s;
          }

          .mining-spark-three {
            animation-delay: .4s;
          }

          .mining-line {
            animation: mining-line 2.8s linear forwards;
          }

          @media (prefers-reduced-motion: reduce) {
            .mining-pickaxe,
            .mining-main-rock,
            .mining-stone,
            .mining-stone-two,
            .mining-particle,
            .mining-crystal,
            .mining-flash,
            .mining-spark,
            .mining-line {
              animation: none;
            }

            .mining-line {
              width: 100%;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default MiningOrderModal;