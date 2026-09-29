/* ==========================================================================
   HERO HP MODE & INTERACTION CONTROLLER (CLEAN STATE)
   ========================================================================== */

import { magicalAudio } from './audio-synth.js';
import confetti from 'canvas-confetti';

export function initHeroAvatarInteraction() {
  const stickyCard = document.getElementById('hero-sticky-card');
  const heroImg = document.querySelector('.hero-portrait-img');
  const hpModeBtn = document.getElementById('btn-toggle-hp-mode');

  if (!stickyCard) return;



  let isFullHPMode = false;

  if (hpModeBtn) {
    hpModeBtn.addEventListener('click', () => {
      toggleFullHPMode();
    });
  }

  function toggleFullHPMode() {
    isFullHPMode = !isFullHPMode;
    stickyCard.classList.toggle('full-hp-mode', isFullHPMode);
    if (hpModeBtn) hpModeBtn.classList.toggle('active', isFullHPMode);

    if (isFullHPMode) {
      magicalAudio.playHedwigChime();
      confetti({
        particleCount: 65,
        spread: 80,
        origin: { y: 0.55, x: 0.5 },
        colors: ['#f5c542', '#8b181b', '#ffffff', '#eab308']
      });
    }
  }
}
