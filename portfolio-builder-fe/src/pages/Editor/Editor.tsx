import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { savePortfolioDraft } from "../../api/api";
import './Editor.css'
import logo from '../../assets/logo.svg'
import { GithubBlock } from '../../components/blocks/GithubBlock';
import { CustomBlock } from '../../components/blocks/CustomBlock';

interface BlockType {
  name: string
  desc: string
  bg: string
  square: string
  type: string
  content?: any
}

interface Project {
  id: number
  title: string
  link: string
  desc: string
}

interface Experience {
  id: number
  role: string
  company: string
  period: string
  desc: string
}

interface Review {
  id: number
  text: string
  author: string
  position: string
}

interface FooterData {
  name: string;
  github: string;
  linkedin: string;
  telegram: string;
}

// --- ПОД-КОМПОНЕНТЫ ---

const ProjectsBlock = ({ content, onChange }: { content: any, onChange: (data: any) => void }) => {
  const [projects, setProjects] = useState<Project[]>(content?.projects || [])

  // useEffect(() => {
  //   const token = localStorage.getItem('accessToken');
  //   const isAuth = localStorage.getItem('isLoggedIn') === 'true';
  //   setIsLoggedIn(isAuth && !!token);
  // }, []);

  const addProject = () => {
    setProjects([...projects, { id: Date.now(), title: '', link: '', desc: '' }])
  }

  const updateProject = (id: number, field: keyof Project, value: string) => {
    setProjects(projects.map(project => 
      project.id === id ? { ...project, [field]: value } : project
    ))
  }

  const removeProject = (id: number) => {
    setProjects(projects.filter(project => project.id !== id))
  }

  return (
    <div className="projects-container">
      <h2 className="projects-main-title">Кейсы</h2>
      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card-item fade-in">
            <button className="project-remove-btn" onClick={() => removeProject(project.id)} title="Удалить проект">✕</button>
            <div className="project-cover-placeholder"><span>+ обложка</span></div>
            <input 
              className="project-input-title" 
              placeholder="Название проекта"
              value={project.title}
              onChange={(e) => updateProject(project.id, 'title', e.target.value)}
            />
            <input 
              className="project-input-link" 
              placeholder="Ссылка (GitHub / Live)"
              value={project.link}
              onChange={(e) => updateProject(project.id, 'link', e.target.value)}
            />
            <textarea 
              className="project-input-desc" 
              placeholder="Краткое описание технологий и задач..."
              value={project.desc}
              onChange={(e) => updateProject(project.id, 'desc', e.target.value)}
              rows={3}
            />
          </div>
        ))}
        <button className="add-project-btn" onClick={addProject}>
          <div className="add-icon">+</div>
          <span>добавить проект</span>
        </button>
      </div>
    </div>
  )
}

const SkillsBlock = ({ content, onChange }: { content: any, onChange: (data: any) => void }) => {
  const [skills, setSkills] = useState<string[]>(content?.skills || [])
  const [isAdding, setIsAdding] = useState(false)
  const [inputValue, setInputValue] = useState('')
  
  useEffect(() => {
    onChange({ skills });
  }, [skills]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      setSkills([...skills, inputValue.trim()])
      setInputValue('')
      setIsAdding(false)
    } else if (e.key === 'Escape') {
      setIsAdding(false)
    }
  }

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index))
  }

  return (
    <div className="skills-container-unfolded">
      <h2 className="skills-main-title">Технологии</h2>
      <div className="skills-list-wrapper">
        {skills.map((skill, index) => (
          <div key={index} className="skill-badge" onClick={() => removeSkill(index)} title="Нажмите, чтобы удалить">
            {skill}
          </div>
        ))}
        {isAdding ? (
          <input
            autoFocus
            className="skill-input-field"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => setIsAdding(false)}
            placeholder="Название..."
          />
        ) : (
          <button className="add-skill-tag-btn" onClick={() => setIsAdding(true)}>+ Добавить навык</button>
        )}
      </div>
    </div>
  )
}

