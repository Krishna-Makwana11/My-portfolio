/* ==========================================================================
   MAGICAL DEVELOPER PORTFOLIO - MASTER ENTRYPOINT
   ========================================================================== */

import { createIcons, icons } from 'lucide';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initWandCursor } from './wand-cursor.js';
import { initHeroAvatarInteraction } from './eye-tracker.js';
import { initHeroScrollAnimation } from './hero-scroll.js';
import { initSkillsConstellation } from './skills-constellation.js';
import { initHouseSwitcher } from './house-switcher.js';
import { initSpotlightReveal } from './spotlight-reveal.js';
import { initOwlPost } from './owl-post.js';
import { initBookOfSpells } from './book-of-spells.js';
import { magicalAudio } from './audio-synth.js';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  createIcons({ icons });

  // Initialize Core Magical Engines & GSAP Scroll
  initWandCursor();
  initHeroAvatarInteraction();
  initHeroScrollAnimation();
  initSkillsConstellation();
  initBookOfSpells();
  initHouseSwitcher();
  initSpotlightReveal();
  initOwlPost();

  // Initialize Dynamic Top-Left Header Button (Resume on Home / Home on Next Pages)
  initDynamicHeaderNav();

  // Navigation Scroll Blur Effect
  const nav = document.querySelector('.magical-nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }

  // Mobile Menu Toggle
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      magicalAudio.playWandSpell();
    });
  }

  // Instant Section Nav Links (Zero intermediate scrub animation)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      if (this.id === 'header-action-btn') return; // Handled by dynamic header nav
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        if (navLinks) navLinks.classList.remove('open');

        // Stop any active smooth scroll tweens
        gsap.killTweensOf(window);

        // Calibrate target position: "Projects" lands directly on "MY PROJECTS" title card
        let targetPos;
        if (targetId === '#projects') {
          const aboutEl = document.getElementById('about');
          const aboutST = typeof ScrollTrigger !== 'undefined'
            ? ScrollTrigger.getAll().find((st) => st.trigger === aboutEl)
            : null;

          if (aboutST) {
            // Keyframe (~0.82) where "MY PROJECTS - THE GRIMOIRE OF ENCHANTED WORKS" is at full opacity & centered
            targetPos = aboutST.start + 0.82 * (aboutST.end - aboutST.start);
          } else {
            const bridgeEl = document.getElementById('projects-bridge-container') || document.getElementById('projects');
            targetPos = bridgeEl ? (bridgeEl.getBoundingClientRect().top + window.pageYOffset) : targetEl.offsetTop;
          }
        } else {
          targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset;
        }

        // Instant teleport to destination without intermediate scrubbing
        if (window.lenis) {
          window.lenis.scrollTo(targetPos, { immediate: true });
        } else {
          window.scrollTo({ top: targetPos, behavior: 'instant' });
        }

        // Synchronize ScrollTrigger so target page state loads instantly
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }

        magicalAudio.playWandSpell();
      }
    });
  });
});

/**
 * Dynamic Top-Left Action Button:
 * - Shows "Resume" while on the 1st page (Hero section + pinned scroll animations)
 * - Only transitions to "Home" when landing on the 2nd page (#about - Skills & About section)
 * - Transitions back to "Resume" when scrolling back up to the 1st page
 */
