/* ==========================================================================
   HARRY POTTER MAGICAL AUDIO & BACKGROUND MUSIC ENGINE
   Plays Hedwig's Theme continuously in loop across the entire portfolio
   with smooth fading, autoplay unlock, and procedural sound FX
   ========================================================================== */

class MagicalAudioEngine {
  constructor() {
    this.ctx = null;
    this.bgMusic = null;
    this.targetVolume = 0.38;
    this.isMusicPlaying = false;
    this.isMuted = false;
    this.fadeInterval = null;
    this.hasUnlockedAutoplay = false;

    // Load user preference (default: enabled)
    try {
      const saved = localStorage.getItem('hp_music_muted');
      this.isMuted = saved === 'true';
    } catch (e) {
      this.isMuted = false;
    }

    this.initAudioElements();
    this.initAutoplayUnlock();

    if (typeof document !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.bindControls());
      } else {
        setTimeout(() => this.bindControls(), 0);
      }
    }
  }

  initAudioElements() {
    try {
      this.bgMusic = new Audio('/audio/hedwig-theme.mp3');
      this.bgMusic.loop = true;
      this.bgMusic.preload = 'auto';
      this.bgMusic.volume = this.isMuted ? 0 : this.targetVolume;

      // Fail-safe loop fallback in case native loop triggers glitch
      this.bgMusic.addEventListener('ended', () => {
        if (this.isMusicPlaying && !this.isMuted) {
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

  initAutoplayUnlock() {
    const startAudio = () => {
      if (this.hasUnlockedAutoplay) return;
      this.hasUnlockedAutoplay = true;

      this.initAudioContext();

      if (!this.isMuted && this.bgMusic) {
        this.playMusic(true);
      }

      // Cleanup unlock listeners
      unlockEvents.forEach((evt) => {
        window.removeEventListener(evt, startAudio, { capture: true });
        document.removeEventListener(evt, startAudio, { capture: true });
      });
    };

    const unlockEvents = ['click', 'pointerdown', 'keydown', 'scroll', 'touchstart', 'wheel'];

    // Try immediate autoplay first (some browsers allow if user visited recently)
    if (!this.isMuted && this.bgMusic) {
      const playPromise = this.bgMusic.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isMusicPlaying = true;
            this.hasUnlockedAutoplay = true;
            this.updateUI();
          })
          .catch(() => {
            // Autoplay policy prevented immediate playback; wait for first interaction
            unlockEvents.forEach((evt) => {
              window.addEventListener(evt, startAudio, { capture: true, once: true, passive: true });
              document.addEventListener(evt, startAudio, { capture: true, once: true, passive: true });
            });
          });
      }
    } else {
      unlockEvents.forEach((evt) => {
        window.addEventListener(evt, startAudio, { capture: true, once: true, passive: true });
        document.addEventListener(evt, startAudio, { capture: true, once: true, passive: true });
      });
    }
  }

  bindControls() {
    const audioBtns = document.querySelectorAll(
      '#btn-toggle-audio, #btn-floating-audio, .top-nav-audio-btn, .audio-hud-btn, .btn-magic-audio'
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
    this.updateUI();
  }

  playMusic(withFade = true) {
    if (!this.bgMusic) return;
    this.initAudioContext();

    if (this.fadeInterval) clearInterval(this.fadeInterval);

    if (withFade) {
      this.bgMusic.volume = 0;
      const playPromise = this.bgMusic.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isMusicPlaying = true;
            this.fadeAudioTo(this.targetVolume, 800);
            this.updateUI();
          })
          .catch((e) => {
            console.log('Audio playback pending user gesture:', e.message);
          });
      }
    } else {
      this.bgMusic.volume = this.targetVolume;
      this.bgMusic.play().catch(() => {});
      this.isMusicPlaying = true;
      this.updateUI();
    }
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

    if (this.isMusicPlaying) {
      this.isMuted = true;
      this.pauseMusic(true);
    } else {
      this.isMuted = false;
      this.playMusic(true);
    }

    try {
      localStorage.setItem('hp_music_muted', this.isMuted ? 'true' : 'false');
    } catch (e) {}

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
    const isPlaying = this.isMusicPlaying && !this.isMuted;

    // Update all audio toggle buttons across the DOM
    const audioBtns = document.querySelectorAll(
      '#btn-toggle-audio, #btn-floating-audio, .top-nav-audio-btn, .audio-hud-btn, .btn-magic-audio'
    );

    audioBtns.forEach((btn) => {
      btn.classList.toggle('is-playing', isPlaying);
      btn.classList.toggle('active', isPlaying);
      btn.classList.toggle('is-muted', !isPlaying);
      btn.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
      btn.title = isPlaying ? "Pause Hedwig's Theme (Looping)" : "Play Hedwig's Theme (Sound Muted)";
    });

    // Update equalizer animation wave elements
    const waveBars = document.querySelectorAll('.audio-wave-bar, .wave-bar');
    waveBars.forEach((bar) => {
      bar.classList.toggle('animating', isPlaying);
    });

    // Update status text
    const statusTexts = document.querySelectorAll('.audio-status-text');
    statusTexts.forEach((el) => {
      el.textContent = isPlaying ? 'Playing in Loop' : 'Music Paused';
    });

    // Dispatch global event for custom components
    document.dispatchEvent(
      new CustomEvent('hp_audio_state_changed', {
        detail: { isPlaying, isMuted: this.isMuted, volume: this.targetVolume }
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
