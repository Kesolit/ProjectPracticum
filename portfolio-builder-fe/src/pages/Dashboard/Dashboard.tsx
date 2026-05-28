import { useState } from 'react'
import './Dashboard.css'

// Типы данных
interface Portfolio {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  role: string;
  level: string;
  location: string;
  description: string;
  technologies: string[];
  extraTechCount: number;
  views: string;
  timeAgo: string;
}

// Моковые данные
const mockPortfolios: Portfolio[] = [
  {
    id: '1', name: 'Алексей Иванов', avatar: 'https://i.pravatar.cc/150?u=1', isOnline: true,
    role: 'Frontend', level: 'Middle', location: 'Москва',
    description: 'Делаю интерфейсы на React и TypeScript. Люблю чистую архитектуру и дизайн-системы.',
    technologies: ['React', 'TypeScript'], extraTechCount: 5, views: '1.2k', timeAgo: '2 дня назад'
  },
  {
    id: '2', name: 'Мария Соколова', avatar: 'https://i.pravatar.cc/150?u=2', isOnline: true,
    role: 'Fullstack', level: 'Senior', location: 'Санкт-Петербург',
    description: '7 лет в продуктовой разработке. Запускала B2B-сервисы с нуля, фокус на DX.',
    technologies: ['React', 'Node.js'], extraTechCount: 7, views: '3.4k', timeAgo: 'вчера'
  },
  {
    id: '3', name: 'Дмитрий Марков', avatar: 'https://i.pravatar.cc/150?u=3', isOnline: false,
    role: 'Frontend', level: 'Middle', location: 'Казань',
    description: 'Делаю SPA на Vue и React. Сильный опыт в анимациях и pet-проектах на Three.js.',
    technologies: ['Vue', 'React'], extraTechCount: 4, views: '842', timeAgo: 'неделю назад'
  },
  {
    id: '4', name: 'Анна Петрова', avatar: 'https://i.pravatar.cc/150?u=4', isOnline: true,
    role: 'Frontend', level: 'Middle', location: 'Новосибирск',
    description: 'Разрабатываю интерфейсы и пишу про DX. Спикер ReactConf, веду блог о фронтенде.',
    technologies: ['React', 'TypeScript'], extraTechCount: 6, views: '2.1k', timeAgo: '3 дня назад'
  },
  {
    id: '5', name: 'Игорь Сидоров', avatar: 'https://i.pravatar.cc/150?u=5', isOnline: false,
    role: 'Mobile', level: 'Senior', location: 'Удаленно',
    description: 'iOS-разработчик на Swift. Релизил приложения в банковской и финтех-индустрии.',
    technologies: ['Swift', 'SwiftUI'], extraTechCount: 3, views: '1.8k', timeAgo: '5 дней назад'
  },
  {
    id: '6', name: 'Ольга Кузнецова', avatar: 'https://i.pravatar.cc/150?u=6', isOnline: true,
    role: 'Frontend', level: 'Junior', location: 'Екатеринбург',
    description: 'Перешла во фронтенд из дизайна. 1.5 года опыта. Сильна в вёрстке и UI-деталях.',
    technologies: ['React', 'CSS', 'Figma'], extraTechCount: 0, views: '456', timeAgo: 'сегодня'
  }
];

const Dashboard: React.FC = () => {
  const [isOpenToWork, setIsOpenToWork] = useState(true);

  return (
    <div className="portfolio-page">
      {/* Хеддер */}
      <header className="page-header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">df</span>
            <span className="logo-text">dev/folio</span>
          </div>
          <div className="header-search">
             <input type="text" placeholder="Поиск" />
          </div>
        </div>
        <div className="header-right">
          <button className="s">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
            Перейти в портфолио
          </button>
          <button className="btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
            Перейти в портфолио
          </button>
          <img src="https://i.pravatar.cc/150?u=10" alt="User" className="user-avatar" />
        </div>
      </header>

      <main className="main-content">
        <div className="top-search-section">
          <div>
            <h1 className="page-title">Поиск портфолио</h1>
            <p className="page-subtitle">Найдите специалистов под ваш проект</p>
          </div>
          <div className="global-search">
            <input type="text" placeholder="Имя, технология, ключевое слово..." />
          </div>
        </div>

        <div className="content-grid">
          {/* Сайдбар с фильтрами */}
          <aside className="filters-sidebar">
            <div className="filters-header">
              <h3>Фильтры</h3>
              <button className="btn-reset">Сбросить</button>
            </div>

            <div className="filter-group">
              <h4>Специализация</h4>
              <div className="pills-grid">
                <button className="pill active">Frontend</button>
                <button className="pill">Backend</button>
                <button className="pill">Mobile</button>
                <button className="pill">DevOps</button>
                <button className="pill">Designer</button>
                <button className="pill">QA</button>
              </div>
            </div>

            <div className="filter-group">
              <h4>Уровень</h4>
              <div className="pills-grid">
                <button className="pill">Junior</button>
                <button className="pill active">Middle</button>
                <button className="pill">Senior</button>
              </div>
            </div>

            <div className="filter-group">
              <h4>Технологии</h4>
              <input type="text" placeholder="Поиск стека..." className="filter-input" />
              <div className="checkbox-list">
                <label className="checkbox-item">
                  <input type="checkbox" checked readOnly />
                  <span className="checkbox-label">React</span>
                  <span className="checkbox-count">142</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" checked readOnly />
                  <span className="checkbox-label">TypeScript</span>
                  <span className="checkbox-count">96</span>
                </label>
              </div>
              <button className="btn-show-more">Показать ещё</button>
            </div>

            <div className="filter-group toggle-group">
              <div>
                <h4>Открыт к работе</h4>
                <p>Только активные</p>
              </div>
              <div className={`toggle-switch ${isOpenToWork ? 'active' : ''}`} onClick={() => setIsOpenToWork(!isOpenToWork)}>
                <div className="toggle-knob"></div>
              </div>
            </div>
          </aside>

          {/* Сетка результатов */}
          <div className="results-section">
            <div className="results-header">
              <div className="active-filters">
                <span className="results-count">247 портфолио</span>
                <span className="filter-tag">Frontend <button>×</button></span>
                <span className="filter-tag">Middle <button>×</button></span>
              </div>
              <div className="sort-dropdown">
                <span>Сортировка:</span>
                <select>
                  <option>По популярности</option>
                  <option>По новизне</option>
                </select>
              </div>
            </div>

            <div className="cards-grid">
              {mockPortfolios.map((portfolio) => (
                <div key={portfolio.id} className="portfolio-card">
                  <div className="card-header">
                    <div className="avatar-wrapper">
                      <img src={portfolio.avatar} alt={portfolio.name} />
                      {portfolio.isOnline && <span className="online-dot"></span>}
                    </div>
                    <div className="user-info">
                      <h4 className="user-name">{portfolio.name}</h4>
                      <p className="user-role">{portfolio.role} · {portfolio.level}</p>
                      <p className="user-location">📍 {portfolio.location}</p>
                    </div>
                  </div>
                  <p className="card-description">{portfolio.description}</p>
                  <div className="card-tech">
                    {portfolio.technologies.map(tech => (
                      <span key={tech} className="tech-tag">{tech}</span>
                    ))}
                    {portfolio.extraTechCount > 0 && (
                      <span className="tech-tag count">+{portfolio.extraTechCount}</span>
                    )}
                  </div>
                  <div className="card-footer">
                    <div className="footer-stats">
                      <span className="views">👁️ {portfolio.views}</span>
                      <span className="time">{portfolio.timeAgo}</span>
                    </div>
                    <button className="btn-open">Открыть →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;