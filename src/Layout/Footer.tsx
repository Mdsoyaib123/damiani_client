import React from "react";
import footerImg from "@/assets/white-logo.svg";
import { Link } from "react-router-dom";
import { ShieldCheck, Sparkles, Headset } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#121410] text-gray-300 pt-10 pb-8 px-6 border-t border-white/10 flex flex-col items-center text-center mt-auto">
      {/* Logo & Tagline */}
      <div className="flex flex-col items-center mb-6">
        <img src={footerImg} alt="Damiani Logo" className="h-8 w-auto object-contain mb-3" />
        <p className="text-xs text-white/70 tracking-widest uppercase font-light">
          Elegance & Timeless Luxury
        </p>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-sm py-4 my-2 border-y border-white/10 text-center text-xs text-gray-300">
        <div className="flex flex-col items-center gap-1.5">
          <Sparkles className="w-5 h-5 text-golden" />
          <span className="font-medium">Authentic</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <ShieldCheck className="w-5 h-5 text-golden" />
          <span className="font-medium">Secure</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <Headset className="w-5 h-5 text-golden" />
          <span className="font-medium">24/7 Support</span>
        </div>
      </div>

      {/* Quick Navigation Links */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 my-5 text-xs text-gray-300">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <Link to="/task" className="hover:text-white transition-colors">Work Center</Link>
        <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
        <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
        <Link to="/help" className="hover:text-white transition-colors">Help Center</Link>
      </div>

      {/* Gold Divider */}
      <div className="w-16 h-0.5 bg-golden opacity-70 my-4" />

      {/* Copyright */}
      <p className="text-[11px] text-gray-500 tracking-wider">
        &copy; {new Date().getFullYear()} Damiani. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
