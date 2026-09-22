 const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
// Pastikan path ini benar mengarah ke folder views
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));

// Import Portfolio Context
const dataPortfolio = require('../context/portfolioContext');


// Route Home
app.get('/', (req, res) => {
    // Kita harus mengirim object dengan key 'data' agar terbaca di EJS
    res.render('home', { data: dataPortfolio });
});

// Route Games Arcade
app.get('/games', (req, res) => {
    res.render('games', { data: dataPortfolio });
});

// Route Dedicated Projects Page
app.get('/projects', (req, res) => {
    res.render('projects', { data: dataPortfolio });
});

// In-memory cache for GitHub stats (15 minutes TTL)
let githubStatsCache = {
    data: null,
    timestamp: 0
};
const GITHUB_CACHE_TTL = 15 * 60 * 1000;

// Route API Projects (Opsional jika ingin akses JSON)
app.get('/api/projects', (req, res) => {
    res.json(dataPortfolio.projects);
});

// Route API Live GitHub Stats & Activity
app.get('/api/github-stats', async (req, res) => {
    const now = Date.now();
    if (githubStatsCache.data && (now - githubStatsCache.timestamp < GITHUB_CACHE_TTL)) {
        return res.json({ success: true, cached: true, ...githubStatsCache.data });
    }

    try {
        const username = 'wiraputra';
        const headers = { 'User-Agent': 'Portfolio-Express-App' };

        const [userRes, reposRes] = await Promise.all([
            fetch(`https://api.github.com/users/${username}`, { headers }),
            fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=30`, { headers })
        ]);

        if (!userRes.ok || !reposRes.ok) {
            throw new Error(`GitHub API error: user=${userRes.status}, repos=${reposRes.status}`);
        }

        const user = await userRes.json();
        const repos = await reposRes.json();

        let totalStars = 0;
        const languageCounts = {};

        repos.forEach(repo => {
            totalStars += (repo.stargazers_count || 0);
            if (repo.language) {
                languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
            }
        });

        const totalLangRepos = Object.values(languageCounts).reduce((a, b) => a + b, 0);
        const topLanguages = Object.entries(languageCounts)
            .map(([lang, count]) => ({
                language: lang,
                percentage: Math.round((count / (totalLangRepos || 1)) * 100)
            }))
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 5);

        const recentRepos = repos
            .slice(0, 6)
            .map(r => ({
                name: r.name,
                description: r.description || 'Public repository on GitHub',
                url: r.html_url,
                stars: r.stargazers_count || 0,
                forks: r.forks_count || 0,
                language: r.language || 'Code',
                updatedAt: r.updated_at
            }));

        const resultData = {
            profile: {
                username: user.login,
                name: user.name || 'I Gede Wirawan',
                avatarUrl: user.avatar_url,
                publicRepos: user.public_repos,
                followers: user.followers,
                following: user.following,
                createdAt: user.created_at,
                totalStars
            },
            topLanguages,
            recentRepos
        };

        githubStatsCache = {
            data: resultData,
            timestamp: now
        };

        return res.json({ success: true, cached: false, ...resultData });
    } catch (err) {
        console.error('Failed to fetch GitHub stats:', err.message);
        if (githubStatsCache.data) {
            return res.json({ success: true, cached: true, stale: true, ...githubStatsCache.data });
        }
        return res.json({
            success: true,
            fallback: true,
            profile: {
                username: 'wiraputra',
                name: 'I Gede Wirawan',
                avatarUrl: 'https://avatars.githubusercontent.com/u/36316262?v=4',
                publicRepos: 12,
                followers: 8,
                following: 16,
                createdAt: '2018-02-10T05:49:46Z',
                totalStars: 2
            },
            topLanguages: [
                { language: 'TypeScript', percentage: 35 },
                { language: 'JavaScript', percentage: 30 },
                { language: 'PHP / Blade', percentage: 20 },
                { language: 'Python', percentage: 15 }
            ],
            recentRepos: [
                {
                    name: 'portofolio-express',
                    description: 'Express.js full-stack portfolio with 3D animation, games, and responsive UI',
                    url: 'https://github.com/wiraputra/portofolio-express',
                    stars: 0,
                    forks: 0,
                    language: 'JavaScript',
                    updatedAt: '2026-09-21T00:00:00Z'
                },
                {
                    name: 'kenangansenja',
                    description: 'Web-based order and inventory management application for coffee shops',
                    url: 'https://github.com/wiraputra/kenangansenja',
                    stars: 2,
                    forks: 0,
                    language: 'Blade',
                    updatedAt: '2026-04-17T07:11:19Z'
                },
                {
                    name: 'microcredential',
                    description: 'Cyber security and ethical hacking hands-on training repository',
                    url: 'https://github.com/wiraputra/microcredential',
                    stars: 0,
                    forks: 0,
                    language: 'TypeScript',
                    updatedAt: '2026-05-25T06:52:13Z'
                }
            ]
        });
    }
});

// Route 404 (Wajib ditaruh paling bawah)
app.use((req, res, next) => {
    res.status(404).render('404');
});

module.exports = app;