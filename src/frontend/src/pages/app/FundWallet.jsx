import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/header';
import Navigation from '../../components/common/navigation';
import Footer from '../../components/common/footer';
import WalletCard from '../../components/sections/fund-wallet/WalletCard';
import ProgressSteps from '../../components/sections/fund-wallet/ProgressSteps';
import BankTransferPage from '../../components/sections/fund-wallet/BankTransferPage';
import VerifyPaymentPage from '../../components/sections/fund-wallet/VerifyPaymentPage';
import PaymentCompletePage from '../../components/sections/fund-wallet/PaymentCompletePage';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const PRESET_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

function FundWallet({ embedded = false, onBack }) {
  const navigate = useNavigate();
  const { wallet, refreshWallet, user } = useAuth();
  const [screen, setScreen] = useState('amount');
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [fundingData, setFundingData] = useState(null);
  const [completedData, setCompletedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBackToDashboard = () => {
    if (onBack) onBack();
    else navigate('/dashboard');
  };

  const handleContinueToTransfer = async () => {
    setError('');
    const amountToFund = customAmount ? Number(customAmount) : selectedAmount;

    if (!amountToFund || amountToFund < 50) {
      setError('Minimum funding amount is ₦50');
      return;
    }

    setLoading(true);

    try {
      // Initialize funding via Safe Haven API
      const res = await api.initializeFunding(amountToFund);
      setFundingData(res);
      await refreshWallet();
      setScreen('bank-transfer');
    } catch (err) {
      // If virtual account already exists in wallet, we can still proceed
      if (wallet?.virtualAccountNumber) {
        setFundingData({
          amount: amountToFund,
          virtualAccount: {
            accountNumber: wallet.virtualAccountNumber,
            bankName: wallet.virtualAccountBank || 'Safe Haven MFB',
            accountName: user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'TopUpNG User',
          },
          reference: `TU-${wallet.userId || '1'}-${Date.now().toString().slice(-6)}`,
        });
        setScreen('bank-transfer');
      } else {
        if (err.status === 401 || err.message === 'Unauthorized') {
          setError('Your session has expired. Please log in again to continue.');
        } else {
          setError(err.message || 'Could not generate virtual account. Please try again.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const activeAmount = customAmount ? Number(customAmount) : selectedAmount;

  const activeVirtualAccount = {
    bankName:
      fundingData?.virtualAccount?.bankName ||
      wallet?.virtualAccountBank ||
      'Safe Haven MFB',
    accountNumber:
      fundingData?.virtualAccount?.accountNumber ||
      wallet?.virtualAccountNumber ||
      'Generating...',
    accountName:
      fundingData?.virtualAccount?.accountName ||
      user?.fullName ||
      `${user?.firstName || ''} ${user?.lastName || ''}`.trim() ||
      'TopUpNG Account',
  };

  // ─── Amount Selection Screen ───────────────────────────────────────────────
  const amountContent = (
    <div className='mx-auto w-full h-full'>
      <div className='mb-[20px] flex flex-col gap-[24px] lg:flex-row lg:items-center lg:justify-between'>
        <div>
          <button
            type='button'
            onClick={handleBackToDashboard}
            className='mb-[6px] flex items-center gap-[6px] rounded-full text-[12px] font-semibold text-[#3B82F6] transition hover:text-[#2563EB] cursor-pointer'
          >
            <span aria-hidden='true' className='text-[18px] leading-none'>‹</span>
            Back to dashboard
          </button>
          <h1 className='text-[20px] font-extrabold leading-tight text-[#0F172A]'>Fund Wallet</h1>
          <p className='mt-[5px] text-[12px] text-[#475569]'>
            Add money to your wallet via your dedicated Safe Haven virtual account
          </p>
        </div>

        <div className='w-full max-w-[320px] lg:pb-[2px]'>
          <ProgressSteps activeStep={0} />
        </div>
      </div>

      {error && (
        <div className='mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center justify-between gap-3'>
          <span>{error}</span>
          {error.includes('session has expired') && (
            <button
              onClick={() => navigate('/login')}
              className='px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition flex-shrink-0'
            >
              Log In
            </button>
          )}
        </div>
      )}

      <div className='grid gap-[26px] lg:grid-cols-[minmax(0,1fr)_352px] lg:gap-[36px]'>
        <section className='rounded-[18px] border border-[#E2E8F0] bg-white p-[18px] shadow-sm sm:p-[24px] lg:rounded-[24px] lg:p-[28px]'>
          <h2 className='text-[18px] font-extrabold text-[#0F172A] lg:text-[20px]'>
            How much would you like to add?
          </h2>
          <p className='mt-[4px] text-[12px] text-[#475569] lg:mt-[6px] lg:text-[14px]'>
            Select a preset or enter a custom amount (Minimum ₦50)
          </p>

          <label className='mt-[18px] block lg:mt-[22px]'>
            <span className='mb-[7px] block text-[12px] font-semibold text-[#475569]'>
              Custom Amount (₦)
            </span>
            <span className='flex h-[46px] items-center gap-[8px] rounded-[13px] border border-[#DCE5F1] bg-white px-[12px] focus-within:border-[#3B82F6] lg:h-[50px] lg:gap-[10px] lg:rounded-[14px] lg:px-[14px]'>
              <span className='text-[12px] font-semibold text-[#475569] lg:text-[14px]'>₦</span>
              <input
                type='number'
                min='50'
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  if (e.target.value) setSelectedAmount(Number(e.target.value));
                }}
                placeholder='Enter amount (Min: ₦50)'
                className='w-full bg-transparent text-[14px] text-[#0F172A] outline-none placeholder:text-[#94A3B8]'
              />
            </span>
          </label>

          <div className='mt-[18px]'>
            <p className='mb-[8px] text-[12px] font-semibold text-[#475569]'>
              Select Preset Amount
            </p>
            <div className='grid grid-cols-3 gap-[8px] sm:grid-cols-6'>
              {PRESET_AMOUNTS.map((amount) => {
                const isSelected = !customAmount && selectedAmount === amount;
                return (
                  <button
                    key={amount}
                    type='button'
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount('');
                    }}
                    className={`flex h-[42px] items-center justify-center rounded-full border px-[8px] text-[12px] font-bold transition cursor-pointer ${
                      isSelected
                        ? 'border-[#3B82F6] bg-[#3B82F6] text-white'
                        : 'border-[#DCE5F1] bg-white text-[#0F172A] hover:border-[#93C5FD]'
                    }`}
                  >
                    ₦{amount.toLocaleString()}
                  </button>
                );
              })}
            </div>
          </div>

          <div className='mt-[24px] p-[16px] rounded-[16px] bg-[#F8FAFC] border border-[#E2E8F0]'>
            <h3 className='text-[13px] font-bold text-[#0F172A] mb-1'>Funding Method</h3>
            <p className='text-[12px] text-[#64748B]'>
              Bank Transfer to dedicated Safe Haven Virtual Account (Instant credit)
            </p>
          </div>
        </section>

        <div className='lg:pt-0'>
          <WalletCard
            method='Bank Transfer'
            onContinue={handleContinueToTransfer}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );

  // ─── Render Active Screen ──────────────────────────────────────────────────
  let content = amountContent;

  if (screen === 'bank-transfer') {
    content = (
      <BankTransferPage
        selectedAmount={activeAmount}
        virtualAccount={activeVirtualAccount}
        reference={fundingData?.reference}
        onBack={() => setScreen('amount')}
        onContinue={() => setScreen('verify-payment')}
      />
    );
  } else if (screen === 'verify-payment') {
    content = (
      <VerifyPaymentPage
        selectedAmount={activeAmount}
        reference={fundingData?.reference}
        virtualAccount={activeVirtualAccount}
        onBack={() => setScreen('bank-transfer')}
        onVerify={(result) => {
          setCompletedData(result);
          setScreen('payment-complete');
        }}
      />
    );
  } else if (screen === 'payment-complete') {
    content = (
      <PaymentCompletePage
        selectedAmount={activeAmount}
        reference={completedData?.reference || fundingData?.reference}
        method='Bank transfer (Safe Haven MFB)'
        date='Just now'
        newBalance={
          completedData?.newBalance ||
          (wallet?.balanceNaira !== undefined
            ? `₦${Number(wallet.balanceNaira).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`
            : `₦${Number(activeAmount).toLocaleString()}.00`)
        }
        onBack={() => setScreen('amount')}
        onBackHome={handleBackToDashboard}
      />
    );
  }

  if (embedded) {
    return <div className='min-h-screen bg-[#F8FAFC] px-0 py-[22px] pb-[110px] md:pb-[32px]'>{content}</div>;
  }

  return (
    <div>
      <Header />
      <main className='mx-auto flex flex-col gap-[24px] h-full w-full max-w-[1440px] px-0 py-0 md:px-8 md:py-10 lg:px-[120px] lg:py-12'>
        {content}
      </main>
      <Footer />
      <Navigation />
    </div>
  );
}

export default FundWallet;