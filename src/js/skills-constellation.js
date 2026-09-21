/* ==========================================================================
   PART 3: ABOUT & SKILLS - REALISTIC PBR 3D GOLDEN SNITCH & STATEMENT SWAP
   ========================================================================== */

import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { magicalAudio } from './audio-synth.js';

gsap.registerPlugin(ScrollTrigger);

// 17 Exact Skills distributed evenly across 3 concentric orbits
// 1. Outer Orbit (6 skills): HTML5, CSS3, JavaScript, React, Next.js, Node.js
const outerSkills = [
  {
    name: 'HTML5',
    svg: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M4 2l1.6 18 6.4 2 6.4-2L20 2H4z" fill="#E44D26"/><path d="M12 3.8v16.4l4.9-1.5 1.3-14.9H12z" fill="#F16529"/><path d="M12 7.4h4.4l-.3 3.6h-4.1v2.3h3.9l-.4 4.5-3.5 1v-2.3l1.8-.5.2-1.9H8.7l.2-2.3h3.1V7.4zm0 0H7.6l.2-2.3H12v2.3z" fill="#fff"/></svg>`
  },
  {
    name: 'CSS3',
    svg: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M4 2l1.6 18 6.4 2 6.4-2L20 2H4z" fill="#264DE4"/><path d="M12 3.8v16.4l4.9-1.5 1.3-14.9H12z" fill="#2965F1"/><path d="M12 7.4h4.4l-.4 4.5-4 .9v-2.4l1.9-.4.2-1.9H7.8l.2-2.3H12v1.6zm0 4.7H8.2l.2 2.3h3.6v-2.3zm0 2.3v2.3l-1.9-.5-.1-1.3H8.3l.3 2.6 3.4.9v-4z" fill="#fff"/></svg>`
  },
  {
    name: 'JavaScript',
    svg: `<svg viewBox="0 0 24 24" width="16" height="16"><rect width="24" height="24" rx="3" fill="#F7DF1E"/><path d="M7 17.5c.8.6 1.8 1 2.8 1 1.7 0 2.5-.8 2.5-2.5v-7.3h-2v7.3c0 .7-.3 1-1 1-.5 0-1-.2-1.4-.5l-.9 1.5zm8.5-.2c.9.6 2 .9 3.2.9 2.1 0 3.3-1.1 3.3-2.8 0-1.8-1.2-2.4-2.8-3.1-.9-.4-1.5-.7-1.5-1.3 0-.6.5-1 1.4-1 .8 0 1.5.3 2.1.7l.8-1.5c-.8-.5-1.8-.8-2.9-.8-2.1 0-3.3 1.2-3.3 2.7 0 1.7 1.1 2.4 2.7 3.1.9.4 1.6.7 1.6 1.4 0 .7-.6 1.1-1.6 1.1-1 0-1.9-.4-2.5-.9l-.5 1.6z" fill="#000"/></svg>`
  },
  {
    name: 'React',
    svg: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><ellipse cx="12" cy="12" rx="4.2" ry="10" transform="rotate(30 12 12)" stroke="#61DAFB" stroke-width="1.2"/><ellipse cx="12" cy="12" rx="4.2" ry="10" transform="rotate(90 12 12)" stroke="#61DAFB" stroke-width="1.2"/><ellipse cx="12" cy="12" rx="4.2" ry="10" transform="rotate(150 12 12)" stroke="#61DAFB" stroke-width="1.2"/><circle cx="12" cy="12" r="2" fill="#61DAFB"/></svg>`
  },
  {
    name: 'Next.js',
    svg: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><circle cx="12" cy="12" r="11" fill="#000" stroke="rgba(255,255,255,0.4)" stroke-width="1"/><path d="M15 8v8M9 8v8l6.5-8" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  },
  {
    name: 'Node.js',
    svg: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M12 2l8.7 5v10L12 22l-8.7-5V7L12 2z" fill="#339933"/><path d="M12 4.4L5.5 8.1v7.6L12 19.5l6.5-3.8V8.1L12 4.4z" fill="#fff" opacity=".2"/><path d="M12 8a4 4 0 014 4c0 2.2-1.8 4-4 4s-4-1.8-4-4a4 4 0 014-4z" fill="#fff"/></svg>`
  }
];

