import { useNavigate } from "react-router-dom";
// import bgImage from "@/assets/home-page/1_DAMIANI_Couple-band_1536x2400-mobile-new.webp";

const Grab = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("accessToken");

  const handleGrabOrder = () => {
    navigate(isLoggedIn ? "/task" : "/login");
  };

  return (
    <div className="relative flex h-[80vh] w-full items-center justify-center overflow-hidden bg-cover bg-center text-center">
      {/* Video background — kept for testing */}

      <iframe
        src="https://player.vimeo.com/video/1213949272?autoplay=1&loop=1&muted=1&background=1&title=0&byline=0&portrait=0"
        title="Juwelo background video"
        allow="autoplay; fullscreen; picture-in-picture"
        className="pointer-events-none absolute left-1/2 top-1/2 h-screen w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 border-0"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-end p-8">
        <h1 className="mb-3 text-3xl font-light text-white md:text-4xl">
          Do more with{" "}
          <span className="font-extrabold uppercase text-golden">Damiani</span>
        </h1>

        <p className="mb-6 max-w-xl text-sm font-normal leading-relaxed text-white/90 md:text-base">
          Browse and purchase products in various styles and materials.
        </p>

        <button
          onClick={handleGrabOrder}
          className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium tracking-wide text-white hover:underline md:text-base"
        >
          Mining Order <span className="text-lg">›</span>
        </button>
      </div>
    </div>
  );
};

export default Grab;
