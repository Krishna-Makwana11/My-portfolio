/* ==========================================================================
   HARRY POTTER MAGICAL AUDIO & BACKGROUND MUSIC ENGINE
   Plays Hedwig's Theme continuously in loop across the entire portfolio
   with smooth fading, autoplay unlock, and procedural sound FX
   ========================================================================== */

import confetti from 'canvas-confetti';

class MagicalAudioEngine {
  constructor() {
    this.ctx = null;
    this.bgMusic = null;
    this.targetVolume = 0.38;
    this.isMusicPlaying = false;
    this.isMuted = false;
    this.fadeInterval = null;
    this.hasUnlockedAutoplay = false;

    // Always start with music ENABLED by default for every visitor and every new tab visit
    try {
      localStorage.removeItem('hp_music_muted');
      sessionStorage.removeItem('hp_music_muted');
    } catch (e) {}

    this.isMuted = false;
    this.isMusicPlaying = false;
    this.hasUnlockedAutoplay = false;

    this.initAudioElements();
    this.initAutoplayUnlock();

    if (typeof document !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          this.bindControls();
          this.attemptPlay();
        });
      } else {
        setTimeout(() => {
          this.bindControls();
          this.attemptPlay();
        }, 0);
      }
    }
  }

  initAudioElements() {
    try {
      const domAudio = typeof document !== 'undefined' ? document.getElementById('hp-bg-music') : null;
      if (domAudio) {
        this.bgMusic = domAudio;
      } else if (!this.bgMusic) {
        this.bgMusic = new Audio('/audio/hedwig-theme.mp3');
      }

      this.bgMusic.loop = true;
      this.bgMusic.preload = 'auto';
      this.bgMusic.volume = this.targetVolume;

      // Fail-safe loop fallback in case native loop triggers glitch
      this.bgMusic.addEventListener('ended', () => {
        if (!this.isMuted) {
          this.bgMusic.currentTime = 0;
          this.bgMusic.play().catch(() => {});
        }
      });

      this.bgMusic.addEventListener('play', () => {
        this.isMusicPlaying = true;
        this.updateUI();
      });

      this.bgMusic.addEventListener('pause', () => {
        this.isMusicPlaying = false;
        this.updateUI();
      });
    } catch (err) {
      console.warn('Background audio initialization error:', err);
    }
  }

  initAudioContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  attemptPlay() {
    if (this.isMuted || !this.bgMusic) return;
    this.playMusic(true);
  }

  initAutoplayUnlock() {
    // Universal micro-activity triggers (movement, hover, scroll, touch, keys, focus)
    const unlockEvents = [
      'pointermove',
      'mousemove',
      'mouseenter',
      'mouseover',
      'wheel',
      'scroll',
      'pointerdown',
      'mousedown',
      'touchstart',
      'touchend',
      'click',
      'keydown',
      'keyup',
      'focus',
      'visibilitychange'
    ];

    let retryInterval = null;

    const tryStartAudio = () => {
      if (this.isMuted) return;

      this.initAudioContext();

      if (this.bgMusic) {
        if (!this.bgMusic.paused && this.isMusicPlaying) {
          cleanup();
          return;
        }

        const playPromise = this.bgMusic.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              this.isMusicPlaying = true;
              this.hasUnlockedAutoplay = true;
              this.fadeAudioTo(this.targetVolume, 600);
              this.updateUI();
              cleanup();
            })
            .catch(() => {
              // Awaiting next micro-movement or browser activation
            });
        }
      }
    };

    const cleanup = () => {
      if (retryInterval) clearInterval(retryInterval);
      unlockEvents.forEach((evt) => {
        window.removeEventListener(evt, tryStartAudio, { capture: true });
        document.removeEventListener(evt, tryStartAudio, { capture: true });
      });
    };

    // Listen on both window and document for any initial micro-action
    unlockEvents.forEach((evt) => {
      window.addEventListener(evt, tryStartAudio, { capture: true, passive: true });
      document.addEventListener(evt, tryStartAudio, { capture: true, passive: true });
    });

    // Immediate attempt on execution
    tryStartAudio();

    // Auto-retry polling loop every 200ms
    let attempts = 0;
    retryInterval = setInterval(() => {
      attempts++;
      if (this.isMusicPlaying || this.isMuted || attempts > 25) {
        clearInterval(retryInterval);
        return;
      }
      tryStartAudio();
    }, 200);

    // Also attempt when DOM and Window are fully loaded
    if (typeof window !== 'undefined') {
      window.addEventListener('load', tryStartAudio, { once: true });
    }
  }

  bindControls() {
    const audioBtns = document.querySelectorAll(
      '#btn-toggle-audio, #btn-toggle-audio-crests, .top-nav-audio-btn, .nav-audio-crest-btn, .btn-magic-audio'
    );
    audioBtns.forEach((btn) => {
      if (!btn.dataset.audioBound) {
        btn.dataset.audioBound = 'true';
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleMusic();
        });
      }
    });

    // Bind Cinematic "Enter Hogwarts / Cast Alohomora" Opening Portal
    const enterPortal = document.getElementById('hp-enter-portal');
    const alohomoraBtn = document.getElementById('hp-btn-alohomora');

    const unlockAndEnter = () => {
      if (!enterPortal || enterPortal.dataset.opened === 'true') return;
      enterPortal.dataset.opened = 'true';

      // 1. Awaken background music in loop
      this.playMusic(true);

      // 2. Play mystical opening chords & lumos chime
      this.playHedwigChime();
      this.playLumosSparkle();

      // 3. Golden snitch magical sparkle burst
      try {
        confetti({
          particleCount: 90,
          spread: 90,
          origin: { y: 0.5, x: 0.5 },
          colors: ['#facc15', '#fef08a', '#d4af37', '#ffffff']
        });
      } catch (e) {}

      // 4. Smooth cinematic portal dissolve
      enterPortal.classList.add('portal-dissolved');
      setTimeout(() => {
        enterPortal.style.display = 'none';
      }, 850);
    };

    if (alohomoraBtn && !alohomoraBtn.dataset.bound) {
      alohomoraBtn.dataset.bound = 'true';
      alohomoraBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        unlockAndEnter();
      });
    }

    if (enterPortal && !enterPortal.dataset.bound) {
      enterPortal.dataset.bound = 'true';
      enterPortal.addEventListener('click', () => {
        unlockAndEnter();
      });
    }

    // Keyboard support: Press Enter or Space to cast spell
    window.addEventListener('keydown', (e) => {
      if (enterPortal && enterPortal.dataset.opened !== 'true' && enterPortal.style.display !== 'none') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          unlockAndEnter();
        }
      }
    });

    this.updateUI();
  }

  playMusic(withFade = true) {
    this.initAudioElements();
    if (!this.bgMusic) return;
    this.initAudioContext();
    this.isMuted = false;

    if (this.fadeInterval) clearInterval(this.fadeInterval);

    if (withFade) {
      if (this.bgMusic.paused) {
        this.bgMusic.volume = 0;
        const playPromise = this.bgMusic.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              this.isMusicPlaying = true;
              this.hasUnlockedAutoplay = true;
              this.fadeAudioTo(this.targetVolume, 800);
              this.updateUI();
            })
            .catch((e) => {
              // Browser requires user gesture; will trigger on first interaction
            });
        }
      } else {
        this.isMusicPlaying = true;
        this.fadeAudioTo(this.targetVolume, 500);
        this.updateUI();
      }
    } else {
      this.bgMusic.volume = this.targetVolume;
      const playPromise = this.bgMusic.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isMusicPlaying = true;
            this.hasUnlockedAutoplay = true;
            this.updateUI();
          })
          .catch(() => {});
      }
    }
    this.updateUI();
  }

  pauseMusic(withFade = true) {
    if (!this.bgMusic) return;

    if (this.fadeInterval) clearInterval(this.fadeInterval);

    if (withFade && this.bgMusic.volume > 0.05) {
      this.fadeAudioTo(0, 400, () => {
        this.bgMusic.pause();
        this.isMusicPlaying = false;
        this.updateUI();
      });
    } else {
      this.bgMusic.pause();
      this.isMusicPlaying = false;
      this.updateUI();
    }
  }

  fadeAudioTo(targetVol, durationMs = 500, callback = null) {
    if (!this.bgMusic) return;
    if (this.fadeInterval) clearInterval(this.fadeInterval);

    const steps = 20;
    const interval = durationMs / steps;
    const startVol = this.bgMusic.volume;
    const diff = targetVol - startVol;
    let stepCount = 0;

    this.fadeInterval = setInterval(() => {
      stepCount++;
      const current = Math.min(1, Math.max(0, startVol + diff * (stepCount / steps)));
      this.bgMusic.volume = current;

      if (stepCount >= steps) {
        clearInterval(this.fadeInterval);
        this.bgMusic.volume = targetVol;
        if (callback) callback();
      }
    }, interval);
  }

  toggleMusic() {
    this.initAudioContext();
    this.hasUnlockedAutoplay = true;

    if (this.isMusicPlaying && !this.isMuted) {
      this.isMuted = true;
      this.pauseMusic(true);
    } else {
      this.isMuted = false;
      this.playMusic(true);
    }

    this.updateUI();
    return !this.isMuted;
  }

  toggleSound() {
    return this.toggleMusic();
  }

  setVolume(volume) {
    this.targetVolume = Math.max(0, Math.min(1, volume));
    if (this.bgMusic && !this.isMuted) {
      this.bgMusic.volume = this.targetVolume;
    }
  }

  updateUI() {
    // Music is enabled by default unless explicitly muted by the user in this session
    const isEnabled = !this.isMuted;
    const isActuallyPlaying = this.isMusicPlaying && !this.isMuted;

    // Update all audio toggle buttons across the DOM
    const audioBtns = document.querySelectorAll(
      '#btn-toggle-audio, #btn-toggle-audio-crests, .top-nav-audio-btn, .nav-audio-crest-btn, .btn-magic-audio'
    );

    audioBtns.forEach((btn) => {
      btn.classList.toggle('is-playing', isEnabled);
      btn.classList.toggle('active', isEnabled);
      btn.classList.toggle('is-muted', !isEnabled);
      btn.setAttribute('aria-pressed', isEnabled ? 'true' : 'false');
      btn.title = isEnabled ? "Pause Hedwig's Theme (Looping)" : "Play Hedwig's Theme (Sound Muted)";
    });

    // Update equalizer animation wave elements
    const waveBars = document.querySelectorAll('.audio-wave-bar, .wave-bar');
    waveBars.forEach((bar) => {
      bar.classList.toggle('animating', isActuallyPlaying);
    });

    // If audio is confirmed playing, ensure the entry portal dissolves seamlessly
    const enterPortal = document.getElementById('hp-enter-portal');
    if (enterPortal && isActuallyPlaying && enterPortal.dataset.opened !== 'true') {
      enterPortal.dataset.opened = 'true';
      enterPortal.classList.add('portal-dissolved');
      setTimeout(() => {
        enterPortal.style.display = 'none';
      }, 850);
    }

    // Update status text
    const statusTexts = document.querySelectorAll('.audio-status-text');
    statusTexts.forEach((el) => {
      el.textContent = isActuallyPlaying ? 'Playing in Loop' : (isEnabled ? 'Ready' : 'Music Paused');
    });

    // Dispatch global event for custom components
    document.dispatchEvent(
      new CustomEvent('hp_audio_state_changed', {
        detail: { isPlaying: isActuallyPlaying, isMuted: this.isMuted, volume: this.targetVolume }
      })
    );
  }

  /* --------------------------------------------------------------------------
     PROCEDURAL WEB AUDIO SFX (Wand Spells, Chimes, Lumos, Cauldron)
     -------------------------------------------------------------------------- */

  // Mystical Hedwig chime chord
  playHedwigChime() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const freqs = [493.88, 659.25, 783.99, 739.99, 987.77];

      freqs.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.16);

        gain.gain.setValueAtTime(0, now + idx * 0.16);
        gain.gain.linearRampToValueAtTime(0.06, now + idx * 0.16 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.16 + 0.85);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.16);
        osc.stop(now + idx * 0.16 + 0.95);
      });
    } catch (e) {}
  }

  // Wand Whoosh / Spell Cast (Click Effect Sound - Silenced per user preference)
  playWandSpell() {
    // Click sound effect removed; keeping safe signature for any callers
    return;
  }

  // Hover chime fallback
  playHoverChime() {
    return;
  }

  // Cauldron Bubble & Rune Resonance
  playCauldronBubble() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320 + Math.random() * 180, now);
      osc.frequency.exponentialRampToValueAtTime(580 + Math.random() * 180, now + 0.14);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.14);
    } catch (e) {}
  }

  // Lumos Spell Hum
  playLumosSparkle() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1100, now);
      osc.frequency.exponentialRampToValueAtTime(2200, now + 0.3);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {}
  }
}

export const magicalAudio = new MagicalAudioEngine();
