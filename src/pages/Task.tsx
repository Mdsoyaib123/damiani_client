import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Star, Pickaxe } from "lucide-react";

import prod1 from "@/assets/product/prod-1.webp";
import prod2 from "@/assets/product/prod-2.webp";
import prod3 from "@/assets/product/prod-3.webp";
import prod4 from "@/assets/product/prod-4.webp";
import prod5 from "@/assets/product/prod-5.webp";

import AccountDetailsModal from "@/components/modal/AccountDetailsModal";
import PackageSelectionModal from "@/components/modal/PackageSelectionModal";
import MysteryBoxModal from "@/components/modal/MysteryBoxModal";
import MysteryBoxRewardModal from "@/components/modal/MysteryBoxRewardModal";
import MiningOrderModal from "@/components/modal/MiningOrderModal";
import ErrorModal from "@/components/modal/ErrorModal";
import ErrorModalBlack from "@/components/modal/ErrorModalBlack";

import {
  useGetSingleUserQuery,
  useUpdateSelectedPackageMutation,
  useRemoveMysteryRewardMutation,
  useMarkMysteryBoxAsSeenMutation,
} from "@/store/api/user/userApi";

import { toast } from "sonner";

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
  const [activeMysteryReward, setActiveMysteryReward] = useState<number | null>(
    null,
  );
  const [mysteryBoxData, setMysteryBoxData] = useState<any>(null);
  const [openMiningModal, setOpenMiningModal] = useState(false);

  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [errorMessage] = useState("");
  const [errorMessageBlack, setErrorMessageBlack] = useState("");
  const [openErrorModalBlack, setOpenErrorModalBlack] = useState(false);
  const [, setShouldCheckOrder] = useState(false);

  // User data
  const id = localStorage.getItem("userId");
  const userId = id ? parseInt(id, 10) : 0;

  const {
    data: userData,
    isLoading,
    isFetching,
    refetch,
  } = useGetSingleUserQuery(userId, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [updatePackage, { isLoading: isUpdating }] =
    useUpdateSelectedPackageMutation();

  const [removeMysteryReward] = useRemoveMysteryRewardMutation();
  const [markMysteryBoxAsSeen] = useMarkMysteryBoxAsSeenMutation();

  const user = userData?.data;
  const completedOrders = user?.completedOrdersCount || 0;
  const orderProgress = Math.min((completedOrders / 25) * 100, 100);

  useEffect(() => {
    if (userId) {
      refetch();
    }
  }, [userId, refetch]);

  useEffect(() => {
    if (user?.mysteryReward && user.mysteryReward > 0) {
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
    if (
      user?.adminAssaignProductsOrRewards &&
      user.adminAssaignProductsOrRewards.length > 0
    ) {
      const productWithMysteryBox = user.adminAssaignProductsOrRewards.find(
        (product: any) =>
          product.mysterybox &&
          product.mysterybox.method &&
          product.mysterybox.amount &&
          product.mysterybox.seenTheReward === false,
      );

      const mysteryBoxOrderNumber = productWithMysteryBox?.orderNumber;

      if (mysteryBoxOrderNumber === user?.completedOrdersCount + 1) {
        setMysteryBoxData({
          ...productWithMysteryBox.mysterybox,
          productId: productWithMysteryBox.productId,
        });

        setOpenMysteryBoxModal(true);
        return;
      }
    }

    refetch();

    if (
      user?.orderRound?.round === "trial" &&
      user?.completedOrdersCount === 25 &&
      user?.trialRoundBalance === 0
    ) {
      setErrorMessageBlack(
        "Your trial round has been completed. Now, to start the next round, please contact your senior consultant.",
      );
      setOpenErrorModalBlack(true);
      return;
    }

    if (
      user?.orderRound?.round === "round_one" &&
      user?.completedOrdersCount === 25
    ) {
      setErrorMessageBlack(
        "Your round one has been completed. Now, to start the next round, please contact your senior consultant.",
      );
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
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f3]">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />
          <p className="mt-4 text-sm text-neutral-500">Loading collection...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#f5f5f3] text-neutral-900">
      {/* Updating indicator */}
      {isFetching && userData && (
        <div className="fixed left-0 right-0 top-0 z-50 mx-auto max-w-130 bg-neutral-900 py-1 text-center text-[10px] uppercase tracking-widest text-white">
          Updating...
        </div>
      )}

      <div className="mx-auto max-w-130 px-5 pb-6 sm:px-6">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-neutral-200 pb-5 pt-5">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-left"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
              JUWELO
            </p>
            <h1 className="mt-1 text-2xl font-light tracking-tight text-neutral-900">
              Mining <span className="font-semibold">Order</span>
            </h1>
          </button>

          {/* <button
            type="button"
            onClick={() => setOpenAccountModal(true)}
            className="border border-neutral-300 px-3.5 py-2.5 text-[10px] font-medium uppercase tracking-[0.15em] transition-colors hover:border-neutral-900"
          >
            Account
          </button> */}
        </header>

        {/* Progress */}
        <section className="border-b border-neutral-200 py-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                Order progress
              </p>

              <p className="mt-2 text-3xl font-light tracking-tight tabular-nums">
                {String(completedOrders).padStart(2, "0")}
                <span className="ml-1 text-base text-neutral-400">/ 25</span>
              </p>
            </div>

            <p className="pb-1 text-xs text-neutral-500">
              {Math.round(orderProgress)}% completed
            </p>
          </div>

          <div
            className="mt-4 h-1 bg-neutral-200"
            role="progressbar"
            aria-label="Order progress"
            aria-valuemin={0}
            aria-valuemax={25}
            aria-valuenow={completedOrders}
          >
            <div
              className="h-full bg-neutral-900 transition-all duration-300"
              style={{ width: `${orderProgress}%` }}
            />
          </div>
        </section>

        {/* Collection */}
        <section className="pt-5">
          <div className="mb-2 flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                Explore your items
              </p>
              <h2 className="mt-1 text-lg font-medium tracking-tight">
                Collection
              </h2>
            </div>

            <span className="pb-1 text-xs text-neutral-500">
              {String(tasks.length).padStart(2, "0")} items
            </span>
          </div>

          <div className="divide-y divide-neutral-200">
            {tasks.map((task) => (
              <article key={task.id} className="flex items-center gap-3 py-4">
                <span className="w-4 shrink-0 text-[10px] tabular-nums text-neutral-400">
                  {String(task.id).padStart(2, "0")}
                </span>

                <div className="h-16.5 w-16.5 shrink-0 bg-[#ebeae6] p-1.5">
                  <img
                    src={task.image}
                    alt={task.title}
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='66' height='66'%3E%3Crect fill='%23ebeae6' width='66' height='66'/%3E%3C/svg%3E";
                    }}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-medium leading-5 text-neutral-900">
                    {task.title}
                  </h3>

                  <div className="mt-1.5 flex items-center gap-1.5">
                    <Star
                      size={11}
                      className="shrink-0 fill-amber-500 text-amber-500"
                    />
                    <span className="text-[10px] text-neutral-500">
                      {task.reviews}
                    </span>
                  </div>
                </div>

                <ChevronRight size={15} className="shrink-0 text-neutral-400" />
              </article>
            ))}
          </div>
        </section>

        {/* Main action — original position after the collection */}
        <section className="mt-2 border-t border-neutral-200 pt-5">
          <div className=" grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setOpenAccountModal(true)}
              className="border border-neutral-300 py-3 text-[10px] font-medium uppercase tracking-[0.16em] transition-colors hover:border-black"
            >
              Account
            </button>

            <Link
              to="/order-record"
              className="border border-neutral-300 py-3 text-center text-[10px] font-medium uppercase tracking-[0.16em] transition-colors hover:border-black"
            >
              Records
            </Link>
          </div>
          <button
            type="button"
            onClick={handleStartClick}
            className="flex w-full items-center mt-3 justify-between bg-black px-4 py-4 text-white transition-colors hover:bg-neutral-800"
          >
            <span className="flex items-center gap-3">
              <Pickaxe className="h-5 w-5" strokeWidth={1.6} />

              <span className="text-left">
                <span className="block text-[11px] font-medium uppercase tracking-[0.18em]">
                  Mining Order
                </span>
                <span className="mt-1 block text-[10px] text-white/60">
                  {completedOrders} / 30 orders completed
                </span>
              </span>
            </span>

            <ChevronRight className="h-4 w-4 text-white/70" />
          </button>

          {/* Secondary actions */}
        </section>
      </div>

      {/* Account modal */}
      <AccountDetailsModal
        open={openAccountModal}
        onClose={() => {
          refetch();
          setOpenAccountModal(false);
        }}
        data={accountDetailsData}
      />

      {/* Package selection */}
      <PackageSelectionModal
        open={openPackageModal}
        onClose={() => setOpenPackageModal(false)}
        availableSlots={user?.userOrderAmountSlot || []}
        onSelectPackage={handlePackageSelection}
        isLoading={isUpdating}
      />

      {/* Mystery box */}
      {mysteryBoxData && (
        <MysteryBoxModal
          open={openMysteryBoxModal}
          onClose={async () => {
            if (mysteryBoxData.productId) {
              try {
                await markMysteryBoxAsSeen({
                  userId,
                  productId: mysteryBoxData.productId,
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

      {/* Mystery reward */}
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

      {/* Mining */}
      <MiningOrderModal open={openMiningModal} setOpen={setOpenMiningModal} />

      {/* Errors */}
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
    </main>
  );
};

export default Task;
