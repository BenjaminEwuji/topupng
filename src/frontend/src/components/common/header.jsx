import React from 'react';
import logo from '../../assets/logos/logo.svg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiLogOut } from 'react-icons/fi';
import '../../styles/responsive.css';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const displayName = user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'My Account';
  const displayEmail = user?.email || '';
  const initials = ((user?.firstName?.[0] || 'U') + (user?.lastName?.[0] || 'A')).toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getLinkClasses = (path) => {
    const isActive = location.pathname.startsWith(path);
    return `text-[14px] font-medium relative transition-transform duration-300 block
      after:content-[''] after:absolute after:bottom-[-4px] after:left-[20%] after:w-[60%] after:h-[2px] after:bg-[#3B82F6] 
      after:transition-transform after:duration-300 after:origin-center
      ${isActive ? '-translate-y-[7px] after:scale-x-100 text-[#3B82F6] font-bold' : 'hover:-translate-y-[6px] after:scale-x-0 hover:after:scale-x-100 hover:text-[#3B82F6] font-bold'}`;
  };

  return (
    <div className="stickyheader h-[80px] w-full hidden bg-white md:block border-b border-gray-100">
      <div className='mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-0 md:px-8 lg:px-[120px]'>
        <div>
          <Link to="/dashboard">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <div className="flex w-fit items-center justify-center gap-[32px]">
          <ul className='flex gap-[32px]'>
            <Link to="/dashboard"><li className={getLinkClasses('/dashboard')}>Dashboard</li></Link>
            <Link to="/airtime"><li className={getLinkClasses('/airtime')}>Buy Airtime</li></Link>
            <Link to="/data"><li className={getLinkClasses('/data')}>Buy Data</li></Link>
            <Link to="/history"><li className={getLinkClasses('/history')}>History</li></Link>
            <Link to="/account"><li className={getLinkClasses('/account')}>Account</li></Link>
          </ul>
        </div>
        <div className="flex items-center justify-center gap-[12px]">
          <Link to="/account" className="flex flex-col items-end gap-[2px] hover:opacity-80 transition">
            <span className='text-[14px] font-bold text-[#1E293B]'>{displayName}</span>
            <span className='text-[12px] font-normal text-[#64748B]'>{displayEmail}</span>
          </Link>
          <Link to="/account">
            <div className='flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#3B82F6] text-[14px] font-semibold text-white'>
              {initials}
            </div>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            title="Log Out"
            className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer ml-1"
          >
            <FiLogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;