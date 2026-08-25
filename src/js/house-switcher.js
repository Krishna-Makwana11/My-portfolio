/* ==========================================================================
   HOUSE SWITCHER & LUMOS ILLUMINATION ENGINE
   ========================================================================== */

import { magicalAudio } from './audio-synth.js';
import confetti from 'canvas-confetti';
import { setSpotlightHouse } from './spotlight-reveal.js';

// Enchanted Top-Center Magical House Rain / Shower (Cascades downwards from top-center across portrait)
export function triggerHouseMagicShower(house) {
  let colors = ['#f59e0b', '#d97706', '#8b181b', '#b91c1c', '#fef08a'];
  if (house === 'slytherin') colors = ['#10b981', '#059669', '#1a472a', '#e2e8f0', '#94a3b8'];
  if (house === 'ravenclaw') colors = ['#38bdf8', '#0284c7', '#0e1a40', '#d97706', '#e0f2fe'];
  if (house === 'hufflepuff') colors = ['#f59e0b', '#ecb939', '#fbbf24', '#372e29', '#fef3c7'];

  // 1. Center Top Main Cascade (Gentle downward fall with subtle sway)
  confetti({
    particleCount: 55,
    angle: 270,
    spread: 110,
    startVelocity: 16,
    decay: 0.94,
    gravity: 0.75,
    drift: 0.05,
    ticks: 180,
    origin: { x: 0.5, y: -0.02 },
    colors: colors,
    shapes: ['circle', 'square'],
    scalar: 1.05,
    disableForReducedMotion: true
  });

  // 2. Wide Top Span Left & Right Ambient Sparkles (Distributed across the header)
  setTimeout(() => {
    confetti({
      particleCount: 30,
      angle: 270,
      spread: 90,
      startVelocity: 13,
      decay: 0.94,
      gravity: 0.7,
      drift: -0.12,
      ticks: 160,
      origin: { x: 0.38, y: -0.02 },
      colors: colors,
      shapes: ['circle'],
      scalar: 0.85,
      disableForReducedMotion: true
    });

    confetti({
      particleCount: 30,
      angle: 270,
      spread: 90,
      startVelocity: 13,
      decay: 0.94,
      gravity: 0.7,
      drift: 0.12,
      ticks: 160,
      origin: { x: 0.62, y: -0.02 },
      colors: colors,
      shapes: ['circle'],
      scalar: 0.85,
      disableForReducedMotion: true
    });
  }, 120);
}

export function initHouseSwitcher() {
  const houseSelectBtn = document.querySelector('.house-select-btn');
  const houseDropdown = document.querySelector('.house-dropdown-menu');
  const houseOptions = document.querySelectorAll('.house-option');
  const lumosBtn = document.getElementById('btn-toggle-lumos');
  const audioBtn = document.getElementById('btn-toggle-audio');
  const houseNameLabel = document.querySelector('.current-house-name');

  // Toggle Dropdown
  if (houseSelectBtn && houseDropdown) {
    houseSelectBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      houseDropdown.classList.toggle('show');
      magicalAudio.playWandSpell();
    });

    document.addEventListener('click', () => {
      houseDropdown.classList.remove('show');
    });
  }

  // Select House
  houseOptions.forEach((opt) => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      const house = opt.getAttribute('data-house');
      
      // Update body theme class
      document.body.classList.remove('theme-slytherin', 'theme-ravenclaw', 'theme-hufflepuff', 'theme-gryffindor');
      if (house !== 'gryffindor') {
        document.body.classList.add(`theme-${house}`);
      }

      // Update active spotlight reveal image
      setSpotlightHouse(house);

      // Update button label and house dot
      if (houseNameLabel) {
        houseNameLabel.textContent = opt.textContent.trim();
      }

      const currentDot = houseSelectBtn?.querySelector('.house-dot');
      if (currentDot) {
        currentDot.className = `house-dot ${house}`;
      }

      // Close dropdown
      if (houseDropdown) {
        houseDropdown.classList.remove('show');
      }

      // Save preference
      try {
        localStorage.setItem('hp_house_theme', house);
      } catch (err) {}

      magicalAudio.playHedwigChime();

      // Trigger downward top-center magical confetti shower
      triggerHouseMagicShower(house);
    });
  });

  // Restore saved house on load
  try {
    const savedHouse = localStorage.getItem('hp_house_theme');
    if (savedHouse && savedHouse !== 'gryffindor') {
      document.body.classList.add(`theme-${savedHouse}`);
      if (houseNameLabel) {
        houseNameLabel.textContent = savedHouse.charAt(0).toUpperCase() + savedHouse.slice(1);
      }
      const currentDot = houseSelectBtn?.querySelector('.house-dot');
      if (currentDot) {
        currentDot.className = `house-dot ${savedHouse}`;
      }
    }
  } catch (err) {}

  // Lumos / Nox Toggle
  if (lumosBtn) {
    lumosBtn.addEventListener('click', () => {
      document.body.classList.toggle('mode-lumos');
      const isLumos = document.body.classList.contains('mode-lumos');
      lumosBtn.classList.toggle('active', isLumos);
      magicalAudio.playLumosSparkle();

      if (isLumos) {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.15, x: 0.75 },
          colors: ['#ffffff', '#fef08a', '#38bdf8']
        });
      }
    });
  }

  // Sound Engine Toggle
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      const isActive = magicalAudio.toggleSound();
      audioBtn.classList.toggle('active', isActive);
      audioBtn.title = isActive ? 'Mute Enchanted Sounds' : 'Enable Enchanted Sounds';
    });
  }
}
