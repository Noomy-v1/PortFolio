# Guide complet — Migrer ton portfolio HTML/CSS vers React

Objectif : transformer ton portfolio statique (À propos, Projets, Compétences, Contact) en une application React propre, maintenable et prête à déployer — en codant chaque étape toi-même.

Durée estimée : 1 à 2 fins de semaine, selon ton rythme.

---

## Vue d'ensemble de la démarche

1. Préparer le terrain (audit de ton site actuel + Git)
2. Créer le projet React avec Vite
3. Convertir ton HTML en JSX (un seul gros composant au départ)
4. Découper en composants
5. Externaliser les données (projets, compétences) dans des fichiers séparés
6. Migrer le CSS proprement
7. Gérer les images et assets
8. Ajouter les interactions (menu mobile, formulaire de contact, etc.)
9. Vérifier responsive + accessibilité
10. Déployer (et brancher noemie.dev plus tard)

La règle d'or : **fais fonctionner d'abord, améliore ensuite.** On migre tel quel, puis on refactorise.

---

## Étape 0 — Préparer le terrain

### Audit de ton site actuel

Avant de toucher au code, liste sur papier (ou Notion) :

- Les sections de ta page : Navbar, Hero/À propos, Projets, Compétences, Contact, Footer
- Les éléments répétés : chaque carte de projet a probablement la même structure HTML copiée-collée → ce sont tes futurs composants réutilisables
- Les interactions JS existantes : menu hamburger, scroll smooth, animations, validation de formulaire
- Tes fichiers CSS : un seul gros fichier ou plusieurs ?

### Git

```bash
# Garde ton ancien portfolio intact dans une branche ou un repo séparé
git checkout -b legacy-html   # sauvegarde
git checkout main
```

Tu pourras toujours comparer avec l'original pendant la migration.

---

## Étape 1 — Créer le projet avec Vite

Vite est aujourd'hui l'outil standard pour démarrer un projet React (rapide, simple, zéro config).

```bash
npm create vite@latest portfolio-react -- --template react
cd portfolio-react
npm install
npm run dev
```

Ouvre `http://localhost:5173` → tu devrais voir la page de démo Vite.

### Nettoyage initial

Supprime ce qui ne sert pas :

- Le contenu de `src/App.css` et `src/index.css` (garde les fichiers, vide-les)
- `src/assets/react.svg`
- Dans `src/App.jsx`, remplace tout par :

```jsx
function App() {
  return (
    <div>
      <h1>Portfolio en construction</h1>
    </div>
  );
}

export default App;
```

### Structure de dossiers cible

Crée tout de suite cette arborescence dans `src/` :

```
src/
├── components/      → Navbar.jsx, ProjectCard.jsx, etc.
├── sections/        → About.jsx, Projects.jsx, Skills.jsx, Contact.jsx
├── data/            → projects.js, skills.js
├── assets/          → images, icônes
├── styles/          → fichiers CSS (ou .module.css)
├── App.jsx
└── main.jsx
```

La distinction `components/` vs `sections/` : une *section* est un gros bloc de la page (utilisé une fois), un *component* est une brique réutilisable (utilisée plusieurs fois).

---

## Étape 2 — Convertir le HTML en JSX

Stratégie : copie **tout** le contenu de ton `<body>` actuel dans le `return` de `App.jsx`, puis corrige les erreurs. Vite va te crier dessus dans la console — c'est normal, suis les messages.

### Les règles de conversion HTML → JSX

| HTML | JSX |
|---|---|
| `class="card"` | `className="card"` |
| `for="email"` | `htmlFor="email"` |
| `<img src="...">` | `<img src="..." />` (balise auto-fermante) |
| `<br>`, `<hr>`, `<input>` | `<br />`, `<hr />`, `<input />` |
| `onclick="..."` | `onClick={maFonction}` |
| `style="color: red"` | `style={{ color: 'red' }}` |
| `tabindex`, `maxlength` | `tabIndex`, `maxLength` (camelCase) |
| Commentaires `<!-- -->` | `{/* commentaire */}` |

### Pièges classiques

- **Un seul élément racine** : le `return` doit retourner un seul parent. Si tu as plusieurs sections au même niveau, enveloppe-les dans un fragment :

```jsx
return (
  <>
    <header>...</header>
    <main>...</main>
    <footer>...</footer>
  </>
);
```

- **Les attributs SVG** : si tu as des SVG inline, certains attributs changent (`stroke-width` → `strokeWidth`, etc.)
- **Les scripts** : supprime tes anciennes balises `<script>` — la logique JS sera réécrite en React à l'étape 7

À la fin de cette étape, ta page complète devrait s'afficher (moche sans CSS, c'est correct). **Commit.**

---

## Étape 3 — Découper en composants

Maintenant, on découpe `App.jsx` morceau par morceau. Commence par les sections, du haut vers le bas.

