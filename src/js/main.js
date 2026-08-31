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

  // Smooth Section Nav Links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      if (this.id === 'header-action-btn') return; // Handled by dynamic header nav
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        if (navLinks) navLinks.classList.remove('open');
        targetEl.scrollIntoView({ behavior: 'smooth' });
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

  // Click Handler for smooth interaction
  actionBtn.addEventListener('click', (e) => {
    if (currentMode === 'home') {
      e.preventDefault();
      const heroWrapper = document.getElementById('hero-pin-wrapper');
      if (heroWrapper) {
        heroWrapper.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      magicalAudio.playWandSpell();
    } else {
      magicalAudio.playWandSpell();
    }
  });
}
