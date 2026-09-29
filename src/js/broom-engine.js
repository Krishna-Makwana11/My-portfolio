/* ==========================================================================
   PART 2: NIMBUS 2000 BROOM FLIGHT & GOLDEN PARTICLE PORTAL ENGINE
   ========================================================================== */

import { magicalAudio } from './audio-synth.js';

export function initBroomTransitionEngine() {
  const section = document.querySelector('.transition-section');
  const canvas = document.getElementById('broom-particles-canvas');
  const broom = document.querySelector('.nimbus-broom-actor');
  const flyBtn = document.getElementById('btn-fly-nimbus');

  if (!section || !canvas || !broom) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = section.offsetWidth);
  let height = (canvas.height = section.offsetHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = section.offsetWidth;
    height = canvas.height = section.offsetHeight;
  });

  const particles = [];
  let isAutoFlying = true;
  let isManualFlying = false;

  broom.classList.add('flying');

  class GoldenEmber {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      const angle = Math.PI + (Math.random() - 0.5) * 0.8;
      const speed = Math.random() * 3 + 1;
      this.vx = Math.cos(angle) * speed;
      this.vy = (Math.random() - 0.5) * 2;
      this.size = Math.random() * 4 + 1.5;
      this.alpha = 1;
      this.decay = Math.random() * 0.015 + 0.008;
      this.hue = Math.random() > 0.3 ? '#f5c542' : '#fde047';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
      this.size *= 0.98;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.shadowColor = '#f5c542';
      ctx.shadowBlur = 12;
      ctx.fillStyle = this.hue;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Interactive Broom Drag / Pilot Mode
  let isDragging = false;

  broom.addEventListener('mousedown', (e) => {
    isDragging = true;
    isAutoFlying = false;
    broom.classList.remove('flying');
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const rect = section.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    broom.style.left = `${x - 100}px`;
    broom.style.top = `${y - 40}px`;

    // Emit dense golden stardust trail from broom tail
    for (let i = 0; i < 4; i++) {
      particles.push(new GoldenEmber(x + 20, y));
    }
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
    }
  });

  // Manual Trigger Button
  if (flyBtn) {
    flyBtn.addEventListener('click', () => {
      broom.classList.remove('flying');
      void broom.offsetWidth; // trigger reflow
      broom.classList.add('flying');
      
      // Spawn extra wave of golden particles
      for (let i = 0; i < 40; i++) {
        setTimeout(() => {
          const rect = broom.getBoundingClientRect();
          const sRect = section.getBoundingClientRect();
          particles.push(new GoldenEmber(rect.right - sRect.left, rect.top + 30 - sRect.top));
        }, i * 40);
      }
    });
  }

  // Continuous Emitter during CSS animation
  function checkBroomEmitter() {
    if (broom.classList.contains('flying')) {
      const rect = broom.getBoundingClientRect();
      const sRect = section.getBoundingClientRect();
      const tailX = rect.left - sRect.left + 40;
      const tailY = rect.top - sRect.top + rect.height * 0.4;

      if (tailX > 0 && tailX < width) {
        for (let i = 0; i < 3; i++) {
          particles.push(new GoldenEmber(tailX, tailY));
        }
      }
    }
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    checkBroomEmitter();

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw(ctx);
      if (particles[i].alpha <= 0) {
        particles.splice(i, 1);
      }
    }

    requestAnimationFrame(render);
  }

  render();
}
