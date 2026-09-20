/* ==========================================================================
   HEDWIG'S OWL POST DISPATCH ENGINE (WIRED TO VERCEL SERVERLESS FUNCTION)
   ========================================================================== */

import { magicalAudio } from './audio-synth.js';
import confetti from 'canvas-confetti';

export function initOwlPost() {
  const form = document.getElementById('owl-post-form');
  const successBox = document.getElementById('owl-success-msg');
  const errorBox = document.getElementById('owl-error-msg');
  const submitBtn = document.getElementById('btn-dispatch');
  const submitBtnText = document.getElementById('btn-dispatch-text');
  const inputs = form ? form.querySelectorAll('input, textarea') : [];

  if (!form) return;

  // Typing sound / quill feedback
  inputs.forEach((input) => {
    input.addEventListener('focus', () => {
      magicalAudio.playCauldronBubble();
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Reset error state
    if (errorBox) {
      errorBox.textContent = '';
      errorBox.classList.remove('show');
    }

    // Extract form fields
    const nameInput = document.getElementById('sender-name');
    const emailInput = document.getElementById('sender-email');
    const subjectInput = document.getElementById('sender-subject');
    const messageInput = document.getElementById('sender-message');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const subject = subjectInput ? subjectInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !email || !message) {
      if (errorBox) {
        errorBox.textContent = 'Please fill out all required fields before dispatching.';
        errorBox.classList.add('show');
      }
      return;
    }

    // Loading State
    if (submitBtn) submitBtn.disabled = true;
    if (submitBtnText) submitBtnText.textContent = 'DISPATCHING...';

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ name, email, subject, message })
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok && result.success) {
        // Play magical chime sound
        magicalAudio.playHedwigChime();

        // Celebratory golden snitch confetti burst
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#f5c542', '#fbbf24', '#ffffff', '#8b181b', '#10b981']
        });

        // Show success confirmation overlay and hide form
        if (successBox) {
          successBox.classList.add('show');
          form.style.display = 'none';
        }
      } else {
        // Error returned from server
        const errorMessage = result.error || 'Failed to dispatch email. Please check your network or try again.';
        if (errorBox) {
          errorBox.textContent = errorMessage;
          errorBox.classList.add('show');
        }
      }
    } catch (err) {
      console.error('Contact Form Dispatch Error:', err);
      if (errorBox) {
        errorBox.textContent = 'Network error while dispatching message. Please try again.';
        errorBox.classList.add('show');
      }
    } finally {
      // Restore Button State if form is still visible
      if (form.style.display !== 'none') {
        if (submitBtn) submitBtn.disabled = false;
        if (submitBtnText) submitBtnText.textContent = 'Dispatch';
      }
    }
  });
}
