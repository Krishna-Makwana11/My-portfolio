/* ==========================================================================
   INTERACTIVE MAGIC SPOTLIGHT / REVEAL LENS ENGINE
   ========================================================================== */

const HOUSE_IMAGES = {
  gryffindor: '/assets/house_gryffindor.png',
  slytherin: '/assets/house_slytherin.png',
  ravenclaw: '/assets/house_ravenclaw.png',
  hufflepuff: '/assets/house_hufflepuff.png',
};

// Preload house images for instant lag-free switching
Object.values(HOUSE_IMAGES).forEach((src) => {
  const img = new Image();
  img.src = src;
});

let currentHouse = 'gryffindor';

export function setSpotlightHouse(house) {
  currentHouse = house.toLowerCase();
  const wizardImg = document.getElementById('hero-wizard-img');
  if (wizardImg && HOUSE_IMAGES[currentHouse]) {
    wizardImg.style.opacity = '0.5';
    wizardImg.src = HOUSE_IMAGES[currentHouse];
    wizardImg.onload = () => {
      wizardImg.style.opacity = '1';
    };
  }
}

export function initSpotlightReveal() {
  const frame = document.getElementById('portrait-spotlight-frame');
  const revealLayer = document.getElementById('hero-spotlight-layer');
  const baseImg = document.getElementById('hero-base-img');
  const wizardImg = document.getElementById('hero-wizard-img');
  const lens = document.getElementById('spotlight-lens');
  const heroCard = document.getElementById('hero-sticky-card');

  if (!frame || !revealLayer || !baseImg) return;

  // Restore active house
  try {
    const savedHouse = localStorage.getItem('hp_house_theme') || 'gryffindor';
    setSpotlightHouse(savedHouse);
  } catch (err) {}

  // Alpha hit-test canvas (100x128 downsampled grid for ultra-fast, zero-lag O(1) hit testing)
  const hitCanvas = document.createElement('canvas');
  hitCanvas.width = 100;
  hitCanvas.height = 128;
  const hitCtx = hitCanvas.getContext('2d', { willReadFrequently: true });
  let alphaData = null;

  function updateHitMask() {
    if (!baseImg.complete || baseImg.naturalWidth === 0) return;
    try {
      hitCtx.clearRect(0, 0, 100, 128);
      hitCtx.drawImage(baseImg, 0, 0, 100, 128);
      alphaData = hitCtx.getImageData(0, 0, 100, 128).data;
    } catch (e) {
      console.warn('Alpha hit testing fallback enabled:', e);
    }
  }

  if (baseImg.complete) {
    updateHitMask();
  } else {
    baseImg.addEventListener('load', updateHitMask);
  }

  function isOverSilhouette(clientX, clientY) {
    const imgRect = baseImg.getBoundingClientRect();
    if (
      clientX < imgRect.left ||
      clientX > imgRect.right ||
      clientY < imgRect.top ||
      clientY > imgRect.bottom
    ) {
      return false;
    }

    if (!alphaData) return true; // Bounding box fallback while loading

    const normX = (clientX - imgRect.left) / imgRect.width;
    const normY = (clientY - imgRect.top) / imgRect.height;

    const sampleX = Math.max(0, Math.min(99, Math.floor(normX * 100)));
    const sampleY = Math.max(0, Math.min(127, Math.floor(normY * 128)));
    const alpha = alphaData[(sampleY * 100 + sampleX) * 4 + 3];

    // Alpha threshold of 25 strictly isolates the person's body/hair from empty background
    return alpha > 25;
  }

  let isHovering = false;
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  let rafId = null;

  const SPOTLIGHT_RADIUS = 135; // Pixel radius of magic reveal circle

  function updateCoordinates() {
    if (!isHovering) return;

    // Smooth lerp interpolation for silky motion
    mouseX += (targetX - mouseX) * 0.3;
    mouseY += (targetY - mouseY) * 0.3;

    frame.style.setProperty('--mouse-x', `${mouseX.toFixed(1)}px`);
    frame.style.setProperty('--mouse-y', `${mouseY.toFixed(1)}px`);

    rafId = requestAnimationFrame(updateCoordinates);
  }

  function showReveal(clientX, clientY) {
    const frameRect = frame.getBoundingClientRect();
    targetX = clientX - frameRect.left;
    targetY = clientY - frameRect.top;

    if (!isHovering) {
      isHovering = true;
      mouseX = targetX;
      mouseY = targetY;
      frame.style.setProperty('--mouse-x', `${mouseX.toFixed(1)}px`);
      frame.style.setProperty('--mouse-y', `${mouseY.toFixed(1)}px`);
      frame.style.setProperty('--spotlight-radius', `${SPOTLIGHT_RADIUS}px`);
      frame.style.setProperty('--reveal-opacity', '1');
      frame.style.setProperty('--reveal-scale', '1');
      rafId = requestAnimationFrame(updateCoordinates);
    }
  }

  function hideReveal() {
    if (isHovering) {
      isHovering = false;
      frame.style.setProperty('--reveal-opacity', '0');
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }
  }

  function handlePointer(e) {
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);

    if (clientX == null || clientY == null) {
      hideReveal();
      return;
    }

    if (isOverSilhouette(clientX, clientY)) {
      showReveal(clientX, clientY);
    } else {
      hideReveal();
    }
  }

  // Pointer & Mouse Events on hero card and portrait frame
  frame.addEventListener('mousemove', handlePointer, { passive: true });
  frame.addEventListener('mouseleave', hideReveal);
  frame.addEventListener('touchstart', handlePointer, { passive: true });
  frame.addEventListener('touchmove', handlePointer, { passive: true });
  frame.addEventListener('touchend', hideReveal);

  if (heroCard) {
    heroCard.addEventListener('mousemove', handlePointer, { passive: true });
    heroCard.addEventListener('mouseleave', hideReveal);
  }

  window.addEventListener('blur', hideReveal);
}
