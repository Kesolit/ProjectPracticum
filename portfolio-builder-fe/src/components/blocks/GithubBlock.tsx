import React, { useState, useEffect } from 'react';
import { fetchFullGithubData, IFullGithubData } from '../../api/github';

import iconCode from '../../assets/icon-code.svg';
import iconClock from '../../assets/icon-clock.svg';
import iconFiles from '../../assets/icon-files.svg';
import iconFolder from '../../assets/icon-folder.svg';
import iconFile from '../../assets/icon-file.svg';
import iconLinkBlue from '../../assets/icon-link-blue.svg';
import iconStarGrey from '../../assets/icon-star-grey.svg';
import iconForkGrey from '../../assets/icon-fork-grey.svg';

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f1e05a', Python: '#3572A5', 
  HTML: '#e34c26', CSS: '#563d7c', 'C#': '#178600', 'C++': '#f34b7d', 
  Java: '#b07219', Go: '#00ADD8', Ruby: '#701516', PHP: '#4F5D95'
};

// ДОБАВИЛИ readOnly и сделали onChange необязательным
export const GithubBlock = ({ content, onChange, readOnly }: { content: any, onChange?: (data: any) => void, readOnly?: boolean }) => {
  const [inputUrl, setInputUrl] = useState(content?.url || '');
  const [data, setData] = useState<IFullGithubData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseGithubInput = (input: string) => {
    let clean = input.trim().replace(/\/$/, '').replace(/^https?:\/\/github\.com\//, '');
    const parts = clean.split('/');
    return parts.length >= 2 ? { owner: parts[0], repo: parts[1] } : null;
  };

  const handleLoad = async () => {
    if (!inputUrl) return setError('Введите ссылку');
    const parsed = parseGithubInput(inputUrl);
    if (!parsed) return setError('Неверный формат ссылки');

    setLoading(true);
    setError(null);
    const fetchedData = await fetchFullGithubData(parsed.owner, parsed.repo);
    
    if (fetchedData) {
      setData(fetchedData);
      onChange?.({ url: inputUrl, owner: parsed.owner, repo: parsed.repo }); // Вызываем onChange только если он есть
    } else {
      setError('Не удалось загрузить репозиторий. Проверьте ссылку.');
      setData(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (content?.owner && content?.repo && !data) {
      fetchFullGithubData(content.owner, content.repo).then(res => {
        if (res) setData(res);
      });
    }
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      if (diffHours === 0) return 'just now';
      return `${diffHours} hours ago`;
    }
    if (diffHours < 48) return `yesterday`;
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const totalBytes = Object.values(data?.languages || {}).reduce((a, b) => a + b, 0);
  const languageStats = Object.entries(data?.languages || {})
    .map(([lang, bytes]) => ({ lang, percent: ((bytes / totalBytes) * 100).toFixed(1) }))
    .sort((a, b) => parseFloat(b.percent) - parseFloat(a.percent))
    .slice(0, 3);

  const renderGithubUI = () => {
    if (!data) return null;
    return (
      <div style={{ border: '1px solid #d0d7de', borderRadius: '6px', background: '#ffffff', overflow: 'hidden', width: '100%', marginTop: readOnly ? '0' : '20px' }}>
        
        {/* Вкладки навигации */}
        <div style={{ display: 'flex', gap: '24px', padding: '14px 20px 0 20px', background: '#f6f8fa', borderBottom: '1px solid #d0d7de', fontSize: '13px' }}>
          <a href={data.repo.html_url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#24292f', borderBottom: '2px solid #fd8c73', paddingBottom: '12px', textDecoration: 'none' }}>
            <img src={iconCode} alt="Code" style={{ width: 14, height: 14 }} /> Code
          </a>
          <a href={`${data.repo.html_url}/issues`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#57606a', paddingBottom: '12px', textDecoration: 'none' }}>
            <img src={iconClock} alt="Issues" style={{ width: 14, height: 14 }} /> 
            Issues <span style={{ background: '#e5e7eb', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 500, color: '#374151' }}>{data.issuesCount !== undefined ? data.issuesCount : 0}</span>
          </a>
          <a href={`${data.repo.html_url}/pulls`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#57606a', paddingBottom: '12px', textDecoration: 'none' }}>
            <img src={iconFiles} alt="Pull requests" style={{ width: 14, height: 14 }} /> 
            Pull requests <span style={{ background: '#e5e7eb', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 500, color: '#374151' }}>{data.pullsCount !== undefined ? data.pullsCount : 0}</span>
          </a>
        </div>

        {/* Сетка колонок 3:2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '24px', padding: '20px' }}>
          
          {/* Левая колонка (Файлы) */}
          <div style={{ minWidth: 0 }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <img src={data.repo.owner.avatar_url} alt="avatar" style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1px solid #d0d7de' }} />
              <a href={data.repo.owner.html_url} target="_blank" rel="noreferrer" style={{ fontWeight: 400, color: '#0969da', fontSize: '18px', textDecoration: 'none' }}>
                {data.repo.owner.login}
              </a>
              <span style={{ fontSize: '18px', color: '#57606a' }}>/</span>
              <a href={data.repo.html_url} target="_blank" rel="noreferrer" style={{ fontWeight: 600, color: '#0969da', fontSize: '18px', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {data.repo.name}
              </a>
              <span style={{ border: '1px solid #d0d7de', borderRadius: '2em', padding: '1px 6px', fontSize: '11px', color: '#57606a', fontWeight: 500, marginLeft: '4px', flexShrink: 0 }}>Public</span>
            </div>

            <div style={{ border: '1px solid #d0d7de', borderRadius: '6px', overflow: 'hidden' }}>
              
              {data.latestCommit && (
                <div style={{ background: '#f6f8fa', padding: '10px 12px', borderBottom: '1px solid #d0d7de', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                    <span style={{ fontWeight: 600, color: '#24292f', flexShrink: 0 }}>{data.repo.owner.login}</span>
                    <a href={data.latestCommit.html_url} target="_blank" rel="noreferrer" style={{ color: '#57606a', textDecoration: 'none', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {data.latestCommit.commit.message.split('\n')[0]}
                    </a>
                  </div>
                  <span style={{ color: '#57606a', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {formatDate(data.latestCommit.commit.author.date)}
                  </span>
                </div>
              )}
              
              {data.contents.map((item, idx) => (
                <div key={item.path} style={{ display: 'flex', padding: '8px 12px', borderBottom: idx !== data.contents.length - 1 ? '1px solid #d0d7de' : 'none', alignItems: 'center', fontSize: '13px' }}>
                  <a href={`https://github.com/${data.repo.owner.login}/${data.repo.name}/tree/HEAD/${item.path}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', width: '100%', textDecoration: 'none', color: '#24292f', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '0 1 auto', maxWidth: '60%', minWidth: 0 }}>
                      <img src={item.type === 'dir' ? iconFolder : iconFile} alt="icon" style={{ width: 14, height: 14, flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                    </div>
                    <div style={{ flex: 1, color: '#57606a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>
                      {item.commitMessage || ''}
                    </div>
                    <div style={{ color: '#57606a', whiteSpace: 'nowrap', flexShrink: 0, textAlign: 'right', width: '80px' }}>
                      {formatDate(item.commitDate)}
                    </div>
                  </a>
                </div>
              ))}

              {data.contents.length >= 10 && (
                <a href={data.repo.html_url} target="_blank" rel="noreferrer" style={{ display: 'block', padding: '4px 12px', background: '#f9fafb', textAlign: 'center', textDecoration: 'none', color: '#57606a', fontSize: '14px', fontWeight: 600, borderTop: '1px solid #d0d7de' }}>
                  ...
                </a>
              )}
            </div>
          </div>

          {/* Правая колонка (About) */}
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#24292f', marginTop: 0 }}>About</h3>
            <p style={{ color: '#24292f', fontSize: '13px', marginBottom: '16px', lineHeight: 1.5, wordBreak: 'break-word' }}>
              {data.repo.description || 'Описание отсутствует.'}
            </p>
            
            {data.repo.homepage && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
                <img src={iconLinkBlue} alt="link" style={{ width: 14, height: 14, flexShrink: 0 }} />
                <a href={data.repo.homepage.startsWith('http') ? data.repo.homepage : `https://${data.repo.homepage}`} target="_blank" rel="noreferrer" style={{ color: '#0969da', textDecoration: 'none', fontWeight: 600, fontSize: '13px', wordBreak: 'break-all' }}>
                  {data.repo.homepage.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#57606a', fontSize: '13px' }}>
                <img src={iconStarGrey} alt="star" style={{ width: 14, height: 14 }} /> <span style={{ fontWeight: 600 }}>{data.repo.stargazers_count}</span> stars
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#57606a', fontSize: '13px' }}>
                <img src={iconForkGrey} alt="fork" style={{ width: 14, height: 14 }} /> <span style={{ fontWeight: 600 }}>{data.repo.forks_count}</span> forks
              </div>
            </div>

            {languageStats.length > 0 && (
              <>
                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '10px', color: '#24292f' }}>Languages</h3>
                <div style={{ display: 'flex', height: '6px', borderRadius: '4px', overflow: 'hidden', marginBottom: '10px' }}>
                  {languageStats.map(stat => (
                    <div key={stat.lang} style={{ width: `${stat.percent}%`, backgroundColor: LANG_COLORS[stat.lang] || '#8b949e' }}></div>
                  ))}
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '12px', color: '#57606a' }}>
                  {languageStats.map(stat => (
                    <li key={stat.lang} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: LANG_COLORS[stat.lang] || '#8b949e', flexShrink: 0 }}></span> 
                        {stat.lang}
                      </span> 
                      <span>{stat.percent}%</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ width: '100%', boxSizing: 'border-box', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      
      {!readOnly && <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 16px 0', color: '#111827' }}>Мой OpenSource вклад</h2>}
      
      {/* Прячем поле ввода в режиме readOnly */}
      {!readOnly && (
        <div style={{ display: 'flex', gap: '12px' }}>
          <input 
            type="text" 
            placeholder="https://github.com/facebook/react" 
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLoad()}
            style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', fontSize: '13px', background: '#ffffff', color: '#111827' }}
          />
          <button 
            onClick={handleLoad} 
            disabled={loading}
            style={{ background: '#1f2937', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Синхронизация...' : 'Синхронизировать'}
          </button>
        </div>
      )}

      {error && !readOnly && <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px' }}>{error}</div>}

      {renderGithubUI()}
    </div>
  );
};