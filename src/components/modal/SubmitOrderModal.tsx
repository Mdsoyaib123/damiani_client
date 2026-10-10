import React from "react";

interface SubmitOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    isConfirming: boolean;
}

const SubmitOrderModal: React.FC<SubmitOrderModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isConfirming,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="submit-order-title"
                className="w-full max-w-[400px] border border-neutral-200 bg-white px-7 py-9 shadow-2xl sm:px-9"
            >
                {/* Heading */}
                <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-neutral-500">
                    Order Confirmation
                </p>

                <h2
                    id="submit-order-title"
                    className="mt-4 text-2xl font-light leading-snug tracking-tight text-neutral-900"
                >
                    Confirm Your Order
                </h2>

                <div className="mt-5 h-px w-full bg-neutral-200" />

                <p className="mt-5 text-sm leading-6 text-neutral-600">
                    Are you sure you want to submit this order? Please confirm
                    to continue.
                </p>

                {/* Actions */}
                <div className="mt-8 flex flex-col gap-3">
                    <button
                        onClick={onSubmit}
                        disabled={isConfirming}
                        className={`w-full border border-black px-4 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors ${
                            isConfirming
                                ? "cursor-not-allowed bg-neutral-400 text-white"
                                : "cursor-pointer bg-black text-white hover:bg-neutral-800"
                        }`}
                    >
                        {isConfirming ? "Confirming..." : "Confirm Order"}
                    </button>

                    <button
                        onClick={onClose}
                        disabled={isConfirming}
                        className="w-full border border-neutral-300 bg-white px-4 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-700 transition-colors hover:border-black hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubmitOrderModal;