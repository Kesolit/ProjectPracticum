import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setTokens, authFetch } from '../../api/api';

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

      setTokens(accessToken, refreshToken);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5080'}/api/user/me`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const result = await response.json();
        if (result.success && result.data) {
          localStorage.setItem('user', JSON.stringify(result.data));
        }
      } catch {
        // fallback – декодируем JWT
        try {
          const payload = JSON.parse(atob(accessToken.split('.')[1]));
          const user = {
            id: payload.nameid || payload.sub,
            email: payload.email,
            fullName: payload.unique_name || payload.name,
          };
          localStorage.setItem('user', JSON.stringify(user));
        } catch {}
      }

      localStorage.setItem('isLoggedIn', 'true');
      navigate('/dashboard', { replace: true });
    };

    init();
  }, [searchParams, navigate]);

  return <div>Авторизация через Google...</div>;
};

export default OAuthCallback;