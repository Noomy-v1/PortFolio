const API_URL = 'https://blog-api-umz6.onrender.com';

async function loadBlogList() {
    const response = await fetch(`${API_URL}/api/articles`);
    const articles = await response.json();

    const blogList = document.querySelector('.blog-list');

    blogList.innerHTML = articles.map((article) => `
    <a href="articles.html?slug=${article.slug}" class="project-card">
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
}

loadBlogList();

export { };