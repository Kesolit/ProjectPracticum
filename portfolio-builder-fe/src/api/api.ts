// api.ts
const API_BASE_URL = 'http://localhost:5080';

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
  if (result.token) saveToken(result.token);
  return result;
};

// Сохранение токена после логина
export const saveToken = (token: string) => {
  localStorage.setItem('jwt_token', token);
};

export const getToken = (): string | null => {
  return localStorage.getItem('jwt_token');
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

// Пример защищённого запроса: получение черновика текущего пользователя
export const getMyDraft = async () => {
  const response = await authFetch(`${API_BASE_URL}/api/draft/my`);
  if (!response.ok) {
    throw new Error('Ошибка загрузки черновика');
  }
  return response.json();
};
