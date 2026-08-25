/* ==========================================================================
   PART 3: ABOUT & SKILLS - REALISTIC PBR 3D GOLDEN SNITCH & STATEMENT SWAP
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
 * Procedural Studio Environment Reflection Map Generator
 * Generates an HDRI-style studio lighting probe for realistic metallic reflections
 */
function createStudioEnvMap(renderer) {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Dark studio ambient background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 512);
  bgGrad.addColorStop(0, '#0a0a14');
  bgGrad.addColorStop(0.5, '#121018');
  bgGrad.addColorStop(1, '#050508');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // Softbox 1: Warm Golden Overhead Softbox
  const light1 = ctx.createRadialGradient(512, 140, 0, 512, 140, 220);
  light1.addColorStop(0, 'rgba(255, 240, 200, 1)');
  light1.addColorStop(0.4, 'rgba(245, 197, 66, 0.6)');
  light1.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = light1;
  ctx.fillRect(0, 0, 1024, 512);

  // Softbox 2: Left Key Light
  const light2 = ctx.createRadialGradient(180, 220, 0, 180, 220, 160);
  light2.addColorStop(0, 'rgba(255, 225, 170, 0.9)');
  light2.addColorStop(0.5, 'rgba(217, 119, 6, 0.4)');
  light2.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = light2;
  ctx.fillRect(0, 0, 1024, 512);

  // Softbox 3: Right Rim Light
  const light3 = ctx.createRadialGradient(840, 220, 0, 840, 220, 160);
  light3.addColorStop(0, 'rgba(255, 235, 180, 0.85)');
  light3.addColorStop(0.5, 'rgba(185, 28, 28, 0.35)');
  light3.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = light3;
  ctx.fillRect(0, 0, 1024, 512);

  const envTexture = new THREE.CanvasTexture(canvas);
  envTexture.mapping = THREE.EquirectangularReflectionMapping;

  const envMap = pmremGenerator.fromEquirectangular(envTexture).texture;
  pmremGenerator.dispose();
  envTexture.dispose();

  return envMap;
}

/**
 * Procedural Engraved Gold Seam Bump Map for Snitch Sphere
 */
