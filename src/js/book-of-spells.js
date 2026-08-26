/* ==========================================================================
   INTERACTIVE 3D "BOOK OF SPELLS" (GRIMOIRE) COMPONENT
   - Volumetric 3D Solid Geometry (Thick Leather Slabs, Gap-Free Unified Spine)
   - 360° Unrestricted Drag Orbit (OrbitControls with Full Azimuth & Polar Inspection)
   - Closed-State Mesh Hierarchy (Zero Exposed Pages on Left When Closed)
   - Clean High-Definition Blank Antique Parchment Slates
   - Smooth GSAP ScrollTrigger Page Turns
   ========================================================================== */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ==========================================================================
// 1. PROCEDURAL HIGH-RESOLUTION TEXTURE GENERATORS
// ==========================================================================

/**
 * Generates Grayscale Bump Map for Volumetric Leather Slabs
 */
function generateLeatherBumpCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1400;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 1024, 1400);

  // Micro-grain leather noise
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  for (let i = 0; i < 24000; i++) {
    ctx.fillRect(Math.random() * 1024, Math.random() * 1400, 2, 2);
  }

  // Soft distress lines
  ctx.strokeStyle = '#505050';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 30; i++) {
    ctx.beginPath();
    const sx = Math.random() * 1024;
    const sy = Math.random() * 1400;
    ctx.moveTo(sx, sy);
    ctx.quadraticCurveTo(sx + 50, sy + 30, sx + 120, sy + 10);
    ctx.stroke();
  }

  return canvas;
}

/**
 * Generates Leather Edge Texture for Volumetric Cover Slabs (+X, -X, +Y, -Y)
 */
function generateLeatherEdgeCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  // Deep antique burgundy leather gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 128);
  grad.addColorStop(0, '#0e0304');
  grad.addColorStop(0.3, '#240a0e');
  grad.addColorStop(0.7, '#240a0e');
  grad.addColorStop(1, '#0b0203');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 128);

  // Gold gilt edge bevel stripe
  ctx.fillStyle = 'rgba(212, 175, 55, 0.45)';
  ctx.fillRect(0, 0, 512, 5);
  ctx.fillRect(0, 123, 512, 5);

  // Edge stitching
  ctx.strokeStyle = 'rgba(245, 197, 66, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 7]);
  ctx.beginPath();
  ctx.moveTo(0, 64);
  ctx.lineTo(512, 64);
  ctx.stroke();

  return canvas;
}

/**
 * Generates Back Cover Texture (Deep Antique Burgundy Leather with Gold Seal)
 */
function generateBackCoverCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1400;
  const ctx = canvas.getContext('2d');

  const bgGrad = ctx.createRadialGradient(512, 700, 80, 512, 700, 850);
  bgGrad.addColorStop(0, '#220b0d');
  bgGrad.addColorStop(0.5, '#160608');
  bgGrad.addColorStop(1, '#090203');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 1400);

  // Subtle grain
  ctx.fillStyle = 'rgba(255, 230, 200, 0.025)';
  for (let i = 0; i < 8000; i++) {
    ctx.fillRect(Math.random() * 1024, Math.random() * 1400, 2, 2);
  }

  // Double gold border
  ctx.save();
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.7)';
  ctx.lineWidth = 3.5;
  ctx.shadowColor = 'rgba(245, 197, 66, 0.6)';
  ctx.shadowBlur = 12;
  ctx.strokeRect(40, 40, 944, 1320);

  ctx.strokeStyle = 'rgba(165, 120, 35, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(54, 54, 916, 1292);
  ctx.restore();

  // Central Gold Hogwarts Shield & Motto
  ctx.save();
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(245, 197, 66, 0.75)';
  ctx.shadowBlur = 16;

  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(512, 640, 140, 0, Math.PI * 2);
  ctx.stroke();

  ctx.font = '72px serif';
  ctx.fillText('⚡', 512, 665);

  ctx.font = 'italic 20px "MedievalSharp", Georgia, serif';
  ctx.fillStyle = 'rgba(245, 197, 66, 0.85)';
  ctx.letterSpacing = '2px';
  ctx.fillText('« Draco Dormiens Nunquam Titillandus »', 512, 850);

  ctx.font = '700 22px "Cinzel", Georgia, serif';
  ctx.fillStyle = '#fef08a';
  ctx.letterSpacing = '5px';
  ctx.fillText('HOGWARTS CHRONICLES', 512, 900);
  ctx.restore();

  return canvas;
}

/**
 * Generates Inside Front & Back Cover Texture (Florentine Marbled Endpaper)
 */
function generateInsideCoverCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1600;
  const ctx = canvas.getContext('2d');

  const bgGrad = ctx.createRadialGradient(600, 800, 80, 600, 800, 950);
  bgGrad.addColorStop(0, '#f2e4c8');
  bgGrad.addColorStop(0.5, '#deb882');
  bgGrad.addColorStop(0.85, '#a87948');
  bgGrad.addColorStop(1, '#5c3818');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1200, 1600);

  // Feathered Marbling Veins
  ctx.save();
  ctx.lineWidth = 2.5;
  for (let i = 0; i < 40; i++) {
    ctx.strokeStyle = i % 2 === 0 ? 'rgba(75, 38, 15, 0.22)' : 'rgba(218, 165, 32, 0.25)';
    ctx.beginPath();
    const y0 = i * 42;
    ctx.moveTo(0, y0);
    for (let x = 0; x <= 1200; x += 100) {
      const yOffset = Math.sin((x / 100) + i) * 28 + Math.cos(x / 70) * 14;
      ctx.lineTo(x, y0 + yOffset);
    }
    ctx.stroke();
  }
  ctx.restore();

  // Ex Libris Bookplate Frame
  ctx.save();
  ctx.fillStyle = 'rgba(252, 246, 235, 0.92)';
  ctx.strokeStyle = 'rgba(160, 100, 30, 0.65)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(240, 560, 720, 480, [18]);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#4a250a';
  ctx.font = '900 42px "Cinzel", Georgia, serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('EX LIBRIS', 600, 670);

  ctx.font = '700 50px "Cinzel Decorative", Georgia, serif';
  ctx.fillStyle = '#6e1a1e';
  ctx.fillText('KRISHNA MAKWANA', 600, 770);

  ctx.font = 'italic 24px "MedievalSharp", Georgia, serif';
  ctx.fillStyle = '#5c3614';
  ctx.fillText('Master of Full-Stack Sorcery & Machine Learning', 600, 840);

  ctx.font = '600 20px "Space Grotesk", monospace';
  ctx.fillStyle = '#8c5018';
  ctx.letterSpacing = '3px';
  ctx.fillText('HOGWARTS SCHOOL OF CODE & CRAFT', 600, 910);
  ctx.restore();

  return canvas;
}

/**
 * Generates Closed Paper Edge Block Texture (Gilded / Stratified layered paper)
 */
function generatePageEdgesCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 150;
  const ctx = canvas.getContext('2d');

  const bgGrad = ctx.createLinearGradient(0, 0, 0, 150);
  bgGrad.addColorStop(0, '#ebd8b0');
  bgGrad.addColorStop(0.5, '#d4bc88');
  bgGrad.addColorStop(1, '#b89d62');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 600, 150);

  for (let y = 0; y < 150; y += 2) {
    const darkness = (Math.sin(y * 1.5) * 0.15 + 0.2).toFixed(2);
    ctx.strokeStyle = `rgba(80, 50, 18, ${darkness})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(600, y);
    ctx.stroke();
  }

  for (let i = 0; i < 150; i++) {
    ctx.fillStyle = 'rgba(255, 235, 160, 0.35)';
    ctx.fillRect(Math.random() * 600, Math.random() * 150, Math.random() * 20 + 5, 2);
  }

  return canvas;
}

/**
 * Generates Center Spine Gutter Texture (Seamless leather bind between pages)
 */
function generateSpineGutterCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 256, 0);
  grad.addColorStop(0, '#d9c79e');
  grad.addColorStop(0.35, '#8c6b3e');
  grad.addColorStop(0.5, '#1e1108');
  grad.addColorStop(0.65, '#8c6b3e');
  grad.addColorStop(1, '#d9c79e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 1024);

  ctx.strokeStyle = 'rgba(245, 197, 66, 0.65)';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 10]);
  ctx.beginPath();
  ctx.moveTo(128, 20);
  ctx.lineTo(128, 1004);
  ctx.stroke();

  return canvas;
}

/**
 * Generates Curved Leather Spine Texture with 5 Raised Gilded Ribs
 */
function generateSpineCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 1400;
  const ctx = canvas.getContext('2d');

  const bgGrad = ctx.createLinearGradient(0, 0, 300, 0);
  bgGrad.addColorStop(0, '#0e0304');
  bgGrad.addColorStop(0.5, '#1e080b');
  bgGrad.addColorStop(1, '#0e0304');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 300, 1400);

  const ribPositions = [150, 420, 700, 980, 1250];
  ribPositions.forEach((ry) => {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.fillRect(0, ry - 12, 300, 24);

    const ribGrad = ctx.createLinearGradient(0, 0, 300, 0);
    ribGrad.addColorStop(0, '#8c6d23');
    ribGrad.addColorStop(0.5, '#fef08a');
    ribGrad.addColorStop(1, '#8c6d23');
    ctx.fillStyle = ribGrad;
    ctx.fillRect(15, ry - 6, 270, 12);

    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(15, ry - 6, 270, 12);
    ctx.restore();
  });

  ctx.save();
  ctx.translate(150, 700);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fef3c7';
  ctx.font = '900 32px "Cinzel", Georgia, serif';
  ctx.letterSpacing = '6px';
  ctx.shadowColor = 'rgba(245, 197, 66, 0.8)';
  ctx.shadowBlur = 10;
  ctx.fillText('THE GRIMOIRE OF SPELLS', 0, 10);
  ctx.restore();

  return canvas;
}

/**
 * Generates Clean High-Definition Blank Aged Parchment
 * (Zero dummy text, zero backward-mirrored text, beautiful antique deckled margins)
 */
function generateCleanBlankParchmentCanvas(isLeft) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1600;
  const ctx = canvas.getContext('2d');

  // Rich antique parchment radial vignette
  const grad = ctx.createRadialGradient(600, 800, 180, 600, 800, 950);
  grad.addColorStop(0, '#fcf8ec');
  grad.addColorStop(0.4, '#f5e9ce');
  grad.addColorStop(0.75, '#e4d0a2');
  grad.addColorStop(1, '#be9d62');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1200, 1600);

  // Micro organic parchment fiber flecks
  ctx.fillStyle = 'rgba(95, 60, 20, 0.032)';
  for (let i = 0; i < 4000; i++) {
    ctx.fillRect(Math.random() * 1200, Math.random() * 1600, Math.random() * 3 + 1, Math.random() * 2 + 1);
  }

  // Soft antique age spots / tea stains
  for (let i = 0; i < 6; i++) {
    const rx = Math.random() * 1000 + 100;
    const ry = Math.random() * 1400 + 100;
    const spotGrad = ctx.createRadialGradient(rx, ry, 5, rx, ry, Math.random() * 120 + 60);
    spotGrad.addColorStop(0, 'rgba(120, 75, 25, 0.045)');
    spotGrad.addColorStop(1, 'rgba(120, 75, 25, 0)');
    ctx.fillStyle = spotGrad;
    ctx.beginPath();
    ctx.arc(rx, ry, 180, 0, Math.PI * 2);
    ctx.fill();
  }

  // Delicate weathered double margin lines
  ctx.save();
  ctx.strokeStyle = 'rgba(163, 116, 44, 0.42)';
  ctx.lineWidth = 2;
  ctx.strokeRect(50, 50, 1100, 1500);

  ctx.strokeStyle = 'rgba(163, 116, 44, 0.2)';
  ctx.lineWidth = 1;
  ctx.strokeRect(62, 62, 1076, 1476);

  // Vintage corner flourishes
  const drawCornerFlourish = (x, y, flipX, flipY) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
    ctx.strokeStyle = 'rgba(163, 116, 44, 0.55)';
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(12, 35);
    ctx.quadraticCurveTo(12, 12, 35, 12);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(12, 12, 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(163, 116, 44, 0.6)';
    ctx.fill();
    ctx.restore();
  };

  drawCornerFlourish(62, 62, false, false);
  drawCornerFlourish(1138, 62, true, false);
  drawCornerFlourish(62, 1538, false, true);
  drawCornerFlourish(1138, 1538, true, true);

  // Subtle binding shadow on the spine gutter side
  const gutterX = isLeft ? 1160 : 40;
  const shadowGrad = ctx.createLinearGradient(gutterX, 0, isLeft ? 1080 : 120, 0);
  shadowGrad.addColorStop(0, 'rgba(60, 35, 12, 0.18)');
  shadowGrad.addColorStop(1, 'rgba(60, 35, 12, 0)');
  ctx.fillStyle = shadowGrad;
  ctx.fillRect(isLeft ? 1060 : 40, 50, 100, 1500);

  ctx.restore();

  return canvas;
}

// ==========================================================================
// 2. THREE.JS 3D GRIMOIRE MODEL & RIGGING (Volumetric Slabs + 360° Orbit)
// ==========================================================================

export class BookOfSpellsViewer {
  constructor(container) {
    this.container = container;
    this.currentSpreadIndex = 0;
    this.isBookOpen = false;

    // Three.js Core
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null; // Unrestricted 360° OrbitControls
    this.bookGroup = null;
    this.frontCoverGroup = null;
    this.spineGutterMesh = null;
    this.baseLeftPage = null;
    this.leafMeshes = [];

    // Volumetric 3D Dimensions (Physical Slab Thickness)
    this.pageIndent = 0.04;
    this.pageWidth = 2.45;
    this.pageHeight = 3.50;
    this.bookThickness = 0.26; // Substantial solid grimoire paper block
    this.coverWidth = this.pageWidth + 0.12;
    this.coverHeight = this.pageHeight + 0.16;
    this.coverDepth = 0.08; // Thick bevelled leather covers (No 2D flat cardboard!)

    this.animationFrameId = null;
    this.clock = new THREE.Clock();
    this.isDisposed = false;

    this.init();
  }

  init() {
    this.setupRenderer();
    this.setupSceneAndCamera();
    this.setupLighting();
    this.buildVolumetricBookModel();
    this.setupOrbitControls();
    this.setupScrollTrigger();
    this.setupEventListeners();
    this.animate();
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Touch and cursor setup for OrbitControls
    this.renderer.domElement.style.touchAction = 'pan-y'; // Allows natural vertical page scroll
    this.renderer.domElement.style.cursor = 'grab';

    this.container.appendChild(this.renderer.domElement);
  }

  setupSceneAndCamera() {
    this.scene = new THREE.Scene();

    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(44, aspect, 0.1, 100);
    this.camera.position.set(0, 0, 5.8);
    this.camera.lookAt(0, 0, 0);

    this.bookGroup = new THREE.Group();
    this.bookGroup.scale.set(1.0, 1.0, 1.0);
    this.bookGroup.rotation.set(0.04, 0, 0);

    // Initial closed state: offset by -pageWidth/2 so the closed front cover is centered in viewport
    this.bookGroup.position.set(-this.pageWidth / 2, 0, 0);

    this.scene.add(this.bookGroup);
  }

  /**
   * Unrestricted 360° Click-and-Drag OrbitControls
   * Allows full rotation from all angles with smooth inertia damping
   */
  setupOrbitControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enablePan = false;
    this.controls.enableZoom = false; // Does not hijack mousewheel scroll
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.rotateSpeed = 0.85;

    // Unlocked 360° horizontal rotation and wide vertical polar range
    this.controls.minAzimuthAngle = -Infinity;
    this.controls.maxAzimuthAngle = Infinity;
    this.controls.minPolarAngle = Math.PI * 0.08; // Full top-down inspection
    this.controls.maxPolarAngle = Math.PI * 0.92; // Full bottom-up inspection
  }

  setupLighting() {
    // Pure neutral studio lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.25);
    this.scene.add(ambientLight);

    // Key directional light with soft shadows
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(3, 4, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    this.scene.add(keyLight);

    // Cool moonlight rim light
    const coolMoonlight = new THREE.DirectionalLight(0x8faec9, 0.75);
    coolMoonlight.position.set(-5, 2, 4);
    this.scene.add(coolMoonlight);

    // Soft neutral fill
    const softFill = new THREE.DirectionalLight(0xffffff, 0.45);
    softFill.position.set(5, 1, 4);
    this.scene.add(softFill);
  }

  /**
   * Builds the Realistic Volumetric 3D Book
   * - Front and Back Covers are thick 3D Box slabs (depth 0.08) with leather edges
   * - Curved cylindrical spine on left bridging covers with zero gaps
   * - Solid contiguous paper block underneath (zero hollow void)
   * - Clean blank antique parchment for all pages
   */
  buildVolumetricBookModel() {
    const W = this.coverWidth;
    const H = this.coverHeight;
    const cD = this.coverDepth; // 0.08 units physical slab thickness
    const T = this.bookThickness;
    const pIndent = this.pageIndent;

    const textureLoader = new THREE.TextureLoader();

    // 1. Core Textures
    const coverTex = textureLoader.load('/assets/magic_cover.jpg', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
      tex.needsUpdate = true;
    });

    const bumpCanvas = generateLeatherBumpCanvas();
    const bumpTex = new THREE.CanvasTexture(bumpCanvas);
    bumpTex.anisotropy = 4;

    const leatherEdgeCanvas = generateLeatherEdgeCanvas();
    const leatherEdgeTex = new THREE.CanvasTexture(leatherEdgeCanvas);
    leatherEdgeTex.wrapS = THREE.RepeatWrapping;
    leatherEdgeTex.wrapT = THREE.RepeatWrapping;

    const leatherEdgeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: leatherEdgeTex,
      bumpMap: bumpTex,
      bumpScale: 0.02,
      roughness: 0.55,
      metalness: 0.1,
      depthTest: true,
      depthWrite: true
    });

    const insideCoverCanvas = generateInsideCoverCanvas();
    const insideCoverTex = new THREE.CanvasTexture(insideCoverCanvas);
    insideCoverTex.colorSpace = THREE.SRGBColorSpace;
    insideCoverTex.anisotropy = 4;

    const innerCoverMat = new THREE.MeshStandardMaterial({
      map: insideCoverTex,
      roughness: 0.85,
      metalness: 0.05,
      depthTest: true,
      depthWrite: true
    });

    // 2. Volumetric Front Cover Slab (BoxGeometry with depth cD)
    this.frontCoverGroup = new THREE.Group();
    this.frontCoverGroup.position.set(0, 0, 0);

    const frontCoverGeo = new THREE.BoxGeometry(W, H, cD, 4, 4, 1);
    // Pivot strictly along the spine hinge at x = 0
    frontCoverGeo.translate(W / 2, 0, cD / 2);

    const outerCoverMat = new THREE.MeshStandardMaterial({
      map: coverTex,
      color: 0xffffff,
      bumpMap: bumpTex,
      bumpScale: 0.015,
      roughness: 0.35,
      metalness: 0.05,
      emissive: 0x000000,
      depthTest: true,
      depthWrite: true
    });

    // 6-face materials for volumetric slab:
    // [right (+X), left (-X), top (+Y), bottom (-Y), front (+Z), back (-Z)]
    const frontCoverMaterials = [
      leatherEdgeMat, // right (+X)
      leatherEdgeMat, // left (-X spine)
      leatherEdgeMat, // top (+Y)
      leatherEdgeMat, // bottom (-Y)
      outerCoverMat,  // front (+Z) Magic cover artwork
      innerCoverMat   // back (-Z) Florentine marbled endpaper
    ];

    const frontCoverMesh = new THREE.Mesh(frontCoverGeo, frontCoverMaterials);
    frontCoverMesh.castShadow = true;
    frontCoverMesh.receiveShadow = true;
    this.frontCoverGroup.add(frontCoverMesh);
    this.bookGroup.add(this.frontCoverGroup);

    // 3. Volumetric Back Cover Slab (BoxGeometry with depth cD)
    const backCoverCanvas = generateBackCoverCanvas();
    const backCoverTex = new THREE.CanvasTexture(backCoverCanvas);
    backCoverTex.colorSpace = THREE.SRGBColorSpace;
    backCoverTex.anisotropy = 4;

    const backOuterCoverMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: backCoverTex,
      bumpMap: bumpTex,
      bumpScale: 0.02,
      roughness: 0.55,
      metalness: 0.1,
      depthTest: true,
      depthWrite: true
    });

    const backCoverGeo = new THREE.BoxGeometry(W, H, cD, 4, 4, 1);
    backCoverGeo.translate(W / 2, 0, -T - cD / 2);

    const backCoverMaterials = [
      leatherEdgeMat,   // right (+X)
      leatherEdgeMat,   // left (-X)
      leatherEdgeMat,   // top (+Y)
      leatherEdgeMat,   // bottom (-Y)
      innerCoverMat,    // inside (+Z)
      backOuterCoverMat // outside back (-Z)
    ];

    const backCoverMesh = new THREE.Mesh(backCoverGeo, backCoverMaterials);
    backCoverMesh.receiveShadow = true;
    this.bookGroup.add(backCoverMesh);

    // 4. Solid Unified Curved Spine along x = 0 (Zero Hollow Gap)
    // Span from front cover outer face (z = cD) to back cover outer face (z = -T - cD)
    const totalSpan = T + cD * 2;
    const spineRadius = totalSpan / 2;
    const zCenter = -T / 2;

    const spineCanvas = generateSpineCanvas();
    const spineTex = new THREE.CanvasTexture(spineCanvas);
    spineTex.colorSpace = THREE.SRGBColorSpace;
    spineTex.anisotropy = 4;

    // Cylinder with closed endcaps and half-circle arc wrapping from front cover to back cover
    const spineGeo = new THREE.CylinderGeometry(
      spineRadius,
      spineRadius,
      H,
      32,
      1,
      false,
      Math.PI / 2,
      Math.PI
    );
    spineGeo.translate(0, 0, zCenter);

    const spineMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: spineTex,
      bumpMap: bumpTex,
      bumpScale: 0.02,
      roughness: 0.55,
      metalness: 0.1,
      depthTest: true,
      depthWrite: true
    });
    const spineMesh = new THREE.Mesh(spineGeo, spineMat);
    spineMesh.receiveShadow = true;
    this.bookGroup.add(spineMesh);

    // Solid inner spine backing core (fills any internal hollow gap between pages and spine)
    const spineCoreGeo = new THREE.BoxGeometry(spineRadius * 0.9, H * 0.98, T);
    spineCoreGeo.translate(-spineRadius * 0.45, 0, zCenter);
    const spineCoreMat = new THREE.MeshStandardMaterial({
      color: 0x160608,
      roughness: 0.9,
      depthTest: true,
      depthWrite: true
    });
    const spineCoreMesh = new THREE.Mesh(spineCoreGeo, spineCoreMat);
    this.bookGroup.add(spineCoreMesh);

    // 5. Solid Contiguous Closed Paper Block (Zero see-through cracks)
    const pageEdgesCanvas = generatePageEdgesCanvas();
    const pageEdgesTex = new THREE.CanvasTexture(pageEdgesCanvas);
    pageEdgesTex.colorSpace = THREE.SRGBColorSpace;
    pageEdgesTex.wrapS = THREE.RepeatWrapping;
    pageEdgesTex.wrapT = THREE.RepeatWrapping;
    pageEdgesTex.repeat.set(3, 1);

    const paperEdgesMat = new THREE.MeshStandardMaterial({
      map: pageEdgesTex,
      roughness: 0.88,
      metalness: 0.08,
      depthTest: true,
      depthWrite: true
    });

    const blankLeftCanvas = generateCleanBlankParchmentCanvas(true);
    const blankLeftTex = new THREE.CanvasTexture(blankLeftCanvas);
    blankLeftTex.colorSpace = THREE.SRGBColorSpace;

    const blankRightCanvas = generateCleanBlankParchmentCanvas(false);
    const blankRightTex = new THREE.CanvasTexture(blankRightCanvas);
    blankRightTex.colorSpace = THREE.SRGBColorSpace;

    const blankParchmentMat = new THREE.MeshStandardMaterial({
      map: blankRightTex,
      roughness: 0.88,
      metalness: 0.02,
      depthTest: true,
      depthWrite: true
    });

    // Solid 3D Box for the entire paper block
    const solidBlockGeo = new THREE.BoxGeometry(this.pageWidth, this.pageHeight, T);
    solidBlockGeo.translate(pIndent + this.pageWidth / 2, 0, zCenter);

    const solidBlockMaterials = [
      paperEdgesMat,    // right edge (+X)
      paperEdgesMat,    // left edge (-X inside spine)
      paperEdgesMat,    // top edge (+Y)
      paperEdgesMat,    // bottom edge (-Y)
      blankParchmentMat,// top face (+Z)
      blankParchmentMat // bottom face (-Z)
    ];
    const solidBlockMesh = new THREE.Mesh(solidBlockGeo, solidBlockMaterials);
    solidBlockMesh.receiveShadow = true;
    this.bookGroup.add(solidBlockMesh);

    // 6. Seamless Center Spine Gutter Mesh
    const gutterCanvas = generateSpineGutterCanvas();
    const gutterTex = new THREE.CanvasTexture(gutterCanvas);
    gutterTex.colorSpace = THREE.SRGBColorSpace;

    const gutterGeo = new THREE.PlaneGeometry(0.18, this.pageHeight * 1.01, 8, 1);
    const gutterPos = gutterGeo.attributes.position;
    for (let i = 0; i < gutterPos.count; i++) {
      const gx = gutterPos.getX(i);
      const gz = -Math.cos((gx / 0.09) * (Math.PI / 2)) * 0.02;
      gutterPos.setZ(i, gz);
    }
    gutterPos.needsUpdate = true;
    gutterGeo.computeVertexNormals();

    const gutterMat = new THREE.MeshStandardMaterial({
      map: gutterTex,
      roughness: 0.85,
      metalness: 0.05,
      side: THREE.DoubleSide,
      depthTest: true,
      depthWrite: true
    });
    this.spineGutterMesh = new THREE.Mesh(gutterGeo, gutterMat);
    this.spineGutterMesh.position.set(0, 0, 0.005);
    this.spineGutterMesh.visible = false; // Strictly hidden when closed
    this.bookGroup.add(this.spineGutterMesh);

    // 7. Base Left Page (Clean Blank Slate, STRICTLY HIDDEN WHEN CLOSED)
    const baseLeftGeo = new THREE.PlaneGeometry(this.pageWidth, this.pageHeight);
    baseLeftGeo.translate(-pIndent - this.pageWidth / 2, 0, 0);
    const baseLeftMat = new THREE.MeshStandardMaterial({
      map: blankLeftTex,
      roughness: 0.88,
      metalness: 0.02,
      side: THREE.FrontSide,
      depthTest: true,
      depthWrite: true
    });
    this.baseLeftPage = new THREE.Mesh(baseLeftGeo, baseLeftMat);
    this.baseLeftPage.position.set(0, 0, -cD + 0.005);
    this.baseLeftPage.visible = false; // Hidden when closed! No exposed left page bug!
    this.bookGroup.add(this.baseLeftPage);

    // 8. Dynamic Flipping Leaves (Total: 4 blank parchment leaves)
    const totalFlips = 4;
    this.leafMeshes = [];
    const segmentsX = 36;
    const segmentsY = 18;

    for (let k = 0; k < totalFlips; k++) {
      const geo = new THREE.PlaneGeometry(this.pageWidth, this.pageHeight, segmentsX, segmentsY);
      geo.translate(pIndent + this.pageWidth / 2, 0, 0);
      geo.userData = {
        origPositions: geo.attributes.position.array.slice()
      };

      const frontMat = new THREE.MeshStandardMaterial({
        map: blankRightTex, // High-def clean blank right parchment
        roughness: 0.88,
        metalness: 0.02,
        side: THREE.FrontSide,
        depthTest: true,
        depthWrite: true
      });

      const backMat = new THREE.MeshStandardMaterial({
        map: blankLeftTex, // High-def clean blank left parchment
        roughness: 0.88,
        metalness: 0.02,
        side: THREE.BackSide,
        depthTest: true,
        depthWrite: true
      });

      const leafGroup = new THREE.Group();
      const frontMesh = new THREE.Mesh(geo, frontMat);
      frontMesh.position.z = 0.001;
      frontMesh.castShadow = true;
      frontMesh.receiveShadow = true;

      const backMesh = new THREE.Mesh(geo, backMat);
      backMesh.position.z = -0.001;
      backMesh.castShadow = true;
      backMesh.receiveShadow = true;

      leafGroup.add(frontMesh);
      leafGroup.add(backMesh);

      // Stacked neatly on the right side when closed
      const zStack = -0.015 - k * (T / (totalFlips + 1));
      leafGroup.position.set(0, 0, zStack);
      leafGroup.visible = false; // Hidden when book is closed!

      this.bookGroup.add(leafGroup);
      this.leafMeshes.push({
        group: leafGroup,
        geometry: geo,
        frontMesh,
        backMesh,
        angle: 0,
        restingZ: zStack
      });
    }
  }

  /**
   * Applies realistic paper curvature and bend physics during page turn
   */
  deformLeafGeometry(leafItem, theta) {
    const geo = leafItem.geometry;
    const pos = geo.attributes.position;
    const orig = geo.userData.origPositions;
    const W = this.pageWidth;

    const isTurning = theta > 0.001 && theta < Math.PI - 0.001;

    for (let i = 0; i < pos.count; i++) {
      const idx = i * 3;
      const ox = orig[idx];
      const oy = orig[idx + 1];
      const u = Math.max(0, Math.min(1, (ox - this.pageIndent) / W));

      if (!isTurning) {
        pos.array[idx] = ox;
        pos.array[idx + 1] = oy;
        pos.array[idx + 2] = 0;
      } else {
        // Natural page arching & outer edge curling mid-flight
        const lift = Math.sin(theta) * 0.28 * Math.sin(u * Math.PI);
        const curl = Math.sin(theta) * 0.08 * Math.pow(u, 2);

        pos.array[idx] = ox - Math.sin(theta) * 0.05 * u;
        pos.array[idx + 1] = oy;
        pos.array[idx + 2] = lift + curl;
      }
    }

    pos.needsUpdate = true;
    geo.computeVertexNormals();
  }

  setupScrollTrigger() {
    const section = document.getElementById('projects');
    if (!section) return;

    const topNav = document.getElementById('top-right-nav');

    const trigger = ScrollTrigger.create({
      trigger: '#projects',
      start: 'top top',
      end: '+=3600',
      pin: true,
      scrub: 1.2,
      anticipatePin: 1,
      onEnter: () => {
        if (topNav) topNav.classList.add('nav-hidden');
      },
      onEnterBack: () => {
        if (topNav) topNav.classList.add('nav-hidden');
      },
      onLeave: () => {
        if (topNav) topNav.classList.remove('nav-hidden');
      },
      onLeaveBack: () => {
        // Handled when returning to skills/hero
      },
      onUpdate: (self) => {
        if (topNav && !topNav.classList.contains('nav-hidden')) {
          topNav.classList.add('nav-hidden');
        }
        this.updateScrollSequence(self.progress);
      }
    });

    this.scrollTrigger = trigger;
  }

  /**
   * Scroll Sequence Driver:
   * Progress in [0, 0.18]: Phase 1 - Front Cover Opens forward towards viewer (0 to -180 deg)
   *                                  Book shifts from X = -W/2 to 0 (Symmetrically Centered)
   * Progress in [0.18, 1.0]: Phase 2 - Multi-spread pages flip from right to left (0 to -180 deg)
   */
  updateScrollSequence(progress) {
    const coverPhaseEnd = 0.18;
    const halfWidth = this.pageWidth / 2;

    if (progress <= coverPhaseEnd) {
      // Phase 1: Book Opens from completely closed to fully open
      const coverNorm = progress / coverPhaseEnd; // 0 to 1
      const easeT = gsap.parseEase('power2.inOut')(coverNorm);

      // Rotate counter-clockwise towards viewer: 0 to -Math.PI (-180 deg)
      const coverAngle = -easeT * Math.PI;

      // Group smoothly translates from -halfWidth to 0 so closed book is centered, and open book is centered
      if (this.bookGroup) {
        this.bookGroup.position.x = -halfWidth * (1 - easeT);
      }

      if (this.frontCoverGroup) {
        this.frontCoverGroup.rotation.y = coverAngle;
        this.frontCoverGroup.position.z = 0.01 + Math.sin(easeT * Math.PI) * 0.18;
      }

      // STRICT CLOSED-STATE HIERARCHY:
      // When closed (progress <= 0.02), HIDE internal pages so zero geometry peeks out on left
      const isOpening = progress > 0.02;
      this.leafMeshes.forEach((leaf) => {
        leaf.group.visible = isOpening;
        leaf.group.rotation.y = 0;
        leaf.angle = 0;
        this.deformLeafGeometry(leaf, 0);
        leaf.group.position.z = leaf.restingZ;
      });

      // Left page only becomes visible as the front cover opens up
      if (this.baseLeftPage) {
        this.baseLeftPage.visible = progress > 0.08;
      }

      if (this.spineGutterMesh) {
        this.spineGutterMesh.visible = progress > 0.10;
      }

      this.isBookOpen = progress > 0.06;

    } else {
      // Phase 2: Front Cover is fully open on the left (-180 deg), book stays centered at X = 0
      if (this.bookGroup) {
        this.bookGroup.position.x = 0;
      }

      if (this.frontCoverGroup) {
        this.frontCoverGroup.rotation.y = -Math.PI;
        this.frontCoverGroup.position.z = 0.01;
      }

      if (this.baseLeftPage) {
        this.baseLeftPage.visible = true;
      }

      if (this.spineGutterMesh) {
        this.spineGutterMesh.visible = true;
      }

      this.isBookOpen = true;

      // Page flips mapped across remaining scroll
      const pageNorm = (progress - coverPhaseEnd) / (1.0 - coverPhaseEnd); // 0 to 1
      const totalFlips = this.leafMeshes.length;
      const rawPageProg = pageNorm * totalFlips;
      const clampedPageProg = Math.max(0, Math.min(totalFlips, rawPageProg));

      for (let k = 0; k < totalFlips; k++) {
        const leafItem = this.leafMeshes[k];
        leafItem.group.visible = true;

        let leafProgress = 0;
        if (clampedPageProg >= k + 1) {
          leafProgress = 1;
        } else if (clampedPageProg <= k) {
          leafProgress = 0;
        } else {
          leafProgress = clampedPageProg - k;
        }

        const theta = leafProgress * Math.PI;
        leafItem.angle = theta;

        // Rotate leaf counter-clockwise from 0 to -180 deg towards viewer
        leafItem.group.rotation.y = -theta;
        this.deformLeafGeometry(leafItem, theta);

        if (leafProgress >= 0.999) {
          // Resting flat on the left
          leafItem.group.position.z = 0.01 + k * 0.003;
        } else if (leafProgress <= 0.001) {
          // Resting flat on the right
          leafItem.group.position.z = leafItem.restingZ;
        } else {
          // In mid-flight
          leafItem.group.position.z = 0.14;
        }
      }

      const activeIndex = Math.min(totalFlips, Math.round(clampedPageProg));
      if (activeIndex !== this.currentSpreadIndex) {
        this.currentSpreadIndex = activeIndex;
      }
    }
  }

  setupEventListeners() {
    this.onResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.onResize);

    // Cursor state indicator for interactive click-and-drag OrbitControls
    this.onPointerDown = () => {
      if (this.renderer && this.renderer.domElement) {
        this.renderer.domElement.style.cursor = 'grabbing';
      }
    };
    this.onPointerUp = () => {
      if (this.renderer && this.renderer.domElement) {
        this.renderer.domElement.style.cursor = 'grab';
      }
    };

    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown);
    }
    window.addEventListener('pointerup', this.onPointerUp);
  }

  handleResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    if (this.isDisposed) return;
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));

    // Update 360° OrbitControls with silky-smooth inertia damping
    if (this.controls) {
      this.controls.update();
    }

    const time = this.clock.getElapsedTime();

    // Gentle floating breathing on bookGroup
    if (this.bookGroup) {
      this.bookGroup.position.y = Math.sin(time * 1.4) * 0.025;
    }

    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Programmatic folio navigation
   */
  flipToSpread(index) {
    if (index < 0 || index >= 5) return;
    const coverPhaseEnd = 0.18;
    const totalFlips = 4;
    const targetProgress = coverPhaseEnd + (index / totalFlips) * (1.0 - coverPhaseEnd);

    if (this.scrollTrigger) {
      const scrollPos = this.scrollTrigger.start + targetProgress * (this.scrollTrigger.end - this.scrollTrigger.start);
      window.scrollTo({ top: scrollPos, behavior: 'smooth' });
    }
  }

  dispose() {
    this.isDisposed = true;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('pointerup', this.onPointerUp);

    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.removeEventListener('pointerdown', this.onPointerDown);
    }

    if (this.controls) {
      this.controls.dispose();
    }

    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
    }

    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.remove();
      this.renderer.dispose();
    }
  }
}

// ==========================================================================
// 3. MODULE EXPORT INITIALIZER
// ==========================================================================
let activeBookInstance = null;

export function initBookOfSpells() {
  const container = document.getElementById('book-of-spells-canvas-wrap');
  if (!container) return null;

  if (activeBookInstance) {
    activeBookInstance.dispose();
  }

  activeBookInstance = new BookOfSpellsViewer(container);
  return activeBookInstance;
}
