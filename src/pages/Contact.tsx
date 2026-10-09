import { BsTelegram } from "react-icons/bs";
import { IoLogoWhatsapp } from "react-icons/io";


const Contact = () => {
  return (
    <div>
      <div className="relative bg-[url('/src/assets/contact/contact.jpg')] h-[680px] bg-cover bg-center flex items-center justify-center">
        {/* Optional overlay */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Middle Text Box */}
        <div className="relative z-10  mx-8 px-4 py-10 max-w-2xl rounded-lg shadow-xl text-center">
          <h2 className="text-4xl text-white font-semibold mb-5">
            Juwelo Help Center
          </h2>

          <p className="text-white text-lg leading-relaxed">
            Our jewelry is more than an accessory—it’s an expression of identity,
            emotion, and timeless elegance. Each piece is thoughtfully designed to
            celebrate life’s most precious moments with grace and sophistication.
          </p>
        </div>
      </div>

      <div className="mb-12">
        <h1 className="mt-5 text-2xl font-semibold">Knowledge Base</h1>

        <div className="p-8 border-black border-2 mt-12">
          <div className="flex justify-center items-center gap-2">
            <BsTelegram className="w-12 h-12" />
          </div>
        </div>
        <div className="p-8 border-black border-2 mt-12">
          <div className="flex justify-center items-center gap-2">
            <IoLogoWhatsapp className="w-12 h-12" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact