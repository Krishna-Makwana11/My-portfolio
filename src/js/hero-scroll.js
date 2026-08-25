/* ==========================================================================
   GSAP + SCROLLTRIGGER + LENIS CINEMATIC HERO SCROLL TRANSITION
   ========================================================================== */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export function initHeroScrollAnimation() {
  // 1. Initialize Lenis Smooth Scroll with 60-120fps high performance
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

  // 2. Setup DOM Elements
  const heroWrapper = document.getElementById('hero-pin-wrapper');
  const heroCard = document.getElementById('hero-sticky-card');
  const bgMarquee = document.getElementById('hero-bg-marquee');
  const marqueeTrack1 = document.getElementById('marquee-track-1');
  const marqueeTrack2 = document.getElementById('marquee-track-2');
  const nimbusBroom = document.getElementById('nimbus-broom');
  const signature = document.querySelector('.hero-bottom-left-signature');
  const orbitalWidget = document.querySelector('.social-orbital-widget');

  if (!heroWrapper || !heroCard) return;

  // Set pristine initial state at scroll = 0 (100% full screen)
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

  if (bgMarquee) {
    gsap.set(bgMarquee, { opacity: 0, scale: 0.95, force3D: true });
  }

  if (nimbusBroom) {
    gsap.set(nimbusBroom, {
      x: -350,
      y: 0,
      rotation: -10,
      opacity: 0,
      scale: 0.9,
      force3D: true
    });
  }

  // 3. Master GSAP ScrollTrigger Pinned Timeline (250% scroll duration, smooth scrub)
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: heroWrapper,
      start: 'top top',
      end: '+=250%',
      pin: heroWrapper,
      pinSpacing: true,
      scrub: 1.2,
      anticipatePin: 1,
      invalidateOnRefresh: true
    }
  });

  // =========================================================================
  // PHASE 1: Scale Down Hero Card & Reveal Background Typographic Marquee
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
      opacity: 0.2,
      scale: 0.88,
      y: -10,
      duration: 0.35,
      ease: 'power1.out'
    }, 0);
  }

  if (orbitalWidget) {
    tl.to(orbitalWidget, {
      opacity: 0.2,
      scale: 0.88,
      duration: 0.35,
      ease: 'power1.out'
    }, 0);
  }

  if (bgMarquee) {
    tl.to(bgMarquee, {
      opacity: 1,
      scale: 1,
      duration: 0.35,
      ease: 'power1.out'
    }, 0.05);

    if (marqueeTrack1) {
      tl.to(marqueeTrack1, {
        x: '-25%',
        duration: 1,
        ease: 'none'
      }, 0);
    }

    if (marqueeTrack2) {
      tl.to(marqueeTrack2, {
        x: '25%',
        duration: 1,
        ease: 'none'
      }, 0);
    }
  }

  // =========================================================================
  // PHASE 2: Animated Nimbus Flying Broom Glide with Physics & Sparks
  // =========================================================================
  if (nimbusBroom) {
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1400;

    tl.to(nimbusBroom, {
      opacity: 1,
      duration: 0.08,
      ease: 'power1.in'
    }, 0.30);

    tl.to(nimbusBroom, {
      x: screenWidth + 400,
      y: -50,
      rotation: 8,
      scale: 1.15,
      duration: 0.48,
      ease: 'power1.inOut'
    }, 0.30);

    tl.to(nimbusBroom, {
      opacity: 0,
      duration: 0.08,
      ease: 'power1.out'
    }, 0.72);
  }

  // =========================================================================
  // PHASE 3: Hero Section Swoop Exit & Next Page Reveal
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
