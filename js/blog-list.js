import { getCurrentLang } from './i18n.js';

const API_URL = 'https://blog-api-umz6.onrender.com';

async function loadBlogList() {
  const blogList = document.querySelector('.blog-list');
  const lang = getCurrentLang();

  blogList.innerHTML = `<p class="feedback-text" data-i18n="blog.loading">${lang === 'en' ? 'Loading articles...' : 'Chargement des articles...'}</p>`;

  try {
    const response = await fetch(`${API_URL}/api/articles`);
    const articles = await response.json();

    if (articles.length === 0) {
      blogList.innerHTML = `<p class="feedback-text">${lang === 'en' ? 'No articles yet.' : "Aucun article pour l'instant."}</p>`;
      return;
    }

    articles.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    blogList.innerHTML = articles.map((article) => `
      <a href="article.html?slug=${article.slug}" class="project-card">
        <div class="project-title">${article.title}</div>
        <div class="project-desc">${article.excerpt}</div>
        <div class="project-tags">
          <span class="tag">${new Date(article.created_at).toLocaleDateString('fr-CA')}</span>
        </div>
      </a>
    `).join('');

    if (window.ScrollTrigger) {
      window.ScrollTrigger.refresh();
    }
  } catch (err) {
    blogList.innerHTML = `<p class="feedback-text">${lang === 'en' ? 'Loading error. Please try again in a moment.' : 'Erreur de chargement. Réessaie dans quelques instants.'}</p>`;
  }
}

loadBlogList();

document.addEventListener('langchange', loadBlogList);

export { };