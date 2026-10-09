// src/pages/CashOut.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, CheckCircle2, Loader2 } from "lucide-react";
import { useCreateWithdrawMutation } from "@/store/api/withdraw/withdrawApi";
import { useGetSingleUserQuery } from "@/store/api/user/userApi";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import ConfirmWithdrawPasswordModal from "@/components/modal/ConfirmWithdrawPasswordModal";

const CashOut = () => {
    const [amount, setAmount] = useState("");
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const navigate = useNavigate()

    // Get current user ID from auth state
    // Adjust this selector based on your actual auth state structure
    const id = localStorage.getItem("userId");
    const currentUserId = id ? Number(id) : null;

    // Fetch current user data
    const { data: userData, isLoading: isLoadingUser, error: userError } = useGetSingleUserQuery(currentUserId!, {
        skip: !currentUserId,
        refetchOnMountOrArgChange: true,
    });

    // Create withdraw mutation
    const [createWithdraw, { isLoading: isCreatingWithdraw }] = useCreateWithdrawMutation();

    const user = userData?.data;

    const handleConfirmWithPassword = async (password: string) => {
        if (!user) return;

        const withdrawAmount = Number(amount);

        try {
            const result = await createWithdraw({
                userId: user.userId,
                amount: withdrawAmount,
                withdrawPassword: password,
            }).unwrap();

            if (result.success) {
                toast.success(result.message || "Withdrawal request created successfully");
                setAmount("");
                navigate("/index");
            } else {
                toast.error(result.message || "Failed to create withdrawal request");
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to create withdrawal request");
        }
    };

    // Loading state
    if (isLoadingUser) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
            </div>
        );
    }

    // Error state
    if (userError || !userData?.data) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-600 font-medium">Failed to load user data</p>
                    <p className="text-sm text-slate-600 mt-2">Please try again later</p>
                </div>
            </div>
        );
    }

    // Check if withdrawal address is set
    const hasWithdrawalAddress = user.withdrawalAddressAndMethod !== null && user.withdrawalAddressAndMethod !== undefined;

    // Determine withdrawal method type
    const withdrawalMethod = user.withdrawalAddressAndMethod?.withdrawMethod;
    const isBankTransfer = withdrawalMethod === "BankTransfer";
    const isMobileBanking = withdrawalMethod === "MobileBanking";

    // Get appropriate details based on method
    const displayName = isBankTransfer
        ? user.withdrawalAddressAndMethod?.bankName || ""
        : isMobileBanking
            ? user.withdrawalAddressAndMethod?.mobileBankingName || ""
            : "";

    const displayAccountNumber = isBankTransfer
        ? user.withdrawalAddressAndMethod?.bankAccountNumber?.toString() || ""
        : isMobileBanking
            ? user.withdrawalAddressAndMethod?.mobileBankingAccountNumber?.toString() || ""
            : "";

    // Mask the withdrawal address (show first 3 and last 4 digits)
    const maskAddress = (address: string) => {
        if (!address || address.length < 7) return address;
        const first = address.slice(0, 3);
        const last = address.slice(-4);
        const masked = "*".repeat(6);
        return `${first}${masked}${last}`;
    };

    const handleSellOutClick = () => {
        if (!hasWithdrawalAddress) {
            toast.error("Please set up your withdrawal address first");
            return;
        }

        const withdrawAmount = Number(amount);

        if (!amount || isNaN(withdrawAmount) || withdrawAmount < 500) {
            toast.error("Minimum Sell Out is ৳500");
            return;
        }

        if (withdrawAmount > user.userBalance) {
            toast.error("Insufficient balance");
            return;
        }

        // Check if withdraw password is set
        if (!user.withdrawPassword) {
            navigate("/withdraw-password");
            return;
        }

        // Open confirmation modal
        setIsPasswordModalOpen(true);
    };

    return (
        <div className="max-w-md mx-auto p-4 space-y-4">
            <h1 className="text-2xl font-bold">Sell Out</h1>

            {/* Wallet Funds Card */}
            <Card className="bg-gradient-to-br from-slate-700 to-slate-800 text-white">
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-300 mb-1">Wallet Funds</p>
                            <p className="text-2xl font-bold tracking-wider">
                                ৳ {user.userBalance.toLocaleString()}
                            </p>
                        </div>
                        <Wallet className="h-8 w-8 text-slate-300" />
                    </div>
                </CardContent>
            </Card>

            {/* Collection Address */}
            <div>
                <Label className="text-sm font-medium text-slate-600 mb-2 block">
                    Collection Address
                </Label>
                <Card className={`${hasWithdrawalAddress ? 'border-green-200 bg-green-50' : 'border-slate-200'}`}>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-yellow-100 p-2 rounded">
                                    <span className="text-2xl">
                                        {isMobileBanking ? "📱" : "🏦"}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900">
                                        {hasWithdrawalAddress ? displayName : "Not Set"}
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        {hasWithdrawalAddress ? maskAddress(displayAccountNumber) : "Please bind account"}
                                    </p>
                                </div>
                            </div>
                            {hasWithdrawalAddress && (
                                <CheckCircle2 className="h-6 w-6 text-green-600" />
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sell Out Amount */}
            <div>
                <Label htmlFor="amount" className="text-sm font-medium text-slate-600 mb-2 block">
                    Sell Out Amount
                </Label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 font-medium">
                        ৳
                    </span>
                    <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-8 h-12 text-lg"
                        disabled={!hasWithdrawalAddress || isCreatingWithdraw}
                    />
                </div>
            </div>

            {/* Tips */}
            <Card className="bg-slate-50 border-slate-200">
                <CardContent className="pt-1">
                    <p className="text-xs font-medium text-slate-800 mb-2">Rules : Minimum Sell Out ৳500</p>
                    <p className="text-xs font-medium text-slate-700 mb-1">Tips:</p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                        Please bind in the correct bank account information. If the Sell Out is successful
                        but the bank account details are wrong, platform will not be responsible. Therefore,
                        please double-check your bank account information.
                    </p>
                </CardContent>
            </Card>

            {/* Sell Out Button */}
            <Button
                onClick={handleSellOutClick}
                disabled={!hasWithdrawalAddress || isCreatingWithdraw}
                className="w-full h-12 text-white font-medium bg-black hover:bg-slate-800 cursor-pointer disabled:cursor-not-allowed"
            >
                {isCreatingWithdraw ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                    </>
                ) : (
                    "Sell Out"
                )}
            </Button>

            <ConfirmWithdrawPasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                onConfirm={handleConfirmWithPassword}
            />
        </div>
    );
};

export default CashOut;