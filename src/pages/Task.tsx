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
  useMarkMysteryBoxAsSeenMutation,
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

  // Fetch user data
  const id = localStorage.getItem("userId");
  const userId = id ? parseInt(id) : 0;

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
    if (
      user?.adminAssaignProductsOrRewards &&
      user.adminAssaignProductsOrRewards.length > 0
    ) {
      const productWithMysteryBox =
        user.adminAssaignProductsOrRewards.find(
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
      <div className="mx-auto flex min-h-screen w-full max-w-[500px] items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />
          <p className="mt-4 text-xs text-neutral-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative mx-auto min-h-screen w-full max-w-[500px] bg-white text-neutral-900">
      {/* Fetching indicator */}
      {isFetching && userData && (
        <div className="absolute inset-x-0 top-0 z-40 h-0.5 overflow-hidden bg-neutral-100">
          <div className="h-full w-1/3 animate-pulse bg-neutral-800" />
        </div>
      )}

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 px-5 pb-3 pt-5 text-[11px] text-neutral-500"
      >
        <button
          type="button"
          onClick={() => navigate("/")}
          className="transition-colors hover:text-neutral-950"
        >
          Home
        </button>

        <ChevronRight className="h-3 w-3 text-neutral-300" />

        <span className="text-neutral-900">Go Shopping</span>
      </nav>

      {/* Page heading */}
      <header className="border-b border-neutral-200 px-5 pb-5 pt-1">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-500">
          Collection
        </p>

        <div className="mt-2 flex items-end justify-between gap-3">
          <h1 className="text-[27px] font-light leading-tight tracking-tight text-neutral-950">
            Juwelo <span className="font-semibold">Order</span>
          </h1>

          <span className="pb-1 text-[10px] tracking-wide text-neutral-400">
            {tasks.length} ITEMS
          </span>
        </div>
      </header>

      {/* Tabs */}
      <div className="grid grid-cols-2 border-b border-neutral-200">
        <button
          type="button"
          className="border-b-2 border-neutral-900 py-3 text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-950"
        >
          Collection
        </button>

        <button
          type="button"
          className="border-b-2 border-transparent py-3 text-[10px] font-normal uppercase tracking-[0.18em] text-neutral-400 transition-colors hover:text-neutral-900"
        >
          Description
        </button>
      </div>

      {/* Product list */}
      <section aria-label="Product collection">
        <div className="flex items-center justify-between px-5 py-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-500">
            Selected products
          </p>
          <p className="text-[10px] text-neutral-400">01 — 05</p>
        </div>

        <div>
          {tasks.map((task, index) => (
            <article
              key={task.id}
              className={`group flex items-center gap-3.5 px-5 py-4 transition-colors hover:bg-neutral-50/70 ${
                index !== tasks.length - 1
                  ? "border-b border-neutral-100"
                  : ""
              }`}
            >
              <span className="w-4 shrink-0 text-[10px] tabular-nums text-neutral-400">
                {String(task.id).padStart(2, "0")}
              </span>

              <div className="h-[68px] w-[68px] shrink-0 overflow-hidden bg-neutral-50">
                <img
                  src={task.image}
                  alt={task.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  onError={(event) => {
                    event.currentTarget.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='68' height='68'%3E%3Crect fill='%23f5f5f5' width='68' height='68'/%3E%3C/svg%3E";
                  }}
                />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="line-clamp-2 text-[12px] font-medium leading-[1.6] text-neutral-900">
                  {task.title}
                </h2>

                <div className="mt-2 flex items-center gap-1.5">
                  <Star
                    aria-hidden="true"
                    className="h-3 w-3 shrink-0 fill-amber-500 text-amber-500"
                    strokeWidth={1.5}
                  />
                  <span className="text-[10px] text-neutral-500">
                    {task.reviews}
                  </span>
                </div>
              </div>

              <ChevronRight
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-neutral-300 transition-colors group-hover:text-neutral-700"
                strokeWidth={1.5}
              />
            </article>
          ))}
        </div>
      </section>

      {/* Bottom actions */}
      <footer className="border-t border-neutral-200 px-5 pb-6 pt-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.17em] text-neutral-500">
              Order progress
            </p>
            <p className="mt-1 text-sm font-medium text-neutral-900">
              {userData?.data?.completedOrdersCount || 0}
              <span className="font-normal text-neutral-400"> / 25 orders</span>
            </p>
          </div>

          <div className="h-1 w-24 overflow-hidden bg-neutral-100">
            <div
              className="h-full bg-neutral-900 transition-all"
              style={{
                width: `${Math.min(
                  100,
                  ((userData?.data?.completedOrdersCount || 0) / 25) * 100,
                )}%`,
              }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleStartClick}
          className="w-full bg-neutral-950 px-4 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-neutral-800"
        >
          Mining Order
          <span className="ml-2 font-normal tracking-normal text-white/60">
            ({userData?.data?.completedOrdersCount || 0} / 25)
          </span>
        </button>

        <div className="mt-2.5 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setOpenAccountModal(true)}
            className="border border-neutral-200 py-3 text-[10px] font-medium uppercase tracking-[0.15em] text-neutral-900 transition-colors hover:border-neutral-900"
          >
            Account
          </button>

          <Link
            to="/order-record"
            className="flex items-center justify-center border border-neutral-200 py-3 text-[10px] font-medium uppercase tracking-[0.15em] text-neutral-900 transition-colors hover:border-neutral-900"
          >
            Records
          </Link>
        </div>
      </footer>

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
                  productId: mysteryBoxData.productId,
                }).unwrap();
              } catch (error) {
                console.error(
                  "Failed to mark mystery box as seen:",
                  error,
                );
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

      <MiningOrderModal
        open={openMiningModal}
        setOpen={setOpenMiningModal}
      />

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