function initDynamicHeaderNav() {
  const actionBtn = document.getElementById('header-action-btn');
  const iconWrap = document.getElementById('header-btn-icon');
  const textWrap = document.getElementById('header-btn-text');
  const aboutSection = document.getElementById('about');

  if (!actionBtn || !iconWrap || !textWrap) return;

  let currentMode = 'resume'; // 'resume' | 'home'
  let isUpdating = false;

  const updateButtonMode = (newMode) => {
    if (currentMode === newMode || isUpdating) return;
    currentMode = newMode;
    isUpdating = true;

    // Gentle micro-animation transition
    actionBtn.style.transform = 'scale(0.92)';
    actionBtn.style.opacity = '0.7';

    setTimeout(() => {
      const topRightNav = document.getElementById('top-right-nav');

      if (newMode === 'home') {
        actionBtn.setAttribute('href', '#hero-pin-wrapper');
        actionBtn.removeAttribute('target');
        actionBtn.removeAttribute('rel');
        actionBtn.setAttribute('aria-label', 'Home');
        actionBtn.setAttribute('title', 'Return to Top');
        actionBtn.classList.remove('is-resume');
        actionBtn.classList.add('is-home');

        iconWrap.innerHTML = '<img src="/assets/crests/hogwarts_crest.png" alt="Hogwarts Crest Logo" class="header-crest-img" />';
        textWrap.textContent = 'Home';

        // Switch Top-Right Nav to 4 Hogwarts Crests Theme Bar
        if (topRightNav) {
          topRightNav.classList.remove('is-full-nav');
          topRightNav.classList.add('is-crest-nav');
        }
      } else {
        actionBtn.setAttribute('href', '/assets/Krishna_Makwana_Resume.pdf');
        actionBtn.setAttribute('target', '_blank');
        actionBtn.setAttribute('rel', 'noopener noreferrer');
        actionBtn.setAttribute('aria-label', 'Resume');
        actionBtn.setAttribute('title', 'View / Download Resume');
        actionBtn.classList.remove('is-home');
        actionBtn.classList.add('is-resume');

        iconWrap.innerHTML = '<i data-lucide="file-text" style="width: 14px; height: 14px;"></i>';
        textWrap.textContent = 'Resume';

        // Switch Top-Right Nav to Full Navigation Bar
        if (topRightNav) {
          topRightNav.classList.remove('is-crest-nav');
          topRightNav.classList.add('is-full-nav');
        }
      }

      createIcons({ icons });

      actionBtn.style.transform = 'scale(1)';
      actionBtn.style.opacity = '1';
      isUpdating = false;
    }, 150);
  };

  // Bind to 2nd page entry via ScrollTrigger
  if (aboutSection) {
    ScrollTrigger.create({
      trigger: aboutSection,
      start: 'top 55%', // Triggers exactly when the 2nd page reaches view
      onEnter: () => updateButtonMode('home'),
      onLeaveBack: () => updateButtonMode('resume'),
    });
  }

  // Fallback real-time rect check on scroll
  const handleScroll = () => {
    const aboutEl = document.getElementById('about');
    if (aboutEl) {
      const rect = aboutEl.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.55) {
        updateButtonMode('home');
        return;
      }
    }
    updateButtonMode('resume');
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check on load

  // Click Handler for smooth interaction & Instant Clean Home Reset
  actionBtn.addEventListener('click', (e) => {
    if (currentMode === 'home') {
      e.preventDefault();
      magicalAudio.playWandSpell();

      // Get or create a seamless black transition veil
      let veil = document.getElementById('hp-instant-reset-veil');
      if (!veil) {
        veil = document.createElement('div');
        veil.id = 'hp-instant-reset-veil';
        veil.style.cssText = `
          position: fixed;
          inset: 0;
          background: #05060a;
          z-index: 999999;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        `;
        document.body.appendChild(veil);
      }

      // Step 1: Smoothly fade out the entire viewport to black (0.22s)
      requestAnimationFrame(() => {
        veil.style.opacity = '1';
      });

      // Step 2 & 3: While hidden, instantly jump to top & hard-reset timelines
      setTimeout(() => {
        if (window.lenis) {
          window.lenis.scrollTo(0, { immediate: true });
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

        // Hard-reset all ScrollTriggers & scrub animations to initial 0% state
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.getAll().forEach((st) => {
            if (st.animation) {
              st.animation.progress(0);
            }
          });
          ScrollTrigger.refresh();
        }

        // Reset nav states to 1st page
        updateButtonMode('resume');

        // Step 4: Smoothly fade viewport back in showing clean starting state
        setTimeout(() => {
          veil.style.opacity = '0';
        }, 50);
      }, 230);
    } else {
      magicalAudio.playWandSpell();
    }
  });
}
