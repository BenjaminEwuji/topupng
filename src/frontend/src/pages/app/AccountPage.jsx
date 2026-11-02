import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/common/header';
import Navigation from '../../components/common/navigation';
import Footer from '../../components/common/footer';
import {
  ProfilesSettings,
  PaymentMethodsSection,
  TransactionPinSection,
  NotificationsSection,
  SecurityLoginsSection,
  HelpSupportSection
} from '../../components/sections/Account';
import {
  FiCalendar,
  FiUser,
  FiCreditCard,
  FiLock,
  FiBell,
  FiShield,
  FiHelpCircle,
  FiChevronRight,
  FiChevronLeft,
  FiLogOut
} from 'react-icons/fi';

function AccountPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedMobileSection, setSelectedMobileSection] = useState(null);

  const displayName = user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User Account';
  const displayEmail = user?.email || 'user@topupng.com';
  const initials = ((user?.firstName?.[0] || 'U') + (user?.lastName?.[0] || 'A')).toUpperCase();

  const menuItems = [
    { id: 'profile', label: 'Edit Profile', icon: FiUser },
    { id: 'payment', label: 'Payment Methods', icon: FiCreditCard },
    { id: 'pin', label: 'Transaction PIN', icon: FiLock },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'security', label: 'Security', icon: FiShield },
    { id: 'help', label: 'Help & Support', icon: FiHelpCircle }
  ];

  const sectionMap = {
    profile: <ProfilesSettings />,
    payment: <PaymentMethodsSection />,
    pin: <TransactionPinSection />,
    notifications: <NotificationsSection />,
    security: <SecurityLoginsSection />,
    help: <HelpSupportSection />
  };

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setSelectedMobileSection(tabId);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className='pb-[88px] md:pb-0'>
      <Header />

      <div className='md:hidden min-h-screen bg-[#F3F5F8] w-full'>
        <div className='w-full bg-[#F5F7FB] p-[18px]'>
          {selectedMobileSection ? (
            <div className='space-y-[18px]'>
              <button
                type='button'
                onClick={() => setSelectedMobileSection(null)}
                className='flex items-center gap-[8px]  text-[14px] font-semibold text-gray-700'
              >
                <FiChevronLeft className='h-[18px] w-[18px] bg-[white] rounded-full' />
                Back
              </button>

              <div className='rounded-[24px] border border-[#E2E8F0] bg-white p-[18px]'>
                {sectionMap[selectedMobileSection]}
              </div>
            </div>
          ) : (
            <>
              <h1 className='text-[20px] font-extrabold leading-none text-[#111827]'>My Account</h1>

              <div className='mt-[22px] flex items-center gap-[14px]'>
                <div className='flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#3B82F6] text-[18px] font-extrabold text-white'>
                  SA
                </div>
                <div>
                  <h2 className='text-[18px] font-extrabold text-[#111827]'>Sarah Adebayo</h2>
                  <p className='text-[13px] text-gray-500'>sarah@example.com</p>
                </div>
              </div>

              <div className='mt-[26px] space-y-[12px]'>
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    type='button'
                    onClick={() => handleSelectTab(item.id)}
                    className='flex w-full items-center justify-between rounded-[18px] border border-[#DDE6F1] bg-white px-[16px] py-[16px] text-left shadow-sm transition hover:border-[#B7D4FF] hover:bg-[#F5F9FF]'
                  >
                    <div className='flex items-center gap-[14px]'>
                      <div className='flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#F1F5F9] text-[#334155]'>
                        <item.icon className='h-[18px] w-[18px]' />
                      </div>
                      <span className='text-[14px] font-semibold text-[#111827]'>{item.label}</span>
                    </div>

                    <FiChevronRight className='h-[12px] w-[12px] text-gray-500' />
                  </button>
                ))}

                <button
                  type='button'
                  onClick={handleLogout}
                  className='mt-[8px] flex w-full items-center justify-between rounded-[18px] border border-[#F6D8D8] bg-[#FDF3F3] px-[16px] py-[16px] text-left shadow-sm text-[#E24A4A] transition hover:bg-[#FDECEC]'
                >
                  <div className='flex items-center gap-[14px]'>
                    <div className='flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#FCE8E8] text-[#E24A4A]'>
                      <FiLogOut className='h-[18px] w-[18px]' />
                    </div>
                    <span className='text-[16px] font-semibold'>Log Out</span>
                  </div>

                  <FiChevronRight className='h-[20px] w-[20px] text-[#E24A4A]' />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className='hidden h-full w-full gap-[40px] px-0 py-0 md:flex md:px-8 md:py-10 lg:px-[120px] lg:py-12'>
        <div className='flex h-full w-full max-w-[320px] flex-col gap-[24px]'>
          <div className='h-full w-full bg-[white] rounded-[25px] p-[24px] border-[1px] border-[#E2E8F0] flex flex-col gap-[16px] justify-center items-center'>
            <div className='w-[80px] h-[80px] rounded-full bg-[#EFF6FF] flex items-center justify-center'>
              <span className='text-[32px] font-bold text-[#3B82F6]'>{initials}</span>
            </div>
            <div className='flex w-full flex-col justify-center items-center border-b-[1px] border-[#E2E8F0] pb-[16px]'>
              <h1 className='text-[20px] font-bold text-gray-900'>{displayName}</h1>
              <p className='text-[14px] text-gray-500'>{displayEmail}</p>
            </div>
            <div className='flex w-full gap-[8px] justify-center items-center text-[14px] text-gray-500'>
              <FiCalendar />
              <p>Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '2026'}</p>
            </div>
          </div>

          <div className='w-full h-full bg-[white] rounded-[24px] p-[12px] border-[1px] border-[#E2E8F0] flex flex-col gap-[4px]'>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex justify-between items-center w-full h-[48px] px-[16px] rounded-[12px] hover:bg-[#EFF6FF] transition ${activeTab === item.id ? 'bg-[#EFF6FF]' : ''}`}
              >
                <div className='flex gap-[12px] items-center w-full h-full'>
                  <item.icon className={`w-[20px] h-[20px] ${activeTab === item.id ? 'text-[#3B82F6]' : 'text-gray-500'}`} />
                  <span className={`text-[14px] font-bold ${activeTab === item.id ? 'text-[#3B82F6]' : 'text-gray-900'}`}>{item.label}</span>
                </div>
                {activeTab === item.id && <div className='h-[16px] rounded-[4px] w-[4px] bg-[#3B82F6]' />}
              </button>
            ))}

            <button
              type='button'
              onClick={handleLogout}
              className='mt-[8px] flex w-full items-center justify-between rounded-[12px] border border-[#F6D8D8] bg-[#FDF3F3] px-[16px] py-[12px] text-left text-[#E24A4A] transition hover:bg-[#FDECEC]'
            >
              <div className='flex items-center gap-[12px]'>
                <FiLogOut className='h-[18px] w-[18px]' />
                <span className='text-[14px] font-bold'>Log Out</span>
              </div>
            </button>
          </div>
        </div>

        <div className='flex flex-col gap-[24px] w-full h-full'>
          <div className='w-full h-full flex flex-col gap-[32px] bg-white border-[1px] border-[#E2E8F0] p-[32px] rounded-[24px]'>
            {sectionMap[activeTab]}
          </div>
        </div>
      </div>

      <Navigation />
      <Footer />
    </div>
  );
}

export default AccountPage;