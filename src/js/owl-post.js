/* ==========================================================================
   HEDWIG'S OWL POST DISPATCH ENGINE
   ========================================================================== */

import { magicalAudio } from './audio-synth.js';
import confetti from 'canvas-confetti';

export function initOwlPost() {
  const form = document.getElementById('owl-post-form');
  const successBox = document.getElementById('owl-success-msg');
  const inputs = form ? form.querySelectorAll('input, textarea') : [];

  if (!form) return;

  // Typing sound / quill feedback
  inputs.forEach((input) => {
    input.addEventListener('focus', () => {
      magicalAudio.playCauldronBubble();
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    magicalAudio.playHedwigChime();

    // Trigger celebratory golden snitch confetti burst
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#f5c542', '#fbbf24', '#ffffff', '#8b181b']
    });

    if (successBox) {
      successBox.classList.add('show');
      form.style.display = 'none';
    }
  });
}
