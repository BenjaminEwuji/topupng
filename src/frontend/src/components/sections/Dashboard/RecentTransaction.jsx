import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';

const NETWORK_COLORS = {
  MTN: { bgColor: 'bg-yellow-400', textColor: 'text-black', icon: 'M' },
  AIRTEL: { bgColor: 'bg-red-600', textColor: 'text-white', icon: 'A' },
  GLO: { bgColor: 'bg-green-600', textColor: 'text-white', icon: 'G' },
  '9MOBILE': { bgColor: 'bg-teal-900', textColor: 'text-white', icon: '9' },
};

function getNetworkStyle(networkName = '') {
  const upper = networkName.toUpperCase();
  for (const [key, val] of Object.entries(NETWORK_COLORS)) {
    if (upper.includes(key)) return val;
  }
  return { bgColor: 'bg-blue-600', textColor: 'text-white', icon: networkName[0] || 'T' };
}

export default function RecentTransactions({ isMobile = false }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const [airtimeRes, dataRes] = await Promise.all([
          api.getAirtimeHistory(5).catch(() => ({ transactions: [] })),
          api.getDataHistory(5).catch(() => ({ transactions: [] })),
        ]);

        const combined = [
          ...(airtimeRes.transactions || []).map((t) => ({ ...t, type: 'Airtime' })),
          ...(dataRes.transactions || []).map((t) => ({ ...t, type: 'Data Top-up' })),
        ]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
          .map((tx, idx) => {
            const style = getNetworkStyle(tx.network);
            const statusUpper = (tx.status || 'SUCCESS').toUpperCase();
            const statusColor =
              statusUpper === 'SUCCESS'
                ? 'bg-green-100 text-green-700'
                : statusUpper === 'PENDING'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700';

            return {
              id: tx.reference || idx,
              type: tx.type,
              icon: style.icon,
              bgColor: style.bgColor,
              textColor: style.textColor,
              phone: tx.phoneNumber,
              network: tx.network,
              amount: `₦${Number(tx.amount || 0).toLocaleString()}`,
              status: tx.status,
              statusColor,
            };
          });

        setTransactions(combined);
      } catch (err) {
        console.warn('Could not load transactions:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="flex flex-col w-full gap-[16px]">
      <div className="flex justify-between items-center">
        <h2 className="md:text-2xl text-[16px] font-bold text-gray-900">
          Recent Transactions
        </h2>
        <Link to="/history" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
          View All
        </Link>
      </div>

      <div className="w-full max-w-[700px] md:border-2 border-none rounded-[20px] overflow-hidden bg-white">
        {loading ? (
          <div className="p-8 text-center text-gray-500 text-sm">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No transactions yet. Buy airtime or data to get started!
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="md:block hidden w-full">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-[#e9eef2]">
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Type</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Phone Number</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Network</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Amount</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, index) => (
                    <tr
                      key={tx.id}
                      className={`hover:bg-gray-50 transition ${
                        index !== transactions.length - 1 ? 'border-b border-gray-200' : ''
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`${tx.bgColor} ${tx.textColor || 'text-white'} w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0`}
                          >
                            {tx.icon}
                          </div>
                          <span className="font-semibold text-gray-900 text-sm">{tx.type}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600 text-sm">{tx.phone}</td>
                      <td className="py-4 px-6 text-gray-600 text-sm">{tx.network}</td>
                      <td className="py-4 px-6 font-bold text-gray-900 text-sm">{tx.amount}</td>
                      <td className="py-4 px-6">
                        <span className={`text-xs font-medium ${tx.statusColor} px-3 py-1.5 rounded-full inline-block`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile List View */}
            <div className="md:hidden flex flex-col gap-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-md transition">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`${tx.bgColor} ${tx.textColor || 'text-white'} w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0`}
                      >
                        {tx.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm">{tx.type}</h3>
                        <p className="text-xs text-gray-600 truncate">
                          {tx.network} • {tx.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="font-bold text-gray-900 text-base">{tx.amount}</p>
                      <span className={`text-xs font-medium ${tx.statusColor} px-3 py-1 rounded-full whitespace-nowrap`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}