import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SettingsPage.css';
import logo from '../../assets/logo.svg'; 
import githubIcon from '../../assets/icons/github.svg'; 
import { changePassword, deleteAccount } from '../../api/api';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();

  // Состояния для полей пароля
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Имитация данных с бэкенда: какие сети подключены
  const [connectedProviders, setConnectedProviders] = useState({
    github: true,
    google: false
  });

  // Функция переключения состояния (имитация запроса на сервер)
  const toggleProvider = (provider: 'github' | 'google') => {
    setConnectedProviders(prev => ({
      ...prev,
      [provider]: !prev[provider]
    }));
  };

  // Обработчик смены пароля
const handleChangePassword = async () => {
  if (!currentPassword || !newPassword || !repeatPassword) {
    setMessage({ type: 'error', text: 'Заполните все поля пароля' });
    return;
  }
  if (newPassword !== repeatPassword) {
    setMessage({ type: 'error', text: 'Новый пароль и подтверждение не совпадают' });
    return;
  }
  if (newPassword.length < 6) {
    setMessage({ type: 'error', text: 'Пароль должен быть не менее 6 символов' });
    return;
  }

  setIsSaving(true);
  setMessage(null);
  try {
    await changePassword(currentPassword, newPassword);
    setMessage({ type: 'success', text: 'Пароль успешно изменён' });
    setCurrentPassword('');
    setNewPassword('');
    setRepeatPassword('');
  } catch (err: any) {
    setMessage({ type: 'error', text: err.message || 'Ошибка смены пароля' });
  } finally {
    setIsSaving(false);
  }
};

// Обработчик удаления аккаунта
const handleDeleteAccount = async () => {
  const confirmed = window.confirm(
    'Вы уверены, что хотите удалить аккаунт? Все данные (портфолио, настройки) будут безвозвратно удалены.'
  );
  if (!confirmed) return;

  setIsDeleting(true);
  try {
    await deleteAccount();
    // Очищаем локальное хранилище и перенаправляем на страницу входа
    localStorage.clear();
    navigate('/login');
  } catch (err: any) {
    setMessage({ type: 'error', text: err.message || 'Ошибка удаления аккаунта' });
  } finally {
    setIsDeleting(false);
  }
};

  const handleLogoClick = () => navigate('/');
  const handleBack = () => navigate(-1);

  return (
    <div className="settings-page-wrapper">
      <header className="editor-header">
        <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <img src={logo} alt="dev/folio" className="logo-icon" />
          <span className="logo-text">dev/folio</span>
        </div>
        <div className="header-actions">
          <div className="profile-avatar-wrapper">
            <img src="https://via.placeholder.com/40" alt="User" className="profile-avatar" />
          </div>
        </div>
      </header>

      <main className="settings-main-container">
        
        {/* Заголовок страницы */}
        <div className="settings-page-header">
          <button className="settings-back-btn" onClick={handleBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <h1 className="settings-page-title">Настройки аккаунта</h1>
        </div>
        <p className="settings-page-subtitle">Управление безопасностью, интеграциями и профилем</p>
        {message && (
          <div className={`settings-message ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* --- БЛОК 1: СМЕНА ПАРОЛЯ --- */}
        <section className="settings-card">
          <div className="settings-card-header">
            <h2>Смена пароля</h2>
            <p>Регулярно обновляйте пароль для защиты ваших данных</p>
          </div>
          
          <div className="settings-card-body">
            <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
              <div className="settings-input-group current-password">
                <div className="settings-label-row">
                  <label>Текущий пароль</label>
                  <button type="button" className="forgot-password-link">Забыли пароль?</button>
                </div>
                <input 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="settings-input-group">
                <label>Новый пароль</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="settings-input-group">
                <label>Повторите пароль</label>
                <input 
                  type="password" 
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>
            </form>
            <button
              className="settings-btn-primary"
              onClick={handleChangePassword}
              disabled={isSaving}
            >
              {isSaving ? 'Сохранение...' : 'Сохранить пароль'}
            </button>
          </div>
        </section>

        {/* --- БЛОК 2: СВЯЗАННЫЕ АККАУНТЫ --- */}
        <section className="settings-card">
          <div className="settings-card-header">
            <h2>Связанные аккаунты</h2>
            <p>Интеграции для авторизации и автоматического импорта данных.</p>
          </div>
          
          <div className="settings-card-list">
            {/* Интеграция GitHub */}
            <div className="integration-item">
              <div className="integration-info">
                <div className="integration-icon">
                  <img src={githubIcon} alt="GitHub" />
                </div>
                <div className="integration-text">
                  <span className="integration-name">GitHub</span>
                  <span className={`integration-status ${connectedProviders.github ? 'active' : ''}`}>
                    {connectedProviders.github ? 'Подключен' : 'Не подключен'}
                  </span>
                </div>
              </div>
              <button 
                className={`settings-btn-outline ${connectedProviders.github ? 'btn-danger' : ''}`}
                onClick={() => toggleProvider('github')}
              >
                {connectedProviders.github ? 'Отключить' : 'Подключить'}
              </button>
            </div>

            {/* Интеграция Google */}
            <div className="integration-item">
              <div className="integration-info">
                <div className="integration-icon google-icon-wrap">
                  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                <div className="integration-text">
                  <span className="integration-name">Google</span>
                  <span className={`integration-status ${connectedProviders.google ? 'active' : ''}`}>
                    {connectedProviders.google ? 'Подключен' : 'Не подключен'}
                  </span>
                </div>
              </div>
              <button 
                className={`settings-btn-outline ${connectedProviders.google ? 'btn-danger' : ''}`}
                onClick={() => toggleProvider('google')}
              >
                {connectedProviders.google ? 'Отключить' : 'Подключить'}
              </button>
            </div>
          </div>
        </section>

        {/* --- БЛОК 3: УДАЛЕНИЕ АККАУНТА --- */}
        <section className="settings-card">
          <div className="settings-card-header">
            <h2>Удаление аккаунта</h2>
            <p>Полное прекращение работы с сервисом.</p>
          </div>
          <div className="settings-card-body danger-zone-body">
            <div className="danger-zone-text">
              <h3>Удалить аккаунт и профиль</h3>
              <p>Все созданные портфолио, сохраненный прогресс и настройки будут безвозвратно удалены без возможности восстановления.</p>
            </div>
            <button
              className="settings-btn-outline btn-danger-solid"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? 'Удаление...' : 'Удалить аккаунт'}
            </button>
          </div>
        </section>

      </main>
    </div>
  );
};

export default SettingsPage;