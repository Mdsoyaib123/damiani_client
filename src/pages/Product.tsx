import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
    useConfirmPurchaseOrderMutation,
    useGetPurchaseOrderQuery,
} from "@/store/api/user/userApi";
import { toast } from "sonner";
import SubmitOrderModal from "@/components/modal/SubmitOrderModal";

interface ProductSkeletonProps {
    showOrderNumber?: boolean;
}

const ProductSkeleton: React.FC<ProductSkeletonProps> = ({
    showOrderNumber = true,
}) => {
    return (
        <div className="mx-auto min-h-screen max-w-125 animate-pulse bg-white pb-28">
            {/* Top Bar */}
            <div className="flex items-center gap-3 border-b border-gray-100 bg-white px-5 py-3">
                <div className="h-4 w-4 rounded-sm bg-gray-200" />

                <div className="h-2.5 w-12 bg-gray-200" />

                {showOrderNumber && (
                    <div className="ml-auto h-2.5 w-20 bg-gray-100" />
                )}
            </div>

            {/* Product Image */}
            <div className="aspect-square w-full bg-gray-100">
                <div className="flex h-full items-center justify-center">
                    <div className="h-16 w-16 border border-gray-200 bg-gray-50" />
                </div>
            </div>

            {/* Product Info */}
            <div className="border-b border-gray-100 px-5 pb-5 pt-5">
                <div className="mb-3 flex items-center justify-between">
                    <div className="h-2.5 w-24 bg-gray-200" />
                    <div className="h-2.5 w-12 bg-gray-100" />
                </div>

                <div className="h-6 w-3/4 bg-gray-200" />
            </div>

            {/* Pricing */}
            <div className="space-y-5 border-b border-gray-100 px-5 py-5">
                <div className="flex items-center justify-between">
                    <div className="h-2.5 w-12 bg-gray-200" />
                    <div className="h-4 w-20 bg-gray-200" />
                </div>

                <div className="flex items-center justify-between">
                    <div className="h-2.5 w-20 bg-gray-200" />
                    <div className="h-4 w-24 bg-emerald-100" />
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="h-2.5 w-20 bg-gray-200" />
                    <div className="h-5 w-24 bg-gray-200" />
                </div>
            </div>

            {/* Description */}
            <div className="border-b border-gray-100 px-5 py-5">
                <div className="mb-3 h-2.5 w-24 bg-gray-200" />
                <div className="space-y-2">
                    <div className="h-2.5 w-full bg-gray-100" />
                    <div className="h-2.5 w-11/12 bg-gray-100" />
                    <div className="h-2.5 w-2/3 bg-gray-100" />
                </div>
            </div>

            {/* Fixed Bottom Actions */}
            <div className="fixed bottom-0 left-1/2 z-20 w-full max-w-125 -translate-x-1/2 border-t border-gray-100 bg-white px-5 py-4">
                <div className="mb-2 flex items-center justify-between border border-gray-100 bg-gray-50 px-4 py-3">
                    <div className="h-2.5 w-20 bg-gray-200" />
                    <div className="h-4 w-28 bg-emerald-100" />
                </div>

                <div className="h-12 w-full bg-gray-200" />
            </div>
        </div>
    );
};