### Exemple : extraire la Navbar

Crée `src/components/Navbar.jsx` :

```jsx
function Navbar() {
  return (
    <nav className="navbar">
      <a href="#accueil" className="logo">Noémie</a>
      <ul className="nav-links">
        <li><a href="#a-propos">À propos</a></li>
        <li><a href="#projets">Projets</a></li>
        <li><a href="#competences">Compétences</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
```

Puis dans `App.jsx` :

```jsx
import Navbar from './components/Navbar';
import About from './sections/About';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import Contact from './sections/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
```

Répète pour chaque section. **Commit après chaque extraction** — si quelque chose casse, tu sauras exactement où.

---

## Étape 4 — Externaliser les données (le vrai gain de React)

C'est ici que React devient payant. Au lieu de copier-coller le HTML d'une carte de projet 4 fois, tu définis tes projets comme **données** et tu les affiches avec `.map()`.

### `src/data/projects.js`

```js
export const projects = [
  {
    id: 1,
    title: "Workout Tracker",
    description: "Application Android de suivi d'entraînements (Kotlin, MVP, SQLite).",
    tags: ["Kotlin", "Android", "SQLite"],
    image: "/images/workout-tracker.png",
    github: "https://github.com/ton-user/workout-tracker",
    demo: null,
  },
  {
    id: 2,
    title: "CRM Manara",
    description: "Migration d'un CRM vers Angular + Spring Boot en équipe.",
    tags: ["Angular", "Spring Boot", "TypeScript"],
    image: "/images/crm-manara.png",
    github: "https://github.com/ton-user/crm-manara",
    demo: null,
  },
  // ... ajoute tes autres projets
];
```

### `src/components/ProjectCard.jsx`

```jsx
function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <img src={project.image} alt={`Aperçu du projet ${project.title}`} />
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <ul className="tags">
        {project.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      <div className="links">
        {project.github && <a href={project.github}>Code</a>}
        {project.demo && <a href={project.demo}>Démo</a>}
      </div>
    </article>
  );
}

export default ProjectCard;
```

### `src/sections/Projects.jsx`

```jsx
import { projects } from '../data/projects';
import ProjectCard from '../components/ProjectCard';

function Projects() {
  return (
    <section id="projets" className="projects">
      <h2>Mes projets</h2>
      <div className="projects-grid">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}

export default Projects;
```

Résultat : ajouter un projet = ajouter un objet dans `projects.js`. Zéro HTML à toucher. Fais la même chose pour tes compétences (`skills.js` avec catégories : mobile, web, outils...).

Points à retenir :
- `key` est obligatoire dans un `.map()` — utilise un id unique, pas l'index
- `{project.github && <a>...}` = affichage conditionnel (le lien n'apparaît que s'il existe)

---

## Étape 5 — Migrer le CSS

### Option A — CSS global (le plus simple pour commencer)

Copie ton CSS actuel dans `src/styles/` et importe-le une fois dans `main.jsx` :

```jsx
import './styles/global.css';
```

Tes classes fonctionnent telles quelles puisque tu as gardé les mêmes `className`. C'est l'option recommandée pour la migration initiale.

### Option B — CSS Modules (refactor plus tard)

Quand tout fonctionne, tu peux scoper le CSS par composant pour éviter les collisions de noms :

```
ProjectCard.module.css
```

```jsx
import styles from './ProjectCard.module.css';

<article className={styles.card}>
```

Vite supporte les CSS Modules nativement (le suffixe `.module.css` suffit). Suggestion : reste en CSS global pour la v1, et passe en modules graduellement composant par composant.

### À vérifier après la migration CSS

- Les chemins d'images dans le CSS (`background-image: url(...)`) → voir étape 6
- Les polices Google Fonts : déplace la balise `<link>` dans `index.html` (à la racine du projet Vite)
- Le `reset`/`normalize` CSS : importe-le en premier dans `main.jsx`

---

## Étape 6 — Images et assets

Deux façons de gérer les images dans Vite :

**1. Dossier `public/`** (à la racine) — pour les images référencées par chemin :
- `public/images/photo.png` → accessible via `/images/photo.png`
- Idéal pour les images listées dans `projects.js`

**2. Import dans `src/assets/`** — pour les images liées à un composant :

```jsx
import avatar from '../assets/avatar.png';

<img src={avatar} alt="Photo de Noémie" />
```

L'avantage de l'import : Vite optimise et hashe les fichiers au build. Pour un portfolio, le dossier `public/` est plus simple si tes chemins viennent de données.

Pense aussi à :
- Compresser tes images (Squoosh.app fait ça gratuitement)
- Mettre à jour le `favicon` et le `<title>` dans `index.html`

---

## Étape 7 — Réécrire les interactions en React

Tes anciens scripts JS (querySelector, addEventListener) deviennent du **state**.

### Exemple : menu hamburger mobile

