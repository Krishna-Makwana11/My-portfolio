/* ==========================================================================
   PART 3: ABOUT & SKILLS - 3D GOLDEN SNITCH & STATEMENT SWAP
   ========================================================================== */

import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { magicalAudio } from './audio-synth.js';

gsap.registerPlugin(ScrollTrigger);

// 10 Exact Skills requested
const outerSkills = ['React', 'Next.js', 'JavaScript', 'Git', 'Python'];
const innerSkills = ['SQL', 'PowerBI', 'Excel', 'C++', 'Machine Learning'];

/**
 * Procedural Engraved Gold Seam Bump Map Generator for the Snitch Sphere
 */
function createSnitchBumpMap() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Base metallic fill
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 512, 512);

  // Engraved curved swirl seams
  ctx.strokeStyle = '#202020';
  ctx.lineWidth = 6;

  // Equator seam groove
  ctx.beginPath();
  ctx.moveTo(0, 256);
  ctx.lineTo(512, 256);
  ctx.stroke();

  // Swirl arcs (Matching movie Golden Snitch relief)
  ctx.beginPath();
  ctx.arc(128, 256, 90, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(384, 256, 90, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(256, 128, 70, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(256, 384, 70, 0, Math.PI * 2);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Build a single high-fidelity Feathered Golden Wing (Matching Reference Photo)
 * Consists of a curved spine and 24 individual sculpted feather vanes
 */
function createFeatheredWing(isRight = false) {
  const wingGroup = new THREE.Group();

  const goldWingMat = new THREE.MeshStandardMaterial({
    color: 0xfae070,
    metalness: 0.94,
    roughness: 0.18,
    side: THREE.DoubleSide
  });

  const mirror = isRight ? 1 : -1;

  // 1. Curved Central Wing Spine / Quill
  const curvePoints = [];
  const totalLength = 2.4;
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    const x = mirror * (t * totalLength * 0.85);
    const y = Math.pow(t, 0.7) * 2.2;
    const z = Math.sin(t * Math.PI) * 0.25;
    curvePoints.push(new THREE.Vector3(x, y, z));
  }
  const curve = new THREE.CatmullRomCurve3(curvePoints);
  const spineGeo = new THREE.TubeGeometry(curve, 32, 0.028, 8, false);
  const spineMesh = new THREE.Mesh(spineGeo, goldWingMat);
  wingGroup.add(spineMesh);

  // 2. Individual Feathered Vanes along the Quill (Matching Reference Comb Structure)
  const vaneCount = 24;
  for (let i = 0; i < vaneCount; i++) {
    const t = (i + 1) / (vaneCount + 2);
    const spinePoint = curve.getPoint(t);
    const spineTangent = curve.getTangent(t);

    // Vane length tapers from long at base (0.55) to short at tip (0.12)
    const vaneLength = (1.0 - t * 0.75) * 0.52;
    const vaneWidth = 0.022;

    const vaneGeo = new THREE.PlaneGeometry(vaneWidth, vaneLength);
    // Move pivot to bottom of vane
    vaneGeo.translate(0, vaneLength / 2, 0);

    const vaneMesh = new THREE.Mesh(vaneGeo, goldWingMat);
    vaneMesh.position.copy(spinePoint);

    // Align vane outward and slightly angled like bird feathers
    const normal = new THREE.Vector3(-spineTangent.y * mirror, spineTangent.x * mirror, 0.15).normalize();
    vaneMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

    // Subtle natural tilt
    vaneMesh.rotation.z += mirror * 0.15;
    vaneMesh.rotation.y += mirror * 0.1;

    wingGroup.add(vaneMesh);
  }

  return wingGroup;
}

/**
 * 1. Setup Interactive 3D Golden Snitch WebGL Scene (Matching Reference Image)
 */
function initThreeSnitch() {
  const canvas = document.getElementById('snitch-three-canvas');
  if (!canvas) return { setHouseColor: () => {} };

  const container = document.getElementById('skills-constellation-stage');
  const width = container ? container.clientWidth : 560;
  const height = container ? container.clientHeight : 560;

  // Scene & Perspective Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
  camera.position.set(0, 0.2, 5.8);

  // WebGL Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.4;

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xfff0d0, 1.8);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xfffae6, 3.8);
  mainLight.position.set(4, 6, 5);
  scene.add(mainLight);

  const fillLight = new THREE.DirectionalLight(0xf5c542, 2.4);
  fillLight.position.set(-5, 3, 3);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0x8b181b, 2.0);
  rimLight.position.set(0, 2, -5);
  scene.add(rimLight);

  // Snitch Point Light Glow
  const snitchGlowLight = new THREE.PointLight(0xf5c542, 3.5, 6);
  snitchGlowLight.position.set(0, 0, 0);
  scene.add(snitchGlowLight);

  // Master Snitch Group
  const snitchGroup = new THREE.Group();
  scene.add(snitchGroup);

  // Textures & High-Specular Gold Material
  const bumpMap = createSnitchBumpMap();

  const snitchBodyMat = new THREE.MeshStandardMaterial({
    color: 0xf7d046,
    metalness: 0.96,
    roughness: 0.14,
    bumpMap: bumpMap,
    bumpScale: 0.06
  });

  const goldDetailMat = new THREE.MeshStandardMaterial({
    color: 0xffdf6d,
    metalness: 0.98,
    roughness: 0.12
  });

  // --- A. Core Golden Sphere ---
  const sphereGeo = new THREE.SphereGeometry(0.72, 48, 48);
  const sphereMesh = new THREE.Mesh(sphereGeo, snitchBodyMat);
  snitchGroup.add(sphereMesh);

  // Equator Seam Rings & Engraved Bands
  const ringGeo = new THREE.TorusGeometry(0.725, 0.018, 16, 48);
  const equatorRing = new THREE.Mesh(ringGeo, goldDetailMat);
  equatorRing.rotation.x = Math.PI / 2;
  snitchGroup.add(equatorRing);

  // Upper & Lower Decorative Crest Caps
  const capGeo = new THREE.TorusGeometry(0.35, 0.016, 16, 36);
  const topCap = new THREE.Mesh(capGeo, goldDetailMat);
  topCap.rotation.x = Math.PI / 2;
  topCap.position.y = 0.62;
  snitchGroup.add(topCap);

  const bottomCap = new THREE.Mesh(capGeo, goldDetailMat);
  bottomCap.rotation.x = Math.PI / 2;
  bottomCap.position.y = -0.62;
  snitchGroup.add(bottomCap);

  // --- B. Wing Hinge Attachment Brackets ---
  const hingeGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.14, 16);

  // Left Hinge Joint
  const leftHingePivot = new THREE.Group();
  leftHingePivot.position.set(-0.58, 0.38, 0.0);
  snitchGroup.add(leftHingePivot);

  const leftBracket = new THREE.Mesh(hingeGeo, goldDetailMat);
  leftBracket.rotation.z = Math.PI / 2;
  leftHingePivot.add(leftBracket);

  // Right Hinge Joint
  const rightHingePivot = new THREE.Group();
  rightHingePivot.position.set(0.58, 0.38, 0.0);
  snitchGroup.add(rightHingePivot);

  const rightBracket = new THREE.Mesh(hingeGeo, goldDetailMat);
  rightBracket.rotation.z = Math.PI / 2;
  rightHingePivot.add(rightBracket);

  // --- C. Detailed Feathered Wings ---
  const leftWing = createFeatheredWing(false);
  leftHingePivot.add(leftWing);

  const rightWing = createFeatheredWing(true);
  rightHingePivot.add(rightWing);

  // Mouse Parallax tracking
  let mouseX = 0;
  let mouseY = 0;
  let targetRotX = 0;
  let targetRotY = 0;

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetRotY = mouseX * 0.45;
      targetRotX = mouseY * 0.35;
    }
  });

  // Animation Loop (Rapid Flapping & Fluid Hover Physics)
  const clock = new THREE.Clock();

  function animate() {
    const elapsed = clock.getElapsedTime();

    // 1. Rapid Organic Wing Flapping (sinusoidal wing flap with phase offset)
    const flapFreq = 26.0;
    const flapAngle = Math.sin(elapsed * flapFreq) * 0.52;
    const flapTilt = Math.cos(elapsed * flapFreq) * 0.24;

    // Left Wing Flap
    leftHingePivot.rotation.z = 0.25 + flapAngle;
    leftHingePivot.rotation.x = -0.15 + flapTilt;
    leftHingePivot.rotation.y = -0.1 + flapAngle * 0.2;

    // Right Wing Flap
    rightHingePivot.rotation.z = -0.25 - flapAngle;
    rightHingePivot.rotation.x = -0.15 + flapTilt;
    rightHingePivot.rotation.y = 0.1 - flapAngle * 0.2;

    // 2. Natural Vertical Bobbing & Tilting Hover Physics
    snitchGroup.position.y = Math.sin(elapsed * 2.6) * 0.12;
    snitchGroup.position.x = Math.cos(elapsed * 1.8) * 0.05;

    // Smooth Interactive Mouse Parallax Tilt
    snitchGroup.rotation.y += (targetRotY + Math.sin(elapsed * 1.4) * 0.08 - snitchGroup.rotation.y) * 0.06;
    snitchGroup.rotation.x += (targetRotX + Math.sin(elapsed * 2.0) * 0.06 - snitchGroup.rotation.x) * 0.06;
    snitchGroup.rotation.z = Math.cos(elapsed * 1.8) * 0.06;

    // Soft Light Pulse
    snitchGlowLight.intensity = 3.2 + Math.sin(elapsed * 4.0) * 0.6;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    if (!container) return;
    const newW = container.clientWidth;
    const newH = container.clientHeight;
    camera.aspect = newW / newH;
    camera.updateProjectionMatrix();
    renderer.setSize(newW, newH);
  });

  return {
    setHouseColor: (primaryHex) => {
      rimLight.color.set(primaryHex);
    }
  };
}

