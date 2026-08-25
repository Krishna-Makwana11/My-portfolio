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
  bgGrad.addColorStop(0.5, '#14101a');
  bgGrad.addColorStop(1, '#050508');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // Softbox 1: Warm Golden Overhead Softbox
  const light1 = ctx.createRadialGradient(512, 130, 0, 512, 130, 200);
  light1.addColorStop(0, 'rgba(255, 245, 215, 1)');
  light1.addColorStop(0.35, 'rgba(245, 197, 66, 0.7)');
  light1.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = light1;
  ctx.fillRect(0, 0, 1024, 512);

  // Softbox 2: Left Key Light
  const light2 = ctx.createRadialGradient(160, 200, 0, 160, 200, 150);
  light2.addColorStop(0, 'rgba(255, 230, 180, 0.9)');
  light2.addColorStop(0.5, 'rgba(217, 119, 6, 0.45)');
  light2.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = light2;
  ctx.fillRect(0, 0, 1024, 512);

  // Softbox 3: Right Rim Light
  const light3 = ctx.createRadialGradient(860, 200, 0, 860, 200, 150);
  light3.addColorStop(0, 'rgba(255, 240, 190, 0.85)');
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
  ctx.strokeStyle = '#151515';
  ctx.lineWidth = 9;

  // Equator seam groove
  ctx.beginPath();
  ctx.moveTo(0, 512);
  ctx.lineTo(1024, 512);
  ctx.stroke();

  // Swirl arcs (Matching movie Golden Snitch relief panels)
  ctx.beginPath();
  ctx.arc(256, 512, 180, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(768, 512, 180, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(512, 256, 145, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(512, 768, 145, 0, Math.PI * 2);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Build a Slender, Gracefully Curved Upwards (V-Shape) Metallic Feathered Wing
 * Sized compactly to fit 100% inside the innermost orbit ring
 */
function createFeatheredWing(isRight = false, envMap) {
  const wingGroup = new THREE.Group();

  const goldWingMat = new THREE.MeshStandardMaterial({
    color: 0xf2d374,
    metalness: 0.98,
    roughness: 0.12,
    envMap: envMap,
    envMapIntensity: 2.8,
    side: THREE.DoubleSide
  });

  const mirror = isRight ? 1 : -1;

  // 1. Curved Central Wing Spine / Quill (Compact 0.62 length, curving gracefully upwards)
  const curvePoints = [];
  const totalLength = 0.62;
  for (let i = 0; i <= 16; i++) {
    const t = i / 16;
    // Tightly angled upwards (V-shape)
    const x = mirror * (t * totalLength * 0.42);
    const y = Math.pow(t, 0.75) * 0.72;
    const z = Math.sin(t * Math.PI) * 0.08;
    curvePoints.push(new THREE.Vector3(x, y, z));
  }
  const curve = new THREE.CatmullRomCurve3(curvePoints);
  const spineGeo = new THREE.TubeGeometry(curve, 24, 0.009, 8, false);
  const spineMesh = new THREE.Mesh(spineGeo, goldWingMat);
  wingGroup.add(spineMesh);

  // 2. Individual Sculpted Feather Vanes along the Quill (Graceful comb contour)
  const vaneCount = 18;
  for (let i = 0; i < vaneCount; i++) {
    const t = (i + 1) / (vaneCount + 2);
    const spinePoint = curve.getPoint(t);
    const spineTangent = curve.getTangent(t);

    // Tapering feather length (from 0.16 at base down to 0.03 at tip)
    const vaneLength = (1.0 - t * 0.78) * 0.16;
    const vaneWidth = 0.008;

    const vaneGeo = new THREE.PlaneGeometry(vaneWidth, vaneLength);
    // Offset pivot to base of vane
    vaneGeo.translate(0, vaneLength / 2, 0);

    const vaneMesh = new THREE.Mesh(vaneGeo, goldWingMat);
    vaneMesh.position.copy(spinePoint);

    // Align vane outward and slightly angled like natural bird feather vanes
    const normal = new THREE.Vector3(-spineTangent.y * mirror, spineTangent.x * mirror, 0.1).normalize();
    vaneMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

    vaneMesh.rotation.z += mirror * 0.10;
    vaneMesh.rotation.y += mirror * 0.06;

    wingGroup.add(vaneMesh);
  }

  return wingGroup;
}

/**
 * 1. Setup Realistic PBR 3D Golden Snitch WebGL Scene (Compact Sizing Inside Inner Orbit)
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
  camera.position.set(0, 0.1, 5.2);

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
  renderer.toneMappingExposure = 1.35;

  // Studio HDRI Reflection Map
  const envMap = createStudioEnvMap(renderer);
  scene.environment = envMap;

  // Cinematic Three-Point Studio Lighting
  const ambientLight = new THREE.AmbientLight(0xfffae8, 1.4);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xfff5d8, 3.4);
  keyLight.position.set(3.5, 5, 4);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xf5c542, 2.0);
  fillLight.position.set(-4, 2.5, 2.5);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0x8b181b, 2.2);
  rimLight.position.set(0, 2, -4);
  scene.add(rimLight);

  // Snitch Master Group (Compactly scaled to fit entirely inside innermost orbit)
  const snitchGroup = new THREE.Group();
  scene.add(snitchGroup);

  // Textures & PBR Materials
  const bumpMap = createSnitchBumpMap();

  // High-Specular Reflective Metallic Gold (PBR)
  const snitchBodyMat = new THREE.MeshStandardMaterial({
    color: 0xdfb048,
    metalness: 0.98,
    roughness: 0.12,
    envMap: envMap,
    envMapIntensity: 2.8,
    bumpMap: bumpMap,
    bumpScale: 0.028
  });

  const goldDetailMat = new THREE.MeshStandardMaterial({
    color: 0xf5d674,
    metalness: 0.99,
    roughness: 0.10,
    envMap: envMap,
    envMapIntensity: 3.0
  });

  // --- A. Core Golden Sphere (Radius: 0.19 - Compact, fits inside inner orbit) ---
  const sphereGeo = new THREE.SphereGeometry(0.19, 48, 48);
  const sphereMesh = new THREE.Mesh(sphereGeo, snitchBodyMat);
  snitchGroup.add(sphereMesh);

  // Equator Seam Ring & Engraved Bands
  const ringGeo = new THREE.TorusGeometry(0.192, 0.006, 16, 48);
  const equatorRing = new THREE.Mesh(ringGeo, goldDetailMat);
  equatorRing.rotation.x = Math.PI / 2;
  snitchGroup.add(equatorRing);

  // Upper & Lower Decorative Crest Caps
  const capGeo = new THREE.TorusGeometry(0.095, 0.005, 16, 36);
  const topCap = new THREE.Mesh(capGeo, goldDetailMat);
  topCap.rotation.x = Math.PI / 2;
  topCap.position.y = 0.16;
  snitchGroup.add(topCap);

  const bottomCap = new THREE.Mesh(capGeo, goldDetailMat);
  bottomCap.rotation.x = Math.PI / 2;
  bottomCap.position.y = -0.16;
  snitchGroup.add(bottomCap);

  // --- B. Wing Hinge Attachment Brackets ---
  const hingeGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.045, 16);

  // Left Hinge Joint
  const leftHingePivot = new THREE.Group();
  leftHingePivot.position.set(-0.16, 0.10, 0.0);
  snitchGroup.add(leftHingePivot);

  const leftBracket = new THREE.Mesh(hingeGeo, goldDetailMat);
  leftBracket.rotation.z = Math.PI / 2;
  leftHingePivot.add(leftBracket);

  // Right Hinge Joint
  const rightHingePivot = new THREE.Group();
  rightHingePivot.position.set(0.16, 0.10, 0.0);
  snitchGroup.add(rightHingePivot);

  const rightBracket = new THREE.Mesh(hingeGeo, goldDetailMat);
  rightBracket.rotation.z = Math.PI / 2;
  rightHingePivot.add(rightBracket);

  // --- C. Detailed Slender Feathered Wings (Curved Upwards in V-Shape) ---
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
    const flapFreq = 24.0;
    const flapAngle = Math.sin(elapsed * flapFreq) * 0.40;
    const flapTilt = Math.cos(elapsed * flapFreq - 0.25) * 0.16;

    // Left Wing Flap (Pointed upwards in V-shape)
    leftHingePivot.rotation.z = 0.28 + flapAngle;
    leftHingePivot.rotation.x = -0.08 + flapTilt;
    leftHingePivot.rotation.y = -0.05 + flapAngle * 0.12;

    // Right Wing Flap
    rightHingePivot.rotation.z = -0.28 - flapAngle;
    rightHingePivot.rotation.x = -0.08 + flapTilt;
    rightHingePivot.rotation.y = 0.05 - flapAngle * 0.12;

    // 2. Natural Vertical Bobbing & Tilting Hover Physics
    snitchGroup.position.y = Math.sin(elapsed * 2.4) * 0.05;
    snitchGroup.position.x = Math.cos(elapsed * 1.6) * 0.02;

    // Smooth Interactive Mouse Parallax Tilt
    snitchGroup.rotation.y += (targetRotY + Math.sin(elapsed * 1.2) * 0.05 - snitchGroup.rotation.y) * 0.05;
    snitchGroup.rotation.x += (targetRotX + Math.sin(elapsed * 1.6) * 0.03 - snitchGroup.rotation.x) * 0.05;
    snitchGroup.rotation.z = Math.cos(elapsed * 1.6) * 0.03;

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
export function initSkillsConstellation() {
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

// Backward compatibility export alias
export { initSkillsConstellation as initCauldronVortex };
