import { useGetSingleUserQuery } from "@/store/api/user/userApi";
import { useBindAccountMutation } from "@/store/api/withdraw/withdrawApi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const BindAccount = () => {
  const id = localStorage.getItem("userId");
  const userId = id ? parseInt(id) : 0;

  const { data: userData } = useGetSingleUserQuery(userId, {
    refetchOnMountOrArgChange: true,
  });

  console.log(userData, "user data in bind account");

  const [name, setName] = useState("");
  const [accountType, setAccountType] = useState<
    "BankTransfer" | "MobileBanking" | ""
  >("");

  // Bank Transfer fields
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [branchName, setBranchName] = useState("");
  const [districtName, setDistrictName] = useState("");

  // Mobile Banking fields
  const [provider, setProvider] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  const navigate = useNavigate();

  const hasWithdrawalAddress =
    userData?.data?.withdrawalAddressAndMethod &&
    Object.keys(userData.data.withdrawalAddressAndMethod).length > 0;

  useEffect(() => {
    if (userData?.data?.name) {
      setName(userData.data.name);
    }

    if (hasWithdrawalAddress) {
      const withdrawalData = userData.data.withdrawalAddressAndMethod;

      if (withdrawalData.withdrawMethod) {
        setAccountType(withdrawalData.withdrawMethod);
      }

      if (withdrawalData.withdrawMethod === "BankTransfer") {
        if (withdrawalData.bankName) setBankName(withdrawalData.bankName);

        if (withdrawalData.bankAccountNumber)
          setAccountNumber(withdrawalData.bankAccountNumber.toString());

        if (withdrawalData.branchName)
          setBranchName(withdrawalData.branchName);

        if (withdrawalData.district)
          setDistrictName(withdrawalData.district);
      } else if (withdrawalData.withdrawMethod === "MobileBanking") {
        if (withdrawalData.mobileBankingName)
          setProvider(withdrawalData.mobileBankingName);

        if (withdrawalData.mobileBankingAccountNumber)
          setMobileNumber(
            withdrawalData.mobileBankingAccountNumber.toString(),
          );

        if (withdrawalData.mobileUserDistrict)
          setDistrictName(withdrawalData.mobileUserDistrict);
      }
    }
  }, [userData, hasWithdrawalAddress]);

  const [bindAccount, { isLoading, isError }] = useBindAccountMutation();

  const handleSubmit = async () => {
    if (hasWithdrawalAddress) {
      navigate("/cash-out");
      return;
    }

    if (!accountType) {
      toast.error("Please select an account type");
      return;
    }

    if (!name) {
      toast.error("Please enter your name");
      return;
    }

    let payload: any = {
      userId,
      name,
      withdrawMethod: accountType,
    };

    if (accountType === "BankTransfer") {
      if (!bankName || !accountNumber || !districtName) {
        toast.error("Please fill all required fields");
        return;
      }

      payload = {
        ...payload,
        bankName,
        bankAccountNumber: Number(accountNumber),
        district: districtName,
      };

      if (branchName) {
        payload.branchName = branchName;
      }
    } else if (accountType === "MobileBanking") {
      if (!provider || !mobileNumber) {
        toast.error("Please fill all required fields");
        return;
      }

      payload = {
        ...payload,
        mobileBankingName: provider,
        mobileBankingAccountNumber: Number(mobileNumber),
        mobileUserDistrict: districtName,
      };
    }

    try {
      console.log("FINAL PAYLOAD 👉", payload);

      const result = await bindAccount(payload).unwrap();

      console.log("API Response:", result);

      toast.success("Account bound successfully");
      navigate("/index");
    } catch (err: any) {
      console.error("Bind account failed", err);
      toast.error(err?.data?.message || "Failed to bind account");
    }
  };

  const inputClassName =
    "h-11 w-full rounded-sm border border-neutral-300 bg-white px-3 text-sm text-neutral-900 shadow-none outline-none transition-colors placeholder:text-neutral-400 focus-visible:border-neutral-900 focus-visible:ring-0";

  const labelClassName =
    "mb-1.5 block text-xs font-medium text-neutral-700";

  return (
    <main className="min-h-screen bg-[#F5F5F3] px-3 py-5 text-neutral-900 sm:px-4">
      <div className="mx-auto w-full max-w-107.5">
        {/* Page heading */}
        <header className="mb-5 px-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Wallet
          </p>

          <h1 className="mt-1 text-[25px] font-semibold tracking-tight text-neutral-950">
            {hasWithdrawalAddress ? "Your Account" : "Bind Account"}
          </h1>

          <p className="mt-1.5 text-[13px] leading-5 text-neutral-600">
            {hasWithdrawalAddress
              ? "Your withdrawal account is already registered."
              : "Add your bank or mobile wallet details to receive withdrawals."}
          </p>
        </header>

        {/* Form */}
        <div className="border border-neutral-200 bg-white p-4 sm:p-5">
          {/* Personal details */}
          <section>
            <h2 className="text-sm font-semibold text-neutral-900">
              Account holder
            </h2>

            <p className="mt-1 text-xs leading-5 text-neutral-500">
              Enter the name associated with your account.
            </p>

            <div className="mt-4">
              <label htmlFor="holder-name" className={labelClassName}>
                Full name <span className="text-red-600">*</span>
              </label>

              <input
                id="holder-name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={Boolean(hasWithdrawalAddress)}
                className={`${inputClassName} disabled:bg-neutral-100 disabled:text-neutral-500`}
              />
            </div>
          </section>

          <div className="my-5 border-t border-neutral-200" />

          {/* Withdrawal method */}
          <section>
            <h2 className="text-sm font-semibold text-neutral-900">
              Withdrawal method
            </h2>

            <p className="mt-1 text-xs leading-5 text-neutral-500">
              Choose where you want to receive your money.
            </p>

            <div className="mt-4">
              <label htmlFor="account-type" className={labelClassName}>
                Sell Out Method <span className="text-red-600">*</span>
              </label>

              <select
                id="account-type"
                value={accountType}
                onChange={(e) =>
                  setAccountType(
                    e.target.value as "BankTransfer" | "MobileBanking",
                  )
                }
                disabled={Boolean(hasWithdrawalAddress)}
                className={`${inputClassName} appearance-none disabled:bg-neutral-100 disabled:text-neutral-500`}
              >
                <option value="">Select a withdrawal method</option>
                <option value="BankTransfer">Bank Transfer</option>
                <option value="MobileBanking">Mobile Banking</option>
              </select>
            </div>
          </section>

          {/* Bank transfer fields */}
          {accountType === "BankTransfer" && (
            <section className="mt-5 space-y-4 border-t border-neutral-200 pt-5">
              <h2 className="text-sm font-semibold text-neutral-900">
                Bank details
              </h2>

              <div>
                <label htmlFor="bank-name" className={labelClassName}>
                  Bank name <span className="text-red-600">*</span>
                </label>

                <input
                  id="bank-name"
                  type="text"
                  placeholder="Enter bank name"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="account-number" className={labelClassName}>
                  Account number <span className="text-red-600">*</span>
                </label>

                <input
                  id="account-number"
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter account number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="branch-name" className={labelClassName}>
                  Branch name
                </label>

                <input
                  id="branch-name"
                  type="text"
                  placeholder="Enter branch name (optional)"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="bank-district" className={labelClassName}>
                  District <span className="text-red-600">*</span>
                </label>

                <input
                  id="bank-district"
                  type="text"
                  placeholder="Enter district"
                  value={districtName}
                  onChange={(e) => setDistrictName(e.target.value)}
                  className={inputClassName}
                />
              </div>
            </section>
          )}

          {/* Mobile banking fields */}
          {accountType === "MobileBanking" && (
            <section className="mt-5 space-y-4 border-t border-neutral-200 pt-5">
              <h2 className="text-sm font-semibold text-neutral-900">
                Mobile wallet details
              </h2>

              <div>
                <label htmlFor="wallet-provider" className={labelClassName}>
                  Wallet provider <span className="text-red-600">*</span>
                </label>

                <input
                  id="wallet-provider"
                  type="text"
                  placeholder="Enter wallet provider"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="wallet-number" className={labelClassName}>
                  Wallet number <span className="text-red-600">*</span>
                </label>

                <input
                  id="wallet-number"
                  type="tel"
                  placeholder="Enter wallet number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="wallet-district" className={labelClassName}>
                  District <span className="text-red-600">*</span>
                </label>

                <input
                  id="wallet-district"
                  type="text"
                  placeholder="Enter district"
                  value={districtName}
                  onChange={(e) => setDistrictName(e.target.value)}
                  className={inputClassName}
                />
              </div>
            </section>
          )}

          {/* Existing account notice */}
          {hasWithdrawalAddress && (
            <div className="mt-5 border-l-2 border-emerald-700 bg-[#F5F7F3] px-3 py-3">
              <p className="text-xs font-medium text-neutral-900">
                Withdrawal account already registered
              </p>

              <p className="mt-1 text-xs leading-5 text-neutral-600">
                Continue to the Sell Out page to request a withdrawal.
              </p>
            </div>
          )}

          {/* Error */}
          {isError && (
            <p className="mt-3 text-xs text-red-600">
              Failed to bind account. Try again.
            </p>
          )}

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || (!hasWithdrawalAddress && (!accountType || !name))}
            className="mt-6 flex h-11 w-full items-center justify-center rounded-sm bg-neutral-900 px-4 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading
              ? "Binding..."
              : hasWithdrawalAddress
                ? "Continue to Sell Out"
                : "Bind Account"}
          </button>

          {!hasWithdrawalAddress && (
            <p className="mt-3 text-center text-[11px] leading-5 text-neutral-500">
              Please check your details carefully before continuing.
            </p>
          )}
        </div>
      </div>
    </main>
  );
};

export default BindAccount;