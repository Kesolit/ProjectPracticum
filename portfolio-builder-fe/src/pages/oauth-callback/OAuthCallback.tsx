import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setTokens, API_BASE_URL } from '../../api/api';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const accessToken = searchParams.get('accessToken');
      const refreshToken = searchParams.get('refreshToken');

      if (!accessToken || !refreshToken) {
        navigate('/login', { replace: true });
        return;
      }

      // 1. Сохраняем токены
      setTokens(accessToken, refreshToken);
      localStorage.setItem('isLoggedIn', 'true');

      // 2. Пробуем получить полные данные с бэкенда
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const result = await response.json();
        if (result.success && result.data) {
          localStorage.setItem('user', JSON.stringify(result.data));
          navigate('/dashboard', { replace: true });
          return;
        }
      } catch {
        // если сеть упала или другая ошибка – идём дальше
      }

      // 3. Резервный вариант: вытаскиваем что можно из JWT (email, id)
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const userId =
          payload[
            'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
          ] || payload.sub;
        const email =
          payload[
            'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
          ] || payload.email;
        const fullName =
          payload[
            'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
          ] || payload.name || 'Пользователь';

        localStorage.setItem(
          'user',
          JSON.stringify({ id: userId, email, fullName })
        );
      } catch {
        // если JWT вообще не парсится – оставляем пустой объект
        localStorage.setItem('user', JSON.stringify({ fullName: 'Пользователь', email: '' }));
      }

      navigate('/dashboard', { replace: true });
    };

    init();
  }, [searchParams, navigate]);

  return <div>Авторизация через Google...</div>;
};

export default OAuthCallback;