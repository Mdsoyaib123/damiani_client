import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface MiningOrderModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const MiningOrderModal: React.FC<MiningOrderModalProps> = ({ open, setOpen }) => {
    if (!open) return null;

    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            navigate("/product");
            setOpen(false);
        }, 3000);
    }, []);

    return (
        <div className="fixed inset-0 bg-black/60  flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 text-center">
                {/* Mining Icon/Image */}
                <div className="mb-6 flex justify-center">
                    <div className="relative">
                        {/* You can replace this with an actual image */}
                        <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                            <svg
                                className="w-12 h-12 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                />
                            </svg>
                        </div>
                        {/* Optional: Add spinning effect */}
                        <div className="absolute inset-0 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </div>

                {/* Mining Order Text */}
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Mining Order...
                </h2>

                {/* Optional: Loading dots */}
                <div className="flex justify-center gap-1 mt-4">
                    <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        </div>
    );
};

export default MiningOrderModal;