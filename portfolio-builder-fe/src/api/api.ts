const API_BASE_URL = 'https://portfoliobackend-production-8982.up.railway.app'; // C# сервер

// REGISTER
export const registerUser = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/api/user/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
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


// LOGIN
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  email: string;
  fullName: string;
  token?: string;
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
  
  // ✅ Адаптируемся под формат { success: true, data: {...} }
  let userData;
  if (result.success && result.data) {
    userData = result.data;
  } else {
    userData = result;
  }
  
  // Сохраняем токен
  if (userData.token) {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('jwt_token', userData.token);
  }
  
  return userData;
};

// Сохранение токена после логина
export const saveToken = (token: string) => {
  localStorage.setItem('jwt_token', token);
};

export const getToken = (): string | null => {
  return localStorage.getItem('token') || localStorage.getItem('jwt_token');
};

// Обёртка для fetch с авторизацией
const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };
  return fetch(url, { ...options, headers });
};

// --- НОВЫЕ ФУНКЦИИ ДЛЯ ТВОИХ ЗАДАЧ ---

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

// Пример защищённого запроса: получение черновика текущего пользователя
export const getMyDraft = async () => {
  const response = await authFetch(`${API_BASE_URL}/api/draft/my`);
  if (!response.ok) {
    throw new Error('Ошибка загрузки черновика');
  }
  return response.json();
};
