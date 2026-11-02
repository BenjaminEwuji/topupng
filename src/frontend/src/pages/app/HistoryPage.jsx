import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/header';
import Navigation from '../../components/common/navigation';
import Footer from '../../components/common/footer';
import { FiSearch, FiChevronLeft } from 'react-icons/fi';
import api from '../../services/api';

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

function HistoryPage() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'airtime', label: 'Airtime' },
    { id: 'data', label: 'Data' },
  ];

  const label = [
    { id: 1, label: 'Transaction Details' },
    { id: 2, label: 'Phone Number' },
    { id: 3, label: 'Provider' },
    { id: 4, label: 'Date' },
    { id: 5, label: 'Amount' },
    { id: 6, label: 'Status' },
  ];

  useEffect(() => {
    const fetchAllHistory = async () => {
      try {
        const [airtimeRes, dataRes] = await Promise.all([
          api.getAirtimeHistory(50).catch(() => ({ transactions: [] })),
          api.getDataHistory(50).catch(() => ({ transactions: [] })),
        ]);

        const combined = [
          ...(airtimeRes.transactions || []).map((t) => ({ ...t, type: 'Airtime', typeId: 'airtime' })),
          ...(dataRes.transactions || []).map((t) => ({ ...t, type: 'Data Top-up', typeId: 'data' })),
        ]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((tx, idx) => {
            const style = getNetworkStyle(tx.network);
            const statusUpper = (tx.status || 'SUCCESS').toUpperCase();
            const statusColor =
              statusUpper === 'SUCCESS'
                ? 'bg-green-100 text-green-700'
                : statusUpper === 'PENDING'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700';

            const dateStr = tx.createdAt
              ? new Date(tx.createdAt).toLocaleDateString('en-NG', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Recently';

            return {
              id: tx.reference || idx,
              type: tx.type,
              typeId: tx.typeId,
              icon: style.icon,
              bgColor: style.bgColor,
              textColor: style.textColor,
              phone: tx.phoneNumber,
              network: tx.network,
              date: dateStr,
              amount: `₦${Number(tx.amount || 0).toLocaleString()}`,
              status: tx.status,
              statusColor,
            };
          });

        setTransactions(combined);
      } catch (err) {
        console.warn('Could not load history:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllHistory();
  }, []);

  const filteredTransactions = transactions.filter((t) => {
    const matchesFilter = selectedFilter === 'all' || t.typeId === selectedFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      t.phone?.toLowerCase().includes(q) ||
      t.network?.toLowerCase().includes(q) ||
      t.type?.toLowerCase().includes(q) ||
      t.amount?.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="pb-[88px] md:pb-0">
      <Header />
      <div className="mx-auto flex h-full w-full max-w-[1440px] flex-col gap-[32px] px-[24px] py-[24px] md:px-8 md:py-10 lg:px-[120px] lg:py-12">
        <div className="flex w-full flex-col justify-between gap-4 md:flex-row md:items-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="md:hidden flex items-center gap-[8px] text-[14px] font-semibold text-gray-700"
          >
            <span className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-gray-100">
              <FiChevronLeft className="h-[16px] w-[16px]" />
            </span>
            Back
          </button>
          <div className="flex flex-col gap-[6px] md:w-auto">
            <h1 className="text-[24px] font-bold text-gray-900">Transaction History</h1>
            <p className="text-[#475569] text-[14px]">
              Monitor and search your previous airtime and data purchases
            </p>
          </div>
          <div className="flex flex-col items-center gap-[24px] md:flex-row">
            <div className="p-[4px] flex gap-[6px] bg-[white] rounded-[100px] border border-[#E2E8F0]">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-[20px] py-[8px] rounded-[100px] text-[14px] font-bold transition cursor-pointer ${
                    selectedFilter === filter.id
                      ? 'bg-[#3B82F6] text-white'
                      : 'text-[#475569] hover:bg-[#EFF6FF] hover:text-[#2563EB]'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 w-full py-[10px] px-[16px] bg-white border border-gray-200 rounded-[100px] focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
              <FiSearch className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Transactions..."
                className="w-full h-full bg-transparent border-none outline-none text-sm text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="h-full w-full">
          <div className="overflow-hidden rounded-[24px] border-[1px] border-[#E2E8F0] bg-white">
            {loading ? (
              <div className="p-12 text-center text-gray-500 text-sm">
                Loading transactions...
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="p-12 text-center text-gray-500 text-sm">
                No transactions found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse">
                  <thead className="bg-[#e9eef2]">
                    <tr className="border-b border-gray-200">
                      {label.map((item) => (
                        <th
                          key={item.id}
                          className="px-6 py-4 text-left text-sm font-bold text-gray-900 whitespace-nowrap"
                        >
                          {item.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-[14px]">
                            <div
                              className={`h-[40px] w-[40px] rounded-full font-bold flex items-center justify-center ${transaction.bgColor} ${
                                transaction.textColor || 'text-white'
                              }`}
                            >
                              {transaction.icon}
                            </div>
                            <span className="text-sm font-bold text-gray-900">
                              {transaction.type}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.network}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          {transaction.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-[12px] py-[4px] inline-flex text-[14px] font-medium leading-full rounded-full ${transaction.statusColor}`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <Navigation />
      <Footer />
    </div>
  );
}

export default HistoryPage;