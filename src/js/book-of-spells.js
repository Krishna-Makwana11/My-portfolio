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
 * Draws an ornate antique gilded filigree corner bracket
 */
function drawFiligreeCorner(ctx, x, y, size, flipX, flipY) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);

  // Outer corner L-bracket line
  ctx.strokeStyle = '#d4af37';
  ctx.fillStyle = '#f5c542';
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(0, size);
  ctx.lineTo(0, 0);
  ctx.lineTo(size, 0);
  ctx.stroke();

  // Fine inner filigree curve
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(14, size - 16);
  ctx.quadraticCurveTo(14, 14, size - 16, 14);
  ctx.stroke();

  // Corner rivets & decorative dots
  ctx.beginPath();
  ctx.arc(8, 8, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(size - 10, 14, 3.5, 0, Math.PI * 2);
  ctx.arc(14, size - 10, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // Leaf / scroll curve
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(size * 0.4, size * 0.15, size * 0.5, size * 0.5);
  ctx.quadraticCurveTo(size * 0.15, size * 0.4, 0, 0);
  ctx.fillStyle = 'rgba(212, 175, 55, 0.45)';
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

/**
 * Generates Dark Antique Weathered Leather Texture (for Cover Slabs, Spine & Back Cover)
 * Features rich weathered leather grain, gilded double borders, 4 corner filigree brackets,
 * and an embossed central Hogwarts grimoire medallion.
 */
function generateAntiqueLeatherCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1400;
  const ctx = canvas.getContext('2d');

  // Deep antique leather gradient with subtle warm vignette
  const grad = ctx.createRadialGradient(512, 700, 120, 512, 700, 950);
  grad.addColorStop(0, '#1c080b');
  grad.addColorStop(0.5, '#120406');
  grad.addColorStop(0.85, '#0a0203');
  grad.addColorStop(1, '#050102');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1400);

  // Weathered leather organic pores & grain
  ctx.fillStyle = 'rgba(255, 230, 200, 0.035)';
  for (let i = 0; i < 16000; i++) {
    ctx.fillRect(Math.random() * 1024, Math.random() * 1400, 2, 2);
  }

  // Antique leather creasing
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 35; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * 1024, Math.random() * 1400);
    ctx.lineTo(Math.random() * 1024, Math.random() * 1400);
    ctx.stroke();
  }

  // Double gilded margin borders
  ctx.save();
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(32, 32, 960, 1336);

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.22)';
  ctx.lineWidth = 1;
  ctx.strokeRect(44, 44, 936, 1312);
  ctx.restore();

  // 4 Ornate Antique Corner Filigree Brackets
  drawFiligreeCorner(ctx, 32, 32, 130, false, false);
  drawFiligreeCorner(ctx, 1024 - 32, 32, 130, true, false);
  drawFiligreeCorner(ctx, 32, 1400 - 32, 130, false, true);
  drawFiligreeCorner(ctx, 1024 - 32, 1400 - 32, 130, true, true);

  // Centered Embossed Gilded Hogwarts Grimoire Medallion
  ctx.save();
  ctx.translate(512, 700);

  // Outer medallion circle
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 190, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.20)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, 204, 0, Math.PI * 2);
  ctx.stroke();

  // Inner decorative rune circle
  ctx.setLineDash([6, 8]);
  ctx.beginPath();
  ctx.arc(0, 0, 174, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Central 8-pointed star / Hogwarts sigil
  ctx.strokeStyle = 'rgba(245, 197, 66, 0.55)';
  ctx.fillStyle = 'rgba(212, 175, 55, 0.12)';
  ctx.lineWidth = 2.5;
  for (let r = 0; r < 2; r++) {
    ctx.save();
    ctx.rotate((r * Math.PI) / 4);
    ctx.strokeRect(-90, -90, 180, 180);
    ctx.fillRect(-90, -90, 180, 180);
    ctx.restore();
  }

  // Central emblem typography
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fef3c7';
  ctx.font = '900 22px "Cinzel", Georgia, serif';
  ctx.letterSpacing = '5px';
  ctx.shadowColor = 'rgba(245, 197, 66, 0.7)';
  ctx.shadowBlur = 10;
  ctx.fillText('HOGWARTS', 0, -10);

  ctx.font = '600 14px "Cinzel", Georgia, serif';
  ctx.letterSpacing = '4px';
  ctx.fillStyle = 'rgba(245, 197, 66, 0.75)';
  ctx.fillText('RESTRICTED SECTION', 0, 18);

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
 * Draws Base High-Resolution Vintage Parchment (with fibers, age patina, double margins, and gutter shadow)
 */
function drawParchmentBase(ctx, width, height, isLeft) {
  // Rich antique parchment radial vignette
  const grad = ctx.createRadialGradient(width / 2, height / 2, 180, width / 2, height / 2, 950);
  grad.addColorStop(0, '#fcf8ec');
  grad.addColorStop(0.4, '#f5e9ce');
  grad.addColorStop(0.75, '#e4d0a2');
  grad.addColorStop(1, '#be9d62');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Micro organic parchment fiber flecks
  ctx.fillStyle = 'rgba(95, 60, 20, 0.035)';
  for (let i = 0; i < 4000; i++) {
    ctx.fillRect(Math.random() * width, Math.random() * height, Math.random() * 3 + 1, Math.random() * 2 + 1);
  }

  // Soft vintage age patina
  for (let i = 0; i < 6; i++) {
    const rx = Math.random() * (width - 200) + 100;
    const ry = Math.random() * (height - 200) + 100;
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
  ctx.strokeRect(50, 50, width - 100, height - 100);

  ctx.strokeStyle = 'rgba(163, 116, 44, 0.2)';
  ctx.lineWidth = 1;
  ctx.strokeRect(62, 62, width - 124, height - 124);

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
  drawCornerFlourish(width - 62, 62, true, false);
  drawCornerFlourish(62, height - 62, false, true);
  drawCornerFlourish(width - 62, height - 62, true, true);

  // Soft binding gutter shadow on the spine side
  const gutterX = isLeft ? width - 40 : 40;
  const shadowGrad = ctx.createLinearGradient(gutterX, 0, isLeft ? width - 120 : 120, 0);
  shadowGrad.addColorStop(0, 'rgba(60, 35, 12, 0.18)');
  shadowGrad.addColorStop(1, 'rgba(60, 35, 12, 0)');
  ctx.fillStyle = shadowGrad;
  ctx.fillRect(isLeft ? width - 140 : 40, 50, 100, height - 100);

  ctx.restore();
}

/**
 * Generates Clean High-Resolution Blank Vintage Parchment Texture
 * (PURE CLEAN SLATE: Zero dummy text, zero headers, zero titles, zero badges, zero overlays)
 */
function generateCleanBlankParchmentCanvas(isLeft, existingCanvas = null) {
  const canvas = existingCanvas || document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1600;
  const ctx = canvas.getContext('2d');
  drawParchmentBase(ctx, canvas.width, canvas.height, isLeft);
  return canvas;
}

/**
 * Generates First Right-Hand Page with Elegant Wizarding Intro Profile Card Typography
 * Features:
 * - Base parchment matching blank parchment (radial vignette, fiber flecks, patina, margins, filigrees)
 * - Large wizarding profile card container with subtle antique gilded borders & corner filigrees
 * - Large header kicker "PORTFOLIO OF ENCHANTED WORKS"
 * - Prominent Primary Name "KRISHNA MAKWANA" in large bold Cinzel Decorative with antique sepia-gold ink
 * - Delicate ornamental gold divider flourish
 * - Specializations in matching bold Cinzel with rich leather ink & gold luster:
 *     "AI ENTHUSIAST"
 *     "DATA ANALYTICS   •   DATA SCIENCE"
 *     "FULLSTACK WEB DEVELOPER"
 * - Bottom magical seal & Latin motto "• MAGIA ET SCIENTIA •"
 */
function generateIntroRightPageCanvas(existingCanvas = null) {
  const canvas = existingCanvas || document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1600;
  const ctx = canvas.getContext('2d');

  // 1. Draw base authentic vintage parchment with gutter on the left (spine side)
  drawParchmentBase(ctx, canvas.width, canvas.height, false);

  const cx = canvas.width / 2; // 600

  // 2. Wizarding Profile Card Container Frame
  ctx.save();
  ctx.strokeStyle = 'rgba(163, 116, 44, 0.35)';
  ctx.lineWidth = 2;
  ctx.strokeRect(90, 180, canvas.width - 180, 1240);

  ctx.strokeStyle = 'rgba(163, 116, 44, 0.18)';
  ctx.lineWidth = 1;
  ctx.strokeRect(104, 194, canvas.width - 208, 1212);

  // Card corner flourishes
  drawFiligreeCorner(ctx, 90, 180, 56, false, false);
  drawFiligreeCorner(ctx, canvas.width - 90, 180, 56, true, false);
  drawFiligreeCorner(ctx, 90, 1420, 56, false, true);
  drawFiligreeCorner(ctx, canvas.width - 90, 1420, 56, true, true);
  ctx.restore();

  // 3. Top Header Emblem & Kicker
  ctx.save();
  ctx.translate(cx, 290);
  ctx.strokeStyle = 'rgba(184, 134, 11, 0.6)';
  ctx.fillStyle = 'rgba(212, 175, 55, 0.25)';
  ctx.lineWidth = 1.8;

  // 8-pointed star crest
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const r = i % 2 === 0 ? 18 : 8;
    const a = (i * Math.PI) / 4;
    const px = Math.cos(a) * r;
    const py = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Flourish wings
  ctx.beginPath();
  ctx.moveTo(-24, 0);
  ctx.quadraticCurveTo(-65, -16, -110, 0);
  ctx.quadraticCurveTo(-65, 10, -32, 3);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(24, 0);
  ctx.quadraticCurveTo(65, -16, 110, 0);
  ctx.quadraticCurveTo(65, 10, 32, 3);
  ctx.stroke();
  ctx.restore();

  // Top Kicker (Centered "PORTFOLIO")
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#543214';
  ctx.font = '700 30px "Cinzel", Georgia, serif';
  ctx.letterSpacing = '0.35em';
  ctx.fillText('PORTFOLIO', cx, 380);
  ctx.restore();

  // 4. Primary Title (Name): "KRISHNA MAKWANA" (Increased size: 76px)
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#1c0d05';
  ctx.font = 'bold 76px "Cinzel Decorative", "Cinzel", Georgia, serif';
  ctx.letterSpacing = '0.15em';
  ctx.shadowColor = 'rgba(212, 175, 55, 0.55)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 2;
  ctx.fillText('KRISHNA MAKWANA', cx, 500);
  ctx.restore();

  // 5. Subtle Decorative Gilded Divider
  ctx.save();
  const divY = 575;
  const lineHalfW = 270;

  const gradLeft = ctx.createLinearGradient(cx - lineHalfW, divY, cx - 45, divY);
  gradLeft.addColorStop(0, 'rgba(184, 134, 11, 0)');
  gradLeft.addColorStop(1, 'rgba(184, 134, 11, 0.9)');
  ctx.strokeStyle = gradLeft;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx - lineHalfW, divY);
  ctx.lineTo(cx - 45, divY);
  ctx.stroke();

  const gradRight = ctx.createLinearGradient(cx + 45, divY, cx + lineHalfW, divY);
  gradRight.addColorStop(0, 'rgba(184, 134, 11, 0.9)');
  gradRight.addColorStop(1, 'rgba(184, 134, 11, 0)');
  ctx.strokeStyle = gradRight;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx + 45, divY);
  ctx.lineTo(cx + lineHalfW, divY);
  ctx.stroke();

  // Center diamond & dots
  ctx.fillStyle = '#b8860b';
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, divY - 14);
  ctx.lineTo(cx + 14, divY);
  ctx.lineTo(cx, divY + 14);
  ctx.lineTo(cx - 14, divY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx - 28, divY, 4, 0, Math.PI * 2);
  ctx.arc(cx + 28, divY, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 6. Subtitle & Specializations (Unified bold Cinzel styling matching Fullstack Web Developer, increased sizes)
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#221006';
  ctx.shadowColor = 'rgba(212, 175, 55, 0.35)';
  ctx.shadowBlur = 5;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;

  // "AI ENTHUSIAST"
  ctx.font = '700 46px "Cinzel", Georgia, serif';
  ctx.letterSpacing = '0.14em';
  ctx.fillText('AI ENTHUSIAST', cx, 685);

  // "DATA ANALYTICS   •   DATA SCIENCE"
  ctx.font = '700 40px "Cinzel", Georgia, serif';
  ctx.letterSpacing = '0.10em';
  ctx.fillText('DATA ANALYTICS   •   DATA SCIENCE', cx, 780);

  // Decorative separator ornament
  ctx.save();
  ctx.fillStyle = '#b8860b';
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx, 845 - 8);
  ctx.lineTo(cx + 8, 845);
  ctx.lineTo(cx, 845 + 8);
  ctx.lineTo(cx - 8, 845);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx - 20, 845, 2.5, 0, Math.PI * 2);
  ctx.arc(cx + 20, 845, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // "FULLSTACK WEB DEVELOPER"
  ctx.font = '700 46px "Cinzel", Georgia, serif';
  ctx.letterSpacing = '0.14em';
  ctx.fillText('FULLSTACK WEB DEVELOPER', cx, 930);
  ctx.restore();

  // 7. Bottom Seal (Scaled up, without motto line)
  ctx.save();
  ctx.translate(cx, 1170);
  ctx.strokeStyle = 'rgba(163, 116, 44, 0.4)';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.arc(0, 0, 58, 0, Math.PI * 2);
  ctx.stroke();

  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.arc(0, 0, 48, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#8b181b';
  ctx.font = 'bold 36px "MedievalSharp", cursive, serif';
  ctx.fillText('KM', 0, 12);
  ctx.restore();

  return canvas;
}

/**
 * Multiline Text Wrapping Helper for Canvas
 */
function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, align = 'center') {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  const lines = [];

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      lines.push(line.trim());
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());

  ctx.save();
  ctx.textAlign = align;
  lines.forEach((l) => {
    ctx.fillText(l, x, currentY);
    currentY += lineHeight;
  });
  ctx.restore();
  return currentY;
}

/**
 * Rounded Rectangle Path Helper for Canvas
 */
function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Asynchronous Video Preloader for VS Pharma Academy
 * Directly streams local public asset /videos/vs-pharma-preview.mp4 mounted in DOM with hardware decoding
 */
let vsPharmaVideo = null;
function getVsPharmaVideo(onReady) {
  if (vsPharmaVideo) {
    if (onReady && vsPharmaVideo.readyState >= 2) onReady(vsPharmaVideo);
    return vsPharmaVideo;
  }

  let video = document.getElementById('vs-pharma-video-element');
  if (!video) {
    video = document.createElement('video');
    video.id = 'vs-pharma-video-element';
    video.src = '/videos/vs-pharma-preview.mp4';
    video.crossOrigin = 'anonymous';
    video.playsInline = true;
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.autoplay = true;
    video.preload = 'auto';
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('playsinline', 'true');
    video.style.position = 'fixed';
    video.style.top = '0';
    video.style.left = '0';
    video.style.width = '1px';
    video.style.height = '1px';
    video.style.opacity = '0.001';
    video.style.pointerEvents = 'none';
    video.style.zIndex = '-9999';
    document.body.appendChild(video);
  }

  const tryPlay = () => {
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        const onFirstGesture = () => {
          video.play().catch(() => {});
          window.removeEventListener('pointerdown', onFirstGesture);
          window.removeEventListener('scroll', onFirstGesture);
          window.removeEventListener('keydown', onFirstGesture);
          window.removeEventListener('touchstart', onFirstGesture);
        };
        window.addEventListener('pointerdown', onFirstGesture, { once: true });
        window.addEventListener('scroll', onFirstGesture, { once: true });
        window.addEventListener('keydown', onFirstGesture, { once: true });
        window.addEventListener('touchstart', onFirstGesture, { once: true });
      });
    }
  };

  const notifyReady = () => {
    tryPlay();
    if (onReady) onReady(video);
  };

  video.addEventListener('canplay', notifyReady);
  video.addEventListener('canplaythrough', notifyReady);
  video.addEventListener('loadeddata', notifyReady);
  video.addEventListener('loadedmetadata', notifyReady);

  video.load();
  tryPlay();

  vsPharmaVideo = video;
  return video;
}

let vsPharmaPreviewImage = null;
function loadVsPharmaPreviewImage(callback) {
  if (vsPharmaPreviewImage && vsPharmaPreviewImage.complete && vsPharmaPreviewImage.naturalWidth > 0) {
    if (callback) callback(vsPharmaPreviewImage);
    return vsPharmaPreviewImage;
  }
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = '/assets/vs_pharma_preview.jpg';
  img.onload = () => {
    vsPharmaPreviewImage = img;
    if (callback) callback(img);
  };
  return img;
}

// Preload assets early
if (typeof window !== 'undefined') {
  loadVsPharmaPreviewImage();
}

/**
 * Generates Project 1 Left Page Canvas (VS Pharma Academy Overview, Lore & Capabilities)
 */
function generateProject1LeftPageCanvas(existingCanvas = null) {
  const canvas = existingCanvas || document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1600;
  const ctx = canvas.getContext('2d');

  // Draw base authentic vintage parchment with spine gutter on right (isLeft = true)
  drawParchmentBase(ctx, canvas.width, canvas.height, true);

  const cx = canvas.width / 2; // 600

  // Profile Card Outer Frame
  ctx.save();
  ctx.strokeStyle = 'rgba(163, 116, 44, 0.55)';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(80, 140, canvas.width - 160, 1320);

  ctx.strokeStyle = 'rgba(163, 116, 44, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(94, 154, canvas.width - 188, 1292);

  drawFiligreeCorner(ctx, 80, 140, 56, false, false);
  drawFiligreeCorner(ctx, canvas.width - 80, 140, 56, true, false);
  drawFiligreeCorner(ctx, 80, 1460, 56, false, true);
  drawFiligreeCorner(ctx, canvas.width - 80, 1460, 56, true, true);
  ctx.restore();

  // 1. Header Pill / Tag: [ CLIENT PROJECT • LIVE PRODUCTION ] (Wider area with generous horizontal padding)
  const badgeW = 680;
  const badgeH = 56;
  const badgeX = cx - badgeW / 2;
  const badgeY = 190;

  ctx.save();
  ctx.fillStyle = 'rgba(184, 134, 11, 0.16)';
  ctx.strokeStyle = 'rgba(140, 85, 10, 0.85)';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 28);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#1f0c02';
  ctx.font = '800 21px "Cinzel", Georgia, serif';
  ctx.letterSpacing = '0.12em';
  ctx.fillText('CLIENT PROJECT  •  LIVE PRODUCTION', cx, badgeY + 36);
  ctx.restore();

  // 2. Primary Title: "VS PHARMA ACADEMY" (Font size preserved at 76px)
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#0f0501';
  ctx.font = '900 76px "Cinzel Decorative", "Cinzel", Georgia, serif';
  ctx.letterSpacing = '0.10em';
  ctx.shadowColor = 'rgba(184, 134, 11, 0.55)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 2;
  ctx.fillText('VS PHARMA ACADEMY', cx, 325);
  ctx.restore();

  // 3. Subtitle: "Educational Learning Portal for B.Pharm & M.Pharm" (Increased font size & spaced out)
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#260f03';
  ctx.font = 'bold italic 36px "EB Garamond", Georgia, serif';
  ctx.letterSpacing = '0.04em';
  ctx.fillText('Educational Learning Portal for B.Pharm & M.Pharm', cx, 395);
  ctx.restore();

  // 4. Clearly Visible Gilded Divider
  ctx.save();
  const divY = 445;
  const lineHalfW = 300;

  const gradLeft = ctx.createLinearGradient(cx - lineHalfW, divY, cx - 40, divY);
  gradLeft.addColorStop(0, 'rgba(163, 116, 44, 0.15)');
  gradLeft.addColorStop(1, 'rgba(140, 85, 10, 0.95)');
  ctx.strokeStyle = gradLeft;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx - lineHalfW, divY);
  ctx.lineTo(cx - 40, divY);
  ctx.stroke();

  const gradRight = ctx.createLinearGradient(cx + 40, divY, cx + lineHalfW, divY);
  gradRight.addColorStop(0, 'rgba(140, 85, 10, 0.95)');
  gradRight.addColorStop(1, 'rgba(163, 116, 44, 0.15)');
  ctx.strokeStyle = gradRight;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx + 40, divY);
  ctx.lineTo(cx + lineHalfW, divY);
  ctx.stroke();

  // Center diamond & accent dots
  ctx.fillStyle = '#8b5a14';
  ctx.strokeStyle = '#b8860b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, divY - 11);
  ctx.lineTo(cx + 11, divY);
  ctx.lineTo(cx, divY + 11);
  ctx.lineTo(cx - 11, divY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx - 24, divY, 3, 0, Math.PI * 2);
  ctx.arc(cx + 24, divY, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 5. Clear & Punchy Description (Increased font size 36px & generous line-height)
  ctx.save();
  ctx.fillStyle = '#120501';
  ctx.font = '700 36px "EB Garamond", Georgia, serif';
  const descText = 'Commissioned by an educator to streamline pharmacy studies. Developed as a centralized learning hub where students easily access semester-wise notes, curriculum roadmaps, and subject-specific lecture resources.';
  const nextY = drawWrappedText(ctx, descText, cx, 515, 960, 56, 'center');
  ctx.restore();

  // 6. Core Highlights (Increased font size 36px & spacious line separation)
  const highlights = [
    '✦   Built for client note distribution & academic indexing',
    '✦   Fully responsive mobile-friendly student interface',
    '✦   Instant cloud delivery and optimized document access'
  ];

  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#0a0301';
  ctx.font = 'bold 36px "EB Garamond", Georgia, serif';
  ctx.letterSpacing = '0.02em';

  const bulletStartY = nextY + 70;
  highlights.forEach((h, i) => {
    ctx.fillText(h, cx, bulletStartY + i * 76);
  });
  ctx.restore();

  // 7. Tech Stack (Increased font size 28px, ample breathing space & visible divider)
  ctx.save();
  const techDivY = bulletStartY + highlights.length * 76 + 35;
  ctx.strokeStyle = 'rgba(140, 85, 10, 0.70)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 240, techDivY);
  ctx.lineTo(cx + 240, techDivY);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#140601';
  ctx.font = '800 28px "Cinzel", Georgia, serif';
  ctx.letterSpacing = '0.14em';
  ctx.fillText('Next.js   •   React   •   Supabase   •   Vercel', cx, techDivY + 58);
  ctx.restore();

  return canvas;
}

