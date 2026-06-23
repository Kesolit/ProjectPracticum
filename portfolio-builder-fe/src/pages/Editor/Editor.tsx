import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { savePortfolioDraft, getMyDraft } from "../../api/api";
import './Editor.css'
import logo from '../../assets/logo.svg'
import eyeOn from '../../assets/eye-on.svg'
import download from '../../assets/download.svg'
import { GithubBlock } from '../../components/blocks/GithubBlock';
import { CustomBlock } from '../../components/blocks/CustomBlock';
import SaveSuccessModal from '../../components/SaveSuccessModal/SaveSuccessModal';
import { sanitizeMultilineText } from '../../utils/multilineText'
import { EditorMobile } from './EditorMobile';

// Импорты иконок
import mainIcon from '../../assets/icons/main.svg'
import navIcon from '../../assets/icons/navigation.svg'
import aboutIcon from '../../assets/icons/about.svg'
import skillsIcon from '../../assets/icons/skills.svg'
import caseIcon from '../../assets/icons/case.svg'
import careerIcon from '../../assets/icons/career.svg'
import footerIcon from '../../assets/icons/footer.svg'
import githubIcon from '../../assets/icons/github.svg'
import customIcon from '../../assets/icons/custom.svg'
import pointsIcon from '../../assets/icons/points.svg'

import iconLinkBlack from '../../assets/icon-link-black.svg'
import iconArrow from '../../assets/icon-arrow.svg'
import iconStatistics from '../../assets/icon-statistics.svg'
import iconSettings from '../../assets/icon-settings.svg'

interface BlockType {
  name: string
  desc: string
  type: string
  icon: string
  bg?: string
  content?: any
}

/** Порядок блоков как в панели «Элементы конструктора» — выпадающее меню навигации следует ему */
const EDITOR_BLOCK_CATALOG: BlockType[] = [
  { name: 'Главный блок', desc: 'Хедер и приветствие', type: 'main', icon: mainIcon, bg: '#EFF6FF' },
  { name: 'Навигация', desc: 'Верхнее меню', type: 'nav', icon: navIcon, bg: '#EBFDFF' },
  { name: 'Раздел «Обо мне»', desc: 'Биография', type: 'about', icon: aboutIcon, bg: '#F9F5FF' },
  { name: 'Раздел «Навыки»', desc: 'Техстек', type: 'skills', icon: skillsIcon, bg: '#EBFCF5' },
  { name: 'Галерея проектов', desc: 'Кейсы', type: 'projects', icon: caseIcon, bg: '#FFF7ED' },
  { name: 'История опыта', desc: 'Карьера', type: 'experience', icon: careerIcon, bg: '#FFF0F1' },
  { name: 'Подвал (Футер)', desc: 'Контакты', type: 'footer', icon: footerIcon, bg: '#F0F5F8' },
  { name: 'GitHub', desc: 'Виджет репозитория', type: 'github', icon: githubIcon, bg: '#EDF1FF' },
  { name: 'Свободный блок', desc: 'Кастомный холст', type: 'custom', icon: customIcon, bg: '#FCF4FF' },
]

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

interface FooterData {
  name: string;
  github: string;
  linkedin: string;
  telegram: string;
}

function readImageFileAsDataUrl(file: File, onLoaded: (dataUrl: string) => void) {
  if (!file.type.startsWith('image/')) return
  const reader = new FileReader()
  reader.onload = () => onLoaded(reader.result as string)
  reader.readAsDataURL(file)
}

// --- ПОД-КОМПОНЕНТЫ ---

