import React, { useState, useEffect, useRef } from "react";
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
import {
  MdHistory,
  MdPermContactCalendar,
  MdEvent,
  MdEmojiEvents,
} from "react-icons/md";
import { TbCurrencyTaka } from "react-icons/tb";
import { IoMenuOutline } from "react-icons/io5";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";

import logo from "@/assets/logo.svg";
import "./Navbar.css";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { logout } from "@/store/Slices/AuthSlice/authSlice";
import { useGetSingleUserQuery } from "@/store/api/user/userApi";
import AccountDetailsModal from "@/components/modal/AccountDetailsModal";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openAccountModal, setOpenAccountModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);

  const previousScrollY = useRef(0);
  const { scrollY } = useScroll();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  const token = useAppSelector((state) => state.auth.token);
  const isAuthenticated = !!token || !!localStorage.getItem("accessToken");

  const id = localStorage.getItem("userId");
  const userId = id ? parseInt(id, 10) : 0;

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

  // Scroll effects apply only to the home page.
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!isHomePage) return;

    const previous = previousScrollY.current;
    const scrollingUp = latest < previous;

    setIsScrolled(latest > 20);

    if (latest <= 20) {
      setShowNavbar(true);
    } else if (scrollingUp) {
      setShowNavbar(true);
    } else if (latest > 80) {
      setShowNavbar(false);
    }

    previousScrollY.current = latest;
  });

  // Reset the navbar when navigating between routes.
  useEffect(() => {
    previousScrollY.current = window.scrollY;
    setShowNavbar(true);

    if (isHomePage) {
      setIsScrolled(window.scrollY > 20);
    } else {
      setIsScrolled(false);
    }
  }, [location.pathname, isHomePage]);

  // Lock body scrolling while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLogOut = () => {
    dispatch(logout());
    setIsOpen(false);
    navigate("/login");
  };

  const handleMenuItemClick = () => {
    setIsOpen(false);
  };

  const handleAccountDetailsClick = () => {
    setIsOpen(false);
    setOpenAccountModal(true);
  };

  // Only the home page changes from transparent to white.
  const isLightHeader = isHomePage ? isScrolled : true;

  return (
    <>
      <AnimatePresence initial={false}>
        {showNavbar && (
          <motion.nav
            key="main-navbar"
            initial={
              isHomePage
                ? { y: "-100%", opacity: 0, scale: 0.985 }
                : false
            }
            animate={{
              y: 0,
              opacity: 1,
              scale: 1,
              backgroundColor: isHomePage
                ? isLightHeader
                  ? "rgba(255, 255, 255, 0.96)"
                  : "rgba(255, 255, 255, 0)"
                : "rgba(255, 255, 255, 1)",
              borderColor:
                isHomePage && !isLightHeader
                  ? "rgba(255, 255, 255, 0)"
                  : "rgba(243, 244, 246, 1)",
              boxShadow:
                isHomePage && !isLightHeader
                  ? "0 0px 0px rgba(0, 0, 0, 0)"
                  : "0 4px 20px rgba(0, 0, 0, 0.04)",
            }}
            exit={
              isHomePage
                ? {
                    y: "-100%",
                    opacity: 0,
                    scale: 0.985,
                  }
                : undefined
            }
            transition={{
              y: {
                type: "spring",
                stiffness: 320,
                damping: 32,
                mass: 0.8,
              },
              opacity: { duration: 0.2, ease: "easeOut" },
              scale: {
                type: "spring",
                stiffness: 280,
                damping: 25,
              },
              backgroundColor: { duration: 0.3 },
              borderColor: { duration: 0.3 },
              boxShadow: { duration: 0.3 },
            }}
            className={`z-50 border-b ${
              isHomePage
                ? "fixed left-1/2 top-0 w-full max-w-[500px] -translate-x-1/2"
                : "sticky top-0 w-full bg-white"
            }`}
            style={{
              backdropFilter:
                isHomePage && !isLightHeader ? "blur(0px)" : "blur(12px)",
              WebkitBackdropFilter:
                isHomePage && !isLightHeader ? "blur(0px)" : "blur(12px)",
              color: "#000000",
              transformOrigin: "top center",
            }}
          >
            <div className="w-full px-4 sm:px-6">
              <div className="relative flex h-16 items-center justify-between">
                <div className="z-10 flex items-center gap-3">
                  {isAuthenticated && (
                    <motion.button
                      type="button"
                      onClick={() => setIsOpen(true)}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.92 }}
                      transition={{ duration: 0.15 }}
                      className="cursor-pointer text-black focus:outline-none"
                      aria-label="Open menu"
                    >
                      <IoMenuOutline className="h-6 w-6" />
                    </motion.button>
                  )}
                </div>

                <motion.div
                  className="absolute left-1/2 flex -translate-x-1/2 items-center justify-center"
                  animate={{
                    scale: isHomePage && isScrolled ? 0.97 : 1,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link to="/" className="flex items-center">
                    <img
                      src={logo}
                      alt="JUWELO"
                      className="h-8 w-36 object-contain"
                    />
                  </Link>
                </motion.div>

                <div className="z-10 flex items-center gap-1">
                  <Link
                    to="/event"
                    aria-label="Events"
                    className="rounded-md p-2 text-black transition-colors duration-200 hover:bg-black/5"
                  >
                    <MdEvent className="h-6 w-6" />
                  </Link>

                  <Link
                    to="/contact"
                    aria-label="Contact"
                    className="rounded-md p-2 text-black transition-colors duration-200 hover:bg-black/5"
                  >
                    <MdPermContactCalendar className="h-6 w-6" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-[100] bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              key="drawer"
              className="fixed left-0 top-0 z-[101] flex h-[100dvh] w-[80%] max-w-[320px] flex-col bg-white text-gray-900 shadow-2xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 34,
                mass: 0.8,
              }}
            >
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 rounded-full p-1.5 transition-colors hover:bg-gray-100"
                aria-label="Close menu"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>

              <div className="flex flex-col items-center border-b border-gray-100 pb-6 pt-10">
                <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <User className="h-8 w-8 text-gray-600" />
                </div>

                <div className="text-lg font-semibold text-gray-900">
                  {user?.name || "160****052"}
                </div>

                <div className="text-sm text-gray-500">
                  UID: {localStorage.getItem("userId") || "138334"}
                </div>
              </div>

              <div className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
                <Link to="/" onClick={handleMenuItemClick}>
                  <MenuItem
                    icon={<Home className="h-5 w-5" />}
                    text="Home"
                  />
                </Link>

                <Link to="/task" onClick={handleMenuItemClick}>
                  <MenuItem
                    icon={<ThumbsUp className="h-5 w-5" />}
                    text="Work center"
                  />
                </Link>

                <Link to="/check-in" onClick={handleMenuItemClick}>
                  <MenuItem
                    icon={<LogIn className="h-5 w-5" />}
                    text="Check In"
                  />
                </Link>

                <Link to="/cash-out" onClick={handleMenuItemClick}>
                  <MenuItem
                    icon={<TbCurrencyTaka className="h-6 w-6" />}
                    text="Sell Out"
                  />
                </Link>

                <Link to="/score" onClick={handleMenuItemClick}>
                  <MenuItem
                    icon={<MdEmojiEvents className="h-6 w-6" />}
                    text="Score"
                  />
                </Link>

                <button
                  type="button"
                  className="w-full text-left"
                  onClick={handleAccountDetailsClick}
                >
                  <MenuItem
                    icon={<CreditCard className="h-5 w-5" />}
                    text="Account details"
                  />
                </button>

                <Link to="/bind-account" onClick={handleMenuItemClick}>
                  <MenuItem
                    icon={<CreditCard className="h-5 w-5" />}
                    text="Bind Account"
                  />
                </Link>

                <Link to="/history" onClick={handleMenuItemClick}>
                  <MenuItem
                    icon={<MdHistory className="h-5 w-5" />}
                    text="History"
                  />
                </Link>

                <Link
                  to="/forgot-password"
                  onClick={handleMenuItemClick}
                >
                  <MenuItem
                    icon={<Settings className="h-5 w-5" />}
                    text="Change Password"
                  />
                </Link>

                <Link to="/help" onClick={handleMenuItemClick}>
                  <MenuItem
                    icon={<HelpCircle className="h-5 w-5" />}
                    text="Help"
                  />
                </Link>

                <Link to="/about" onClick={handleMenuItemClick}>
                  <MenuItem
                    icon={<Info className="h-5 w-5" />}
                    text="About Us"
                  />
                </Link>

                <Link to="/contact" onClick={handleMenuItemClick}>
                  <MenuItem
                    icon={<Mail className="h-5 w-5" />}
                    text="Contact us"
                  />
                </Link>
              </div>

              <div className="mt-auto border-t border-gray-100 p-2">
                <button
                  type="button"
                  className="flex w-full cursor-pointer items-center gap-4 rounded-lg px-4 py-3 text-left text-red-500 transition-colors hover:bg-red-50"
                  onClick={handleLogOut}
                >
                  <LogOut className="h-5 w-5 text-red-400" />
                  <span className="text-base font-normal">Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AccountDetailsModal
        open={openAccountModal}
        onClose={() => setOpenAccountModal(false)}
        data={accountDetailsData}
      />
    </>
  );
};

interface MenuItemProps {
  icon: React.ReactNode;
  text: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, text }) => (
  <div className="flex w-full cursor-pointer items-center gap-4 rounded-lg px-6 py-3.5 text-left transition-colors duration-200 hover:bg-gray-50">
    <div className="shrink-0 text-gray-700">{icon}</div>
    <span className="text-base font-normal text-gray-900">{text}</span>
  </div>
);

export default Navbar;