```jsx
import { useState } from 'react';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <a href="#accueil" className="logo">Noémie</a>
      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Ouvrir le menu"
        aria-expanded={menuOpen}
      >
        ☰
      </button>
      <ul className={menuOpen ? 'nav-links open' : 'nav-links'}>
        <li><a href="#projets" onClick={() => setMenuOpen(false)}>Projets</a></li>
        {/* ... */}
      </ul>
    </nav>
  );
}
```

Le principe : au lieu de manipuler le DOM (`element.classList.toggle(...)`), tu changes un état et React met le DOM à jour pour toi.

### Formulaire de contact

Deux approches pour un portfolio :

1. **Sans backend** (recommandé) : utilise un service comme Formspree ou un simple `mailto:`. Avec Formspree, tu gardes ton `<form>` HTML et tu pointes l'attribut `action` vers leur endpoint.
2. **Formulaire contrôlé React** : si tu veux pratiquer le state :

```jsx
const [formData, setFormData] = useState({ name: '', email: '', message: '' });

const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};
```

### Faut-il React Router ?

Pour un portfolio one-page avec ancres (`#projets`), **non** — garde les liens d'ancres. Ajoute React Router seulement si tu veux des pages séparées plus tard (ex. une page détaillée par projet, ou un blogue/dev log). Tu connais déjà Router, donc tu pourras l'ajouter facilement au besoin.

---

## Étape 8 — Responsive et accessibilité

Checklist rapide avant de déployer :

- [ ] Teste en mode responsive (DevTools, iPhone SE → desktop large)
- [ ] Tous les `<img>` ont un `alt` descriptif
- [ ] Les liens externes ont `target="_blank" rel="noopener noreferrer"`
- [ ] Le contraste texte/fond passe (DevTools → Lighthouse → Accessibility)
- [ ] Navigation au clavier fonctionnelle (Tab à travers la page)
- [ ] `lang="fr"` dans `index.html`
- [ ] Lance Lighthouse : vise 90+ partout

---

## Étape 9 — Build et déploiement

### Build de production

```bash
npm run build      # génère le dossier dist/
npm run preview    # teste le build localement
```

### Déployer (Vercel, le plus simple)

1. Pousse ton repo sur GitHub
2. Va sur vercel.com → "Import Project" → choisis ton repo
3. Vercel détecte Vite automatiquement → Deploy
4. Chaque `git push` redéploie automatiquement

Netlify et GitHub Pages fonctionnent aussi. Vercel/Netlify sont plus simples pour un projet Vite (GitHub Pages demande de configurer le `base` dans `vite.config.js`).

### Brancher noemie.dev (quand tu l'achètes)

Dans Vercel : Settings → Domains → ajoute `noemie.dev` → suis les instructions DNS chez ton registraire. Bonus : les domaines `.dev` forcent le HTTPS, et Vercel fournit le certificat automatiquement.

---

## Plan de travail suggéré

| Session | Tâches | Commit |
|---|---|---|
| 1 | Audit + setup Vite + nettoyage | `chore: setup vite` |
| 2 | HTML → JSX dans App.jsx | `feat: migrate html to jsx` |
| 3 | Découpage Navbar + About + Footer | `refactor: extract navbar/about/footer` |
| 4 | Projects + Skills avec data + .map() | `feat: data-driven projects` |
| 5 | Migration CSS + images | `feat: migrate styles and assets` |
| 6 | Interactions (menu, formulaire) | `feat: mobile menu + contact form` |
| 7 | Responsive, a11y, Lighthouse | `fix: a11y and responsive polish` |
| 8 | Déploiement Vercel | `chore: deploy` |

---

## Erreurs fréquentes (et leurs solutions)

| Symptôme | Cause probable |
|---|---|
| Page blanche, erreur console "Adjacent JSX elements" | Plusieurs éléments racine → enveloppe dans `<>...</>` |
| Warning "Each child should have a unique key" | `.map()` sans `key` |
| Image cassée | Chemin relatif incorrect → mets l'image dans `public/` ou importe-la |
| CSS qui ne s'applique pas | Import oublié dans `main.jsx`, ou `class` au lieu de `className` |
| `onClick={maFonction()}` s'exécute au chargement | Parenthèses en trop → `onClick={maFonction}` ou `onClick={() => maFonction(arg)}` |
| Le state ne se met pas à jour "tout de suite" | Normal : `setState` est asynchrone, la valeur sera à jour au prochain render |

---

## Pour aller plus loin (après la v1)

- **CSS Modules** ou Tailwind pour le styling
- **Animations** : Framer Motion (entrées de sections au scroll)
- **Dark mode** : un state + variables CSS
- **Page par projet** avec React Router (utile pour détailler le projet de boulangerie iOS)
- **SEO** : balises meta dans `index.html`, Open Graph pour LinkedIn

Bonne migration! 🚀
