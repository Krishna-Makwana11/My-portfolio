/* ==========================================================================
   PART 3: SKILLS CAULDRON & 3D VORTEX HELIX ENGINE
   ========================================================================== */

import { magicalAudio } from './audio-synth.js';

// The 10 exact skills specified in user reference Part 3:
export const skillsData = [
  {
    name: 'HTML',
    category: 'Frontend & Architecture',
    spellClass: 'Standard Web Foundation Charm',
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M4 3l1.8 17.2L12 22l6.2-1.8L20 3H4z"/><path d="M16.5 7.5H7.5l.5 4.5h8l-.5 4.5-3.5 1-3.5-1-.2-2"/></svg>`,
    level: 95,
    theme: 'gold-theme',
    lore: 'Mastery over the semantic bones and accessibility architecture of the modern magical web.',
    projects: 'Bareilly Police, CineWhiz, SangamDrive'
  },
  {
    name: 'CSS',
    category: 'Styling & Transfiguration',
    spellClass: 'Aesthetic Transfiguration',
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M4 3l1.8 17.2L12 22l6.2-1.8L20 3H4z"/><path d="M8 8h8l-.5 4H8.5l.3 3 3.2.8 3.2-.8.3-2.5"/></svg>`,
    level: 92,
    theme: 'purple-theme',
    lore: 'Fluid layouts, responsive alchemy, 3D CSS transforms, and glassmorphism shaders.',
    projects: 'Portfolio Theme Engine, PassX Vault'
  },
  {
    name: 'JAVASCRIPT',
    category: 'Kinetic Logic & Charms',
    spellClass: 'Interactive Spellbinding Charm',
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M3 3h18v18H3z"/><path d="M7 16c1 1.5 2.5 1.5 3.5 0v-6"/><path d="M14 13.5c1 1 2 1.5 3.5.5s1-2.5 0-3.5-2.5-.5-3.5.5v5.5"/></svg>`,
    level: 94,
    theme: 'gold-theme',
    lore: 'Async programming, ESNext magic, DOM wizardry, and real-time state orchestration.',
    projects: 'SangamDrive, Bareilly Police, CineWhiz'
  },
  {
    name: 'C',
    category: 'Core Sorcery',
    spellClass: 'Fundamental Low-Level Incantation',
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="9"/><path d="M15 9a4.5 4.5 0 1 0 0 6"/></svg>`,
    level: 88,
    theme: 'green-theme',
    lore: 'Direct memory manipulation, pointers, and foundational computational algorithms.',
    projects: 'System Kernels, Data Structures & Algorithms'
  },
  {
    name: 'C++',
    category: 'High-Performance Sorcery',
    spellClass: 'High-Speed Object Alchemy',
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><circle cx="9" cy="12" r="6"/><path d="M16 12h4m-2-2v4m5-2h2m-1-1v2"/></svg>`,
    level: 90,
    theme: 'green-theme',
    lore: 'Object-oriented architecture, STL algorithms, ultra-fast memory-efficient processing.',
    projects: 'Competitive Programming, Algorithmic Engine'
  },
  {
    name: 'PYTHON',
    category: 'Parseltongue & AI',
    spellClass: 'Parseltongue AI & Automation',
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 2a7 7 0 0 0-7 7v2h7V9a2 2 0 0 1 4 0v1h2a7 7 0 0 0-7-7z"/><path d="M12 22a7 7 0 0 0 7-7v-2h-7v2a2 2 0 0 1-4 0v-1H6a7 7 0 0 0 7 7z"/><circle cx="9" cy="6" r="1"/><circle cx="15" cy="18" r="1"/></svg>`,
    level: 95,
    theme: 'green-theme',
    lore: 'Machine learning, OpenCV computer vision, FastAPI microservices, and automated data crawlers.',
    projects: 'Distraction Detection System, Nebula Assault, CineWhiz'
  },
  {
    name: 'EXCEL',
    category: 'Data Grimoire',
    spellClass: 'Data Matrix Calculations',
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 8l8 8m0-8l-8 8"/></svg>`,
    level: 89,
    theme: 'green-theme',
    lore: 'Advanced lookup matrices, pivot analysis, automated financial modeling and macros.',
    projects: 'Analytics Dashboard, Financial Forecast Models'
  },
  {
    name: 'SQL',
    category: 'Data Grimoire',
    spellClass: 'Pensieve Query Conjuration',
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`,
    level: 93,
    theme: 'gold-theme',
    lore: 'Relational database schema architecture, complex joins, indexing, and high-load query optimization.',
    projects: 'Bareilly Police Portal, PassX Encrypted DB'
  },
  {
    name: 'POWERBI',
    category: 'Divination Dashboards',
    spellClass: 'Divination Data Insights',
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><rect x="4" y="14" width="3" height="7"/><rect x="10.5" y="9" width="3" height="12"/><rect x="17" y="4" width="3" height="17"/></svg>`,
    level: 87,
    theme: 'gold-theme',
    lore: 'Interactive business intelligence dashboards, DAX queries, ETL modeling and data visualization.',
    projects: 'Executive KPI Portals, Analytics Reports'
  },
  {
    name: 'GITHUB',
    category: 'DevOps & Scrolls',
    spellClass: 'Version Control & Spell Repository',
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>`,
    level: 96,
    theme: 'purple-theme',
    lore: 'Branching strategies, CI/CD automated deployment pipelines, and collaborative open-source wizardry.',
    projects: 'All Open Source Repositories & Team Pipelines'
  }
];

export function initCauldronVortex() {
  const stage = document.querySelector('.cauldron-vortex-stage');
  const scene = document.querySelector('.vortex-3d-scene');
  const modalOverlay = document.querySelector('.skill-modal-overlay');
  const closeBtn = document.querySelector('.modal-close-btn');
  const runeBtns = document.querySelectorAll('.rune-btn');

  if (!stage || !scene) return;

  // Render the 10 Skill items inside the 3D scene
  scene.innerHTML = '';
  const skillElements = [];

  skillsData.forEach((skill, index) => {
    const el = document.createElement('div');
    el.className = `vortex-skill-item ${skill.theme}`;
    el.innerHTML = `
      <span class="skill-badge-icon">${skill.icon}</span>
      <span>${skill.name}</span>
    `;

    el.addEventListener('click', () => {
      openSkillModal(skill);
      magicalAudio.playCauldronBubble();
    });

    scene.appendChild(el);
    skillElements.push(el);
  });

  // 3D Helix Parameters
  let currentAngle = 0;
  let rotationSpeed = 0.008;
  const radius = 240;
  const heightSpread = 380; // vertical height of vortex
  let isDragging = false;
  let lastMouseX = 0;

  // Drag-to-rotate interaction
  stage.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastMouseX = e.clientX;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMouseX;
    currentAngle += deltaX * 0.008;
    lastMouseX = e.clientX;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch controls for mobile
  stage.addEventListener('touchstart', (e) => {
    isDragging = true;
    lastMouseX = e.touches[0].clientX;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - lastMouseX;
    currentAngle += deltaX * 0.008;
    lastMouseX = e.touches[0].clientX;
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // 3D Animation Loop
  function update3DVortex() {
    if (!isDragging) {
      currentAngle += rotationSpeed;
    }

    const total = skillsData.length;

    skillElements.forEach((el, i) => {
      // Helix progression: i from 0 (base) to total-1 (top)
      const t = i / total;
      const angle = currentAngle + (i * (Math.PI * 2 / total)) * 1.5;

      // Logarithmic widening of vortex as it rises from cauldron
      const currentRadius = radius * (0.45 + t * 0.75);
      const x = Math.cos(angle) * currentRadius;
      const z = Math.sin(angle) * currentRadius;
      const y = -heightSpread * t + (heightSpread * 0.45); // Ascending from cauldron mouth

      // Depth scaling & Opacity
      const scale = 0.75 + (z + currentRadius) / (currentRadius * 2) * 0.5;
      const opacity = 0.6 + (z + currentRadius) / (currentRadius * 2) * 0.4;

      el.style.transform = `translate3d(${x}px, ${y}px, ${z}px) scale(${scale})`;
      el.style.opacity = opacity;
      el.style.zIndex = Math.round(z + 500);
    });

    requestAnimationFrame(update3DVortex);
  }

  update3DVortex();

  // Rune Button interactions (Transmute Potion Glow / Filter)
  runeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      runeBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      magicalAudio.playCauldronBubble();

      const potionType = btn.getAttribute('data-potion');
      const root = document.documentElement;

      if (potionType === 'emerald') {
        root.style.setProperty('--potion-green', '#10b981');
        root.style.setProperty('--potion-purple', '#065f46');
      } else if (potionType === 'amethyst') {
        root.style.setProperty('--potion-green', '#c084fc');
        root.style.setProperty('--potion-purple', '#7e22ce');
      } else if (potionType === 'felix') {
        root.style.setProperty('--potion-green', '#f5c542');
        root.style.setProperty('--potion-purple', '#b45309');
      }
    });
  });

  // Modal helpers
  function openSkillModal(skill) {
    if (!modalOverlay) return;
    document.getElementById('modal-skill-icon').innerHTML = skill.icon;
    document.getElementById('modal-skill-name').textContent = skill.name;
    document.getElementById('modal-skill-class').textContent = skill.spellClass;
    document.getElementById('modal-skill-level').textContent = `${skill.level}% Mastery`;
    document.getElementById('modal-skill-progress').style.width = `${skill.level}%`;
    document.getElementById('modal-skill-lore').textContent = skill.lore;
    document.getElementById('modal-skill-projects').textContent = `Applied in: ${skill.projects}`;

    modalOverlay.classList.add('open');
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('open');
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('open');
      }
    });
  }
}
