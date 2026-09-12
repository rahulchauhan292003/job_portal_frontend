import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import { setCredentials } from "../../store/slices/authSlice";
import { signupUser } from "../../services/auth.api";

const signupSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name is required"),

  email: yup
    .string()
    .trim()
    .email("Please enter a valid email")
    .required("Email is required"),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signupSchema),
  });

  const onSubmit = async (formData) => {
    try {
      const { confirmPassword, ...signupData } = formData;

      const response = await signupUser(signupData);

      dispatch(setCredentials(response.data));

      toast.success("Account created successfully");

      navigate("/jobs");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Signup failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2">
          Create Account
        </h1>

        <p className="text-gray-500 mb-6">
          Create your applicant account
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          {/* Name */}
          <div>
            <label className="block mb-2 font-medium">
              Name
            </label>

            <input
              type="text"
              {...register("name")}
              placeholder="Enter your name"
              className="w-full border rounded-lg px-4 py-3"
            />

            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              {...register("email")}
              placeholder="Enter your email"
              className="w-full border rounded-lg px-4 py-3"
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              {...register("password")}
              placeholder="Enter your password"
              className="w-full border rounded-lg px-4 py-3"
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-2 font-medium">
              Confirm Password
            </label>

            <input
              type="password"
              {...register("confirmPassword")}
              placeholder="Confirm your password"
              className="w-full border rounded-lg px-4 py-3"
            />

            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white rounded-lg py-3 disabled:opacity-50"
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-5 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-black"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;