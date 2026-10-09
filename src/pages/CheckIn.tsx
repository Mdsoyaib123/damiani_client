import moneyBag from "@/assets/money-bag.png";
import { useGetSingleUserQuery } from "@/store/api/user/userApi";
import { useClaimCheckInRewardMutation } from "@/store/api/user/userApi";
import { BsFileLock } from "react-icons/bs";
import { toast } from "sonner";

// Define reward structure with required amount (numeric) and day number
const rewards = [
    { day: "1 Day", amount: "৳300", numericAmount: 300, dayNum: 1 },
    { day: "2 Day", amount: "৳700", numericAmount: 700, dayNum: 2 },
    { day: "3 Day", amount: "৳1500", numericAmount: 1500, dayNum: 3 },
    { day: "4 Day", amount: "৳3400", numericAmount: 3400, dayNum: 4 },
    { day: "5 Day", amount: "৳6000", numericAmount: 6000, dayNum: 5 },
    { day: "6 Day", amount: "৳12000", numericAmount: 12000, dayNum: 6 },
];

export default function CheckIn() {
    const id = localStorage.getItem("userId");
    const userId = id ? parseInt(id) : 0;

    const { data: userData, isLoading } = useGetSingleUserQuery(userId, {
        skip: !userId,
        refetchOnMountOrArgChange: true,
    });

    const [claimReward, { isLoading: isClaiming }] = useClaimCheckInRewardMutation();

    const orderCount = userData?.data?.orderCountForCheckIn ?? 0;
    const totalCheckIns = userData?.data?.dailyCheckInReward?.totalCheckIns ?? 0;

    // Check if user has completed 41 orders to unlock the check-in feature
    const hasCompletedRequiredOrders = orderCount >= 41;

    const handleClaim = async (dayNum: number, amount: number) => {
        if (isClaiming) return;

        try {
            const response = await claimReward({
                userId,
                checkInAmount: amount,
            }).unwrap();

            toast.success(response?.message || "Check In reward added successfully");
            console.log(`Claimed day ${dayNum} → ৳${amount}`);
        } catch (err: any) {
            console.error("Claim failed:", err);
            const errorMessage = err?.data?.message || "Failed to claim reward";
            toast.error(errorMessage);
        }
    };

    if (isLoading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    return (
        <div>
            {/* Hero Section */}
            <div className="">
                <div className="rounded-b-lg relative bg-[url('/src/assets/check-in/checkin.jpg')] h-[280px] bg-cover bg-center flex items-center justify-center">
                    <div className="rounded-b-lg absolute inset-0 bg-black/45" />
                    <div className="relative z-10 mx-8 px-4 py-10 max-w-2xl rounded-lg shadow-xl text-center">
                        <h2 className="text-4xl text-white font-semibold mb-5">Daily Check In</h2>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="mt-5 mx-auto rounded-xl bg-white p-5 shadow">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="font-semibold text-gray-800">Daily Check in</h3>
                    {/* <p className="text-sm text-gray-600">
                        Orders: {orderCount}/41 {!hasCompletedRequiredOrders && "(Complete 41 orders to unlock)"}
                    </p> */}
                </div>

                {/* Rewards Grid */}
                <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-4 gap-2">
                        {rewards.map((item) => {
                            // Day is claimed if it's less than or equal to totalCheckIns
                            const isClaimed = item.dayNum <= totalCheckIns;

                            // Day is unlocked if:
                            // 1. User has completed 41 orders AND
                            // 2. This is the next day to claim (totalCheckIns + 1)
                            const isUnlocked = hasCompletedRequiredOrders && item.dayNum === totalCheckIns + 1;

                            // Day is locked if it's beyond the next claimable day
                            const isLocked = item.dayNum > totalCheckIns + 1;

                            return (
                                <RewardItem
                                    key={item.dayNum}
                                    {...item}
                                    isClaimed={isClaimed}
                                    isUnlocked={isUnlocked}
                                    isLocked={isLocked}
                                    hasCompletedRequiredOrders={hasCompletedRequiredOrders}
                                    onClaim={() => handleClaim(item.dayNum, item.numericAmount)}
                                    isClaiming={isClaiming}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

interface RewardItemProps {
    day: string;
    amount: string;
    numericAmount: number;
    dayNum: number;
    isClaimed?: boolean;
    isUnlocked?: boolean;
    isLocked?: boolean;
    hasCompletedRequiredOrders?: boolean;
    isClaiming?: boolean;
    onClaim: () => void;
}

function RewardItem({
    day,
    amount,
    isClaimed = false,
    isUnlocked = false,
    isLocked = false,
    hasCompletedRequiredOrders = false,
    isClaiming = false,
    onClaim,
}: RewardItemProps) {

    const handleClick = () => {
        // Can't click if already claimed or currently claiming
        if (isClaimed || isClaiming) return;

        // If not unlocked, show appropriate message
        if (!isUnlocked) {
            if (!hasCompletedRequiredOrders) {
                toast.info("Complete 41 orders to unlock check-in rewards");
            } else if (isLocked) {
                toast.info("Complete previous days first");
            }
            return;
        }

        // Claim the reward
        onClaim();
    };

    return (
        <div className="relative">
            <button
                type="button"
                onClick={handleClick}
                disabled={isClaimed || isClaiming || !isUnlocked}
                className={`
                    relative flex flex-col items-center gap-1 p-3 rounded-xl transition-all
                    ${isClaimed
                        ? "bg-green-50 border border-green-200 cursor-not-allowed"
                        : isUnlocked
                            ? "bg-blue-50 hover:bg-blue-100 border border-blue-200 active:scale-95 cursor-pointer"
                            : "bg-gray-100 border border-gray-200 cursor-not-allowed"}
                `}
            >
                {/* LOCK OVERLAY - show for locked days or if orders not completed */}
                {(isLocked || !hasCompletedRequiredOrders) && !isClaimed && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/30">
                        <BsFileLock className="text-white text-2xl" />
                    </div>
                )}

                <div
                    className={`
                        flex h-14 w-14 items-center justify-center rounded-full
                        ${isClaimed ? "bg-green-100" : isUnlocked ? "bg-blue-100" : "bg-gray-200"}
                    `}
                >
                    {isClaimed ? (
                        <span className="text-green-600 text-xl font-bold">✓</span>
                    ) : (
                        <img src={moneyBag} alt="money bag" className="h-7 w-7" />
                    )}
                </div>

                <span className="text-xs text-gray-600 font-medium">{day}</span>
                <span
                    className={`text-xs font-semibold ${isClaimed
                        ? "text-green-600"
                        : isUnlocked
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                >
                    {isClaimed ? "Claimed" : amount}
                </span>
            </button>
        </div>
    );
}