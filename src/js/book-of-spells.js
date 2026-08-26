/* ==========================================================================
   INTERACTIVE 3D "BOOK OF SPELLS" (GRIMOIRE) PROJECTS SHOWCASE
   Three.js + GSAP ScrollTrigger + Procedural Paper Bending Physics
   Front-Facing Clean View (No extreme tilt) + Centered Closed->Open Sequence
   Realistic Weathered Leather Cover Texture Matching Magic (1).jpg
   ========================================================================== */

import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ==========================================================================
// 1. FEATURED PROJECTS DATA
// ==========================================================================
export const SPELLBOOK_PROJECTS = [
  {
    id: 'bareilly-police',
    folio: 'FOLIO I · CYBER DEFENSE',
    title: 'Bareilly Police Portal',
    category: 'Full Stack · Sanyogita AI',
    tagline: 'Citizen Incident Dispatch & Intelligent Assistant',
    description: 'Production-grade municipal platform engineered for Bareilly Police. Features secure citizen crime reporting, dispatch tracking, and integrated Sanyogita AI for instant natural-language public assistance.',
    tech: ['Next.js', 'TypeScript', 'Sanyogita AI', 'PostgreSQL', 'Tailwind'],
    liveUrl: 'https://bareillypolice.up.gov.in',
    githubUrl: 'https://github.com/iaryasharma',
    accentColor: '#f59e0b',
    badgeText: 'GOVERNMENT PRODUCTION',
    previewType: 'police'
  },
  {
    id: 'cinewhiz',
    folio: 'FOLIO II · PREDICTIVE COGNITION',
    title: 'CineWhiz AI Discovery',
    category: 'Machine Learning · FastAPI',
    tagline: 'Personalized Cinema Intelligence Engine',
    description: 'Intelligent movie recommendation engine utilizing collaborative filtering and preference matrices. Features Google OAuth watchlists, responsive streaming catalogs, and sub-100ms vector query matching.',
    tech: ['FastAPI', 'Python', 'MongoDB', 'Next.js', 'Scikit-Learn'],
    liveUrl: 'https://github.com/iaryasharma/CineWhiz',
    githubUrl: 'https://github.com/iaryasharma/CineWhiz',
    accentColor: '#38bdf8',
    badgeText: 'AI RECOMMENDATION',
    previewType: 'cinema'
  },
  {
    id: 'sangamdrive',
    folio: 'FOLIO III · CLOUD TRANSMUTATION',
    title: 'SangamDrive Multi-Sync',
    category: 'Cloud Architecture · OAuth 2.0',
    tagline: 'Unified Multi-Account Google Drive Hub',
    description: 'Unified multi-account Google Drive orchestrator allowing seamless search, asset aggregation, and cross-account file transfers in one intuitive workspace without browser profile hopping.',
    tech: ['Next.js', 'Google Drive API', 'OAuth 2.0', 'Node.js', 'Tailwind'],
    liveUrl: 'https://github.com/iaryasharma/SangamDrive',
    githubUrl: 'https://github.com/iaryasharma/SangamDrive',
    accentColor: '#10b981',
    badgeText: 'CLOUD ORCHESTRATOR',
    previewType: 'drive'
  },
  {
    id: 'passx',
    folio: 'FOLIO IV · CIPHER VAULT',
    title: 'PassX Cryptographic Safe',
    category: 'Zero-Knowledge Cryptography',
    tagline: 'End-to-End Encrypted Credential Vault',
    description: 'Zero-knowledge credentials repository safeguarded by client-side AES-256 GCM encryption and PBKDF2 key stretching. Keys never touch server memory, ensuring complete sovereign privacy.',
    tech: ['Node.js', 'AES-256', 'Express.js', 'MongoDB', 'WebCrypto'],
    liveUrl: 'https://passwordx.vercel.app/',
    githubUrl: 'https://github.com/iaryasharma',
    accentColor: '#a855f7',
    badgeText: 'ZERO-KNOWLEDGE VAULT',
    previewType: 'vault'
  },
  {
    id: 'distraction-detection',
    folio: 'FOLIO V · VISION SENTINEL',
    title: 'Distraction Detection AI',
    category: 'Computer Vision · Safety',
    tagline: 'Real-Time Facial Landmark & Gaze Sentinel',
    description: 'Real-time neural driver vigilance and workplace attentiveness system. Analyzes facial mesh vectors and eye aspect ratios (EAR) via MediaPipe and OpenCV to trigger predictive fatigue alerts.',
    tech: ['Python', 'OpenCV', 'MediaPipe', 'TensorFlow', 'NumPy'],
    liveUrl: 'https://github.com/iaryasharma',
    githubUrl: 'https://github.com/iaryasharma',
    accentColor: '#ef4444',
    badgeText: 'NEURAL SENTINEL',
    previewType: 'vision'
  }
];

// ==========================================================================
// 2. PROCEDURAL TEXTURE GENERATORS (Cover, Endpaper & Spreads)
// ==========================================================================

/**
 * Generates Front Leather Cover Texture referencing Magic (1).jpg
 * Features rich dark brown weathered leather, brass corner filigree, and golden quote crest.
 */
function generateCoverCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1600;
  const ctx = canvas.getContext('2d');

  // 1. Weathered Dark Brown Antique Leather (Rich depth)
  const bgGrad = ctx.createRadialGradient(600, 800, 80, 600, 800, 950);
  bgGrad.addColorStop(0, '#2e1f16');
  bgGrad.addColorStop(0.45, '#1e140d');
  bgGrad.addColorStop(0.8, '#140c08');
  bgGrad.addColorStop(1, '#090503');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1200, 1600);

  // Micro-grain leather texture
  ctx.fillStyle = 'rgba(255, 235, 200, 0.02)';
  for (let i = 0; i < 7000; i++) {
    const rx = Math.random() * 1200;
    const ry = Math.random() * 1600;
    ctx.fillRect(rx, ry, Math.random() * 2 + 1, Math.random() * 2 + 1);
  }

  // 2. Embossed Dual Gold-Leaf Border Frame
  ctx.save();
  ctx.strokeStyle = 'rgba(230, 185, 55, 0.75)';
  ctx.lineWidth = 4.5;
  ctx.shadowColor = 'rgba(245, 197, 66, 0.65)';
  ctx.shadowBlur = 18;
  ctx.strokeRect(48, 48, 1104, 1504);

  ctx.strokeStyle = 'rgba(180, 130, 40, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(62, 62, 1076, 1476);
  ctx.restore();

  // 3. Ornate Brass Filigree Corner Plates (4 corners)
  const drawCornerFiligree = (x, y, flipX, flipY) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);

    ctx.strokeStyle = '#d4af37';
    ctx.fillStyle = 'rgba(212, 175, 55, 0.2)';
    ctx.lineWidth = 3.5;
    ctx.shadowColor = 'rgba(245, 197, 66, 0.85)';
    ctx.shadowBlur = 15;

    // Corner bracket
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(120, 0);
    ctx.quadraticCurveTo(80, 80, 0, 120);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Floral scroll arc
    ctx.beginPath();
    ctx.arc(48, 48, 24, 0, Math.PI * 2);
    ctx.stroke();

    // Rivet stud
    ctx.fillStyle = '#fff4bd';
    ctx.beginPath();
    ctx.arc(30, 30, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  drawCornerFiligree(48, 48, false, false);
  drawCornerFiligree(1152, 48, true, false);
  drawCornerFiligree(48, 1552, false, true);
  drawCornerFiligree(1152, 1552, true, true);

  // 4. Central Magical Emblem (Direct reference to Magic (1).jpg)
  ctx.save();
  ctx.textAlign = 'center';

  // Floating Star Constellations & Golden Dust
  ctx.fillStyle = '#fef08a';
  const starCoords = [
    [600, 220], [530, 245], [670, 245], [460, 275], [740, 275],
    [360, 370], [840, 370], [280, 520], [920, 520]
  ];
  starCoords.forEach(([sx, sy]) => {
    ctx.shadowColor = 'rgba(254, 240, 138, 0.95)';
    ctx.shadowBlur = 16;
    ctx.font = '22px serif';
    ctx.fillText('✦', sx, sy);
  });

  // Top Crest Stars Row
  ctx.font = '700 26px serif';
  ctx.fillText('★ ★ ★ ★ ★', 600, 310);

  // Inspiring Quote from Magic (1).jpg
  ctx.shadowColor = 'rgba(245, 197, 66, 0.9)';
  ctx.shadowBlur = 26;

  ctx.fillStyle = '#fef3c7';
  ctx.font = '900 86px "Cinzel", Georgia, serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('THOSE', 600, 425);

  ctx.font = '600 36px "Cinzel Decorative", Georgia, serif';
  ctx.letterSpacing = '8px';
  ctx.fillStyle = '#e6c364';
  ctx.fillText('WHO DON\'T', 600, 495);

  ctx.font = '900 96px "Cinzel", Georgia, serif';
  ctx.letterSpacing = '8px';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('BELIEVE', 600, 615);

  ctx.font = '600 42px "Cinzel Decorative", Georgia, serif';
  ctx.fillStyle = '#e6c364';
  ctx.fillText('IN', 600, 690);

  ctx.font = '900 110px "Cinzel", Georgia, serif';
  ctx.letterSpacing = '10px';
  ctx.fillStyle = '#fff4cc';
  ctx.fillText('MAGIC.', 600, 825);

  ctx.font = '600 38px "Cinzel Decorative", Georgia, serif';
  ctx.letterSpacing = '6px';
  ctx.fillStyle = '#e6c364';
  ctx.fillText('WILL NEVER', 600, 915);

  ctx.font = '900 92px "Cinzel", Georgia, serif';
  ctx.letterSpacing = '8px';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('FIND IT.', 600, 1030);

  // Ornate central flourish divider
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(340, 1110);
  ctx.lineTo(530, 1110);
  ctx.moveTo(670, 1110);
  ctx.lineTo(860, 1110);
  ctx.stroke();

  ctx.font = '30px serif';
  ctx.fillStyle = '#f5c542';
  ctx.fillText('✦ ⚡ ✦', 600, 1122);

  // Golden Patronus Stag Silhouette from Magic (1).jpg
  ctx.font = '76px serif';
  ctx.shadowColor = 'rgba(165, 215, 255, 0.95)';
  ctx.shadowBlur = 32;
  ctx.fillText('🦌', 600, 1245);

  // Inscription Title
  ctx.shadowColor = 'rgba(245, 197, 66, 0.55)';
  ctx.shadowBlur = 12;
  ctx.font = '700 28px "Space Grotesk", monospace';
  ctx.letterSpacing = '6px';
  ctx.fillStyle = '#d4af37';
  ctx.fillText('THE GRIMOIRE OF SPELLS', 600, 1345);

  ctx.font = '500 20px "Cinzel", serif';
  ctx.letterSpacing = '3px';
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText('KRISHNA MAKWANA · HOGWARTS CHRONICLES', 600, 1390);

  // Bottom Latin Seal
  ctx.font = 'italic 18px "MedievalSharp", Georgia, serif';
  ctx.fillStyle = 'rgba(218, 165, 32, 0.65)';
  ctx.fillText('« Draco Dormiens Nunquam Titillandus »', 600, 1480);

  ctx.restore();
  return canvas;
}

/**
 * Generates Inside Front Cover Texture (Vintage Marbled Parchment Endpaper)
 */
function generateInsideCoverCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1600;
  const ctx = canvas.getContext('2d');

  const bgGrad = ctx.createRadialGradient(600, 800, 80, 600, 800, 950);
  bgGrad.addColorStop(0, '#ebdcc0');
  bgGrad.addColorStop(0.7, '#cfbc90');
  bgGrad.addColorStop(1, '#a89464');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1200, 1600);

  // Astrolabe concentric lines
  ctx.save();
  ctx.strokeStyle = 'rgba(120, 80, 20, 0.18)';
  ctx.lineWidth = 2;
  for (let r = 80; r <= 600; r += 60) {
    ctx.beginPath();
    ctx.arc(600, 800, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Bookplate Inscription
  ctx.fillStyle = 'rgba(80, 50, 15, 0.85)';
  ctx.font = '900 38px "Cinzel", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('EX LIBRIS', 600, 680);

  ctx.font = '700 48px "Cinzel Decorative", Georgia, serif';
  ctx.fillStyle = '#541212';
  ctx.fillText('KRISHNA MAKWANA', 600, 770);

  ctx.font = 'italic 28px "MedievalSharp", serif';
  ctx.fillStyle = '#4a3319';
  ctx.fillText('Master of Full-Stack Sorcery & Machine Learning', 600, 840);

  ctx.strokeStyle = 'rgba(120, 80, 20, 0.4)';
  ctx.strokeRect(250, 580, 700, 360);
  ctx.strokeRect(260, 590, 680, 340);
  ctx.restore();

  return canvas;
}

/**
 * Creates aged deckled parchment base on a 2D canvas
 */
function createParchmentBase(ctx, width, height) {
  const grad = ctx.createRadialGradient(width * 0.5, height * 0.5, width * 0.2, width * 0.5, height * 0.5, width * 0.72);
  grad.addColorStop(0, '#faf4e6');
  grad.addColorStop(0.5, '#f3e8cb');
  grad.addColorStop(0.85, '#e2d2a8');
  grad.addColorStop(1, '#c7b07e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Fiber grain
  ctx.fillStyle = 'rgba(100, 70, 30, 0.035)';
  for (let i = 0; i < 4000; i++) {
    ctx.fillRect(Math.random() * width, Math.random() * height, Math.random() * 3 + 1, Math.random() * 2 + 1);
  }

  // Vignette
  const vignette = ctx.createRadialGradient(width * 0.5, height * 0.5, width * 0.35, width * 0.5, height * 0.5, width * 0.75);
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(0.7, 'rgba(120, 80, 30, 0.08)');
  vignette.addColorStop(1, 'rgba(60, 35, 10, 0.28)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);

  // Gold margin frame
  ctx.save();
  ctx.strokeStyle = 'rgba(180, 130, 50, 0.5)';
  ctx.lineWidth = 3;
  ctx.strokeRect(36, 36, width - 72, height - 72);

  ctx.strokeStyle = 'rgba(180, 130, 50, 0.25)';
  ctx.lineWidth = 1;
  ctx.strokeRect(44, 44, width - 88, height - 88);

  const corners = [[36, 36], [width - 36, 36], [36, height - 36], [width - 36, height - 36]];
  ctx.fillStyle = 'rgba(180, 130, 50, 0.7)';
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

/**
 * Draws marginal runes along page edges
 */
function drawMarginalRunes(ctx, x, yStart, count, isRightSide) {
  const runes = ['᚛', 'ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ', '✦', '✧', '⚡'];
  ctx.save();
  ctx.fillStyle = 'rgba(180, 120, 30, 0.65)';
  ctx.font = '22px "MedievalSharp", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(245, 197, 66, 0.6)';
  ctx.shadowBlur = 8;

  for (let i = 0; i < count; i++) {
    const rune = runes[(i * 3 + (isRightSide ? 7 : 2)) % runes.length];
    ctx.fillText(rune, x, yStart + i * 48);
  }
  ctx.restore();
}

/**
 * Generates the Left Page Canvas (Project Dossier & Tech Stack)
 */
function generateLeftPageCanvas(project, index, total) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1600;
  const ctx = canvas.getContext('2d');

  createParchmentBase(ctx, canvas.width, canvas.height);
  drawMarginalRunes(ctx, 65, 140, 28, false);

  // Folio Header
  ctx.save();
  ctx.fillStyle = 'rgba(140, 80, 20, 0.9)';
  ctx.font = '700 24px "Space Grotesk", monospace';
  ctx.letterSpacing = '4px';
  ctx.fillText(project.folio, 120, 120);

  ctx.textAlign = 'right';
  ctx.fillText(`FOLIO ${index + 1} / ${total}`, 1080, 120);
  ctx.restore();

  // Divider
  ctx.save();
  ctx.strokeStyle = 'rgba(185, 135, 45, 0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(120, 145);
  ctx.lineTo(1080, 145);
  ctx.stroke();

  ctx.fillStyle = '#b48228';
  ctx.font = '20px serif';
  ctx.textAlign = 'center';
  ctx.fillText('✦ ⚡ ✦', 600, 152);
  ctx.restore();

  // Category Tag Pill
  ctx.save();
  ctx.fillStyle = 'rgba(139, 24, 27, 0.88)';
  ctx.beginPath();
  ctx.roundRect(120, 190, 360, 44, [22]);
  ctx.fill();
  ctx.strokeStyle = 'rgba(245, 197, 66, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = '#fef08a';
  ctx.font = '600 18px "Space Grotesk", monospace';
  ctx.letterSpacing = '2px';
  ctx.textAlign = 'center';
  ctx.fillText(project.category.toUpperCase(), 300, 218);
  ctx.restore();

  // Project Title (Right side up, crystal-clear typography)
  ctx.save();
  ctx.fillStyle = '#1c130c';
  ctx.font = '900 62px "Cinzel", Georgia, serif';
  ctx.shadowColor = 'rgba(180, 120, 30, 0.25)';
  ctx.shadowBlur = 10;
  
  const words = project.title.split(' ');
  if (words.length > 3) {
    ctx.fillText(words.slice(0, 2).join(' '), 120, 320);
    ctx.fillText(words.slice(2).join(' '), 120, 395);
  } else {
    ctx.fillText(project.title, 120, 335);
  }
  ctx.restore();

  // Tagline
  ctx.save();
  ctx.fillStyle = '#6b4618';
  ctx.font = 'italic 500 28px "MedievalSharp", Georgia, serif';
  ctx.fillText(`"${project.tagline}"`, 120, 460);
  ctx.restore();

  // Description
  ctx.save();
  ctx.fillStyle = '#2d1f12';
  ctx.font = '400 28px "Outfit", Georgia, serif';
  
  const maxWidth = 940;
  const lineHeight = 44;
  let line = '';
  let y = 560;

  const descWords = project.description.split(' ');
  for (let n = 0; n < descWords.length; n++) {
    const testLine = line + descWords[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, 120, y);
      line = descWords[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 120, y);
  ctx.restore();

  // Tech Stack
  ctx.save();
  ctx.fillStyle = '#8c5018';
  ctx.font = '700 22px "Space Grotesk", monospace';
  ctx.letterSpacing = '3px';
  ctx.fillText('ENCHANTED FORMULAS & ARCHITECTURE:', 120, y + 90);

  let tagX = 120;
  let tagY = y + 120;
  project.tech.forEach((t) => {
    ctx.font = '600 20px "Space Grotesk", monospace';
    const tagWidth = ctx.measureText(t).width + 36;
    if (tagX + tagWidth > 1060) {
      tagX = 120;
      tagY += 56;
    }
    ctx.fillStyle = 'rgba(50, 35, 20, 0.08)';
    ctx.strokeStyle = 'rgba(160, 110, 40, 0.4)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(tagX, tagY, tagWidth, 42, [8]);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#3c2410';
    ctx.fillText(t, tagX + 18, tagY + 28);
    tagX += tagWidth + 14;
  });
  ctx.restore();

  // Buttons Representation
  const btnY = 1380;
  ctx.save();
  ctx.shadowColor = 'rgba(245, 197, 66, 0.65)';
  ctx.shadowBlur = 25;
  const btnGrad = ctx.createLinearGradient(120, btnY, 560, btnY + 74);
  btnGrad.addColorStop(0, '#8b181b');
  btnGrad.addColorStop(1, '#500b0d');
  ctx.fillStyle = btnGrad;
  ctx.beginPath();
  ctx.roundRect(120, btnY, 440, 74, [14]);
  ctx.fill();
  ctx.strokeStyle = '#f5c542';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 22px "Space Grotesk", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.textAlign = 'center';
  ctx.fillText('⚡ CAST SPELL · LIVE DEMO', 340, btnY + 45);
  ctx.restore();

  ctx.save();
  ctx.fillStyle = 'rgba(40, 25, 12, 0.12)';
  ctx.strokeStyle = 'rgba(140, 95, 35, 0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(600, btnY, 460, 74, [14]);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#2a1a0c';
  ctx.font = '700 22px "Space Grotesk", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.textAlign = 'center';
  ctx.fillText('📜 SOURCE SCROLL (GITHUB)', 830, btnY + 45);
  ctx.restore();

  return canvas;
}

/**
 * Draws visual artwork on Right Page Canvas
 */
function drawProjectArtwork(ctx, type, cx, cy, w, h) {
  ctx.save();
  const grad = ctx.createRadialGradient(cx, cy, 40, cx, cy, Math.max(w, h) * 0.7);

  if (type === 'police') {
    grad.addColorStop(0, '#131b2e');
    grad.addColorStop(0.6, '#090d17');
    grad.addColorStop(1, '#04060b');
    ctx.fillStyle = grad;
    ctx.fillRect(cx - w / 2, cy - h / 2, w, h);

    ctx.strokeStyle = '#f5c542';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#f5c542';
    ctx.shadowBlur = 25;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 140);
    ctx.lineTo(cx + 120, cy - 80);
    ctx.lineTo(cx + 90, cy + 90);
    ctx.lineTo(cx, cy + 160);
    ctx.lineTo(cx - 90, cy + 90);
    ctx.lineTo(cx - 120, cy - 80);
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = 'rgba(245, 197, 66, 0.12)';
    ctx.fill();

    ctx.fillStyle = '#fef08a';
    ctx.font = '64px serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚡', cx, cy + 20);

    ctx.font = '700 24px "Space Grotesk", sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText('SANYOGITA AI', cx, cy + 80);
    ctx.font = '500 16px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('CITIZEN PROTECTION SENTINEL', cx, cy + 110);

  } else if (type === 'cinema') {
    grad.addColorStop(0, '#1c152b');
    grad.addColorStop(0.6, '#0f0b18');
    grad.addColorStop(1, '#06040a');
    ctx.fillStyle = grad;
    ctx.fillRect(cx - w / 2, cy - h / 2, w, h);

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 20;

    for (let r = 50; r <= 150; r += 35) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = '#7dd3fc';
    ctx.font = '56px serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎬', cx, cy + 18);

    ctx.font = '700 24px "Space Grotesk", sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('VECTOR CINEMA ML', cx, cy + 105);

  } else if (type === 'drive') {
    grad.addColorStop(0, '#0c221a');
    grad.addColorStop(0.6, '#06130e');
    grad.addColorStop(1, '#030806');
    ctx.fillStyle = grad;
    ctx.fillRect(cx - w / 2, cy - h / 2, w, h);

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 20;

    const nodes = [[cx, cy - 90], [cx - 110, cy + 80], [cx + 110, cy + 80]];
    ctx.beginPath();
    ctx.moveTo(nodes[0][0], nodes[0][1]);
    ctx.lineTo(nodes[1][0], nodes[1][1]);
    ctx.lineTo(nodes[2][0], nodes[2][1]);
    ctx.closePath();
    ctx.stroke();

    nodes.forEach(([nx, ny]) => {
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(nx, ny, 16, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = '#6ee7b7';
    ctx.font = '700 24px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CLOUD MULTI-SYNC', cx, cy + 12);

  } else if (type === 'vault') {
    grad.addColorStop(0, '#24142e');
    grad.addColorStop(0.6, '#130a1a');
    grad.addColorStop(1, '#08030b');
    ctx.fillStyle = grad;
    ctx.fillRect(cx - w / 2, cy - h / 2, w, h);

    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 24;

    ctx.beginPath();
    ctx.arc(cx, cy, 120, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#f3e8ff';
    ctx.font = '54px serif';
    ctx.textAlign = 'center';
    ctx.fillText('🔒', cx, cy + 18);

    ctx.font = '700 22px "Space Grotesk", sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('AES-256 GCM VAULT', cx, cy + 85);

  } else {
    grad.addColorStop(0, '#2b1414');
    grad.addColorStop(0.6, '#170909');
    grad.addColorStop(1, '#0a0303');
    ctx.fillStyle = grad;
    ctx.fillRect(cx - w / 2, cy - h / 2, w, h);

    ctx.strokeStyle = '#f87171';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 22;

    ctx.beginPath();
    ctx.ellipse(cx, cy, 140, 80, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 45, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#fca5a5';
    ctx.font = '700 22px "Space Grotesk", sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('GAZE ATTENTION SENTINEL', cx, cy + 115);
  }

  ctx.restore();
}

/**
 * Generates the Right Page Canvas (Enchanted Mirror Preview)
 */
function generateRightPageCanvas(project, index, total) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1600;
  const ctx = canvas.getContext('2d');

  createParchmentBase(ctx, canvas.width, canvas.height);
  drawMarginalRunes(ctx, 1135, 140, 28, true);

  // Top header
  ctx.save();
  ctx.fillStyle = 'rgba(140, 80, 20, 0.9)';
  ctx.font = '700 24px "Space Grotesk", monospace';
  ctx.letterSpacing = '3px';
  ctx.fillText('✦ ENCHANTED VISUALIZATION · MIRROR PORTAL', 120, 120);

  ctx.textAlign = 'right';
  ctx.fillText(`SCROLL SPREAD ${index + 1}`, 1080, 120);
  ctx.restore();

  // Gold line
  ctx.save();
  ctx.strokeStyle = 'rgba(185, 135, 45, 0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(120, 145);
  ctx.lineTo(1080, 145);
  ctx.stroke();
  ctx.restore();

  // Viewing Window
  const winX = 120;
  const winY = 200;
  const winW = 960;
  const winH = 920;

  ctx.save();
  ctx.fillStyle = '#1c1611';
  ctx.strokeStyle = '#b8860b';
  ctx.lineWidth = 6;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
  ctx.shadowBlur = 30;
  ctx.beginPath();
  ctx.roundRect(winX - 8, winY - 8, winW + 16, winH + 16, [16]);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  drawProjectArtwork(ctx, project.previewType, winX + winW / 2, winY + winH / 2, winW, winH);

  // Status Bar
  ctx.save();
  ctx.fillStyle = 'rgba(8, 6, 12, 0.85)';
  ctx.fillRect(winX, winY, winW, 46);
  ctx.fillStyle = '#f5c542';
  ctx.font = '600 16px "Space Grotesk", monospace';
  ctx.fillText(`● ACTIVE MIRROR STREAM · ${project.badgeText}`, winX + 24, winY + 30);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('FPS: 60 · LATENCY: 12ms', winX + winW - 24, winY + 30);
  ctx.restore();

  // Explanatory Plate
  const plateY = 1170;
  ctx.save();
  ctx.fillStyle = 'rgba(50, 35, 18, 0.07)';
  ctx.strokeStyle = 'rgba(160, 110, 40, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(120, plateY, 960, 290, [12]);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#8c5018';
  ctx.font = '700 22px "Space Grotesk", monospace';
  ctx.letterSpacing = '2px';
  ctx.fillText('ARCHITECTURAL INCANTATION & KEY BREAKTHROUGH:', 155, plateY + 45);

  ctx.fillStyle = '#2c1e11';
  ctx.font = '400 24px "Outfit", Georgia, serif';
  const notes = [
    `• Engineered with high-performance responsive architecture & microsecond latency.`,
    `• Secure authenticated state isolation preserving zero-leak user session safety.`,
    `• Built from scratch with production-grade test coverage and CI/CD automation.`
  ];
  notes.forEach((note, i) => {
    ctx.fillText(note, 155, plateY + 105 + i * 50);
  });
  ctx.restore();

  return canvas;
}

// ==========================================================================
// 3. THREE.JS 3D GRIMOIRE MODEL & PAGE FLIPPING RIGGING
// ==========================================================================

export class BookOfSpellsViewer {
  constructor(container) {
    this.container = container;
    this.projects = SPELLBOOK_PROJECTS;
    this.currentSpreadIndex = 0;
    this.isBookOpen = false;

    // Three.js Core
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.bookGroup = null;
    this.frontCoverGroup = null;
    this.leafMeshes = [];
    this.embers = null;
    this.pointLight = null;
    this.houseAccentLight = null;

    // Dimensions (carefully scaled to frame flat and centered in viewport)
    this.pageWidth = 3.2;
    this.pageHeight = 4.4;
    this.pageThickness = 0.10;

    this.animationFrameId = null;
    this.clock = new THREE.Clock();
    this.isDisposed = false;

    this.init();
  }

  init() {
    this.setupRenderer();
    this.setupSceneAndCamera();
    this.setupLighting();
    this.buildAntiqueLeatherBacking();
    this.buildPagesAndParchmentSpreads();
    this.buildFrontCover();
    this.buildSpineEmbers();
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
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);
  }

  setupSceneAndCamera() {
    this.scene = new THREE.Scene();

    const aspect = this.container.clientWidth / this.container.clientHeight;
    // Straight front-facing camera with comfortable 48 FOV
    this.camera = new THREE.PerspectiveCamera(48, aspect, 0.1, 100);

    // Straight-on camera perspective (flat and clearly readable)
    this.camera.position.set(0, 0, 5.6);
    this.camera.lookAt(0, 0, 0);

    this.bookGroup = new THREE.Group();
    // Very subtle natural viewing tilt (0.05 rad / ~2.8 deg, essentially flat)
    this.bookGroup.rotation.set(0.05, 0, 0);

    // Starts offset by -pageWidth / 2 so when closed, the front cover sits exactly in the center of the screen
    this.bookGroup.position.set(-this.pageWidth / 2, 0, 0);

    this.scene.add(this.bookGroup);
  }

  setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x2d2430, 2.0);
    this.scene.add(ambientLight);

    // Direct Key Light facing straight on with slight elevation
    const keyLight = new THREE.DirectionalLight(0xfff6e4, 2.6);
    keyLight.position.set(0, 4, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    this.scene.add(keyLight);

    // Subtle side fill lights
    const leftFill = new THREE.DirectionalLight(0xa5b4fc, 0.7);
    leftFill.position.set(-4, 1, 4);
    this.scene.add(leftFill);

    const rightFill = new THREE.DirectionalLight(0xfde68a, 0.7);
    rightFill.position.set(4, 1, 4);
    this.scene.add(rightFill);

    // Warm Spine Point Light
    this.pointLight = new THREE.PointLight(0xf5c542, 2.8, 8);
    this.pointLight.position.set(0, 0.5, 0.9);
    this.bookGroup.add(this.pointLight);

    // Dynamic House Accent Light
    this.houseAccentLight = new THREE.PointLight(0x8b181b, 2.4, 10);
    this.houseAccentLight.position.set(-3, 1, 3);
    this.scene.add(this.houseAccentLight);
  }

  /**
   * Builds the Back Covers & Underneath Leather Foundation
   * (NO central spine cylinder protruding between pages!)
   */
  buildAntiqueLeatherBacking() {
    const coverWidth = this.pageWidth + 0.18;
    const coverHeight = this.pageHeight + 0.22;
    const coverThickness = 0.08;

    const leatherMaterial = new THREE.MeshStandardMaterial({
      color: 0x18100b,
      roughness: 0.88,
      metalness: 0.12
    });

    const brassMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.88,
      roughness: 0.28
    });

    // Left Back Cover
    const leftCoverGeo = new THREE.BoxGeometry(coverWidth, coverHeight, coverThickness);
    leftCoverGeo.translate(-coverWidth / 2, 0, -coverThickness / 2 - 0.03);
    const leftCover = new THREE.Mesh(leftCoverGeo, leatherMaterial);
    leftCover.receiveShadow = true;
    this.bookGroup.add(leftCover);

    // Right Back Cover
    const rightCoverGeo = new THREE.BoxGeometry(coverWidth, coverHeight, coverThickness);
    rightCoverGeo.translate(coverWidth / 2, 0, -coverThickness / 2 - 0.03);
    const rightCover = new THREE.Mesh(rightCoverGeo, leatherMaterial);
    rightCover.receiveShadow = true;
    this.bookGroup.add(rightCover);

    // Recessed Seamless Leather Spine Hinge strictly underneath the book (no black cylinder rod!)
    const spineBackingGeo = new THREE.BoxGeometry(0.45, coverHeight, coverThickness);
    spineBackingGeo.translate(0, 0, -coverThickness / 2 - 0.03);
    const spineBacking = new THREE.Mesh(spineBackingGeo, leatherMaterial);
    this.bookGroup.add(spineBacking);

    // Back Brass Corners
    const cornerSize = 0.32;
    const cornerGeo = new THREE.BoxGeometry(cornerSize, cornerSize, coverThickness + 0.02);
    const cornerCoords = [
      [-coverWidth + cornerSize / 2, coverHeight / 2 - cornerSize / 2],
      [-coverWidth + cornerSize / 2, -coverHeight / 2 + cornerSize / 2],
      [coverWidth - cornerSize / 2, coverHeight / 2 - cornerSize / 2],
      [coverWidth - cornerSize / 2, -coverHeight / 2 + cornerSize / 2]
    ];

    cornerCoords.forEach(([cx, cy]) => {
      const cornerMesh = new THREE.Mesh(cornerGeo, brassMaterial);
      cornerMesh.position.set(cx, cy, -coverThickness / 2 - 0.03);
      this.bookGroup.add(cornerMesh);
    });

    // Stacked Parchment Edges Block (Left & Right side blocks showing layered pages)
    const blockMat = new THREE.MeshStandardMaterial({
      color: 0xd4c29a,
      roughness: 0.95,
      metalness: 0.05
    });

    const leftStackGeo = new THREE.BoxGeometry(this.pageWidth, this.pageHeight * 0.98, this.pageThickness);
    leftStackGeo.translate(-this.pageWidth / 2, 0, -this.pageThickness / 2);
    const leftStack = new THREE.Mesh(leftStackGeo, blockMat);
    this.bookGroup.add(leftStack);

    const rightStackGeo = new THREE.BoxGeometry(this.pageWidth, this.pageHeight * 0.98, this.pageThickness);
    rightStackGeo.translate(this.pageWidth / 2, 0, -this.pageThickness / 2);
    const rightStack = new THREE.Mesh(rightStackGeo, blockMat);
    this.bookGroup.add(rightStack);
  }

  /**
   * Builds the hinged Front Leather Cover that opens during Scroll Phase 1
   */
  buildFrontCover() {
    const coverWidth = this.pageWidth + 0.18;
    const coverHeight = this.pageHeight + 0.22;

    // Outer texture: Magic (1).jpg golden crest & rich brown leather
    const coverCanvas = generateCoverCanvas();
    const coverTexture = new THREE.CanvasTexture(coverCanvas);
    coverTexture.colorSpace = THREE.SRGBColorSpace;
    coverTexture.anisotropy = 4;

    // Inside texture: Marbled vintage endpaper
    const insideCanvas = generateInsideCoverCanvas();
    const insideTexture = new THREE.CanvasTexture(insideCanvas);
    insideTexture.colorSpace = THREE.SRGBColorSpace;
    insideTexture.anisotropy = 4;

    const frontCoverGeo = new THREE.PlaneGeometry(coverWidth, coverHeight, 16, 8);
    frontCoverGeo.translate(coverWidth / 2, 0, 0); // Pivot along spine x = 0

    const outerMat = new THREE.MeshStandardMaterial({
      map: coverTexture,
      roughness: 0.82,
      metalness: 0.18,
      side: THREE.FrontSide
    });

    const innerMat = new THREE.MeshStandardMaterial({
      map: insideTexture,
      roughness: 0.88,
      metalness: 0.08,
      side: THREE.BackSide
    });

    this.frontCoverGroup = new THREE.Group();
    // Sits directly on top of the right page stack
    this.frontCoverGroup.position.set(0, 0, 0.04);

    const outerMesh = new THREE.Mesh(frontCoverGeo, outerMat);
    outerMesh.position.z = 0.002;
    outerMesh.castShadow = true;
    outerMesh.receiveShadow = true;

    const innerMesh = new THREE.Mesh(frontCoverGeo, innerMat);
    innerMesh.position.z = -0.002;
    innerMesh.castShadow = true;
    innerMesh.receiveShadow = true;

    this.frontCoverGroup.add(outerMesh);
    this.frontCoverGroup.add(innerMesh);

    // Starts at angle 0 (Closed Book covering the right pages)
    this.bookGroup.add(this.frontCoverGroup);
  }

  buildPagesAndParchmentSpreads() {
    const total = this.projects.length;
    const leftTextures = [];
    const rightTextures = [];

    this.projects.forEach((proj, idx) => {
      const leftCanvas = generateLeftPageCanvas(proj, idx, total);
      const leftTex = new THREE.CanvasTexture(leftCanvas);
      leftTex.colorSpace = THREE.SRGBColorSpace;
      leftTex.anisotropy = 4;
      leftTextures.push(leftTex);

      const rightCanvas = generateRightPageCanvas(proj, idx, total);
      const rightTex = new THREE.CanvasTexture(rightCanvas);
      rightTex.colorSpace = THREE.SRGBColorSpace;
      rightTex.anisotropy = 4;
      rightTextures.push(rightTex);
    });

    this.leftTextures = leftTextures;
    this.rightTextures = rightTextures;

    // Static Base Left Page (Displays Folio 1 Left Page)
    const baseLeftGeo = new THREE.PlaneGeometry(this.pageWidth, this.pageHeight);
    baseLeftGeo.translate(-this.pageWidth / 2, 0, 0.005);
    const baseLeftMat = new THREE.MeshStandardMaterial({
      map: leftTextures[0],
      roughness: 0.88,
      metalness: 0.05,
      side: THREE.FrontSide
    });
    this.baseLeftPage = new THREE.Mesh(baseLeftGeo, baseLeftMat);
    this.bookGroup.add(this.baseLeftPage);

    // Static Base Right Page (Displays Last Folio Right Page)
    const baseRightGeo = new THREE.PlaneGeometry(this.pageWidth, this.pageHeight);
    baseRightGeo.translate(this.pageWidth / 2, 0, 0.005);
    const baseRightMat = new THREE.MeshStandardMaterial({
      map: rightTextures[total - 1],
      roughness: 0.88,
      metalness: 0.05,
      side: THREE.FrontSide
    });
    this.baseRightPage = new THREE.Mesh(baseRightGeo, baseRightMat);
    this.bookGroup.add(this.baseRightPage);

    // Flipping Leaves (Total: total - 1 leaves)
    this.leafMeshes = [];
    const segmentsX = 36;
    const segmentsY = 18;

    for (let k = 0; k < total - 1; k++) {
      const geo = new THREE.PlaneGeometry(this.pageWidth, this.pageHeight, segmentsX, segmentsY);
      geo.userData = {
        origPositions: geo.attributes.position.array.slice()
      };

      const frontMat = new THREE.MeshStandardMaterial({
        map: rightTextures[k],
        roughness: 0.88,
        metalness: 0.05,
        side: THREE.FrontSide
      });

      const backMat = new THREE.MeshStandardMaterial({
        map: leftTextures[k + 1],
        roughness: 0.88,
        metalness: 0.05,
        side: THREE.BackSide
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

      // Stacked on right side
      leafGroup.position.z = 0.01 + (total - k) * 0.004;

      this.bookGroup.add(leafGroup);
      this.leafMeshes.push({
        group: leafGroup,
        geometry: geo,
        frontMesh,
        backMesh,
        angle: 0
      });
    }
  }

  /**
   * Applies realistic paper curvature and bend physics tuned for clean front-facing projection
   */
  deformLeafGeometry(leafItem, theta) {
    const geo = leafItem.geometry;
    const pos = geo.attributes.position;
    const orig = geo.userData.origPositions;
    const W = this.pageWidth;
    const H = this.pageHeight;

    const isTurning = theta > 0.001 && theta < Math.PI - 0.001;

    for (let i = 0; i < pos.count; i++) {
      const idx = i * 3;
      const ox = orig[idx];
      const oy = orig[idx + 1];
      const u = (ox + W / 2) / W; // 0 at spine, 1 at outer edge

      if (!isTurning) {
        const sideAngle = theta >= Math.PI / 2 ? Math.PI : 0;
        const xDir = Math.cos(sideAngle);
        pos.array[idx] = xDir * (u * W);
        pos.array[idx + 1] = oy;
        pos.array[idx + 2] = 0;
      } else {
        // Dynamic Paper Curvature Physics
        const bendAngle = theta * Math.pow(u, 0.72);
        const lift = Math.sin(theta) * 0.95 * Math.sin(u * Math.PI);
        const cornerCurl = Math.sin(theta) * 0.12 * (1.0 - u) * Math.sin((oy / H) * Math.PI);

        pos.array[idx] = u * W * Math.cos(bendAngle);
        pos.array[idx + 1] = oy;
        pos.array[idx + 2] = u * W * Math.sin(bendAngle) + lift + cornerCurl;
      }
    }

    pos.needsUpdate = true;
    geo.computeVertexNormals();
  }

  buildSpineEmbers() {
    const emberCount = 120;
    const emberGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(emberCount * 3);
    const velocities = [];
    const sizes = new Float32Array(emberCount);

    for (let i = 0; i < emberCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.3;
      positions[i * 3 + 1] = (Math.random() - 0.5) * this.pageHeight;
      positions[i * 3 + 2] = Math.random() * 0.5 + 0.1;

      velocities.push({
        vx: (Math.random() - 0.5) * 0.006,
        vy: Math.random() * 0.015 + 0.008,
        vz: Math.random() * 0.006 + 0.003
      });

      sizes[i] = Math.random() * 8.0 + 4.0;
    }

    emberGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    emberGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const radGrad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    radGrad.addColorStop(0, 'rgba(255, 240, 180, 1)');
    radGrad.addColorStop(0.3, 'rgba(245, 197, 66, 0.85)');
    radGrad.addColorStop(0.7, 'rgba(217, 119, 6, 0.35)');
    radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, 64, 64);

    const emberTexture = new THREE.CanvasTexture(canvas);

    const emberMat = new THREE.PointsMaterial({
      color: 0xffd070,
      size: 0.16,
      map: emberTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.embers = new THREE.Points(emberGeo, emberMat);
    this.embers.userData = { velocities };
    this.bookGroup.add(this.embers);
  }

  setupScrollTrigger() {
    const section = document.getElementById('projects');
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: '#projects',
      start: 'top top',
      end: '+=3600',
      pin: true,
      scrub: 1.2,
      anticipatePin: 1,
      onUpdate: (self) => {
        this.updateScrollSequence(self.progress);
      }
    });

    this.scrollTrigger = trigger;
  }

  /**
   * Scroll Sequence Driver:
   * Progress in [0, 0.18]: Phase 1 - Front Cover Opens & Book shifts from X = -W/2 to 0 (Symmetrically Centered)
   * Progress in [0.18, 1.0]: Phase 2 - Project pages flip from right to left
   */
  updateScrollSequence(progress) {
    const coverPhaseEnd = 0.18;
    const halfWidth = this.pageWidth / 2;

    if (progress <= coverPhaseEnd) {
      // Phase 1: Book Opens from completely closed to fully open
      const coverNorm = progress / coverPhaseEnd; // 0 to 1
      const easeT = gsap.parseEase('power2.inOut')(coverNorm);
      const coverAngle = easeT * Math.PI;

      // Group smoothly translates from -halfWidth to 0 so closed book is centered, and open book is centered
      if (this.bookGroup) {
        this.bookGroup.position.x = -halfWidth * (1 - easeT);
      }

      if (this.frontCoverGroup) {
        this.frontCoverGroup.rotation.y = coverAngle;
        this.frontCoverGroup.position.z = 0.04 + Math.sin(easeT * Math.PI) * 0.45;
      }

      // Reset all project pages to resting right
      this.leafMeshes.forEach((leaf) => {
        leaf.angle = 0;
        this.deformLeafGeometry(leaf, 0);
      });

      this.isBookOpen = progress > 0.08;
      this.syncClosedStateHUD(progress <= 0.06);

    } else {
      // Phase 2: Front Cover is fully open on the left, book stays centered at X = 0
      if (this.bookGroup) {
        this.bookGroup.position.x = 0;
      }

      if (this.frontCoverGroup) {
        this.frontCoverGroup.rotation.y = Math.PI;
        this.frontCoverGroup.position.z = 0.04;
      }

      this.isBookOpen = true;

      // Project page flips mapped across remaining scroll
      const pageNorm = (progress - coverPhaseEnd) / (1.0 - coverPhaseEnd); // 0 to 1
      const totalFlips = this.projects.length - 1;
      const rawPageProg = pageNorm * totalFlips;
      const clampedPageProg = Math.max(0, Math.min(totalFlips, rawPageProg));

      for (let k = 0; k < totalFlips; k++) {
        const leafItem = this.leafMeshes[k];
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
        this.deformLeafGeometry(leafItem, theta);

        if (leafProgress >= 0.999) {
          leafItem.group.position.z = 0.01 + k * 0.003;
        } else if (leafProgress <= 0.001) {
          leafItem.group.position.z = 0.01 + (totalFlips - k) * 0.003;
        } else {
          leafItem.group.position.z = 0.16;
        }
      }

      const activeIndex = Math.min(this.projects.length - 1, Math.round(clampedPageProg));
      if (activeIndex !== this.currentSpreadIndex) {
        this.currentSpreadIndex = activeIndex;
        this.syncActiveProjectHUD(activeIndex);
      }
    }
  }

  syncClosedStateHUD(isFullyClosed) {
    const folioBadge = document.getElementById('spells-hud-folio');
    const titleEl = document.getElementById('spells-hud-title');
    const catEl = document.getElementById('spells-hud-category');
    const scrollHint = document.querySelector('.spells-hud-scroll-hint span');
    const actionsWrap = document.querySelector('.spells-hud-actions');
    const dots = document.querySelectorAll('.spells-folio-dot');

    if (isFullyClosed) {
      if (folioBadge) folioBadge.textContent = '✦ THE GRIMOIRE OF SPELLS · CLOSED ✦';
      if (titleEl) titleEl.textContent = 'Those Who Don\'t Believe in Magic Will Never Find It';
      if (catEl) catEl.textContent = 'Antique Leather Grimoire · Touch & Scroll to Open';
      if (scrollHint) scrollHint.textContent = 'Scroll to Open Grimoire';
      if (actionsWrap) actionsWrap.style.opacity = '0.35';
      dots.forEach(d => d.classList.remove('active'));
    } else {
      if (scrollHint) scrollHint.textContent = 'Scroll to Turn Pages';
      if (actionsWrap) actionsWrap.style.opacity = '1';
      this.syncActiveProjectHUD(0);
    }
  }

  syncActiveProjectHUD(index) {
    const proj = this.projects[index];
    if (!proj) return;

    const folioBadge = document.getElementById('spells-hud-folio');
    const titleEl = document.getElementById('spells-hud-title');
    const catEl = document.getElementById('spells-hud-category');
    const liveLink = document.getElementById('spells-hud-btn-live');
    const codeLink = document.getElementById('spells-hud-btn-code');
    const actionsWrap = document.querySelector('.spells-hud-actions');
    const dots = document.querySelectorAll('.spells-folio-dot');

    if (actionsWrap) actionsWrap.style.opacity = '1';
    if (folioBadge) folioBadge.textContent = proj.folio;
    if (titleEl) titleEl.textContent = proj.title;
    if (catEl) catEl.textContent = proj.category;
    if (liveLink) liveLink.href = proj.liveUrl;
    if (codeLink) codeLink.href = proj.githubUrl;

    dots.forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
  }

  setupEventListeners() {
    this.onResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.onResize);

    this.onHouseChanged = (e) => {
      const house = e.detail?.house || 'gryffindor';
      this.updateHouseAmbientLight(house);
    };
    document.addEventListener('hp_house_changed', this.onHouseChanged);

    const currentTheme = Array.from(document.body.classList).find(c => c.startsWith('theme-'));
    if (currentTheme) {
      this.updateHouseAmbientLight(currentTheme.replace('theme-', ''));
    }
  }

  updateHouseAmbientLight(house) {
    if (!this.houseAccentLight) return;

    let color = 0x8b181b;
    if (house === 'slytherin') color = 0x10b981;
    if (house === 'ravenclaw') color = 0x38bdf8;
    if (house === 'hufflepuff') color = 0xecb939;

    gsap.to(this.houseAccentLight.color, {
      r: ((color >> 16) & 255) / 255,
      g: ((color >> 8) & 255) / 255,
      b: (color & 255) / 255,
      duration: 0.6,
      ease: 'power2.out'
    });
  }

  handleResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;

    // Responsive straight front-facing camera framing
    if (width < 768) {
      this.camera.position.set(0, 0, 7.8);
      this.bookGroup.scale.set(0.72, 0.72, 0.72);
    } else if (width < 1100) {
      this.camera.position.set(0, 0, 6.4);
      this.bookGroup.scale.set(0.88, 0.88, 0.88);
    } else {
      this.camera.position.set(0, 0, 5.6);
      this.bookGroup.scale.set(1, 1, 1);
    }

    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    if (this.isDisposed) return;
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));

    const time = this.clock.getElapsedTime();

    // Subtle gentle levitation
    if (this.bookGroup) {
      this.bookGroup.position.y = Math.sin(time * 1.3) * 0.06;
      this.bookGroup.rotation.z = Math.cos(time * 0.9) * 0.008;
    }

    // Spine embers
    if (this.embers) {
      const pos = this.embers.geometry.attributes.position;
      const vels = this.embers.userData.velocities;
      const halfH = this.pageHeight / 2;

      for (let i = 0; i < pos.count; i++) {
        const idx = i * 3;
        pos.array[idx + 1] += vels[i].vy;
        pos.array[idx] += vels[i].vx + Math.sin(time * 2 + i) * 0.001;
        pos.array[idx + 2] += vels[i].vz;

        if (pos.array[idx + 1] > halfH + 1.2) {
          pos.array[idx + 1] = -halfH + (Math.random() * 0.4);
          pos.array[idx] = (Math.random() - 0.5) * 0.3;
          pos.array[idx + 2] = Math.random() * 0.5 + 0.1;
        }
      }
      pos.needsUpdate = true;
    }

    // Warm point light pulse
    if (this.pointLight) {
      this.pointLight.intensity = 2.6 + Math.sin(time * 2.2) * 0.3;
    }

    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Programmatic folio navigation
   */
  flipToSpread(index) {
    if (index < 0 || index >= this.projects.length) return;
    const coverPhaseEnd = 0.18;
    const totalFlips = this.projects.length - 1;
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
    document.removeEventListener('hp_house_changed', this.onHouseChanged);

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

  const prevBtn = document.getElementById('spells-hud-prev');
  const nextBtn = document.getElementById('spells-hud-next');
  const dots = document.querySelectorAll('.spells-folio-dot');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (activeBookInstance) {
        activeBookInstance.flipToSpread(activeBookInstance.currentSpreadIndex - 1);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (activeBookInstance) {
        activeBookInstance.flipToSpread(activeBookInstance.currentSpreadIndex + 1);
      }
    });
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetIdx = parseInt(dot.getAttribute('data-index') || '0', 10);
      if (activeBookInstance) {
        activeBookInstance.flipToSpread(targetIdx);
      }
    });
  });

  return activeBookInstance;
}
