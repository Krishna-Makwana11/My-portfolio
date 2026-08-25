/* ==========================================================================
   HOUSE SWITCHER & LUMOS ILLUMINATION ENGINE
   ========================================================================== */

import { magicalAudio } from './audio-synth.js';
import confetti from 'canvas-confetti';
import { setSpotlightHouse } from './spotlight-reveal.js';

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

      // House colors confetti celebration
      let colors = ['#f5c542', '#8b181b'];
      if (house === 'slytherin') colors = ['#00ff88', '#1a472a', '#e2e8f0'];
      if (house === 'ravenclaw') colors = ['#38bdf8', '#0e1a40', '#946b2d'];
      if (house === 'hufflepuff') colors = ['#ecb939', '#372e29', '#fef08a'];

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.1, x: 0.8 },
        colors: colors
      });
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
