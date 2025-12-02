// ===== DOM Elements =====
const nav = document.querySelector('.nav');
const timelineItems = document.querySelectorAll('.timeline-item');
const fadeElements = document.querySelectorAll('.glass-card, .section-title');

// ===== Navigation Scroll Effect =====
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add/remove background opacity based on scroll
    if (currentScroll > 50) {
        nav.style.background = 'rgba(10, 10, 10, 0.95)';
    } else {
        nav.style.background = 'rgba(10, 10, 10, 0.8)';
    }

    lastScroll = currentScroll;
});

// ===== Smooth Scroll for Navigation Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Timeline Expand/Collapse =====
timelineItems.forEach(item => {
    const header = item.querySelector('.timeline-header');

    header.addEventListener('click', () => {
        const isExpanded = item.getAttribute('data-expanded') === 'true';

        // Close all other items
        timelineItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.setAttribute('data-expanded', 'false');
            }
        });

        // Toggle current item
        item.setAttribute('data-expanded', !isExpanded);
    });
});

// ===== Intersection Observer for Fade-in Animations =====
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

fadeElements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// ===== GitHub API Integration =====
const GITHUB_USERNAME = 'jeremyodell';

async function fetchGitHubData() {
    try {
        // Fetch user data
        const userResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
        if (!userResponse.ok) throw new Error('Failed to fetch user data');
        const userData = await userResponse.json();

        // Update profile section
        document.getElementById('github-avatar').src = userData.avatar_url;
        document.getElementById('github-name').textContent = userData.name || GITHUB_USERNAME;
        document.getElementById('github-bio').textContent = userData.bio || 'Software Architect & AI Systems Engineer';
        document.getElementById('github-repos').textContent = userData.public_repos;
        document.getElementById('github-followers').textContent = userData.followers;
        document.getElementById('github-following').textContent = userData.following;

        // Fetch repositories
        const reposResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);
        if (!reposResponse.ok) throw new Error('Failed to fetch repos');
        const repos = await reposResponse.json();

        // Render repositories
        renderRepos(repos);

    } catch (error) {
        console.error('Error fetching GitHub data:', error);
        // Show fallback content
        document.getElementById('github-avatar').src = `https://github.com/${GITHUB_USERNAME}.png`;
        document.getElementById('github-name').textContent = 'Jeremy Odell';
        document.getElementById('github-bio').textContent = 'Solution Architect & AI Systems Engineer';
    }
}

function renderRepos(repos) {
    const container = document.getElementById('repos-container');

    if (repos.length === 0) {
        container.innerHTML = '<p class="no-repos">No public repositories yet.</p>';
        return;
    }

    const repoCards = repos.map(repo => {
        const languageColor = getLanguageColor(repo.language);

        return `
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="glass-card repo-card">
                <h4>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                    ${repo.name}
                </h4>
                <p>${repo.description || 'No description available'}</p>
                <div class="repo-meta">
                    ${repo.language ? `
                        <span>
                            <span class="language-dot" style="background: ${languageColor}"></span>
                            ${repo.language}
                        </span>
                    ` : ''}
                    <span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                        ${repo.stargazers_count}
                    </span>
                    <span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="6" y1="3" x2="6" y2="15"></line>
                            <circle cx="18" cy="6" r="3"></circle>
                            <circle cx="6" cy="18" r="3"></circle>
                            <path d="M18 9a9 9 0 0 1-9 9"></path>
                        </svg>
                        ${repo.forks_count}
                    </span>
                </div>
            </a>
        `;
    }).join('');

    container.innerHTML = repoCards;
}

function getLanguageColor(language) {
    const colors = {
        'JavaScript': '#f1e05a',
        'TypeScript': '#3178c6',
        'Python': '#3572A5',
        'Java': '#b07219',
        'Go': '#00ADD8',
        'C#': '#178600',
        'C++': '#f34b7d',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'Vue': '#41b883',
        'Groovy': '#4298b8',
        'Kotlin': '#A97BFF',
        'Swift': '#F05138',
        'Ruby': '#701516',
        'PHP': '#4F5D95',
        'Rust': '#dea584',
        'Shell': '#89e051'
    };
    return colors[language] || '#c0c0c0';
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    fetchGitHubData();

    // Add staggered animation delay to cards
    document.querySelectorAll('.vision-grid .glass-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    document.querySelectorAll('.skills-grid .glass-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
});

// ===== Active Navigation Link Highlight =====
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// ===== Typing Effect for Hero (Optional Enhancement) =====
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// ===== Parallax Effect on Hero Graphic =====
const heroGraphic = document.querySelector('.hero-graphic');

if (heroGraphic) {
    window.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 50;
        const y = (window.innerHeight / 2 - e.pageY) / 50;

        heroGraphic.style.transform = `translateY(${y}px) translateX(${x}px)`;
    });
}
