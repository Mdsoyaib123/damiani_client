import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, RefreshCw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { useRegisterMutation } from "@/store/api/auth/authApi";
import CountryCodeSelect from "@/components/Common/CountryCodeSelect";

const signupSchema = z
  .object({
    phone: z.string().min(8, "Phone number must be at least 8 digits"),
    captcha: z
      .string()
      .min(4, "Enter the 4 digit verification code")
      .max(4, "Enter the 4 digit verification code"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    invitationCode: z.string().optional(),
    email: z.string().email("Invalid email format"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type SignupFormInputs = z.infer<typeof signupSchema>;

const generateCaptcha = () =>
  Math.floor(1000 + Math.random() * 9000).toString();

const Signup = () => {
  const [captchaCode, setCaptchaCode] = useState<string>(generateCaptcha());
  const [countryCode, setCountryCode] = useState("+880");
  const [registerUser, { isLoading }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupFormInputs>({
    resolver: zodResolver(signupSchema),
  });

  const navigate = useNavigate();

  const refreshCaptcha = () => setCaptchaCode(generateCaptcha());

  const onSubmit = async (data: SignupFormInputs) => {
    if (data.captcha !== captchaCode) {
      setError("captcha", {
        type: "manual",
        message: "Verification code does not match",
      });
      return;
    }

    try {
      await registerUser({
        name: data.email.split("@")[0],
        phoneNumber: `${countryCode}${data.phone}`,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        invitationCode: data.invitationCode,
      }).unwrap();

      toast.success("Registration successful");
      navigate("/login");
    } catch (err: any) {
      toast.error(err?.data?.message || "Registration failed. Please try again.");
      console.error("Registration failed", err);
    }
  };

  const inputClass =
    "h-11 w-full min-w-0 border border-[#dcdad1] bg-white px-3 text-sm text-[#252720] outline-none placeholder:text-[#b0afa6] transition-colors focus:border-[#55735d]";

  const labelClass =
    "mb-2 block text-xs font-medium text-[#45473f]";

  const errorClass = "mt-1.5 text-[11px] text-[#b34e43]";

  return (
    <main className="bg-[#faf9f6] px-4 py-5 text-[#252720]">
      <div className="mx-auto flex w-full flex-col justify-center">
        {/* Heading */}
        <header className="mb-5">
          <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#77796f]">
            Freedom · Member access
          </p>

          <h1 className="mt-2.5 text-[30px] font-light leading-tight tracking-[-0.05em]">
            Create your account.
          </h1>

          <p className="mt-1.5 text-xs leading-5 text-[#77796f]">
            Join Freedom to manage your orders and rewards.
          </p>
        </header>

        {/* Signup form */}
        <section className="border border-[#e6e4dc] bg-white p-4">
          <div className="mb-5 flex items-center justify-between border-b border-[#eae8e1] pb-4">
            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#85857c]">
                Get started
              </p>

              <h2 className="mt-1 text-lg font-light">Register</h2>
            </div>

            <div className="flex h-9 w-9 items-center justify-center border border-[#e6e4dc] bg-[#faf9f6]">
              <ShieldCheck
                className="h-[18px] w-[18px] text-[#55735d]"
                strokeWidth={1.4}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Phone */}
            <div className="mb-4">
              <label htmlFor="phone" className={labelClass}>
                Phone number
              </label>

              <div className="flex h-11 min-w-0 items-stretch border border-[#dcdad1] bg-white transition-colors focus-within:border-[#55735d]">
               <CountryCodeSelect
                    value={countryCode}
                    onChange={setCountryCode}
                  />

                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="1XXXXXXXXX"
                  {...register("phone")}
                  className="w-full min-w-0 bg-transparent px-2.5 text-sm outline-none placeholder:text-[#b0afa6]"
                />
              </div>

              {errors.phone && (
                <p className={errorClass}>{errors.phone.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className={labelClass}>
                Email address
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...register("email")}
                className={inputClass}
              />

              {errors.email && (
                <p className={errorClass}>{errors.email.message}</p>
              )}
            </div>

            {/* Verification code */}
            <div className="mb-4">
              <label htmlFor="captcha" className={labelClass}>
                Verification code
              </label>

              <div className="flex h-11 min-w-0 border border-[#dcdad1] transition-colors focus-within:border-[#55735d]">
                <input
                  id="captcha"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={4}
                  placeholder="Enter 4-digit code"
                  {...register("captcha")}
                  className="h-full min-w-0 flex-1 bg-white px-3 text-sm outline-none placeholder:text-[#b0afa6]"
                />

                <div className="flex shrink-0 items-center gap-2 border-l border-[#e6e4dc] bg-[#faf9f6] px-2">
                  <span
                    aria-label="Verification code"
                    className="select-none font-mono text-base font-semibold tracking-[0.16em] text-[#292b25]"
                  >
                    {captchaCode}
                  </span>

                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    aria-label="Refresh verification code"
                    className="flex h-7 w-7 items-center justify-center text-[#55735d] transition-colors hover:bg-[#efeee8]"
                  >
                    <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.6} />
                  </button>
                </div>
              </div>

              {errors.captcha && (
                <p className={errorClass}>{errors.captcha.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className={labelClass}>
                Password
              </label>

              <input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="At least 6 characters"
                {...register("password")}
                className={inputClass}
              />

              {errors.password && (
                <p className={errorClass}>{errors.password.message}</p>
              )}
            </div>

            {/* Confirm password */}
            <div className="mb-4">
              <label htmlFor="confirmPassword" className={labelClass}>
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Re-enter your password"
                {...register("confirmPassword")}
                className={inputClass}
              />

              {errors.confirmPassword && (
                <p className={errorClass}>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Invitation code */}
            <div className="mb-4">
              <label htmlFor="invitationCode" className={labelClass}>
                Invitation code{" "}
                <span className="font-normal text-[#85857c]">(Optional)</span>
              </label>

              <input
                id="invitationCode"
                type="text"
                autoComplete="off"
                placeholder="Enter invitation code"
                {...register("invitationCode")}
                className={inputClass}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex h-11 w-full items-center justify-center gap-2 bg-black px-4 text-[11px] font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#41463a] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                "Creating account..."
              ) : (
                <>
                  Create account
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                </>
              )}
            </button>
          </form>

          {/* Login link */}
          <div className="mt-5 border-t border-[#eae8e1] pt-4">
            <p className="text-xs text-[#77796f]">
              Already have an account?
            </p>

            <Link
              to="/login"
              className="mt-2.5 flex h-10 w-full items-center justify-center border border-[#dcdad1] px-4 text-[11px] font-medium uppercase tracking-[0.12em] text-[#292b25] transition-colors hover:border-[#55735d] hover:bg-[#f7f8f4] hover:text-[#55735d]"
            >
              Sign in
            </Link>
          </div>
        </section>

        {/* Legal footer */}
        <footer className="mt-4 text-center">
          <p className="text-[10px] leading-5 text-[#85857c]">
            By creating an account, you agree to our{" "}
            <Link
              to="/terms"
              className="underline underline-offset-2 hover:text-[#252720]"
            >
              Terms
            </Link>
            {" "}and{" "}
            <Link
              to="/privacy-policy"
              className="underline underline-offset-2 hover:text-[#252720]"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </footer>
      </div>
    </main>
  );
};

export default Signup;