import { useState, useEffect } from 'react'
import './Register.css'

// Импорты SVG-файлов
import logo from '../../assets/logo.svg'
import eyeOff from '../../assets/eye-off.svg'
import eyeOn from '../../assets/eye-on.svg'

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [agree, setAgree] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Принудительный сброс формы при загрузке страницы
  useEffect(() => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    })
    setAgree(false)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === 'phone') {
      const cleanValue = value.replace(/[^\d+]/g, '')
      if (cleanValue.length <= 15) {
        setFormData({ ...formData, [name]: cleanValue })
      }
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert('Пароли не совпадают')
      return
    }
    console.log('Данные формы отправлены:', formData)
  }

  return (
    <div className="register-page">
      <header className="register-header">
        <div className="logo">
          <img src={logo} alt="dev/folio" className="logo-icon" />
          <span className="logo-text">dev/folio</span>
        </div>
      </header>

      <div className="register-content">
        <div className="left-block"></div>

        <div className="register-container">
          <h1>Регистрация</h1>
          <p className="subtitle">
            Давайте настроим всё так, чтобы вы могли получить доступ к своему личному кабинету.
          </p>

          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  name="firstName"
                  placeholder=" " 
                  value={formData.firstName}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />
                <label>Имя</label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="lastName"
                  placeholder=" "
                  value={formData.lastName}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />
                <label>Фамилия</label>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder=" "
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />
                <label>Почта</label>
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  placeholder=" "
                  value={formData.phone}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />
                <label>Номер телефона</label>
              </div>
            </div>

            <div className="form-group full-width">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder=" "
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
              <label>Пароль</label>
              <button 
                type="button" 
                className="eye-btn" 
                onClick={() => setShowPassword(!showPassword)}
              >
                <img 
                  src={showPassword ? eyeOn : eyeOff} 
                  alt="Toggle password visibility" 
                />
              </button>
            </div>

            <div className="form-group full-width">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder=" "
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
              <label>Повторите пароль</label>
              <button 
                type="button" 
                className="eye-btn" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <img 
                  src={showConfirmPassword ? eyeOn : eyeOff} 
                  alt="Toggle password visibility" 
                />
              </button>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="agree"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                required
              />
              <label htmlFor="agree">
                Я согласен с <a href="#">Условиями пользования</a> и <a href="#">Политикой конфиденциальности</a>
              </label>
            </div>

            <button type="submit" className="register-btn" disabled={!agree}>
              Создать аккаунт
            </button>
          </form>

          <div className="login-link">
            Уже есть аккаунт? <a href="/login">Войдите</a>
          </div>

          <div className="social-login">
            <div className="divider">Или войдите с помощью</div>
            <div className="social-buttons">
              <button className="social-btn" type="button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </button>
              <button className="social-btn" type="button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="black"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.19 2.31-.88 3.5-.84 1.41.05 2.54.55 3.32 1.54-2.88 1.63-2.39 5.58.62 6.75-.72 1.81-1.74 3.65-2.52 4.72zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
              </button>
              <button className="social-btn" type="button">
                <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              </button>
              <button className="social-btn" type="button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="black"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register