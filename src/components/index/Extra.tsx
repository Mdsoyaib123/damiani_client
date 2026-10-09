const Extra = () => {
  return (
    <div className="relative bg-[url('/src/assets/home-page/jewel-2.jpg')] h-[680px] bg-cover bg-center flex items-center justify-center">
      {/* Optional overlay */}
      <div className="absolute inset-0 bg-black/35" />

      {/* Middle Text Box */}
      <div className="relative z-10 bg-gray-700/70 mx-8 px-4 py-10 max-w-2xl rounded-lg shadow-xl text-center">
        <h2 className="text-4xl text-white font-semibold mb-5">
          Where Beauty Meets Meaning
        </h2>

        <p className="text-white text-lg leading-relaxed">
          Our jewelry is more than an accessory—it’s an expression of identity,
          emotion, and timeless elegance. Each piece is thoughtfully designed to
          celebrate life’s most precious moments with grace and sophistication.
        </p>
      </div>
    </div>
  );
};

export default Extra;
