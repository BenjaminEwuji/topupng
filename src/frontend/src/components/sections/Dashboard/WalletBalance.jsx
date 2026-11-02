import React from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function WalletBalance({ onViewChange }) {
  const { wallet } = useAuth();
  const balance =
    wallet?.balanceNaira !== undefined
      ? `₦${Number(wallet.balanceNaira).toLocaleString('en-NG', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : '₦0.00';

  return (
    <div className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white rounded-[24px] p-[20px] md:p-[28px] flex flex-col md:gap-[20px] justify-between items-start w-full">
      <div className="flex justify-between items-center w-full">
        <p className="text-white text-[13px] font-semibold md:text-base">
          WALLET BALANCE
        </p>

        <button
          onClick={onViewChange}
          className="bg-white/20 hover:bg-white/30 text-white rounded-[100px] px-[10px] md:px-[16px] py-[6px] text-[12px] md:text-sm font-semibold transition backdrop-blur-sm cursor-pointer"
        >
          + Fund Wallet
        </button>
      </div>
      <div>
        <h1 className="md:text-[36px] text-[32px] font-extrabold text-white">
          {balance}
        </h1>
        <p className="text-white text-[11px] mt-2">
          {wallet?.virtualAccountNumber
            ? `Acct: ${wallet.virtualAccountNumber} (${wallet.virtualAccountBank || 'Safe Haven MFB'})`
            : 'Click Fund Wallet to generate your account'}
        </p>
      </div>
    </div>
  );
}