import { translations } from './translations.js';

const LANG_KEY = 'portfolio-lang';

export function getCurrentLang() {
  return localStorage.getItem(LANG_KEY) || 'fr';
}

function applyLanguage(lang) {
  const dict = translations[lang];

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.innerHTML = dict[key];
    }
  });

  document.documentElement.setAttribute('lang', lang);

  const langLabel = document.querySelector('#lang-toggle .lang-label');
  if (langLabel) {
    langLabel.textContent = lang === 'fr' ? 'EN' : 'FR';
  }

  // Prévient les autres scripts (projets, compétences) qu'il faut se re-générer
  document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

const savedLang = getCurrentLang();
applyLanguage(savedLang);

const langToggle = document.querySelector('#lang-toggle');
if (langToggle) {
  langToggle.addEventListener('click', () => {
    const newLang = getCurrentLang() === 'fr' ? 'en' : 'fr';
    applyLanguage(newLang);
    localStorage.setItem(LANG_KEY, newLang);
  });
}

export {};