function createSnitchBumpMap() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Base metallic fill
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 1024, 1024);

  // Engraved curved swirl seams
  ctx.strokeStyle = '#181818';
  ctx.lineWidth = 8;

  // Equator seam groove
  ctx.beginPath();
  ctx.moveTo(0, 512);
  ctx.lineTo(1024, 512);
  ctx.stroke();

  // Swirl arcs (Matching movie Golden Snitch relief panels)
  ctx.beginPath();
  ctx.arc(256, 512, 175, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(768, 512, 175, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(512, 256, 140, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(512, 768, 140, 0, Math.PI * 2);
  ctx.stroke();

  // Fine panel border grooves
  ctx.lineWidth = 4;
  ctx.strokeRect(60, 60, 904, 904);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Build a Slender, Curved Metallic Feathered Wing (Scaled & Refined)
 */
function createFeatheredWing(isRight = false, envMap) {
  const wingGroup = new THREE.Group();

  const goldWingMat = new THREE.MeshStandardMaterial({
    color: 0xedd06e,
    metalness: 0.96,
    roughness: 0.18,
    envMap: envMap,
    envMapIntensity: 2.2,
    side: THREE.DoubleSide
  });

  const mirror = isRight ? 1 : -1;

  // 1. Curved Central Wing Spine / Quill (Scaled down to 1.35 length)
  const curvePoints = [];
  const totalLength = 1.35;
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    const x = mirror * (t * totalLength * 0.85);
    const y = Math.pow(t, 0.72) * 1.25;
    const z = Math.sin(t * Math.PI) * 0.14;
    curvePoints.push(new THREE.Vector3(x, y, z));
  }
  const curve = new THREE.CatmullRomCurve3(curvePoints);
  const spineGeo = new THREE.TubeGeometry(curve, 28, 0.016, 8, false);
  const spineMesh = new THREE.Mesh(spineGeo, goldWingMat);
  wingGroup.add(spineMesh);

  // 2. Individual Feathered Vanes along the Quill (Comb structure)
  const vaneCount = 22;
  for (let i = 0; i < vaneCount; i++) {
    const t = (i + 1) / (vaneCount + 2);
    const spinePoint = curve.getPoint(t);
    const spineTangent = curve.getTangent(t);

    // Vane length tapers from long at base (0.30) to short at tip (0.06)
    const vaneLength = (1.0 - t * 0.78) * 0.32;
    const vaneWidth = 0.014;

    const vaneGeo = new THREE.PlaneGeometry(vaneWidth, vaneLength);
    // Move pivot to base of vane
    vaneGeo.translate(0, vaneLength / 2, 0);

    const vaneMesh = new THREE.Mesh(vaneGeo, goldWingMat);
    vaneMesh.position.copy(spinePoint);

    // Align vane outward and slightly angled like natural bird feather vanes
    const normal = new THREE.Vector3(-spineTangent.y * mirror, spineTangent.x * mirror, 0.12).normalize();
    vaneMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

    vaneMesh.rotation.z += mirror * 0.12;
    vaneMesh.rotation.y += mirror * 0.08;

    wingGroup.add(vaneMesh);
  }

  return wingGroup;
}

/**
 * 1. Setup Realistic PBR 3D Golden Snitch WebGL Scene (Scaled Down & Compact)
 */
function initThreeSnitch() {
  const canvas = document.getElementById('snitch-three-canvas');
  if (!canvas) return { setHouseColor: () => {} };

  const container = document.getElementById('skills-constellation-stage');
  const width = container ? container.clientWidth : 560;
  const height = container ? container.clientHeight : 560;

  // Scene & Perspective Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
  camera.position.set(0, 0.15, 4.8);

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
  renderer.toneMappingExposure = 1.3;

  // Studio HDRI Reflection Map
  const envMap = createStudioEnvMap(renderer);
  scene.environment = envMap;

  // Cinematic Three-Point Studio Lighting
  const ambientLight = new THREE.AmbientLight(0xfffae8, 1.2);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xfff5d8, 3.2);
  keyLight.position.set(3.5, 5, 4);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xf5c542, 1.8);
  fillLight.position.set(-4, 2.5, 2.5);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0x8b181b, 2.2);
  rimLight.position.set(0, 2, -4);
  scene.add(rimLight);

  // Snitch Master Group (Scaled compactly so orbit badges have maximum space)
  const snitchGroup = new THREE.Group();
  scene.add(snitchGroup);

  // Textures & PBR Materials
  const bumpMap = createSnitchBumpMap();

  // Authentic Realistic Metallic Gold (PBR)
  const snitchBodyMat = new THREE.MeshStandardMaterial({
    color: 0xdfb15b,
    metalness: 0.98,
    roughness: 0.15,
    envMap: envMap,
    envMapIntensity: 2.6,
    bumpMap: bumpMap,
    bumpScale: 0.035
  });

  const goldDetailMat = new THREE.MeshStandardMaterial({
    color: 0xedd06e,
    metalness: 0.99,
    roughness: 0.12,
    envMap: envMap,
    envMapIntensity: 2.8
  });

  // --- A. Core Golden Sphere (Radius: 0.38 - 48% smaller than original) ---
  const sphereGeo = new THREE.SphereGeometry(0.38, 48, 48);
  const sphereMesh = new THREE.Mesh(sphereGeo, snitchBodyMat);
  snitchGroup.add(sphereMesh);

  // Equator Seam Ring & Engraved Bands
  const ringGeo = new THREE.TorusGeometry(0.382, 0.01, 16, 48);
  const equatorRing = new THREE.Mesh(ringGeo, goldDetailMat);
  equatorRing.rotation.x = Math.PI / 2;
  snitchGroup.add(equatorRing);

  // Upper & Lower Decorative Crest Caps
  const capGeo = new THREE.TorusGeometry(0.19, 0.009, 16, 36);
  const topCap = new THREE.Mesh(capGeo, goldDetailMat);
  topCap.rotation.x = Math.PI / 2;
  topCap.position.y = 0.32;
  snitchGroup.add(topCap);

  const bottomCap = new THREE.Mesh(capGeo, goldDetailMat);
  bottomCap.rotation.x = Math.PI / 2;
  bottomCap.position.y = -0.32;
  snitchGroup.add(bottomCap);

  // --- B. Wing Hinge Attachment Brackets ---
  const hingeGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.08, 16);

  // Left Hinge Joint
  const leftHingePivot = new THREE.Group();
  leftHingePivot.position.set(-0.31, 0.20, 0.0);
  snitchGroup.add(leftHingePivot);

  const leftBracket = new THREE.Mesh(hingeGeo, goldDetailMat);
  leftBracket.rotation.z = Math.PI / 2;
  leftHingePivot.add(leftBracket);

  // Right Hinge Joint
  const rightHingePivot = new THREE.Group();
  rightHingePivot.position.set(0.31, 0.20, 0.0);
  snitchGroup.add(rightHingePivot);

  const rightBracket = new THREE.Mesh(hingeGeo, goldDetailMat);
  rightBracket.rotation.z = Math.PI / 2;
  rightHingePivot.add(rightBracket);

  // --- C. Detailed Slender Feathered Wings ---
  const leftWing = createFeatheredWing(false, envMap);
  leftHingePivot.add(leftWing);

  const rightWing = createFeatheredWing(true, envMap);
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
      targetRotY = mouseX * 0.35;
      targetRotX = mouseY * 0.25;
    }
  });

  // Animation Loop (Fluid Organic Flapping & Realistic Floating Physics)
  const clock = new THREE.Clock();

  function animate() {
    const elapsed = clock.getElapsedTime();

    // 1. Organic Sinusoidal Wing Flapping with Harmonic Lag
    const flapFreq = 22.0;
    const flapAngle = Math.sin(elapsed * flapFreq) * 0.44;
    const flapTilt = Math.cos(elapsed * flapFreq - 0.3) * 0.20;

    // Left Wing Flap
    leftHingePivot.rotation.z = 0.22 + flapAngle;
    leftHingePivot.rotation.x = -0.10 + flapTilt;
    leftHingePivot.rotation.y = -0.06 + flapAngle * 0.15;

    // Right Wing Flap
    rightHingePivot.rotation.z = -0.22 - flapAngle;
    rightHingePivot.rotation.x = -0.10 + flapTilt;
    rightHingePivot.rotation.y = 0.06 - flapAngle * 0.15;

    // 2. Natural Vertical Bobbing & Tilting Hover Physics
    snitchGroup.position.y = Math.sin(elapsed * 2.4) * 0.08;
    snitchGroup.position.x = Math.cos(elapsed * 1.6) * 0.03;

    // Smooth Interactive Mouse Parallax Tilt
    snitchGroup.rotation.y += (targetRotY + Math.sin(elapsed * 1.2) * 0.06 - snitchGroup.rotation.y) * 0.05;
    snitchGroup.rotation.x += (targetRotX + Math.sin(elapsed * 1.6) * 0.04 - snitchGroup.rotation.x) * 0.05;
    snitchGroup.rotation.z = Math.cos(elapsed * 1.6) * 0.04;

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
