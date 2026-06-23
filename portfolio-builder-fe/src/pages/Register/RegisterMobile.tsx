import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/api';
import { 
  validateEmail, 
  validatePassword, 
  validateName, 
  validatePhone, 
  validateConfirmPassword 
} from '../../utils/validation';
import './RegisterMobile.css';
import logo from '../../assets/logo.svg';

interface RegisterMobileProps {
  handleGoogleLogin: () => Promise<void>;
}

export const RegisterMobile: React.FC<RegisterMobileProps> = ({ handleGoogleLogin }) => {
  const navigate = useNavigate();
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
      navigate('/login');
    } catch (err: any) {
      setServerError(err.message || 'Не удалось зарегистрироваться');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mobile-register-context">
      <div className="mobile-body-wrapper">
        <div className="mobile-screen">
          {/* Хедер — такой же как в EditorMobile */}
          <header className="register-mobile-header">
            <div className="header-left-nav">
              <div className="mobile-logo-group" onClick={() => navigate('/')}>
                <img src={logo} alt="dev/folio" className="mobile-logo-img" />
                <span className="mobile-logo-text">dev/folio</span>
              </div>
            </div>
            <div className="header-right-nav">
              <button 
                className="header-btn login-link-btn" 
                onClick={() => navigate('/login')}
              >
                Войти
              </button>
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
                  placeholder=""
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
                  placeholder=""
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
                  placeholder=""
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
                  placeholder=""
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
                  placeholder=""
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
                  placeholder=""
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
                  Я согласен с <a href="#">Условиями пользования</a> и <a href="#">Политикой конфиденциальности</a>
                </label>
              </div>

              <button type="submit" className="btn-primary" disabled={!agree || loading}>
                {loading ? 'Создание...' : 'Создать аккаунт'}
              </button>
            </form>
            <p className="footer-redirect">
              Уже есть аккаунт? <span onClick={() => navigate('/login')}>Войти</span>
            </p>
          </main>
        </div>
      </div>
    </div>
  );
};