/**
 * 2. Populate Enlarged Floating Skill Orbits Constellation
 *    Outer Ring (Radius 260px / 520px Diameter), Inner Ring (Radius 170px / 340px Diameter)
 */
function initOrbitalSkills() {
  const ring1 = document.getElementById('orbit-layer-1');
  const ring2 = document.getElementById('orbit-layer-2');
  if (!ring1 || !ring2) return;

  ring1.innerHTML = '';
  ring2.innerHTML = '';

  // Outer Circular Orbit (Radius: 260px, Center: 260, 260)
  outerSkills.forEach((name, i) => {
    const angle = (i / outerSkills.length) * Math.PI * 2;
    const r = 260;
    const x = Math.cos(angle) * r + r;
    const y = Math.sin(angle) * r + r;

    const badge = document.createElement('div');
    badge.className = 'orbit-skill-badge';
    badge.innerHTML = `<span>⚡</span><span>${name}</span>`;
    badge.style.left = `${x}px`;
    badge.style.top = `${y}px`;

    badge.addEventListener('mouseenter', () => {
      magicalAudio.playHoverChime();
    });

    ring1.appendChild(badge);
  });

  // Inner Circular Orbit (Radius: 170px, Center: 170, 170)
  innerSkills.forEach((name, i) => {
    const angle = (i / innerSkills.length) * Math.PI * 2;
    const r = 170;
    const x = Math.cos(angle) * r + r;
    const y = Math.sin(angle) * r + r;

    const badge = document.createElement('div');
    badge.className = 'orbit-skill-badge';
    badge.innerHTML = `<span>✦</span><span>${name}</span>`;
    badge.style.left = `${x}px`;
    badge.style.top = `${y}px`;

    badge.addEventListener('mouseenter', () => {
      magicalAudio.playHoverChime();
    });

    ring2.appendChild(badge);
  });
}

