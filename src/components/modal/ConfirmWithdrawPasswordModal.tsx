import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
// import { X } from "lucide-react";

interface ConfirmWithdrawPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (password: string) => void;
}

const ConfirmWithdrawPasswordModal = ({
    isOpen,
    onClose,
    onConfirm,
}: ConfirmWithdrawPasswordModalProps) => {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Reset password when modal closes
    useEffect(() => {
        if (!isOpen) {
            setPassword("");
        }
    }, [isOpen]);

    const handleConfirm = () => {
        if (!password) {
            toast.error("Please enter your sell out password");
            return;
        }

        onConfirm(password);
        onClose();
        setPassword("");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-4 ">
                    <h2 className="text-lg font-semibold text-center w-full">Confirm Sell Out Password</h2>
                    {/* <button onClick={onClose} className="p-1 rounded-full cursor-ponter hover:bg-slate-100">
                        <X className="w-5 h-5 text-slate-500" />
                    </button> */}
                </div>

                <div className="p-6 space-y-4">
                    <div className="space-y-2 relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter sell out password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 bottom-2 right-1 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <div className="flex lg:justify-end justify-center gap-3 pt-2">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="lg:w-auto w-1/2 cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            className="bg-black text-white cursor-pointer hover:bg-gray-800 lg:w-auto w-1/2"
                        >
                            Confirm
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmWithdrawPasswordModal;
