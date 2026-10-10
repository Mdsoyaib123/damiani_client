import React from "react";

interface AccountDetails {
    name: string;
    userId: number;
    quantityOfOrders: number;
    userBalance: number;
    memberTotalRecharge: number;
    userType: string;
    dailyProfit: number;
    outOfBalance: number;
    completedOrdersCount: number;
    trialRoundBalance: number;
}

interface AccountDetailsModalProps {
    open: boolean;
    onClose: () => void;
    data: AccountDetails;
}

const AccountDetailsModal: React.FC<AccountDetailsModalProps> = ({
    open,
    onClose,
    data,
}) => {
    if (!open) return null;

    const formatMoney = (amount: number) =>
        Number(amount || 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    const details = [
        {
            label: "Available Balance",
            value: formatMoney(data?.userBalance),
            valueClass: "text-neutral-950",
        },
        {
            label: "Daily Profit",
            value: formatMoney(data?.dailyProfit),
            valueClass: "text-emerald-700",
        },
        {
            label: "Insufficient Balance",
            value: formatMoney(data?.outOfBalance),
            valueClass:
                data?.outOfBalance !== 0
                    ? "text-red-600"
                    : "text-neutral-800",
        },
        {
            label: "Current Mining Order",
            value: `${data?.completedOrdersCount} / 25`,
            valueClass: "text-neutral-950",
        },
        {
            label: "Trial Amount",
            value: formatMoney(data?.trialRoundBalance),
            valueClass: "text-neutral-950",
        },
    ];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="account-details-title"
                className="w-full max-w-[420px] overflow-hidden border border-neutral-200 bg-white shadow-xl"
                onClick={(event) => event.stopPropagation()}
            >
                {/* Header */}
                <header className="border-b border-neutral-200 px-5 py-5 sm:px-6">
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">
                        Account Overview
                    </p>

                    <div className="mt-2 flex items-center justify-between gap-3">
                        <h2
                            id="account-details-title"
                            className="text-xl font-medium tracking-tight text-neutral-950"
                        >
                            Account Details
                        </h2>

                        <span className="text-xs text-neutral-400">
                            #{data?.userId}
                        </span>
                    </div>
                </header>

                {/* Primary balance */}
                <section className="px-5 py-5 sm:px-6">
                    <p className="text-xs text-neutral-500">
                        Available Balance
                    </p>

                    <p className="mt-2 text-3xl font-light tracking-tight tabular-nums text-neutral-950">
                        {formatMoney(data?.userBalance)}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3">
                        <span className="text-xs text-neutral-500">
                            Daily Profit
                        </span>

                        <span className="text-sm font-medium tabular-nums text-emerald-700">
                            {formatMoney(data?.dailyProfit)}
                        </span>
                    </div>
                </section>

                {/* Account metrics */}
                <section className="border-t border-neutral-200 px-5 sm:px-6">
                    <div className="grid grid-cols-2">
                        {details.slice(2).map((item, index) => (
                            <div
                                key={item.label}
                                className={`min-w-0 py-4 ${
                                    index % 2 === 0
                                        ? "border-r border-neutral-200 pr-3"
                                        : "pl-4"
                                } ${
                                    index < 2
                                        ? "border-b border-neutral-200"
                                        : ""
                                }`}
                            >
                                <p className="text-xs leading-5 text-neutral-500">
                                    {item.label}
                                </p>

                                <p
                                    className={`mt-1 break-words text-sm font-medium tabular-nums ${item.valueClass}`}
                                >
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-neutral-200 px-5 py-4 sm:px-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-11 w-full bg-neutral-950 px-4 text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
                    >
                        Close
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default AccountDetailsModal;