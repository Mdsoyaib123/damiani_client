import { useChangePasswordMutation } from "@/store/api/auth/authApi";
import { useState } from "react";
import { toast } from "sonner";

export default function ChangePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [changePassword, { isLoading }] =
        useChangePasswordMutation();

    const handleSubmit = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            toast("All fields are required");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast("New password and confirm password do not match");
            return;
        }

        try {
            await changePassword({
                oldPassword,
                newPassword,
            }).unwrap();

            toast("Password changed successfully");

            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            toast(
                error?.data?.message ||
                "Failed to change password"
            );
        }
    };

    return (
        <div className="mx-auto  h-screen rounded-xl bg-white p-6 shadow">
            {/* Old Password */}
            <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Old Password
                </label>
                <input
                    type="password"
                    placeholder="Please Enter The Old Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full rounded-md border px-4 py-2 text-sm outline-none focus:border-gray-400"
                />
            </div>

            {/* New Password */}
            <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    New Password
                </label>
                <input
                    type="password"
                    placeholder="Please Enter A New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-md border px-4 py-2 text-sm outline-none focus:border-gray-400"
                />
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Confirm Password
                </label>
                <input
                    type="password"
                    placeholder="Please Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) =>
                        setConfirmPassword(e.target.value)
                    }
                    className="w-full rounded-md border px-4 py-2 text-sm outline-none focus:border-gray-400"
                />
            </div>

            {/* Button */}
            <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full rounded-lg bg-black cursor-pointer py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
                {isLoading
                    ? "Processing..."
                    : "CONFIRM THE CHANGES"}
            </button>
        </div>
    );
}
