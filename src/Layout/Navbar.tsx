import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  CreditCard,
  LogIn,
  HelpCircle,
  Info,
  Settings,
  LogOut,
  Home,
  ThumbsUp,
  X,
} from "lucide-react";
import { MdHistory, MdPermContactCalendar } from "react-icons/md";
import logo from "@/assets/juwelo-logo.png";
import "./Navbar.css";
import { MdEvent } from "react-icons/md";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { logout } from "@/store/Slices/AuthSlice/authSlice";
import { useGetSingleUserQuery } from "@/store/api/user/userApi";
import AccountDetailsModal from "@/components/modal/AccountDetailsModal";
import { MdEmojiEvents } from "react-icons/md";
import { TbCurrencyTaka } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";
import { IoMenuOutline } from "react-icons/io5";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openAccountModal, setOpenAccountModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Get authentication state from Redux
  const token = useAppSelector((state) => state.auth.token);
  const isAuthenticated = !!token || !!localStorage.getItem("accessToken");

  // Fetch user data
  const id = localStorage.getItem("userId");
  const userId = id ? parseInt(id) : 0;
  const { data: userData } = useGetSingleUserQuery(userId, {
    skip: !isAuthenticated || !userId,
    refetchOnMountOrArgChange: true,
  });

  const user = userData?.data;

  const accountDetailsData = {
    name: user?.name || "sajjadhosenmahim",
    userId: user?.userId || 7872843,
    quantityOfOrders: user?.quantityOfOrders || 25,
    userBalance: user?.userBalance || 0,
    memberTotalRecharge: user?.memberTotalRecharge || 0,
    userType: user?.userType || "Normal",
    dailyProfit: user?.dailyProfit || 0,
    outOfBalance: user?.outOfBalance || 0,
    completedOrdersCount: user?.completedOrdersCount || 0,
    trialRoundBalance: user?.trialRoundBalance || 0,
  };

  // const toggleMobileMenu = () => {
  //   setIsMobileMenuOpen(!isMobileMenuOpen);
  // };

  // Scroll listener for background and text/icon color transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when drawer open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLogOut = () => {
    dispatch(logout());
    navigate("/login");
    setIsOpen(false);
  };

  const handleMenuItemClick = () => {
    setIsOpen(false);
  };

  const handleAccountDetailsClick = () => {
    setIsOpen(false);
    setOpenAccountModal(true);
  };

  const isHomePage = location.pathname === "/";
  const isLightHeader = !isHomePage || isScrolled;

  return (
    <>
      {/* Navbar constrained to mobile frame max-w-[500px] centered */}
      <nav
        className={`navbar-slide-in ${
          isHomePage
            ? "fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-125 z-50"
            : "sticky top-0 w-full z-50"
        } transition-all duration-300 ${
          isLightHeader
            ? "bg-white shadow text-black border-b border-gray-100"
            : "bg-[#121410] text-white"
        }`}
      >
        <div className="w-full px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 relative">
            {/* Left: Hamburger Button */}
            <div className="flex items-center gap-3 z-10">
              {isAuthenticated && (
                <button
                  onClick={() => setIsOpen(true)}
                  className={`focus:outline-none transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
                    isLightHeader
                      ? "text-black hover:text-gray-600"
                      : "text-white hover:text-gray-300"
                  }`}
                  aria-label="Open menu"
                >
                  <IoMenuOutline className="h-6 w-6" />
                </button>
              )}
            </div>

            {/* Center: Brand Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
              <a href="/" className="flex items-center">
                <span className="text-xl">
                  <img
                    src={logo}
                    alt="JUWELO"
                    className="w-36 h-8 object-contain"
                  />
                </span>
              </a>
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-2 z-10">
              <a
                href="/event"
                className={`md:px-3 md:py-2 rounded-md text-sm font-medium transition-colors ${
                  isLightHeader
                    ? "text-black hover:bg-gray-100"
                    : "text-white hover:bg-gray-700"
                }`}
              >
                <MdEvent className="w-6 h-6" />
              </a>
              <a
                href="/contact"
                className={`md:px-3 md:py-2 rounded-md text-sm font-medium transition-colors ${
                  isLightHeader
                    ? "text-black hover:bg-gray-100"
                    : "text-white hover:bg-gray-700"
                }`}
              >
                <MdPermContactCalendar className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Framer Motion Slide Drawer ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 bg-black/50 z-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              className="fixed top-0 left-0 h-full w-[80%] max-w-[320px] bg-white z-101 flex flex-col shadow-2xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 35,
              }}
            >
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              {/* User Profile Section */}
              <div className="flex flex-col items-center pt-10 pb-6 border-b border-gray-100">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                  <User className="w-8 h-8 text-gray-600" />
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {user?.name || "160****052"}
                </div>
                <div className="text-sm text-gray-500">
                  UID:{localStorage.getItem("userId") || "138334"}
                </div>
              </div>

              {/* Menu List */}
              <div className="flex-1 overflow-y-auto space-y-1 py-3 px-2">
                <Link to="/" onClick={handleMenuItemClick}>
                  <MenuItem icon={<Home className="w-5 h-5" />} text="Home" />
                </Link>
                <Link to="/task" onClick={handleMenuItemClick}>
                  <MenuItem icon={<ThumbsUp className="w-5 h-5" />} text="Work center" />
                </Link>
                <Link to="/check-in" onClick={handleMenuItemClick}>
                  <MenuItem icon={<LogIn className="w-5 h-5" />} text="Check In" />
                </Link>
                <Link to="/cash-out" onClick={handleMenuItemClick}>
                  <MenuItem icon={<TbCurrencyTaka className="w-6 h-6" />} text="Sell Out" />
                </Link>
                <Link to="/score" onClick={handleMenuItemClick}>
                  <MenuItem icon={<MdEmojiEvents className="w-6 h-6" />} text="Score" />
                </Link>
                <button className="w-full text-left" onClick={handleAccountDetailsClick}>
                  <MenuItem icon={<CreditCard className="w-5 h-5" />} text="Account details" />
                </button>
                <Link to="/bind-account" onClick={handleMenuItemClick}>
                  <MenuItem icon={<CreditCard className="w-5 h-5" />} text="Bind Account" />
                </Link>
                <Link to="/history" onClick={handleMenuItemClick}>
                  <MenuItem icon={<MdHistory className="w-5 h-5" />} text="History" />
                </Link>
                <Link to="/forgot-password" onClick={handleMenuItemClick}>
                  <MenuItem icon={<Settings className="w-5 h-5" />} text="Change Password" />
                </Link>
                <Link to="/help" onClick={handleMenuItemClick}>
                  <MenuItem icon={<HelpCircle className="w-5 h-5" />} text="Help" />
                </Link>
                <Link to="/about" onClick={handleMenuItemClick}>
                  <MenuItem icon={<Info className="w-5 h-5" />} text="About Us" />
                </Link>
                <Link to="/contact" onClick={handleMenuItemClick}>
                  <MenuItem icon={<Mail className="w-5 h-5" />} text="Contact us" />
                </Link>
              </div>

              {/* Sign Out */}
              <div className="p-2 border-t border-gray-100 mt-auto">
                <button
                  className="w-full flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors text-left font-normal"
                  onClick={handleLogOut}
                >
                  <LogOut className="w-5 h-5 text-red-400" />
                  <span className="text-base font-normal text-red-500">Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Account Details Modal */}
      <AccountDetailsModal
        open={openAccountModal}
        onClose={() => setOpenAccountModal(false)}
        data={accountDetailsData}
      />
    </>
  );
};

// Menu Item Component
const MenuItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => {
  return (
    <div className="w-full flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors text-left">
      <div className="text-gray-700 shrink-0">{icon}</div>
      <span className="text-gray-900 text-base font-normal">{text}</span>
    </div>
  );
};

export default Navbar;
