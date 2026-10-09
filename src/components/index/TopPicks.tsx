const TopPicks = () => {
  return (
    <div className="relative bg-[url('/src/assets/home-page/jewel-6.jpg')] h-[90vh] bg-cover bg-center">
      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

      {/* Content Positioned at Bottom-Left */}
      <div className="relative z-10 flex flex-col items-start justify-end h-full text-left p-8">
        <h3 className="text-2xl font-light text-white mb-2">
          Our Top Picks & Signature Selections
        </h3>
        <p className="text-white/90 text-sm md:text-base leading-relaxed max-w-xl mb-6 font-normal">
          Hand-selected pieces that define elegance and sophistication. Discover
          jewelry loved by our customers for its refined craftsmanship, enduring charm,
          and timeless style—made to be treasured forever.
        </p>
      </div>
    </div>
  );
};

export default TopPicks;
