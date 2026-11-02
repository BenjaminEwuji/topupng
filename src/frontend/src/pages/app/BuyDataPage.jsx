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

const FALLBACK_PLANS = [
  { id: '1GB', bundleCode: 'DATA-1GB', size: '1GB', validity: '30 Days', price: 300, description: 'Valid for 30 days' },
  { id: '2GB', bundleCode: 'DATA-2GB', size: '2GB', validity: '30 Days', price: 500, description: 'Valid for 30 days' },
  { id: '5GB', bundleCode: 'DATA-5GB', size: '5GB', validity: '30 Days', price: 1200, description: 'Valid for 30 days' },
  { id: '10GB', bundleCode: 'DATA-10GB', size: '10GB', validity: '30 Days', price: 2500, description: 'Valid for 30 days' },
];

function BuyDataPage() {
  const navigate = useNavigate();
  const { wallet, refreshWallet } = useAuth();
  const [selectedNetwork, setSelectedNetwork] = useState('MTN');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [networks, setNetworks] = useState(DEFAULT_NETWORKS);
  const [dataPlans, setDataPlans] = useState(FALLBACK_PLANS);
  const [selectedPlanId, setSelectedPlanId] = useState(FALLBACK_PLANS[0].id);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Load networks from Safe Haven VAS
  useEffect(() => {
    const fetchNetworks = async () => {
      try {
        const res = await api.getDataNetworks();
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
        console.warn('Could not load live data networks:', err.message);
      }
    };
    fetchNetworks();
  }, []);

  const currentNetworkObj =
    networks.find((n) => n.id === selectedNetwork || n.name === selectedNetwork) ||
    networks[0];

  // Fetch plans when selected network category changes
  useEffect(() => {
    if (!currentNetworkObj?.serviceCategoryId) return;

    const fetchPlans = async () => {
      try {
        const res = await api.getDataPlans(currentNetworkObj.serviceCategoryId);
        if (res?.plans?.length) {
          const mapped = res.plans.map((p) => ({
            id: p.id || p.bundleCode,
            bundleCode: p.bundleCode,
            size: p.name,
            validity: p.validity || '30 Days',
            price: p.amount,
            description: p.description || p.name,
          }));
          setDataPlans(mapped);
          setSelectedPlanId(mapped[0]?.id);
        }
      } catch (err) {
        console.warn('Could not load live plans for network:', err.message);
      }
    };
    fetchPlans();
  }, [currentNetworkObj?.serviceCategoryId]);

  const selectedPlanData =
    dataPlans.find((plan) => plan.id === selectedPlanId) || dataPlans[0];

  const handlePayNow = async () => {
    setStatusMessage(null);

    if (!phoneNumber || phoneNumber.trim().length < 11) {
      setStatusMessage({
        type: 'error',
        text: 'Please enter a valid 11-digit Nigerian phone number.',
      });
      return;
    }

    if (!selectedPlanData) {
      setStatusMessage({
        type: 'error',
        text: 'Please select a data bundle.',
      });
      return;
    }

    const balanceNaira = wallet?.balanceNaira ?? (wallet?.balance ? wallet.balance / 100 : 0);
    if (balanceNaira < selectedPlanData.price) {
      setStatusMessage({
        type: 'error',
        text: `Insufficient wallet balance (₦${balanceNaira.toFixed(2)}). Required: ₦${selectedPlanData.price}. Please fund your wallet.`,
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

      const res = await api.buyData({
        serviceCategoryId: currentNetworkObj.serviceCategoryId || 'default-category',
        bundleCode: selectedPlanData.bundleCode || selectedPlanData.id,
        network: currentNetworkObj.name,
        phoneNumber: formattedPhone,
        amount: selectedPlanData.price,
      });

      await refreshWallet();

      setStatusMessage({
        type: 'success',
        text: res.message || `${currentNetworkObj.name} data purchased successfully! Ref: ${res.reference}`,
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
          : err.message || 'Data purchase failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-[88px] md:pb-0">
      <Header />
      <div className="mx-auto flex h-full w-full max-w-[1440px] gap-[40px] px-0 py-0 md:px-8 md:py-10 lg:px-[120px] lg:py-12">
        <div className="flex h-full w-full max-w-[700px] flex-grow flex-col items-start gap-[28px] bg-white p-[15px] md:rounded-[24px] md:border-[1px] md:p-[34px]">
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
            <h1 className="text-[24px] font-bold text-gray-900">Buy Data Plan</h1>
            <p className="text-[14px] text-gray-500">
              Select mobile internet plans suited to your digital needs
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
                maxLength={11}
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
                  className={`py-[8px] px-[8px] rounded-[25px] flex-wrap font-semibold transition flex items-center justify-center gap-3 cursor-pointer ${
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

          {/* Data Plans List */}
          <div className="flex flex-col gap-[8px] w-full">
            <label htmlFor="dataPlan" className="text-[14px] font-bold text-gray-900">
              Select Data Plan
            </label>

            <div className="flex flex-col gap-[12px] w-full h-full">
              {dataPlans.map((plan) => (
                <div
                  className={`flex justify-between w-full p-[20px] bg-white border-[1px] rounded-[20px] items-center cursor-pointer transition hover:shadow-md ${
                    selectedPlanId === plan.id ? 'border-[2px] border-[#2563EB]' : 'border-gray-200'
                  }`}
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                >
                  <div className="flex gap-[16px] items-center">
                    <div className="w-[20px] h-[20px] rounded-full border-[2px] border-[#2563EB] bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                      {selectedPlanId === plan.id && (
                        <div className="w-[8px] h-[8px] rounded-full bg-[#2563EB]" />
                      )}
                    </div>
                    <div className="flex flex-col gap-[4px]">
                      <div className="flex gap-[15px] items-center">
                        <span className="text-[20px] font-bold text-gray-900">
                          {plan.size}
                        </span>
                        <span
                          className={`text-[12px] font-medium px-[8px] py-[4px] rounded-[12px] ${
                            selectedPlanId === plan.id
                              ? 'bg-[#2563EB] text-white'
                              : 'bg-[#F3F4F6] text-gray-500'
                          }`}
                        >
                          {plan.validity}
                        </span>
                      </div>
                      <span className="text-[12px] font-medium text-gray-500">
                        {plan.description}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[20px] font-extrabold text-gray-900 ${
                      selectedPlanId === plan.id ? 'text-[#2563EB]' : ''
                    }`}
                  >
                    ₦{plan.price}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={handlePayNow}
              disabled={loading}
              className="w-full h-[48px] bg-[#3B82F6] hover:bg-blue-700 disabled:opacity-50 mt-[20px] rounded-[25px] text-white font-bold text-[16px] transition md:hidden cursor-pointer"
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
              <span className="text-[14px] font-medium text-gray-900">Data Bundle</span>
              <span className="text-[14px] text-gray-900 font-bold">
                {selectedPlanData?.size}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[14px] font-medium text-gray-900">Validity</span>
              <span className="text-[14px] text-green-500 font-bold">
                {selectedPlanData?.validity}
              </span>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-[16px] font-bold text-gray-900">Total to Pay</span>
            <span className="text-[22px] font-bold text-[#3B82F6]">
              ₦{selectedPlanData?.price}
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

export default BuyDataPage;
