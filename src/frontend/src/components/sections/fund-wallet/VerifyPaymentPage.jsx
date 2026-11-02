import React, { useState, useEffect, useCallback } from 'react';
import { FiChevronLeft, FiShield, FiRefreshCw, FiClock } from 'react-icons/fi';
import ProgressSteps from './ProgressSteps';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

export default function VerifyPaymentPage({
  selectedAmount = 1000,
  reference = '',
  virtualAccount = {},
  onBack,
  onVerify,
}) {
  const { wallet, refreshWallet } = useAuth();
  const [checking, setChecking] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [initialBalance] = useState(wallet?.balance ?? 0);

  const checkPaymentStatus = useCallback(async () => {
    setChecking(true);
    setErrorMsg('');

    try {
      // 1. Check funding status by reference if available
      if (reference) {
        const fundingRes = await api.verifyFunding(reference).catch(() => null);
        if (fundingRes?.status === 'SUCCESS') {
          await refreshWallet();
          onVerify({
            reference,
            amount: fundingRes.amount || selectedAmount,
            method: 'Bank Transfer (Safe Haven MFB)',
            newBalance: `₦${Number(((wallet?.balance || 0) + (selectedAmount * 100)) / 100).toLocaleString()}.00`,
          });
          return;
        }
      }

      // 2. Also check if the wallet balance has incremented via webhook
      const updatedWallet = await refreshWallet();
      if (updatedWallet && updatedWallet.balance > initialBalance) {
        onVerify({
          reference,
          amount: selectedAmount,
          method: 'Bank Transfer (Safe Haven MFB)',
          newBalance: `₦${Number(updatedWallet.balance / 100).toLocaleString()}.00`,
        });
        return;
      }

      setErrorMsg('Transfer not yet received. Bank transfers usually reflect within 1 - 3 minutes.');
    } catch (err) {
      setErrorMsg('Error checking status. Please try again.');
    } finally {
      setChecking(false);
    }
  }, [reference, selectedAmount, initialBalance, wallet?.balance, refreshWallet, onVerify]);

  // Poll automatically every 5 seconds for up to 2 minutes
  useEffect(() => {
    const timer = setInterval(() => {
      checkPaymentStatus();
    }, 6000);

    return () => clearInterval(timer);
  }, [checkPaymentStatus]);

  return (
    <div className='w-full'>
      <div className='flex flex-col gap-[20px] md:gap-[28px]'>
        <div className='flex flex-col gap-[18px] xl:flex-row xl:items-center xl:justify-between'>
          <div className='flex flex-col gap-[8px]'>
            <button
              type='button'
              onClick={onBack}
              className='mb-[2px] flex w-fit items-center gap-[6px] rounded-full text-[12px] font-semibold text-[#3B82F6] transition hover:text-[#2563EB] cursor-pointer'
            >
              <FiChevronLeft className='h-[16px] w-[16px]' />
              Back
            </button>
            <h1 className='text-[28px] font-extrabold tracking-[-0.04em] text-[#0F172A] md:text-[32px]'>
              Verifying Transfer
            </h1>
            <p className='text-[14px] text-[#64748B] md:text-[16px]'>
              We are waiting to confirm your transfer from Safe Haven MFB
            </p>
          </div>

          <div className='w-full max-w-[420px]'>
            <ProgressSteps activeStep={2} />
          </div>
        </div>

        <div className='flex flex-col gap-[24px] xl:flex-row xl:items-stretch xl:justify-between'>
          <div className='w-full max-w-[760px] rounded-[24px] border border-[#E2E8F0] bg-white p-[24px] md:p-[32px] shadow-sm'>
            <div className='rounded-[20px] border border-[#D9EAF8] bg-[#F8FBFF] p-[24px] text-center flex flex-col items-center'>
              {/* Animated status ring */}
              <div className='relative flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#E0F2FE] text-[#2563EB] mb-4'>
                <FiRefreshCw className={`h-[30px] w-[30px] ${checking ? 'animate-spin' : ''}`} />
              </div>

              <h2 className='text-[22px] font-extrabold text-[#0F172A]'>
                Waiting for Bank Confirmation
              </h2>
              <p className='mt-[6px] text-[14px] text-[#64748B] max-w-[440px]'>
                Your transfer of <strong className='text-gray-900'>₦{Number(selectedAmount || 0).toLocaleString()}</strong> to Safe Haven virtual account{' '}
                <strong className='text-blue-600 font-mono'>{virtualAccount.accountNumber || ''}</strong> is being processed.
              </p>

              {errorMsg && (
                <div className='mt-[18px] rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800 flex items-center gap-2'>
                  <FiClock className='shrink-0' />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className='mt-[24px] flex flex-col sm:flex-row items-center gap-3 w-full justify-center'>
                <button
                  type='button'
                  onClick={checkPaymentStatus}
                  disabled={checking}
                  className='w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-50 px-[24px] py-[13px] text-[15px] font-bold text-white transition cursor-pointer shadow-sm'
                >
                  <FiRefreshCw className={checking ? 'animate-spin' : ''} />
                  {checking ? 'Checking Transfer...' : 'Check Status Now'}
                </button>

                <button
                  type='button'
                  onClick={async () => {
                    try {
                      await api.simulateFunding(virtualAccount.accountNumber, selectedAmount);
                      await checkPaymentStatus();
                    } catch (e) {
                      await checkPaymentStatus();
                    }
                  }}
                  className='w-full sm:w-auto flex items-center justify-center gap-2 rounded-full border border-emerald-500 bg-emerald-50 hover:bg-emerald-100 px-[20px] py-[13px] text-[14px] font-bold text-emerald-700 transition cursor-pointer'
                >
                  ⚡ Simulate Credit (Sandbox)
                </button>
              </div>

              <div className='mt-[20px] flex items-center gap-[10px] rounded-[12px] bg-[#E0F2FE] px-[14px] py-[12px] text-[13px] text-[#0F172A] text-left w-full'>
                <FiShield className='h-[16px] w-[16px] text-[#2563EB] shrink-0' />
                <span>
                  Safe Haven MFB automatically credits your wallet via webhook as soon as NIBSS settles the transfer.
                </span>
              </div>
            </div>
          </div>

          {/* Right Summary */}
          <div className='w-full max-w-[420px] self-start'>
            <div className='rounded-[24px] border border-[#D9EAF8] bg-white p-[20px] shadow-sm'>
              <h3 className='text-[18px] font-extrabold text-[#0F172A] pb-[14px] border-b border-[#E2E8F0]'>
                Transfer Summary
              </h3>

              <div className='mt-[16px] space-y-[12px] text-[14px] text-[#334155]'>
                <div className='flex items-center justify-between'>
                  <span className='text-[#64748B]'>Bank</span>
                  <span className='font-bold text-[#0F172A]'>{virtualAccount.bankName || 'Safe Haven MFB'}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-[#64748B]'>Account Number</span>
                  <span className='font-mono font-bold text-[#2563EB]'>{virtualAccount.accountNumber}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-[#64748B]'>Amount</span>
                  <span className='font-bold text-[#0F172A]'>₦{Number(selectedAmount || 0).toLocaleString()}.00</span>
                </div>
                {reference && (
                  <div className='flex items-center justify-between'>
                    <span className='text-[#64748B]'>Reference</span>
                    <span className='font-mono text-xs text-[#0F172A] truncate max-w-[180px]'>{reference}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
