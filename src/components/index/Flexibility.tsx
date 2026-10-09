const Flexibility = () => {
  return (
    <div className="relative bg-[url('/src/assets/home-page/jewel-7.jpg')] h-[740px] bg-cover bg-center">
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Crafted to Shine, Designed to Last
        </h2>
        <p className="max-w-2xl text-white text-lg">
          Each piece of our jewelry is a celebration of elegance, precision, and
          timeless beauty. Designed to reflect your unique story and style.
        </p>
      </div>

      {/* Top Left Box */}
      {/* <div className="absolute top-6 left-6 z-10 bg-white/90 p-5 max-w-xs rounded-md shadow-lg">
        <h3 className="text-xl font-semibold mb-2">Timeless Craftsmanship</h3>
        <p className="text-sm text-gray-700">
          Meticulously handcrafted using premium materials, blending tradition
          with modern elegance.
        </p>
      </div> */}

      {/* Bottom Right Box */}
      {/* <div className="absolute bottom-6 right-6 z-10 bg-white/40 p-5 max-w-xs rounded-md shadow-lg text-right">
        <h3 className="text-xl font-semibold mb-2">
          Elegance for Every Moment
        </h3>
        <p className="text-sm text-gray-700">
          Jewelry designed to complement every occasion with grace and
          sophistication.
        </p>
      </div> */}
    </div>
  );
};

export default Flexibility;
