import { Star } from "lucide-react";

const Excellent = () => {
  return (
    <div className="relative bg-[url('/src/assets/home-page/jewel-4.jpg')] h-[580px] bg-cover bg-center flex items-center justify-center">
      {/* Optional overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Center Review Box */}
      <div className="relative z-10 bg-gray-800/70 mx-12 px-4 py-8 max-w-xl rounded-lg shadow-xl text-center">
        <h3 className="text-3xl font-bold mb-4 text-white">Excellent</h3>

        {/* Stars */}
        <div className="flex justify-center gap-1 mb-4 text-yellow-500">
          <Star size={22} fill="currentColor" />
          <Star size={22} fill="currentColor" />
          <Star size={22} fill="currentColor" />
          <Star size={22} fill="currentColor" />
          <Star size={22} fill="currentColor" />
        </div>

        <p className="text-white text-semibold leading-relaxed">
          Absolutely stunning craftsmanship and exceptional quality. The jewelry
          exceeded my expectations and feels truly luxurious. A brand I trust
          and recommend with confidence.
        </p>
      </div>
    </div>
  );
};

export default Excellent;
