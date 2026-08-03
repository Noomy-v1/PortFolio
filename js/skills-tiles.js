import { skills } from './skills-data.js';
import { getCurrentLang } from './i18n.js';

const skillsGrid = document.querySelector('.skills-grid');

function renderSkills() {
  const lang = getCurrentLang();

  const cardsHTML = skills.map((skill) => `
    <div class="skill-group">
      <div class="skill-group-title">${skill.title[lang]}</div>
      <div class="skill-tags">
        ${skill.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
      </div>
    </div>
  `).join('');

  skillsGrid.innerHTML = cardsHTML;

  if (window.ScrollTrigger) {
    window.ScrollTrigger.refresh();
  }
}

renderSkills();

document.addEventListener('langchange', renderSkills);

export {};