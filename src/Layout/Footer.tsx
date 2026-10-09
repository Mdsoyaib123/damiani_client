import React from "react";
import footerImg from "@/assets/juwelo-logo.png";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#181C14] z-100 sticky bottom-0 text-gray-300 pb-4 px-4 lg:w-[500px] w-full mx-auto flex items-center justify-between gap-12 md:gap2 rounded-t-sm">
      <div className="w-[150px] mt-7">
        <img src={footerImg} alt="Footer Logo" />
      </div>
      <div className="mt-4">
        <p className="mt-4 text-sm">
          &copy; {new Date().getFullYear()} Juwelo. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