const ExperienceBlock = ({ content, onChange }: { content: any, onChange: (data: any) => void }) => {
  const [experiences, setExperiences] = useState<Experience[]>(content?.experiences || [])

  useEffect(() => {
    onChange({ experiences });
  }, [experiences]);

  const addExperience = () => {
    setExperiences([...experiences, { id: Date.now(), role: '', company: '', period: '', desc: '' }])
  }

  const updateExperience = (id: number, field: keyof Experience, value: string) => {
    setExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ))
  }

  const removeExperience = (id: number) => {
    setExperiences(experiences.filter(exp => exp.id !== id))
  }

  return (
    <div className="experience-container-unfolded">
      <h2 className="experience-main-title">Карьера</h2>
      <div className="timeline-wrapper">
        <div className="timeline-line"></div>
        {experiences.map((exp) => (
          <div key={exp.id} className="timeline-item fade-in">
            <div className="timeline-dot"></div>
            <div className="experience-content">
              <button className="experience-remove-btn" onClick={() => removeExperience(exp.id)} title="Удалить">✕</button>
              <input 
                className="exp-input-role" 
                placeholder="Должность (например, Junior Frontend)" 
                value={exp.role}
                onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
              />
              <div className="exp-meta-row">
                <input 
                  className="exp-input-company" 
                  placeholder="Компания" 
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                />
                <span className="meta-divider">•</span>
                <input 
                  className="exp-input-period" 
                  placeholder="Период (2022 – 2024)" 
                  value={exp.period}
                  onChange={(e) => updateExperience(exp.id, 'period', e.target.value)}
                />
              </div>
              <textarea 
                className="exp-input-desc" 
                placeholder="Обязанности и достижения..." 
                value={exp.desc}
                onChange={(e) => updateExperience(exp.id, 'desc', e.target.value)}
                rows={1}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${target.scrollHeight}px`;
                }}
              />
            </div>
          </div>
        ))}
        <button className="add-experience-link-btn" onClick={addExperience}>
          <span className="plus-icon">+</span> Добавить место работы
        </button>
      </div>
    </div>
  )
}

const ReviewsBlock = ({ content, onChange }: { content: any, onChange: (data: any) => void }) => {
  const [reviews, setReviews] = useState<Review[]>(content?.reviews || [
    { id: 1, text: '', author: '', position: '' }
  ])

  useEffect(() => {
    onChange({ reviews });
  }, [reviews]);

  const addReview = () => {
    setReviews([...reviews, { id: Date.now(), text: '', author: '', position: '' }])
  }

  const updateReview = (id: number, field: keyof Review, value: string) => {
    setReviews(reviews.map(rev => rev.id === id ? { ...rev, [field]: value } : rev))
  }

  const removeReview = (id: number) => {
    setReviews(reviews.filter(rev => rev.id !== id))
  }

  return (
    <div className="reviews-container-unfolded">
      <h2 className="reviews-main-title">Отзывы</h2>
      <div className="reviews-stack">
        {reviews.map((rev) => (
          <div key={rev.id} className="review-card-item fade-in">
            <button className="review-card-remove" onClick={() => removeReview(rev.id)}>✕</button>
            <textarea 
              className="review-input-text" 
              placeholder="Текст отзыва рекомендателя..." 
              value={rev.text}
              onChange={(e) => updateReview(rev.id, 'text', e.target.value)}
              rows={1}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight}px`;
              }}
            />
            <div className="review-author-box">
              <input 
                className="review-input-name" 
                placeholder="Имя Фамилия" 
                value={rev.author}
                onChange={(e) => updateReview(rev.id, 'author', e.target.value)}
              />
              <input 
                className="review-input-pos" 
                placeholder="Должность" 
                value={rev.position}
                onChange={(e) => updateReview(rev.id, 'position', e.target.value)}
              />
            </div>
          </div>
        ))}
        <button className="add-review-action-btn" onClick={addReview}>
          <span className="plus-circle">+</span> Добавить отзыв
        </button>
      </div>
    </div>
  )
}

