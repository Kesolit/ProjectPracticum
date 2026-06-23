import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditorMobile.css';

import logo from '../../assets/logo.svg';
import eyeOn from '../../assets/eye-on.svg';
import download from '../../assets/download.svg';
import mainIcon from '../../assets/icons/main.svg';
import navIcon from '../../assets/icons/navigation.svg';
import aboutIcon from '../../assets/icons/about.svg';
import skillsIcon from '../../assets/icons/skills.svg';
import caseIcon from '../../assets/icons/case.svg';
import careerIcon from '../../assets/icons/career.svg';
import footerIcon from '../../assets/icons/footer.svg';
import githubIcon from '../../assets/icons/github.svg';
import customIcon from '../../assets/icons/custom.svg';
import iconLinkBlack from '../../assets/icon-link-black.svg';
import iconStatistics from '../../assets/icon-statistics.svg';
import iconArrow from '../../assets/icon-arrow.svg';
import iconSettings from '../../assets/icon-settings.svg';

interface EditorMobileProps {
  blocks: any[];
  addBlock: (type: string, name: string) => void;
  removeBlock: (type: string) => void;
  updateBlockField: (type: string, field: string, value: any) => void;
  saveDraft: () => Promise<void>;
  isSaving: boolean;
  isInitialLoading: boolean;
  renderBlockContent: (block: any, isInsideCanvas: boolean, index?: number) => React.ReactNode;
  moveBlock: (index: number, direction: 'up' | 'down') => void;
  isLoggedIn: boolean;
  userData?: any;
  onLogout: () => void;
  onPreview: () => void;
  onExport: () => void;
  isPublic: boolean;
  onTogglePublic: () => void;
}