/**
 * Generates Project 1 Right Page Canvas (VS Pharma Academy Autoplaying Video Viewport & Clickable Link)
 */
function generateProject1RightPageCanvas(existingCanvas = null) {
  const canvas = existingCanvas || document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1600;
  const ctx = canvas.getContext('2d');

  // Draw base authentic vintage parchment with spine gutter on left (isLeft = false)
  drawParchmentBase(ctx, canvas.width, canvas.height, false);

  const cx = canvas.width / 2; // 600

  // Profile Card Frame
  ctx.save();
  ctx.strokeStyle = 'rgba(163, 116, 44, 0.40)';
  ctx.lineWidth = 2;
  ctx.strokeRect(80, 150, canvas.width - 160, 1300);

  ctx.strokeStyle = 'rgba(163, 116, 44, 0.22)';
  ctx.lineWidth = 1;
  ctx.strokeRect(94, 164, canvas.width - 188, 1272);

  drawFiligreeCorner(ctx, 80, 150, 56, false, false);
  drawFiligreeCorner(ctx, canvas.width - 80, 150, 56, true, false);
  drawFiligreeCorner(ctx, 80, 1450, 56, false, true);
  drawFiligreeCorner(ctx, canvas.width - 80, 1450, 56, true, true);
  ctx.restore();

  // 1. Header Kicker
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#543214';
  ctx.font = '700 28px "Cinzel", Georgia, serif';
  ctx.letterSpacing = '0.35em';
  ctx.fillText('PROJECT PREVIEW', cx, 225);
  ctx.restore();

  // 2. Viewport Frame (Browser mockup frame)
  const viewX = 120;
  const viewY = 265;
  const viewW = 960;
  const viewH = 710;
  const headerH = 56;

  ctx.save();
  // Outer frame shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.30)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 8;

  // Browser Header Background
  ctx.fillStyle = '#140c18';
  ctx.beginPath();
  ctx.moveTo(viewX + 16, viewY);
  ctx.lineTo(viewX + viewW - 16, viewY);
  ctx.quadraticCurveTo(viewX + viewW, viewY, viewX + viewW, viewY + 16);
  ctx.lineTo(viewX + viewW, viewY + headerH);
  ctx.lineTo(viewX, viewY + headerH);
  ctx.lineTo(viewX, viewY + 16);
  ctx.quadraticCurveTo(viewX, viewY, viewX + 16, viewY);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 3 Traffic Light Dots
  const dotY = viewY + headerH / 2;
  const dots = ['#ef4444', '#f59e0b', '#10b981'];
  dots.forEach((c, idx) => {
    ctx.save();
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(viewX + 28 + idx * 22, dotY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // URL Bar Container
  ctx.save();
  const urlX = viewX + 110;
  const urlY = viewY + 12;
  const urlW = viewW - 140;
  const urlH = 32;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.40)';
  ctx.lineWidth = 1;
  drawRoundedRect(ctx, urlX, urlY, urlW, urlH, 16);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#fef3c7';
  ctx.font = '500 16px "Space Grotesk", monospace';
  ctx.fillText('🔒  https://vs-pharma-academy.vercel.app/', urlX + 18, urlY + 22);
  ctx.restore();

  // 3. Website Live Video Stream / Snapshot Fallback inside Viewport
  const imgX = viewX;
  const imgY = viewY + headerH;
  const imgW = viewW;
  const imgH = viewH - headerH;

  ctx.save();
  ctx.beginPath();
  // Rounded bottom corners for screen area
  ctx.moveTo(imgX, imgY);
  ctx.lineTo(imgX + imgW, imgY);
  ctx.lineTo(imgX + imgW, imgY + imgH - 16);
  ctx.quadraticCurveTo(imgX + imgW, imgY + imgH, imgX + imgW - 16, imgY + imgH);
  ctx.lineTo(imgX + 16, imgY + imgH);
  ctx.quadraticCurveTo(imgX, imgY + imgH, imgX, imgY + imgH - 16);
  ctx.closePath();
  ctx.clip();

  const video = getVsPharmaVideo();
  if (video && video.readyState >= 2 && !video.seeking) {
    ctx.drawImage(video, imgX, imgY, imgW, imgH);
  } else if (vsPharmaPreviewImage && vsPharmaPreviewImage.complete && vsPharmaPreviewImage.naturalWidth > 0) {
    ctx.drawImage(vsPharmaPreviewImage, imgX, imgY, imgW, imgH);
  } else {
    // Cinematic dark theme placeholder while video streams in
    const bgGrad = ctx.createLinearGradient(imgX, imgY, imgX + imgW, imgY + imgH);
    bgGrad.addColorStop(0, '#09081E');
    bgGrad.addColorStop(0.5, '#0e0b2a');
    bgGrad.addColorStop(1, '#050038');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(imgX, imgY, imgW, imgH);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFD02F';
    ctx.font = 'bold 36px "Cinzel", Georgia, serif';
    ctx.fillText('VS PHARMA ACADEMY', cx, imgY + imgH / 2 - 20);

    ctx.fillStyle = 'rgba(254, 240, 138, 0.85)';
    ctx.font = '600 22px "Cinzel", Georgia, serif';
    ctx.fillText('⚡ STREAMING LIVE SYSTEM PREVIEW...', cx, imgY + imgH / 2 + 25);
  }
  ctx.restore();

  // Browser Window Outer Gilded Border & Corner Brackets
  ctx.save();
  ctx.strokeStyle = 'rgba(184, 134, 11, 0.65)';
  ctx.lineWidth = 2.5;
  drawRoundedRect(ctx, viewX, viewY, viewW, viewH, 16);
  ctx.stroke();
  ctx.restore();

  // 4. Interactive Action Button: "VISIT VS PHARMA WEBSITE ↗"
  const btnX = 160;
  const btnY = 1030;
  const btnW = 880;
  const btnH = 96;

  ctx.save();
  ctx.shadowColor = 'rgba(139, 24, 27, 0.45)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 6;

  const btnGrad = ctx.createLinearGradient(btnX, btnY, btnX + btnW, btnY + btnH);
  btnGrad.addColorStop(0, '#4a1014');
  btnGrad.addColorStop(0.3, '#78151c');
  btnGrad.addColorStop(0.7, '#8b181b');
  btnGrad.addColorStop(1, '#4a1014');
  ctx.fillStyle = btnGrad;
  drawRoundedRect(ctx, btnX, btnY, btnW, btnH, 24);
  ctx.fill();
  ctx.restore();

  // Gilded Button Double Border
  ctx.save();
  ctx.strokeStyle = 'rgba(245, 197, 66, 0.85)';
  ctx.lineWidth = 2.5;
  drawRoundedRect(ctx, btnX, btnY, btnW, btnH, 24);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(245, 197, 66, 0.40)';
  ctx.lineWidth = 1;
  drawRoundedRect(ctx, btnX + 5, btnY + 5, btnW - 10, btnH - 10, 20);
  ctx.stroke();

  // Button Typography
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 36px "Cinzel", Georgia, serif';
  ctx.letterSpacing = '0.12em';
  ctx.shadowColor = 'rgba(245, 197, 66, 0.8)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  ctx.fillText('VISIT VS PHARMA WEBSITE ↗', cx, btnY + 60);
  ctx.restore();

  // 5. Interaction Hint Label
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#1c0d05';
  ctx.font = '800 24px "Cinzel", Georgia, serif';
  ctx.letterSpacing = '0.14em';
  ctx.shadowColor = 'rgba(212, 175, 55, 0.45)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  ctx.fillText('⚡ CLICK PREVIEW OR BUTTON TO OPEN PLATFORM', cx, 1180);
  ctx.restore();

  // 6. Bottom Flourish Accent
  ctx.save();
  ctx.translate(cx, 1240);
  ctx.strokeStyle = 'rgba(184, 134, 11, 0.50)';
  ctx.fillStyle = 'rgba(212, 175, 55, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-60, 0);
  ctx.lineTo(-12, 0);
  ctx.moveTo(12, 0);
  ctx.lineTo(60, 0);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
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

    // Three.js Core & Interaction Raycaster
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.bookGroup = null;
    this.frontCoverGroup = null;
    this.backCoverGroup = null;
    this.baseLeftPage = null;
    this.leafMeshes = [];

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.pointerDownPos = { x: 0, y: 0 };
    this.pointerDownTime = 0;
    this.isPointerDown = false;
    this.isHoveringLink = false;

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

    // 3. Back Cover Group: Pivots at x = 0, z = -halfP to realistically fold over the left stack!
    this.backCoverGroup = new THREE.Group();
    this.backCoverGroup.position.set(0, 0, -halfP);

    const backBoardGeo = createBevelledCoverBoard(W, H, cT, 0.06);
    const backBoardMesh = new THREE.Mesh(backBoardGeo, leatherMat);
    // Scale Z by -1 so that when backCoverGroup is at angle 0:
    // Inner face meets paper block at z = 0 (z = -halfP world)
    // Outer face (weathered leather with corner filigrees) faces -Z at z = -bT (z = -halfP - bT world)
    backBoardMesh.scale.set(1, 1, -1);
    backBoardMesh.receiveShadow = true;
    this.backCoverGroup.add(backBoardMesh);

    // Inside Back Cover Face Panel: Florentine marbled endpaper
    const insideBackPlaneGeo = new THREE.PlaneGeometry(W - 0.02, H - 0.02);
    insideBackPlaneGeo.translate((W - 0.02) / 2 + 0.01, 0, 0);
    insideBackPlaneGeo.computeVertexNormals();

    const insideBackEndpaperMesh = new THREE.Mesh(insideBackPlaneGeo, innerCoverMat);
    insideBackEndpaperMesh.position.set(0, 0, 0.001);
    this.backCoverGroup.add(insideBackEndpaperMesh);

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

    // First Right-Hand Page Intro Typography Canvas & Texture
    const introRightCanvas = generateIntroRightPageCanvas();
    const introRightTex = new THREE.CanvasTexture(introRightCanvas);
    introRightTex.colorSpace = THREE.SRGBColorSpace;
    introRightTex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();

    // Project 1 (VS Pharma Academy) Spread Textures
    const project1LeftCanvas = generateProject1LeftPageCanvas();
    const project1LeftTex = new THREE.CanvasTexture(project1LeftCanvas);
    project1LeftTex.colorSpace = THREE.SRGBColorSpace;
    project1LeftTex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    // Counteract horizontal reflection caused by 180-degree page flip
    project1LeftTex.wrapS = THREE.RepeatWrapping;
    project1LeftTex.repeat.x = -1;
    project1LeftTex.offset.x = 1;

    const project1RightCanvas = generateProject1RightPageCanvas();
    const project1RightTex = new THREE.CanvasTexture(project1RightCanvas);
    project1RightTex.colorSpace = THREE.SRGBColorSpace;
    project1RightTex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();

    this.project1RightCanvas = project1RightCanvas;
    this.project1RightTex = project1RightTex;

    // Initialize Autoplaying Video Preview for VS Pharma Academy
    this.vsPharmaVideo = getVsPharmaVideo(() => {
      generateProject1RightPageCanvas(project1RightCanvas);
      project1RightTex.needsUpdate = true;
    });

    // Also trigger instant redraw when static fallback image loads
    loadVsPharmaPreviewImage(() => {
      generateProject1RightPageCanvas(project1RightCanvas);
      project1RightTex.needsUpdate = true;
    });

    // Re-draw all dynamic page canvases when web fonts finish loading
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        generateIntroRightPageCanvas(introRightCanvas);
        introRightTex.needsUpdate = true;
        generateProject1LeftPageCanvas(project1LeftCanvas);
        project1LeftTex.needsUpdate = true;
        generateProject1RightPageCanvas(project1RightCanvas);
        project1RightTex.needsUpdate = true;
      });
    }

    const introPageMat = new THREE.MeshStandardMaterial({
      map: introRightTex,
      roughness: 0.88,
      metalness: 0.02,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
      depthTest: true,
      depthWrite: true
    });

    const project1LeftMat = new THREE.MeshStandardMaterial({
      map: project1LeftTex,
      roughness: 0.88,
      metalness: 0.02,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
      depthTest: true,
      depthWrite: true
    });

    const project1RightMat = new THREE.MeshStandardMaterial({
      map: project1RightTex,
      roughness: 0.88,
      metalness: 0.02,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
      depthTest: true,
      depthWrite: true
    });

    const blankRightMat = new THREE.MeshStandardMaterial({
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

    // Clean blank parchment texture for unflipped base left page
    const blankLeftMat = new THREE.MeshStandardMaterial({
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

    // Clean blank parchment texture for flipped leaf backsides (horizontally counteracted)
    const leafBackBlankTex = new THREE.CanvasTexture(blankLeftCanvas);
    leafBackBlankTex.colorSpace = THREE.SRGBColorSpace;
    leafBackBlankTex.wrapS = THREE.RepeatWrapping;
    leafBackBlankTex.repeat.x = -1;
    leafBackBlankTex.offset.x = 1;

    const leafBackBlankMat = new THREE.MeshStandardMaterial({
      map: leafBackBlankTex,
      roughness: 0.88,
      metalness: 0.02,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
      depthTest: true,
      depthWrite: true
    });

    const paperTopFaceMat = blankRightMat;

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
    this.solidBlockMesh = new THREE.Mesh(solidBlockGeo, solidBlockMaterials);
    this.solidBlockMesh.position.set(0, 0, halfP);
    this.solidBlockMesh.receiveShadow = true;
    this.backCoverGroup.add(this.solidBlockMesh);

    this.bookGroup.add(this.backCoverGroup);

    // 6. Base Left Page (Clean Slate Blank Parchment at z = halfP + 0.002)
    const baseLeftGeo = new THREE.PlaneGeometry(this.pageWidth, this.pageHeight);
    baseLeftGeo.translate(-0.02 - this.pageWidth / 2, 0, 0);
    baseLeftGeo.computeVertexNormals();

    this.baseLeftPage = new THREE.Mesh(baseLeftGeo, blankLeftMat);
    this.baseLeftPage.position.set(0, 0, halfP + 0.002);
    this.baseLeftPage.visible = false;
    this.bookGroup.add(this.baseLeftPage);

    // 7. Dynamic Blank Parchment Flipping Leaves (Total: 4 double-sided leaves)
    const totalFlips = 4;
    this.leafMeshes = [];
    const segmentsX = 32;
    const segmentsY = 16;

    for (let k = 0; k < totalFlips; k++) {
      const leafGroup = new THREE.Group();

      const geo = new THREE.PlaneGeometry(this.pageWidth, this.pageHeight, segmentsX, segmentsY);
      geo.translate(0.02 + this.pageWidth / 2, 0, 0);
      geo.computeVertexNormals();
      geo.userData = {
        origPositions: geo.attributes.position.array.slice()
      };

      // Leaf 0: Front = Intro (Page 1), Back = Project 1 Details (Spread 1 Left Page)
      // Leaf 1: Front = Project 1 Live Viewport & Link (Spread 1 Right Page), Back = Blank Left
      // Leaves 2 & 3: Blank parchment
      let frontMat = blankRightMat;
      let backMat = leafBackBlankMat;

      let videoScreenMesh = null;
      if (k === 0) {
        frontMat = introPageMat;
        backMat = project1LeftMat;
      } else if (k === 1) {
        frontMat = project1RightMat;
        backMat = leafBackBlankMat;

        // Dedicated Video Screen Mesh powered by THREE.VideoTexture (direct hardware decoding)
        const screenW = this.pageWidth * (960 / 1200);
        const screenH = this.pageHeight * (654 / 1600);
        const screenGeo = new THREE.PlaneGeometry(screenW, screenH, segmentsX, segmentsY);
        screenGeo.translate(0.02 + this.pageWidth / 2, 0.095 * this.pageHeight, 0);
        screenGeo.computeVertexNormals();
        screenGeo.userData = {
          origPositions: screenGeo.attributes.position.array.slice()
        };

        const video = getVsPharmaVideo();
        try {
          const videoTex = new THREE.VideoTexture(video);
          videoTex.colorSpace = THREE.SRGBColorSpace;
          videoTex.minFilter = THREE.LinearFilter;
          videoTex.magFilter = THREE.LinearFilter;
          videoTex.generateMipmaps = false;

          const videoMat = new THREE.MeshBasicMaterial({
            map: videoTex,
            toneMapped: false,
            side: THREE.FrontSide,
            depthTest: true,
            depthWrite: true,
            polygonOffset: true,
            polygonOffsetFactor: -2,
            polygonOffsetUnits: -2
          });

          videoScreenMesh = new THREE.Mesh(screenGeo, videoMat);
          videoScreenMesh.position.z = 0.003;
          videoScreenMesh.visible = false; // Initially hidden until video frames stream
        } catch (err) {
          console.warn('VideoTexture initialization error handled safely:', err);
        }
      }

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
      if (videoScreenMesh) {
        leafGroup.add(videoScreenMesh);
      }

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
        videoScreenMesh,
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

    if (leafItem.videoScreenMesh) {
      const sGeo = leafItem.videoScreenMesh.geometry;
      const sPos = sGeo.attributes.position;
      const sOrig = sGeo.userData.origPositions;
      for (let i = 0; i < sPos.count; i++) {
        const idx = i * 3;
        const ox = sOrig[idx];
        const oy = sOrig[idx + 1];
        const u = Math.max(0, Math.min(1, (ox - 0.02) / W));

        if (!isTurning) {
          sPos.array[idx] = ox;
          sPos.array[idx + 1] = oy;
          sPos.array[idx + 2] = 0;
        } else {
          const lift = Math.sin(theta) * 0.28 * Math.sin(u * Math.PI);
          const curl = Math.sin(theta) * 0.08 * Math.pow(u, 2);

          sPos.array[idx] = ox - Math.sin(theta) * 0.05 * u;
          sPos.array[idx + 1] = oy;
          sPos.array[idx + 2] = lift + curl;
        }
      }
      sPos.needsUpdate = true;
      sGeo.computeVertexNormals();
    }
  }

  /**
   * Resets Section 3 Stage Container to Pristine Hidden State
   * Guaranteed opacity: 0, visibility: hidden, pointer-events: none during Section 2 & Phase A
   */
  resetStageStyles() {
    if (this.stage) {
      gsap.set(this.stage, {
        scale: 0.88,
        x: 0,
        y: 0,
        xPercent: 0,
        opacity: 0,
        visibility: 'hidden',
        pointerEvents: 'none',
        display: 'flex',
        filter: 'blur(8px)',
        borderRadius: '1.25rem',
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
   * Sets Section 3 Stage Container to Full-Bleed Standard Active State
   */
  setFullStageStyles() {
    if (this.stage) {
      gsap.set(this.stage, {
        scale: 1,
        x: 0,
        y: 0,
        xPercent: 0,
        opacity: 1,
        visibility: 'visible',
        pointerEvents: 'auto',
        display: 'flex',
        filter: 'none',
        borderRadius: '1.25rem',
        border: '1px solid transparent',
        boxShadow: 'none',
        background: 'transparent',
        backdropFilter: 'none',
        force3D: true
      });
    }
  }

  /**
   * Setup GSAP ScrollTrigger Sequence & Pinning:
   * - Pin Section 3 cleanly (pin: true, scrub: 1.8, start: "top top", end: "+=6000")
   * - Expanded 6000px scroll track for natural paper weight, steady deliberate reading, and calm velocity
   */
  setupScrollTrigger() {
    const section = document.getElementById('projects');
    if (!section) return;

    this.stage = document.getElementById('book-of-spells-stage');
    this.cornerAccents = this.stage ? this.stage.querySelectorAll('.stage-corner-accent') : [];

    // Pristine initial reset (100% hidden until Section 3 triggers)
    this.resetStageStyles();

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=6000',
      pin: true,
      scrub: 1.8,
      anticipatePin: 1,
      onLeaveBack: () => {
        this.resetStageStyles();
        this.updateScrollSequence(0);
      },
      onUpdate: (self) => {
        const p = self.progress;
        this.updateScrollSequence(p);
      }
    });

    this.scrollTrigger = trigger;
  }

  /**
   * Master Scrollytelling Sequence Progression (Matching Skills Section Pacing):
   * 0. [0% - 8%]: Phase B Entrance - 3D Grimoire fades & scales smoothly into center stage (0 -> 1)
   * 1. [8% - 75%]: Dedicated to steady, deliberate page turns -> Book closes naturally to back cover.
   * 2. [75% - 82%]: Section border card frame fades in smoothly (opacity: 0 -> 1).
   * 3. [82% - 100%]: Controlled, steady zoom-out (scale: 1 -> 0.60) and parallel left glide (x: 0 -> -130vw).
   */
  updateScrollSequence(progress) {
    const halfWidth = this.coverWidth / 2;
    const halfP = this.paperThickness / 2; // 0.11
    const bT = this.boardTotalThickness;   // 0.08

    // Clamp progress safely
    const p = Math.max(0, Math.min(1, progress));

    // =========================================================================
    // 1. [0% - 75%]: ENTRANCE & STEADY DELIBERATE PAGE TURNS -> BOOK CLOSES TO BACK COVER
    // =========================================================================
    if (p <= 0.75) {
      // Sub-Phase 0: Phase B Entrance - Closed Book Smooth Fade-in & Scale-in [0.00 -> 0.08]
      if (p <= 0.08) {
        const easeIn = gsap.parseEase('power2.out')(p / 0.08);
        const stageScale = 0.88 + 0.12 * easeIn;
        const stageOpacity = easeIn;
        const blurPx = (8 * (1 - easeIn)).toFixed(1);

        if (this.stage) {
          gsap.set(this.stage, {
            scale: stageScale,
            x: 0,
            y: 0,
            xPercent: 0,
            opacity: stageOpacity,
            visibility: stageOpacity > 0.01 ? 'visible' : 'hidden',
            pointerEvents: stageOpacity > 0.5 ? 'auto' : 'none',
            display: 'flex',
            filter: blurPx > 0.1 ? `blur(${blurPx}px)` : 'none',
            borderRadius: '1.25rem',
            border: '1px solid transparent',
            boxShadow: 'none',
            background: 'transparent',
            backdropFilter: 'none',
            force3D: true
          });
        }

        // Keep book closed on front cover in center during entrance
        if (this.backCoverGroup) {
          this.backCoverGroup.rotation.y = 0;
          this.backCoverGroup.position.set(0, 0, -halfP);
        }
        if (this.frontCoverGroup) {
          this.frontCoverGroup.rotation.y = 0;
          this.frontCoverGroup.position.z = halfP;
        }
        if (this.bookGroup) {
          this.bookGroup.position.x = -halfWidth;
        }

        this.leafMeshes.forEach((leaf) => {
          leaf.group.visible = false;
          leaf.group.rotation.y = 0;
          leaf.angle = 0;
          this.deformLeafGeometry(leaf, 0);
          leaf.group.position.z = leaf.restingZ;
        });

        if (this.baseLeftPage) {
          this.baseLeftPage.visible = false;
        }

        this.isBookOpen = false;
      }
      // Sub-Phase 1A: Front Cover Opening [0.08 -> 0.16]
      else if (p > 0.08 && p <= 0.16) {
        this.setFullStageStyles();

        // Ensure back cover group is resting flat in open position
        if (this.backCoverGroup) {
          this.backCoverGroup.rotation.y = 0;
          this.backCoverGroup.position.set(0, 0, -halfP);
        }

        const openNorm = (p - 0.08) / (0.16 - 0.08);
        const easeT = gsap.parseEase('power1.inOut')(openNorm);
        const coverAngle = -easeT * Math.PI;

        if (this.bookGroup) {
          // Moves from -halfWidth (centering closed front cover) to 0 (centering open spine)
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
      // Sub-Phase 1B: Sequential Page Flipping [0.16 -> 0.62] (Generous track for 4 leaves)
      else if (p > 0.16 && p <= 0.62) {
        this.setFullStageStyles();

        if (this.backCoverGroup) {
          this.backCoverGroup.rotation.y = 0;
          this.backCoverGroup.position.set(0, 0, -halfP);
        }

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

        const pageNorm = (p - 0.16) / (0.62 - 0.16);
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

          // Natural paper weight and organic momentum easing
          const smoothedProgress = gsap.parseEase('power1.inOut')(leafProgress);
          const theta = smoothedProgress * Math.PI;
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
      // Sub-Phase 1C: Book Closes Naturally to Back Cover [0.62 -> 0.75]
      else {
        this.setFullStageStyles();

        const closeNorm = (p - 0.62) / (0.75 - 0.62);
        const easeC = gsap.parseEase('power1.inOut')(closeNorm);

        // Back cover pivots leftward: 0 -> -PI
        const backAngle = -easeC * Math.PI;

        if (this.backCoverGroup) {
          this.backCoverGroup.rotation.y = backAngle;
          // Lifts and smoothly settles on top of the left stack
          this.backCoverGroup.position.z = -halfP + Math.sin(easeC * Math.PI) * 0.22 + easeC * (halfP * 2 + bT);
        }

        // Front cover stays flat open on the left at -PI under the stack
        if (this.frontCoverGroup) {
          this.frontCoverGroup.rotation.y = -Math.PI;
          this.frontCoverGroup.position.z = halfP;
        }

        // Leaves stay resting on the left stack under the closing back cover
        for (let k = 0; k < this.leafMeshes.length; k++) {
          const leafItem = this.leafMeshes[k];
          leafItem.group.visible = true;
          leafItem.group.rotation.y = -Math.PI;
          leafItem.group.position.z = halfP + 0.005 + k * 0.003;
          this.deformLeafGeometry(leafItem, 0);
        }

        if (this.baseLeftPage) {
          this.baseLeftPage.visible = true;
        }

        // Smoothly shifts from 0 to +halfWidth, centering the closed book with spine on the RIGHT!
        if (this.bookGroup) {
          this.bookGroup.position.x = halfWidth * easeC;
        }

        this.isBookOpen = easeC < 0.98;
      }
    }

    // =========================================================================
    // 2. [75% - 82%]: SECTION BORDER CARD FRAME FADES IN (opacity: 0 -> 1)
    // =========================================================================
    else if (p > 0.75 && p <= 0.82) {
      // Book is fully locked in its closed BACK-COVER state in the center
      if (this.backCoverGroup) {
        this.backCoverGroup.rotation.y = -Math.PI;
        this.backCoverGroup.position.z = halfP + bT;
      }
      if (this.frontCoverGroup) {
        this.frontCoverGroup.rotation.y = -Math.PI;
        this.frontCoverGroup.position.z = halfP;
      }
      if (this.bookGroup) {
        this.bookGroup.position.x = halfWidth;
      }
      this.isBookOpen = false;

      const frameNorm = (p - 0.75) / (0.82 - 0.75);
      const easeF = gsap.parseEase('power1.inOut')(frameNorm);

      const borderAlpha = (0.40 * easeF).toFixed(3);
      const shadowAlpha = (0.90 * easeF).toFixed(3);
      const insetAlpha = (0.05 * easeF).toFixed(3);
      const bgAlpha = (0.65 * easeF).toFixed(3);

      if (this.stage) {
        gsap.set(this.stage, {
          scale: 1,
          x: 0,
          y: 0,
          xPercent: 0,
          opacity: 1,
          visibility: 'visible',
          display: 'flex',
          filter: 'none',
          borderRadius: '1.25rem',
          border: `1px solid rgba(234, 179, 8, ${borderAlpha})`,
          boxShadow: `0 0 35px rgba(0, 0, 0, ${shadowAlpha}), inset 0 0 20px rgba(234, 179, 8, ${insetAlpha})`,
          background: `rgba(14, 10, 18, ${bgAlpha})`,
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
    // 3. [82% - 100%]: CONTROLLED STEADY ZOOM-OUT (1 -> 0.60) & LEFT GLIDE (0 -> -130vw)
    // (Matching Skills Section calm, premium velocity with power1.inOut)
    // =========================================================================
    else if (p > 0.82) {
      // Book remains locked in closed BACK-COVER state
      if (this.backCoverGroup) {
        this.backCoverGroup.rotation.y = -Math.PI;
        this.backCoverGroup.position.z = halfP + bT;
      }
      if (this.frontCoverGroup) {
        this.frontCoverGroup.rotation.y = -Math.PI;
        this.frontCoverGroup.position.z = halfP;
      }
      if (this.bookGroup) {
        this.bookGroup.position.x = halfWidth;
      }
      this.isBookOpen = false;

      const exitNorm = (p - 0.82) / (1.00 - 0.82);
      // power1.inOut matches the calm, premium velocity of Section 2
      const ease = gsap.parseEase('power1.inOut')(exitNorm);

      // Controlled, steady zoom-out: 1.0 down to 0.60
      const scale = 1.0 - (1.0 - 0.60) * ease;
      // Parallel left glide: 0 -> -130vw
      const xGlide = -130 * ease;

      // Subtle gradual fade out in final stretch of the exit track
      const fadeFactor = Math.max(0, (exitNorm - 0.75) / 0.25);
      const opacity = Math.max(0, 1 - fadeFactor);
      const blurPx = (6 * fadeFactor).toFixed(2);

      if (this.stage) {
        gsap.set(this.stage, {
          scale: scale,
          x: `${xGlide}vw`,
          y: 0,
          xPercent: 0,
          opacity: opacity,
          visibility: 'visible',
          display: 'flex',
          filter: blurPx > 0 ? `blur(${blurPx}px)` : 'none',
          borderRadius: '1.25rem',
          border: '1px solid rgba(234, 179, 8, 0.4)',
          boxShadow: '0 0 35px rgba(0, 0, 0, 0.9), inset 0 0 20px rgba(234, 179, 8, 0.05)',
          background: 'rgba(14, 10, 18, 0.65)',
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

    this.onPointerDown = (e) => {
      this.isPointerDown = true;
      this.pointerDownPos = { x: e.clientX, y: e.clientY };
      this.pointerDownTime = performance.now();
      if (this.renderer && this.renderer.domElement) {
        this.renderer.domElement.style.cursor = 'grabbing';
      }
    };

    this.onPointerMove = (e) => {
      if (!this.renderer || !this.camera || this.leafMeshes.length < 2) return;

      const rect = this.renderer.domElement.getBoundingClientRect();
      this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Check if Spread 1 (Project 1) is currently visible and active
      const leaf0 = this.leafMeshes[0];
      const leaf1 = this.leafMeshes[1];
      const isSpread1Visible = leaf0.angle > 0.4 && leaf1.angle < Math.PI * 0.7 && this.isBookOpen;

      if (isSpread1Visible && !this.isPointerDown) {
        this.raycaster.setFromCamera(this.pointer, this.camera);
        const targets = [leaf1.frontMesh, leaf1.videoScreenMesh].filter(Boolean);
        const hits = this.raycaster.intersectObjects(targets, true);
        if (hits.length > 0) {
          this.renderer.domElement.style.cursor = 'pointer';
          this.isHoveringLink = true;
          return;
        }
      }

      this.isHoveringLink = false;
      if (!this.isPointerDown && this.renderer && this.renderer.domElement) {
        this.renderer.domElement.style.cursor = 'grab';
      }
    };

    this.onPointerUp = (e) => {
      const wasPointerDown = this.isPointerDown;
      this.isPointerDown = false;

      if (wasPointerDown && this.renderer && this.camera && this.leafMeshes.length >= 2) {
        const dist = Math.hypot(e.clientX - this.pointerDownPos.x, e.clientY - this.pointerDownPos.y);
        const duration = performance.now() - this.pointerDownTime;

        // Clean click detection (not a camera drag/rotation)
        if (dist < 8 && duration < 350) {
          const rect = this.renderer.domElement.getBoundingClientRect();
          this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

          const leaf0 = this.leafMeshes[0];
          const leaf1 = this.leafMeshes[1];
          const isSpread1Visible = leaf0.angle > 0.4 && leaf1.angle < Math.PI * 0.7 && this.isBookOpen;

          if (isSpread1Visible) {
            this.raycaster.setFromCamera(this.pointer, this.camera);
            const targets = [leaf1.frontMesh, leaf1.videoScreenMesh].filter(Boolean);
            const hits = this.raycaster.intersectObjects(targets, true);
            if (hits.length > 0) {
              window.open('https://vs-pharma-academy.vercel.app/', '_blank', 'noopener,noreferrer');
            }
          }
        }
      }

      if (this.renderer && this.renderer.domElement) {
        this.renderer.domElement.style.cursor = this.isHoveringLink ? 'pointer' : 'grab';
      }
    };

    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown);
      this.renderer.domElement.addEventListener('pointermove', this.onPointerMove);
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

    try {
      if (this.controls) {
        this.controls.update();
      }

      const time = this.clock.getElapsedTime();

      if (this.bookGroup) {
        this.bookGroup.position.y = Math.sin(time * 1.4) * 0.025;
      }

      // Live Video Preview update loop for Spread 1 (VS Pharma Academy)
      if (this.leafMeshes && this.leafMeshes.length >= 2) {
        const leaf0 = this.leafMeshes[0];
        const leaf1 = this.leafMeshes[1];
        const isSpread1Visible = leaf0.angle > 0.4 && leaf1.angle < Math.PI * 0.7 && this.isBookOpen;

        if (isSpread1Visible && this.vsPharmaVideo) {
          if (this.vsPharmaVideo.paused) {
            this.vsPharmaVideo.play().catch(() => {});
          }
          if (leaf1.videoScreenMesh) {
            leaf1.videoScreenMesh.visible = (this.vsPharmaVideo.readyState >= 2 && !this.vsPharmaVideo.paused);
          }
        } else if (this.vsPharmaVideo && !this.vsPharmaVideo.paused && !isSpread1Visible) {
          this.vsPharmaVideo.pause();
          if (leaf1 && leaf1.videoScreenMesh) {
            leaf1.videoScreenMesh.visible = false;
          }
        }
      }

      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    } catch (err) {
      console.warn('Animation loop render warning:', err);
    }
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

    if (this.vsPharmaVideo) {
      this.vsPharmaVideo.pause();
      this.vsPharmaVideo = null;
    }

    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('pointerup', this.onPointerUp);

    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.removeEventListener('pointerdown', this.onPointerDown);
      this.renderer.domElement.removeEventListener('pointermove', this.onPointerMove);
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
