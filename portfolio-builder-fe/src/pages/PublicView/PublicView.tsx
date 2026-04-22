import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getPublicPortfolio } from '../../api/api' 
import './PublicView.css'

const PublicView = () => {
  const { id } = useParams<{ id: string }>()
  const [portfolio, setPortfolio] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('🔍 PublicView: id/slug from URL:', id);
    const loadPortfolio = async () => {
      try {
        if (id) {
          console.log('📡 Загружаем портфолио по slug:', id);
          // Используем getPublicPortfolio
          const data = await getPublicPortfolio(id)
          console.log('✅ Полученные данные:', data);
          setPortfolio(data)
        }
      } catch (err: any) {
        console.error('❌ Ошибка загрузки:', err);
        setError('Не удалось загрузить портфолио')
      } finally {
        setLoading(false)
      }
    }
    loadPortfolio()
  }, [id])
  
  if (loading) return <div className="loading">Загрузка стильного портфолио...</div>
  if (error || !portfolio) return <div className="error">{error || 'Портфолио не найдено'}</div>

  // Функция для отрисовки блоков в режиме "только чтение"
const renderBlock = (block: any) => {
    const { type, content } = block;

    switch (type) {
    case 'nav':
      return (
        <nav className="nav-layout-public">
          <div className="nav-logo-section">
            <span>{content?.logo || content?.logoText || 'Портфолио'}</span>
          </div>
          <div className="nav-links-section">
            <span>Обо мне</span><span>Проекты</span><span>Контакты</span>
          </div>
        </nav>
      );
    case 'main':
      return (
        <div className="main-block-public">
          <h1>{content?.greeting || 'Привет!'}</h1>
          <h3>{content?.role || 'Разработчик'}</h3>
          <p>{content?.description}</p>
        </div>
      );
    case 'skills':
      return (
        <div className="skills-public">
          <h2>Технологии</h2>
          <div className="skills-list">
            {content?.skills?.map((skill: string, i: number) => (
              <span key={i} className="skill-tag">{skill}</span>
            ))}
          </div>
        </div>
      );
    case 'projects':
      return (
        <div className="projects-public">
          <h2>Кейсы</h2>
          <div className="projects-grid">
            {content?.projects?.map((p: any, i: number) => (
              <div key={i} className="project-card-static">
                <h4>{p.title}</h4>
                <p>{p.description || p.desc}</p>  {}
              </div>
            ))}
          </div>
        </div>
      );
    case 'about':
      return (
        <div className="about-public">
          <h2>Обо мне</h2>
          <p>{content?.text || 'Здесь будет информация обо мне...'}</p>
        </div>
      );
    case 'experience':
      return (
        <div className="experience-public">
          <h2>Карьера</h2>
          <div className="timeline-public">
            {content?.experiences?.map((exp: any, i: number) => (
              <div key={i} className="experience-item-public">
                <h3>{exp.role}</h3>
                <div className="experience-meta">{exp.company} • {exp.period}</div>
                <p>{exp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      );
      
    case 'reviews':
      return (
        <div className="reviews-public">
          <h2>Отзывы</h2>
          <div className="reviews-grid-public">
            {content?.reviews?.map((review: any, i: number) => (
              <div key={i} className="review-card-public">
                <p className="review-text">"{review.text}"</p>
                <div className="review-author">
                  <strong>{review.author}</strong>
                  <span>{review.position}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      
    case 'footer':
      return (
        <footer className="footer-public">
          <div className="footer-content-public">
            <p>© 2026 {content?.name || 'Портфолио'}</p>
            <div className="footer-links-public">
              {content?.github && <a href={content.github} target="_blank" rel="noopener noreferrer">GitHub</a>}
              {content?.linkedin && <a href={content.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
              {content?.telegram && <a href={content.telegram} target="_blank" rel="noopener noreferrer">Telegram</a>}
            </div>
          </div>
        </footer>
      );
      default:
        return <div className="unknown-block">Блок типа {type}</div>;
    }
  };

  return (
    <div className="public-view-container">
      {portfolio.sections?.map((block: any, index: number) => (
        <section key={index} className="portfolio-section">
          {renderBlock(block)}
        </section>
      ))}
    </div>
  )
}

export default PublicView