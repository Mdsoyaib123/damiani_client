const TopPicks = () => {
  return (
    <div className="relative bg-[url('/src/assets/home-page/jewel-6.jpg')] h-[90vh] bg-cover bg-center flex items-end justify-end p-6 sm:p-8">
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

      {/* Right-aligned Glass Card with Gold Left Border Accent */}
      <div className="relative z-10 backdrop-blur-md bg-black/50 border-l-4 border-golden border-y border-r border-white/10 p-6 sm:p-8 max-w-sm rounded-r-xl shadow-2xl text-left">
        <span className="text-xs uppercase tracking-widest text-golden font-semibold mb-1 block">
          Curated Collection
        </span>
        <h3 className="text-2xl font-light text-white mb-3">
          Our Top Picks & Signature Selections
        </h3>
        <p className="text-white/85 text-xs sm:text-sm leading-relaxed mb-4">
          Hand-selected pieces that define elegance and sophistication. Made for those who appreciate refined craftsmanship and enduring charm.
        </p>
        <div className="flex items-center gap-2 text-golden text-xs font-medium uppercase tracking-wider">
          <span>Explore Favorites</span>
          <span>→</span>
        </div>
      </div>
    </div>
  );
};

export default TopPicks;
