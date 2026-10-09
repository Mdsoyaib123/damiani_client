import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "@/store/api/auth/authApi";

import { toast } from "sonner";
import CountryCodeSelect from "@/components/Common/CountryCodeSelect";


// Schema: phone, captcha (4 digits), password, confirmPassword, invitationCode (optional), email
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
      toast.error(err?.data?.message)
      console.error("Registration failed", err);
    }
  };


  return (
    <div className="flex  justify-center max-w-[500px] mx-auto h-auto scroll-y-auto">
      <div className="w-full p-6 shadow-md">
        <h2 className="text-2xl font-semibold text-center">Signup</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          {/* Phone Field */}
          <div className="mb-4">
            <label className="block text-md font-medium text-gray-700 mb-3">
              Phone
            </label>
            <div className="flex items-center border-1 border-gray-400 rounded-md focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden">
              <CountryCodeSelect value={countryCode}
                onChange={setCountryCode}></CountryCodeSelect>
              <input
                type="number"
                {...register("phone")}
                placeholder="1XXXXXXXXX"
                className="w-full p-2 focus:outline-none"
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Graphic Verification Code */}
          <div className="mb-4">
            <label className="block text-md font-medium text-gray-700 mb-3">
              Verification Code
            </label>
            <div className="relative">
              <input
                type="text"
                {...register("captcha")}
                placeholder="Enter 4 digit code"
                maxLength={4}
                className="w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-24"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                <div className="bg-gray-100 border border-gray-300 px-3 py-1 rounded text-lg font-semibold mr-2 select-none">
                  {captchaCode}
                </div>
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  className="text-sm text-blue-500 underline"
                >
                  Refresh
                </button>
              </div>
            </div>
            {errors.captcha && (
              <p className="text-red-500 text-sm mt-1">
                {errors.captcha.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-md font-medium text-gray-700 mb-3">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              className="w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="block text-md font-medium text-gray-700 mb-3">
              Confirm Password
            </label>
            <input
              type="password"
              {...register("confirmPassword")}
              className="w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Invitation Code */}
          <div className="mb-4">
            <label className="block text-md font-medium text-gray-700 mb-3">
              Invitation Code
            </label>
            <input
              type="text"
              {...register("invitationCode")}
              className="w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-md font-medium text-gray-700 mb-3">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-golden text-white text-xl font-bold p-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>

        </form>
        <p className="mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
