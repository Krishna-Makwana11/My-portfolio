/* ==========================================================================
   THE ELDER WAND - PRECISION CUSTOM CURSOR ENGINE (60FPS RAF)
   ========================================================================== */

import { magicalAudio } from './audio-synth.js';

export function initWandCursor() {
  // Disable on mobile/touch devices
  if (window.matchMedia('(pointer: coarse)').matches) {
    return;
  }

  // Create Wand Cursor DOM container if not present
  let wand = document.getElementById('elder-wand-cursor');
  if (!wand) {
    wand = document.createElement('div');
    wand.id = 'elder-wand-cursor';
    wand.className = 'elder-wand-cursor';
    wand.innerHTML = `
      <div class="elder-wand-wrapper">
        <img src="/assets/elder_wand_cursor.png" alt="The Elder Wand" class="elder-wand-img" />
        <div class="elder-wand-tip-glow"></div>
        <div class="elder-wand-spark-flash"></div>
      </div>
    `;
    document.body.appendChild(wand);
  }

  let mouseX = -100;
  let mouseY = -100;
  let isVisible = false;
  let isHovering = false;
  let rafId = null;

  const interactiveSelectors = [
    'a',
    'button',
    'input',
    'textarea',
    'select',
    'label',
    '[role="button"]',
    '[role="link"]',
    '.top-nav-btn',
    '.house-option',
    '.project-card',
    '.vortex-skill-item',
    '.interactive-card',
    '.rune-btn',
    '.clickable',
    '.filter-btn',
    '.btn-owl-send',
    '.social-icon-btn',
    '.dock-social-btn',
    '.btn-project-link',
    '.intro-btn',
  ].join(', ');

  // 60FPS RAF Render Loop (Zero Input Lag & Buttery Smooth)
  function updateCursorPosition() {
    if (isVisible) {
      wand.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }
    rafId = requestAnimationFrame(updateCursorPosition);
  }

  function onPointerMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      isVisible = true;
      wand.classList.add('visible');
    }

    if (!rafId) {
      rafId = requestAnimationFrame(updateCursorPosition);
    }
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('mousemove', onPointerMove, { passive: true });

  // Hover detection over interactive elements
  document.addEventListener('mouseover', (e) => {
    if (e.target && e.target.closest && e.target.closest(interactiveSelectors)) {
      if (!isHovering) {
        isHovering = true;
        wand.classList.add('hovering');
      }
    }
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    if (e.target && e.target.closest && e.target.closest(interactiveSelectors)) {
      isHovering = false;
      wand.classList.remove('hovering');
    }
  }, { passive: true });

  // Mouse leave / enter viewport handling
  document.documentElement.addEventListener('mouseleave', () => {
    isVisible = false;
    wand.classList.remove('visible');
  });

  document.documentElement.addEventListener('mouseenter', () => {
    isVisible = true;
    wand.classList.add('visible');
  });

  // Click spell recoil & audio spark
  window.addEventListener('mousedown', () => {
    wand.classList.add('clicking');
  });

  window.addEventListener('mouseup', () => {
    wand.classList.remove('clicking');
  });

  window.addEventListener('click', () => {
    try {
      magicalAudio.playWandSpell();
    } catch (err) {}

    wand.classList.add('clicking');
    setTimeout(() => {
      wand.classList.remove('clicking');
    }, 180);
  });

  // Start RAF loop
  rafId = requestAnimationFrame(updateCursorPosition);
}
