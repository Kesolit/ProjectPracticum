const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

export interface IGithubRepo {
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  homepage: string | null;
  open_issues_count: number;
  owner: { login: string; avatar_url: string; html_url: string };
}

export interface IGithubContent {
  name: string;
  type: 'dir' | 'file';
  path: string;
  commitMessage?: string;
  commitDate?: string;
}

export interface IGithubCommit {
  commit: { message: string; author: { date: string } };
  html_url: string;
}

export interface IFullGithubData {
  repo: IGithubRepo;
  contents: IGithubContent[];
  latestCommit: IGithubCommit | null;
  languages: Record<string, number>;
  issuesCount: number;
  pullsCount: number;
}

export const fetchFullGithubData = async (owner: string, repo: string): Promise<IFullGithubData | null> => {
  try {
    const headers: HeadersInit = { 'Accept': 'application/vnd.github.v3+json' };
    if (GITHUB_TOKEN) headers['Authorization'] = `token ${GITHUB_TOKEN}`;

    const baseUrl = `https://api.github.com/repos/${owner}/${repo}`;

    const [repoRes, contentsRes, commitsRes, langsRes, pullsRes] = await Promise.all([
      fetch(baseUrl, { headers }),
      fetch(`${baseUrl}/contents`, { headers }),
      fetch(`${baseUrl}/commits?per_page=1`, { headers }),
      fetch(`${baseUrl}/languages`, { headers }),
      fetch(`${baseUrl}/pulls?state=open&per_page=100`, { headers })
    ]);

    if (!repoRes.ok) return null;

    const repoData = await repoRes.json();
    const contents = contentsRes.ok ? await contentsRes.json() : [];
    const commits = commitsRes.ok ? await commitsRes.json() : [];
    const languages = langsRes.ok ? await langsRes.json() : {};
    const pulls = pullsRes.ok ? await pullsRes.json() : [];
    
    const pullsCount = Array.isArray(pulls) ? pulls.length : 0;
    const rawIssues = typeof repoData.open_issues_count === 'number' ? repoData.open_issues_count : 0;
    const issuesCount = Math.max(0, rawIssues - pullsCount);

    const sortedContents = Array.isArray(contents) 
      ? contents.sort((a, b) => (a.type === b.type ? 0 : a.type === 'dir' ? -1 : 1)).slice(0, 10)
      : [];

    const contentsWithCommits = await Promise.all(sortedContents.map(async (item) => {
      try {
        const cRes = await fetch(`${baseUrl}/commits?path=${item.path}&per_page=1`, { headers });
        if (cRes.ok) {
          const cData = await cRes.json();
          if (cData && cData.length > 0) {
            return {
              ...item,
              commitMessage: cData[0].commit.message.split('\n')[0],
              commitDate: cData[0].commit.author.date
            };
          }
        }
      } catch (e) {
        console.error(`Error fetching commit for ${item.path}:`, e);
      }
      return item;
    }));

    return {
      repo: repoData,
      contents: contentsWithCommits,
      latestCommit: commits.length > 0 ? commits[0] : null,
      languages: languages,
      issuesCount,
      pullsCount
    };
  } catch (error) {
    console.error("Fetch full GitHub data error:", error);
    return null;
  }
};