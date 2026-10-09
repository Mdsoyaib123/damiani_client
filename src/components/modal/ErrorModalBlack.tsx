// import { X } from "lucide-react";

interface ErrorModalProps {
    isOpen: boolean;
    message: string;
    onClose: () => void;
}

const ErrorModalBlack = ({ isOpen, message, onClose }: ErrorModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-gray-200 rounded-lg shadow-xl max-w-md w-full mx-4 py-2 pb-12 px-4">
                {/* Close Button */}
                {/* <button
                    onClick={onClose}
                    className="absolute cursor-pointer top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={24} />
                </button> */}

                <h1 className="text-lg text-center font-semibold mb-4 border-b-2 border-gray-400 py-3">Notice</h1>

                {/* Message */}
                <div className="px-6">
                    <div >
                        <p className="text-lg text-center text-black font-base">{message}</p>
                    </div>

                    <div className="mt-5 flex justify-center">
                        <button onClick={onClose} className="bg-golden hover:bg-golden/80 cursor-pointer text-white px-4 py-2 w-full rounded">Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorModalBlack;