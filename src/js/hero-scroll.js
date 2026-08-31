/* ==========================================================================
   GSAP + SCROLLTRIGGER + LENIS CINEMATIC HERO SCROLL TRANSITION
   ========================================================================== */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/**
 * Dynamic Golden Ember Particle Trail Generator attached to Nimbus 2000 Bristles
 */
function initNimbusEmberTrail() {
  const canvas = document.getElementById('nimbus-ember-canvas');
  if (!canvas) return { start: () => {}, stop: () => {} };

  const ctx = canvas.getContext('2d');
  let animationFrameId = null;
  let particles = [];
  let isEmitting = false;

  class Ember {
    constructor() {
      this.reset();
    }

    reset() {
      // Emitter origin: near the right edge where broom bristle tail connects
      this.x = 360 + (Math.random() - 0.5) * 20;
      this.y = 75 + (Math.random() - 0.5) * 30;
      this.vx = -(Math.random() * 5 + 3.5); // High-speed stream leftwards
      this.vy = (Math.random() - 0.5) * 2.2;
      this.size = Math.random() * 2.8 + 1.2;
      this.alpha = Math.random() * 0.5 + 0.5;
      this.decay = Math.random() * 0.02 + 0.015;
      this.hue = Math.random() > 0.3 ? 42 : 28; // Gold to deep amber
      this.lightness = Math.random() * 25 + 60;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.04; // Gentle gravity
      this.vx *= 0.98; // Air drag
      this.alpha -= this.decay;
      this.size = Math.max(0, this.size - 0.025);
    }

    draw(ctx) {
      if (this.alpha <= 0 || this.size <= 0) return;
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 100%, ${this.lightness}%, ${this.alpha})`;
      ctx.shadowColor = `hsla(${this.hue}, 100%, 65%, 0.8)`;
      ctx.shadowBlur = this.size * 3;
      ctx.fill();
      ctx.restore();
    }
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isEmitting) {
      // Spawn new embers per frame
      for (let i = 0; i < 4; i++) {
        particles.push(new Ember());
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw(ctx);
      if (p.alpha <= 0 || p.x < 0) {
        particles.splice(i, 1);
      }
    }

    animationFrameId = requestAnimationFrame(loop);
  }

  loop();

  return {
    start: () => { isEmitting = true; },
    stop: () => { isEmitting = false; }
  };
}

export function initHeroScrollAnimation() {
  // 1. Initialize Lenis Smooth Scroll (Butter-smooth 60-120fps)
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.5,
  });

  window.lenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // 2. Setup DOM Elements
  const heroWrapper = document.getElementById('hero-pin-wrapper');
  const heroCard = document.getElementById('hero-sticky-card');
  const bgMarquee = document.getElementById('hero-bg-marquee');
  const nimbusBroom = document.getElementById('nimbus-broom');
  const signature = document.querySelector('.hero-bottom-left-signature');
  const orbitalWidget = document.querySelector('.social-orbital-widget');

  if (!heroWrapper || !heroCard) return;

  // Initialize Ember Particle Engine
  const emberTrail = initNimbusEmberTrail();

  // Helper function to restore clean top state
  const resetToHeroPristine = () => {
    gsap.set(heroCard, {
      scale: 1,
      xPercent: 0,
      yPercent: 0,
      rotation: 0,
      opacity: 1,
      borderRadius: '0px',
      borderColor: 'transparent',
      boxShadow: 'none',
      transformOrigin: 'center center',
      force3D: true
    });
    if (signature) gsap.set(signature, { opacity: 1, scale: 1, y: 0, xPercent: 0 });
    if (orbitalWidget) gsap.set(orbitalWidget, { opacity: 1, scale: 1, x: 0 });
    if (bgMarquee) gsap.set(bgMarquee, { opacity: 0.22, scale: 1, force3D: true });
    if (nimbusBroom) {
      gsap.set(nimbusBroom, { x: -450, y: 0, rotation: -8, opacity: 0, scale: 0.9, force3D: true });
      emberTrail.stop();
    }
  };

  resetToHeroPristine();

  // 3. Master GSAP ScrollTrigger Pinned Timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: heroWrapper,
      start: 'top top',
      end: '+=250%',
      pin: heroWrapper,
      pinSpacing: true,
      scrub: 1.2,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onLeaveBack: () => {
        resetToHeroPristine();
      },
      onEnterBack: () => {
        if (signature) gsap.to(signature, { opacity: 0.25, duration: 0.2 });
        if (orbitalWidget) gsap.to(orbitalWidget, { opacity: 0.25, duration: 0.2 });
        if (bgMarquee) gsap.to(bgMarquee, { opacity: 0.85, duration: 0.2 });
      }
    }
  });

  // =========================================================================
  // PHASE 1: Scale Down Hero Card & Reveal Background Dual-Line Marquee (0.0 -> 0.45)
  // =========================================================================
  tl.to(heroCard, {
    scale: 0.64,
    borderRadius: '36px',
    border: '1px solid rgba(245, 197, 66, 0.45)',
    boxShadow: '0 0 65px rgba(245, 197, 66, 0.25), 0 35px 95px rgba(0, 0, 0, 0.98)',
    ease: 'power2.out',
    duration: 0.45
  }, 0);

  if (signature) {
    tl.to(signature, {
      opacity: 0.25,
      scale: 0.88,
      y: -10,
      duration: 0.35,
      ease: 'power1.out'
    }, 0);
  }

  if (orbitalWidget) {
    tl.to(orbitalWidget, {
      opacity: 0.25,
      scale: 0.88,
      duration: 0.35,
      ease: 'power1.out'
    }, 0);
  }

  if (bgMarquee) {
    tl.to(bgMarquee, {
      opacity: 0.85,
      scale: 1,
      duration: 0.35,
      ease: 'power1.out'
    }, 0.05);
  }

  // =========================================================================
  // PHASE 2: Realistic Nimbus 2000 Flight Glide & Ember Trail (0.30 -> 0.72)
  // =========================================================================
  if (nimbusBroom) {
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1400;

    tl.call(() => { emberTrail.start(); }, null, 0.28);

    tl.to(nimbusBroom, {
      opacity: 1,
      duration: 0.08,
      ease: 'power1.in'
    }, 0.28);

    tl.to(nimbusBroom, {
      x: screenWidth + 480,
      y: -40,
      rotation: 9,
      scale: 1.15,
      duration: 0.48,
      ease: 'power1.inOut'
    }, 0.28);

    tl.to(nimbusBroom, {
      opacity: 0,
      duration: 0.08,
      ease: 'power1.out'
    }, 0.70);

    tl.call(() => { emberTrail.stop(); }, null, 0.72);
  }

  // =========================================================================
  // PHASE 3: Hero Section Swoop Exit & Next Page Reveal (0.65 -> 1.0)
  // =========================================================================
  tl.to(heroCard, {
    xPercent: -140,
    rotation: -5,
    scale: 0.52,
    opacity: 0,
    ease: 'power2.in',
    duration: 0.35
  }, 0.65);

  if (signature) {
    tl.to(signature, {
      opacity: 0,
      xPercent: -80,
      duration: 0.25,
      ease: 'power2.in'
    }, 0.65);
  }

  if (orbitalWidget) {
    tl.to(orbitalWidget, {
      opacity: 0,
      x: 80,
      duration: 0.25,
      ease: 'power2.in'
    }, 0.65);
  }

  if (bgMarquee) {
    tl.to(bgMarquee, {
      opacity: 0,
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.in'
    }, 0.70);
  }
}
