const API_BASE_URL = 'https://portfoliobackend-production-8982.up.railway.app'; // C# сервер

// ----- Вспомогательные функции для токенов -----
export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const getAccessToken = (): string | null => localStorage.getItem('accessToken');
export const getRefreshToken = (): string | null => localStorage.getItem('refreshToken');

export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('user');
  // старые ключи на всякий случай
  localStorage.removeItem('token');
  localStorage.removeItem('jwt_token');
};

// ----- Обновление токена -----
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else if (token) prom.resolve(token);
  });
  failedQueue = [];
};

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');

  const response = await fetch(`${API_BASE_URL}/api/user/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    clearTokens();
    throw new Error('Refresh failed');
  }

  const result = await response.json();
  if (result.success && result.data) {
    const { accessToken, refreshToken: newRefreshToken } = result.data;
    setTokens(accessToken, newRefreshToken);
    return accessToken;
  }
  throw new Error('Invalid refresh response');
};

// ----- Обёртка fetch с авторизацией и автоматическим обновлением -----
export const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  let accessToken = getAccessToken();

  const makeRequest = (token: string | null) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };
    return fetch(url, { ...options, headers });
  };

  let response = await makeRequest(accessToken);

  if (response.status === 401 && !options.headers?.['X-Retry']) {
    options.headers = { ...options.headers, 'X-Retry': 'true' };

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve: (token) => resolve(makeRequest(token)), reject });
      });
    }

    isRefreshing = true;
    try {
      const newToken = await refreshAccessToken();
      processQueue(null, newToken);
      return makeRequest(newToken);
    } catch (err) {
      processQueue(err, null);
      clearTokens();
      window.location.href = '/login';
      throw err;
    } finally {
      isRefreshing = false;
    }
  }

  return response;
};

// ----- REGISTER -----
export const registerUser = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/api/user/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      password: userData.password,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Ошибка регистрации');
  }

  return response.json();
};

// ----- LOGIN -----
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  email: string;
  fullName: string;
  accessToken: string;
  refreshToken: string;
}

export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Ошибка входа');
  }

  const result = await response.json();
  let userData = result.success && result.data ? result.data : result;

  if (userData.accessToken && userData.refreshToken) {
    setTokens(userData.accessToken, userData.refreshToken);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify({
      id: userData.id,
      email: userData.email,
      fullName: userData.fullName,
    }));
  } else {
    // fallback для старого формата (на случай отката)
    if (userData.token) {
      localStorage.setItem('token', userData.token);
      localStorage.setItem('jwt_token', userData.token);
    }
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify({
      id: userData.id,
      email: userData.email,
      fullName: userData.fullName,
    }));
  }
  return userData;
};

// ----- CRUD для портфолио -----
export const savePortfolioDraft = async (draftData: { title: string; sections: any[] }) => {
  const response = await authFetch(`${API_BASE_URL}/api/draft`, {
    method: 'POST',
    body: JSON.stringify(draftData),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Ошибка сохранения черновика');
  }
  const result = await response.json();
  console.log('🔍 savePortfolioDraft response:', result);
  return result;
};

export const getPublicPortfolio = async (slug: string) => {
  console.log('🌐 Запрос к API:', `${API_BASE_URL}/api/draft/public/${slug}`);
  const response = await fetch(`${API_BASE_URL}/api/draft/public/${slug}`);
  console.log('📡 Статус ответа:', response.status);
  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Ошибка ответа:', errorText);
    throw new Error('Портфолио не найдено');
  }
  const data = await response.json();
  console.log('✅ Данные от API:', data);
  return data;
};

export const getMyDraft = async () => {
  const response = await authFetch(`${API_BASE_URL}/api/draft/my`);
  if (!response.ok) {
    throw new Error('Ошибка загрузки черновика');
  }
  return response.json();
};
