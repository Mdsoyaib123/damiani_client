const Flexibility = () => {
  return (
    <div className="relative bg-[url('/src/assets/home-page/In_Contatto_full_image_mobile_1.webp')] h-185 bg-cover bg-center">
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

      {/* Content Positioned at Bottom-Left */}
      <div className="relative z-10 flex flex-col items-start justify-end h-full text-left p-8 md:p-12">
        <h2 className="text-3xl md:text-5xl font-light text-white mb-3">
          Crafted to Shine, Designed to Last
        </h2>
        <p className="max-w-xl text-white/90 text-base md:text-lg mb-6">
          Each piece of our jewelry is a celebration of elegance, precision, and
          timeless beauty. Designed to reflect your unique story and style.
        </p>
      </div>
    </div>
  );
};

export default Flexibility;
