const Quality = () => {
  return (
    <div className="relative bg-[url('/src/assets/home-page/jewel-3.jpg')] h-[580px] bg-cover bg-center">
      {/* Optional dark overlay for readability */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Top Left Box */}
      <div className="absolute top-8 left-8 z-10 text-white  p-6 max-w-sm rounded-md shadow-lg">
        <h3 className="text-2xl font-semibold mb-3">Uncompromising Quality</h3>
        <p className="text-white text-sm leading-relaxed">
          Every piece is crafted with exceptional attention to detail, using
          ethically sourced materials and refined techniques to ensure lasting
          brilliance and strength.
        </p>
      </div>

      {/* Bottom Right Box */}
      <div className="absolute bottom-12 right-4 z-10  p-6 max-w-sm rounded-md shadow-lg text-left">
        <h3 className="text-2xl font-semibold mb-3 text-white">
          Designed for a Lifetime
        </h3>
        <p className="text-white text-sm leading-relaxed">
          Our jewelry is made to be worn, cherished, and passed on—timeless
          designs that remain beautiful through every chapter of life.
        </p>
      </div>
    </div>
  );
};

export default Quality;
