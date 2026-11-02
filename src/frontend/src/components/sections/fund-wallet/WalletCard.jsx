import React from 'react';
import { FiCreditCard, FiHome, FiShield } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';

export default function WalletCard({ method = 'Bank Transfer', onContinue, loading = false }) {
  const { wallet } = useAuth();
  const balance =
    wallet?.balanceNaira !== undefined
      ? `₦${Number(wallet.balanceNaira).toLocaleString('en-NG', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : '₦0.00';

  const MethodIcon = method === 'Bank Transfer' ? FiHome : FiCreditCard;

  return (
    <div className="w-full h-full">
      <div className="rounded-[20px] flex flex-col bg-gradient-to-r from-[#3B82F6] to-[#2563EB] p-[28px] text-white shadow-[0_18px_34px_rgba(37,99,235,0.22)]">
        <div className="flex items-center justify-between gap-[12px]">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-blue-100 uppercase">
            Wallet Balance
          </p>
          <span className="rounded-full bg-white/15 px-[10px] py-[5px] text-[10px] font-semibold text-white/90 backdrop-blur-sm">
            Available
          </span>
        </div>

        <h3 className="mt-[18px] text-[30px] font-extrabold leading-none tracking-[-0.04em] text-white md:text-[34px]">
          {balance}
        </h3>

        <p className="mt-[12px] text-[12px] text-blue-100">
          {wallet?.virtualAccountNumber
            ? `Acct: ${wallet.virtualAccountNumber} (${wallet.virtualAccountBank || 'Safe Haven MFB'})`
            : 'Refreshed just now'}
        </p>
      </div>

      <div className="mt-[18px] rounded-[18px] border border-[#D9EAF8] bg-[#F8FBFF] p-[18px]">
        <div className="flex items-center justify-between gap-[12px]">
          <div className="flex items-center gap-[12px]">
            <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#E0F2FE] text-[#2563EB]">
              <MethodIcon className="h-[16px] w-[16px]" />
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-[0.16em] text-[#64748B] uppercase">
                Selected Method
              </p>
              <p className="mt-[4px] text-[20px] font-semibold text-[#0F172A]">{method}</p>
            </div>
          </div>
        </div>

        <div className="mt-[18px] flex items-center gap-[10px] rounded-[12px] bg-[#E0F2FE] px-[12px] py-[12px] text-[13px] text-[#0F172A]">
          <FiShield className="h-[18px] w-[18px] text-[#2563EB]" />
          <span>Your payment details are protected with bank-grade encryption.</span>
        </div>

        <button
          type="button"
          onClick={onContinue}
          disabled={loading}
          className="mt-[18px] w-full rounded-full bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-50 px-[18px] py-[14px] text-[16px] font-bold text-white transition cursor-pointer"
        >
          {loading ? 'Processing...' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