// 2. Middle Orbit (6 skills): Python, NumPy, Pandas, Matplotlib, Seaborn, Git
const middleSkills = [
  {
    name: 'Python',
    svg: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M11.9 2C8.3 2 8.5 3.6 8.5 3.6l.01 1.6h3.49v.5H4.8S2 5.4 2 9.1s2.5 3.5 2.5 3.5h1.5v-2.1s-.1-2.5 2.5-2.5h4.3s2.4.1 2.4-2.4V4.4S15.6 2 11.9 2zm-1.8 1.4c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9z" fill="#3776AB"/><path d="M12.1 22c3.6 0 3.4-1.6 3.4-1.6l-.01-1.6H12v-.5h7.2s2.8.3 2.8-3.4-2.5-3.5-2.5-3.5h-1.5v2.1s.1 2.5-2.5 2.5H11s-2.4-.1-2.4 2.4v1.2s-.4 2.4 3.5 2.4zm1.8-1.4c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9z" fill="#FFD438"/></svg>`
  },
  {
    name: 'NumPy',
    svg: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M12 2.25L3.75 7v10L12 21.75l8.25-4.75V7L12 2.25z" fill="#013243"/><path d="M12 4.55l6.25 3.6-2.5 1.45-3.75-2.15-3.75 2.15-2.5-1.45L12 4.55z" fill="#4DABF7"/><path d="M5.75 8.7l5.25 3.05v6.5l-5.25-3.05V8.7z" fill="#4D77CF"/><path d="M13 18.25v-6.5l5.25-3.05v6.5l-5.25 3.05z" fill="#2E5BBA"/></svg>`
  },
  {
    name: 'Pandas',
    svg: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="3" y="4" width="4" height="7" rx="1.5" fill="#150458"/><rect x="3" y="13" width="4" height="7" rx="1.5" fill="#E70488"/><rect x="10" y="7" width="4" height="13" rx="1.5" fill="#150458"/><rect x="17" y="4" width="4" height="10" rx="1.5" fill="#FFD43B"/><rect x="17" y="16" width="4" height="4" rx="1.5" fill="#00D084"/></svg>`
  },
  {
    name: 'Matplotlib',
    svg: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><circle cx="12" cy="12" r="9" stroke="#3776AB" stroke-width="1.5" fill="#0D1E2D"/><path d="M5 13c2.5-4 5-1 7-5s4.5 1 7-4" stroke="#4DABF7" stroke-width="1.8" stroke-linecap="round"/><path d="M5 16c2.5-2 5-5 7-2s4.5-1 7-5" stroke="#FFA94D" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="10" r="1.3" fill="#51CF66"/></svg>`
  },
  {
    name: 'Seaborn',
    svg: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect width="24" height="24" rx="4" fill="#1A2744"/><path d="M4 18c3 0 4-11 8-11s5 11 8 11" stroke="#4C72B0" stroke-width="2" stroke-linecap="round"/><path d="M4 18c2.5 0 4.5-7 8-7s5.5 7 8 7" stroke="#55A868" stroke-width="1.8" stroke-linecap="round" opacity="0.85"/><path d="M4 18c2 0 5-3 8-3s6 3 8 3" stroke="#C44E52" stroke-width="1.6" stroke-linecap="round" opacity="0.75"/></svg>`
  },
  {
    name: 'Git',
    svg: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M21.6 10.6l-8.2-8.2c-.8-.8-2-.8-2.8 0L8.8 4.2l3.5 3.5c.8-.3 1.8-.1 2.4.5.6.6.8 1.6.5 2.4l3.4 3.4c.8-.3 1.8-.1 2.4.5.9.9.9 2.3 0 3.2-.9.9-2.3.9-3.2 0-.7-.7-.9-1.7-.5-2.5L13.9 12v5.3c.3.2.5.4.6.6.9.9.9 2.3 0 3.2-.9.9-2.3.9-3.2 0-.9-.9-.9-2.3 0-3.2.3-.3.6-.5 1-.6V11.8c-.4-.1-.7-.3-1-.6-.7-.7-.9-1.7-.5-2.5L7.4 5.2 2.4 10.2c-.8.8-.8 2 0 2.8l8.2 8.2c.8.8 2 .8 2.8 0l8.2-8.2c.8-.8.8-2 0-2.4z" fill="#F05032"/></svg>`
  }
];

