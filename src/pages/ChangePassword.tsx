import { useChangePasswordMutation } from "@/store/api/auth/authApi";
import { useState } from "react";
import { toast } from "sonner";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [changePassword, { isLoading }] = useChangePasswordMutation();

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
      toast(error?.data?.message || "Failed to change password");
    }
  };

  const inputClass =
    "w-full border border-[#deded9] bg-white px-4 py-3.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900";

  const labelClass =
    "mb-2 block text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-600";

  return (
    <main className="min-h-screen bg-[#f5f5f3] px-4 py-8 sm:px-8 sm:py-12">
      <section className="mx-auto w-full max-w-140">
        {/* Page Heading */}
        <header className="mb-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-neutral-500">
            Account Settings
          </p>

          <h1 className="mt-3 text-3xl font-light tracking-tight text-neutral-900 sm:text-4xl">
            Change Password
          </h1>

          <p className="mt-3 max-w-md text-sm leading-6 text-neutral-500">
            Keep your account secure by updating your password regularly.
          </p>
        </header>

        {/* Form */}
        <div className="border border-[#e5e5e0] bg-white p-5 sm:p-8">
          <div className="mb-7 border-b border-neutral-100 pb-5">
            <h2 className="text-sm font-medium text-neutral-900">
              Password Details
            </h2>

            <p className="mt-1.5 text-xs leading-5 text-neutral-500">
              Enter your current password and choose a new one.
            </p>
          </div>

          <div className="space-y-5">
            {/* Old Password */}
            <div>
              <label className={labelClass} htmlFor="old-password">
                Old Password
              </label>

              <input
                id="old-password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* New Password */}
            <div>
              <label className={labelClass} htmlFor="new-password">
                New Password
              </label>

              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                placeholder="Enter a new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className={labelClass} htmlFor="confirm-password">
                Confirm Password
              </label>

              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="mt-8 border-t border-neutral-100 pt-6">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full cursor-pointer bg-black px-5 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
            >
              {isLoading ? "Processing..." : "Confirm Changes"}
            </button>

            <p className="mt-4 text-center text-[11px] leading-5 text-neutral-400">
              Your password will be updated securely.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}