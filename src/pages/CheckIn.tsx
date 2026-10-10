
import moneyBag from "@/assets/money-bag.png";
import {
  useGetSingleUserQuery,
  useClaimCheckInRewardMutation,
} from "@/store/api/user/userApi";
import { BsFileLock } from "react-icons/bs";
import {
  Check,
  LockKeyhole,
  Gift,
  ArrowRight,
  LoaderCircle,
} from "lucide-react";
import { toast } from "sonner";

const rewards = [
  { day: "Day 01", amount: "৳300", numericAmount: 300, dayNum: 1 },
  { day: "Day 02", amount: "৳700", numericAmount: 700, dayNum: 2 },
  { day: "Day 03", amount: "৳1,500", numericAmount: 1500, dayNum: 3 },
  { day: "Day 04", amount: "৳3,400", numericAmount: 3400, dayNum: 4 },
  { day: "Day 05", amount: "৳6,000", numericAmount: 6000, dayNum: 5 },
  { day: "Day 06", amount: "৳12,000", numericAmount: 12000, dayNum: 6 },
];

const CheckInSkeleton = () => {
  return (
    <main className="min-h-screen bg-[#f5f5f3] pb-12 animate-pulse">
      <div className="mx-auto max-w-5xl">
        {/* Hero Skeleton */}
        <section className="flex min-h-55 flex-col items-center justify-center bg-neutral-200 px-6 py-12 text-center sm:min-h-67.5">
          <div className="h-3 w-32 bg-white/50 mb-5" />
          <div className="h-9 w-56 max-w-full bg-white/60" />
          <div className="mt-4 h-3 w-64 max-w-full bg-white/40" />
          <div className="mt-2 h-3 w-48 max-w-full bg-white/40" />
        </section>

        <div className="px-5 sm:px-8">
          {/* Progress Skeleton */}
          <section className="border-b border-gray-200/70 py-7 sm:py-9">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="h-3 w-28 bg-gray-200" />
                <div className="mt-3 h-7 w-40 bg-gray-200" />
                <div className="mt-3 h-3 w-36 bg-gray-200/80" />
              </div>

              <div className="h-11 w-11 shrink-0 border border-gray-200 bg-white" />
            </div>

            <div className="mt-6 h-1 w-full bg-gray-200">
              <div className="h-full w-1/3 bg-gray-300" />
            </div>

            <div className="mt-3 flex justify-between gap-4">
              <div className="h-3 w-44 max-w-[70%] bg-gray-200" />
              <div className="h-3 w-8 bg-gray-200" />
            </div>
          </section>

          {/* Eligibility Skeleton */}
          <section className="mt-6 flex gap-3 border border-gray-200 bg-white p-4 sm:p-5">
            <div className="h-9 w-9 shrink-0 border border-gray-200 bg-gray-100" />
            <div className="flex-1">
              <div className="h-4 w-36 bg-gray-200" />
              <div className="mt-3 h-3 w-full max-w-sm bg-gray-100" />
              <div className="mt-2 h-3 w-4/5 max-w-xs bg-gray-100" />
              <div className="mt-4 h-1 w-full bg-gray-200" />
              <div className="mt-3 h-3 w-24 bg-gray-200" />
            </div>
          </section>

          {/* Reward Heading Skeleton */}
          <section className="pt-7 sm:pt-9">
            <div className="mb-5 flex items-end justify-between gap-3">
              <div>
                <div className="h-3 w-36 bg-gray-200" />
                <div className="mt-3 h-5 w-32 bg-gray-200" />
              </div>
              <div className="h-3 w-16 bg-gray-200" />
            </div>

            {/* Reward Cards Skeleton */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {rewards.map((reward) => (
                <article
                  key={reward.dayNum}
                  className="flex min-h-46.25 flex-col border border-gray-200/80 bg-white p-4 sm:min-h-51.25 sm:p-5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="h-3 w-14 bg-gray-200" />
                    <div className="h-4 w-4 bg-gray-200" />
                  </div>

                  <div className="flex flex-1 flex-col items-center justify-center py-4">
                    <div className="h-12 w-12 border border-gray-100 bg-gray-100" />
                    <div className="mt-4 h-6 w-20 bg-gray-200" />
                    <div className="mt-2 h-2.5 w-16 bg-gray-100" />
                  </div>

                  <div className="h-9 w-full border border-gray-100 bg-gray-100" />
                </article>
              ))}
            </div>
          </section>

          {/* Footer Skeleton */}
          <div className="mt-8 border-t border-gray-200/70 pt-5">
            <div className="mx-auto h-3 w-4/5 max-w-md bg-gray-200" />
            <div className="mx-auto mt-2 h-3 w-3/5 max-w-sm bg-gray-200/70" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default function CheckIn() {
  const storedId = localStorage.getItem("userId");
  const userId = storedId ? Number.parseInt(storedId, 10) : 0;

  const { data: userData, isLoading } = useGetSingleUserQuery(userId, {
    skip: !userId,
    refetchOnMountOrArgChange: true,
  });

  const [claimReward, { isLoading: isClaiming }] =
    useClaimCheckInRewardMutation();

  const orderCount = userData?.data?.orderCountForCheckIn ?? 0;
  const totalCheckIns = userData?.data?.dailyCheckInReward?.totalCheckIns ?? 0;

  const hasCompletedRequiredOrders = orderCount >= 41;
  const progress = Math.min((totalCheckIns / rewards.length) * 100, 100);

  const nextReward = rewards.find(
    (reward) => reward.dayNum === totalCheckIns + 1,
  );

  const handleClaim = async (dayNum: number, amount: number) => {
    if (isClaiming) return;

    if (!hasCompletedRequiredOrders) {
      toast.info("Complete 41 orders to unlock check-in rewards");
      return;
    }

    if (dayNum !== totalCheckIns + 1) {
      toast.info("Complete previous days first");
      return;
    }

    try {
      const response = await claimReward({
        userId,
        checkInAmount: amount,
      }).unwrap();

      toast.success(
        response?.message || "Check-in reward added successfully",
      );
    } catch (err: unknown) {
      console.error("Claim failed:", err);

      const errorMessage =
        typeof err === "object" &&
        err !== null &&
        "data" in err &&
        typeof err.data === "object" &&
        err.data !== null &&
        "message" in err.data &&
        typeof err.data.message === "string"
          ? err.data.message
          : "Failed to claim reward";

      toast.error(errorMessage);
    }
  };

  if (isLoading && userId) {
    return <CheckInSkeleton />;
  }

  return (
    <main className="min-h-screen bg-[#f5f5f3] pb-12">
      <div className="mx-auto max-w-5xl">
        {/* Hero */}
        <section className="relative flex min-h-55 items-center justify-center overflow-hidden bg-neutral-950 px-6 py-12 text-center sm:min-h-67.5">
          <div className="absolute inset-0 bg-[url('/src/assets/check-in/checkin.jpg')] bg-cover bg-center opacity-35" />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-black/30" />

          <div className="relative z-10 max-w-lg">
            <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-white/65">
              Your daily reward
            </p>

            <h1 className="text-3xl font-light tracking-tight text-white sm:text-4xl">
              Daily Check-in
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-xs leading-6 text-white/70 sm:text-sm">
              Come back every day and collect your rewards, one day at a time.
            </p>
          </div>
        </section>

        <div className="px-5 sm:px-8">
          {/* Progress Summary */}
          <section className="border-b border-gray-200/70 py-7 sm:py-9">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
                  Reward progress
                </p>

                <h2 className="mt-2 text-xl font-light tracking-tight text-black sm:text-2xl">
                  Your rewards
                </h2>

                <p className="mt-2 text-xs text-gray-500">
                  {totalCheckIns} of {rewards.length} days completed
                </p>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-gray-200 bg-white">
                <Gift className="h-5 w-5 text-gray-500" />
              </div>
            </div>

            <div className="mt-6 h-1 w-full overflow-hidden bg-gray-200">
              <div
                className="h-full bg-emerald-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-[10px] text-gray-400">
                {totalCheckIns >= rewards.length
                  ? "All rewards completed"
                  : "Keep going to unlock the next reward"}
              </span>

              <span className="text-[10px] font-medium tabular-nums text-gray-600">
                {Math.round(progress)}%
              </span>
            </div>
          </section>

          {/* Eligibility Notice */}
          {!hasCompletedRequiredOrders && (
            <section className="mt-6 flex items-start gap-3 border border-gray-200 bg-white p-4 sm:p-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-gray-200 bg-[#f5f5f3]">
                <LockKeyhole className="h-4 w-4 text-gray-500" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-medium text-black">
                  Unlock daily rewards
                </h3>

                <p className="mt-1.5 text-xs leading-5 text-gray-500">
                  Complete 41 orders to unlock the check-in rewards.
                </p>

                <div className="mt-3 h-1 w-full bg-gray-100">
                  <div
                    className="h-full bg-black transition-all"
                    style={{
                      width: `${Math.min((orderCount / 41) * 100, 100)}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-[10px] uppercase tracking-[0.12em] text-gray-400">
                  {Math.min(orderCount, 41)} of 41 orders
                </p>
              </div>
            </section>
          )}

          {/* Reward Grid */}
          <section className="pt-7 sm:pt-9">
            <div className="mb-5 flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
                  Six-day reward cycle
                </p>

                <h2 className="mt-1.5 text-base font-normal text-black">
                  Available rewards
                </h2>
              </div>

              <span className="text-[10px] text-gray-400">
                {rewards.length} rewards
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {rewards.map((reward) => {
                const isClaimed = reward.dayNum <= totalCheckIns;
                const isUnlocked =
                  hasCompletedRequiredOrders &&
                  reward.dayNum === totalCheckIns + 1;
                const isLocked = !isClaimed && !isUnlocked;

                return (
                  <article
                    key={reward.dayNum}
                    className={`relative flex min-h-46.25 flex-col border p-4 transition-colors sm:min-h-51.25 sm:p-5 ${
                      isClaimed
                        ? "border-emerald-100 bg-emerald-50/30"
                        : isUnlocked
                          ? "border-black bg-white"
                          : "border-gray-200/70 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[9px] uppercase tracking-[0.18em] text-gray-400">
                        {reward.day}
                      </span>

                      {isClaimed ? (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                      ) : isLocked ? (
                        <LockKeyhole className="h-3.5 w-3.5 text-gray-300" />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      )}
                    </div>

                    <div className="flex flex-1 flex-col items-center justify-center py-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center border ${
                          isClaimed
                            ? "border-emerald-100 bg-white"
                            : isUnlocked
                              ? "border-gray-200 bg-white"
                              : "border-gray-100 bg-[#f5f5f3]"
                        }`}
                      >
                        {isClaimed ? (
                          <Check className="h-5 w-5 text-emerald-600" />
                        ) : (
                          <img
                            src={moneyBag}
                            alt=""
                            className={`h-7 w-7 object-contain ${
                              isLocked ? "opacity-40 grayscale" : ""
                            }`}
                          />
                        )}
                      </div>

                      <p
                        className={`mt-3 text-lg font-light tracking-tight tabular-nums sm:text-xl ${
                          isClaimed ? "text-emerald-700" : "text-black"
                        }`}
                      >
                        {reward.amount}
                      </p>

                      <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-gray-400">
                        {isClaimed
                          ? "Collected"
                          : isUnlocked
                            ? "Ready to claim"
                            : "Reward"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleClaim(reward.dayNum, reward.numericAmount)
                      }
                      disabled={isClaiming || isClaimed || !isUnlocked}
                      className={`flex w-full items-center justify-center gap-2 border px-2 py-2.5 text-[9px] uppercase tracking-[0.12em] transition-colors ${
                        isClaimed
                          ? "border-emerald-100 bg-white text-emerald-700"
                          : isUnlocked
                            ? "border-black bg-black text-white hover:bg-gray-800"
                            : "border-gray-200/70 bg-[#f5f5f3] text-gray-400"
                      }`}
                    >
                      {isClaiming && isUnlocked ? (
                        <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                      ) : isClaimed ? (
                        <>
                          <Check className="h-3 w-3" />
                          Claimed
                        </>
                      ) : isUnlocked ? (
                        <>
                          Claim reward
                          <ArrowRight className="h-3 w-3" />
                        </>
                      ) : (
                        <>
                          <BsFileLock className="text-xs" />
                          Locked
                        </>
                      )}
                    </button>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Next Reward */}
          {hasCompletedRequiredOrders && nextReward && (
            <section className="mt-6 flex items-start gap-3 border-t border-gray-200/70 pt-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-gray-200 bg-white">
                <Gift className="h-4 w-4 text-gray-500" />
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-gray-400">
                  Up next
                </p>

                <p className="mt-1.5 text-sm text-black">
                  {nextReward.day} — {nextReward.amount}
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Claim the next available reward to continue your progress.
                </p>
              </div>
            </section>
          )}

          {/* Footer Note */}
          <p className="mt-8 border-t border-gray-200/70 pt-5 text-center text-[10px] leading-5 text-gray-400">
            Rewards must be claimed in order. Complete the required orders to
            unlock your daily check-in rewards.
          </p>
        </div>
      </div>
    </main>
  );
}
