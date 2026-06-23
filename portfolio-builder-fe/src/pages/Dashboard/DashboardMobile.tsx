import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardMobile.css';

import logo from '../../assets/logo.svg';
import eyeOn from '../../assets/eye-on.svg';
import iconArrow from '../../assets/icon-arrow.svg';
import iconSettings from '../../assets/icon-settings.svg';
import iconLinkBlack from '../../assets/icon-link-black.svg';

interface Portfolio {
  id: string;
  slug: string;
  views: number;
  createdAt: string;
  user: { name: string; avatarUrl?: string };
  name: string;
  role: string;
  description: string;
  skills: string[];
}

interface DashboardMobileProps {
  portfolios: Portfolio[];
  isLoading: boolean;
  totalCount: number;
  sortBy: string;
  setSortBy: (val: string) => void;
  userData: any;
  isMenuOpen: boolean;
  setIsMenuOpen: (val: boolean) => void;
  selectedSpecs: string[];
  setSelectedSpecs: (val: string[]) => void;
  selectedLevels: string[];
  setSelectedLevels: (val: string[]) => void;
  selectedTechs: string[];
  setSelectedTechs: (val: string[]) => void;
  techSearch: string;
  setTechSearch: (val: string) => void;
  showAllFilterTechs: boolean;
  setShowAllFilterTechs: (val: boolean) => void;
  SPECIALIZATIONS: string[];
  LEVELS: string[];
  visibleFilterTechs: string[];
  allTechsCount: number;
  toggleFilter: (item: string, list: string[], setList: any) => void;
  handleLevelSelect: (level: string) => void;
  resetFilters: () => void;
  removeFilterTag: (type: 'spec' | 'level' | 'tech', value: string) => void;
}

const getDaysAgoMobile = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'сегодня';
  if (diffDays === 1) return 'вчера';
  return `${diffDays} дн. назад`;
};

