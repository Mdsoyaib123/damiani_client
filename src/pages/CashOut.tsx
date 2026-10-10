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
      <main className="min-h-screen bg-[#F5F5F3] px-4">
        <div className="mx-auto flex min-h-[60vh] w-full max-w-107.5 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
        </div>
      </main>
    );
  }

  if (userError || !user) {
    return (
      <main className="min-h-screen bg-[#F5F5F3] px-4">
        <div className="mx-auto flex min-h-[60vh] w-full max-w-107.5 items-center justify-center">
          <div className="text-center">
            <p className="text-sm font-medium text-neutral-900">
              Failed to load user data
            </p>
            <p className="mt-1 text-sm text-neutral-500">
              Please try again later.
            </p>
          </div>
        </div>
      </main>
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
    <main className="min-h-screen bg-[#F5F5F3] px-3 py-4 text-neutral-900 sm:px-4">
      <div className="mx-auto w-full max-w-107.5">
        {/* Header */}
        <header className="mb-5 px-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Wallet
          </p>

          <div className="mt-1 flex items-center justify-between">
            <h1 className="text-[25px] font-semibold tracking-tight text-neutral-950">
              Sell Out
            </h1>

            <div className="flex h-9 w-9 items-center justify-center border border-neutral-300 bg-white">
              <Wallet className="h-4.25 w-4.25 text-neutral-800" />
            </div>
          </div>

          <p className="mt-1 text-[13px] leading-5 text-neutral-600">
            Withdraw funds to your registered account.
          </p>
        </header>

        {/* Balance */}
        <section className="border border-neutral-900 bg-neutral-900 px-4 py-4 text-white">
          <p className="text-xs text-neutral-400">Available balance</p>

          <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
            <span className="text-xl font-medium text-neutral-300">৳</span>
            <span className="break-all text-[32px] font-semibold leading-tight tracking-tight">
              {user.userBalance.toLocaleString()}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2 border-t border-white/15 pt-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span className="text-xs text-neutral-300">
              Available for withdrawal
            </span>
          </div>
        </section>

        {/* Main form surface */}
        <div className="mt-3 border border-neutral-200 bg-white px-4 py-4">
          {/* Withdrawal account */}
          <section>
            <div className="mb-2 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-neutral-900">
                Withdrawal account
              </h2>

              {hasWithdrawalAddress && (
                <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Connected
                </span>
              )}
            </div>

            <div className="flex min-w-0 items-center gap-3 border border-neutral-200 bg-[#FAFAF9] p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-neutral-200 bg-white">
                {isMobileBanking ? (
                  <Smartphone className="h-3 w-3 text-neutral-700" />
                ) : (
                  <Building2 className="h-3 w-3 text-neutral-700" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-neutral-900">
                  {hasWithdrawalAddress ? displayName : "Not Set"}
                </p>

                <p className="mt-1 break-all text-xs text-neutral-500">
                  {hasWithdrawalAddress
                    ? maskAddress(displayAccountNumber)
                    : "Please bind your withdrawal account"}
                </p>
              </div>

              {hasWithdrawalAddress && (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              )}
            </div>
          </section>

          {/* Amount */}
          <section className="mt-5">
            <div className="mb-2 flex items-center justify-between gap-3">
              <Label
                htmlFor="amount"
                className="text-sm font-semibold text-neutral-900"
              >
                Withdrawal amount
              </Label>

              <span className="text-[11px] text-neutral-500">Min. ৳500</span>
            </div>

            <div className="flex h-12.5 items-center border border-neutral-300 bg-white transition-colors focus-within:border-neutral-900">
              <span className="pl-3 text-lg font-medium text-neutral-600">
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
                className="h-full min-w-0 rounded-none border-0 bg-transparent px-2 text-base font-medium shadow-none placeholder:text-neutral-400 focus-visible:ring-0"
              />

              <button
                type="button"
                onClick={() => setAmount(String(user.userBalance))}
                disabled={
                  !hasWithdrawalAddress ||
                  user.userBalance < 500 ||
                  isCreatingWithdraw
                }
                className="mr-2 shrink-0 border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-800 transition-colors hover:border-neutral-900 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Max
              </button>
            </div>

            <div className="mt-2 min-h-4">
              {amount.trim() !== "" ? (
                <p
                  className={`text-xs ${
                    !Number.isFinite(withdrawAmount) ||
                    withdrawAmount < 500 ||
                    withdrawAmount > user.userBalance
                      ? "text-red-600"
                      : "text-emerald-700"
                  }`}
                >
                  {withdrawAmount > user.userBalance
                    ? "Insufficient balance"
                    : withdrawAmount < 500
                      ? "Minimum withdrawal is ৳500"
                      : "Amount available"}
                </p>
              ) : (
                <p className="text-xs text-neutral-500">
                  Enter the amount you want to withdraw.
                </p>
              )}
            </div>
          </section>

          {/* Summary */}
          <section className="mt-4 border-t border-neutral-200 pt-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-neutral-600">
                Requested amount
              </span>

              <span className="text-lg font-semibold tracking-tight text-neutral-950">
                ৳
                {amount.trim() && Number.isFinite(withdrawAmount)
                  ? Math.max(0, withdrawAmount).toLocaleString()
                  : "0"}
              </span>
            </div>

            <div className="mt-1.5 flex items-center justify-between gap-3">
              <span className="text-xs text-neutral-500">
                Maximum available
              </span>

              <span className="text-xs font-medium text-neutral-700">
                ৳{user.userBalance.toLocaleString()}
              </span>
            </div>
          </section>

          {/* Submit button */}
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
            className="mt-4 h-12 w-full rounded-sm bg-neutral-900 text-sm font-medium text-white shadow-none hover:bg-neutral-800 disabled:cursor-not-allowed"
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

          <p className="mt-2 text-center text-[11px] leading-5 text-neutral-500">
            Your withdrawal password is required to confirm this transaction.
          </p>
        </div>

        {/* Security note */}
        <section className="mt-3 flex items-start gap-3 border border-neutral-200 bg-[#EEEFEA] px-3 py-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-neutral-600" />

          <div>
            <h2 className="text-xs font-semibold text-neutral-900">
              Transaction safety
            </h2>

            <p className="mt-1 text-xs leading-5 text-neutral-600">
              Check that your registered account details are correct before
              submitting. Never share your withdrawal password with anyone.
            </p>
          </div>
        </section>
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