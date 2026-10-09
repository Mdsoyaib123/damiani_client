const Extra = () => {
  return (
    <div className="relative bg-[url('/src/assets/home-page/Banner-mobile-780x1520.webp')] h-[90vh] bg-cover bg-center flex items-center justify-center p-6">
      {/* Soft dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Elegant Centered Glass Card */}
      <div className="relative z-10 backdrop-blur-md bg-black/45 border border-white/15 p-8 sm:p-10 max-w-md rounded-2xl shadow-2xl text-center">
        <span className="text-xs uppercase tracking-widest text-golden font-semibold mb-2 block">
          Juwelo Heritage
        </span>
        <h2 className="text-2xl sm:text-3xl font-light text-white mb-4">
          Where Beauty Meets Meaning
        </h2>
        <div className="w-12 h-0.5 bg-golden mx-auto mb-4 opacity-80" />
        <p className="text-white/85 text-xs sm:text-sm leading-relaxed">
          Our jewelry is more than an accessory—it’s an expression of identity,
          emotion, and timeless elegance. Each piece is thoughtfully designed to
          celebrate life’s most precious moments with grace and sophistication.
        </p>
      </div>
    </div>
  );
};

export default Extra;
