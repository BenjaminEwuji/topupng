import { useState } from "react";
import Sidebar from "../../components/common/sidebar";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/icons/logo-section.svg";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full items-center justify-center">
      <Sidebar />
      <div className="mx-auto flex h-[100vh] w-full max-w-[880px] items-center justify-center">
        <div className="flex w-full max-w-[440px] flex-col items-center gap-[32px] p-[24px] md:max-h-[555px]">
          <img src={logo} className=" md:hidden block" alt="" />
          <div>
            <h1 className="font-bold text-[32px] text-black">Welcome Back</h1>
            <p className="text-sm ">Log in to your TopUpNG account</p>
          </div>

          {error && (
            <div className="w-full rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="w-full flex-col">
            <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[6px]">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-black"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah.ade@domain.com"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="......."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
                  required
                />
              </div>
              <Link
                to="/reset-password"
                className="text-blue-500 text-right text-sm font-semibold"
              >
                Forgot your password?
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-[8px] px-[12px] py-[10px] focus:outline-none flex items-center justify-center font-medium transition cursor-pointer"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>

          <p className="text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 text-[14px] font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
