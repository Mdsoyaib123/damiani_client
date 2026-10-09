import React, { useState, useEffect } from "react";
import {
  Menu,
  User,
  // DollarSign,
  Mail,

  CreditCard,
  LogIn,
  HelpCircle,
  Info,
  Settings,
} from "lucide-react";
import { MdHistory, MdPermContactCalendar } from "react-icons/md";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openAccountModal, setOpenAccountModal] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Get authentication state from Redux
  const token = useAppSelector((state) => state.auth.token);

  // Or check localStorage directly (choose one approach)
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close sheet when route changes
  useEffect(() => {
    setIsOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogOut = () => {
    setIsOpen(false);
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const handleMenuItemClick = () => {
    setIsOpen(false);
  };

  const handleAccountDetailsClick = () => {
    setIsOpen(false);
    setOpenAccountModal(true);
  };

  return (
    <>
      <nav className="bg-[#181C14] shadow-lg w-full relative">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo with Conditional Sheet */}
            <div className="flex items-center justify-center gap-3">
              {isAuthenticated && (
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild>
                    <button
                      className="text-white hover:text-gray-300 focus:outline-none transition-all duration-200 hover:scale-110 active:scale-95"
                      aria-label="Open menu"
                    >
                      <Menu className="h-6 w-6" />
                    </button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="custom-sheet-width p-0 z-100 bg-white transition-all duration-300 ease-in-out w-[280px] sm:w-[350px] fixed left-0 top-0 h-full"
                  >
                    <div className="flex flex-col h-full">
                      {/* User Profile Section */}
                      <div className="flex flex-col items-center pt-8 pb-6 border-b border-gray-200">
                        <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center mb-3">
                          <User className="w-8 h-8 text-gray-600" />
                        </div>
                        <div className="text-lg font-semibold">
                          {user?.name || "160****052"}
                        </div>
                        <div className="text-sm text-gray-500">
                          UID:{localStorage.getItem("userId") || "138334"}
                        </div>
                        <button className="mt-4 w-[90%] bg-black text-white py-2.5 rounded-md font-medium hover:bg-gray-800 transition-colors">
                          Cash In
                        </button>
                      </div>

                      {/* Quick Actions Grid */}
                      <div className="grid grid-cols-4 gap-4 px-6 py-2 border-b border-gray-200">
                        <Link to="/cash-out">
                          <button className="flex flex-col items-center cursor-pointer gap-2 hover:opacity-70 transition-opacity">
                            <div className="w-12 h-12 flex items-center justify-center">
                              {/* <DollarSign className="w-6 h-6" /> */}
                              <TbCurrencyTaka className="w-6 h-6" />
                            </div>
                            <span className="text-xs text-center">Sell Out</span>
                          </button>
                        </Link>
                        <Link to="/contact">
                          <button className="flex flex-col items-center cursor-pointer gap-2 hover:opacity-70 transition-opacity">
                            <div className="w-12 h-12 flex items-center justify-center">
                              <Mail className="w-6 h-6" />
                            </div>
                            <span className="text-xs text-center">
                              Contact us
                            </span>
                          </button>
                        </Link>
                        <Link to="/score" className="flex flex-col items-center cursor-pointer gap-2 hover:opacity-70 transition-opacity">
                          <button className="cursor-pointer">
                            <div className="w-12 h-12 flex items-center justify-center">
                              {/* <Award className="w-6 h-6" /> */}
                              <MdEmojiEvents className="w-7 h-7" />
                            </div>
                            <span className="text-xs text-center">Score</span>
                          </button>
                        </Link>
                        <button
                          onClick={handleAccountDetailsClick}
                          className="flex flex-col items-center cursor-pointer gap-2 hover:opacity-70 transition-opacity"
                        >
                          <div className="w-12 h-12 flex items-center justify-center">
                            <CreditCard className="w-6 h-6" />
                          </div>
                          <span className="text-xs text-center">
                            Account details
                          </span>
                        </button>
                      </div>

                      {/* Menu Items */}
                      <div className="flex-1 overflow-y-auto">
                        <Link to="/bind-account" onClick={handleMenuItemClick}>
                          <MenuItem
                            icon={<CreditCard className="w-5 h-5" />}
                            text="Bind Account"
                          />
                        </Link>
                        <Link to="/check-in" onClick={handleMenuItemClick}>
                          <MenuItem
                            icon={<LogIn className="w-5 h-5" />}
                            text="Check In"
                          />
                        </Link>
                        <Link to="/history" onClick={handleMenuItemClick}>
                          <MenuItem
                            icon={<MdHistory className="w-5 h-5" />}
                            text="History"
                          />
                        </Link>
                        <Link
                          to="/forgot-password"
                          onClick={handleMenuItemClick}
                        >
                          <MenuItem
                            icon={<Settings className="w-5 h-5" />}
                            text="Change Password"
                          />
                        </Link>
                        <Link to="/help" onClick={handleMenuItemClick}>
                          <MenuItem
                            icon={<HelpCircle className="w-5 h-5" />}
                            text="Help"
                          />
                        </Link>
                        <Link to="/about" onClick={handleMenuItemClick}>
                          <MenuItem
                            icon={<Info className="w-5 h-5" />}
                            text="About Us"
                          />
                        </Link>
                      </div>

                      {/* Sign Out Button */}
                      <div className="p-4 border-t border-gray-200">
                        <button
                          className="w-full cursor-pointer py-3 border-2 border-red-500 text-red-500 rounded-md font-medium hover:bg-red-50 transition-colors"
                          onClick={handleLogOut}
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              )}

              <a
                href="/"
                className="text-white text-2xl font-bold flex items-center"
              >
                <span className="text-xl">
                  <img src={logo} alt="JUWELO" className="w-36 h-8" />
                </span>
              </a>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex">
              <a
                href="/event"
                className="text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <MdEvent className="w-6 h-6" />
              </a>
              <a
                href="/contact"
                className="text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <MdPermContactCalendar className="w-6 h-6" />
                {/* <MdEmojiEvents className="w-6 h-6" /> */}
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                type="button"
                className="text-white hover:text-gray-300 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a
                href="/"
                className="text-white block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
              >
                Home
              </a>
              <a
                href="/about"
                className="text-white block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
              >
                About
              </a>
              <a
                href="/event"
                className="text-white block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
              >
                Event
              </a>
              <a
                href="/contact"
                className="text-white block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
              >
                Contact
              </a>
            </div>
          </div>
        )}
      </nav>

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
    <button className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 cursor-pointer border-b border-gray-200 transition-colors">
      <div className="flex items-center gap-3">
        <div className="text-gray-700">{icon}</div>
        <span className="text-gray-900">{text}</span>
      </div>
      <span className="text-gray-400 text-xl">+</span>
    </button>
  );
};

export default Navbar;