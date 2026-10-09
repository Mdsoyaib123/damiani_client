import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import CommonModal from "@/components/Common/CommonModal";
import { useLoginMutation } from "@/store/api/auth/authApi";

import { useAppDispatch } from "@/hooks/useRedux";
import { setCredentials } from "@/store/Slices/AuthSlice/authSlice";
import { toast } from "sonner";
// import ErrorModal from "@/components/modal/ErrorModal";
import ErrorModalBlack from "@/components/modal/ErrorModalBlack";
// import { Socket } from "socket.io-client";
import { connectSocket } from "@/utils/socket";
import CountryCodeSelect from "@/components/Common/CountryCodeSelect";

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

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    content: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const openModal = (title: string, content: string) => {
    setModalConfig({ isOpen: true, title, content });
  };

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      // Combine country code with phone number
      const phoneNumber = `${countryCode}${data.phone}`;

      // Call login API with phone number including country code
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

      const errorMessage =
        err?.data?.message ||
        err?.data?.errorSources?.[0]?.message ||
        "Login failed. Please try again.";

      setErrorMessage(errorMessage);
    }
  };

  return (
    <div className="flex justify-center max-w-125 mx-auto h-auto scroll-y-auto">
      <div className="w-full p-6 shadow-md">
        <h2 className="text-2xl font-semibold text-center">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          {/* Phone Field */}
          <div className="mb-4">
            <label className="block text-md font-medium text-gray-700 mb-3">
              Phone
            </label>
            {/* Input Wrapper */}
            <div className="flex items-center border border-gray-400 rounded-md focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden">
              <CountryCodeSelect
                value={countryCode}
                onChange={setCountryCode}
              />
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

          <div className="my-7">
            <p>
              <Link to="/forgot-password" className="text-blue-500">
                Forgot Password?
              </Link>
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer bg-golden text-white text-xl font-bold p-2 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <div className="mt-12 mb-4 flex flex-col gap-5">
          <h1 className="text-lg font-bold">Don't have an account?</h1>
          <p className="text-md">
            Create one and join Freedom to view your orders and earn Freedom
            rewards
          </p>
          <Link
            to="/signup"
            className="w-full cursor-pointer border-2 text-black border-black text-xl text-center font-bold p-2 rounded-md hover:border-golden hover:bg-golden hover:text-white transition-colors"
          >
            Register
          </Link>
        </div>
        <p>
          By creating an account, you agree to our{" "}
          <span
            onClick={() =>
              openModal("Terms & Conditions", "Terms & Conditions Content")
            }
            className="underline me-1 text-blue-500 cursor-pointer"
          >
            Terms & Conditions,
          </span>
          <span
            onClick={() =>
              openModal("Privacy Policy", "Privacy Policy Content")
            }
            className="underline text-blue-500 cursor-pointer"
          >
            Privacy Policy
          </span>{" "}
          and{" "}
          <span
            onClick={() => openModal("Agreement", "Agreement Content")}
            className="underline text-blue-500 cursor-pointer"
          >
            Agreement
          </span>
        </p>
      </div>
      <ErrorModalBlack
        isOpen={!!errorMessage}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
      <CommonModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
      >
        <p>{modalConfig.content}</p>
      </CommonModal>
    </div>
  );
};

export default Login;
