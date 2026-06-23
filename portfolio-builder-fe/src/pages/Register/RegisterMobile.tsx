import React, { useState } from 'react';
import { registerUser } from '../../api/api';
import { 
  validateEmail, 
  validatePassword, 
  validateName, 
  validatePhone, 
  validateConfirmPassword 
} from '../../utils/validation';
import './RegisterMobile.css';

interface RegisterMobileProps {
  handleGoogleLogin: () => Promise<void>;
}

export const RegisterMobile: React.FC<RegisterMobileProps> = ({ handleGoogleLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let cleanValue = value;
    
    if (name === 'phone') {
      cleanValue = value.replace(/[^\d+]/g, '');
      if (cleanValue.length > 15) return;
    }

    setFormData({ ...formData, [name]: cleanValue });
    setErrors({ ...errors, [name]: '' });
    setServerError('');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) return;

    const newErrors = {
      firstName: validateName(formData.firstName, "Имя"),
      lastName: validateName(formData.lastName, "Фамилия"),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.password, formData.confirmPassword)
    };

    const hasErrors = Object.values(newErrors).some(error => error !== null);

    if (hasErrors) {
      setErrors({
        firstName: newErrors.firstName || '',
        lastName: newErrors.lastName || '',
        email: newErrors.email || '',
        phone: newErrors.phone || '',
        password: newErrors.password || '',
        confirmPassword: newErrors.confirmPassword || ''
      });
      return;
    }

    try {
      setLoading(true);
      await registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      window.location.href = '/login';
    } catch (err: any) {
      setServerError(err.message || 'Не удалось зарегистрироваться');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Обернули в специальный изолирующий класс, чтобы мобильный CSS не трогал десктоп
    <div className="mobile-register-context">
      <div className="mobile-body-wrapper">
        <div className="mobile-screen">
          <header className="register-header">
            <div className="logo">
              <span>dev</span>/folio
            </div>
          </header>

          <main className="register-content">
            <div className="welcome-text">
              <h2>Регистрация</h2>
              <p>Давайте настроим всё для доступа к вашему кабинету</p>
            </div>

            {serverError && <div className="mobile-error-message">{serverError}</div>}

            <form onSubmit={handleRegister} className="register-form">
              <div className="input-group">
                <label>Имя</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Иван"
                  className={errors.firstName ? "mobile-input-error" : ""}
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && <span className="mobile-error-text">{errors.firstName}</span>}
              </div>

              <div className="input-group">
                <label>Фамилия</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Иванов"
                  className={errors.lastName ? "mobile-input-error" : ""}
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && <span className="mobile-error-text">{errors.lastName}</span>}
              </div>

              <div className="input-group">
                <label>Почта</label>
                <input
                  type="email"
                  name="email"
                  placeholder="example@mail.com"
                  className={errors.email ? "mobile-input-error" : ""}
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="mobile-error-text">{errors.email}</span>}
              </div>

              <div className="input-group">
                <label>Номер телефона</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+79991234567"
                  className={errors.phone ? "mobile-input-error" : ""}
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && <span className="mobile-error-text">{errors.phone}</span>}
              </div>

              <div className="input-group">
                <label>Пароль</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className={errors.password ? "mobile-input-error" : ""}
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <span className="mobile-error-text">{errors.password}</span>}
              </div>

              <div className="input-group">
                <label>Повторите пароль</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  className={errors.confirmPassword ? "mobile-input-error" : ""}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && <span className="mobile-error-text">{errors.confirmPassword}</span>}
              </div>

              <div className="mobile-checkbox-group">
                <input
                  type="checkbox"
                  id="agree-mobile"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                <label htmlFor="agree-mobile">
                  Я согласен с Условиями пользования
                </label>
              </div>

              <button type="submit" className="btn-primary" disabled={!agree || loading}>
                {loading ? 'Создание...' : 'Создать аккаунт'}
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
              Уже есть аккаунт? <span onClick={() => window.location.href = '/login'}>Войти</span>
            </p>
          </main>
        </div>
      </div>
    </div>
  );
};