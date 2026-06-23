import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { DashboardMobile } from './DashboardMobile';

// Предполагаемые импорты API и иконок (замени на свои пути)
import { getSearchPortfolios } from '../../api/api'; 
import logo from '../../assets/logo.svg';
import eyeOn from '../../assets/eye-on.svg';
import iconArrow from '../../assets/icon-arrow.svg';
import iconSettings from '../../assets/icon-settings.svg';
import iconLinkBlack from '../../assets/icon-link-black.svg';
import iconStatistics from '../../assets/icon-statistics.svg';

// --- ИНТЕРФЕЙСЫ ---
interface Portfolio {
  id: string;
  slug: string;
  views: number;
  createdAt: string;
  user: {
    name: string;
    avatarUrl?: string;
  };
  name: string;        // имя из main.greeting
  role: string;        // специализация
  description: string;
  skills: string[];
}

// Вспомогательная функция для склонения дней
const getDaysAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  
  if (diffDays === 0) return 'сегодня';
  if (diffDays === 1) return 'вчера';
  if (diffDays % 10 === 1 && diffDays % 100 !== 11) return `${diffDays} день назад`;
  if ([2, 3, 4].includes(diffDays % 10) && ![12, 13, 14].includes(diffDays % 100)) return `${diffDays} дня назад`;
  return `${diffDays} дней назад`;
};

// --- КОМПОНЕНТ КАРТОЧКИ ---
const PortfolioCard = ({ portfolio }: { portfolio: Portfolio }) => {
  const [showAllTechs, setShowAllTechs] = useState(false);

  const name = portfolio.name || portfolio.user?.name || 'Имя не указано';
  const role = portfolio.role || 'Специализация не указана';
  const description = portfolio.description || '';
  const avatar = portfolio.user?.avatarUrl || 'https://via.placeholder.com/48';
  const skills = portfolio.skills || [];
  
  const visibleTechs = showAllTechs ? skills : skills.slice(0, 3);
  const hiddenTechsCount = skills.length - 3;

  const handleOpen = () => {
    window.open(`/view/${portfolio.slug}`, '_blank');
  };

  return (
    <div className="portfolio-card">
      <div className="pc-header">
        <img src={avatar} alt={name} className="pc-avatar" />
        <div className="pc-user-info">
          <h3 className="pc-name">{name} <span className="pc-status-dot"></span></h3>
          <p className="pc-role">{role}</p>
        </div>
      </div>
      
      <div className="pc-body">
        <p className="pc-description">{description}</p>
        
        <div className="pc-techs">
          {visibleTechs.map((tech: string, i: number) => (
            <span key={i} className="pc-tech-badge">{tech}</span>
          ))}
          {!showAllTechs && hiddenTechsCount > 0 && (
            <button className="pc-tech-more" onClick={() => setShowAllTechs(true)}>
              +{hiddenTechsCount}
            </button>
          )}
        </div>
      </div>

      <div className="pc-footer">
        <div className="pc-stats">
          <span className="pc-views"><img src={eyeOn} alt="views" /> {portfolio.views > 999 ? (portfolio.views/1000).toFixed(1) + 'k' : portfolio.views}</span>
          <span className="pc-date">{getDaysAgo(portfolio.createdAt)}</span>
        </div>
        <button className="pc-open-btn" onClick={handleOpen}>
          Открыть <img src={iconArrow} alt="arrow" style={{ transform: 'rotate(-90deg)', width: 10 }} />
        </button>
      </div>
    </div>
  );
};

