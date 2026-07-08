const API_URL = 'https://blog-api-umz6.onrender.com';

async function loadArticle() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  const response = await fetch(`${API_URL}/api/articles/${slug}`);

  if (!response.ok) {
    document.querySelector('.article-body').textContent = "Article introuvable.";
    return;
  }

  const article = await response.json();

  document.querySelector('.article-title').textContent = article.title;
  document.querySelector('.article-date').textContent = new Date(article.created_at).toLocaleDateString('fr-CA');
  document.querySelector('.article-body').innerHTML = marked.parse(article.content);
}

loadArticle();

export {};