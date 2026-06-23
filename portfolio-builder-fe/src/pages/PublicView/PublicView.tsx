import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getPublicPortfolio } from '../../api/api' 
import './PublicView.css'
import { GithubBlock } from '../../components/blocks/GithubBlock';
import { CustomBlock } from '../../components/blocks/CustomBlock';

// --- НОВЫЙ КОМПОНЕНТ НАВИГАЦИИ ДЛЯ ПРЕДПРОСМОТРА ---
const NavBlockPublic = ({ content, sections }: { content: any, sections: any[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Исключаем саму навигацию из выпадающего списка
  const availableSections = sections.filter(s => s.type !== 'nav');

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, type: string) => {
    e.preventDefault();
    const target = document.getElementById(`section-${type}`);
    if (target) {
      // Плавная прокрутка к нужному блоку
      target.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className="nav-container">
      <div className="nav-logo">{content?.logo || content?.logoText || 'МоёЛого.'}</div>
      
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

// --- ГЛАВНЫЙ КОМПОНЕНТ ---
const PublicView = () => {
  const { slug } = useParams<{ slug: string }>()
  
  const [portfolio, setPortfolio] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        if (slug) {
          const data = await getPublicPortfolio(slug)
          setPortfolio(data)
        } else {
          setError('Ссылка некорректна')
        }
      } catch (err: any) {
        setError('Не удалось загрузить портфолио')
      } finally {
        setLoading(false)
      }
    }
    loadPortfolio()
  }, [slug])
  
  if (loading) return <div className="loading">Загрузка стильного портфолио...</div>
  if (error || !portfolio) return <div className="error">{error || 'Портфолио не найдено'}</div>

  // Обратите внимание, что мы передаем allSections для навигации
  const renderBlock = (block: any, allSections: any[]) => {
    const { type, content } = block;

    switch (type) {
      case 'nav':
        return <NavBlockPublic content={content} sections={allSections} />;
      
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
                    <a href={p.link} className="case-link">{p.link || 'github.com/link'}</a>
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
                      <span className="exp-company">{exp.company}</span> <span className="exp-dot">•</span> <span className="exp-period">{exp.period}</span>
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
            <GithubBlock content={content} readOnly />
          </div>
        );

      case 'custom':
        return (
          <div className="section-container">
            <CustomBlock content={content} readOnly />
          </div>
        );
      
      case 'footer':
        return (
          <footer className="footer-container">
            <div className="footer-copyright">
              © 2026 {content?.name || 'Алексей Иванов'}. Все права защищены.
            </div>
            <div className="footer-links">
              {content?.github && <a href={content.github} target="_blank" rel="noopener noreferrer">GitHub</a>}
              {content?.linkedin && <a href={content.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
              {content?.telegram && <a href={content.telegram} target="_blank" rel="noopener noreferrer">Telegram</a>}
            </div>
          </footer>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="public-view-container">
      {portfolio.sections?.map((block: any, index: number) => (
        // Добавлен id для работы якорных ссылок
        <section key={index} id={`section-${block.type}`} className="portfolio-section">
          {renderBlock(block, portfolio.sections)}
        </section>
      ))}
    </div>
  )
}

export default PublicView
