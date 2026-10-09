import { useGetHistoryQuery, useGetSingleWithdrawHistoryQuery } from '@/store/api/withdraw/withdrawApi';
import { useState } from 'react';

type HistoryType = 'withdraw' | 'other';

interface HistoryItem {
    _id: string;
    userId: string;
    historyType: 'checkIn' | 'withdraw' | 'recharge';
    amount: number;
    notes?: string;
    time: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

const History = () => {
    const [activeTab, setActiveTab] = useState<HistoryType>('withdraw');
    const [subTab, setSubTab] = useState<'checkIn' | 'recharge'>('checkIn');

    const id = localStorage.getItem("mongodbId");
    const userId = id ? id : "";

    const singleWithdrawId = localStorage.getItem("userId");
    const singleWithdrawUserId = singleWithdrawId ? parseInt(singleWithdrawId, 10) : 0;

    // Fetch withdraw history using the new API
    const {
        data: withdrawData,
        isLoading: withdrawLoading,
        error: withdrawError
    } = useGetSingleWithdrawHistoryQuery(
        { userId: singleWithdrawUserId },
        { skip: activeTab !== 'withdraw' || !singleWithdrawUserId }
    );

    // Fetch checkIn/recharge history using the old API
    const {
        data: otherData,
        isLoading: otherLoading,
        error: otherError
    } = useGetHistoryQuery(
        { userId, historyType: subTab },
        { skip: activeTab !== 'other' }
    );

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid Date';
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'Invalid Date';
        }
    };

    const formatAmount = (amount: number | undefined) => {
        if (amount === undefined || amount === null || isNaN(amount)) return '৳0.00';

        return amount.toLocaleString('en-US', {
            style: 'currency',
            currency: 'BDT',
            currencyDisplay: 'symbol',
        });
    };


    const getHistoryIcon = (type: 'checkIn' | 'withdraw' | 'recharge') => {
        switch (type) {
            case 'checkIn':
                return '✓';
            case 'withdraw':
                return '↓';
            case 'recharge':
                return '↑';
        }
    };

    const getHistoryColor = (type: 'checkIn' | 'withdraw' | 'recharge') => {
        switch (type) {
            case 'checkIn':
                return 'text-blue-600';
            case 'withdraw':
                return 'text-red-600';
            case 'recharge':
                return 'text-green-600';
        }
    };

    const tabs: { label: string; value: HistoryType }[] = [
        { label: 'Withdraw', value: 'withdraw' },
        { label: 'Check In & Recharge', value: 'other' }
    ];

    const subTabs: { label: string; value: 'checkIn' | 'recharge' }[] = [
        { label: 'Check In', value: 'checkIn' },
        { label: 'Recharge', value: 'recharge' }
    ];

    const isLoading = activeTab === 'withdraw' ? withdrawLoading : otherLoading;
    const error = activeTab === 'withdraw' ? withdrawError : otherError;
    const hasData = activeTab === 'withdraw'
        ? withdrawData?.data && withdrawData.data.length > 0
        : otherData?.data && otherData.data.length > 0;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Transaction History</h1>

            {/* Main Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === tab.value
                            ? 'border-b-2 border-blue-500 text-blue-600'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Sub Tabs for Check In & Recharge */}
            {activeTab === 'other' && (
                <div className="flex border-b border-gray-200 mb-6">
                    {subTabs.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setSubTab(tab.value)}
                            className={`px-6 py-3 font-medium text-sm transition-colors ${subTab === tab.value
                                ? 'border-b-2 border-green-500 text-green-600'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Content */}
            <div className="bg-white rounded-lg shadow">
                {isLoading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {/* {!isLoading && error && (
                    <div className="p-12 text-center text-red-500">
                        <p className="text-lg font-semibold">Error loading history</p>
                        <p className="text-sm mt-2">Please try again later</p>
                    </div>
                )} */}

                {!isLoading && !error && !hasData && (
                    <div className="p-12 text-center text-gray-500">
                        <p className="text-lg font-semibold">No transactions found</p>
                        <p className="text-sm mt-2">
                            You haven't made any {activeTab === 'withdraw' ? 'withdraw' : subTab} transactions yet
                        </p>
                    </div>
                )}

                {/* Withdraw History (Multiple Items) */}
                {!isLoading && !error && activeTab === 'withdraw' && withdrawData?.data && withdrawData.data.length > 0 && (
                    <div className="divide-y divide-gray-100">
                        {withdrawData.data.map((item) => (
                            <div key={item._id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-100">
                                            <span className="lg:text-xl text-red-600">↓</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">Withdraw</p>
                                            <p className="lg:text-sm text-xs text-gray-500">
                                                {formatDate(item.applicationTime)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-md font-bold text-red-600">
                                            -{formatAmount(item.withdrawalAmount || item.amount)}
                                        </p>
                                        <span className={`text-xs px-2 py-1 rounded ${item.transactionStatus === 'APPROVED' || item.transactionStatus === 'completed'
                                            ? 'bg-green-100 text-green-800'
                                            : item.transactionStatus === 'pending'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {item.transactionStatus || 'Unknown'}
                                        </span>
                                    </div>
                                </div>

                                {/* Additional Withdraw Details */}
                                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                                    {item.bankName && (
                                        <div>
                                            <p className="lg:text-xs text-gray-500">Bank Name</p>
                                            <p className="font-medium">{item.bankName}</p>
                                        </div>
                                    )}
                                    {item.processingTime && (
                                        <div>
                                            <p className="text-xs text-gray-500">Processing Time</p>
                                            <p className="font-medium">{formatDate(item.processingTime)}</p>
                                        </div>
                                    )}
                                    {item.reviewRemark && (
                                        <div className="col-span-2">
                                            <p className="text-xs text-gray-500">Review Remark</p>
                                            <p className="font-medium">{item.reviewRemark}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Check In & Recharge History (Multiple Items) */}
                {!isLoading && !error && activeTab === 'other' && otherData?.data && otherData.data.length > 0 && (
                    <div className="divide-y divide-gray-100">
                        {otherData.data.map((item: HistoryItem) => (
                            <div
                                key={item._id}
                                className="p-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.historyType === 'checkIn' ? 'bg-blue-100' : 'bg-green-100'
                                            }`}>
                                            <span className={`text-xl ${getHistoryColor(item.historyType)}`}>
                                                {getHistoryIcon(item.historyType)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800 capitalize">
                                                {item?.notes ? item?.notes : item?.historyType}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {formatDate(item.time)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-md font-bold ${getHistoryColor(item.historyType)}`}>
                                            +{formatAmount(item.amount)}
                                        </p>
                                    </div>
                                </div>
                                {/* {
                                    item?.notes && (
                                        <p className="text-sm text-gray-500 mt-3">
                                            Notes: {item.notes}
                                        </p>
                                    )
                                } */}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;