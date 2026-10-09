import React, { useState } from "react";
import { X } from "lucide-react";

interface PackageSelectionModalProps {
    open: boolean;
    onClose: () => void;
    availableSlots: number[]; // Slots user can select
    onSelectPackage: (amount: number) => void;
    isLoading?: boolean;
}

// All possible package slots
const ALL_SLOTS = [10000, 30000, 50000, 100000, 200000, 300000, 500000, 1000000];

const PackageSelectionModal: React.FC<PackageSelectionModalProps> = ({
    open,
    onClose,
    availableSlots,
    onSelectPackage,
    isLoading = false,
}) => {
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

    if (!open) return null;

    const handleConfirm = () => {
        if (selectedAmount !== null) {
            onSelectPackage(selectedAmount);
        }
    };

    const formatAmount = (amount: number) => {
        return amount.toLocaleString();
    };

    // Check if a slot is available for selection
    const isSlotAvailable = (amount: number) => {
        return availableSlots.includes(amount);
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/35 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1a] rounded-lg w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between p-4  border-gray-200">
                    <h2 className="text-xl font-semibold text-white">
                        Select Package
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={isLoading}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4">
                    <p className="text-sm text-gray-300 mb-4">
                        Choose a package to start your orders
                    </p>

                    {/* Package Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        {ALL_SLOTS.map((amount) => {
                            const isAvailable = isSlotAvailable(amount);
                            const isSelected = selectedAmount === amount;

                            return (
                                <button
                                    key={amount}
                                    onClick={() => isAvailable && setSelectedAmount(amount)}
                                    disabled={!isAvailable}
                                    className={`
                                        py-4 px-3 rounded-lg font-medium text-center transition-all hover:bg-amber-400 hover:text-white
                                        ${isSelected
                                            ? "bg-amber-400 text-white border-3 border-amber-800 "
                                            : isAvailable
                                                ? "bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-amber-400 cursor-pointer"
                                                : "bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed opacity-50"
                                        }
                                    `}
                                >
                                    <div className="text-lg font-bold">
                                        ৳{formatAmount(amount)}
                                    </div>
                                    {!isAvailable && (
                                        <div className="text-xs mt-1">Unavailable</div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-4 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={selectedAmount === null || isLoading}
                            className={`
                                flex-1 py-3 px-4 rounded-lg font-medium transition-colors
                                ${selectedAmount === null || isLoading
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-amber-600 text-white hover:bg-amber-800"
                                }
                            `}
                        >
                            {isLoading ? "Processing..." : "Confirm"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackageSelectionModal;