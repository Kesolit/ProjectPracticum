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
    const loadPortfolio = async () => {
      try {
        if (id) {
          // Используем getPublicPortfolio
          const data = await getPublicPortfolio(id)
          setPortfolio(data)
        }
      } catch (err: any) {
        setError('Не удалось загрузить портфолио')
      } finally {
        setLoading(false)
      }
    }
    loadPortfolio()
  }, [id])
  
  // ... остальной код рендеринга остается без изменений

  if (loading) return <div className="loading">Загрузка стильного портфолио...</div>
  if (error || !portfolio) return <div className="error">{error || 'Портфолио не найдено'}</div>

  // Функция для отрисовки блоков в режиме "только чтение"
const renderBlock = (block: any) => {
    const { type, content } = block;

    switch (type) {
      case 'nav':
        return (
          <nav className="nav-layout-public">
            <div className="nav-logo-section"><span>{content?.logo || 'Портфолио'}</span></div>
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
            <h2>Навыки</h2>
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
            <h2>Мои проекты</h2>
            <div className="projects-grid">
              {content?.projects?.map((p: any, i: number) => (
                <div key={i} className="project-card-static">
                  <h4>{p.title}</h4>
                  <p>{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="about-public">
            <h2>О себе</h2>
            <p>{content?.text || 'Здесь будет информация обо мне...'}</p>
          </div>
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