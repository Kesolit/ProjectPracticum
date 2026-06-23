import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SettingsMobile.css';

interface SettingsMobileProps {
  currentPassword: string;
  setCurrentPassword: (val: string) => void;
  newPassword: string;
  setNewPassword: (val: string) => void;
  repeatPassword: string;
  setRepeatPassword: (val: string) => void;
  handleChangePassword: () => Promise<void>;
  handleDeleteAccount: () => Promise<void>;
  connectedProviders: { github: boolean; google: boolean };
  toggleProvider: (provider: 'github' | 'google') => void;
  message: { type: 'success' | 'error'; text: string } | null;
  isSaving: boolean;
  isDeleting: boolean;
}

export const SettingsMobile: React.FC<SettingsMobileProps> = ({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  repeatPassword,
  setRepeatPassword,
  handleChangePassword,
  handleDeleteAccount,
  connectedProviders,
  toggleProvider,
  message,
  isSaving,
  isDeleting
}) => {
  const navigate = useNavigate();

  return (
    <div className="mobile-settings-context">
      <div className="mobile-body-wrapper">
        <div className="mobile-screen">
          
          {/* Фиксированная мобильная шапка */}
          <header className="settings-header">
            <button className="back-btn" onClick={() => navigate(-1)}>
              ←
            </button>
            <div className="header-title">Настройки</div>
            <div style={{ width: '24px' }}></div> {/* Spacer для флекса */}
          </header>

          {/* Скролл-контейнер с безопасным padding-top */}
          <main className="settings-content">
            
            {/* Вывод глобальных уведомлений сверху (успех/ошибка) */}
            {message && (
              <div className={`mobile-message ${message.type}`}>
                {message.text}
              </div>
            )}

            {/* СЕКЦИЯ 1: Безопасность (Смена пароля) */}
            <section className="settings-section">
              <h3>Смена пароля</h3>
              <p className="section-desc">Регулярно обновляйте пароль для защиты ваших данных</p>
              
              <div className="input-group">
                <label>Текущий пароль</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              
              <div className="input-group">
                <label>Новый пароль</label>
                <input
                  type="password"
                  placeholder="Минимум 6 символов"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Повторите пароль</label>
                <input
                  type="password"
                  placeholder="Повторите новый пароль"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>

              <button 
                className="btn-save-section" 
                onClick={handleChangePassword}
                disabled={isSaving}
              >
                {isSaving ? 'Сохранение...' : 'Обновить пароль'}
              </button>
            </section>

            {/* СЕКЦИЯ 2: Интеграции */}
            <section className="settings-section">
              <h3>Связанные аккаунты</h3>
              <p className="section-desc">Авторизация и автоматический импорт данных.</p>

              {/* GitHub */}
              <div className="integration-item">
                <div className="integration-info">
                  <span className="integration-icon">🐙</span>
                  <div>
                    <div className="integration-name">GitHub</div>
                    <div className={`integration-status ${connectedProviders.github ? 'connected' : ''}`}>
                      {connectedProviders.github ? 'Подключено' : 'Не подключено'}
                    </div>
                  </div>
                </div>
                <button 
                  className={connectedProviders.github ? 'btn-action-disconnect' : 'btn-action-connect'}
                  onClick={() => toggleProvider('github')}
                >
                  {connectedProviders.github ? 'Отключить' : 'Подключить'}
                </button>
              </div>

              {/* Google */}
              <div className="integration-item">
                <div className="integration-info">
                  <span className="integration-icon">🌐</span>
                  <div>
                    <div className="integration-name">Google</div>
                    <div className={`integration-status ${connectedProviders.google ? 'connected' : ''}`}>
                      {connectedProviders.google ? 'Подключено' : 'Не подключено'}
                    </div>
                  </div>
                </div>
                <button 
                  className={connectedProviders.google ? 'btn-action-disconnect' : 'btn-action-connect'}
                  onClick={() => toggleProvider('google')}
                >
                  {connectedProviders.google ? 'Отключить' : 'Подключить'}
                </button>
              </div>
            </section>

            {/* СЕКЦИЯ 3: Опасная зона */}
            <section className="settings-section danger-zone">
              <h3>Удаление аккаунта</h3>
              <p className="section-desc text-muted">Полное прекращение работы с сервисом.</p>
              <div className="danger-zone-content">
                <h4>Удалить аккаунт и профиль</h4>
                <p>Все созданные портфолио, сохраненный прогресс и настройки будут безвозвратно удалены.</p>
              </div>
              <button 
                className="btn-danger" 
                onClick={handleDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? 'Удаление...' : 'Удалить аккаунт'}
              </button>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
};