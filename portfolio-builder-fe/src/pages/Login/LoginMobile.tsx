import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginMobile.css';
import logo from '../../assets/logo.svg';

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
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
    setServerError('');
  };

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e, formData);
  };

  return (
    <div className="mobile-login-context">
      <div className="mobile-body-wrapper">
        <div className="mobile-screen">
          {/* Хедер — точь-в-точь как в EditorMobile / RegisterMobile */}
          <header className="login-mobile-header">
            <div className="header-left-nav">
              <div className="mobile-logo-group" onClick={() => navigate('/')}>
                <img src={logo} alt="dev/folio" className="mobile-logo-img" />
                <span className="mobile-logo-text">dev/folio</span>
              </div>
            </div>
            <div className="header-right-nav">
              <button
                className="header-btn register-link-btn"
                onClick={() => navigate('/register')}
              >
                Зарегистрироваться
              </button>
            </div>
          </header>

          <main className="login-content">
            <div className="welcome-text">
              <h2>Вход</h2>
              <p>Войдите в свой аккаунт, чтобы продолжить</p>
            </div>

            {serverError && <div className="mobile-error-message">{serverError}</div>}

            <form onSubmit={handleMobileSubmit} className="login-form" autoComplete="off">
              <div className="input-group">
                <label>Почта</label>
                <input
                  type="email"
                  name="email"
                  placeholder=""
                  className={errors.email ? "mobile-input-error" : ""}
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />
                {errors.email && <span className="mobile-error-text">{errors.email}</span>}
              </div>

              <div className="input-group">
                <label>Пароль</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder=""
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
                    <img
                      src={showPassword ? '/src/assets/eye-on.svg' : '/src/assets/eye-off.svg'}
                      alt="Toggle password visibility"
                    />
                  </button>
                </div>
                {errors.password && <span className="mobile-error-text">{errors.password}</span>}
              </div>

              <div className="login-options">
                <div className="checkbox-group">
                  <input type="checkbox" id="remember-mobile" />
                  <label htmlFor="remember-mobile">Запомнить меня</label>
                </div>
                <span className="forgot-password-link" onClick={() => alert('Восстановление пароля')}>
                  Забыли пароль?
                </span>
              </div>

              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? 'Вход...' : 'Войти'}
              </button>
            </form> 
            <p className="footer-redirect">
              Нет аккаунта? <span onClick={() => navigate('/register')}>Зарегистрироваться</span>
            </p>
          </main>
        </div>
      </div>
    </div>
  );
};