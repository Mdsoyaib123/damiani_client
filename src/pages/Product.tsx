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
                    toast.error(response?.data?.message || "Operation failed", {
                        description: "",
                        duration: 5500,
                    });
                    return;
                }
                toast.success(response?.message || "Order confirmed successfully");
                navigate("/task");
            } else {
                toast.error(response?.message || "Failed to confirm order");
            }
        } catch (error) {
            console.error("Failed to confirm purchase:", error);
        }
    };

    const formatCurrency = (amount: number) => `৳${amount?.toLocaleString()}`;

    console.log(purchaseData, "purchase data in product page");
    console.log((error as any)?.data?.message, "error in product page");

    const getOrderLabel = () => {
        if (!purchaseData?.data?.isAdminAssigned) return "(Mining Order)";
        if (
            purchaseData?.data?.mysteryboxMethod === "12x" &&
            purchaseData?.data?.mysteryboxAmount === "12x"
        ) return "(Crown Order)";
        if (
            purchaseData?.data?.outOfBalance > 0 &&
            purchaseData?.data?.mysteryboxMethod == "3x"
        ) return "(Supreme Order)";
        return "";
    };

    /* ── Loading ── */
    if (isLoading || isFetching) {
        return (
            <div className="max-w-125 mx-auto bg-white h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border border-black mx-auto" />
                    <p className="mt-4 text-[11px] text-gray-400 tracking-widest uppercase">Loading</p>
                </div>
            </div>
        );
    }

    /* ── Error / No product ── */
    if (error || !product) {
        return (
            <div className="max-w-125 mx-auto bg-white h-screen flex items-center justify-center px-8">
                <div className="text-center">
                    <p className="text-[12px] text-gray-500 mb-6 leading-relaxed">
                        {purchaseData?.data?.message || (error as any)?.data?.message || "Product not found"}
                    </p>
                    <button
                        onClick={handleBack}
                        className="px-8 py-2.5 bg-black text-white text-[11px] tracking-[0.2em] uppercase hover:bg-gray-900 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const commission = purchaseData?.data?.isAdminAssigned === true
        ? purchaseData?.data?.commission
        : purchaseData?.data?.product?.commission;

    const salePrice = purchaseData?.data?.mysteryboxMethod === "12x" || purchaseData?.data?.mysteryboxMethod === "3x"
        ? purchaseData?.data?.commission + purchaseData?.data?.product?.price
        : purchaseData?.data?.product?.salePrice;

    return (
        <div className="max-w-125 mx-auto bg-white pb-28">

            {/* ── Sticky Top Bar ── */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-5 py-3 flex items-center gap-3">
                <button
                    onClick={handleBack}
                    className="text-gray-400 hover:text-black transition-colors"
                    aria-label="Go back"
                >
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Details</p>
                </div>
                {orderNumber && (
                    <span className="ml-auto text-[10px] text-gray-400 tracking-wide">
                        Order #{orderNumber}
                    </span>
                )}
            </div>

            {/* ── Product Image — full width, clean ── */}
            <div className="w-full aspect-square bg-gray-50 overflow-hidden">
                <img
                    src={product.poster}
                    alt={product.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                        e.currentTarget.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23f3f4f6' width='400' height='400'/%3E%3C/svg%3E";
                    }}
                />
            </div>

            {/* ── Product Info ── */}
            <div className="px-5 pt-5 pb-4 border-b border-gray-100">
                {/* Category label + status */}
                <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                        {getOrderLabel().replace(/[()]/g, "") || "Product"}
                    </p>
                    <span
                        className={`text-[10px] tracking-wide uppercase ${
                            product.status === "Active" ? "text-emerald-500" : "text-red-400"
                        }`}
                    >
                        {product.status}
                    </span>
                </div>

                {/* Name */}
                <h1 className="text-xl font-light text-black leading-snug">
                    {product.name}
                </h1>
            </div>

            {/* ── Pricing ── */}
            <div className="px-5 py-4 border-b border-gray-100 space-y-3">
                {/* Price row */}
                <div className="flex items-baseline justify-between">
                    <span className="text-[11px] text-gray-400 uppercase tracking-widest">Price</span>
                    <span className="text-base font-light text-black">{formatCurrency(product.price)}</span>
                </div>

                {/* Commission row */}
                <div className="flex items-baseline justify-between">
                    <span className="text-[11px] text-gray-400 uppercase tracking-widest">Commission</span>
                    <span className="text-base font-light text-emerald-600">+{formatCurrency(commission)}</span>
                </div>

                {/* Divider line */}
                <div className="border-t border-gray-100 pt-3 flex items-baseline justify-between">
                    <span className="text-[11px] text-gray-400 uppercase tracking-widest">Sale Price</span>
                    <span className="text-lg font-medium text-black">{formatCurrency(salePrice)}</span>
                </div>
            </div>

            {/* ── Description ── */}
            {product.introduction && (
                <div className="px-5 py-4 border-b border-gray-100">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Description</p>
                    <p className="text-[12px] text-gray-600 leading-relaxed font-light">
                        {product.introduction}
                    </p>
                </div>
            )}

            {/* ── Fixed Bottom CTAs ── */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-125 bg-white border-t border-gray-100 px-5 py-4 z-20">

                {/* Mystery box earn display */}
                {purchaseData?.data?.mysteryboxMethod && (
                    <div className="mb-2 px-4 py-2 bg-gray-50 border border-gray-100 flex items-center justify-between">
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest">Earn Profit</span>
                        <span className="text-sm font-medium text-emerald-600">
                            {purchaseData?.data?.mysteryboxMethod === "12x" ? "12×" :
                             purchaseData?.data?.mysteryboxMethod === "cash" ? "Cash" : "3×"}
                            {" "}— {formatCurrency(purchaseData?.data?.commission)}
                        </span>
                    </div>
                )}

                {/* Non-mystery earn pill */}
                {!purchaseData?.data?.mysteryboxMethod && (
                    <div className="mb-2 px-4 py-2 bg-gray-50 border border-gray-100 flex items-center justify-between">
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest">Earn Profit</span>
                        <span className="text-sm font-light text-emerald-600">{formatCurrency(commission)}</span>
                    </div>
                )}

                {/* Submit button — Damiani solid black */}
                <button
                    onClick={handleModalOpen}
                    disabled={isConfirming}
                    className={`w-full py-3.5 text-[11px] font-medium tracking-[0.2em] uppercase transition-colors cursor-pointer ${
                        isConfirming
                            ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                            : "bg-black text-white hover:bg-gray-900"
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