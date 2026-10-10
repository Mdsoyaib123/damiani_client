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
import { MdHistory, MdPermContactCalendar, MdEvent, MdEmojiEvents } from "react-icons/md";
import logo from "@/assets/juwelo-logo.png";
import "./Navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { logout } from "@/store/Slices/AuthSlice/authSlice";
import { useGetSingleUserQuery } from "@/store/api/user/userApi";
import AccountDetailsModal from "@/components/modal/AccountDetailsModal";
import { TbCurrencyTaka } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";
import { IoMenuOutline } from "react-icons/io5";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openAccountModal, setOpenAccountModal] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const token = useAppSelector((state) => state.auth.token);
  const isAuthenticated = !!token || !!localStorage.getItem("accessToken");

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

  // Lock body scroll when drawer is open
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

  return (
    <>
      {/* Always-black navbar */}
      <nav
        className={`navbar-slide-in z-50 w-full bg-[#121410] text-white shadow-md transition-all duration-300 ${
          isHomePage
            ? "fixed left-1/2 top-0 w-full max-w-125 -translate-x-1/2"
            : "sticky top-0"
        }`}
      >
        <div className="w-full px-4 sm:px-6">
          <div className="relative flex h-16 items-center justify-between">
            {/* Left: Menu */}
            <div className="z-10 flex items-center gap-3">
              {isAuthenticated && (
                <button
                  onClick={() => setIsOpen(true)}
                  className="cursor-pointer text-white transition-colors hover:text-[#c9b77c] focus:outline-none"
                  aria-label="Open menu"
                >
                  <IoMenuOutline className="h-6 w-6" />
                </button>
              )}
            </div>

            {/* Center: Logo */}
            <div className="absolute left-1/2 flex -translate-x-1/2 items-center justify-center">
              <Link to="/" className="flex items-center">
                <img
                  src={logo}
                  alt="JUWELO"
                  className="h-8 w-36 object-contain"
                />
              </Link>
            </div>

            {/* Right: Icons */}
            <div className="z-10 flex items-center gap-2">
              <Link
                to="/event"
                aria-label="Events"
                className="rounded-md p-1.5 text-white transition-colors hover:bg-white/10 hover:text-[#c9b77c]"
              >
                <MdEvent className="h-6 w-6" />
              </Link>

              <Link
                to="/contact"
                aria-label="Contact"
                className="rounded-md p-1.5 text-white transition-colors hover:bg-white/10 hover:text-[#c9b77c]"
              >
                <MdPermContactCalendar className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Slide-out drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-100 bg-black/55"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              className="fixed left-0 top-0 z-101 flex h-full w-[80%] max-w-[320px] flex-col bg-white shadow-2xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 35,
              }}
            >
              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 rounded-full p-1.5 transition-colors hover:bg-gray-100"
                aria-label="Close menu"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>

              {/* User profile */}
              <div className="flex flex-col items-center border-b border-gray-100 px-4 pb-6 pt-10">
                <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#f3f2ed]">
                  <User className="h-8 w-8 text-[#55735d]" />
                </div>

                <div className="text-center text-lg font-semibold text-gray-900">
                  {user?.name || "160****052"}
                </div>

                <div className="mt-1 text-sm text-gray-500">
                  UID: {localStorage.getItem("userId") || "138334"}
                </div>
              </div>

              {/* Menu items */}
              <div className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
                <Link to="/" onClick={handleMenuItemClick}>
                  <MenuItem icon={<Home className="h-5 w-5" />} text="Home" />
                </Link>

                <Link to="/task" onClick={handleMenuItemClick}>
                  <MenuItem icon={<ThumbsUp className="h-5 w-5" />} text="Work center" />
                </Link>

                <Link to="/check-in" onClick={handleMenuItemClick}>
                  <MenuItem icon={<LogIn className="h-5 w-5" />} text="Check In" />
                </Link>

                <Link to="/cash-out" onClick={handleMenuItemClick}>
                  <MenuItem icon={<TbCurrencyTaka className="h-6 w-6" />} text="Sell Out" />
                </Link>

                <Link to="/score" onClick={handleMenuItemClick}>
                  <MenuItem icon={<MdEmojiEvents className="h-6 w-6" />} text="Score" />
                </Link>

                <button
                  className="w-full text-left"
                  onClick={handleAccountDetailsClick}
                >
                  <MenuItem icon={<CreditCard className="h-5 w-5" />} text="Account details" />
                </button>

                <Link to="/bind-account" onClick={handleMenuItemClick}>
                  <MenuItem icon={<CreditCard className="h-5 w-5" />} text="Bind Account" />
                </Link>

                <Link to="/history" onClick={handleMenuItemClick}>
                  <MenuItem icon={<MdHistory className="h-5 w-5" />} text="History" />
                </Link>

                <Link to="/forgot-password" onClick={handleMenuItemClick}>
                  <MenuItem icon={<Settings className="h-5 w-5" />} text="Change Password" />
                </Link>

                <Link to="/help" onClick={handleMenuItemClick}>
                  <MenuItem icon={<HelpCircle className="h-5 w-5" />} text="Help" />
                </Link>

                <Link to="/about" onClick={handleMenuItemClick}>
                  <MenuItem icon={<Info className="h-5 w-5" />} text="About Us" />
                </Link>

                <Link to="/contact" onClick={handleMenuItemClick}>
                  <MenuItem icon={<Mail className="h-5 w-5" />} text="Contact us" />
                </Link>
              </div>

              {/* Sign out */}
              <div className="mt-auto border-t border-gray-100 p-2">
                <button
                  className="flex w-full cursor-pointer items-center gap-4 rounded-lg px-4 py-3 text-left text-red-500 transition-colors hover:bg-red-50"
                  onClick={handleLogOut}
                >
                  <LogOut className="h-5 w-5 text-red-400" />
                  <span className="text-base font-normal text-red-500">
                    Sign Out
                  </span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Account details modal */}
      <AccountDetailsModal
        open={openAccountModal}
        onClose={() => setOpenAccountModal(false)}
        data={accountDetailsData}
      />
    </>
  );
};

const MenuItem = ({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) => {
  return (
    <div className="flex w-full cursor-pointer items-center gap-4 rounded-lg px-6 py-3.5 text-left transition-colors hover:bg-gray-50">
      <div className="shrink-0 text-gray-700">{icon}</div>
      <span className="text-base font-normal text-gray-900">{text}</span>
    </div>
  );
};

export default Navbar;