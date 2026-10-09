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

    // console.log(data, "mahimmmm")

    const formatMoney = (amount: number) =>
        Number(amount || 0).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 ">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 bg-slate-300 rounded-t-xl">
                    <h2 className="text-lg font-semibold text-center mx-auto">Account Details</h2>
                    {/* <button onClick={onClose}>
                        <X className="w-5 h-5 text-gray-600" />
                    </button> */}
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                    {/* Full width fields */}
                    <div className="space-y-2">
                        {/* <div>
                            <p className="text-xs text-gray-500">Name</p>
                            <p className="font-medium">{data.name}</p>
                        </div> */}


                    </div>

                    {/* Two column layout */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        {/* <div>
                            <p className="text-xs text-gray-500">Orders Quantity</p>
                            <p className="font-medium">{data.quantityOfOrders}</p>
                        </div> */}

                        <div>
                            <p className="text-sm text-gray-700 font-bold">Available Balance</p>
                            <p className="font-semibold text-gray-700">
                                {formatMoney(data?.userBalance)}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-700 font-bold">Daily Profit</p>
                            <p className="font-semibold text-gray-700">
                                {formatMoney(data?.dailyProfit)}
                            </p>
                        </div>

                        {/* <div>
                            <p className="text-xs text-gray-500">Total Recharge</p>
                            <p className="font-medium">{data.memberTotalRecharge}</p>
                        </div> */}

                        <div>
                            <p className="text-sm text-gray-700 font-bold">Insufficient Balance</p>
                            <p className={`font-semibold ${data?.outOfBalance > 0 || data?.outOfBalance < 0 ? "text-red-500" : "text-gray-700"}`}>{formatMoney(data?.outOfBalance)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-700 font-bold">Current Mining Order</p>
                            <p className="text-gray-700 font-semibold ">
                                {data?.completedOrdersCount} / 25
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-700 font-bold">Trial Amount</p>
                            <p className="font-semibold text-gray-700">{formatMoney(data?.trialRoundBalance)}</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-4">
                    <button
                        onClick={onClose}
                        className="w-full py-2 bg-black cursor-pointer text-white rounded hover:bg-gray-900"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountDetailsModal;