// --- ОСНОВНОЙ КОМПОНЕНТ ---
const Dashboard = () => {
  const [sortBy, setSortBy] = useState('new'); // 'popular' или 'new'
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Фильтры
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [techSearch, setTechSearch] = useState('');
  const [showAllFilterTechs, setShowAllFilterTechs] = useState(false);

  // Данные из БД
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Списки для фильтров (можно тоже получать с бэка)
  const SPECIALIZATIONS = ['Frontend', 'Backend', 'Mobile', 'DevOps', 'Designer', 'QA', 'Data'];
  const LEVELS = ['Junior', 'Middle', 'Senior', 'Lead'];
  const ALL_TECHS = [
  'React', 'TypeScript', 'Vue', 'Next.js', 'Node.js', 
  'JavaScript', 'Python', 'Go (Golang)', 'C# / .NET', 'Java', 
  'PHP', 'Kotlin', 'C++', 'Ruby', 'Angular', 
  'Svelte', 'Nuxt.js', 'Redux Toolkit', 'Zustand', 'MobX', 
  'Effector', 'Tailwind CSS', 'SCSS / SASS', 'Styled Components', 'Nest.js', 
  'Express.js', 'FastAPI', 'Spring Boot', 'Laravel', 'PostgreSQL', 
  'MongoDB', 'Redis', 'Prisma ORM', 'Flutter', 'React Native', 
  'Swift / SwiftUI', 'Docker', 'Kubernetes', 'GraphQL', 'Jest', 
  'Cypress', 'Playwright', 'Figma', 'Git / GitHub'
];

  const getUniqueLatestPortfolios = (portfolios: any[]) => {
    const userMap = new Map<string, any>();
    // Порядок с бэкенда сохраняется – не сортируем!
    for (const portfolio of portfolios) {
      const key = portfolio.user.name;
      if (!userMap.has(key)) {
        userMap.set(key, portfolio);
      }
    }
    return Array.from(userMap.values());
  };
  // Подгрузка данных пользователя (для хеддера)
  useEffect(() => {
  const loadData = async () => {
    setIsLoading(true);
    try {
      const params: any = { 
        sort: sortBy, 
        page: 1, 
        pageSize: 12 
      };
      
      // Добавляем фильтры, если они выбраны
      if (selectedSpecs.length > 0) {
        params.spec = selectedSpecs[0]; // берём первый (или можно объединить, но бэкенд ждёт строку)
      }
      if (selectedLevels.length > 0) {
        params.level = selectedLevels[0];
      }
      if (selectedTechs.length > 0) {
        params.techs = selectedTechs.join(',');
      }
      
      const response = await getSearchPortfolios(params);
      const uniqueItems = getUniqueLatestPortfolios(response.items);
      setPortfolios(uniqueItems);
      setTotalCount(uniqueItems.length);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  loadData();
}, [sortBy, selectedSpecs, selectedLevels, selectedTechs]); // зависимости включают все фильтры

  // Обработчики фильтров
  const toggleFilter = (item: string, list: string[], setList: (l: string[]) => void) => {
    if (list.includes(item)) setList(list.filter((i) => i !== item));
    else setList([...list, item]);
  };

  const resetFilters = () => {
    setSelectedSpecs([]);
    setSelectedLevels([]);
    setSelectedTechs([]);
    setTechSearch('');
  };

    const handleLevelSelect = (level: string) => {
      // Если кликнули на уже выбранный — сбрасываем, иначе устанавливаем новый
      setSelectedLevels(selectedLevels.includes(level) ? [] : [level]);
    };

  const removeFilterTag = (type: 'spec' | 'level' | 'tech', value: string) => {
    if (type === 'spec') setSelectedSpecs(selectedSpecs.filter(i => i !== value));
    if (type === 'level') setSelectedLevels(selectedLevels.filter(i => i !== value));
    if (type === 'tech') setSelectedTechs(selectedTechs.filter(i => i !== value));
  };

  const visibleFilterTechs = showAllFilterTechs 
    ? ALL_TECHS.filter(t => t.toLowerCase().includes(techSearch.toLowerCase())) 
    : ALL_TECHS.filter(t => t.toLowerCase().includes(techSearch.toLowerCase())).slice(0, 5);

  const isReallyMobile = isMobile || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

if (isReallyMobile) {
  return (
    <DashboardMobile
      portfolios={portfolios}
      isLoading={isLoading}
      totalCount={totalCount}
      sortBy={sortBy}
      setSortBy={setSortBy}
      userData={userData}
      isMenuOpen={isMenuOpen}
      setIsMenuOpen={setIsMenuOpen}
      // Передаем стейты фильтров
      selectedSpecs={selectedSpecs}
      setSelectedSpecs={setSelectedSpecs}
      selectedLevels={selectedLevels}
      setSelectedLevels={setSelectedLevels}
      selectedTechs={selectedTechs}
      setSelectedTechs={setSelectedTechs}
      techSearch={techSearch}
      setTechSearch={setTechSearch}
      showAllFilterTechs={showAllFilterTechs}
      setShowAllFilterTechs={setShowAllFilterTechs}
      // Константы и методы
      SPECIALIZATIONS={SPECIALIZATIONS}
      LEVELS={LEVELS}
      visibleFilterTechs={visibleFilterTechs}
      allTechsCount={ALL_TECHS.length}
      toggleFilter={toggleFilter}
      handleLevelSelect={handleLevelSelect}
      resetFilters={resetFilters}
      removeFilterTag={removeFilterTag}
    />
  );
}
  return (
    <div className="dashboard-layout">
      {/* ХЕДДЕР */}
      <header className="dashboard-header">
        <div className="dh-left" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <img src={logo} alt="dev/folio" className="logo-icon" />
          <span className="logo-text">dev/folio</span>
          <button  className="search-portfolio-btn"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                navigate('/dashboard')
              }}
            >
              Поиск
            </button>
        </div>
        
        <div className="dh-right">
          <button className="btn-blue-solid" onClick={() => navigate('/')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
            Перейти в портфолио
          </button>

          <div className="profile-container" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <div className="profile-avatar-wrapper">
              <img src={userData?.avatarUrl || "https://via.placeholder.com/40"} alt="User" className="profile-avatar" />
            </div>
            {isMenuOpen && (
              <div className="user-dropdown-menu">
                <div className="dropdown-header">
                  <span className="user-fullname">{userData?.fullName || 'Пользователь'}</span>
                  <span className="user-email">{userData?.email || ''}</span>
                </div>
                <div className="dropdown-divider" />
                <button className="dropdown-item" onClick={() => navigate('/dashboard')}>
                  <span className="item-content-left"><img src={iconLinkBlack} alt="" className="item-icon-svg" /> Моё портфолио</span>
                </button>
                <button className="dropdown-item" onClick={() => navigate('/settings')}>
                  <span className="item-content-left"><img src={iconSettings} alt="" className="item-icon-svg" /> Настройки</span>
                </button>
                <div className="dropdown-divider" />
                <button className="dropdown-logout" onClick={() => { localStorage.clear(); navigate('/login'); }}>Выйти</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ОСНОВНАЯ ЧАСТЬ */}
      <div className="dashboard-main">
        {/* ЗАГОЛОВОК И ПОИСК */}
        <div className="dashboard-top-section">
          <div>
            <h1>Поиск портфолио</h1>
            <p>Найдите специалистов под ваш проект</p>
          </div>
          <div className="main-search-bar">
            <input type="text" placeholder="Имя, технология, ключевое слово..." />
          </div>
        </div>

        <div className="dashboard-content">
          {/* САЙДБАР С ФИЛЬТРАМИ */}
          <aside className="filters-sidebar">
            <div className="fs-header">
              <h3>Фильтры</h3>
              <button className="fs-reset" onClick={resetFilters}>Сбросить</button>
            </div>

            <div className="fs-group">
              <h4>Специализация</h4>
              <div className="fs-pills">
                {SPECIALIZATIONS.map(spec => (
                  <button key={spec} className={`fs-pill ${selectedSpecs.includes(spec) ? 'active' : ''}`} onClick={() => toggleFilter(spec, selectedSpecs, setSelectedSpecs)}>
                    {spec}
                  </button>
                ))}
              </div>
            </div>

            <div className="fs-group">
              <h4>Уровень</h4>
              <div className="levels-horizontal-list">
                {LEVELS.map(level => (
                  <button 
                    key={level} 
                    className={`fs-pill-level ${selectedLevels.includes(level) ? 'active' : ''}`} 
                    onClick={() => handleLevelSelect(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="fs-group">
              <h4>Технологии</h4>
              <input type="text" className="fs-input" placeholder="Поиск стека..." value={techSearch} onChange={(e) => setTechSearch(e.target.value)} />
              <div className="fs-checkboxes">
                {visibleFilterTechs.map(tech => (
                  <label key={tech} className="fs-checkbox-label">
                    <input type="checkbox" checked={selectedTechs.includes(tech)} onChange={() => toggleFilter(tech, selectedTechs, setSelectedTechs)} />
                    <span>{tech}</span>
                  </label>
                ))}
              </div>
              {!showAllFilterTechs && ALL_TECHS.length > 5 && (
                <button className="fs-show-more" onClick={() => setShowAllFilterTechs(true)}>
                  Показать ещё {ALL_TECHS.length - 5}
                </button>
              )}
            </div>
          </aside>

          {/* СЕТКА ПОРТФОЛИО */}
          <main className="results-area">
            <div className="results-header">
              <div className="active-filters">
                <span className="results-count">{totalCount} портфолио</span>
                {selectedSpecs.map(s => <span key={s} className="filter-tag">{s} <button onClick={() => removeFilterTag('spec', s)}>✕</button></span>)}
                {selectedLevels.map(l => <span key={l} className="filter-tag">{l} <button onClick={() => removeFilterTag('level', l)}>✕</button></span>)}
                {selectedTechs.map(t => <span key={t} className="filter-tag">{t} <button onClick={() => removeFilterTag('tech', t)}>✕</button></span>)}
              </div>
              <div className="sort-dropdown">
                <span>Сортировка:</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="popular">По популярности</option>
                  <option value="new">Новые</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="loading-state">Загрузка базы портфолио...</div>
            ) : portfolios.length === 0 ? (
              <div className="empty-state-db">Ничего не найдено. Попробуйте изменить фильтры.</div>
            ) : (
              <div className="portfolio-grid">
                {portfolios.map(portfolio => (
                  <PortfolioCard key={portfolio.id} portfolio={portfolio} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;