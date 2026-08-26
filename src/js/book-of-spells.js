/* ==========================================================================
   INTERACTIVE 3D "BOOK OF SPELLS" (GRIMOIRE) COMPONENT
   - Permanent Mounting & Full Visibility (scale: 1, translateX: 0, opacity: 1)
   - Correct Pinned GSAP ScrollTrigger Sequence (pin: true on #projects, end: "+=3500", scrub: 1)
     * [0% - 70%]: Book starts closed in center -> Opens -> Flips parchment pages sequentially
     * [70% - 85%]: Book smoothly swings closed back to the center grimoire state
     * [85% - 90%]: Glowing boundary box frame & corner filigrees fade in (opacity: 0 -> 1)
     * [90% - 100%]: Container zooms out (scale: 1 -> 0.75) and glides out to left (xPercent: 0 -> -120)
     (Exit zoom/glide strictly runs ONLY at progress > 0.90, never on load!)
   - Authentic Cinematic Hogwarts Front Cover Artwork (Magic (1)_3.jpg)
   - Clean High-Definition Blank Vintage Parchment Pages
   - Watertight Parametric Spine Arch & Solid Integral Leather Back Cover
   - Camera at (0, 0, 5) with near: 0.1, far: 1000 and Vibrant Three-Point Lighting
   - Unrestricted 360° Drag OrbitControls with Smooth Inertia Damping
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
 * Generates Grayscale Leather Bump Map
 */
function generateLeatherBumpCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1400;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 1024, 1400);

  // Micro-grain
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  for (let i = 0; i < 25000; i++) {
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
 * Generates Dark Antique Weathered Leather Texture (for Cover Slabs & Spine)
 */
function generateAntiqueLeatherCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1400;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(512, 700, 100, 512, 700, 900);
  grad.addColorStop(0, '#1c080b');
  grad.addColorStop(0.5, '#120406');
  grad.addColorStop(1, '#080102');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1400);

  ctx.fillStyle = 'rgba(255, 230, 200, 0.03)';
  for (let i = 0; i < 15000; i++) {
    ctx.fillRect(Math.random() * 1024, Math.random() * 1400, 2, 2);
  }

  ctx.save();
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(30, 30, 964, 1340);

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.15)';
  ctx.lineWidth = 1;
  ctx.strokeRect(42, 42, 940, 1316);
  ctx.restore();

  return canvas;
}

/**
 * Generates Curved Leather Spine Texture with 5 Raised Gilded Ribs
 */
function generateSpineCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 1400;
  const ctx = canvas.getContext('2d');

  const bgGrad = ctx.createLinearGradient(0, 0, 400, 0);
  bgGrad.addColorStop(0, '#0a0203');
  bgGrad.addColorStop(0.2, '#1a070a');
  bgGrad.addColorStop(0.5, '#260a0e');
  bgGrad.addColorStop(0.8, '#1a070a');
  bgGrad.addColorStop(1, '#0a0203');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 400, 1400);

  const ribPositions = [150, 420, 700, 980, 1250];
  ribPositions.forEach((ry) => {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.fillRect(0, ry - 14, 400, 28);

    const ribGrad = ctx.createLinearGradient(0, 0, 400, 0);
    ribGrad.addColorStop(0, '#755418');
    ribGrad.addColorStop(0.5, '#fef08a');
    ribGrad.addColorStop(1, '#755418');
    ctx.fillStyle = ribGrad;
    ctx.fillRect(20, ry - 7, 360, 14);

    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(20, ry - 7, 360, 14);
    ctx.restore();
  });

  ctx.save();
  ctx.translate(200, 700);
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
 * Generates Florentine Marbled Endpaper for Inside Front Cover
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

  return canvas;
}