const Product: React.FC = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalOpen = () => setIsModalOpen(true);
    const handleModalClose = () => setIsModalOpen(false);

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");

        if (storedUserId) {
            setUserId(Number(storedUserId));
        } else {
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
        refetchOnMountOrArgChange: true,
        refetchOnFocus: false,
        refetchOnReconnect: false,
    });

    const [confirmPurchase, { isLoading: isConfirming }] =
        useConfirmPurchaseOrderMutation();

    const product = purchaseData?.data?.product;
    const orderNumber = purchaseData?.data?.orderNumber;

    const handleBack = () => navigate("/task");

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
                    toast.error(
                        response?.data?.message || "Operation failed",
                        {
                            description: "",
                            duration: 5500,
                        }
                    );
                    return;
                }

                toast.success(
                    response?.message || "Order confirmed successfully"
                );
                navigate("/task");
            } else {
                toast.error(
                    response?.message || "Failed to confirm order"
                );
            }
        } catch (error) {
            console.error("Failed to confirm purchase:", error);
        }
    };

    const formatCurrency = (amount: number) =>
        `৳${amount?.toLocaleString()}`;

    console.log(purchaseData, "purchase data in product page");
    console.log((error as any)?.data?.message, "error in product page");

    const getOrderLabel = () => {
        if (!purchaseData?.data?.isAdminAssigned) return "(Mining Order)";

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

    /* Skeleton Loading */
    if (isLoading || isFetching) {
        return <ProductSkeleton />;
    }

    /* Error / No product */
    if (error || !product) {
        return (
            <div className="mx-auto flex h-screen max-w-125 items-center justify-center bg-white px-8">
                <div className="text-center">
                    <p className="mb-6 text-[12px] leading-relaxed text-gray-500">
                        {purchaseData?.data?.message ||
                            (error as any)?.data?.message ||
                            "Product not found"}
                    </p>

                    <button
                        onClick={handleBack}
                        className="bg-black px-8 py-2.5 text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-gray-900"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const commission =
        purchaseData?.data?.isAdminAssigned === true
            ? purchaseData?.data?.commission
            : purchaseData?.data?.product?.commission;

    const salePrice =
        purchaseData?.data?.mysteryboxMethod === "12x" ||
        purchaseData?.data?.mysteryboxMethod === "3x"
            ? purchaseData?.data?.commission +
              purchaseData?.data?.product?.price
            : purchaseData?.data?.product?.salePrice;

    return (
        <div className="mx-auto max-w-125 bg-white pb-28">
            {/* Sticky Top Bar */}
            <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-gray-100 bg-white px-5 py-3">
                <button
                    onClick={handleBack}
                    className="text-gray-400 transition-colors hover:text-black"
                    aria-label="Go back"
                >
                    <ArrowLeft className="h-4 w-4" />
                </button>

                <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400">
                        Details
                    </p>
                </div>

                {orderNumber && (
                    <span className="ml-auto text-[10px] tracking-wide text-gray-400">
                        Order #{orderNumber}
                    </span>
                )}
            </div>

            {/* Product Image */}
            <div className="aspect-square w-full overflow-hidden bg-gray-50">
                <img
                    src={product.poster}
                    alt={product.name}
                    className="h-full w-full object-contain"
                    onError={(e) => {
                        e.currentTarget.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23f3f4f6' width='400' height='400'/%3E%3C/svg%3E";
                    }}
                />
            </div>

            {/* Product Info */}
            <div className="border-b border-gray-100 px-5 pb-4 pt-5">
                <div className="mb-1.5 flex items-center justify-between">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400">
                        {getOrderLabel().replace(/[()]/g, "") || "Product"}
                    </p>

                    <span
                        className={`text-[10px] uppercase tracking-wide ${
                            product.status === "Active"
                                ? "text-emerald-500"
                                : "text-red-400"
                        }`}
                    >
                        {product.status}
                    </span>
                </div>

                <h1 className="text-xl font-light leading-snug text-black">
                    {product.name}
                </h1>
            </div>

            {/* Pricing */}
            <div className="space-y-3 border-b border-gray-100 px-5 py-4">
                <div className="flex items-baseline justify-between">
                    <span className="text-[11px] uppercase tracking-widest text-gray-400">
                        Price
                    </span>
                    <span className="text-base font-light text-black">
                        {formatCurrency(product.price)}
                    </span>
                </div>

                <div className="flex items-baseline justify-between">
                    <span className="text-[11px] uppercase tracking-widest text-gray-400">
                        Commission
                    </span>
                    <span className="text-base font-light text-emerald-600">
                        +{formatCurrency(commission)}
                    </span>
                </div>

                <div className="flex items-baseline justify-between border-t border-gray-100 pt-3">
                    <span className="text-[11px] uppercase tracking-widest text-gray-400">
                        Sale Price
                    </span>
                    <span className="text-lg font-medium text-black">
                        {formatCurrency(salePrice)}
                    </span>
                </div>
            </div>

            {/* Description */}
            {product.introduction && (
                <div className="border-b border-gray-100 px-5 py-4">
                    <p className="mb-2 text-[10px] uppercase tracking-widest text-gray-400">
                        Description
                    </p>

                    <p className="text-[12px] font-light leading-relaxed text-gray-600">
                        {product.introduction}
                    </p>
                </div>
            )}

            {/* Fixed Bottom CTAs */}
            <div className="fixed bottom-0 left-1/2 z-20 w-full max-w-125 -translate-x-1/2 border-t border-gray-100 bg-white px-5 py-4">
                {purchaseData?.data?.mysteryboxMethod && (
                    <div className="mb-2 flex items-center justify-between border border-gray-100 bg-gray-50 px-4 py-2">
                        <span className="text-[10px] uppercase tracking-widest text-gray-400">
                            Earn Profit
                        </span>

                        <span className="text-sm font-medium text-emerald-600">
                            {purchaseData?.data?.mysteryboxMethod === "12x"
                                ? "12×"
                                : purchaseData?.data?.mysteryboxMethod === "cash"
                                  ? "Cash"
                                  : "3×"}{" "}
                            — {formatCurrency(purchaseData?.data?.commission)}
                        </span>
                    </div>
                )}

                {!purchaseData?.data?.mysteryboxMethod && (
                    <div className="mb-2 flex items-center justify-between border border-gray-100 bg-gray-50 px-4 py-2">
                        <span className="text-[10px] uppercase tracking-widest text-gray-400">
                            Earn Profit
                        </span>

                        <span className="text-sm font-light text-emerald-600">
                            {formatCurrency(commission)}
                        </span>
                    </div>
                )}

                <button
                    onClick={handleModalOpen}
                    disabled={isConfirming}
                    className={`w-full py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors ${
                        isConfirming
                            ? "cursor-not-allowed bg-gray-300 text-gray-400"
                            : "cursor-pointer bg-black text-white hover:bg-gray-900"
                    }`}
                >
                    {isConfirming ? "Processing…" : "Submit Order"}
                </button>
            </div>

            <SubmitOrderModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSubmit={handleSubmit}
                isConfirming={isConfirming}
            />
        </div>
    );
};

export default Product;