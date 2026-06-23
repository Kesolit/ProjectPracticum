import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginMobile.css';

interface LoginMobileProps {
  handleGoogleLogin: () => Promise<void>;
  handleSubmit: (e: React.FormEvent, mobileData: any) => Promise<void>;
  serverError: string;
  setServerError: (msg: string) => void;
  isLoading: boolean;
  errors: { email?: string; password?: string };
  setErrors: (errs: any) => void;
}

export const LoginMobile: React.FC<LoginMobileProps> = ({ 
  handleGoogleLogin, 
  handleSubmit,
  serverError,
  setServerError,
  isLoading,
  errors,
  setErrors
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
    setServerError('');
  };

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e, formData); // Передаем локальные мобильные данные наверх родительскому методу
  };

  return (
    <div className="mobile-login-context">
      <div className="mobile-body-wrapper">
        <div className="mobile-screen">
          <header className="login-header">
            <div className="logo">
              <span>dev</span>/folio
            </div>
          </header>

          <main className="login-content">
            <div className="welcome-text">
              <h2>Вход в систему</h2>
              <p>Добро пожаловать обратно! Пожалуйста, войдите в свой аккаунт</p>
            </div>

            {serverError && <div className="mobile-error-message">{serverError}</div>}

            <form onSubmit={handleMobileSubmit} className="login-form" autoComplete="off">
              <div className="input-group">
                <label>Почта</label>
                <input
                  type="email"
                  name="email"
                  placeholder="example@mail.com"
                  className={errors.email ? "mobile-input-error" : ""}
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />
                {errors.email && <span className="mobile-error-text">{errors.email}</span>}
              </div>

              <div className="input-group password-group">
                <label>Пароль</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    className={errors.password ? "mobile-input-error" : ""}
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                  />
                  <button 
                    type="button" 
                    className="mobile-eye-btn" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️' : '🙈'}
                  </button>
                </div>
                {errors.password && <span className="mobile-error-text">{errors.password}</span>}
              </div>

              <div className="login-options">
                <span className="forgot-password-link" onClick={() => alert('Восстановление пароля')}>
                  Забыли пароль?
                </span>
              </div>

              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? 'Вход...' : 'Войти'}
              </button>
            </form>

            <div className="divider">
              <span>или войти через</span>
            </div>

            <div className="social-buttons">
              <button type="button" className="btn-social" onClick={handleGoogleLogin}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button type="button" className="btn-social" onClick={() => alert('В разработке')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.38-1.99 1.03-2.69-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                </svg>
                GitHub
              </button>
            </div>

            <p className="footer-redirect">
              Еще нет аккаунта? <span onClick={() => navigate('/register')}>Зарегистрироваться</span>
            </p>
          </main>
        </div>
      </div>
    </div>
  );
};