const ProjectsBlock = ({ content, onChange }: { content: any, onChange: (data: any) => void }) => {
  const [projects, setProjects] = useState<Project[]>(content?.projects || [])

  useEffect(() => {
    onChange({ projects });
  }, [projects]);

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
              onChange={(e) =>
                updateProject(
                  project.id,
                  'desc',
                  sanitizeMultilineText(e.target.value, {
                    maxLength: 2500,
                    maxTotalNewlines: 40,
                    maxConsecutiveNewlines: 2,
                  })
                )
              }
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
                onChange={(e) =>
                  updateExperience(
                    exp.id,
                    'desc',
                    sanitizeMultilineText(e.target.value, {
                      maxLength: 3500,
                      maxTotalNewlines: 50,
                      maxConsecutiveNewlines: 2,
                    })
                  )
                }
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
const LOCAL_DRAFT_KEY = 'portfolio_local_draft';

const saveDraftToLocalStorage = (blocks: BlockType[]) => {
  try {
    localStorage.setItem(LOCAL_DRAFT_KEY, JSON.stringify(blocks));
  } catch (e) {
    console.error('Failed to save draft to localStorage', e);
  }
};

const loadDraftFromLocalStorage = (): BlockType[] | null => {
  try {
    const data = localStorage.getItem(LOCAL_DRAFT_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Failed to load draft from localStorage', e);
    return null;
  }
};

const clearLocalStorageDraft = () => {
  localStorage.removeItem(LOCAL_DRAFT_KEY);
};

const Editor = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPortfolioNavDropdownOpen, setIsPortfolioNavDropdownOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [droppedBlocks, setDroppedBlocks] = useState<BlockType[]>([])
  const [draggedBlock, setDraggedBlock] = useState<BlockType | null>(null)
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [isLoadingDraft, setIsLoadingDraft] = useState(true);
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);
  const [isServerSaved, setIsServerSaved] = useState(true); // true = текущие блоки совпадают с сервером
  
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [blocks, setBlocks] = useState<any[]>([]);

  const [isPublic, setIsPublic] = useState<boolean>(() => {
    const savedVisibility = localStorage.getItem('portfolio_is_public');
    return savedVisibility ? JSON.parse(savedVisibility) : false;
  });

  const updateBlockField = (type: string, field: string, value: any) => {
    setBlocks(prev => prev.map(b => b.type === type ? { ...b, [field]: value } : b));
  };

  useEffect(() => {
    localStorage.setItem('portfolio_is_public', JSON.stringify(isPublic));
  }, [isPublic]);

  const scrollElementIntoCanvasOrSidebar = useCallback((blockType: string) => {
    requestAnimationFrame(() => {
      const canvasEl = document.getElementById(`editor-canvas-section-${blockType}`)
      if (canvasEl) {
        canvasEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
      const sidebarEl = document.querySelector(`[data-sidebar-block="${blockType}"]`)
      if (sidebarEl) {
        ;(sidebarEl as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    })
  }, [])

  const scrollFromPortfolioNavDropdown = useCallback(
    (blockType: string) => {
      setIsPortfolioNavDropdownOpen(false)
      scrollElementIntoCanvasOrSidebar(blockType)
    },
    [scrollElementIntoCanvasOrSidebar]
  )

  const portfolioNavMenuItems = useMemo(() => {
    const onCanvas = new Set(droppedBlocks.map((b) => b.type))
    return EDITOR_BLOCK_CATALOG.filter((b) => onCanvas.has(b.type) && b.type !== 'nav')
  }, [droppedBlocks])

  const handleSortStart = (index: number) => {
    setDraggedItemIndex(index);
  };

  const handleSortOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;

    const newBlocks = [...droppedBlocks];
    const draggedItem = newBlocks[draggedItemIndex];
    newBlocks.splice(draggedItemIndex, 1);
    newBlocks.splice(index, 0, draggedItem);
    
    setDraggedItemIndex(index);
    setDroppedBlocks(newBlocks);
  };

  const handleSortEnd = () => {
    setDraggedItemIndex(null);
  };

    const handlePreview = () => {
      // Сохраняем текущее состояние блоков во временное хранилище
      const previewData = {
        sections: droppedBlocks,
        isPreview: true 
      };
      localStorage.setItem('portfolio_preview', JSON.stringify(previewData));
      
      // Открываем страницу предпросмотра в новой вкладке
      window.open('/preview', '_blank');
    };

  const updateBlockContent = (index: number, newContent: any) => {
      setDroppedBlocks(prev => prev.map((block, i) => 
        i === index ? { ...block, content: newContent } : block
      ));
    };

    const loadUserDraft = async () => {
    try {
      setIsLoadingDraft(true);
      const response = await getMyDraft();
      // сначала проверка localStorage
      const localDraft = loadDraftFromLocalStorage();
      if (localDraft && localDraft.length > 0) {
        setDroppedBlocks(localDraft);
        setIsServerSaved(false);
        // Структура ответа: { success: true, data: { id, title, sections, updatedAt } }
      } else if (response.success && response.data && response.data.sections && response.data.sections.length > 0) {
        setDroppedBlocks(response.data.sections);
        setIsServerSaved(true);
        clearLocalStorageDraft(); // серверный черновик актуален, локальный не нужен
      }
      // Если ни локального, ни серверного, то оставляем пустой массив
    } catch (err) {
      console.error("Не удалось загрузить черновик:", err);
      // Если ошибка (например, нет черновика), тоже пробуем localStorage
      const localDraft = loadDraftFromLocalStorage();
      if (localDraft && localDraft.length > 0) {
        setDroppedBlocks(localDraft);
        setIsServerSaved(false);
      }
    } finally {
      setIsLoadingDraft(false);
    }
  };

  
  
  const handleSave = async () => {
    try {
      const response = await savePortfolioDraft({
        title: "Моё крутое портфолио",
        sections: droppedBlocks,
        isPublic
      });
      
      if (response && response.slug) {
        const viewUrl = `${window.location.origin}/view/${response.slug}`;
        setCurrentUrl(viewUrl);
        setIsModalOpen(true);
        setCurrentSlug(response.slug);
        setIsServerSaved(true);
        clearLocalStorageDraft(); // черновик сохранён на сервер, локальный больше не нужен
      } else {
        alert('Сохранено, но сервер не вернул ссылку.');
      }
    } catch (err: any) {
      alert('Ошибка при сохранении: ' + err.message);
    }
  };

  const handleExport = async () => {
    if (currentSlug) {
      // Если портфолио уже сохранено – сразу открываем версию для печати
      const printUrl = `${window.location.origin}/view/${currentSlug}?print=true`;
      window.open(printUrl, '_blank');
    } else {
      // Если ещё не сохранено – сначала сохраняем, затем открываем печать
      try {
        const response = await savePortfolioDraft({
          title: "Моё крутое портфолио",
          sections: droppedBlocks
        });
        if (response && response.slug) {
          setCurrentSlug(response.slug);
          const printUrl = `${window.location.origin}/view/${response.slug}?print=true`;
          window.open(printUrl, '_blank');
        } else {
          alert('Не удалось сохранить портфолио для экспорта.');
        }
      } catch (err: any) {
        alert('Ошибка сохранения: ' + err.message);
      }
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isServerSaved && droppedBlocks.length > 0) {
        e.preventDefault();
        e.returnValue = 'У вас есть несохранённые изменения. Вы уверены, что хотите покинуть страницу?';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isServerSaved, droppedBlocks]);

  // Автосохранение черновика в localStorage (с задержкой 1 секунда)
  useEffect(() => {
    if (!isLoadingDraft && droppedBlocks.length > 0) {
      const timer = setTimeout(() => {
        saveDraftToLocalStorage(droppedBlocks);
        // помечаем, что есть несохранённые изменения на сервере
        if (isServerSaved) setIsServerSaved(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [droppedBlocks, isLoadingDraft, isServerSaved]);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      const isAuth = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(!!isAuth && !!token);
      if (isAuth && token) {
        loadUserDraft();
      } else {
        setIsLoadingDraft(false);
      }

      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUserData(JSON.parse(storedUser));
        } catch (e) {
          console.error("Ошибка парсинга данных пользователя", e);
        }
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // Закрытие выпадающих менmainи клике мимо
  useEffect(() => {
    if (!isMenuOpen && !isPortfolioNavDropdownOpen) return;
    const handleGlobalClick = () => {
      setIsMenuOpen(false);
      setIsPortfolioNavDropdownOpen(false);
    };
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [isMenuOpen, isPortfolioNavDropdownOpen]);

  // Функция рендера контента
  const renderBlockContent = (block: BlockType, isExpanded: boolean, index?: number) => {
    // 1. РЕНДЕР РАЗВЕРНУТОГО БЛОКА В КАНВАСЕ
    if (isExpanded && index !== undefined) {
      if (block.type === 'nav') {
        return (
          <div className="nav-layout-unfolded">
            <div className="nav-logo-section nav-logo-section--upload">
              <label className="nav-logo-upload" htmlFor={`nav-logo-file-${index}`}>
                <input
                  type="file"
                  id={`nav-logo-file-${index}`}
                  className="editor-block-file-input"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    readImageFileAsDataUrl(file, (url) => {
                      updateBlockContent(index, { ...block.content, logoImageUrl: url })
                      e.target.value = ''
                    })
                  }}
                />
                {block.content?.logoImageUrl ? (
                  <img src={block.content.logoImageUrl} alt="" className="nav-logo-preview" />
                ) : (
                  <span className="nav-logo-fallback">МоёЛого.</span>
                )}
              </label>
            </div>
            <div className="nav-portfolio-dropdown" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="nav-portfolio-dropdown-trigger"
                aria-expanded={isPortfolioNavDropdownOpen}
                aria-haspopup="menu"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                  setIsPortfolioNavDropdownOpen((v) => !v);
                }}
              >
                <span className="nav-portfolio-dropdown-trigger-label">Разделы</span>
                <span className={`nav-portfolio-dropdown-chevron${isPortfolioNavDropdownOpen ? ' is-open' : ''}`} aria-hidden />
              </button>
              {isPortfolioNavDropdownOpen && (
                <div className="nav-portfolio-dropdown-panel" role="menu">
                  {portfolioNavMenuItems.length === 0 ? (
                    <div className="nav-portfolio-dropdown-empty" role="presentation">
                      Добавьте блоки с панели слева — здесь появятся ссылки в том же порядке, что в конструкторе.
                    </div>
                  ) : (
                    portfolioNavMenuItems.map((b) => (
                      <button
                        key={b.type}
                        type="button"
                        role="menuitem"
                        className="nav-portfolio-dropdown-item"
                        onClick={(e) => {
                          e.stopPropagation();
                          scrollFromPortfolioNavDropdown(b.type);
                        }}
                      >
                        {b.name}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        );
      }

      if (block.type === 'main') {
        return (
          <div className="main-block-unfolded">
            <label
              className={`avatar-upload-zone${block.content?.avatarUrl ? ' avatar-upload-zone--has-image' : ''}`}
              htmlFor={`main-avatar-file-${index}`}
            >
              <input
                type="file"
                id={`main-avatar-file-${index}`}
                className="editor-block-file-input"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  readImageFileAsDataUrl(file, (url) => {
                    updateBlockContent(index, { ...block.content, avatarUrl: url })
                    e.target.value = ''
                  })
                }}
              />
              {block.content?.avatarUrl ? (
                <img src={block.content.avatarUrl} alt="" className="main-avatar-preview" />
              ) : (
                <span className="avatar-placeholder" aria-hidden>+</span>
              )}
            </label>
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
                onChange={(e) =>
                  updateBlockContent(index, {
                    ...block.content,
                    description: sanitizeMultilineText(e.target.value, {
                      maxLength: 3500,
                      maxTotalNewlines: 45,
                      maxConsecutiveNewlines: 2,
                    }),
                  })
                }
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
              placeholder="Напишите здесь подробную информацию о вашем пути в IT..."
              value={block.content?.text || ''}
              onChange={(e) =>
                updateBlockContent(index, {
                  text: sanitizeMultilineText(e.target.value, {
                    maxLength: 12000,
                    maxTotalNewlines: 100,
                    maxConsecutiveNewlines: 2,
                  }),
                })
              }
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
      if (block.type === 'footer') return <FooterBlock content={block.content} onChange={(data) => updateBlockContent(index, data)} />;
      if (block.type === 'github') return <GithubBlock content={block.content} onChange={(data) => updateBlockContent(index, data)} />;
      if (block.type === 'custom') return <CustomBlock content={block.content} onChange={(data) => updateBlockContent(index, data)} />;
    }

    // 2. РЕНДЕР КАРТОЧКИ В САЙДБАРЕ
    // Внутри renderBlockContent, секция для сайдбара:
    return (
      <>
        <div className="block-card-drag-handle">
          {pointsIcon ? <img src={pointsIcon} className="drag-handle-img" alt="drag" /> : '⋮⋮'}
        </div>
        <div className="block-card-icon-wrapper">
          {block.icon && (
            <img 
              src={block.icon} 
              alt={block.name} 
              className="sidebar-icon-img" // Добавили класс
            />
          )}
        </div>
        <div className="block-text">
          <strong>{block.name}</strong>
          <small>{block.desc}</small>
        </div>
      </>
    );
  };

  const handleLogoClick = () => navigate('/')
  
  const handleLogout = () => {
    localStorage.clear();
    clearLocalStorageDraft();
    setIsLoggedIn(false);
    setIsMenuOpen(false);
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
    if (draggedItemIndex !== null) {
      setDraggedItemIndex(null);
      return;
    }
    const blockData = e.dataTransfer.getData('block');
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
      if (isDragging) setDragPosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isDragging])

  const userFirstName = userData?.name || userData?.firstName || 'Имя';
  const userLastName = userData?.surname || userData?.lastName || 'Фамилия';
  const userDisplayName =
    (typeof userData?.fullName === 'string' && userData.fullName.trim()) ||
    [userData?.firstName, userData?.lastName].filter(Boolean).join(' ').trim() ||
    `${userFirstName} ${userLastName}`.trim();
  const portfolioViews =
    userData?.totalViews ??
    userData?.viewCount ??
    userData?.portfolioViews ??
    0;

  const isReallyMobile = isMobile || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  if (isMobile) {
  return (
    <>
      <EditorMobile 
        blocks={droppedBlocks} // Связываем с твоим реальным массивом
        addBlock={(type, name) => {
          if (droppedBlocks.some(b => b.type === type)) return;
          const template = EDITOR_BLOCK_CATALOG.find(b => b.type === type);
          if (template) {
            setDroppedBlocks(prev => [...prev, { ...template, content: {} }]);
          }
        }}
        removeBlock={(type) => setDroppedBlocks(prev => prev.filter(b => b.type !== type))}
        
        // Передаем правильное обновление контента: находим индекс блока и отдаем обновленный контент
        updateBlockField={(type, field, value) => {
          const index = droppedBlocks.findIndex(b => b.type === type);
          if (index !== -1) {
            const currentBlock = droppedBlocks[index];
            const updatedContent = {
              ...(currentBlock.content || {}),
              [field]: value
            };
            updateBlockContent(index, updatedContent);
          }
        }}
        
        saveDraft={handleSave} // Твоя оригинальная функция сохранения
        isSaving={false}                 
        isInitialLoading={isLoadingDraft} // Твой стейт загрузки черновика с бэка
        renderBlockContent={renderBlockContent}
        
        // Перемещение блоков внутри droppedBlocks
        moveBlock={(index, direction) => {
          const nextIndex = direction === 'up' ? index - 1 : index + 1;
          if (nextIndex < 0 || nextIndex >= droppedBlocks.length) return;
          setDroppedBlocks(prev => {
            const result = [...prev];
            const [removed] = result.splice(index, 1);
            result.splice(nextIndex, 0, removed);
            return result;
          });
        }}
      />
      
      {/* Модалка успешного сохранения */}
      <SaveSuccessModal 
        isOpen={isModalOpen} 
        publicUrl={currentUrl} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
  return (
    <div className="editor">
      <header className="editor-header">
        <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
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
        <div className="header-actions">
          <button className="header-btn preview-btn" onClick={handlePreview}><img src={eyeOn}/>Предпросмотр</button>
          <button className="header-btn export-btn" onClick={handleExport}><img src={download}/> Экспорт</button>
          <button className="header-btn save-btn" onClick={handleSave}>Сохранить портфолио</button>
          
          {isLoggedIn ? (
          <div className="profile-container">
            <div className="profile-avatar-wrapper" onClick={(e) => { e.stopPropagation(); setIsPortfolioNavDropdownOpen(false); setIsMenuOpen(!isMenuOpen); }}>
              <img 
                src="https://via.placeholder.com/40" 
                alt="User" 
                className="profile-avatar"
              />
            </div>

            {isMenuOpen && (
              <div className="user-dropdown-menu" onClick={(e) => e.stopPropagation()} role="menu">
                <div className="dropdown-header">
                  <span className="user-fullname">
                    {userData?.fullName || `${userFirstName} ${userLastName}`.trim()}
                  </span>
                  <span className="user-email">
                    {userData?.email || 'email@example.com'}
                  </span>
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

                <button type="button" className="dropdown-logout" role="menuitem" onClick={handleLogout}>
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

      <div className="editor-main">
        <aside className="sidebar">
          <h2>Элементы конструктора</h2>
          <p className="hint">Перетащите блоки для создания портфолио</p>
          <div className="blocks-list">
            {EDITOR_BLOCK_CATALOG.map((block, idx) => (
              <div
                key={idx}
                className={`sidebar-item sidebar-item-${block.type} block-card draggable`}
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
            <div className="visibility-toggle-container">
            <span className="visibility-toggle-label">
              Публичный доступ
            </span>
            <label className="visibility-switch">
              <input 
                type="checkbox" 
                checked={isPublic} 
                onChange={(e) => setIsPublic(e.target.checked)} 
              />
              <span className="visibility-slider"></span>
            </label>
          </div>

          {isLoadingDraft ? (
            <div className='loading-draft'>Загрузка вашего замечательного портфолио...</div>
          ) : (
            droppedBlocks.length === 0 ? (
              <div className="empty-state">
                <h3>Начните создавать свое портфолио</h3>
                <p>Перетащите компоненты из левой боковой панели, чтобы создать идеальное портфолио разработчика.</p>
                <div className="tip">Совет: Начните с Главного блока, чтобы представиться.</div>
                <div className="placeholder">Перетащите элементы сюда — Ваше портфолио появится здесь</div>
              </div>
            ) : (
              <div className="dropped-blocks-container">
                {droppedBlocks.map((block, idx) => (
                  <div 
                  key={`${block.type}-${idx}`} 
                  className="dropped-card-wrapper fade-in"
                  draggable // Обязательно делаем блок перетаскиваемым
                  onDragStart={() => handleSortStart(idx)}
                  onDragOver={(e) => handleSortOver(e, idx)}
                  onDragEnd={handleSortEnd}
                >
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
                      {renderBlockContent(block, true, idx)}
                      <button className="remove-block-btn" onClick={() => removeBlock(block.type)} title="Удалить блок">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </main>
      </div>

      <SaveSuccessModal isOpen={isModalOpen} publicUrl={currentUrl} onClose={() => setIsModalOpen(false)} />

      {isDragging && draggedBlock && (
        <div 
          className={`drag-cursor-block sidebar-item-${draggedBlock.type}`}
          style={{ 
            left: dragPosition.x, 
            top: dragPosition.y,
            position: 'fixed',
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000
          }}
        >
          {renderBlockContent(draggedBlock, false)}
        </div>
      )}
    </div>
  )
}

export default Editor