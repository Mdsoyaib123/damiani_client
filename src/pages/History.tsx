import {
  Loader2,
  ArrowDownLeft,
  CalendarClock,
  Wallet,
  ArrowDownToLine,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import {
  useGetHistoryQuery,
  useGetSingleWithdrawHistoryQuery,
} from "@/store/api/withdraw/withdrawApi";

type HistoryType = "withdraw" | "other";
type SubHistoryType = "checkIn" | "recharge";
type TransactionHistoryType = SubHistoryType | "withdraw";

interface HistoryItem {
  _id: string;
  userId: string;
  historyType: TransactionHistoryType;
  amount: number;
  notes?: string;
  time: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const History = () => {
  const [activeTab, setActiveTab] = useState<HistoryType>("withdraw");
  const [subTab, setSubTab] = useState<SubHistoryType>("checkIn");

  const userId = localStorage.getItem("mongodbId") || "";

  const storedUserId = localStorage.getItem("userId");
  const singleWithdrawUserId = storedUserId
    ? Number.parseInt(storedUserId, 10)
    : 0;

  const {
    data: withdrawData,
    isLoading: withdrawLoading,
    error: withdrawError,
  } = useGetSingleWithdrawHistoryQuery(
    { userId: singleWithdrawUserId },
    {
      skip: activeTab !== "withdraw" || !singleWithdrawUserId,
    },
  );

  const {
    data: otherData,
    isLoading: otherLoading,
    error: otherError,
  } = useGetHistoryQuery(
    { userId, historyType: subTab },
    {
      skip: activeTab !== "other" || !userId,
    },
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return "N/A";

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const formatAmount = (amount?: number) => {
    if (
      amount === undefined ||
      amount === null ||
      !Number.isFinite(Number(amount))
    ) {
      return "৳0.00";
    }

    return `৳${Number(amount).toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const isLoading =
    activeTab === "withdraw" ? withdrawLoading : otherLoading;

  const hasError = Boolean(
    activeTab === "withdraw" ? withdrawError : otherError,
  );

  const hasData: boolean =
    activeTab === "withdraw"
      ? (withdrawData?.data?.length ?? 0) > 0
      : (otherData?.data?.length ?? 0) > 0;

  const tabs: { label: string; value: HistoryType }[] = [
    { label: "Withdrawals", value: "withdraw" },
    { label: "Other activity", value: "other" },
  ];

  const subTabs: {
    label: string;
    value: SubHistoryType;
  }[] = [
    { label: "Check in", value: "checkIn" },
    { label: "Recharge", value: "recharge" },
  ];

  const getTransactionLabel = (type: SubHistoryType) =>
    type === "checkIn" ? "Check in" : "Recharge";

  const getTransactionIcon = (type: SubHistoryType) => {
    switch (type) {
      case "checkIn":
        return <CheckCircle2 className="h-4 w-4" />;
      case "recharge":
        return <ArrowDownToLine className="h-4 w-4" />;
    }
  };

  const getStatusStyle = (status?: string) => {
    const normalizedStatus = status?.toLowerCase();

    if (
      normalizedStatus === "approved" ||
      normalizedStatus === "completed"
    ) {
      return "border-emerald-100 text-emerald-700";
    }

    if (normalizedStatus === "pending") {
      return "border-amber-100 text-amber-700";
    }

    if (
      normalizedStatus === "rejected" ||
      normalizedStatus === "failed"
    ) {
      return "border-red-100 text-red-500";
    }

    return "border-gray-200 text-gray-500";
  };

  return (
    <main className="min-h-screen bg-white pb-10">
      <div className="mx-auto max-w-125">
        {/* Page heading */}
        <header className="border-b border-gray-100 px-5 pb-6 pt-8">
          <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-gray-400">
            Your account
          </p>

          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-light tracking-tight text-black">
                Transaction history
              </h1>

              <p className="mt-2 text-xs text-gray-400">
                A detailed record of your account activity.
              </p>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-gray-100">
              <Wallet className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </header>

        {/* Main tabs */}
        <div className="border-b border-gray-100 px-5">
          <div className="flex gap-7">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.value;

              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveTab(tab.value)}
                  className={`relative py-4 text-[10px] uppercase tracking-[0.15em] transition-colors ${
                    isActive
                      ? "text-black"
                      : "text-gray-400 hover:text-gray-700"
                  }`}
                >
                  {tab.label}

                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-px bg-black" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary tabs */}
        {activeTab === "other" && (
          <div className="px-5 pt-5">
            <div className="flex flex-wrap gap-2">
              {subTabs.map((tab) => {
                const isActive = subTab === tab.value;

                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setSubTab(tab.value)}
                    className={`border px-4 py-2.5 text-[10px] uppercase tracking-[0.12em] transition-colors ${
                      isActive
                        ? "border-black bg-black text-white"
                        : "border-gray-200 bg-white text-gray-500 hover:border-gray-400"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Transaction section heading */}
        <div className="flex items-center justify-between gap-3 px-5 pb-4 pt-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
              {activeTab === "withdraw"
                ? "Withdrawal records"
                : `${getTransactionLabel(subTab)} records`}
            </p>

            <p className="mt-1.5 text-xs text-gray-500">
              {activeTab === "withdraw"
                ? "Your withdrawal requests and their status."
                : `Your ${getTransactionLabel(subTab).toLowerCase()} activity.`}
            </p>
          </div>

          <RefreshCw className="h-3.5 w-3.5 shrink-0 text-gray-300" />
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />

            <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-gray-400">
              Loading transactions
            </p>
          </div>
        )}

        {/* Error state */}
        {!isLoading && hasError && (
          <div className="mx-5 border border-gray-100 px-5 py-12 text-center">
            <p className="text-sm font-light text-black">
              Unable to load transactions
            </p>

            <p className="mt-2 text-xs text-gray-400">
              Something went wrong. Please try again later.
            </p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !hasError && !hasData && (
          <div className="mx-5 border border-gray-100 px-5 py-16 text-center">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center border border-gray-100">
              <Wallet className="h-5 w-5 text-gray-300" />
            </div>

            <h2 className="text-base font-light text-black">
              No transactions found
            </h2>

            <p className="mt-2 text-xs leading-relaxed text-gray-400">
              You don&apos;t have any{" "}
              {activeTab === "withdraw"
                ? "withdrawal"
                : getTransactionLabel(subTab).toLowerCase()}{" "}
              transactions yet.
            </p>
          </div>
        )}

        {/* Withdrawal history */}
        {!isLoading &&
          !hasError &&
          activeTab === "withdraw" &&
          (withdrawData?.data?.length ?? 0) > 0 && (
            <div className="px-5">
              <div className="border-t border-gray-100">
                {withdrawData!.data!.map((item) => (
                  <article
                    key={item._id}
                    className="border-b border-gray-100 py-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-red-100 text-red-500">
                          <ArrowDownLeft className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-sm font-normal text-black">
                            Withdrawal
                          </h3>

                          <p className="mt-1.5 text-[10px] leading-relaxed text-gray-400">
                            {formatDate(item.applicationTime)}
                          </p>

                          <p className="mt-2 text-[9px] uppercase tracking-[0.12em] text-gray-400">
                            Transaction ID
                          </p>

                          <p className="mt-1 break-all text-[10px] text-gray-600">
                            {item._id}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-sm font-medium tabular-nums text-red-500">
                          -
                          {formatAmount(
                            item.withdrawalAmount ?? item.amount,
                          )}
                        </p>

                        <span
                          className={`mt-2 inline-block border px-2 py-1 text-[9px] uppercase tracking-[0.1em] ${getStatusStyle(
                            item.transactionStatus,
                          )}`}
                        >
                          {item.transactionStatus || "Unknown"}
                        </span>
                      </div>
                    </div>

                    {/* Additional withdrawal details */}
                    {(item.bankName ||
                      item.processingTime ||
                      item.reviewRemark) && (
                      <div className="ml-[52px] mt-5 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-gray-100 pt-4">
                        {item.bankName && (
                          <div className="min-w-0">
                            <p className="text-[9px] uppercase tracking-[0.14em] text-gray-400">
                              Bank name
                            </p>

                            <p className="mt-1.5 break-words text-xs text-gray-700">
                              {item.bankName}
                            </p>
                          </div>
                        )}

                        {item.processingTime && (
                          <div className="min-w-0">
                            <p className="text-[9px] uppercase tracking-[0.14em] text-gray-400">
                              Processing time
                            </p>

                            <p className="mt-1.5 text-xs text-gray-700">
                              {formatDate(item.processingTime)}
                            </p>
                          </div>
                        )}

                        {item.reviewRemark && (
                          <div className="col-span-2">
                            <p className="text-[9px] uppercase tracking-[0.14em] text-gray-400">
                              Review remark
                            </p>

                            <p className="mt-1.5 text-xs leading-relaxed text-gray-600">
                              {item.reviewRemark}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          )}

        {/* Check-in and recharge history */}
        {!isLoading &&
          !hasError &&
          activeTab === "other" &&
          (otherData?.data?.length ?? 0) > 0 && (
            <div className="px-5">
              <div className="border-t border-gray-100">
                {otherData!.data!.map((item: HistoryItem) => {
                  const isCheckIn = item.historyType === "checkIn";
                  const title = item.notes || item.historyType;

                  return (
                    <article
                      key={item._id}
                      className="border-b border-gray-100 py-5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center border ${
                              isCheckIn
                                ? "border-gray-200 text-gray-600"
                                : "border-emerald-100 text-emerald-600"
                            }`}
                          >
                            {item.historyType === "checkIn" ||
                            item.historyType === "recharge" ? (
                              getTransactionIcon(item.historyType)
                            ) : (
                              <Wallet className="h-4 w-4" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <h3 className="break-words text-sm font-normal capitalize text-black">
                              {title}
                            </h3>

                            <p className="mt-1.5 text-[10px] text-gray-400">
                              {formatDate(item.time)}
                            </p>

                            <p className="mt-2 text-[9px] uppercase tracking-[0.12em] text-gray-400">
                              {isCheckIn
                                ? "Check-in activity"
                                : "Account recharge"}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="text-sm font-medium tabular-nums text-emerald-600">
                            +{formatAmount(item.amount)}
                          </p>

                          <p className="mt-2 text-[9px] uppercase tracking-[0.12em] text-gray-400">
                            {item.historyType === "withdraw"
                              ? "Withdrawal"
                              : getTransactionLabel(item.historyType)}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

        {/* Footer */}
        {!isLoading && !hasError && hasData && (
          <div className="flex items-center justify-center gap-2 px-5 pt-5">
            <CalendarClock className="h-3.5 w-3.5 text-gray-300" />

            <p className="text-[9px] uppercase tracking-[0.15em] text-gray-400">
              Transaction history
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default History;