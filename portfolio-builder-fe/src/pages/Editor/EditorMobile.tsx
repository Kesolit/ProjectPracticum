import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditorMobile.css';

import logo from '../../assets/logo.svg';
import mainIcon from '../../assets/icons/main.svg';
import navIcon from '../../assets/icons/navigation.svg';
import aboutIcon from '../../assets/icons/about.svg';
import skillsIcon from '../../assets/icons/skills.svg';
import caseIcon from '../../assets/icons/case.svg';
import careerIcon from '../../assets/icons/career.svg';
import footerIcon from '../../assets/icons/footer.svg';
import githubIcon from '../../assets/icons/github.svg';
import customIcon from '../../assets/icons/custom.svg';

// Импортируем иконки для навигации в хедере
import iconArrow from '../../assets/icon-arrow.svg'; // Используется для Dashboard/Назад
import iconSettings from '../../assets/icon-settings.svg'; // Для настроек

interface EditorMobileProps {
  blocks: any[];
  addBlock: (type: string, name: string) => void;
  removeBlock: (type: string) => void;
  updateBlockField: (type: string, field: string, value: any) => void;
  saveDraft: () => Promise<void>;
  isSaving: boolean;
  isInitialLoading: boolean;
  renderBlockContent: (block: any, isInsideCanvas: boolean, index?: number) => React.ReactNode;
  moveBlock: (index: number, direction: 'up' | 'down') => void; // Новый проп
}

export const EditorMobile: React.FC<EditorMobileProps> = ({
  blocks,
  addBlock,
  removeBlock,
  saveDraft,
  isSaving,
  isInitialLoading,
  renderBlockContent,
  moveBlock
}) => {
  const navigate = useNavigate();
  const [showAddMenu, setShowAddMenu] = useState(false);

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

  if (isInitialLoading) {
    return (
      <div className="mobile-editor-loading"><div className="spinner"></div></div>
    );
  }

  return (
    <div className="mobile-editor-context">
      <div className="mobile-body-wrapper">
        <div className="mobile-screen">
          
          {/* Обновленный Хедер с кнопками перехода */}
          <header className="editor-mobile-header">
            <div className="header-left-nav">
              {/* Кнопка на Dashboard */}
              <button className="mobile-nav-icon-btn" onClick={() => navigate('/dashboard')} title="В панель управления">
                <img src={iconArrow} alt="Dashboard" style={{ transform: 'rotate(180deg)' }} />
              </button>
              
              <div className="mobile-logo-group" onClick={() => navigate('/')}>
                <img src={logo} alt="dev/folio" className="mobile-logo-img" />
                <span className="mobile-logo-text">dev/folio</span>
              </div>
            </div>

            <div className="header-right-nav">
              {/* Кнопка настроек */}
              <button className="mobile-nav-icon-btn" onClick={() => navigate('/settings')} title="Настройки">
                <img src={iconSettings} alt="Settings" />
              </button>
              
              <button className="mobile-save-btn" onClick={saveDraft} disabled={isSaving}>
                {isSaving ? '...' : 'Сохранить'}
              </button>
            </div>
          </header>

          {/* Рабочая зона-холст */}
          <main className="editor-mobile-content canvas-dots-bg editor-page-wrapper">
            {blocks.length === 0 ? (
              <div className="empty-canvas-placeholder">
                <p>Ваше портфолио пока пусто.</p>
              </div>
            ) : (
              <div className="canvas-active-blocks-queue" style={{ width: '100%', padding: 0 }}>
                {blocks.map((block, idx) => (
                  <div key={block.type} className="canvas-block-card-wrapper" style={{ marginBottom: '16px' }}>
                    <div 
                      className={`canvas-live-card card-type-${block.type}
                        ${block.type === 'nav' ? 'nav-card-full' : ''}
                        ${block.type === 'footer' ? 'footer-card-full' : ''}
                        ${block.type === 'github' ? 'github-card-full' : ''}
                        ${block.type === 'custom' ? 'custom-card-full' : ''}
                      `}
                      style={{ paddingRight: '48px' }} 
                    >
                      {/* Блок управления позицией и удаления */}
                      <div className="mobile-card-controls">
                        <button 
                          className="move-btn up" 
                          disabled={idx === 0} 
                          onClick={() => moveBlock(idx, 'up')}
                        >
                          ▲
                        </button>
                        <button 
                          className="move-btn down" 
                          disabled={idx === blocks.length - 1} 
                          onClick={() => moveBlock(idx, 'down')}
                        >
                          ▼
                        </button>
                        <button className="mobile-remove-btn" onClick={() => removeBlock(block.type)}>✕</button>
                      </div>

                      <div className="block-label-badge">{block.name}</div>
                      
                      {renderBlockContent(block, true, idx)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>

          <footer className="editor-mobile-footer">
            <button className="btn-toggle-add-menu" onClick={() => setShowAddMenu(true)}>
              + Добавить секцию
            </button>
          </footer>

          {/* Шторка меню */}
          {showAddMenu && (
            <div className="mobile-add-overlay" onClick={() => setShowAddMenu(false)}>
              <div className="mobile-add-sheet" onClick={(e) => e.stopPropagation()}>
                <div className="sheet-header">
                  <h3>Добавить секцию</h3>
                  <button className="close-sheet" onClick={() => setShowAddMenu(false)}>✕</button>
                </div>
                <div className="sheet-grid">
                  {availableBlocks.map((item) => {
                    const added = blocks.some(b => b.type === item.type);
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
    </div>
  );
};