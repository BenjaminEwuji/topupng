import Sidebar from "../../components/common/sidebar";
import { Link } from "react-router-dom";
import lock from "../../assets/icons/icon-emblem.svg"
import sheild from "../../assets/icons/shield-outer.svg"
import logo from "../../assets/icons/logo-section.svg"


const ResetPasswordPage = () => (
  <div className="flex w-full items-center justify-center">
    <Sidebar />
    <div className="mx-auto flex h-[100vh] w-full max-w-[880px] items-center justify-center">
      <div className="flex w-full max-w-[440px] flex-col items-center gap-[32px] p-[24px] md:max-h-[420px]">
        <img src={logo} className=" md:hidden block" alt="" />
        <img src={sheild} alt="" className=" md:hidden block"/>
        <img src={lock} alt="" className=" md:block hidden"/>
        <div>
          <h1 className="font-bold text-[32px] text-black text-center">Reset Password</h1>
          <p className="text-sm  text-center">Enter your email and we'll send you instructions to reset your password</p>
        </div>

        <div className="w-full flex-col">
          <form className="flex flex-col gap-[16px]">
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
                Enter new Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
                    required
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-black"
              >
                Comfirm Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password again"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
                    required
              />
            </div>
          </form>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white rounded-[8px] px-[12px] py-[10px] focus:outline-none"
        >
          Change Password
        </button>
        
       
          <Link to="/login" className="text-blue-500 text-[14px] font-semibold text-center">
            {"<"} Back to login
          </Link>
      </div>
    </div>
  </div>
);

export default ResetPasswordPage;