/**
 * 3. Pinned Single-Line Scrollytelling Swap (Apple / Awwwards Style)
 *    Smoothly swaps statements with slide-up, blur & fade on scroll
 */
function initStatementSwapScrollytelling() {
  const section = document.getElementById('about');
  const container = document.getElementById('skills-split-container');
  const statement1 = document.getElementById('statement-1');
  const statement2 = document.getElementById('statement-2');
  const statement3 = document.getElementById('statement-3');
  const dot1 = document.getElementById('sdot-1');
  const dot2 = document.getElementById('sdot-2');
  const dot3 = document.getElementById('sdot-3');
  const line1 = document.getElementById('sline-1');
  const line2 = document.getElementById('sline-2');
  const topNav = document.getElementById('top-right-nav');
  const topLeftHeader = document.getElementById('top-left-header');

  if (!section || !container || !statement1 || !statement2 || !statement3) return;

  // Set pristine initial stacked states
  gsap.set(statement1, { yPercent: 0, opacity: 1, filter: 'blur(0px)', force3D: true });
  gsap.set(statement2, { yPercent: 120, opacity: 0, filter: 'blur(8px)', force3D: true });
  gsap.set(statement3, { yPercent: 120, opacity: 0, filter: 'blur(8px)', force3D: true });

  // Master GSAP ScrollTrigger Pinned Timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=250%',
      pin: container,
      pinSpacing: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;

        // Navbar & Floating Home Button Toggle
        if (p > 0.04) {
          if (topNav) topNav.classList.add('nav-hidden');
          if (topLeftHeader) topLeftHeader.classList.add('home-active');
        } else {
          if (topNav) topNav.classList.remove('nav-hidden');
          if (topLeftHeader) topLeftHeader.classList.remove('home-active');
        }

        // Sync Progress Dots & Lines
        if (p < 0.33) {
          if (dot1) dot1.classList.add('active');
          if (dot2) dot2.classList.remove('active');
          if (dot3) dot3.classList.remove('active');
          if (line1) line1.classList.remove('active');
          if (line2) line2.classList.remove('active');
        } else if (p >= 0.33 && p < 0.66) {
          if (dot1) dot1.classList.add('active');
          if (dot2) dot2.classList.add('active');
          if (dot3) dot3.classList.remove('active');
          if (line1) line1.classList.add('active');
          if (line2) line2.classList.remove('active');
        } else {
          if (dot1) dot1.classList.add('active');
          if (dot2) dot2.classList.add('active');
          if (dot3) dot3.classList.add('active');
          if (line1) line1.classList.add('active');
          if (line2) line2.classList.add('active');
        }
      },
      onLeaveBack: () => {
        gsap.set(statement1, { yPercent: 0, opacity: 1, filter: 'blur(0px)' });
        gsap.set(statement2, { yPercent: 120, opacity: 0, filter: 'blur(8px)' });
        gsap.set(statement3, { yPercent: 120, opacity: 0, filter: 'blur(8px)' });
        if (topNav) topNav.classList.remove('nav-hidden');
        if (topLeftHeader) topLeftHeader.classList.remove('home-active');
      }
    }
  });

  // =========================================================================
  // Transition 1 -> 2: Statement 1 slides up/fades out, Statement 2 slides in
  // =========================================================================
  tl.to(statement1, {
    yPercent: -120,
    opacity: 0,
    filter: 'blur(8px)',
    duration: 0.35,
    ease: 'power2.inOut'
  }, 0.20);

  tl.to(statement2, {
    yPercent: 0,
    opacity: 1,
    filter: 'blur(0px)',
    duration: 0.35,
    ease: 'power2.inOut'
  }, 0.25);

  // =========================================================================
  // Transition 2 -> 3: Statement 2 slides up/fades out, Statement 3 slides in
  // =========================================================================
  tl.to(statement2, {
    yPercent: -120,
    opacity: 0,
    filter: 'blur(8px)',
    duration: 0.35,
    ease: 'power2.inOut'
  }, 0.58);

  tl.to(statement3, {
    yPercent: 0,
    opacity: 1,
    filter: 'blur(0px)',
    duration: 0.35,
    ease: 'power2.inOut'
  }, 0.63);
}

/**
 * Main Initialization Entrypoint for About/Skills Section
 */
export function initCauldronVortex() {
  const snitchEngine = initThreeSnitch();
  initOrbitalSkills();
  initStatementSwapScrollytelling();

  // Dynamically update rim lights on House Switch
  document.addEventListener('hp_house_changed', (e) => {
    const house = e.detail?.house;
    if (!house || !snitchEngine.setHouseColor) return;
    if (house === 'gryffindor') snitchEngine.setHouseColor(0x8b181b);
    else if (house === 'slytherin') snitchEngine.setHouseColor(0x1a472a);
    else if (house === 'ravenclaw') snitchEngine.setHouseColor(0x0e1a40);
    else if (house === 'hufflepuff') snitchEngine.setHouseColor(0x372e29);
  });
}
