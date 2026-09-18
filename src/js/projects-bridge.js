/* ==========================================================================
   INTERMEDIATE SCROLL-TRIGGERED TRANSITION BANNER: "MY PROJECTS"
   Pinned GSAP ScrollTrigger Sequence between Section 2 (Skills) and Section 3 (Spellbook)
   Strictly separated from 3D Spellbook entrance (Zero visual overlap)
   ========================================================================== */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initProjectsBridgeTransition() {
  const bridgeSection = document.getElementById('projects-bridge-banner');
  const bridgeContainer = document.getElementById('projects-bridge-container');
  const bridgeGlow = document.getElementById('projects-bridge-glow');
  const wordMy = document.getElementById('bridge-word-my');
  const wordProjects = document.getElementById('bridge-word-projects');
  const subline = document.getElementById('bridge-word-subline');
  const bridgeContent = document.getElementById('projects-bridge-content');

  if (!bridgeSection || !bridgeContainer || !wordMy || !wordProjects) return;

  // Helper function to restore clean pristine starting state
  const resetBridgePristine = () => {
    gsap.set(bridgeContainer, {
      visibility: 'visible',
      pointerEvents: 'none'
    });
    gsap.set(wordMy, {
      opacity: 0,
      y: 25,
      letterSpacing: '0.10em',
      filter: 'blur(8px)',
      force3D: true
    });
    gsap.set(wordProjects, {
      opacity: 0,
      y: 25,
      letterSpacing: '0.10em',
      filter: 'blur(8px)',
      force3D: true
    });
    if (subline) {
      gsap.set(subline, {
        opacity: 0,
        y: 15,
        letterSpacing: '0.15em',
        filter: 'blur(4px)',
        force3D: true
      });
    }
    if (bridgeGlow) {
      gsap.set(bridgeGlow, {
        opacity: 0,
        scale: 0.82,
        force3D: true
      });
    }
    if (bridgeContent) {
      gsap.set(bridgeContent, {
        y: 0,
        opacity: 1,
        filter: 'none',
        force3D: true
      });
    }
  };

  resetBridgePristine();

  // Master GSAP ScrollTrigger Pinned Timeline (Dedicated +=1400 interval for Phase A)
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: bridgeSection,
      start: 'top top',
      end: '+=1400',
      pin: bridgeContainer,
      pinSpacing: true,
      scrub: 1.2,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onLeave: () => {
        // Guarantee 100% unmounted/hidden state when scrolling past Phase A
        if (bridgeContainer) {
          bridgeContainer.style.visibility = 'hidden';
          bridgeContainer.style.pointerEvents = 'none';
        }
      },
      onEnterBack: () => {
        if (bridgeContainer) {
          bridgeContainer.style.visibility = 'visible';
        }
      },
      onLeaveBack: () => {
        resetBridgePristine();
      }
    }
  });

  // =========================================================================
  // PHASE A1: Staggered Word-by-Word Reveal & Tracking Expansion (0.00 -> 0.38)
  // Exact matching cadence and visual elegance as Home Intro Reveal
  // =========================================================================

  // Ambient Magical Radial Glow Pulses Up
  if (bridgeGlow) {
    tl.to(bridgeGlow, {
      opacity: 0.85,
      scale: 1.15,
      duration: 0.30,
      ease: 'power2.out'
    }, 0.04);
  }

  // Word 1: "MY" Smooth Fade-in + Tracking Expansion (0.04 -> 0.28)
  tl.to(wordMy, {
    opacity: 1,
    y: 0,
    letterSpacing: '0.25em',
    filter: 'blur(0px)',
    duration: 0.24,
    ease: 'power2.out'
  }, 0.04);

  // Word 2: "PROJECTS" Follows Immediately with Same Cadence (0.14 -> 0.36)
  tl.to(wordProjects, {
    opacity: 1,
    y: 0,
    letterSpacing: '0.22em',
    filter: 'blur(0px)',
    duration: 0.24,
    ease: 'power2.out'
  }, 0.14);

  // Elegant Subline Tagline Stagger (0.20 -> 0.40)
  if (subline) {
    tl.to(subline, {
      opacity: 1,
      y: 0,
      letterSpacing: '0.28em',
      filter: 'blur(0px)',
      duration: 0.20,
      ease: 'power2.out'
    }, 0.20);
  }

  // =========================================================================
  // PHASE A2: Plateau & Showcase Stage (0.38 -> 0.65)
  // Clean, glowing title presentation before Section 3 takes center stage
  // =========================================================================
  if (bridgeGlow) {
    tl.to(bridgeGlow, {
      scale: 1.25,
      duration: 0.25,
      ease: 'sine.inOut'
    }, 0.38);
  }

  // =========================================================================
  // PHASE A3: Complete Upward Glide & Exit Fade (0.65 -> 0.92)
  // "MY PROJECTS" glides upward (y: -60px, opacity: 1 -> 0) and unmounts
  // Completely finishes before Phase B (Spellbook Entrance) begins!
  // =========================================================================
  tl.to(wordMy, {
    y: -60,
    opacity: 0,
    letterSpacing: '0.30em',
    filter: 'blur(10px)',
    duration: 0.24,
    ease: 'power2.in'
  }, 0.65);

  tl.to(wordProjects, {
    y: -60,
    opacity: 0,
    letterSpacing: '0.28em',
    filter: 'blur(10px)',
    duration: 0.24,
    ease: 'power2.in'
  }, 0.68);

  if (subline) {
    tl.to(subline, {
      y: -40,
      opacity: 0,
      filter: 'blur(6px)',
      duration: 0.20,
      ease: 'power2.in'
    }, 0.66);
  }

  if (bridgeGlow) {
    tl.to(bridgeGlow, {
      opacity: 0,
      scale: 1.45,
      duration: 0.24,
      ease: 'power2.in'
    }, 0.68);
  }
}
