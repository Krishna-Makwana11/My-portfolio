/* ==========================================================================
   INTERACTIVE 3D "BOOK OF SPELLS" (GRIMOIRE) COMPONENT
   - Authentic Cinematic Hogwarts Front Cover Artwork (Magic (1)_3.jpg)
   - Double-Sided Persistent Turned Pages with Non-Vanishing Left Stack
   - Solid Integral Antique Leather Back Cover (Zero Floating / Detached Meshes)
   - Watertight Continuous Parametric Spine Arch (Zero Gaps / Seamless Hinge at x = 0)
   - Clean Uniform 0.05-Unit Leather Overhang (Top, Bottom, Right)
   - Anti-Z-Fighting PolygonOffset & Strict Closed-State Hierarchy
   - Unrestricted 360° OrbitControls & Smooth GSAP Scroll Scrubbing
   ========================================================================== */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ==========================================================================
// 1. DATA: THE SPELLS & ENCHANTED WORKS (PORTFOLIO PROJECTS ARRAY)
// ==========================================================================

const SPELL_PAGES = [
  // Page 0 (Front): Spread 0 Right Page - First Project
  {
    folio: 'FOLIO I',
    type: 'INCANTATIO PRIMA',
    spellTitle: 'LUMOS MAXIMA',
    projectTitle: 'Bareilly Police AI Portal',
    badge: 'Citizen Safety Platform',
    desc: 'Official government citizen portal engineering online FIR registration, automated emergency dispatching, and AI-assisted crime analytics.',
    metrics: [
      { label: 'Citizen Reach', val: '50,000+' },
      { label: 'Response Time', val: '< 2.4s' },
      { label: 'Platform Uptime', val: '99.98%' }
    ],
    tech: ['React.js', 'Node.js', 'PostgreSQL', 'Python AI', 'REST API'],
    incantation: '« In the darkest night, digital craft illuminates justice. »'
  },
  // Page 1 (Back of Leaf 0): Spread 1 Left Page - Project I Architecture Archive
  {
    folio: 'FOLIO II',
    type: 'COGNITIO ARCHITECTURA',
    spellTitle: 'SANCTUM CORE',
    projectTitle: 'Citizen AI Engine Fabric',
    badge: 'Security & Distributed Systems',
    desc: 'Multi-tiered microservice backend featuring end-to-end encrypted citizen identity verification, threat detection, and audited officer dashboards.',
    metrics: [
      { label: 'Encrypted Records', val: '100,000+' },
      { label: 'Threat Filter', val: '99.4%' },
      { label: 'Network Latency', val: '12ms' }
    ],
    tech: ['Docker', 'Kubernetes', 'AES-256', 'OAuth2', 'Microservices'],
    incantation: '« Fortified with cryptographic enchantments against breaches. »'
  },
  // Page 2 (Front of Leaf 1): Spread 1 Right Page - Second Project
  {
    folio: 'FOLIO III',
    type: 'INCANTATIO SECUNDA',
    spellTitle: 'ELECTRANAV',
    projectTitle: 'Smart EV Navigation Grid',
    badge: 'Real-Time Telemetry & Routing',
    desc: 'Next-generation electric vehicle navigation engine computing energy-optimal routes with live charging station telemetry and elevation modeling.',
    metrics: [
      { label: 'Charging Hubs', val: '12,500+' },
      { label: 'Range Accuracy', val: '98.2%' },
      { label: 'Active Drivers', val: '8,200+' }
    ],
    tech: ['Next.js', 'Python', 'FastAPI', 'WebSockets', 'Graph Algorithms'],
    incantation: '« Charting luminous paths across the electric frontier. »'
  },
  // Page 3 (Back of Leaf 1): Spread 2 Left Page - Project II Telemetry Archive
  {
    folio: 'FOLIO IV',
    type: 'TELEMETRIA VIVIDA',
    spellTitle: 'FLUX MATRIX',
    projectTitle: 'Predictive Battery Analytics',
    badge: 'Machine Learning Intelligence',
    desc: 'Deep regression pipeline predicting battery discharge rates calibrated against ambient climate, driver velocity, and terrain gradients.',
    metrics: [
      { label: 'Data Throughput', val: '10K msg/s' },
      { label: 'State Sync', val: 'Real-Time' },
      { label: 'Energy Saved', val: '22.4%' }
    ],
    tech: ['Redis Pub/Sub', 'TensorFlow', 'TimescaleDB', 'Tailwind CSS'],
    incantation: '« Taming volatile currents into predictive foresight. »'
  },
  // Page 4 (Front of Leaf 2): Spread 2 Right Page - Third Project
  {
    folio: 'FOLIO V',
    type: 'INCANTATIO TERTIA',
    spellTitle: 'VULCRUX ENGINE',
    projectTitle: 'Autonomous Dev Tooling',
    badge: 'Cloud Orchestration Platform',
    desc: 'High-throughput developer platform accelerating automated container deployments, code refactoring workflows, and cloud observability.',
    metrics: [
      { label: 'Build Velocity', val: '4.2x Faster' },
      { label: 'Pipelines Run', val: '250,000+' },
      { label: 'Active Devs', val: '3,400+' }
    ],
    tech: ['Go (Golang)', 'Docker', 'gRPC', 'GraphQL', 'PostgreSQL'],
    incantation: '« Forging autonomous sorcery for modern developer legions. »'
  },
  // Page 5 (Back of Leaf 2): Spread 3 Left Page - Project III Fabric Archive
  {
    folio: 'FOLIO VI',
    type: 'FABRICA OBSERVABILIS',
    spellTitle: 'AETHER SHIELD',
    projectTitle: 'Microservice Cluster Mesh',
    badge: 'High-Availability Infrastructure',
    desc: 'Self-healing service mesh orchestrating multi-region Kubernetes pods with sub-second automated failover and dynamic load balancing.',
    metrics: [
      { label: 'Recovery Time', val: '< 10s' },
      { label: 'Throughput', val: '50K req/s' },
      { label: 'System Uptime', val: '99.99%' }
    ],
    tech: ['Prometheus', 'Grafana', 'OpenTelemetry', 'Linux Kernel'],
    incantation: '« Vigilant guardians preserving ethereal digital architectures. »'
  },
  // Page 6 (Front of Leaf 3): Spread 3 Right Page - Fourth Project
  {
    folio: 'FOLIO VII',
    type: 'INCANTATIO QUARTA',
    spellTitle: 'PATRONUS AI',
    projectTitle: 'Deep Vision & Research',
    badge: 'Neural Vision & Generative AI',
    desc: 'Multimodal computer vision research architecture recognizing fine-grained visual patterns, synthetic media artifacts, and medical imaging features.',
    metrics: [
      { label: 'Model Accuracy', val: '96.7%' },
      { label: 'Inference Latency', val: '14ms' },
      { label: 'Parameters', val: '1.2 Billion' }
    ],
    tech: ['PyTorch', 'Hugging Face', 'CUDA', 'FastAPI', 'React.js'],
    incantation: '« Conjuring clarity from pure mathematical illumination. »'
  },
  // Page 7 (Back of Leaf 3): Spread 4 Left Page - Final Inscription & Summons
  {
    folio: 'FOLIO VIII',
    type: 'INCANTATIO AETERNA',
    spellTitle: 'EXPERTUS SUMMONS',
    projectTitle: "Krishna's Grimoire Finalis",
    badge: 'Open For Inquiries & Craft',
    desc: 'Equipped with mastery in Full-Stack Engineering, Machine Learning, and Interactive 3D Real-Time Graphics. Ready to forge legendary digital products.',
    metrics: [
      { label: 'Full-Stack', val: 'React & Node' },
      { label: 'AI Domain', val: 'Vision & NLP' },
      { label: 'Availability', val: 'Active' }
    ],
    tech: ['React / Next.js', 'Python AI', 'Three.js / WebGL', 'Cloud Architecture'],
    incantation: '« Mischief Managed — Inscribe your message on the Owl Post below! »'
  }
];

// ==========================================================================
// 2. PROCEDURAL HIGH-RESOLUTION TEXTURE GENERATORS
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

  // Fine micro-grain
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
 * Generates Florentine Marbled Endpaper with Ex Libris Bookplate
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
  ctx.fillStyle = 'rgba(252, 246, 235, 0.94)';
  ctx.strokeStyle = 'rgba(160, 100, 30, 0.7)';
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
 * Generates Inscribed Medieval Parchment Texture for Specific Spell Page
 */
function generateInscribedSpellPageCanvas(pageData, isLeft) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1600;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(600, 800, 180, 600, 800, 950);
  grad.addColorStop(0, '#fcf8ec');
  grad.addColorStop(0.4, '#f5e9ce');
  grad.addColorStop(0.75, '#e4d0a2');
  grad.addColorStop(1, '#be9d62');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1200, 1600);

  ctx.fillStyle = 'rgba(95, 60, 20, 0.035)';
  for (let i = 0; i < 4000; i++) {
    ctx.fillRect(Math.random() * 1200, Math.random() * 1600, Math.random() * 3 + 1, Math.random() * 2 + 1);
  }

  for (let i = 0; i < 5; i++) {
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

  // Margin Border
  ctx.save();
  ctx.strokeStyle = 'rgba(163, 116, 44, 0.45)';
  ctx.lineWidth = 2;
  ctx.strokeRect(50, 50, 1100, 1500);

  ctx.strokeStyle = 'rgba(163, 116, 44, 0.2)';
  ctx.lineWidth = 1;
  ctx.strokeRect(62, 62, 1076, 1476);

  // Corner Flourishes
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

  // Binding Gutter Shadow
  const gutterX = isLeft ? 1160 : 40;
  const shadowGrad = ctx.createLinearGradient(gutterX, 0, isLeft ? 1080 : 120, 0);
  shadowGrad.addColorStop(0, 'rgba(60, 35, 12, 0.2)');
  shadowGrad.addColorStop(1, 'rgba(60, 35, 12, 0)');
  ctx.fillStyle = shadowGrad;
  ctx.fillRect(isLeft ? 1060 : 40, 50, 100, 1500);
  ctx.restore();

  // CONTENT INSCRIBING
  const alignX = isLeft ? 560 : 640;

  // 1. Folio Number & Type Header
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = '700 18px "Cinzel", Georgia, serif';
  ctx.letterSpacing = '5px';
  ctx.fillStyle = '#8a5c28';
  ctx.fillText(`${pageData.folio}  •  ${pageData.type}`, alignX, 130);

  // 2. Spell Title (Calligraphic Incantation)
  ctx.font = '900 48px "Cinzel", Georgia, serif';
  ctx.letterSpacing = '6px';
  ctx.fillStyle = '#421619';
  ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
  ctx.shadowBlur = 8;
  ctx.fillText(pageData.spellTitle, alignX, 220);

  // 3. Project Name & Badge
  ctx.font = '700 36px "Cinzel Decorative", Georgia, serif';
  ctx.fillStyle = '#220b0d';
  ctx.shadowBlur = 0;
  ctx.fillText(pageData.projectTitle, alignX, 290);

  ctx.font = 'italic 20px "MedievalSharp", Georgia, serif';
  ctx.fillStyle = '#78481d';
  ctx.fillText(`— ${pageData.badge} —`, alignX, 335);

  // 4. Runic Divider
  ctx.strokeStyle = 'rgba(163, 116, 44, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(alignX - 250, 370);
  ctx.lineTo(alignX - 40, 370);
  ctx.moveTo(alignX + 40, 370);
  ctx.lineTo(alignX + 250, 370);
  ctx.stroke();

  ctx.font = '22px serif';
  ctx.fillStyle = '#a67c32';
  ctx.fillText('⚡', alignX, 377);

  // 5. Description Paragraph (Wrapped)
  ctx.font = '500 24px "MedievalSharp", Georgia, serif';
  ctx.fillStyle = '#3a2010';
  ctx.textAlign = 'center';
  const descWords = pageData.desc.split(' ');
  let line = '';
  let lineY = 440;
  for (let n = 0; n < descWords.length; n++) {
    const testLine = line + descWords[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > 760 && n > 0) {
      ctx.fillText(line, alignX, lineY);
      line = descWords[n] + ' ';
      lineY += 38;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, alignX, lineY);

  // 6. Tri-Column Metrics Box
  const boxTop = lineY + 50;
  ctx.fillStyle = 'rgba(255, 252, 245, 0.7)';
  ctx.strokeStyle = 'rgba(163, 116, 44, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(alignX - 380, boxTop, 760, 160, [12]);
  ctx.fill();
  ctx.stroke();

  const colWidth = 760 / 3;
  pageData.metrics.forEach((m, idx) => {
    const cx = (alignX - 380) + colWidth * idx + colWidth / 2;
    ctx.textAlign = 'center';

    ctx.font = '900 36px "Cinzel", Georgia, serif';
    ctx.fillStyle = '#6b1c20';
    ctx.fillText(m.val, cx, boxTop + 70);

    ctx.font = '600 17px "Space Grotesk", sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillStyle = '#613812';
    ctx.fillText(m.label, cx, boxTop + 115);

    if (idx < 2) {
      ctx.strokeStyle = 'rgba(163, 116, 44, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo((alignX - 380) + colWidth * (idx + 1), boxTop + 20);
      ctx.lineTo((alignX - 380) + colWidth * (idx + 1), boxTop + 140);
      ctx.stroke();
    }
  });

  // 7. Technology Rune Badges
  const techTop = boxTop + 210;
  ctx.textAlign = 'center';
  ctx.font = '700 18px "Cinzel", Georgia, serif';
  ctx.letterSpacing = '3px';
  ctx.fillStyle = '#7a4a1c';
  ctx.fillText('ANCIENT FORGINGS & RUNES', alignX, techTop);

  const pills = pageData.tech;
  const pillY = techTop + 45;
  const pillTotalWidth = pills.length * 140;
  let startPillX = alignX - (pillTotalWidth / 2) + 60;

  pills.forEach((p) => {
    ctx.fillStyle = 'rgba(235, 218, 185, 0.85)';
    ctx.strokeStyle = 'rgba(163, 116, 44, 0.5)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(startPillX - 60, pillY - 26, 120, 36, [18]);
    ctx.fill();
    ctx.stroke();

    ctx.font = '600 16px "Space Grotesk", monospace';
    ctx.letterSpacing = '0px';
    ctx.fillStyle = '#381c08';
    ctx.fillText(p, startPillX, pillY - 2);

    startPillX += 140;
  });

  // 8. Latin Quote Incantation
  ctx.font = 'italic 21px "MedievalSharp", Georgia, serif';
  ctx.fillStyle = '#6e3810';
  ctx.fillText(pageData.incantation, alignX, 1420);

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
// 3. THREE.JS 3D GRIMOIRE MODEL & RIGGING
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

    this.renderer.domElement.style.touchAction = 'pan-y';
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.25);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(3.5, 4.5, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    this.scene.add(keyLight);

    const coolMoonlight = new THREE.DirectionalLight(0x8faec9, 0.75);
    coolMoonlight.position.set(-5, 2, 4);
    this.scene.add(coolMoonlight);

    const softFill = new THREE.DirectionalLight(0xffffff, 0.45);
    softFill.position.set(5, 1, 4);
    this.scene.add(softFill);
  }

  /**
   * Builds the Solid Watertight 3D Grimoire
   * - Front cover: Authentic high-def Magic (1)_3.jpg artwork (un-buried, clean on outer face)
   * - Back cover: Integral solid antique leather slab (zero floating / duplicate meshes)
   * - Spine: Watertight parametric semi-cylindrical arch with solid endcaps
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
    // Placed at z = bT + 0.001 (0.081) so it sits cleanly on the outer front face without occlusion
    const artPlaneGeo = new THREE.PlaneGeometry(W, H);
    artPlaneGeo.translate(W / 2, 0, 0);
    artPlaneGeo.computeVertexNormals();
    const frontArtMesh = new THREE.Mesh(artPlaneGeo, outerCoverMat);
    frontArtMesh.position.set(0, 0, bT + 0.001);
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
    // Inner face at z = -halfP (-0.11), outer face at z = -halfP - bT (-0.19)
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

    const finalRightCanvas = generateInscribedSpellPageCanvas(SPELL_PAGES[6], false);
    const finalRightTex = new THREE.CanvasTexture(finalRightCanvas);
    finalRightTex.colorSpace = THREE.SRGBColorSpace;

    const paperTopFaceMat = new THREE.MeshStandardMaterial({
      map: finalRightTex,
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

    // 6. Base Left Page (Spread 0 Left: Ex Libris Frontispiece at z = halfP + 0.002)
    const baseLeftCanvas = generateInsideCoverCanvas();
    const baseLeftTex = new THREE.CanvasTexture(baseLeftCanvas);
    baseLeftTex.colorSpace = THREE.SRGBColorSpace;

    const baseLeftGeo = new THREE.PlaneGeometry(this.pageWidth, this.pageHeight);
    baseLeftGeo.translate(-0.02 - this.pageWidth / 2, 0, 0);
    baseLeftGeo.computeVertexNormals();

    const baseLeftMat = new THREE.MeshStandardMaterial({
      map: baseLeftTex,
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

    // 7. Dynamic Inscribed Flipping Leaves (Total: 4 double-sided leaves)
    // Leaf 0: Front = Spell I (Bareilly Police), Back = Archive I (Citizen AI Engine)
    // Leaf 1: Front = Spell II (ElectraNav), Back = Archive II (Predictive Battery)
    // Leaf 2: Front = Spell III (Vulcrux Dev), Back = Archive III (Cluster Mesh)
    // Leaf 3: Front = Spell IV (Patronus AI), Back = Archive IV (Krishna Workshop Finale)
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

      // Distinct Front Face Texture
      const frontData = SPELL_PAGES[k * 2];
      const frontCanvas = generateInscribedSpellPageCanvas(frontData, false);
      const frontTex = new THREE.CanvasTexture(frontCanvas);
      frontTex.colorSpace = THREE.SRGBColorSpace;

      const frontMat = new THREE.MeshStandardMaterial({
        map: frontTex,
        roughness: 0.88,
        metalness: 0.02,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
        depthTest: true,
        depthWrite: true
      });

      // Distinct Back Face Texture
      const backData = SPELL_PAGES[k * 2 + 1];
      const backCanvas = generateInscribedSpellPageCanvas(backData, true);
      const backTex = new THREE.CanvasTexture(backCanvas);
      backTex.colorSpace = THREE.SRGBColorSpace;

      const backMat = new THREE.MeshStandardMaterial({
        map: backTex,
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
      // Leaf 0 is at top (z = halfP - 0.008), subsequent leaves are underneath
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
        // Handled when returning
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
   *                                  Book translates smoothly from X = -W/2 to 0
   * Progress in [0.18, 1.0]: Phase 2 - Multi-spread page history:
   *                                  - When Leaf N flips, its BACK face accurately rests on left stack
   *                                  - Clamped at -180 deg, strictly visible, persistent stack
   *                                  - Offsets resting Z-depth: z = halfP + 0.005 + k * 0.003
   */
  updateScrollSequence(progress) {
    const coverPhaseEnd = 0.18;
    const halfWidth = this.coverWidth / 2;
    const halfP = this.paperThickness / 2; // 0.11

    if (progress <= coverPhaseEnd) {
      // Phase 1: Front Cover swings open
      const coverNorm = progress / coverPhaseEnd;
      const easeT = gsap.parseEase('power2.inOut')(coverNorm);

      const coverAngle = -easeT * Math.PI;

      if (this.bookGroup) {
        this.bookGroup.position.x = -halfWidth * (1 - easeT);
      }

      if (this.frontCoverGroup) {
        this.frontCoverGroup.rotation.y = coverAngle;
        this.frontCoverGroup.position.z = halfP + Math.sin(easeT * Math.PI) * 0.18;
      }

      // STRICT CLOSED-STATE HIERARCHY:
      // When closed, internal pages are strictly hidden
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

    } else {
      // Phase 2: Front Cover is fully open on the left (-180 deg), book is centered at X = 0
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

      // Multi-Page Progression: [0.18, 1.0] mapped across 4 leaves
      const pageNorm = (progress - coverPhaseEnd) / (1.0 - coverPhaseEnd);
      const totalFlips = this.leafMeshes.length;
      const rawPageProg = pageNorm * totalFlips;
      const clampedPageProg = Math.max(0, Math.min(totalFlips, rawPageProg));

      for (let k = 0; k < totalFlips; k++) {
        const leafItem = this.leafMeshes[k];
        // ALWAYS VISIBLE while book is open (never unmounted or hidden!)
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
          // COMPLETELY TURNED: Clamp at exactly -180 deg resting on LEFT stack
          // Stacking Z: strictly above baseLeftPage (halfP + 0.002) and earlier turned pages
          leafItem.group.rotation.y = -Math.PI;
          leafItem.group.position.z = halfP + 0.005 + k * 0.003;
          this.deformLeafGeometry(leafItem, 0); // Flat when resting
        } else if (leafProgress <= 0.001) {
          // UNTURNED: Clamp at exactly 0 deg resting on RIGHT stack
          leafItem.group.rotation.y = 0;
          leafItem.group.position.z = leafItem.restingZ;
          this.deformLeafGeometry(leafItem, 0); // Flat when resting
        } else {
          // IN MID-FLIGHT: Curvature deformation & elevation above stacks to avoid clipping
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
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

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
// 4. MODULE EXPORT INITIALIZER
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
