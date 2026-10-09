import { X } from "lucide-react";

interface ErrorModalProps {
    isOpen: boolean;
    message: string;
    onClose: () => void;
}

const ErrorModal = ({ isOpen, message, onClose }: ErrorModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-gray-200 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute cursor-pointer top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Message */}
                <div className="pr-8">
                    <p className="text-lg font-semibold text-red-500">{message}</p>
                </div>
            </div>
        </div>
    );
};

export default ErrorModal;