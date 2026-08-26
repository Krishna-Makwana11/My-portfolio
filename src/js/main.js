/* ==========================================================================
   MAGICAL DEVELOPER PORTFOLIO - MASTER ENTRYPOINT
   ========================================================================== */

import { createIcons, icons } from 'lucide';
import { initWandCursor } from './wand-cursor.js';
import { initHeroAvatarInteraction } from './eye-tracker.js';
import { initHeroScrollAnimation } from './hero-scroll.js';
import { initSkillsConstellation } from './skills-constellation.js';
import { initHouseSwitcher } from './house-switcher.js';
import { initSpotlightReveal } from './spotlight-reveal.js';
import { initOwlPost } from './owl-post.js';
import { initBookOfSpells } from './book-of-spells.js';
import { magicalAudio } from './audio-synth.js';

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