// 3. Inner Orbit (5 skills): Excel, PowerBI, SQL, MySQL, C++
const innerSkills = [
  {
    name: 'Excel',
    svg: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" fill="#107C41"/><path d="M8 7.5l3.5 4.5L8 16.5h2.2l2.3-3.2 2.3 3.2H17l-3.5-4.5L17 7.5h-2.2L12.5 10.7 10.2 7.5H8z" fill="#fff"/></svg>`
  },
  {
    name: 'PowerBI',
    svg: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="3" y="11" width="4" height="10" rx="1.5" fill="#F2C811"/><rect x="10" y="7" width="4" height="14" rx="1.5" fill="#E8B500"/><rect x="17" y="3" width="4" height="18" rx="1.5" fill="#F2C811"/></svg>`
  },
  {
    name: 'SQL',
    svg: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#00BCF2" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`
  },
  {
    name: 'MySQL',
    svg: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M12 3c-4.9 0-9 4.1-9 9.1 0 3.6 2.1 6.7 5.2 8.1l.6-1.5C6.1 17.5 4.5 15 4.5 12.1c0-4.1 3.4-7.5 7.5-7.5s7.5 3.4 7.5 7.5c0 2.9-1.6 5.4-4.1 6.6l.6 1.5c3.1-1.4 5.2-4.5 5.2-8.1 0-5-4.1-9.1-9.2-9.1z" fill="#00758F"/><path d="M12 8a4 4 0 00-4 4c0 1.5.8 2.8 2 3.4l.7-1.4A2.5 2.5 0 019.5 12c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5c0 .9-.5 1.6-1.2 2l.7 1.4c1.2-.6 2-1.9 2-3.4a4 4 0 00-4-4z" fill="#F29111"/></svg>`
  },
  {
    name: 'C++',
    svg: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M12 2l8.7 5v10L12 22l-8.7-5V7L12 2z" fill="#00599C"/><path d="M10.8 7.5a4.8 4.8 0 100 9 4.8 4.8 0 000-9zm5 2.5h1.2v1.5h1.5v1.2h-1.5v1.5h-1.2v-1.5h-1.5v-1.2h1.5V10zm3.5 0h1.2v1.5h1.5v1.2H20.5v1.5h-1.2v-1.5h-1.5v-1.2h1.5V10z" fill="#fff"/></svg>`
  }
];

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
 * 2. Populate 3 Concentric Floating Skill Orbits with Official Vector Logos
 *    Outer Ring (Radius 290px / 580px Diameter, 5 skills)
 *    Middle Ring (Radius 215px / 430px Diameter, 5 skills)
 *    Inner Ring (Radius 140px / 280px Diameter, 4 skills)
 */
function initOrbitalSkills() {
  const ring1 = document.getElementById('orbit-layer-1');
  const ring2 = document.getElementById('orbit-layer-2');
  const ring3 = document.getElementById('orbit-layer-3');
  if (!ring1 || !ring2 || !ring3) return;

  ring1.innerHTML = '';
  ring2.innerHTML = '';
  ring3.innerHTML = '';

  // 1. Outer Orbit (5 skills, Radius: 290px, Center: 290, 290)
  outerSkills.forEach((item, i) => {
    const angle = (i / outerSkills.length) * Math.PI * 2;
    const r = 290;
    const x = Math.cos(angle) * r + r;
    const y = Math.sin(angle) * r + r;

    const badge = document.createElement('div');
    badge.className = 'orbit-skill-badge';
    badge.innerHTML = `<span class="orbit-badge-icon">${item.svg}</span><span>${item.name}</span>`;
    badge.style.left = `${x}px`;
    badge.style.top = `${y}px`;

    badge.addEventListener('mouseenter', () => {
      magicalAudio.playHoverChime();
    });

    ring1.appendChild(badge);
  });

  // 2. Middle Orbit (5 skills, Radius: 215px, Center: 215, 215)
  middleSkills.forEach((item, i) => {
    const angle = (i / middleSkills.length) * Math.PI * 2;
    const r = 215;
    const x = Math.cos(angle) * r + r;
    const y = Math.sin(angle) * r + r;

    const badge = document.createElement('div');
    badge.className = 'orbit-skill-badge';
    badge.innerHTML = `<span class="orbit-badge-icon">${item.svg}</span><span>${item.name}</span>`;
    badge.style.left = `${x}px`;
    badge.style.top = `${y}px`;

    badge.addEventListener('mouseenter', () => {
      magicalAudio.playHoverChime();
    });

    ring2.appendChild(badge);
  });

  // 3. Inner Orbit (4 skills, Radius: 140px, Center: 140, 140)
  innerSkills.forEach((item, i) => {
    const angle = (i / innerSkills.length) * Math.PI * 2;
    const r = 140;
    const x = Math.cos(angle) * r + r;
    const y = Math.sin(angle) * r + r;

    const badge = document.createElement('div');
    badge.className = 'orbit-skill-badge';
    badge.innerHTML = `<span class="orbit-badge-icon">${item.svg}</span><span>${item.name}</span>`;
    badge.style.left = `${x}px`;
    badge.style.top = `${y}px`;

    badge.addEventListener('mouseenter', () => {
      magicalAudio.playHoverChime();
    });

    ring3.appendChild(badge);
  });
}