export const EditorMobile: React.FC<EditorMobileProps> = ({
  blocks,
  addBlock,
  removeBlock,
  saveDraft,
  isSaving,
  isInitialLoading,
  renderBlockContent,
  moveBlock,
  isLoggedIn,
  userData,
  onLogout,
  onPreview,
  onExport,
  isPublic,
  onTogglePublic
}) => {
  const navigate = useNavigate();
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPortfolioNavDropdownOpen, setIsPortfolioNavDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Вычисляемые значения на основе userData
  const userFirstName = userData?.name || userData?.firstName || 'Имя';
  const userLastName = userData?.surname || userData?.lastName || 'Фамилия';
  const userDisplayName = userData?.fullName || `${userFirstName} ${userLastName}`.trim();
  const portfolioViews = userData?.totalViews ?? 0;

  const availableBlocks = [
    { type: 'nav', name: 'Навигация', icon: navIcon },
    { type: 'main', name: 'Главный блок', icon: mainIcon },
    { type: 'about', name: 'О себе', icon: aboutIcon },
    { type: 'skills', name: 'Навыки', icon: skillsIcon },
    { type: 'projects', name: 'Проекты', icon: caseIcon },
    { type: 'experience', name: 'Опыт работы', icon: careerIcon },
    { type: 'github', name: 'GitHub интеграция', icon: githubIcon },
    { type: 'custom', name: 'Кастомный блок', icon: customIcon },
    { type: 'footer', name: 'Футер', icon: footerIcon },
  ];

  // Обработчики для панели управления
  const handleMoveUp = () => {
    if (selectedIndex === null || selectedIndex === 0) return;
    moveBlock(selectedIndex, 'up');
    setSelectedIndex(selectedIndex - 1);
  };

  const handleMoveDown = () => {
    if (selectedIndex === null || selectedIndex === blocks.length - 1) return;
    moveBlock(selectedIndex, 'down');
    setSelectedIndex(selectedIndex + 1);
  };

  const handleRemove = () => {
    if (selectedIndex === null) return;
    const blockType = blocks[selectedIndex].type;
    removeBlock(blockType);
    setSelectedIndex(null);
  };

  if (isInitialLoading) {
    return (
      <div className="mobile-editor-loading"><div className="spinner"></div></div>
    );
  }

  return (
    <div className="mobile-editor-context">
      <div className="mobile-body-wrapper">
        <header className="editor-mobile-header">
          <div className="header-left-nav">
            <div className="mobile-logo-group" onClick={() => navigate('/')}>
              <img src={logo} alt="dev/folio" className="mobile-logo-img" />
              <span className="mobile-logo-text">dev/folio</span>
            </div>
          </div>

          <div className="header-right-nav">
            {isLoggedIn ? (
              <div className="profile-container">
                <div
                  className="profile-avatar-wrapper"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPortfolioNavDropdownOpen(false);
                    setIsMenuOpen(!isMenuOpen);
                  }}
                >
                  <img
                    src="https://via.placeholder.com/40"
                    alt="User"
                    className="profile-avatar"
                  />
                </div>
                {isMenuOpen && (
                  <div className="user-dropdown-menu" onClick={(e) => e.stopPropagation()} role="menu">
                    {/* ... меню без изменений ... */}
                    <div className="dropdown-header">
                      <span className="user-fullname">{userDisplayName}</span>
                      <span className="user-email">{userData?.email || 'email@example.com'}</span>
                    </div>
                    <div className="dropdown-divider" aria-hidden />
                    <button
                      type="button"
                      className="dropdown-item"
                      role="menuitem"
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate('/dashboard');
                      }}
                    >
                      <span className="item-content-left">
                        <img src={iconLinkBlack} alt="" className="item-icon-svg" width={18} height={18} />
                        <span className="dropdown-item-label">Моё портфолио</span>
                      </span>
                      <img src={iconArrow} alt="" className="item-arrow-svg" width={12} height={12} />
                    </button>
                    <button
                      type="button"
                      className="dropdown-item"
                      role="menuitem"
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate('/stats');
                      }}
                    >
                      <span className="item-content-left">
                        <img src={iconStatistics} alt="" className="item-icon-svg" width={18} height={18} />
                        <span className="dropdown-item-label">Статистика просмотров</span>
                      </span>
                      <span className="item-stats-count">{portfolioViews}</span>
                    </button>
                    <button
                      type="button"
                      className="dropdown-item dropdown-item--plain-end"
                      role="menuitem"
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate('/settings');
                      }}
                    >
                      <span className="item-content-left">
                        <img src={iconSettings} alt="" className="item-icon-svg" width={18} height={18} />
                        <span className="dropdown-item-label">Настройки аккаунта</span>
                      </span>
                    </button>
                    <div className="dropdown-divider" aria-hidden />
                    <button type="button" className="dropdown-logout" role="menuitem" onClick={onLogout}>
                      Выйти из аккаунта
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-group">
                <button className="header-btn login-link-btn" onClick={() => navigate('/login')}>Войти</button>
                <button className="header-btn register-link-btn" onClick={() => navigate('/register')}>Зарегистрироваться</button>
              </div>
            )}
          </div>
        </header>
        <div className="editor-mobile-actions">
          <button className="action-btn preview-btn" onClick={onPreview}>
            <img src={eyeOn} alt="preview" /> Предпросмотр
          </button>
          <button className="action-btn export-btn" onClick={onExport}>
            <img src={download} alt="export" /> Экспорт
          </button>
          <button className="action-btn save-btn" onClick={saveDraft} disabled={isSaving}>
            {isSaving ? 'Сохранение...' : 'Сохранить портфолио'}
          </button>
        </div>

        <main className="editor-mobile-content canvas-dots-bg editor-page-wrapper">
          <div className="visibility-toggle-container">
    <span className="visibility-toggle-label">Публичный доступ</span>
    <label className="visibility-switch">
      <input 
        type="checkbox" 
        checked={isPublic} 
        onChange={onTogglePublic} 
      />
      <span className="visibility-slider"></span>
    </label>
  </div>
          {blocks.length === 0 ? (
            <div className="empty-canvas-placeholder">
              <p>Ваше портфолио пока пусто.</p>
            </div>
          ) : (
            <div className="canvas-active-blocks-queue" style={{ width: '100%', padding: 0 }}>
              {blocks.map((block, idx) => (
                <div
                  key={block.type}
                  className={`canvas-block-card-wrapper ${selectedIndex === idx ? 'selected-block' : ''}`}
                  onClick={() => setSelectedIndex(idx)}
                  style={{ marginBottom: '16px', cursor: 'pointer' }}
                >
                  <div
                    className={`canvas-live-card card-type-${block.type}
                      ${block.type === 'nav' ? 'nav-card-full' : ''}
                      ${block.type === 'footer' ? 'footer-card-full' : ''}
                      ${block.type === 'github' ? 'github-card-full' : ''}
                      ${block.type === 'custom' ? 'custom-card-full' : ''}
                    `}
                  >
                    <div className="block-label-badge">{block.name}</div>
                    {renderBlockContent(block, true, idx)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        <footer className="mobile-horizontal-sidebar">
          {/* Панель управления выбранным блоком */}
            <div className="mobile-control-panel">
              <button
                className="ctrl-btn"
                onClick={handleMoveUp}
                disabled={selectedIndex === null || selectedIndex === 0}
                title="Переместить вверх"
              >
                ▲
              </button>
              <button
                className="ctrl-btn"
                onClick={handleMoveDown}
                disabled={selectedIndex === null || selectedIndex === blocks.length - 1}
                title="Переместить вниз"
              >
                ▼
              </button>
              <button
                className="ctrl-btn remove-btn"
                onClick={handleRemove}
                disabled={selectedIndex === null}
                title="Удалить блок"
              >
                ✕
              </button>
            </div>
          <div className="horizontal-scroll-track">
            {availableBlocks.map((item) => {
              const isAlreadyAdded = blocks.some((b) => b.type === item.type);
              return (
                <button
                  key={item.type}
                  className={`horizontal-sidebar-item sidebar-item-${item.type} ${isAlreadyAdded ? 'item-disabled' : ''}`}
                  disabled={isAlreadyAdded}
                  onClick={() => addBlock(item.type, item.name)}
                >
                  <div className="item-icon-wrapper">
                    <img src={item.icon} alt="" />
                  </div>
                  <span className="item-text-label">{item.name}</span>
                </button>
              );
            })}
          </div>
        </footer>

        {showAddMenu && (
          <div className="mobile-add-overlay" onClick={() => setShowAddMenu(false)}>
            <div className="mobile-add-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="sheet-header">
                <h3>Добавить секцию</h3>
                <button className="close-sheet" onClick={() => setShowAddMenu(false)}>✕</button>
              </div>
              <div className="sheet-grid">
                {availableBlocks.map((item) => {
                  const added = blocks.some((b) => b.type === item.type);
                  return (
                    <button
                      key={item.type}
                      className={`sheet-item-btn ${added ? 'already-added' : ''}`}
                      disabled={added}
                      onClick={() => {
                        addBlock(item.type, item.name);
                        setShowAddMenu(false);
                      }}
                    >
                      <img src={item.icon} alt="" className="sheet-item-icon" />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};