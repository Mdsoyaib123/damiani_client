import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  CheckCircle2,
  Loader2,
  Building2,
  Smartphone,
  ShieldCheck,
} from "lucide-react";
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

  const navigate = useNavigate();

  const id = localStorage.getItem("userId");
  const currentUserId = id ? Number(id) : null;

  const {
    data: userData,
    isLoading: isLoadingUser,
    error: userError,
  } = useGetSingleUserQuery(currentUserId!, {
    skip: !currentUserId,
    refetchOnMountOrArgChange: true,
  });

  const [createWithdraw, { isLoading: isCreatingWithdraw }] =
    useCreateWithdrawMutation();

  const user = userData?.data;

  const handleConfirmWithPassword = async (password: string) => {
    if (!user) return;

    try {
      const result = await createWithdraw({
        userId: user.userId,
        amount: Number(amount),
        withdrawPassword: password,
      }).unwrap();

      if (result.success) {
        toast.success(
          result.message || "Withdrawal request created successfully",
        );
        setAmount("");
        setIsPasswordModalOpen(false);
        navigate("/index");
      } else {
        toast.error(result.message || "Failed to create withdrawal request");
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to create withdrawal request",
      );
    }
  };

  if (isLoadingUser) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-neutral-500" />
      </div>
    );
  }

  if (userError || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <p className="font-medium text-neutral-900">
            Failed to load user data
          </p>
          <p className="mt-2 text-sm text-neutral-500">
            Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const hasWithdrawalAddress = Boolean(user.withdrawalAddressAndMethod);
  const withdrawalDetails = user.withdrawalAddressAndMethod;

  const withdrawalMethod = withdrawalDetails?.withdrawMethod;
  const isBankTransfer = withdrawalMethod === "BankTransfer";
  const isMobileBanking = withdrawalMethod === "MobileBanking";

  const displayName = isBankTransfer
    ? withdrawalDetails?.bankName || ""
    : isMobileBanking
      ? withdrawalDetails?.mobileBankingName || ""
      : "";

  const displayAccountNumber = isBankTransfer
    ? withdrawalDetails?.bankAccountNumber?.toString() || ""
    : isMobileBanking
      ? withdrawalDetails?.mobileBankingAccountNumber?.toString() || ""
      : "";

  const maskAddress = (address: string) => {
    if (!address || address.length < 7) return address;

    return `${address.slice(0, 3)}${"*".repeat(6)}${address.slice(-4)}`;
  };

  const withdrawAmount = Number(amount);

  const handleSellOutClick = () => {
    if (!hasWithdrawalAddress) {
      toast.error("Please set up your withdrawal address first");
      return;
    }

    if (
      !amount.trim() ||
      !Number.isFinite(withdrawAmount) ||
      withdrawAmount < 500
    ) {
      toast.error("Minimum Sell Out is ৳500");
      return;
    }

    if (withdrawAmount > user.userBalance) {
      toast.error("Insufficient balance");
      return;
    }

    if (!user.withdrawPassword) {
      navigate("/withdraw-password");
      return;
    }

    setIsPasswordModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-neutral-50/70 px-3 py-5 sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-5xl">
        {/* Page heading */}
        <div className="mb-6 sm:mb-8">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
            Wallet
          </p>

          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            Sell Out
          </h1>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
            Withdraw your available funds to your registered account.
          </p>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[1.35fr_0.85fr] lg:gap-6">
          {/* Left column */}
          <div className="min-w-0 space-y-5">
            {/* Wallet balance */}
            <Card className="overflow-hidden rounded-xl border-0 bg-neutral-900 text-white shadow-sm">
              <CardContent className="flex items-center justify-between gap-4 p-5 sm:p-7">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-neutral-400">
                    Available wallet balance
                  </p>

                  <p className="mt-3 break-words text-3xl font-semibold tracking-tight sm:text-4xl">
                    ৳ {user.userBalance.toLocaleString()}
                  </p>

                  <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-neutral-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    Available for withdrawal
                  </div>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 sm:h-14 sm:w-14">
                  <Wallet className="h-6 w-6 text-neutral-200" />
                </div>
              </CardContent>
            </Card>

            {/* Withdrawal form */}
            <Card className="rounded-xl border-neutral-200 bg-white shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="mb-6 border-b border-neutral-100 pb-4">
                  <h2 className="text-base font-semibold text-neutral-900">
                    Withdrawal details
                  </h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    Enter the amount you want to withdraw.
                  </p>
                </div>

                {/* Account details */}
                <div className="mb-6">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <Label className="text-sm font-medium text-neutral-700">
                      Collection address
                    </Label>

                    {hasWithdrawalAddress && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Connected
                      </span>
                    )}
                  </div>

                  <div className="flex min-w-0 items-center gap-3 rounded-lg border border-neutral-200 p-3 sm:p-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                      {isMobileBanking ? (
                        <Smartphone className="h-5 w-5 text-neutral-700" />
                      ) : (
                        <Building2 className="h-5 w-5 text-neutral-700" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-neutral-900">
                        {hasWithdrawalAddress ? displayName : "Not Set"}
                      </p>

                      <p className="mt-1 break-all text-xs text-neutral-500">
                        {hasWithdrawalAddress
                          ? maskAddress(displayAccountNumber)
                          : "Please bind your withdrawal account"}
                      </p>
                    </div>

                    {hasWithdrawalAddress && (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                    )}
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <Label
                    htmlFor="amount"
                    className="mb-3 block text-sm font-medium text-neutral-700"
                  >
                    Sell Out Amount
                  </Label>

                  <div className="flex h-12 items-center rounded-lg border border-neutral-200 transition-colors focus-within:border-neutral-500">
                    <span className="pl-4 text-base font-medium text-neutral-500">
                      ৳
                    </span>

                    <Input
                      id="amount"
                      type="number"
                      min="500"
                      max={user.userBalance}
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      disabled={!hasWithdrawalAddress || isCreatingWithdraw}
                      className="h-full min-w-0 rounded-none border-0 bg-transparent px-3 shadow-none focus-visible:ring-0"
                    />

                    <button
                      type="button"
                      onClick={() => setAmount(String(user.userBalance))}
                      disabled={
                        !hasWithdrawalAddress ||
                        user.userBalance < 500 ||
                        isCreatingWithdraw
                      }
                      className="mr-2 shrink-0 rounded-md bg-neutral-100 px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-200 disabled:opacity-40"
                    >
                      Max
                    </button>
                  </div>

                  <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs">
                    <span className="text-neutral-400">
                      Minimum withdrawal: ৳500
                    </span>

                    {amount.trim() !== "" && (
                      <span
                        className={
                          !Number.isFinite(withdrawAmount) ||
                          withdrawAmount < 500 ||
                          withdrawAmount > user.userBalance
                            ? "text-red-600"
                            : "text-emerald-700"
                        }
                      >
                        {withdrawAmount > user.userBalance
                          ? "Insufficient balance"
                          : withdrawAmount < 500
                            ? "Minimum is ৳500"
                            : "Amount available"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Amount summary */}
                <div className="mt-5 flex items-center justify-between gap-3 rounded-lg bg-neutral-50 px-4 py-3.5">
                  <span className="text-sm text-neutral-500">
                    Requested amount
                  </span>

                  <span className="text-lg font-semibold text-neutral-900">
                    ৳
                    {amount.trim() && Number.isFinite(withdrawAmount)
                      ? Math.max(0, withdrawAmount).toLocaleString()
                      : "0"}
                  </span>
                </div>

                <Button
                  onClick={handleSellOutClick}
                  disabled={
                    !hasWithdrawalAddress ||
                    isCreatingWithdraw ||
                    !amount.trim() ||
                    !Number.isFinite(withdrawAmount) ||
                    withdrawAmount < 500 ||
                    withdrawAmount > user.userBalance
                  }
                  className="mt-5 h-12 w-full rounded-lg bg-black text-sm font-medium text-white hover:bg-neutral-800 disabled:cursor-not-allowed"
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

                <p className="mt-3 text-center text-xs leading-5 text-neutral-400">
                  Confirm your withdrawal using your withdrawal password.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <aside className="min-w-0 space-y-5">
            {/* Rules */}
            <Card className="rounded-xl border-neutral-200 bg-white shadow-sm">
              <CardContent className="p-5 sm:p-6">
                <h2 className="text-base font-semibold text-neutral-900">
                  Withdrawal guidelines
                </h2>

                <p className="mt-1 text-sm leading-5 text-neutral-500">
                  Please review these details before proceeding.
                </p>

                <div className="mt-5 space-y-5">
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                      <Wallet className="h-4 w-4 text-neutral-700" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-neutral-900">
                        Minimum amount
                      </p>
                      <p className="mt-1 text-xs leading-5 text-neutral-500">
                        Each withdrawal request must be at least ৳500 and
                        cannot exceed your available balance.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                      <Building2 className="h-4 w-4 text-neutral-700" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-neutral-900">
                        Check account details
                      </p>
                      <p className="mt-1 text-xs leading-5 text-neutral-500">
                        Make sure your bank or mobile banking account number is
                        correct to avoid transfer issues.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                      <ShieldCheck className="h-4 w-4 text-neutral-700" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-neutral-900">
                        Protect your password
                      </p>
                      <p className="mt-1 text-xs leading-5 text-neutral-500">
                        Never share your withdrawal password with anyone.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security note */}
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

                <div>
                  <p className="text-sm font-semibold text-emerald-900">
                    Transaction safety
                  </p>
                  <p className="mt-1 text-xs leading-5 text-emerald-800">
                    Double-check your destination account before submitting.
                    Incorrect details may prevent a successful transfer.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <ConfirmWithdrawPasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onConfirm={handleConfirmWithPassword}
      />
    </main>
  );
};

export default CashOut;