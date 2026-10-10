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
        <div className="mx-auto min-h-screen max-w-125 animate-pulse bg-[#f5f5f3] pb-36">
            <div className="flex items-center gap-3 border-b border-neutral-200 bg-[#f5f5f3] px-5 py-4">
                <div className="h-4 w-4 bg-neutral-200" />
                <div className="h-2.5 w-12 bg-neutral-200" />
                {showOrderNumber && (
                    <div className="ml-auto h-2.5 w-20 bg-neutral-200" />
                )}
            </div>

            <div className="aspect-square w-full bg-neutral-200" />

            <div className="border-b border-neutral-200 bg-white px-5 py-5">
                <div className="mb-3 flex items-center justify-between">
                    <div className="h-2.5 w-24 bg-neutral-200" />
                    <div className="h-2.5 w-12 bg-neutral-100" />
                </div>
                <div className="h-6 w-3/4 bg-neutral-200" />
            </div>

            <div className="space-y-5 border-b border-neutral-200 bg-white px-5 py-5">
                <div className="flex justify-between">
                    <div className="h-2.5 w-12 bg-neutral-200" />
                    <div className="h-4 w-20 bg-neutral-200" />
                </div>
                <div className="flex justify-between">
                    <div className="h-2.5 w-20 bg-neutral-200" />
                    <div className="h-4 w-24 bg-emerald-100" />
                </div>
                <div className="flex justify-between border-t border-neutral-100 pt-4">
                    <div className="h-2.5 w-20 bg-neutral-200" />
                    <div className="h-5 w-24 bg-neutral-200" />
                </div>
            </div>

            <div className="border-b border-neutral-200 bg-white px-5 py-5">
                <div className="mb-3 h-2.5 w-24 bg-neutral-200" />
                <div className="space-y-2">
                    <div className="h-2.5 w-full bg-neutral-100" />
                    <div className="h-2.5 w-11/12 bg-neutral-100" />
                    <div className="h-2.5 w-2/3 bg-neutral-100" />
                </div>
            </div>

            <div className="fixed bottom-0 left-1/2 z-20 w-full max-w-125 -translate-x-1/2 border-t border-neutral-200 bg-[#f5f5f3] px-5 py-4">
                <div className="mb-2 flex items-center justify-between border border-neutral-200 bg-white px-4 py-3">
                    <div className="h-2.5 w-20 bg-neutral-200" />
                    <div className="h-4 w-28 bg-emerald-100" />
                </div>
                <div className="h-12 w-full bg-neutral-300" />
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

    if (isLoading || isFetching) {
        return <ProductSkeleton />;
    }

    if (error || !product) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f5f5f3] px-6">
                <div className="w-full max-w-sm border border-neutral-200 bg-white px-7 py-10 text-center">
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
                        Order Details
                    </p>

                    <h1 className="mt-3 text-2xl font-light text-neutral-900">
                        Product unavailable
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-neutral-500">
                        {purchaseData?.data?.message ||
                            (error as any)?.data?.message ||
                            "Product not found"}
                    </p>

                    <button
                        onClick={handleBack}
                        className="mt-7 w-full bg-black px-5 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-neutral-800"
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
        <main className="min-h-screen bg-[#f5f5f3]">
            <div className="mx-auto min-h-screen max-w-125 bg-white pb-36">
                {/* Header */}
                <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-neutral-200 bg-[#f5f5f3]/95 px-5 py-4 backdrop-blur-sm">
                    <button
                        onClick={handleBack}
                        className="flex h-8 w-8 items-center justify-center text-neutral-500 transition-colors hover:text-black"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </button>

                    <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">
                            Order Details
                        </p>
                    </div>

                    {orderNumber && (
                        <span className="ml-auto text-[10px] tracking-wide text-neutral-500">
                            Order #{orderNumber}
                        </span>
                    )}
                </header>

                {/* Product Image */}
                <section className="bg-[#eeeee9]">
                    <div className="aspect-square w-full overflow-hidden">
                        <img
                            src={product.poster}
                            alt={product.name}
                            className="h-full w-full object-contain"
                            onError={(e) => {
                                e.currentTarget.src =
                                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23f5f5f3' width='400' height='400'/%3E%3C/svg%3E";
                            }}
                        />
                    </div>
                </section>

                {/* Product Information */}
                <section className="border-b border-neutral-200 px-5 py-6">
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">
                            {getOrderLabel().replace(/[()]/g, "") || "Product"}
                        </p>

                        <span
                            className={`text-[10px] uppercase tracking-[0.15em] ${
                                product.status === "Active"
                                    ? "text-emerald-700"
                                    : "text-red-500"
                            }`}
                        >
                            {product.status}
                        </span>
                    </div>

                    <h1 className="text-2xl font-light leading-snug tracking-tight text-neutral-900 sm:text-3xl">
                        {product.name}
                    </h1>
                </section>

                {/* Pricing */}
                <section className="border-b border-neutral-200 bg-white px-5 py-6">
                    <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">
                        Price Breakdown
                    </p>

                    <div className="space-y-5">
                        <div className="flex items-baseline justify-between gap-4">
                            <span className="text-xs text-neutral-500">
                                Product Price
                            </span>
                            <span className="text-base font-light tabular-nums text-neutral-900">
                                {formatCurrency(product.price)}
                            </span>
                        </div>

                        <div className="flex items-baseline justify-between gap-4">
                            <span className="text-xs text-neutral-500">
                                Commission
                            </span>
                            <span className="text-base font-light tabular-nums text-emerald-700">
                                +{formatCurrency(commission)}
                            </span>
                        </div>

                        <div className="flex items-baseline justify-between gap-4 border-t border-neutral-200 pt-5">
                            <span className="text-xs font-medium text-neutral-700">
                                Sale Price
                            </span>
                            <span className="text-xl font-medium tabular-nums text-neutral-900">
                                {formatCurrency(salePrice)}
                            </span>
                        </div>
                    </div>
                </section>

                {/* Description */}
                {product.introduction && (
                    <section className="border-b border-neutral-200 bg-[#f5f5f3] px-5 py-6">
                        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">
                            About This Product
                        </p>

                        <p className="text-sm font-light leading-7 text-neutral-600">
                            {product.introduction}
                        </p>
                    </section>
                )}

                {/* Fixed Bottom Actions */}
                <footer className="fixed bottom-0 left-1/2 z-20 w-full max-w-125 -translate-x-1/2 border-t border-neutral-200 bg-[#f5f5f3] px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
                    <div className="mb-3 flex items-center justify-between gap-4">
                        <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                            Earn Profit
                        </span>

                        <span className="text-sm font-medium tabular-nums text-emerald-700">
                            {purchaseData?.data?.mysteryboxMethod
                                ? `${
                                      purchaseData.data.mysteryboxMethod === "12x"
                                          ? "12×"
                                          : purchaseData.data.mysteryboxMethod === "cash"
                                            ? "Cash"
                                            : "3×"
                                  } — `
                                : ""}
                            {formatCurrency(commission)}
                        </span>
                    </div>

                    <button
                        onClick={handleModalOpen}
                        disabled={isConfirming}
                        className={`w-full py-4 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors ${
                            isConfirming
                                ? "cursor-not-allowed bg-neutral-300 text-neutral-500"
                                : "cursor-pointer bg-black text-white hover:bg-neutral-800"
                        }`}
                    >
                        {isConfirming ? "Processing..." : "Submit Order"}
                    </button>
                </footer>

                <SubmitOrderModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    onSubmit={handleSubmit}
                    isConfirming={isConfirming}
                />
            </div>
        </main>
    );
};

export default Product;