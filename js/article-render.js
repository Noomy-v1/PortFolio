const API_URL = 'https://blog-api-umz6.onrender.com';

async function loadArticle() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  const titleEl = document.querySelector('.article-title');
  const dateEl = document.querySelector('.article-date');
  const bodyEl = document.querySelector('.article-body');

  titleEl.textContent = '';
  bodyEl.innerHTML = '<p class="feedback-text">Chargement de l\'article...</p>';

  try {
    const response = await fetch(`${API_URL}/api/articles/${slug}`);

    if (!response.ok) {
      bodyEl.innerHTML = '<p class="feedback-text">Article introuvable.</p>';
      return;
    }

    const article = await response.json();

    titleEl.textContent = article.title;
    dateEl.textContent = new Date(article.created_at).toLocaleDateString('fr-CA');
    bodyEl.innerHTML = marked.parse(article.content);
  } catch (err) {
    bodyEl.innerHTML = '<p class="feedback-text">Erreur de chargement. Réessaie dans quelques instants.</p>';
  }
}

loadArticle();

export { };