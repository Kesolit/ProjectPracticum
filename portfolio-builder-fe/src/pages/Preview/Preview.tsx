import { useState, useEffect } from 'react';
import '../PublicView/PublicView.css'; 
import { GithubBlock } from '../../components/blocks/GithubBlock';
import { CustomBlock } from '../../components/blocks/CustomBlock';

// --- НОВЫЙ КОМПОНЕНТ НАВИГАЦИИ ДЛЯ ПРЕДПРОСМОТРА ---
const NavBlockPreview = ({ content, sections }: { content: any, sections: any[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Исключаем саму навигацию из выпадающего списка
  const availableSections = sections.filter(s => s.type !== 'nav');

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, type: string) => {
    e.preventDefault();
    const target = document.getElementById(`section-${type}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className="nav-container">
      <div className="nav-logo">
        {content?.logoImageUrl ? (
          <img src={content.logoImageUrl} alt="" className="nav-logo-img" />
        ) : (
          content?.logo || content?.logoText || 'МоёЛого.'
        )}
      </div>
      
      <div 
        className="nav-dropdown-wrapper"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="nav-dropdown-trigger">
          Разделы <span style={{ fontSize: '10px' }}>▼</span>
        </div>
        
        {isOpen && (
          <div className="nav-dropdown-menu">
            {availableSections.map((item, idx) => (
              <a 
                key={idx} 
                href={`#section-${item.type}`} 
                className="nav-dropdown-item"
                onClick={(e) => scrollToSection(e, item.type)}
              >
                {item.name || item.type}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

const Preview = () => {
  const [portfolio, setPortfolio] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem('portfolio_preview');
    if (data) {
      setPortfolio(JSON.parse(data));
    }
  }, []);

  if (!portfolio) {
    return <div className="loading">Загрузка предпросмотра...</div>;
  }

  const renderBlock = (block: any) => {
    const { type, content } = block;

    switch (type) {
      case 'nav':
        // Передаем массив секций из твоего стейта portfolio
        return <NavBlockPreview content={content} sections={portfolio.sections || []} />;
      
      case 'main':
        return (
          <div className="main-block-public">
            <div className="main-avatar">
              {content?.avatarUrl ? (
                <img src={content.avatarUrl} alt="" className="main-avatar-img" />
              ) : (
                <span role="img" aria-label="avatar">👨‍💻</span>
              )}
            </div>
            <h1>{content?.greeting || 'Привет, я Алексей Иванов'}</h1>
            <h3 className="main-role">{content?.role || 'Frontend Разработчик'}</h3>
            <p className="main-desc">{content?.description}</p>
          </div>
        );

      case 'about':
        return (
          <div className="section-container">
            <h2 className="section-title">Обо мне</h2>
            <div className="about-card">
              <p>{content?.text || 'Здесь будет информация обо мне...'}</p>
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className="section-container">
            <h2 className="section-title">Технологии</h2>
            <div className="skills-list">
              {content?.skills?.map((skill: string, i: number) => (
                <span key={i} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="section-container">
            <h2 className="section-title">Кейсы</h2>
            <div className="projects-grid">
              {content?.projects?.map((p: any, i: number) => (
                <div key={i} className="case-card">
                  <div className="case-cover" style={{ background: i % 2 === 0 ? 'linear-gradient(135deg, #818CF8, #C084FC)' : 'linear-gradient(135deg, #34D399, #2DD4BF)' }}></div>
                  <div className="case-info">
                    <h4 className="case-title">{p.title}</h4>
                    <a href={p.link} className="case-link" target="_blank" rel="noreferrer">
                      {p.link || 'github.com/link'}
                    </a>
                    <p className="case-description">{p.description || p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="section-container">
            <h2 className="section-title">Карьера</h2>
            <div className="timeline-container">
              {content?.experiences?.map((exp: any, i: number) => (
                <div key={i} className="timeline-item">
                  <div className={`timeline-dot ${i === 0 ? 'active' : ''}`}></div>
                  <div className="timeline-content">
                    <h4 className="exp-role">{exp.role}</h4>
                    <div className="exp-meta">
                      <span className="exp-company">{exp.company}</span> 
                      <span className="exp-dot">•</span> 
                      <span className="exp-period">{exp.period}</span>
                    </div>
                    <p className="exp-desc">{exp.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'reviews':
        return (
          <div className="section-container">
            {content?.reviews?.map((review: any, i: number) => (
              <div key={i} className="review-card-single">
                <div className="quote-icon">"</div>
                <p className="review-text">{review.text}</p>
                <div className="review-author">
                  <strong>{review.author}</strong>
                  <span>{review.position}</span>
                </div>
              </div>
            ))}
          </div>
        );

      case 'github':
        return (
          <div className="section-container">
            <h2 className="section-title">Мой OpenSource вклад</h2>
            <GithubBlock content={content} readOnly={true} />
          </div>
        );

      case 'custom':
        return (
          <div className="section-container">
            <CustomBlock content={content} readOnly={true} />
          </div>
        );
      
      case 'footer':
        return (
          <footer className="footer-container">
            <div className="footer-copyright">
              © 2026 {content?.name || 'Алексей Иванов'}. Все права защищены.
            </div>
            <div className="footer-links">
              {content?.github && <a href={content.github} target="_blank" rel="noreferrer">GitHub</a>}
              {content?.linkedin && <a href={content.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
              {content?.telegram && <a href={content.telegram} target="_blank" rel="noreferrer">Telegram</a>}
            </div>
          </footer>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="public-view-container">
      <div className="preview-badge">Режим предпросмотра</div>
      {portfolio.sections?.map((block: any, index: number) => (
        // Добавлен id для работы якорных ссылок
        <section key={index} id={`section-${block.type}`} className="portfolio-section">
          {renderBlock(block)}
        </section>
      ))}
    </div>
  );
};

export default Preview;