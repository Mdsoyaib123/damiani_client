const TopPicks = () => {
  return (
    <div className="relative bg-[url('/src/assets/home-page/jewel-6.jpg')] h-[820px] bg-cover bg-center">
      {/* Optional overlay for readability */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Top Left Text */}
      <div className="absolute top-30 left-6 z-10 bg-gray-700/60 p-6 max-w-sm rounded-lg shadow-lg">
        <h3 className="text-2xl text-white font-bold mb-3">Our Top Picks</h3>
        <p className="text-white text-sm leading-relaxed">
          Hand-selected pieces that define elegance and sophistication. Each
          design reflects our commitment to beauty, quality, and timeless style.
        </p>
      </div>

      {/* Bottom Right Text */}
      <div className="absolute bottom-12 right-6 z-10 bg-gray-700/60 p-6 max-w-sm rounded-lg shadow-lg text-right">
        <h3 className="text-2xl text-white font-bold mb-3">
          Signature Selections
        </h3>
        <p className="text-white text-sm leading-relaxed">
          Discover jewelry loved by our customers for its refined craftsmanship
          and enduring charm—pieces made to be treasured.
        </p>
      </div>
    </div>
  );
};

export default TopPicks;
