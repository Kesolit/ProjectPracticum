import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setTokens } from '../../api/api';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (accessToken && refreshToken) {
      setTokens(accessToken, refreshToken);

      // Декодируем JWT, чтобы сохранить данные пользователя
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const user = {
          id: payload.nameid || payload.sub,  // ClaimTypes.NameIdentifier → "nameid"
          email: payload.email,
          fullName: payload.unique_name || payload.name, // ClaimTypes.Name → "unique_name"
        };
        localStorage.setItem('user', JSON.stringify(user));
      } catch {
        // если не получилось декодировать — не критично
      }

      localStorage.setItem('isLoggedIn', 'true');
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate]);

  return <div>Авторизация через Google...</div>;
};

export default OAuthCallback;