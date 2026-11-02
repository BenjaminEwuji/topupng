import React, { useState } from 'react';
import { FiChevronLeft, FiShield, FiCopy, FiCheck, FiInfo } from 'react-icons/fi';
import ProgressSteps from './ProgressSteps';
import api from '../../../services/api';

export default function BankTransferPage({
  selectedAmount = 1000,
  virtualAccount = {},
  reference = '',
  onBack,
  onContinue,
}) {
  const [copied, setCopied] = useState(false);

  const bankName = virtualAccount.bankName || 'Safe Haven MFB';
  const accountNumber = virtualAccount.accountNumber || 'Generating...';
  const accountName = virtualAccount.accountName || 'TopUpNG User';

  const handleCopy = () => {
    if (accountNumber && accountNumber !== 'Generating...') {
      navigator.clipboard.writeText(accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

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
              Bank Transfer
            </h1>
            <p className='text-[14px] text-[#64748B] md:text-[16px]'>
              Make a transfer to your dedicated Safe Haven virtual account
            </p>
          </div>

          <div className='w-full max-w-[420px]'>
            <ProgressSteps activeStep={1} />
          </div>
        </div>

        <div className='flex flex-col gap-[24px] xl:flex-row xl:items-stretch xl:justify-between'>
          {/* Main Transfer Details Card */}
          <div className='w-full max-w-[760px] rounded-[24px] border border-[#E2E8F0] bg-white p-[20px] md:p-[28px] shadow-sm'>
            <div className='flex flex-col gap-[6px]'>
              <h2 className='text-[18px] font-extrabold tracking-[-0.03em] text-[#0F172A] md:text-[22px]'>
                Your Dedicated Virtual Account
              </h2>
              <p className='text-[14px] text-[#64748B] md:text-[15px]'>
                Send ₦{Number(selectedAmount || 0).toLocaleString()} to this account from any Nigerian bank app.
              </p>
            </div>

            <div className='mt-[16px] rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 flex items-start gap-2.5'>
              <FiInfo className='h-4 w-4 text-amber-600 shrink-0 mt-0.5' />
              <div>
                <strong className='font-semibold'>Sandbox Environment:</strong> This is a development test account. Real commercial banking apps (GTBank, Access, Kuda, OPay, etc.) only route real money to live NIBSS accounts. To test deposit and wallet balance in development, click <span className='font-semibold underline text-amber-950'>Simulate Deposit (Sandbox Test)</span> below.
              </div>
            </div>
            <div className='mt-[24px] rounded-[20px] border border-[#CBD5E1] bg-[#F8FAFC] p-[20px] flex flex-col gap-[18px]'>
              {/* Bank Name */}
              <div className='flex items-center justify-between border-b border-[#E2E8F0] pb-[14px]'>
                <span className='text-[14px] font-semibold text-[#64748B]'>Bank Name</span>
                <span className='text-[16px] font-bold text-[#0F172A]'>{bankName}</span>
              </div>

              {/* Account Number with Copy Button */}
              <div className='flex items-center justify-between border-b border-[#E2E8F0] pb-[14px]'>
                <span className='text-[14px] font-semibold text-[#64748B]'>Account Number</span>
                <div className='flex items-center gap-[10px]'>
                  <span className='text-[20px] font-mono font-extrabold tracking-wider text-[#2563EB]'>
                    {accountNumber}
                  </span>
                  <button
                    type='button'
                    onClick={handleCopy}
                    className='flex items-center gap-[5px] rounded-full bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0284C7] px-[12px] py-[6px] text-[12px] font-bold transition cursor-pointer'
                  >
                    {copied ? (
                      <>
                        <FiCheck className='h-[14px] w-[14px] text-green-600' />
                        <span className='text-green-600'>Copied!</span>
                      </>
                    ) : (
                      <>
                        <FiCopy className='h-[14px] w-[14px]' />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Account Name */}
              <div className='flex items-center justify-between border-b border-[#E2E8F0] pb-[14px]'>
                <span className='text-[14px] font-semibold text-[#64748B]'>Account Name</span>
                <span className='text-[15px] font-bold text-[#0F172A] text-right'>{accountName}</span>
              </div>

              {/* Amount to Transfer */}
              <div className='flex items-center justify-between'>
                <span className='text-[14px] font-semibold text-[#64748B]'>Amount to Transfer</span>
                <span className='text-[18px] font-extrabold text-[#0F172A]'>
                  ₦{Number(selectedAmount || 0).toLocaleString()}.00
                </span>
              </div>
            </div>

            {/* Security Banner */}
            <div className='mt-[20px] flex items-center gap-[12px] rounded-[14px] border border-[#D9EAF8] bg-[#F4FAFF] px-[16px] py-[14px] text-[13px] text-[#0F172A]'>
              <FiShield className='h-[18px] w-[18px] text-[#2563EB] shrink-0' />
              <span>
                Funds transferred to this account are deposited into your TopUpNG wallet automatically via Safe Haven MFB webhook.
              </span>
            </div>
          </div>

          {/* Right Sidebar: Instructions & Action */}
          <div className='w-full max-w-[420px] self-start flex flex-col gap-[18px]'>
            <div className='rounded-[22px] border border-[#D9EAF8] bg-[#F5F9FE] p-[20px]'>
              <h3 className='text-[18px] font-extrabold text-[#0F172A] mb-[14px] flex items-center gap-2'>
                <FiInfo className='text-[#2563EB]' /> How to complete payment
              </h3>

              <div className='flex flex-col gap-[12px]'>
                {[
                  'Open your bank mobile app (GTB, Kuda, Zenith, OPay, etc.)',
                  'Select Send Money / Transfer to Bank',
                  'Select "Safe Haven MFB" as the destination bank',
                  `Enter account number: ${accountNumber}`,
                  `Transfer ₦${Number(selectedAmount || 0).toLocaleString()} and confirm`,
                ].map((step, index) => (
                  <div key={index} className='flex items-start gap-[12px] rounded-[12px] border border-[#E2E8F0] bg-white p-[12px]'>
                    <span className='flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full bg-[#E0F2FE] text-[12px] font-bold text-[#2563EB]'>
                      {index + 1}
                    </span>
                    <span className='text-[13px] font-medium text-[#334155] leading-snug'>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className='rounded-[22px] border border-[#D9EAF8] bg-white p-[20px] shadow-sm'>
              <div className='flex items-center justify-between text-[14px] text-[#64748B] mb-2'>
                <span>Total to Fund</span>
                <span className='text-[20px] font-extrabold text-[#2563EB]'>
                  ₦{Number(selectedAmount || 0).toLocaleString()}.00
                </span>
              </div>

              {reference && (
                <p className='text-[11px] text-[#94A3B8] font-mono mb-4 truncate'>
                  Ref: {reference}
                </p>
              )}

              <div className='flex flex-col gap-2'>
                <button
                  type='button'
                  onClick={onContinue}
                  className='w-full rounded-full bg-[#3B82F6] hover:bg-[#2563EB] px-[18px] py-[15px] text-[16px] font-bold text-white transition cursor-pointer shadow-md'
                >
                  I have made this transfer
                </button>

                <button
                  type='button'
                  onClick={async () => {
                    try {
                      await api.simulateFunding(accountNumber, selectedAmount);
                      onContinue();
                    } catch (e) {
                      onContinue();
                    }
                  }}
                  className='w-full rounded-full border border-emerald-500 bg-emerald-50 hover:bg-emerald-100 px-[18px] py-[12px] text-[14px] font-bold text-emerald-700 transition cursor-pointer flex items-center justify-center gap-2'
                >
                  ⚡ Simulate Deposit (Sandbox Test)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
