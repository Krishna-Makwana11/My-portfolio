/* ==========================================================================
   GSAP + SCROLLTRIGGER + LENIS PINNED HERO SCALE TRANSITION
   ========================================================================== */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export function initHeroScrollAnimation() {
  // 1. Initialize Lenis Smooth Scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.5,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // 2. Setup Elements
  const heroWrapper = document.getElementById('hero-pin-wrapper');
  const heroCard = document.getElementById('hero-sticky-card');

  if (!heroWrapper || !heroCard) return;

  // Set pristine initial state at scroll = 0 (100% full screen)
  gsap.set(heroCard, { 
    scale: 1, 
    borderRadius: '0px', 
    borderColor: 'transparent',
    boxShadow: 'none'
  });

  // 3. GSAP ScrollTrigger Pinned Zoom-Out Timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: heroWrapper,
      start: 'top top',
      end: '+=120%',
      pin: heroCard,
      pinSpacing: true,
      scrub: 1,
      anticipatePin: 1
    }
  });

  // Hero Card Smooth Zoom-Out & Border Glow Transition
  tl.to(heroCard, {
    scale: 0.88,
    borderRadius: '32px',
    borderColor: 'rgba(245, 197, 66, 0.4)',
    boxShadow: '0 0 60px rgba(245, 197, 66, 0.2), 0 35px 95px rgba(0, 0, 0, 0.98)',
    ease: 'power1.out',
    duration: 1
  }, 0);

  const introCard = document.querySelector('.hero-intro-card');
  if (introCard) {
    tl.to(introCard, {
      opacity: 0.25,
      y: -20,
      duration: 0.7
    }, 0);
  }
}
