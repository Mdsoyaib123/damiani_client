import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Star } from "lucide-react";
import prod1 from "@/assets/product/prod-1.webp";
import prod2 from "@/assets/product/prod-2.webp";
import prod3 from "@/assets/product/prod-3.webp";
import prod4 from "@/assets/product/prod-4.webp";
import prod5 from "@/assets/product/prod-5.webp";
import AccountDetailsModal from "@/components/modal/AccountDetailsModal";
import PackageSelectionModal from "@/components/modal/PackageSelectionModal";
import MysteryBoxModal from "@/components/modal/MysteryBoxModal";
import MysteryBoxRewardModal from "@/components/modal/MysteryBoxRewardModal";
import {
  useGetSingleUserQuery,
  useUpdateSelectedPackageMutation,
  useRemoveMysteryRewardMutation,
  useMarkMysteryBoxAsSeenMutation
} from "@/store/api/user/userApi";
import { toast } from "sonner";
import MiningOrderModal from "@/components/modal/MiningOrderModal";
import ErrorModal from "@/components/modal/ErrorModal";
import ErrorModalBlack from "@/components/modal/ErrorModalBlack";

interface TaskItem {
  id: number;
  image: string;
  title: string;
  reviews: string;
}

const Task: React.FC = () => {
  const navigate = useNavigate();
  const tasks: TaskItem[] = [
    {
      id: 1,
      image: prod1,
      title: "Nepal Kyanite Steel Bangle (Riya)",
      reviews: "6,507 Reviews",
    },
    {
      id: 2,
      image: prod2,
      title: "Purple Diamond Ring in 14K Gold",
      reviews: "16,772 Reviews",
    },
    {
      id: 3,
      image: prod3,
      title: "Sky Blue Topaz Platinum Pendant",
      reviews: "14,803 Reviews",
    },
    {
      id: 4,
      image: prod4,
      title: "hmIPULSE FLEECE REGULAR CREW",
      reviews: "5,458 Reviews",
    },
    {
      id: 5,
      image: prod5,
      title: "DBU 88 REPLICA JERSEY S/S",
      reviews: "10,237 Reviews",
    },
  ];

  const [openAccountModal, setOpenAccountModal] = useState(false);
  const [openPackageModal, setOpenPackageModal] = useState(false);
  const [openMysteryBoxModal, setOpenMysteryBoxModal] = useState(false);
  const [openMysteryRewardModal, setOpenMysteryRewardModal] = useState(false);
  const [activeMysteryReward, setActiveMysteryReward] = useState<number | null>(null);
  const [mysteryBoxData, setMysteryBoxData] = useState<any>(null);
  const [openMiningModal, setOpenMiningModal] = useState(false);

  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [errorMessage,] = useState("");
  const [errorMessageBlack, setErrorMessageBlack] = useState("");
  const [openErrorModalBlack, setOpenErrorModalBlack] = useState(false);
  const [, setShouldCheckOrder] = useState(false);

  // Fetch user data
  const id = localStorage.getItem("userId");
  const userId = id ? parseInt(id) : 0;

  const { data: userData, isLoading, isFetching, refetch } = useGetSingleUserQuery(userId, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [updatePackage, { isLoading: isUpdating }] = useUpdateSelectedPackageMutation();
  const [removeMysteryReward] = useRemoveMysteryRewardMutation();
  const [markMysteryBoxAsSeen] = useMarkMysteryBoxAsSeenMutation();

  const user = userData?.data;

  useEffect(() => {
    if (userId) {
      refetch();
    }
  }, [userId, refetch]);

  // Check for mystery reward on component mount
  useEffect(() => {
    if (user && user.mysteryReward && user.mysteryReward > 0) {
      setActiveMysteryReward(user.mysteryReward);
      setOpenMysteryRewardModal(true);
    }
  }, [user]);

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

  const handleStartClick = () => {
    if (user?.adminAssaignProductsOrRewards && user.adminAssaignProductsOrRewards.length > 0) {
      const productWithMysteryBox = user.adminAssaignProductsOrRewards.find(
        (product: any) =>
          product.mysterybox &&
          product.mysterybox.method &&
          product.mysterybox.amount &&
          product.mysterybox.seenTheReward === false
      );
      const mysteryBoxOrderNumber = productWithMysteryBox?.orderNumber;

      if (mysteryBoxOrderNumber === user?.completedOrdersCount + 1) {
        setMysteryBoxData({
          ...productWithMysteryBox.mysterybox,
          productId: productWithMysteryBox.productId
        });
        setOpenMysteryBoxModal(true);
        return;
      }
    }

    refetch();

    if ((user?.orderRound?.round === "trial") && (user?.completedOrdersCount === 25) && (user?.trialRoundBalance === 0)) {
      setErrorMessageBlack("Your trial round has been completed. Now, to start the next round, please contact your senior consultant.");
      setOpenErrorModalBlack(true);
      return;
    }
    if ((user?.orderRound?.round === "round_one") && (user?.completedOrdersCount === 25)) {
      setErrorMessageBlack("Your round one has been completed. Now, to start the next round, please contact your senior consultant.");
      setOpenErrorModalBlack(true);
      return;
    }

    if (!user?.userSelectedPackage || user.userSelectedPackage === 0) {
      setOpenPackageModal(true);
    } else {
      setOpenMiningModal(true);
      setShouldCheckOrder(true);
    }
  };

  const handlePackageSelection = async (amount: number) => {
    try {
      await updatePackage({ userId, amount }).unwrap();
      setOpenPackageModal(false);
      toast.success("Package selected successfully");
      setOpenMiningModal(true);
      setShouldCheckOrder(true);
    } catch (error) {
      console.error("Failed to update package:", error);
      toast.error((error as any)?.data?.message);
    }
  };

  const handleMysteryRewardContinue = async () => {
    try {
      await removeMysteryReward(userId).unwrap();
      setOpenMysteryRewardModal(false);
      toast.success("Mystery reward claimed successfully!");
    } catch (error) {
      console.error("Failed to remove mystery reward:", error);
      toast.error((error as any)?.data?.message);
    }
  };

  if (isLoading && !userData) {
    return (
      <div className="max-w-125 mx-auto bg-white h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-charcoalDark mx-auto"></div>
          <p className="mt-4 text-gray-600 font-normal">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-125 mx-auto bg-white relative">
      {/* Fetching indicator */}
      {isFetching && userData && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-black text-white text-center py-1 text-[10px] tracking-widest uppercase max-w-125 mx-auto">
          Updating…
        </div>
      )}

      {/* ── Breadcrumb ── */}
      <div className="px-5 pt-4 pb-1 flex items-center gap-1.5 text-[10px] text-gray-400 tracking-wide">
        <span
          onClick={() => navigate("/")}
          className="hover:text-black cursor-pointer transition-colors"
        >
          Home
        </span>
        <span className="text-gray-300">›</span>
        <span className="text-gray-500">Go Shopping</span>
      </div>

      {/* ── Page Title ── */}
      <div className="px-5 pt-1 pb-4 border-b border-gray-100">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Collection</p>
        <h1 className="text-2xl font-light text-black tracking-tight">
          Juwelo <span className="font-semibold">Order</span>
        </h1>
      </div>

      {/* ── Tabs ── */}
      <div className="grid grid-cols-2 border-b border-gray-100">
        <button className="py-2.5 text-[11px] font-medium text-black border-b-2 border-black tracking-widest uppercase">
          Collection
        </button>
        <button className="py-2.5 text-[11px] font-normal text-gray-400 tracking-widest uppercase">
          Description
        </button>
      </div>

      {/* ── Product List ── */}
      <div className="bg-white">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className={`flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${
              index !== tasks.length - 1 ? "border-b border-gray-100" : ""
            }`}
          >
            {/* Index number */}
            <span className="text-[10px] text-gray-300 font-light w-3 shrink-0 tabular-nums">
              {task.id}
            </span>

            {/* Image — clean, no border */}
            <div className="w-14 h-14 bg-gray-50 shrink-0 overflow-hidden">
              <img
                src={task.image}
                alt={task.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56'%3E%3Crect fill='%23f3f4f6' width='56' height='56'/%3E%3C/svg%3E";
                }}
              />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-normal text-black leading-snug mb-1 truncate">
                {task.title}
              </p>
              <div className="flex items-center gap-1">
                <Star className="w-2.5 h-2.5 fill-golden text-golden shrink-0" />
                <span className="text-[10px] text-gray-400">{task.reviews}</span>
              </div>
            </div>

            {/* Arrow */}
            <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
          </div>
        ))}
      </div>

      {/* ── Bottom Actions ── */}
      <div className="px-5 pt-5 pb-6 border-t border-gray-100 space-y-2">
        {/* Primary CTA — solid black, sharp, Damiani-style */}
        <button
          onClick={handleStartClick}
          className="w-full py-3.5 bg-black text-white text-[11px] font-medium tracking-[0.2em] uppercase cursor-pointer hover:bg-gray-900 transition-colors"
        >
          Mining Order{" "}
          <span className="opacity-50 font-light tracking-normal normal-case">
            ({userData?.data?.completedOrdersCount || 0} / 25)
          </span>
        </button>

        {/* Secondary — text-link style, like "Make an Appointment" */}
        <div className="flex gap-3">
          <button
            onClick={() => setOpenAccountModal(true)}
            className="flex-1 py-2.5 text-[10px] text-black tracking-widest uppercase cursor-pointer border border-gray-200 hover:border-black transition-colors text-center"
          >
            Account
          </button>
          <Link
            to="/order-record"
            className="flex-1 py-2.5 text-[10px] text-black tracking-widest uppercase cursor-pointer border border-gray-200 hover:border-black transition-colors text-center"
          >
            Records
          </Link>
        </div>
      </div>

      {/* Modals */}
      <AccountDetailsModal
        open={openAccountModal}
        onClose={() => {
          refetch();
          setOpenAccountModal(false);
        }}
        data={accountDetailsData}
      />

      <PackageSelectionModal
        open={openPackageModal}
        onClose={() => setOpenPackageModal(false)}
        availableSlots={user?.userOrderAmountSlot || []}
        onSelectPackage={handlePackageSelection}
        isLoading={isUpdating}
      />

      {mysteryBoxData && (
        <MysteryBoxModal
          open={openMysteryBoxModal}
          onClose={async () => {
            if (mysteryBoxData.productId) {
              try {
                await markMysteryBoxAsSeen({
                  userId,
                  productId: mysteryBoxData.productId
                }).unwrap();
              } catch (error) {
                console.error("Failed to mark mystery box as seen:", error);
              }
            }
            setOpenMysteryBoxModal(false);
            setMysteryBoxData(null);
            navigate("/product");
          }}
          mysteryBoxData={mysteryBoxData}
        />
      )}

      {activeMysteryReward && (
        <MysteryBoxRewardModal
          open={openMysteryRewardModal}
          onClose={async () => {
            try {
              await removeMysteryReward(userId).unwrap();
            } catch (error) {
              console.error("Failed to remove mystery reward:", error);
            }
            setOpenMysteryRewardModal(false);
            setActiveMysteryReward(null);
          }}
          mysteryReward={activeMysteryReward}
          onContinue={handleMysteryRewardContinue}
        />
      )}

      <MiningOrderModal open={openMiningModal} setOpen={setOpenMiningModal} />

      <ErrorModal
        isOpen={openErrorModal}
        message={errorMessage}
        onClose={() => setOpenErrorModal(false)}
      />
      <ErrorModalBlack
        isOpen={openErrorModalBlack}
        message={errorMessageBlack}
        onClose={() => setOpenErrorModalBlack(false)}
      />
    </div>
  );
};

export default Task;