/**
 * Generates Closed Paper Edge Block Texture (Gilded layered paper)
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
 * Generates Clean High-Resolution Blank Vintage Parchment Texture
 * (PURE CLEAN SLATE: Zero dummy text, zero headers, zero titles, zero badges, zero overlays)
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
  ctx.fillStyle = 'rgba(95, 60, 20, 0.035)';
  for (let i = 0; i < 4000; i++) {
    ctx.fillRect(Math.random() * 1200, Math.random() * 1600, Math.random() * 3 + 1, Math.random() * 2 + 1);
  }

  // Soft vintage age patina
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

  // Soft binding gutter shadow on the spine side
  const gutterX = isLeft ? 1160 : 40;
  const shadowGrad = ctx.createLinearGradient(gutterX, 0, isLeft ? 1080 : 120, 0);
  shadowGrad.addColorStop(0, 'rgba(60, 35, 12, 0.18)');
  shadowGrad.addColorStop(1, 'rgba(60, 35, 12, 0)');
  ctx.fillStyle = shadowGrad;
  ctx.fillRect(isLeft ? 1060 : 40, 50, 100, 1500);

  ctx.restore();

  return canvas;
}

/**
 * Creates Bevelled Cover Board Geometry (inner face at z = 0, outer face at z = cD + 2*bevelThickness = 0.08)
 */
function createBevelledCoverBoard(W, H, cD, r) {
  const shape = new THREE.Shape();
  shape.moveTo(0, -H / 2);
  shape.lineTo(W - r, -H / 2);
  shape.quadraticCurveTo(W, -H / 2, W, -H / 2 + r);
  shape.lineTo(W, H / 2 - r);
  shape.quadraticCurveTo(W, H / 2, W - r, H / 2);
  shape.lineTo(0, H / 2);
  shape.closePath();

  const bevelThickness = 0.015;
  const bevelSize = 0.015;
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: cD,
    bevelEnabled: true,
    bevelThickness: bevelThickness,
    bevelSize: bevelSize,
    bevelSegments: 4,
    curveSegments: 16
  });

  // Shift by bevelThickness so inner face is at z = 0 and outer face at z = cD + 2 * bevelThickness = 0.080
  geo.translate(0, 0, bevelThickness);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Creates Seamless Watertight Parametric Spine Arch Geometry
 */
function createParametricSpineArchGeometry(Rout, Rin, H, segments = 36) {
  const shape = new THREE.Shape();
  shape.moveTo(0, Rout);
  for (let i = 1; i <= segments; i++) {
    const theta = (i / segments) * Math.PI;
    shape.lineTo(-Rout * Math.sin(theta), Rout * Math.cos(theta));
  }
  shape.lineTo(0, -Rin);
  for (let i = segments - 1; i >= 0; i--) {
    const theta = (i / segments) * Math.PI;
    shape.lineTo(-Rin * Math.sin(theta), Rin * Math.cos(theta));
  }
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: H,
    bevelEnabled: false
  });
  geo.rotateX(Math.PI / 2);
  geo.translate(0, H / 2, 0);

  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const angle = Math.atan2(-x, z);
    const u = Math.max(0, Math.min(1, angle / Math.PI));
    const v = Math.max(0, Math.min(1, (y + H / 2) / H));
    uv.setXY(i, u, v);
  }

  geo.computeVertexNormals();
  return geo;
}

// ==========================================================================
// 2. THREE.JS 3D GRIMOIRE MODEL & RIGGING (Clean Slate Pages + 360° Controls)
// ==========================================================================

export class BookOfSpellsViewer {
  constructor(container) {
    this.container = container;
    this.stage = document.getElementById('book-of-spells-stage');
    this.cornerAccents = this.stage ? this.stage.querySelectorAll('.stage-corner-accent') : [];

    this.currentSpreadIndex = 0;
    this.isBookOpen = false;

    // Three.js Core
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.bookGroup = null;
    this.frontCoverGroup = null;
    this.baseLeftPage = null;
    this.leafMeshes = [];

    // Unified Proportions
    this.pageWidth = 2.38;
    this.pageHeight = 3.40;
    this.paperThickness = 0.22;
    this.coverThickness = 0.05; // Base depth cD
    this.boardTotalThickness = 0.08; // cD + 2 * bevelThickness = 0.05 + 0.03 = 0.08
    this.coverOverhang = 0.05;

    this.coverWidth = this.pageWidth + this.coverOverhang + 0.02; // 2.45
    this.coverHeight = this.pageHeight + this.coverOverhang * 2;   // 3.50

    this.spineRout = this.paperThickness / 2 + this.boardTotalThickness; // 0.11 + 0.08 = 0.19
    this.spineRin = this.paperThickness / 2; // 0.11

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

    // Explicit initial state reset: book closed in center, stage scale: 1, opacity: 1
    this.resetStageStyles();
    this.updateScrollSequence(0);

    this.animate();
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.renderer.setSize(width, height);

    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.renderer.domElement.style.touchAction = 'pan-y';
    this.renderer.domElement.style.cursor = 'grab';
    this.renderer.domElement.style.display = 'block';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';

    this.container.appendChild(this.renderer.domElement);
  }

