import { useNavigate } from "react-router-dom";
import { ArrowRight, Pickaxe } from "lucide-react";

const Grab = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("accessToken");

  const handleGrabOrder = () => {
    navigate(isLoggedIn ? "/task" : "/login");
  };

  return (
    <section className="relative flex h-[80vh] min-h-130 w-full items-center justify-center overflow-hidden text-center">
      {/* Background video */}
      <iframe
        src="https://player.vimeo.com/video/1213949272?autoplay=1&loop=1&muted=1&background=1&title=0&byline=0&portrait=0"
        title="Damiani background video"
        allow="autoplay; fullscreen; picture-in-picture"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 border-0"
      />

      {/* Cinematic overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-black/10" />

      {/* Content */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-end px-6 pb-12 sm:pb-16 md:pb-20">
        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.35em] text-white/75 sm:text-xs">
          Discover the collection
        </p>

        <h1 className="mb-3 text-3xl font-light tracking-tight text-white sm:text-4xl md:text-5xl">
          Do more with{" "}
          <span className="font-semibold uppercase text-golden">
            Damiani
          </span>
        </h1>

        <p className="mb-7 max-w-md text-sm font-light leading-6 text-white/80 sm:text-base">
          Browse and purchase products in various styles and materials.
        </p>

        {/* Highlighted CTA */}
        <button
          type="button"
          onClick={handleGrabOrder}
          className="group inline-flex min-h-13 cursor-pointer items-center justify-center gap-3 bg-white px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-950 shadow-xl shadow-black/20 transition-all duration-300 hover:bg-[#d7bd83] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-black sm:min-h-14 sm:px-9"
        >
          <Pickaxe
            size={17}
            strokeWidth={1.7}
            className="transition-transform duration-300 group-hover:-rotate-12"
          />

          <span>Mining Order</span>

          <ArrowRight
            size={16}
            strokeWidth={1.8}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </button>

        <div className="mt-5 h-px w-10 bg-white/40" />
      </div>
    </section>
  );
};

export default Grab;