/**
 * 3. Pinned Single-Line Scrollytelling Swap, Exit Transition & "MY PROJECTS" Bridge Reveal
 *    - Seamlessly swaps statements 1 -> 2 -> 3
 *    - Glides Skills split container left off-screen
 *    - Concurrently triggers "MY PROJECTS" golden text stagger reveal in center of viewport
 *    - Seamlessly lifts & fades out "MY PROJECTS" right before Section 3 takes over (Zero Dead Air)
 */
function initStatementSwapScrollytelling() {
  const section = document.getElementById('about');
  const container = document.getElementById('skills-split-container');
  const statement1 = document.getElementById('statement-1');
  const statement2 = document.getElementById('statement-2');
  const statement3 = document.getElementById('statement-3');
  const topNav = document.getElementById('top-right-nav');

  // "MY PROJECTS" Bridge Elements
  const bridgeContainer = document.getElementById('projects-bridge-container');
  const bridgeGlow = document.getElementById('projects-bridge-glow');
  const wordMy = document.getElementById('bridge-word-my');
  const wordProjects = document.getElementById('bridge-word-projects');
  const bridgeSubline = document.getElementById('bridge-word-subline');

  if (!section || !container || !statement1 || !statement2 || !statement3) return;

  // Helper function to restore clean pristine starting state
  const resetAllPristine = () => {
    gsap.set(container, {
      scale: 1,
      xPercent: 0,
      opacity: 1,
      filter: 'none',
      borderRadius: '0px',
      border: '1px solid transparent',
      boxShadow: 'none',
      force3D: true
    });
    gsap.set(statement1, { yPercent: 0, opacity: 1, filter: 'none', force3D: true });
    gsap.set(statement2, { yPercent: 120, opacity: 0, filter: 'blur(8px)', force3D: true });
    gsap.set(statement3, { yPercent: 120, opacity: 0, filter: 'blur(8px)', force3D: true });

    if (bridgeContainer) {
      gsap.set(bridgeContainer, { visibility: 'visible', pointerEvents: 'none' });
    }
    if (wordMy) {
      gsap.set(wordMy, { opacity: 0, y: 25, letterSpacing: '0.10em', filter: 'blur(8px)', force3D: true });
    }
    if (wordProjects) {
      gsap.set(wordProjects, { opacity: 0, y: 25, letterSpacing: '0.10em', filter: 'blur(8px)', force3D: true });
    }
    if (bridgeSubline) {
      gsap.set(bridgeSubline, { opacity: 0, y: 15, letterSpacing: '0.15em', filter: 'blur(4px)', force3D: true });
    }
    if (bridgeGlow) {
      gsap.set(bridgeGlow, { opacity: 0, scale: 0.82, force3D: true });
    }
  };

  resetAllPristine();

  // Master GSAP ScrollTrigger Pinned Timeline for Section 2 + Bridge
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=420%',
      pin: section,
      pinSpacing: true,
      scrub: 1.1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onLeaveBack: () => {
        resetAllPristine();
        if (topNav) topNav.classList.remove('nav-hidden');
      }
    }
  });

  // =========================================================================
  // 1. Scrollytelling Sequence: Statement 1 -> 2 -> 3 (0.00 -> 0.58)
  // =========================================================================
  // Statement 1 -> 2
  tl.to(statement1, {
    yPercent: -120,
    opacity: 0,
    filter: 'blur(8px)',
    duration: 0.08,
    ease: 'power2.inOut'
  }, 0.16);

  tl.to(statement2, {
    yPercent: 0,
    opacity: 1,
    filter: 'blur(0px)',
    duration: 0.08,
    ease: 'power2.inOut'
  }, 0.19);

  // Statement 2 -> 3
  tl.to(statement2, {
    yPercent: -120,
    opacity: 0,
    filter: 'blur(8px)',
    duration: 0.08,
    ease: 'power2.inOut'
  }, 0.38);

  tl.to(statement3, {
    yPercent: 0,
    opacity: 1,
    filter: 'blur(0px)',
    duration: 0.08,
    ease: 'power2.inOut'
  }, 0.41);

  // =========================================================================
  // 2. Skills Exit Phase: Card zooms out & glides left off-screen (0.56 -> 0.70)
  // =========================================================================
  tl.to(container, {
    scale: 0.78,
    borderRadius: '32px',
    border: '1px solid rgba(245, 197, 66, 0.28)',
    boxShadow: '0 25px 70px rgba(0, 0, 0, 0.85), 0 0 30px rgba(245, 197, 66, 0.12)',
    duration: 0.06,
    ease: 'power2.inOut'
  }, 0.56);

  tl.to(container, {
    xPercent: -120,
    opacity: 0,
    filter: 'blur(8px)',
    duration: 0.10,
    ease: 'power2.in'
  }, 0.60);

  // =========================================================================
  // 3. Bridge Phase: Concurrently brings in "MY PROJECTS" (0.64 -> 0.84)
  // Zero Dead Space - animates immediately as Skills clears the screen
  // =========================================================================
  if (bridgeGlow) {
    tl.to(bridgeGlow, {
      opacity: 0.85,
      scale: 1.15,
      duration: 0.14,
      ease: 'power2.out'
    }, 0.64);
  }

  if (wordMy) {
    tl.to(wordMy, {
      opacity: 1,
      y: 0,
      letterSpacing: '0.25em',
      filter: 'blur(0px)',
      duration: 0.12,
      ease: 'power2.out'
    }, 0.64);
  }

  if (wordProjects) {
    tl.to(wordProjects, {
      opacity: 1,
      y: 0,
      letterSpacing: '0.22em',
      filter: 'blur(0px)',
      duration: 0.12,
      ease: 'power2.out'
    }, 0.70);
  }

  if (bridgeSubline) {
    tl.to(bridgeSubline, {
      opacity: 1,
      y: 0,
      letterSpacing: '0.28em',
      filter: 'blur(0px)',
      duration: 0.10,
      ease: 'power2.out'
    }, 0.74);
  }

  // =========================================================================
  // 4. Brief Readability Pause & Ambient Glow Shimmer (0.84 -> 0.90)
  // =========================================================================
  if (bridgeGlow) {
    tl.to(bridgeGlow, {
      scale: 1.25,
      duration: 0.06,
      ease: 'sine.inOut'
    }, 0.84);
  }

  // =========================================================================
  // 5. Book Reveal Preparation: "MY PROJECTS" Lifts Up & Fades Out (0.90 -> 1.00)
  // Finishes completely before Section 3 pins with 3D Book Reveal
  // =========================================================================
  if (wordMy) {
    tl.to(wordMy, {
      y: -50,
      opacity: 0,
      letterSpacing: '0.30em',
      filter: 'blur(10px)',
      duration: 0.08,
      ease: 'power2.in'
    }, 0.90);
  }

  if (wordProjects) {
    tl.to(wordProjects, {
      y: -50,
      opacity: 0,
      letterSpacing: '0.28em',
      filter: 'blur(10px)',
      duration: 0.08,
      ease: 'power2.in'
    }, 0.92);
  }

  if (bridgeSubline) {
    tl.to(bridgeSubline, {
      y: -35,
      opacity: 0,
      filter: 'blur(6px)',
      duration: 0.07,
      ease: 'power2.in'
    }, 0.91);
  }

  if (bridgeGlow) {
    tl.to(bridgeGlow, {
      opacity: 0,
      scale: 1.45,
      duration: 0.08,
      ease: 'power2.in'
    }, 0.91);
  }
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
