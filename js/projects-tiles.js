import { projects } from './project-data.js';
import { getCurrentLang } from './i18n.js';

const projectsGrid = document.querySelector('.projects-grid');

function renderProjects() {
  const lang = getCurrentLang();

  const cardsHTML = projects.map((project) => `
    <a href="${project.link}" class="project-card" target="_blank" rel="noopener noreferrer">
      <div class="project-icon">${project.icon}</div>
      <div class="project-title">${project.title[lang]}</div>
      <div class="project-desc">${project.description[lang]}</div>
      <div class="project-tags">
        ${project.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
      </div>
    </a>
  `).join('');

  projectsGrid.innerHTML = cardsHTML;

  if (window.ScrollTrigger) {
    window.ScrollTrigger.refresh();
  }
}

renderProjects();

document.addEventListener('langchange', renderProjects);

export {};