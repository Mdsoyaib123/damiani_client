import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import CommonModal from "@/components/Common/CommonModal";
import ErrorModalBlack from "@/components/modal/ErrorModalBlack";
import CountryCodeSelect from "@/components/Common/CountryCodeSelect";

import { useLoginMutation } from "@/store/api/auth/authApi";
import { useAppDispatch } from "@/hooks/useRedux";
import { setCredentials } from "@/store/Slices/AuthSlice/authSlice";
import { connectSocket } from "@/utils/socket";

const loginSchema = z.object({
  phone: z.string().min(8, "Phone number must be at least 8 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const [loginUser, { isLoading }] = useLoginMutation();
  const [countryCode, setCountryCode] = useState("+880");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    content: "",
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const openModal = (title: string, content: string) => {
    setModalConfig({ isOpen: true, title, content });
  };

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const phoneNumber = `${countryCode}${data.phone}`;

      const res = await loginUser({
        phoneNumber,
        password: data.password,
      }).unwrap();

      dispatch(
        setCredentials({
          user: {
            userId: res.data.userId,
            role: res.data.role,
            email: res.data.email,
            _id: res.data.user_id,
          },
          token: res.data.accessToken,
          refreshToken: res.data.refreshToken,
        }),
      );

      connectSocket(res.data.accessToken);
      navigate("/index");
      toast.success("Login successful");
    } catch (err: any) {
      console.error("Login failed", err);

      const message =
        err?.data?.message ||
        err?.data?.errorSources?.[0]?.message ||
        "Login failed. Please try again.";

      setErrorMessage(message);
    }
  };

  return (
    <main className="bg-[#faf9f6] px-4 py-5 text-[#252720]">
      <div className="mx-auto flex w-full  flex-col justify-center">
        {/* Compact heading */}
        <header className="mb-5">
          <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#77796f]">
            Freedom · Member access
          </p>

          <h1 className="mt-2.5 text-[30px] font-light leading-tight tracking-[-0.05em]">
            Welcome back.
          </h1>

          <p className="mt-1.5 text-xs leading-5 text-[#77796f]">
            Sign in to manage your orders and rewards.
          </p>
        </header>

        {/* Login form */}
        <section className="border border-[#e6e4dc] bg-white p-4">
          <div className="mb-5 flex items-center justify-between border-b border-[#eae8e1] pb-4">
            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#85857c]">
                Account
              </p>

              <h2 className="mt-1 text-lg font-light">Sign in</h2>
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
              <label
                htmlFor="phone"
                className="mb-2 block text-xs font-medium text-[#45473f]"
              >
                Phone number
              </label>

              <div className="flex h-11 min-w-0 items-stretch border border-[#dcdad1] bg-white transition-colors focus-within:border-[#55735d]">
                <div className="flex shrink-0 items-center border-r border-[#e6e4dc]">
                  <CountryCodeSelect
                    value={countryCode}
                    onChange={setCountryCode}
                  />
                </div>

                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="1XXXXXXXXX"
                  {...register("phone")}
                  className="w-full min-w-0 bg-transparent px-3 text-sm outline-none placeholder:text-[#b0afa6]"
                />
              </div>

              {errors.phone && (
                <p className="mt-1.5 text-[11px] text-[#b34e43]">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mb-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <label
                  htmlFor="password"
                  className="text-xs font-medium text-[#45473f]"
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-[11px] text-[#55735d] hover:text-[#354e3b]"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="flex h-11 items-center border border-[#dcdad1] bg-white transition-colors focus-within:border-[#55735d]">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  {...register("password")}
                  className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-[#b0afa6]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="flex h-full w-10 shrink-0 items-center justify-center text-[#85857c] hover:text-[#252720]"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" strokeWidth={1.5} />
                  ) : (
                    <Eye className="h-4 w-4" strokeWidth={1.5} />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1.5 text-[11px] text-[#b34e43]">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 flex h-11 w-full items-center justify-center gap-2 bg-[#292b25] px-4 text-[11px] font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#41463a] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                "Signing in..."
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                </>
              )}
            </button>
          </form>

          {/* Register */}
          <div className="mt-5 border-t border-[#eae8e1] pt-4">
            <p className="text-xs text-[#77796f]">
              New to Freedom?
            </p>

            <Link
              to="/signup"
              className="mt-2.5 flex h-10 w-full items-center justify-center border border-[#dcdad1] px-4 text-[11px] font-medium uppercase tracking-[0.12em] text-[#292b25] transition-colors hover:border-[#55735d] hover:bg-[#f7f8f4] hover:text-[#55735d]"
            >
              Create an account
            </Link>

            <p className="mt-2.5 text-[11px] leading-5 text-[#85857c]">
              Join Freedom to view your orders and access member rewards.
            </p>
          </div>
        </section>

        {/* Compact legal footer */}
        <footer className="mt-4 text-center">
          <p className="text-[10px] leading-5 text-[#85857c]">
            By creating an account, you agree to our{" "}
            <button
              type="button"
              onClick={() =>
                openModal("Terms & Conditions", "Terms & Conditions Content")
              }
              className="underline underline-offset-2 hover:text-[#252720]"
            >
              Terms
            </button>
            ,{" "}
            <button
              type="button"
              onClick={() =>
                openModal("Privacy Policy", "Privacy Policy Content")
              }
              className="underline underline-offset-2 hover:text-[#252720]"
            >
              Privacy Policy
            </button>{" "}
            and{" "}
            <button
              type="button"
              onClick={() => openModal("Agreement", "Agreement Content")}
              className="underline underline-offset-2 hover:text-[#252720]"
            >
              Agreement
            </button>
            .
          </p>
        </footer>
      </div>

      <ErrorModalBlack
        isOpen={!!errorMessage}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />

      <CommonModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        onClose={() =>
          setModalConfig((current) => ({ ...current, isOpen: false }))
        }
      >
        <p>{modalConfig.content}</p>
      </CommonModal>
    </main>
  );
};

export default Login;