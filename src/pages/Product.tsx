import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useConfirmPurchaseOrderMutation, useGetPurchaseOrderQuery } from "@/store/api/user/userApi";
import { toast } from "sonner";
import SubmitOrderModal from "@/components/modal/SubmitOrderModal";



const Product: React.FC = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    // Get userId from localStorage
    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            setUserId(Number(storedUserId));
        } else {
            // If no userId, redirect to login or home
            navigate("/");
        }
    }, [navigate]);

    const {
        data: purchaseData,
        isLoading,
        isFetching,
        error,
    } = useGetPurchaseOrderQuery(userId!, {
        skip: !userId,
        // Force refetch on component mount
        refetchOnMountOrArgChange: true,
        refetchOnFocus: false,        // NEW: Don't refetch when tab gains focus
        refetchOnReconnect: false,
    });

    const [confirmPurchase, { isLoading: isConfirming }] =
        useConfirmPurchaseOrderMutation();

    const product = purchaseData?.data?.product;
    const orderNumber = purchaseData?.data?.orderNumber;

    const handleBack = () => {
        navigate("/task");
    };

    const handleSubmit = async () => {
        handleModalOpen();
        if (!userId || !product?.productId) return;

        try {
            const response = await confirmPurchase({
                userId,
                productId: product.productId,
            }).unwrap();
            if (response?.success === true) {
                if (response?.data?.success === false) {
                    // This is the case you want to catch and show as error/warning
                    toast.error(response?.data?.message || "Operation failed", {
                        description: "",
                        duration: 5500,
                    });
                    // Optional: you can decide NOT to redirect in this case
                    return;
                }

                // Normal success case → inner success is true or not present
                toast.success(response?.message || "Order confirmed successfully");
                navigate("/task");
            } else {
                // Outer success === false
                toast.error(response?.message || "Failed to confirm order");
            }
        } catch (error) {
            console.error("Failed to confirm purchase:", error);
            // You can add error handling/toast notification here
        }
    };

    const formatCurrency = (amount: number) => {
        return `৳${amount?.toLocaleString()}`;
    };

    console.log(purchaseData, "purchase data in product page")

    const getOrderLabel = () => {
        if (!purchaseData?.data?.isAdminAssigned) {
            return "(Mining Order)";
        }

        if (
            purchaseData?.data?.mysteryboxMethod === "12x" &&
            purchaseData?.data?.mysteryboxAmount === "12x"
        ) {
            return "(Crown Order)";
        }

        if (
            purchaseData?.data?.outOfBalance > 0 &&
            purchaseData?.data?.mysteryboxMethod == "3x"
        ) {
            return "(Supreme Order)";
        }

        return "";
    };

    console.log((error as any)?.data?.message, "error in product page")


    if (isLoading || isFetching) {
        return (
            <div className="max-w-[500px] mx-auto bg-white h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading product...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="max-w-[500px] mx-auto bg-white h-screen flex items-center justify-center">
                <div className="text-center px-4">
                    <p className="text-red-500 mb-4">{purchaseData?.data?.message || (error as any)?.data?.message}</p>
                    <button
                        onClick={handleBack}
                        className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[500px] mx-auto bg-white pb-32">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleBack}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">Product Details</h1>
                </div>
            </div>

            {/* Order Number Badge */}
            {orderNumber && (
                <div className="px-4 py-3 bg-gray-50">
                    <div className="inline-block px-3 py-1 bg-gray-900 text-white text-sm font-medium rounded">
                        Order #{orderNumber}
                    </div>
                </div>
            )}

            {/* Product Image */}
            <div className="w-full h-[300px] object-contain bg-gray-100 overflow-hidden">
                <img
                    src={product.poster}
                    alt={product.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                        e.currentTarget.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23e5e7eb' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='20'%3ENo Image%3C/text%3E%3C/svg%3E";
                    }}
                />
            </div>

            {/* Product Information */}
            <div className="p-4 space-y-4">
                {/* Product Name */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        {product.name} {getOrderLabel()}
                    </h2>
                    <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded ${product.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                            }`}
                    >
                        {product.status}
                    </span>
                </div>

                {/* Pricing Information */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Price:</span>
                        <span className="text-xl font-bold text-gray-900">
                            {formatCurrency(product.price)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Commission:</span>
                        <span className="text-lg font-semibold text-green-600">
                            +{purchaseData?.data?.isAdminAssigned === true ? formatCurrency(purchaseData?.data?.commission) : formatCurrency(purchaseData?.data?.product?.commission)}
                        </span>
                    </div>

                    <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium">Sale Price:</span>
                            <span className="text-2xl font-bold text-gray-900">
                                {purchaseData?.data?.mysteryboxMethod === "12x" || purchaseData?.data?.mysteryboxMethod === "3x" ? formatCurrency(purchaseData?.data?.commission + purchaseData?.data?.product?.price) : formatCurrency(purchaseData?.data?.product?.salePrice)}
                            </span>
                        </div>
                        {/* {
                            purchaseData?.data?.outOfBalance && (
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-gray-600 font-medium">Out of Balance: </span>
                                    <span className="text-2xl font-bold text-red-500">
                                        {formatCurrency(purchaseData.data.outOfBalance)}
                                    </span>
                                </div>
                            )
                        } */}
                    </div>
                </div>

                {/* Product Introduction */}
                {product.introduction && (
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Description
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            {product.introduction}
                        </p>
                    </div>
                )}

                {/* Additional Info */}
                {/* <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex justify-between">
                        <span>Product ID:</span>
                        <span className="font-medium text-gray-700">
                            {product.productId}
                        </span>
                    </div>
                    {purchaseData?.data?.isAdminAssigned !== undefined && (
                        <div className="flex justify-between">
                            <span>Admin Assigned:</span>
                            <span className="font-medium text-gray-700">
                                {purchaseData.data.isAdminAssigned ? "Yes" : "No"}
                            </span>
                        </div>
                    )}
                </div> */}
            </div>

            {/* Bottom Action Buttons */}
            <div className="fixed bottom-24 left-0 right-0 bg-white border-t border-gray-200 p-2 max-w-[500px] mx-auto">
                <div className="grid grid-cols-2 gap-3">

                    <button
                        onClick={handleModalOpen}
                        disabled={isConfirming}
                        className={`
              lg:py-4 lg:px-6 rounded-lg font-semibold cursor-pointer lg:text-lg transition-colors
              ${isConfirming
                                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                : "bg-gray-900 text-white hover:bg-gray-800"
                            }
            `}
                    >
                        Submit Order
                    </button>
                    {purchaseData?.data?.mysteryboxMethod ? (
                        <div className="lg:py-4 lg:px-6 py-2 px-4 bg-green-100 text-green-800 rounded-lg font-semibold text-lg text-center">
                            <div className="flex flex-col items-center">
                                {purchaseData?.data?.mysteryboxMethod === "12x" ? (
                                    <span>Earn Profit: <span className="lg:text-2xl text-xl">12x</span></span>
                                ) : purchaseData?.data?.mysteryboxMethod === "cash" ? (
                                    <span>Earn Profit: <span className="lg:text-2xl text-xl">Cash</span></span>
                                ) : (
                                    <span>Earn Profit: <span className="lg:text-2xl text-xl">3x</span></span>
                                )}
                                <span className="lg:text-lg text-base font-bold text-start">{formatCurrency(purchaseData?.data?.commission)}</span>
                            </div>
                        </div>
                    ) : (
                        <button
                            // onClick={handleBack}
                            className="py-4 px-6 bg-gray-200  text-gray-900 rounded-lg font-semibold text-lg transition-colors"
                            disabled={isConfirming}
                        >
                            Earn Profit: {formatCurrency(purchaseData?.data?.commission)}
                        </button>
                    )}
                </div>
            </div>
            <SubmitOrderModal isOpen={isModalOpen} onClose={handleModalClose} onSubmit={handleSubmit} isConfirming={isConfirming} />
        </div>
    );
};

export default Product;