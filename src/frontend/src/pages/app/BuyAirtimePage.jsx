import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiGlobe, FiChevronLeft } from 'react-icons/fi';
import Header from '../../components/common/header';
import Navigation from '../../components/common/navigation';
import Footer from '../../components/common/footer';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const DEFAULT_NETWORKS = [
  { id: 'MTN', name: 'MTN', icon: 'M', bgColor: 'bg-yellow-400', textColor: 'text-black', serviceCategoryId: '' },
  { id: 'AIRTEL', name: 'Airtel', icon: 'A', bgColor: 'bg-red-600', textColor: 'text-white', serviceCategoryId: '' },
  { id: 'GLO', name: 'Glo', icon: 'G', bgColor: 'bg-green-600', textColor: 'text-white', serviceCategoryId: '' },
  { id: '9MOBILE', name: '9mobile', icon: '9', bgColor: 'bg-teal-900', textColor: 'text-white', serviceCategoryId: '' },
];

const PRESET_AMOUNTS = [
  { amount: '₦100', value: 100 },
  { amount: '₦200', value: 200 },
  { amount: '₦500', value: 500 },
  { amount: '₦1000', value: 1000 },
  { amount: '₦2000', value: 2000 },
  { amount: '₦5000', value: 5000 },
];

function BuyAirtimePage() {
  const navigate = useNavigate();
  const { wallet, refreshWallet } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('MTN');
  const [selectedAmount, setSelectedAmount] = useState('₦1000');
  const [customAmount, setCustomAmount] = useState('');
  const [networks, setNetworks] = useState(DEFAULT_NETWORKS);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Fetch Safe Haven VAS network categories
  useEffect(() => {
    const fetchNetworks = async () => {
      try {
        const res = await api.getAirtimeNetworks();
        if (res?.networks?.length) {
          const mapped = res.networks.map((cat) => {
            const upper = cat.name.toUpperCase();
            const matched = DEFAULT_NETWORKS.find((d) => upper.includes(d.id)) || {
              bgColor: 'bg-blue-600',
              textColor: 'text-white',
              icon: cat.name[0],
            };
            return {
              id: cat.name,
              name: cat.name,
              serviceCategoryId: cat.serviceCategoryId,
              icon: matched.icon || cat.name[0],
              bgColor: matched.bgColor,
              textColor: matched.textColor,
            };
          });
          setNetworks(mapped);
          if (mapped[0]) setSelectedNetwork(mapped[0].name);
        }
      } catch (err) {
        console.warn('Could not load live networks from Safe Haven:', err.message);
      }
    };
    fetchNetworks();
  }, []);

  const parseCurrencyValue = (value) => {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    const sanitizedValue = String(value ?? '').replace(/[^\d.]/g, '');
    const parsedValue = Number(sanitizedValue);
    return Number.isFinite(parsedValue) ? parsedValue : 0;
  };

  const displayAmount = customAmount
    ? parseCurrencyValue(customAmount)
    : parseCurrencyValue(selectedAmount);

  const formatNaira = (value) => `₦${Number(value).toLocaleString()}`;
  const cashback = (displayAmount * 5) / 100;
  const totalToPay = displayAmount;

  const currentNetworkObj =
    networks.find((n) => n.id === selectedNetwork || n.name === selectedNetwork) ||
    networks[0];

  const handlePayNow = async () => {
    setStatusMessage(null);

    // Validation
    if (!phoneNumber || phoneNumber.trim().length < 11) {
      setStatusMessage({
        type: 'error',
        text: 'Please enter a valid 11-digit Nigerian phone number.',
      });
      return;
    }

    if (!displayAmount || displayAmount < 50) {
      setStatusMessage({
        type: 'error',
        text: 'Minimum airtime purchase is ₦50.',
      });
      return;
    }

    const balanceNaira = wallet?.balanceNaira ?? (wallet?.balance ? wallet.balance / 100 : 0);
    if (balanceNaira < displayAmount) {
      setStatusMessage({
        type: 'error',
        text: `Insufficient wallet balance (₦${balanceNaira.toFixed(2)}). Please fund your wallet first.`,
      });
      return;
    }

    setLoading(true);

    try {
      const formattedPhone = phoneNumber.startsWith('+234')
        ? phoneNumber
        : phoneNumber.startsWith('0')
        ? `+234${phoneNumber.slice(1)}`
        : `+234${phoneNumber}`;

      const res = await api.buyAirtime({
        serviceCategoryId: currentNetworkObj.serviceCategoryId || 'default-category',
        network: currentNetworkObj.name,
        phoneNumber: formattedPhone,
        amount: displayAmount,
      });

      await refreshWallet();

      setStatusMessage({
        type: 'success',
        text: res.message || `₦${displayAmount} airtime purchased successfully! Ref: ${res.reference}`,
      });
      setPhoneNumber('');
    } catch (err) {
      const isExpired =
        err.status === 401 ||
        err.message?.toLowerCase().includes('expired') ||
        err.message?.toLowerCase().includes('unauthorized');

      setStatusMessage({
        type: 'error',
        isExpired,
        text: isExpired
          ? 'Your login session has expired. Please log in again to continue.'
          : err.message || 'Airtime purchase failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full pb-[88px] md:pb-0">
      <Header />
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[40px] bg-gray-50 px-0 py-0 md:flex-row md:px-8 md:py-10 lg:px-[120px] lg:py-12">
        <div className="flex h-full w-full max-w-[708px] flex-grow flex-col items-start gap-[28px] bg-white p-[15px] md:rounded-[24px] md:border-[1px] md:p-[40px]">
          <div className="flex flex-col gap-[8px] w-full">
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
            <h1 className="text-[24px] font-bold text-gray-900">Buy Airtime</h1>
            <p className="text-[14px] text-gray-500">
              Enter details below to purchase instant talktime
            </p>
          </div>

          {statusMessage && (
            <div
              className={`w-full p-4 rounded-xl text-sm font-medium flex items-center justify-between gap-3 ${
                statusMessage.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}
            >
              <span>{statusMessage.text}</span>
              {statusMessage.isExpired && (
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 shrink-0 cursor-pointer"
                >
                  Log In Again
                </button>
              )}
            </div>
          )}

          {/* Phone Number */}
          <div className="flex flex-col gap-[8px] w-full">
            <label htmlFor="Number" className="text-[14px] font-bold text-gray-900">
              Phone Number
            </label>
            <div className="flex items-center gap-[12px] h-[48px] w-full rounded-[12px] border-[1px] border-[#E5E7EB] px-[16px] bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
              <FiGlobe className="w-[20px] h-[20px] text-gray-400 flex-shrink-0" />
              <input
                type="tel"
                maxLength="11"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="08032088222"
                id="Number"
                className="w-full h-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-[14px] text-gray-900 placeholder:text-gray-400"
              />
              <div className="w-[16px] h-[16px] rounded-full border-[2px] border-blue-500 flex-shrink-0" />
            </div>
          </div>

          {/* Network Provider */}
          <div className="w-full flex flex-col gap-[8px]">
            <label className="block text-sm font-bold text-gray-900">
              Select Network Provider
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {networks.map((network) => (
                <button
                  key={network.id}
                  type="button"
                  onClick={() => setSelectedNetwork(network.id)}
                  className={`py-[8px] px-[8px] flex-wrap rounded-[25px] font-semibold transition flex items-center justify-center gap-3 cursor-pointer ${
                    selectedNetwork === network.id
                      ? 'bg-white border-2 border-blue-600 text-blue-600'
                      : 'bg-white border-2 border-gray-200 text-gray-900 hover:border-blue-600'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${network.bgColor} ${network.textColor}`}
                  >
                    {network.icon}
                  </div>
                  <span className="text-base">{network.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Preset Amounts */}
          <div className="w-full flex flex-col gap-[8px]">
            <label className="block text-sm font-bold text-gray-900">Amount</label>
            <div className="grid grid-cols-3 gap-[16px]">
              {PRESET_AMOUNTS.map((item) => (
                <button
                  key={item.amount}
                  type="button"
                  onClick={() => {
                    setCustomAmount('');
                    setSelectedAmount(item.amount);
                  }}
                  className={`p-3 border-[1px] rounded-[16px] font-bold cursor-pointer transition ${
                    selectedAmount === item.amount && !customAmount
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-200 text-black hover:bg-blue-50'
                  }`}
                >
                  {item.amount}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="flex flex-col gap-[8px] w-full">
            <label htmlFor="customAmount" className="text-[14px] font-bold text-gray-900">
              Custom Amount (₦)
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={12}
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="Enter Custom Amount (Min: ₦50)"
              id="customAmount"
              className="h-[48px] rounded-[12px] border-[1px] border-[#E5E7EB] px-[16px] outline-none focus:border-blue-500"
            />
            <button
              onClick={handlePayNow}
              disabled={loading}
              className="w-full h-[48px] bg-[#3B82F6] hover:bg-blue-700 disabled:opacity-50 mt-[12px] rounded-[25px] text-white font-bold text-[16px] transition md:hidden block cursor-pointer"
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="sticky top-24 hidden h-full w-full max-w-[380px] flex-col gap-[20px] rounded-[24px] border-[1px] bg-white p-[28px] md:flex">
          <h1 className="text-[18px] font-extrabold text-gray-900 pb-[20px] border-b-[1px] border-gray-200">
            Order Summary
          </h1>
          <div className="flex flex-col border-b-[1px] border-gray-200 gap-[14px] pb-[20px]">
            <div className="flex justify-between">
              <span className="text-[14px] font-medium text-gray-900">Recipient</span>
              <span className="text-[14px] font-bold text-gray-900">
                {phoneNumber || 'Not entered'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[14px] font-medium text-gray-900">Provider</span>
              <span className="text-[14px] font-bold text-gray-900">
                {currentNetworkObj.name} Nigeria
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[14px] font-medium text-gray-900">Amount</span>
              <span className="text-[14px] text-gray-900 font-bold">
                {formatNaira(displayAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[14px] font-medium text-gray-900">CashBack (5%)</span>
              <span className="text-[14px] text-green-500 font-bold">
                +{formatNaira(cashback)}
              </span>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-[16px] font-bold text-gray-900">Total to Pay</span>
            <span className="text-[22px] font-bold text-[#3B82F6]">
              {formatNaira(totalToPay)}
            </span>
          </div>
          <button
            onClick={handlePayNow}
            disabled={loading}
            className="w-full h-[48px] bg-[#3B82F6] hover:bg-blue-700 disabled:opacity-50 rounded-[25px] text-white font-bold text-[16px] transition cursor-pointer"
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </div>
      <Navigation />
      <Footer />
    </div>
  );
}

export default BuyAirtimePage;
