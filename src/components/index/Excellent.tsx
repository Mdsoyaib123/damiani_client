const Excellent = () => {
  return (
    <div className="relative bg-[url('/src/assets/home-page/Banner-HP-10c-mobile-1536_2400.webp')] h-[90vh] bg-cover bg-center">
      {/* Dark gradient overlay for text visibility */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

      {/* Content Positioned at Bottom-Left */}
      <div className="relative z-10 flex flex-col items-start justify-end h-full text-left p-8">
        <h3 className="text-2xl font-light text-white mb-3">
          Damiani Diamonds
        </h3>
        <p className="text-white/90 text-sm font-normal leading-relaxed max-w-xl mb-6">
          Only the very best diamonds are selected for adorning Damiani jewelry.
          The Maison has combined its own evaluation criteria to the 4 Cs
          (Carat, Color, Clarity, Cut) with the universal method as a guarantee
          of its highly unique and exclusive jewels.
        </p>
      </div>
    </div>
  );
};

export default Excellent;
