import { useState } from "react";
import Sidebar from "../../components/common/sidebar";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/icons/logo-section.svg";
import { useAuth } from "../../context/AuthContext";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await signup(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Sidebar />
      <div className="mx-auto flex h-[100vh] w-full max-w-[880px] items-center justify-center overflow-y-auto py-8">
        <div className="flex w-full max-w-[440px] flex-col items-center gap-[24px] p-[16px]">
          <img src={logo} className="md:hidden block" alt="" />
          <div>
            <h1 className="font-bold text-[32px] text-black">Create Account</h1>
            <p className="text-sm">Join thousands topping up smarter</p>
          </div>

          {error && (
            <div className="w-full rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="w-full">
            <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[6px]">
                <label
                  htmlFor="firstName"
                  className="text-sm font-semibold text-black"
                >
                  First name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
                  required
                />
              </div>
              <div className="flex flex-col gap-[6px]">
                <label
                  htmlFor="lastName"
                  className="text-sm font-semibold text-black"
                >
                  Surname
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your surname"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
                  required
                />
              </div>

              <div className="flex flex-col gap-[6px]">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-black"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="sarah.ade@domain.com"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
                  required
                />
              </div>
              <div className="flex flex-col gap-[6px]">
                <label
                  htmlFor="phoneNumber"
                  className="text-sm font-semibold text-black"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="08012345678"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
                  required
                />
              </div>
              <div className="flex flex-col gap-[6px]">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-black"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 8 chars (uppercase, lowercase, number)"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
                  required
                />
              </div>
              <div className="flex flex-col gap-[6px]">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-semibold text-black"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-[8px] px-[12px] py-[10px] focus:outline-none font-medium transition cursor-pointer"
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>
          </div>

          <p className="text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 text-[14px] font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
