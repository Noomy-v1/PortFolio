const THEME_KEY = 'portfolio-theme';
const toggleInput = document.querySelector('#theme-toggle');

function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    toggleInput.checked = true;
  } else {
    document.documentElement.removeAttribute('data-theme');
    toggleInput.checked = false;
  }
}

const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
applyTheme(savedTheme);

toggleInput.addEventListener('change', () => {
  const newTheme = toggleInput.checked ? 'light' : 'dark';
  applyTheme(newTheme);
  localStorage.setItem(THEME_KEY, newTheme);
});

export {};