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
      <div className="max-w-[500px] mx-auto bg-white h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#181c14] mx-auto"></div>
          <p className="mt-4 text-gray-600 font-normal">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[500px] mx-auto bg-white min-h-screen relative">
      {/* Optional: Loading Overlay for Background Refetches */}
      {isFetching && userData && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-[#181c14] text-white text-center py-1 text-xs max-w-[500px] mx-auto">
          Checking for updates...
        </div>
      )}

      {/* Clean Header matching Home luxury style */}
      <div className="bg-[#181c14] text-white px-6 py-8 border-b border-white/10">
        <div className="flex items-center text-xs text-white/70 mb-3 font-normal">
          <span onClick={() => navigate("/")} className="hover:text-golden cursor-pointer transition-colors">Home</span>
          <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-white/40" />
          <span className="text-white">Go Shopping</span>
        </div>
        <h1 className="text-3xl font-light tracking-wide text-white">
          Juwelo <span className="text-golden font-bold uppercase">Order</span>
        </h1>
      </div>

      {/* Tab Headers */}
      <div className="grid grid-cols-2 bg-white border-b border-gray-200">
        <div className="text-center py-3.5 text-sm font-medium text-black border-b-2 border-golden">
          Ng.Collection
        </div>
        <div className="text-center py-3.5 text-sm font-normal text-gray-400">
          Description
        </div>
      </div>

      {/* Product List */}
      <div className="divide-y divide-gray-100 bg-white">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            {/* Left Side: Number + Image + Details */}
            <div className="flex items-center gap-4 flex-1">
              {/* Number */}
              <div className="text-base font-light text-gray-400 w-5 flex-shrink-0">
                {task.id}
              </div>

              {/* Product Image */}
              <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0 border border-gray-100">
                <img
                  src={task.image}
                  alt={task.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect fill='%23e5e7eb' width='64' height='64'/%3E%3C/svg%3E";
                  }}
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0 pr-2">
                <h3 className="text-sm font-normal text-gray-900 mb-1 leading-snug">
                  {task.title}
                </h3>
                <div className="flex items-center gap-1 text-xs text-gray-500 font-normal">
                  <Star className="w-3.5 h-3.5 fill-golden text-golden" />
                  <span>{task.reviews}</span>
                </div>
              </div>
            </div>

            {/* Right Arrow */}
            <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
          </div>
        ))}
      </div>

      {/* Bottom Action Controls */}
      <div className="max-w-[500px] px-5 py-6 mx-auto bg-white border-t border-gray-200">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => setOpenAccountModal(true)}
            className="py-3.5 cursor-pointer rounded text-white bg-[#181c14] hover:bg-black font-normal text-sm transition-colors text-center"
          >
            Account Details
          </button>

          <Link
            to="/order-record"
            className="py-3.5 cursor-pointer rounded text-white text-center bg-[#181c14] hover:bg-black font-normal text-sm transition-colors block"
          >
            Order Record
          </Link>
        </div>

        <button
          onClick={handleStartClick}
          className="w-full py-4 text-white cursor-pointer bg-golden hover:bg-[#d47820] rounded font-semibold text-lg transition-colors tracking-wide shadow-sm"
        >
          Start{" "}
          <span className="text-white/90 font-normal text-base ml-1">
            ({userData?.data?.completedOrdersCount || 0} / 25)
          </span>
        </button>
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

      {/* Mystery Box Modal (for admin assigned products) */}
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
                console.log("Mystery box marked as seen");
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

      {/* Mystery Reward Modal (for global mystery reward) */}
      {activeMysteryReward && (
        <MysteryBoxRewardModal
          open={openMysteryRewardModal}
          onClose={async () => {
            try {
              await removeMysteryReward(userId).unwrap();
              console.log("Mystery reward removed successfully");
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

      {/* Mining Order Modal */}
      <MiningOrderModal open={openMiningModal} setOpen={setOpenMiningModal} />

      {/* Error Modals */}
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

      {/* Bottom spacing */}
      <div className="h-24"></div>
    </div>
  );
};

export default Task;  