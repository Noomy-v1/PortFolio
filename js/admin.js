const API_URL = 'https://blog-api-umz6.onrender.com';

let savedKey = null;

const lockScreen = document.querySelector('#lock-screen');
const adminSection = document.querySelector('#admin-section');
const unlockBtn = document.querySelector('#unlock-btn');
const adminKeyInput = document.querySelector('#admin-key-input');
const unlockFeedback = document.querySelector('#unlock-feedback');

unlockBtn.addEventListener('click', async () => {
  const key = adminKeyInput.value;
  if (!key) {
    unlockFeedback.textContent = 'Entre une clé.';
    return;
  }

  unlockFeedback.textContent = 'Vérification...';

  try {
    const response = await fetch(`${API_URL}/api/articles/__verification__`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
      body: JSON.stringify({}),
    });

    if (response.status === 401) {
      unlockFeedback.textContent = 'Clé incorrecte.';
      return;
    }

    savedKey = key;
    lockScreen.style.display = 'none';
    adminSection.style.display = 'block';
    loadExistingArticles();
  } catch (err) {
    unlockFeedback.textContent = 'Erreur réseau, réessaie.';
  }
});

adminKeyInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') unlockBtn.click();
});

// --- Liste des articles existants ---

async function loadExistingArticles() {
  const response = await fetch(`${API_URL}/api/articles`);
  const articles = await response.json();

  const container = document.querySelector('#existing-articles');

  if (articles.length === 0) {
    container.innerHTML = '<p class="feedback-text">Aucun article pour l\'instant.</p>';
    return;
  }

  container.innerHTML = articles.map((article) => `
    <div class="project-card admin-article-row">
      <div class="project-title">${article.title}</div>
      <div class="project-desc">${article.excerpt}</div>
      <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
        <button class="btn-secondary edit-btn" data-slug="${article.slug}">Modifier</button>
        <button class="btn-secondary delete-btn" data-slug="${article.slug}">Supprimer</button>
      </div>
    </div>
  `).join('');

  // Attache les événements après avoir généré le HTML
  container.querySelectorAll('.edit-btn').forEach((btn) => {
    btn.addEventListener('click', () => startEdit(btn.dataset.slug, articles));
  });

  container.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', () => deleteArticle(btn.dataset.slug));
  });
}

// --- Passer en mode édition ---

function startEdit(slug, articles) {
  const article = articles.find((a) => a.slug === slug);
  if (!article) return;

  document.querySelector('#editing-slug').value = article.slug;
  document.querySelector('#title').value = article.title;
  document.querySelector('#slug').value = article.slug;
  document.querySelector('#slug').disabled = true; // le slug ne change pas en édition
  document.querySelector('#excerpt').value = article.excerpt;
  document.querySelector('#content').value = article.content;

  document.querySelector('#form-label').textContent = `Modifier : ${article.title}`;
  document.querySelector('#submit-btn').textContent = 'Enregistrer les modifications';
  document.querySelector('#cancel-edit-btn').style.display = 'inline-block';

  window.scrollTo({ top: document.querySelector('#article-form').offsetTop - 20, behavior: 'smooth' });
}

document.querySelector('#cancel-edit-btn').addEventListener('click', resetForm);

function resetForm() {
  document.querySelector('#article-form').reset();
  document.querySelector('#editing-slug').value = '';
  document.querySelector('#slug').disabled = false;
  document.querySelector('#form-label').textContent = 'Nouvel article';
  document.querySelector('#submit-btn').textContent = "Publier l'article";
  document.querySelector('#cancel-edit-btn').style.display = 'none';
}

// --- Supprimer un article ---

async function deleteArticle(slug) {
  const confirmed = confirm(`Supprimer l'article "${slug}" ? Cette action est irréversible.`);
  if (!confirmed) return;

  try {
    const response = await fetch(`${API_URL}/api/articles/${slug}`, {
      method: 'DELETE',
      headers: { 'x-admin-key': savedKey },
    });

    if (!response.ok) {
      alert('Erreur lors de la suppression.');
      return;
    }

    loadExistingArticles(); // rafraîchit la liste
  } catch (err) {
    alert('Erreur réseau.');
  }
}

// --- Soumission du formulaire (création OU modification) ---

const form = document.querySelector('#article-form');
const feedback = document.querySelector('#feedback');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const editingSlug = document.querySelector('#editing-slug').value;
  const title = document.querySelector('#title').value;
  const slug = document.querySelector('#slug').value;
  const excerpt = document.querySelector('#excerpt').value;
  const content = document.querySelector('#content').value;

  const isEditing = Boolean(editingSlug);
  const url = isEditing ? `${API_URL}/api/articles/${editingSlug}` : `${API_URL}/api/articles`;
  const method = isEditing ? 'PUT' : 'POST';

  feedback.textContent = isEditing ? 'Modification en cours...' : 'Publication en cours...';

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': savedKey,
      },
      body: JSON.stringify({ slug, title, excerpt, content }),
    });

    if (!response.ok) {
      const error = await response.json();
      feedback.textContent = `Erreur : ${error.error}`;
      return;
    }

    feedback.textContent = isEditing ? 'Article modifié avec succès!' : 'Article publié avec succès!';
    resetForm();
    loadExistingArticles();
  } catch (err) {
    feedback.textContent = 'Erreur réseau, vérifie ta connexion.';
  }
});

export {};