export const DashboardMobile: React.FC<DashboardMobileProps> = ({
  portfolios, isLoading, totalCount, sortBy, setSortBy, userData, isMenuOpen, setIsMenuOpen,
  selectedSpecs, setSelectedSpecs, selectedLevels, selectedTechs, setSelectedTechs,
  techSearch, setTechSearch, showAllFilterTechs, setShowAllFilterTechs,
  SPECIALIZATIONS, LEVELS, visibleFilterTechs, allTechsCount,
  toggleFilter, handleLevelSelect, resetFilters, removeFilterTag
}) => {
  const navigate = useNavigate();
  const [showFiltersSheet, setShowFiltersSheet] = useState(false);

  return (
    <div className="mobile-dash-context">
      <div className="mobile-dash-wrapper">
        <div className="mobile-dash-screen">
          
          {/* Хедер */}
          <header className="mobile-dash-header">
            <div className="mdh-left" onClick={() => navigate('/')}>
              <img src={logo} alt="dev/folio" className="m-logo-img" />
              <span className="m-logo-text">dev/folio</span>
            </div>
            
            <div className="mdh-right">
              <div className="m-profile-trigger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <img src={userData?.avatarUrl || "https://via.placeholder.com/36"} alt="User" className="m-avatar" />
                
                {isMenuOpen && (
                  <div className="m-user-dropdown" onClick={(e) => e.stopPropagation()}>
                    <div className="m-dropdown-header">
                      <span className="m-username">{userData?.fullName || 'Пользователь'}</span>
                    </div>
                    <button className="m-dropdown-item" onClick={() => { setIsMenuOpen(false); navigate('/'); }}>
                      <img src={iconLinkBlack} alt="" /> Редактор
                    </button>
                    <button className="m-dropdown-item" onClick={() => { setIsMenuOpen(false); navigate('/settings'); }}>
                      <img src={iconSettings} alt="" /> Настройки
                    </button>
                    <button className="m-dropdown-logout" onClick={() => { localStorage.clear(); navigate('/login'); }}>Выйти</button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Контент */}
          <main className="mobile-dash-content">
            <div className="md-hero">
              <h2>Поиск портфолио</h2>
              <p>Найдите специалистов под ваш проект</p>
            </div>

            {/* Фиксация панели фильтрации и сортировки */}
            <div className="mobile-filter-bar">
              <button className={`m-filter-toggle-btn ${(selectedSpecs.length || selectedLevels.length || selectedTechs.length) ? 'has-active' : ''}`} onClick={() => setShowFiltersSheet(true)}>
                ⚙️ Фильтры {(selectedSpecs.length + selectedLevels.length + selectedTechs.length) > 0 && `(${selectedSpecs.length + selectedLevels.length + selectedTechs.length})`}
              </button>
              
              <div className="m-sort-select-wrapper">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="new">Сначала новые</option>
                  <option value="popular">Популярные</option>
                </select>
              </div>
            </div>

            {/* Теги активных фильтров */}
            {(selectedSpecs.length > 0 || selectedLevels.length > 0 || selectedTechs.length > 0) && (
              <div className="mobile-active-tags">
                {selectedSpecs.map(s => <span key={s} className="m-tag">{s} <button onClick={() => removeFilterTag('spec', s)}>✕</button></span>)}
                {selectedLevels.map(l => <span key={l} className="m-tag">{l} <button onClick={() => removeFilterTag('level', l)}>✕</button></span>)}
                {selectedTechs.map(t => <span key={t} className="m-tag">{t} <button onClick={() => removeFilterTag('tech', t)}>✕</button></span>)}
              </div>
            )}

            <div className="m-results-sub">Найдено: {totalCount}</div>

            {/* Сетка/Лента */}
            {isLoading ? (
              <div className="m-dash-loading"><div className="spinner"></div><p>Загрузка...</p></div>
            ) : portfolios.length === 0 ? (
              <div className="m-dash-empty">Ничего не найдено. Поменяйте фильтры.</div>
            ) : (
              <div className="mobile-portfolio-list">
                {portfolios.map((portfolio) => {
                  const name = portfolio.name || portfolio.user?.name || 'Имя не указано';
                  return (
                    <div key={portfolio.id} className="m-portfolio-card">
                      <div className="mpc-top">
                        <img src={portfolio.user?.avatarUrl || 'https://via.placeholder.com/44'} alt={name} className="mpc-avatar" />
                        <div className="mpc-info">
                          <h4>{name}</h4>
                          <p>{portfolio.role || 'Специализация'}</p>
                        </div>
                      </div>
                      <p className="mpc-desc">{portfolio.description}</p>
                      <div className="mpc-skills">
                        {portfolio.skills?.slice(0, 4).map((tech, i) => (
                          <span key={i} className="mpc-skill-badge">{tech}</span>
                        ))}
                        {portfolio.skills?.length > 4 && <span className="mpc-skill-more">+{portfolio.skills.length - 4}</span>}
                      </div>
                      <div className="mpc-footer">
                        <div className="mpc-stats">
                          <span><img src={eyeOn} alt="" /> {portfolio.views}</span>
                          <span>{getDaysAgoMobile(portfolio.createdAt)}</span>
                        </div>
                        <button className="mpc-open-btn" onClick={() => window.open(`/view/${portfolio.slug}`, '_blank')}>
                          Открыть <img src={iconArrow} alt="" style={{ transform: 'rotate(-90deg)' }} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>

          {/* Выезжающая шторка фильтров */}
          {showFiltersSheet && (
            <div className="m-sheet-overlay" onClick={() => setShowFiltersSheet(false)}>
              <div className="m-sheet-content" onClick={(e) => e.stopPropagation()}>
                <div className="m-sheet-header">
                  <h3>Фильтры</h3>
                  <div className="m-sheet-actions">
                    <button className="m-sheet-reset" onClick={resetFilters}>Сбросить</button>
                    <button className="m-sheet-close" onClick={() => setShowFiltersSheet(false)}>✕</button>
                  </div>
                </div>

                <div className="m-sheet-scrollable-body">
                  {/* Специализации */}
                  <div className="m-sheet-group">
                    <h4>Специализация</h4>
                    <div className="m-sheet-pills">
                      {SPECIALIZATIONS.map(spec => (
                        <button key={spec} className={`m-sheet-pill ${selectedSpecs.includes(spec) ? 'active' : ''}`} onClick={() => toggleFilter(spec, selectedSpecs, setSelectedSpecs)}>
                          {spec}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Уровень */}
                  <div className="m-sheet-group">
                    <h4>Уровень</h4>
                    <div className="m-sheet-pills">
                      {LEVELS.map(level => (
                        <button key={level} className={`m-sheet-pill ${selectedLevels.includes(level) ? 'active' : ''}`} onClick={() => handleLevelSelect(level)}>
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Технологии */}
                  <div className="m-sheet-group">
                    <h4>Технологии</h4>
                    <input type="text" className="m-sheet-input" placeholder="Поиск стека..." value={techSearch} onChange={(e) => setTechSearch(e.target.value)} />
                    <div className="m-sheet-checkboxes">
                      {visibleFilterTechs.map(tech => (
                        <label key={tech} className="m-sheet-checkbox-label">
                          <input type="checkbox" checked={selectedTechs.includes(tech)} onChange={() => toggleFilter(tech, selectedTechs, setSelectedTechs)} />
                          <span>{tech}</span>
                        </label>
                      ))}
                    </div>
                    {!showAllFilterTechs && allTechsCount > 5 && (
                      <button className="m-sheet-more" onClick={() => setShowAllFilterTechs(true)}>
                        Показать все технологии
                      </button>
                    )}
                  </div>
                </div>

                <div className="m-sheet-footer">
                  <button className="m-sheet-apply-btn" onClick={() => setShowFiltersSheet(false)}>
                    Показать результаты
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};