const Quality = () => {
  return (
    <div className="relative bg-[url('/src/assets/home-page/malia_hero_mobile_1.webp')] h-225 bg-cover bg-center">
      {/* Dark gradient overlay for text visibility */}
      {/*<div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />*/}

      {/* Merged Content Positioned at Bottom-Left */}
      <div className="relative z-10 flex flex-col items-start justify-end h-full text-left p-8 ">
        <h3 className="text-3xl  font-light text-white mb-2">
          Uncompromising Quality
        </h3>
        <p className="text-white/90 text-sm md:text-base leading-relaxed mb-4 max-w-xl">
          Every piece is crafted with exceptional attention to detail, using
          ethically sourced materials and refined techniques to ensure lasting
          brilliance and strength.
        </p>

        {/*<h3 className="text-xl md:text-2xl font-light text-white mb-2 mt-2">
          Designed for a Lifetime
        </h3>
        <p className="text-white/90 text-sm md:text-base leading-relaxed mb-6 max-w-xl">
          Our jewelry is made to be worn, cherished, and passed on—timeless
          designs that remain beautiful through every chapter of life.
        </p>*/}
      </div>
    </div>
  );
};

export default Quality;