  setupSceneAndCamera() {
    this.scene = new THREE.Scene();

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    const aspect = width / height;

    // Camera at (0, 0, 5) with near: 0.1, far: 1000
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    this.camera.position.set(0, 0, 5);
    this.camera.lookAt(0, 0, 0);

    this.bookGroup = new THREE.Group();
    this.bookGroup.scale.set(1.0, 1.0, 1.0);
    this.bookGroup.rotation.set(0.04, 0, 0);
    // Center the closed book horizontally in viewport:
    // Spine is at x = 0, front cover extends to x = +coverWidth.
    // Shifting bookGroup by -coverWidth / 2 centers the closed book at x = 0.
    this.bookGroup.position.set(-this.coverWidth / 2, 0, 0);

    this.scene.add(this.bookGroup);
  }

  setupOrbitControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enablePan = false;
    this.controls.enableZoom = false;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.rotateSpeed = 0.85;

    this.controls.minAzimuthAngle = -Infinity;
    this.controls.maxAzimuthAngle = Infinity;
    this.controls.minPolarAngle = Math.PI * 0.08;
    this.controls.maxPolarAngle = Math.PI * 0.92;
  }

  setupLighting() {
    // Rich active directional & ambient lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(3.5, 5, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    this.scene.add(keyLight);

    const coolMoonlight = new THREE.DirectionalLight(0x8faec9, 1.2);
    coolMoonlight.position.set(-5, 3, 5);
    this.scene.add(coolMoonlight);

    const warmFill = new THREE.DirectionalLight(0xffecd2, 0.9);
    warmFill.position.set(5, -2, 4);
    this.scene.add(warmFill);
  }

  /**
   * Builds the Solid Watertight 3D Grimoire
   * - Front cover: Authentic high-def Magic (1)_3.jpg artwork (un-buried, clean on outer face)
   * - Back cover: Integral solid antique leather slab (zero floating / duplicate meshes)
   * - Spine: Watertight parametric semi-cylindrical arch with solid endcaps
   * - All internal pages: Clean high-resolution blank vintage parchment slates (zero text/UI)
   * - Leaves: Double-sided rendering (THREE.DoubleSide), persistent left stacking, zero vanishing
   */
  buildVolumetricBookModel() {
    const W = this.coverWidth;              // 2.45
    const H = this.coverHeight;             // 3.50
    const cT = this.coverThickness;         // 0.05
    const bT = this.boardTotalThickness;    // 0.08
    const pT = this.paperThickness;         // 0.22
    const halfP = pT / 2;                   // 0.11
    const Rout = this.spineRout;            // 0.19
    const Rin = this.spineRin;              // 0.11

    const textureLoader = new THREE.TextureLoader();

    // 1. Textures & Materials
    // Load authentic high-resolution Magic (1)_3.jpg
    const coverTex = textureLoader.load('/assets/magic_cover.jpg', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
      tex.needsUpdate = true;
    });

    const bumpCanvas = generateLeatherBumpCanvas();
    const bumpTex = new THREE.CanvasTexture(bumpCanvas);
    bumpTex.anisotropy = 4;

    const antiqueLeatherCanvas = generateAntiqueLeatherCanvas();
    const antiqueLeatherTex = new THREE.CanvasTexture(antiqueLeatherCanvas);
    antiqueLeatherTex.colorSpace = THREE.SRGBColorSpace;
    antiqueLeatherTex.wrapS = THREE.RepeatWrapping;
    antiqueLeatherTex.wrapT = THREE.RepeatWrapping;

    const leatherMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: antiqueLeatherTex,
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
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
      depthTest: true,
      depthWrite: true
    });

    // Pure neutral white base with roughness 0.45 & metalness 0.1 for the Hogwarts artwork
    const outerCoverMat = new THREE.MeshStandardMaterial({
      map: coverTex,
      color: 0xffffff,
      roughness: 0.45,
      metalness: 0.1,
      emissive: 0x000000,
      side: THREE.FrontSide,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
      depthTest: true,
      depthWrite: true
    });

    // 2. Front Cover Group (Pivoting at x = 0, z = halfP = 0.11)
    this.frontCoverGroup = new THREE.Group();
    this.frontCoverGroup.position.set(0, 0, halfP);

    // Bevelled antique leather board: inner face at z = 0, outer face at z = bT (0.08)
    const frontBoardGeo = createBevelledCoverBoard(W, H, cT, 0.06);
    const frontBoardMesh = new THREE.Mesh(frontBoardGeo, leatherMat);
    frontBoardMesh.castShadow = true;
    frontBoardMesh.receiveShadow = true;
    this.frontCoverGroup.add(frontBoardMesh);

    // Front Face Panel: Full-resolution cinematic Magic (1)_3 artwork
    // Placed cleanly on outer front face at z = bT + 0.002 (0.082)
    const artPlaneGeo = new THREE.PlaneGeometry(W, H);
    artPlaneGeo.translate(W / 2, 0, 0);
    artPlaneGeo.computeVertexNormals();
    const frontArtMesh = new THREE.Mesh(artPlaneGeo, outerCoverMat);
    frontArtMesh.position.set(0, 0, bT + 0.002);
    frontArtMesh.castShadow = true;
    this.frontCoverGroup.add(frontArtMesh);

    // Inside Face Panel: Florentine marbled endpaper (at z = -0.001)
    const insidePlaneGeo = new THREE.PlaneGeometry(W - 0.02, H - 0.02);
    insidePlaneGeo.translate((W - 0.02) / 2 + 0.01, 0, 0);
    insidePlaneGeo.scale(-1, 1, 1);
    insidePlaneGeo.computeVertexNormals();

    const insideEndpaperMesh = new THREE.Mesh(insidePlaneGeo, innerCoverMat);
    insideEndpaperMesh.position.set(0, 0, -0.001);
    insideEndpaperMesh.rotation.y = Math.PI;
    this.frontCoverGroup.add(insideEndpaperMesh);

    this.bookGroup.add(this.frontCoverGroup);

    // 3. Back Cover: SOLID INTEGRAL ANTIQUE LEATHER BOARD (Zero floating / duplicate meshes!)
    const backBoardGeo = createBevelledCoverBoard(W, H, cT, 0.06);
    const backBoardMesh = new THREE.Mesh(backBoardGeo, leatherMat);
    backBoardMesh.position.set(0, 0, -halfP - bT);
    backBoardMesh.receiveShadow = true;
    this.bookGroup.add(backBoardMesh);

    // 4. Seamless Parametric Spine Arch Geometry (Watertight Binding at x = 0)
    const spineCanvas = generateSpineCanvas();
    const spineTex = new THREE.CanvasTexture(spineCanvas);
    spineTex.colorSpace = THREE.SRGBColorSpace;
    spineTex.anisotropy = 4;

    const spineGeo = createParametricSpineArchGeometry(Rout, Rin, H, 36);

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

    // 5. Solid Contiguous Paper Block (Enclosed with 0.05 margins)
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

    // Clean blank parchment textures (Zero text/UI)
    const blankRightCanvas = generateCleanBlankParchmentCanvas(false);
    const blankRightTex = new THREE.CanvasTexture(blankRightCanvas);
    blankRightTex.colorSpace = THREE.SRGBColorSpace;

    const blankLeftCanvas = generateCleanBlankParchmentCanvas(true);
    const blankLeftTex = new THREE.CanvasTexture(blankLeftCanvas);
    blankLeftTex.colorSpace = THREE.SRGBColorSpace;

    const paperTopFaceMat = new THREE.MeshStandardMaterial({
      map: blankRightTex,
      roughness: 0.88,
      metalness: 0.02,
      depthTest: true,
      depthWrite: true
    });

    const solidBlockGeo = new THREE.BoxGeometry(this.pageWidth, this.pageHeight, pT);
    solidBlockGeo.translate(0.02 + this.pageWidth / 2, 0, 0);
    solidBlockGeo.computeVertexNormals();

    const solidBlockMaterials = [
      paperEdgesMat,    // right edge (+X)
      paperEdgesMat,    // left edge (-X inside spine)
      paperEdgesMat,    // top edge (+Y)
      paperEdgesMat,    // bottom edge (-Y)
      paperTopFaceMat,  // top paper face (+Z)
      paperEdgesMat     // bottom paper face (-Z)
    ];
    const solidBlockMesh = new THREE.Mesh(solidBlockGeo, solidBlockMaterials);
    solidBlockMesh.receiveShadow = true;
    this.bookGroup.add(solidBlockMesh);

    // 6. Base Left Page (Clean Slate Blank Parchment at z = halfP + 0.002)
    const baseLeftGeo = new THREE.PlaneGeometry(this.pageWidth, this.pageHeight);
    baseLeftGeo.translate(-0.02 - this.pageWidth / 2, 0, 0);
    baseLeftGeo.computeVertexNormals();

    const baseLeftMat = new THREE.MeshStandardMaterial({
      map: blankLeftTex,
      roughness: 0.88,
      metalness: 0.02,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
      depthTest: true,
      depthWrite: true
    });
    this.baseLeftPage = new THREE.Mesh(baseLeftGeo, baseLeftMat);
    this.baseLeftPage.position.set(0, 0, halfP + 0.002);
    this.baseLeftPage.visible = false;
    this.bookGroup.add(this.baseLeftPage);

    // 7. Dynamic Blank Parchment Flipping Leaves (Total: 4 double-sided leaves)
    const totalFlips = 4;
    this.leafMeshes = [];
    const segmentsX = 32;
    const segmentsY = 16;

    for (let k = 0; k < totalFlips; k++) {
      const geo = new THREE.PlaneGeometry(this.pageWidth, this.pageHeight, segmentsX, segmentsY);
      geo.translate(0.02 + this.pageWidth / 2, 0, 0);
      geo.computeVertexNormals();
      geo.userData = {
        origPositions: geo.attributes.position.array.slice()
      };

      const frontMat = new THREE.MeshStandardMaterial({
        map: blankRightTex,
        roughness: 0.88,
        metalness: 0.02,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
        depthTest: true,
        depthWrite: true
      });

      const backMat = new THREE.MeshStandardMaterial({
        map: blankLeftTex,
        roughness: 0.88,
        metalness: 0.02,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
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

      // Stacked neatly on the right stack when closed
      const zStack = halfP - 0.008 - k * 0.004;
      leafGroup.position.set(0, 0, zStack);
      leafGroup.visible = false;

      this.bookGroup.add(leafGroup);
      this.leafMeshes.push({
        group: leafGroup,
        geometry: geo,
        frontMesh,
        backMesh,
        angle: 0,
        restingZ: zStack,
        index: k
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
      const u = Math.max(0, Math.min(1, (ox - 0.02) / W));

      if (!isTurning) {
        pos.array[idx] = ox;
        pos.array[idx + 1] = oy;
        pos.array[idx + 2] = 0;
      } else {
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

  /**
   * Resets Section 3 Stage Container to Full-Bleed Default State (scale: 1, translateX: 0, opacity: 1)
   */
  resetStageStyles() {
    if (this.stage) {
      gsap.set(this.stage, {
        scale: 1,
        xPercent: 0,
        opacity: 1,
        visibility: 'visible',
        display: 'flex',
        filter: 'blur(0px)',
        borderRadius: '0px',
        border: '1px solid transparent',
        boxShadow: 'none',
        background: 'transparent',
        backdropFilter: 'none',
        force3D: true
      });
    }

    if (this.cornerAccents) {
      this.cornerAccents.forEach((el) => {
        el.style.opacity = '0';
      });
    }
  }

  /**
   * Setup GSAP ScrollTrigger Sequence & Pinning:
   * - Pin Section 3 cleanly (pin: true, scrub: 1, start: "top top", end: "+=3500")
   */
  setupScrollTrigger() {
    const section = document.getElementById('projects');
    if (!section) return;

    this.stage = document.getElementById('book-of-spells-stage');
    this.cornerAccents = this.stage ? this.stage.querySelectorAll('.stage-corner-accent') : [];

    const topNav = document.getElementById('top-right-nav');

    // Pristine initial reset
    this.resetStageStyles();

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=3500',
      pin: true,
      scrub: 1,
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
        this.resetStageStyles();
        this.updateScrollSequence(0);
        if (topNav) topNav.classList.remove('nav-hidden');
      },
      onUpdate: (self) => {
        const p = self.progress;

        // Navbar management
        if (p > 0.02 && p < 0.95) {
          if (topNav && !topNav.classList.contains('nav-hidden')) {
            topNav.classList.add('nav-hidden');
          }
        } else if (p <= 0.02 || p >= 0.95) {
          if (topNav && topNav.classList.contains('nav-hidden')) {
            topNav.classList.remove('nav-hidden');
          }
        }

        this.updateScrollSequence(p);
      }
    });

    this.scrollTrigger = trigger;
  }

  /**
   * Master Scrollytelling Sequence Progression:
   * 1. [0% - 70%]: Book starts closed -> Opens -> Flips parchment pages sequentially
   * 2. [70% - 85%]: Book smoothly swings closed back to the center grimoire state
   * 3. [85% - 90%]: Glowing boundary box frame fades in (opacity: 0 -> 1)
   * 4. [90% - 100%]: Container zooms out (scale: 1 -> 0.75) and glides out to the left (x: 0 -> -120vw)
   * (The zoom-out and glide-out strictly execute ONLY when progress > 0.90, NEVER on initial load!)
   */
  updateScrollSequence(progress) {
    const halfWidth = this.coverWidth / 2;
    const halfP = this.paperThickness / 2; // 0.11

    // Clamp progress safely
    const p = Math.max(0, Math.min(1, progress));

    // =========================================================================
    // 1. [0% - 70%]: BOOK STARTS CLOSED -> OPENS -> FLIPS PARCHMENT PAGES
    // =========================================================================
    if (p <= 0.70) {
      // Phase 1A: Cover Opening [0.00 -> 0.15]
      if (p <= 0.15) {
        const openNorm = p / 0.15;
        const easeT = gsap.parseEase('power2.inOut')(openNorm);
        const coverAngle = -easeT * Math.PI;

        if (this.bookGroup) {
          // Moves from -halfWidth (centering the closed book) to 0 (centering the open spine)
          this.bookGroup.position.x = -halfWidth * (1 - easeT);
        }

        if (this.frontCoverGroup) {
          this.frontCoverGroup.rotation.y = coverAngle;
          this.frontCoverGroup.position.z = halfP + Math.sin(easeT * Math.PI) * 0.18;
        }

        const coverAngleDeg = Math.abs(coverAngle * (180 / Math.PI));
        const isCoverOpening = coverAngleDeg > 5;

        this.leafMeshes.forEach((leaf) => {
          leaf.group.visible = isCoverOpening;
          leaf.group.rotation.y = 0;
          leaf.angle = 0;
          this.deformLeafGeometry(leaf, 0);
          leaf.group.position.z = leaf.restingZ;
        });

        if (this.baseLeftPage) {
          this.baseLeftPage.visible = coverAngleDeg > 25;
        }

        this.isBookOpen = isCoverOpening;
      }
      // Phase 1B: Sequential Page Flipping [0.15 -> 0.70]
      else {
        if (this.bookGroup) {
          this.bookGroup.position.x = 0;
        }

        if (this.frontCoverGroup) {
          this.frontCoverGroup.rotation.y = -Math.PI;
          this.frontCoverGroup.position.z = halfP;
        }

        if (this.baseLeftPage) {
          this.baseLeftPage.visible = true;
        }

        this.isBookOpen = true;

        const pageNorm = (p - 0.15) / (0.70 - 0.15);
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

          if (leafProgress >= 0.999) {
            // Resting flat on LEFT stack with progressive Z-stacking
            leafItem.group.rotation.y = -Math.PI;
            leafItem.group.position.z = halfP + 0.005 + k * 0.003;
            this.deformLeafGeometry(leafItem, 0);
          } else if (leafProgress <= 0.001) {
            // Resting flat on RIGHT stack
            leafItem.group.rotation.y = 0;
            leafItem.group.position.z = leafItem.restingZ;
            this.deformLeafGeometry(leafItem, 0);
          } else {
            // In mid-flight: bend curvature & elevation
            leafItem.group.rotation.y = -theta;
            this.deformLeafGeometry(leafItem, theta);
            leafItem.group.position.z = halfP + 0.12;
          }
        }

        const activeIndex = Math.min(totalFlips, Math.round(clampedPageProg));
        if (activeIndex !== this.currentSpreadIndex) {
          this.currentSpreadIndex = activeIndex;
        }
      }

      // Container is guaranteed at default scale: 1, xPercent: 0, opacity: 1
      this.resetStageStyles();
    }

    // =========================================================================
    // 2. [70% - 85%]: BOOK SMOOTHLY SWINGS CLOSED BACK TO CENTER GRIMOIRE STATE
    // =========================================================================
    else if (p > 0.70 && p <= 0.85) {
      const closeNorm = (p - 0.70) / (0.85 - 0.70);
      const easeC = gsap.parseEase('power2.inOut')(closeNorm);

      // Closing angle goes from -PI to 0
      const closingAngle = -Math.PI * (1 - easeC);

      if (this.frontCoverGroup) {
        this.frontCoverGroup.rotation.y = closingAngle;
        this.frontCoverGroup.position.z = halfP + Math.sin((1 - easeC) * Math.PI) * 0.18;
      }

      const isNearClosed = easeC >= 0.98;

      // Turned leaves swing smoothly closed inside the front cover
      for (let k = 0; k < this.leafMeshes.length; k++) {
        const leafItem = this.leafMeshes[k];
        if (isNearClosed) {
          leafItem.group.visible = false;
          leafItem.group.rotation.y = 0;
          leafItem.group.position.z = leafItem.restingZ;
          this.deformLeafGeometry(leafItem, 0);
        } else {
          leafItem.group.visible = true;
          leafItem.group.rotation.y = closingAngle;
          const currentZ = halfP + 0.005 + k * 0.003;
          const targetZ = leafItem.restingZ;
          leafItem.group.position.z = currentZ + (targetZ - currentZ) * easeC;
          this.deformLeafGeometry(leafItem, Math.sin((1 - easeC) * Math.PI) * 0.18);
        }
      }

      if (this.baseLeftPage) {
        this.baseLeftPage.visible = !isNearClosed && (Math.abs(closingAngle * (180 / Math.PI)) > 25);
      }

      // Smoothly re-center the closed book volume
      if (this.bookGroup) {
        this.bookGroup.position.x = -halfWidth * easeC;
      }

      this.isBookOpen = !isNearClosed;

      // Container remains at default scale: 1, xPercent: 0, opacity: 1
      this.resetStageStyles();
    }

    // =========================================================================
    // 3. [85% - 90%]: GLOWING BOUNDARY BOX FRAME FADES IN (opacity: 0 -> 1)
    // =========================================================================
    else if (p > 0.85 && p <= 0.90) {
      // Book is fully locked in closed grimoire state in the center
      if (this.frontCoverGroup) {
        this.frontCoverGroup.rotation.y = 0;
        this.frontCoverGroup.position.z = halfP;
      }
      if (this.bookGroup) {
        this.bookGroup.position.x = -halfWidth;
      }
      if (this.baseLeftPage) {
        this.baseLeftPage.visible = false;
      }
      this.leafMeshes.forEach((leaf) => {
        leaf.group.visible = false;
        leaf.group.rotation.y = 0;
        leaf.group.position.z = leaf.restingZ;
        this.deformLeafGeometry(leaf, 0);
      });
      this.isBookOpen = false;

      const frameNorm = (p - 0.85) / (0.90 - 0.85);
      const easeF = gsap.parseEase('power2.inOut')(frameNorm);

      const borderAlpha = (0.35 * easeF).toFixed(3);
      const shadowAlpha = (0.80 * easeF).toFixed(3);
      const glowAlpha = (0.25 * easeF).toFixed(3);
      const bgAlpha = (0.60 * easeF).toFixed(3);

      if (this.stage) {
        gsap.set(this.stage, {
          scale: 1,
          xPercent: 0,
          opacity: 1,
          visibility: 'visible',
          display: 'flex',
          filter: 'blur(0px)',
          borderRadius: `${32 * easeF}px`,
          border: `1px solid rgba(234, 179, 8, ${borderAlpha})`,
          boxShadow: `0 0 ${30 * easeF}px rgba(0, 0, 0, ${shadowAlpha}), 0 0 ${25 * easeF}px rgba(234, 179, 8, ${glowAlpha})`,
          background: `rgba(15, 6, 8, ${bgAlpha})`,
          backdropFilter: `blur(${12 * easeF}px)`,
          force3D: true
        });
      }

      if (this.cornerAccents) {
        this.cornerAccents.forEach((el) => {
          el.style.opacity = easeF.toFixed(3);
        });
      }
    }

    // =========================================================================
    // 4. [90% - 100%]: CONTAINER ZOOMS OUT (1 -> 0.75) & GLIDES LEFT (x: 0 -> -120vw)
    // =========================================================================
    else if (p > 0.90) {
      // Book remains locked in closed grimoire state
      if (this.frontCoverGroup) {
        this.frontCoverGroup.rotation.y = 0;
        this.frontCoverGroup.position.z = halfP;
      }
      if (this.bookGroup) {
        this.bookGroup.position.x = -halfWidth;
      }
      if (this.baseLeftPage) {
        this.baseLeftPage.visible = false;
      }
      this.leafMeshes.forEach((leaf) => {
        leaf.group.visible = false;
        leaf.group.rotation.y = 0;
        leaf.group.position.z = leaf.restingZ;
        this.deformLeafGeometry(leaf, 0);
      });
      this.isBookOpen = false;

      const exitNorm = (p - 0.90) / (1.00 - 0.90);
      const easeE = gsap.parseEase('power2.inOut')(exitNorm);

      const scale = 1 - 0.25 * easeE; // 1.0 -> 0.75
      const xPercent = -120 * easeE;  // 0 -> -120vw
      const opacity = Math.max(0, 1 - easeE);
      const blurPx = (8 * easeE).toFixed(2);

      if (this.stage) {
        gsap.set(this.stage, {
          scale: scale,
          xPercent: xPercent,
          opacity: opacity,
          visibility: 'visible',
          display: 'flex',
          filter: `blur(${blurPx}px)`,
          borderRadius: '32px',
          border: '1px solid rgba(234, 179, 8, 0.35)',
          boxShadow: '0 0 30px rgba(0, 0, 0, 0.8), 0 0 25px rgba(234, 179, 8, 0.25)',
          background: 'rgba(15, 6, 8, 0.60)',
          backdropFilter: 'blur(12px)',
          force3D: true
        });
      }

      if (this.cornerAccents) {
        this.cornerAccents.forEach((el) => {
          el.style.opacity = opacity.toFixed(3);
        });
      }
    }
  }

  setupEventListeners() {
    this.onResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.onResize);

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
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    if (this.isDisposed) return;
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));

    if (this.controls) {
      this.controls.update();
    }

    const time = this.clock.getElapsedTime();

    if (this.bookGroup) {
      this.bookGroup.position.y = Math.sin(time * 1.4) * 0.025;
    }

    this.renderer.render(this.scene, this.camera);
  }

  flipToSpread(index) {
    if (index < 0 || index >= 5) return;
    const openPhaseEnd = 0.15;
    const flipsPhaseEnd = 0.70;
    const totalFlips = 4;
    const targetProgress = openPhaseEnd + (index / totalFlips) * (flipsPhaseEnd - openPhaseEnd);

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

    this.resetStageStyles();

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
