import { skills } from './skills-data.js';

const skillsGrid = document.querySelector('.skills-grid');

const cardsHTML = skills.map((skill) => `
  <div class="skill-group">
    <div class="skill-group-title">${skill.title}</div>
    <div class="skill-list">${skill.tags.join('<br>')}</div>
  </div>
`).join('');

skillsGrid.innerHTML = cardsHTML;

if (window.ScrollTrigger) {
    window.ScrollTrigger.refresh();
}

export { };