const FooterBlock = ({ content, onChange }: { content: any, onChange: (data: any) => void }) => {
  const [footerData, setFooterData] = useState<FooterData>(content || {
    name: '', github: '', linkedin: '', telegram: ''
  });

  useEffect(() => {
    onChange(footerData);
  }, [footerData]);

  const handleChange = (field: keyof FooterData, value: string) => {
    setFooterData({ ...footerData, [field]: value });
  };

  return (
    <div className="footer-minimal-container">
      <div className="footer-divider"></div>
      <div className="footer-copyright-row">
        <span>© 2026</span>
        <input 
          className="footer-inline-input" 
          placeholder="Ваше Имя" 
          value={footerData.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
        <span>Все права защищены.</span>
      </div>
      <div className="footer-social-row">
        <input className="footer-social-input" placeholder="GitHub URL" value={footerData.github} onChange={(e) => handleChange('github', e.target.value)} />
        <input className="footer-social-input" placeholder="LinkedIn URL" value={footerData.linkedin} onChange={(e) => handleChange('linkedin', e.target.value)} />
        <input className="footer-social-input" placeholder="Telegram URL" value={footerData.telegram} onChange={(e) => handleChange('telegram', e.target.value)} />
      </div>
    </div>
  );
};


// --- ГЛАВНЫЙ КОМПОНЕНТ РЕДАКТОРА ---

const Editor = () => {
  const [droppedBlocks, setDroppedBlocks] = useState<BlockType[]>([])
  const [draggedBlock, setDraggedBlock] = useState<BlockType | null>(null)
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  const navigate = useNavigate()

  const blocks: BlockType[] = [
    { name: 'Главный блок', desc: 'Хедер и приветствие', bg: '#DBEAFE', square: '#3B82F6', type: 'main' },
    { name: 'Навигация', desc: 'Верхнее меню', bg: '#F3E8FF', square: '#8B5CF6', type: 'nav' },
    { name: 'Обо мне', desc: 'Биография', bg: '#DCFCE7', square: '#10B981', type: 'about' },
    { name: 'Галерея проектов', desc: 'Кейсы', bg: '#FEF9C3', square: '#EAB308', type: 'projects' },
    { name: 'Навыки', desc: 'Технологии', bg: '#CFFAFE', square: '#06B6D4', type: 'skills' },
    { name: 'История опыта', desc: 'Карьера', bg: '#FFEDD5', square: '#F97316', type: 'experience' },
    { name: 'Отзывы', desc: 'Рекомендации', bg: '#FCE7F3', square: '#EC489A', type: 'reviews' },
    { name: 'Подвал', desc: 'Контакты', bg: '#E5E7EB', square: '#6B7280', type: 'footer' },
    { name: 'Интеграция GitHub', desc: 'Репозиторий', bg: '#E0F2FE', square: '#0EA5E9', type: 'github' },
    { name: 'Кастомный блок ', desc: 'Свободное содержимое', bg: '#F3F4F6', square: '#9CA3AF', type: 'custom' }
  ]

  const updateBlockContent = (index: number, newContent: any) => {
    setDroppedBlocks(prev => prev.map((block, i) => 
      i === index ? { ...block, content: newContent } : block
    ));
  };

  const handleSave = async () => {
    try {
      const response = await savePortfolioDraft({
        title: "Моё крутое портфолио",
        sections: droppedBlocks
      });
      
      if (response && response.slug) {
        const viewUrl = `${window.location.origin}/view/${response.slug}`;
        
        prompt('Портфолио успешно опубликовано! Скопируйте вашу ссылку:', viewUrl);
      } else {
        alert('Сохранено, но сервер не вернул ссылку (slug).');
      }
      
    } catch (err: any) {
      alert('Ошибка при сохранении: ' + err.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token')
    const isAuth = localStorage.getItem('isLoggedIn') === 'true'
    setIsLoggedIn(isAuth && !!token)
  }, [])

  // Перенесли renderBlockContent ВНУТРЬ Editor, чтобы он видел updateBlockContent
  const renderBlockContent = (block: BlockType, isExpanded: boolean, index?: number) => {
    if (isExpanded && index !== undefined) {
      
      if (block.type === 'nav') {
        return (
          <div className="nav-layout-unfolded">
            <div className="nav-logo-section">
              <div className="logo-placeholder-circle">+</div>
              <input 
                value={block.content?.logoText || 'МоёЛого.'} 
                onChange={(e) => updateBlockContent(index, { ...block.content, logoText: e.target.value })}
                style={{ background: 'transparent', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', outline: 'none' }}
              />
            </div>
            <div className="nav-links-section">
              <div className="nav-link-item">Обо мне</div>
              <div className="nav-link-item">Проекты</div>
              <div className="nav-link-item">Контакты</div>
            </div>
          </div>
        );
      }

      if (block.type === 'main') {
        return (
          <div className="main-block-unfolded">
            <div className="avatar-upload-zone">
              <div className="avatar-placeholder">+</div>
            </div>
            <div className="main-content-inputs">
              <input 
                type="text" 
                className="input-greeting" 
                placeholder="Привет, я Алексей Иванов" 
                value={block.content?.greeting || ''} 
                onChange={(e) => updateBlockContent(index, { ...block.content, greeting: e.target.value })}
              />
              <input 
                type="text" 
                className="input-role" 
                placeholder="Frontend Разработчик" 
                value={block.content?.role || ''} 
                onChange={(e) => updateBlockContent(index, { ...block.content, role: e.target.value })}
              />
              <textarea 
                className="input-description" 
                placeholder="Краткое описание вашего опыта и стека..." 
                rows={2} 
                value={block.content?.description || ''}
                onChange={(e) => updateBlockContent(index, { ...block.content, description: e.target.value })}
              />
            </div>
          </div>
        );
      }

      if (block.type === 'about') {
        return (
          <div className="about-block-unfolded">
            <h2 className="about-title">Обо мне</h2>
            <textarea
              className="about-input-field"
              placeholder="Напишите здесь подробную информацию о вашем пути в IT, образовании и увлечениях..."
              value={block.content?.text || ''}
              onChange={(e) => updateBlockContent(index, { text: e.target.value })}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight + 2}px`;
              }}
            />
          </div>
        );
      }

      if (block.type === 'projects') return <ProjectsBlock content={block.content} onChange={(data) => updateBlockContent(index, data)} />;
      if (block.type === 'skills') return <SkillsBlock content={block.content} onChange={(data) => updateBlockContent(index, data)} />;
      if (block.type === 'experience') return <ExperienceBlock content={block.content} onChange={(data) => updateBlockContent(index, data)} />;
      if (block.type === 'reviews') return <ReviewsBlock content={block.content} onChange={(data) => updateBlockContent(index, data)} />;
      if (block.type === 'footer') return <FooterBlock content={block.content} onChange={(data) => updateBlockContent(index, data)} />;
      if (block.type === 'github') return <GithubBlock content={block.content} onChange={(data) => updateBlockContent(index, data)} />;
      if (block.type === 'custom') return <CustomBlock content={block.content} onChange={(data) => updateBlockContent(index, data)} />;
    }

    // Возврат для свернутых блоков (в сайдбаре или при перетаскивании)
    return (
      <>
        <div className="block-color-square" style={{ backgroundColor: block.square }}></div>
        <div className="block-text">
          <strong>{block.name}</strong>
          <small>{block.desc}</small>
        </div>
      </>
    );
  };

  const handleLogoClick = () => navigate('/')
  
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    // старые ключи на всякий случай
    localStorage.removeItem('token');
    localStorage.removeItem('jwt_token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const handleDragStart = (e: React.DragEvent, block: BlockType) => {
    e.dataTransfer.setData('block', JSON.stringify(block))
    e.dataTransfer.effectAllowed = 'copy'
    const dragIcon = document.createElement('div')
    dragIcon.style.opacity = '0'
    document.body.appendChild(dragIcon)
    e.dataTransfer.setDragImage(dragIcon, 0, 0)
    setTimeout(() => document.body.removeChild(dragIcon), 0)
    setDraggedBlock(block)
    setIsDragging(true)
    setDragPosition({ x: e.clientX, y: e.clientY })
  }

  const handleDrag = (e: React.DragEvent) => {
    if (isDragging && e.clientX !== 0 && e.clientY !== 0) {
      setDragPosition({ x: e.clientX, y: e.clientY })
    }
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    setDraggedBlock(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const blockData = e.dataTransfer.getData('block')
    if (blockData) {
      const block: BlockType = JSON.parse(blockData)
      if (!droppedBlocks.some(b => b.type === block.type)) {
        setDroppedBlocks([...droppedBlocks, block])
      }
    }
    setDraggedBlock(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const removeBlock = (type: string) => {
    setDroppedBlocks(droppedBlocks.filter(b => b.type !== type))
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setDragPosition({ x: e.clientX, y: e.clientY })
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isDragging])

  return (
    <div className="editor">
      <header className="editor-header">
        <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <img src={logo} alt="dev/folio" className="logo-icon" />
          <span className="logo-text">dev/folio</span>
        </div>
        <div className="header-actions">
          <button className="header-btn"><span className="icon">👁</span> Предпросмотр</button>
          <button className="header-btn"><span className="icon">⬇</span> Экспорт</button>
          <button className="header-btn save-btn" onClick={handleSave}>Сохранить портфолио</button>
          {isLoggedIn ? (
            <div className="profile-wrapper">
              <button className="profile-btn" onClick={handleLogout} title="Выйти">
                <span className="profile-icon">👤</span>
              </button>
            </div>
          ) : (
            <div className="auth-group">
              <button className="header-btn login-link-btn" onClick={() => navigate('/login')}>Войти</button>
              <button className="header-btn register-link-btn" onClick={() => navigate('/register')}>Зарегистрироваться</button>
            </div>
          )}
        </div>
      </header>

      <div className="editor-main">
        <aside className="sidebar">
          <h2>Элементы конструктора</h2>
          <p className="hint">Перетащите блоки для создания портфолио</p>
          <div className="blocks-list">
            {blocks.map((block, idx) => (
              <div
                key={idx}
                className="block-card draggable"
                style={{ backgroundColor: block.bg }}
                draggable
                onDragStart={(e) => handleDragStart(e, block)}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
              >
                {renderBlockContent(block, false)}
              </div>
            ))}
          </div>
        </aside>

        <main className="canvas" onDrop={handleDrop} onDragOver={handleDragOver}>
          {droppedBlocks.length === 0 ? (
            <div className="empty-state">
              <h3>Начните создавать свое портфолио</h3>
              <p>Перетащите компоненты из левой боковой панели, чтобы создать идеальное портфолио разработчика.</p>
              <div className="tip">Совет: Начните с Главного блока, чтобы представиться.</div>
              <div className="placeholder">Перетащите элементы сюда — Ваше портфолио появится здесь</div>
            </div>
          ) : (
            <div className="dropped-blocks-container">
              {/* ЗДЕСЬ ДОБАВЛЕН ИНДЕКС idx */}
              {droppedBlocks.map((block, idx) => (
                <div key={idx} className="dropped-card-wrapper fade-in">
                  <div
                    className={`dropped-card
                      ${block.type === 'nav' ? 'nav-card-full' : ''}
                      ${block.type === 'main' ? 'main-card-full' : ''}
                      ${block.type === 'about' ? 'about-card-full' : ''}
                      ${block.type === 'projects' ? 'projects-card-full' : ''}
                      ${block.type === 'skills' ? 'skills-card-full' : ''}
                      ${block.type === 'experience' ? 'experience-card-full' : ''}
                      ${block.type === 'reviews' ? 'reviews-card-full' : ''}
                      ${block.type === 'footer' ? 'footer-card-full' : ''}
                      ${block.type === 'github' ? 'github-card-full' : ''}
                      ${block.type === 'custom' ? 'custom-card-full' : ''}`}
                    style={!['nav', 'main', 'about', 'projects', 'skills', 'experience', 'reviews', 'footer', 'github', 'custom'].includes(block.type) ? { backgroundColor: block.bg } : {}}
                  >
                    <div className="block-label-badge">{block.name}</div>
                    {/* ПЕРЕДАЕМ ИНДЕКС В ФУНКЦИЮ */}
                    {renderBlockContent(block, true, idx)}
                    <button className="remove-block-btn" onClick={() => removeBlock(block.type)} title="Удалить блок">✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {isDragging && draggedBlock && (
        <div
          className="drag-cursor-block"
          style={{
            left: dragPosition.x + 10,
            top: dragPosition.y + 10,
            backgroundColor: draggedBlock.bg,
          }}
        >
          {renderBlockContent(draggedBlock, false)}
        </div>
      )}
    </div>
  )
}

export default Editor
