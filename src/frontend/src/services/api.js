const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3333';

export const getToken = () => localStorage.getItem('topupng_token');
export const setToken = (token) => localStorage.setItem('topupng_token', token);
export const getRefreshToken = () => localStorage.getItem('topupng_refresh_token');
export const setRefreshToken = (token) => localStorage.setItem('topupng_refresh_token', token);
export const removeToken = () => {
  localStorage.removeItem('topupng_token');
  localStorage.removeItem('topupng_refresh_token');
  localStorage.removeItem('topupng_user');
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('topupng_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredUser = (user) => {
  localStorage.setItem('topupng_user', JSON.stringify(user));
};

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (Array.isArray(data?.message) ? data.message.join(', ') : data?.message) ||
      data?.error ||
      'Request failed';
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  signup: (userData) =>
    request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  resetPassword: (payload) =>
    request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  logout: (allDevices = false) => {
    const refreshToken = getRefreshToken() || getToken() || '';
    return request('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({
        refreshToken,
        allDevices: Boolean(allDevices),
      }),
    })
      .catch((err) => {
        console.warn('Backend logout warning:', err.message);
        return null;
      })
      .finally(() => {
        removeToken();
      });
  },

  // User
  getMe: () => request('/users/me'),

  // Wallet
  getWallet: () => request('/wallet'),

  initializeFunding: (amount) =>
    request('/wallet/fund/initialize', {
      method: 'POST',
      body: JSON.stringify({ amount: Number(amount) }),
    }),

  verifyFunding: (reference) =>
    request(`/wallet/fund/verify?reference=${encodeURIComponent(reference)}`),

  simulateFunding: (accountNumber, amount = 1000) =>
    request('/wallet/webhook', {
      method: 'POST',
      body: JSON.stringify({
        eventType: 'account.credit',
        data: {
          _id: `sim_${Date.now()}`,
          sessionId: `sess_${Date.now()}`,
          paymentReference: `SIM_REF_${Date.now()}`,
          creditAccountNumber: accountNumber,
          debitAccountName: 'Sandbox Tester',
          debitAccountNumber: '0123456789',
          narration: 'Simulated Sandbox Funding',
          amount: Number(amount),
          fees: 0,
          status: 'Completed',
          responseCode: '00',
          createdAt: new Date().toISOString(),
        },
      }),
    }),

  // Airtime
  getAirtimeNetworks: () => request('/airtime/networks'),

  buyAirtime: (payload) =>
    request('/airtime/buy', {
      method: 'POST',
      body: JSON.stringify({
        ...payload,
        amount: Number(payload.amount),
      }),
    }),

  getAirtimeHistory: (limit = 20, offset = 0) =>
    request(`/airtime/history?limit=${limit}&offset=${offset}`),

  // Data
  getDataNetworks: () => request('/data/networks'),

  getDataPlans: (serviceCategoryId) =>
    request(`/data/plans/${encodeURIComponent(serviceCategoryId)}`),

  buyData: (payload) =>
    request('/data/buy', {
      method: 'POST',
      body: JSON.stringify({
        ...payload,
        amount: Number(payload.amount),
      }),
    }),

  getDataHistory: (limit = 20, offset = 0) =>
    request(`/data/history?limit=${limit}&offset=${offset}`),
};

export default api;
