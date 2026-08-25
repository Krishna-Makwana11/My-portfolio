/* ==========================================================================
   WEBGL LIQUID DISPLACEMENT & FLUID HOVER REVEAL ENGINE
   (Robin Delaporte / Curtains.js style organic fluid simulation)
   ========================================================================== */

const HOUSE_TEXTURES = {
  gryffindor: '/assets/house_gryffindor.png',
  slytherin: '/assets/house_slytherin.png',
  ravenclaw: '/assets/house_ravenclaw.png',
  hufflepuff: '/assets/house_hufflepuff.png',
};

const HOUSE_GLOW_COLORS = {
  gryffindor: [0.96, 0.77, 0.26], // Warm Gold (#f5c542)
  slytherin: [0.0, 1.0, 0.53],     // Mystic Mint (#00ff88)
  ravenclaw: [0.22, 0.74, 0.97],   // Astral Cyan (#38bdf8)
  hufflepuff: [0.92, 0.72, 0.22],  // Canary Gold (#ecb939)
};

const VERTEX_SHADER = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = (a_position + 1.0) * 0.5;
    v_uv.y = 1.0 - v_uv.y; // Flip Y for WebGL texture coordinates
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;
  uniform sampler2D u_baseTexture;
  uniform sampler2D u_revealTexture;
  uniform sampler2D u_fluidTexture;
  uniform vec2 u_resolution;
  uniform vec2 u_imageResolution;
  uniform float u_time;
  uniform vec3 u_houseColor;
  varying vec2 v_uv;

  // 2D Simplex Noise for organic fluid ripple boundaries
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    // Preserve 1:1 image aspect ratio (object-fit: contain/cover alignment)
    float containerAspect = u_resolution.x / u_resolution.y;
    float imageAspect = u_imageResolution.x / u_imageResolution.y;

    vec2 scale = vec2(1.0);
    if (containerAspect > imageAspect) {
      scale = vec2(imageAspect / containerAspect, 1.0);
    } else {
      scale = vec2(1.0, containerAspect / imageAspect);
    }

    vec2 uv = (v_uv - 0.5) / scale + 0.5;

    // Check bounds
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      gl_FragColor = vec4(0.0);
      return;
    }

    // Sample dynamic fluid simulation texture (R: Intensity, G: VelX, B: VelY)
    vec4 fluid = texture2D(u_fluidTexture, v_uv);
    float intensity = fluid.r;
    vec2 vel = (fluid.gb - 0.5) * 2.0;

    // Viscous fluid displacement with organic multi-octave turbulence
    float noise1 = snoise(uv * 7.5 + vec2(u_time * 0.35, u_time * 0.25));
    float noise2 = snoise(uv * 15.0 - vec2(u_time * 0.45, u_time * 0.2));
    float organicWarp = (noise1 * 0.65 + noise2 * 0.35) * intensity * 0.032;

    vec2 displacement = vel * 0.052 * intensity + vec2(organicWarp);
    vec2 distortedUV = clamp(uv + displacement, 0.0, 1.0);

    vec4 baseColor = texture2D(u_baseTexture, distortedUV);
    vec4 revealColor = texture2D(u_revealTexture, distortedUV);

    // Liquid reveal mask with organic noise boundary (NO geometric shapes / NO hard torch circles)
    float liquidMask = smoothstep(0.02, 0.65, intensity + organicWarp * 3.5);

    // Liquid surface refraction shimmer along fluid wave boundary
    float rimWave = smoothstep(0.04, 0.22, intensity) * (1.0 - smoothstep(0.32, 0.62, intensity));
    vec3 causticGlow = u_houseColor * rimWave * 0.45;

    vec4 finalColor = mix(baseColor, revealColor, liquidMask);
    finalColor.rgb += causticGlow * finalColor.a;

    gl_FragColor = finalColor;
  }
`;

let currentHouse = 'gryffindor';
let gl = null;
let revealTextureMap = {};
let activeRevealTexture = null;
let baseTexture = null;
let currentHouseGlow = HOUSE_GLOW_COLORS.gryffindor;
let program = null;

// Viscous 2D Fluid Simulation Grid (Dissipates smoothly over ~1.5 seconds)
class FluidPhysics {
  constructor(width = 160, height = 160) {
    this.width = width;
    this.height = height;
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    this.points = [];
  }

  addSplats(x, y, vx, vy, radius = 26, strength = 0.95) {
    this.points.push({
      x: x * this.width,
      y: y * this.height,
      vx: vx,
      vy: vy,
      radius: Math.max(16, Math.min(radius, 46)),
      alpha: Math.min(strength, 1.0),
      decay: 0.022, // Natural 1.5s fluid dissipation
    });
  }

  update() {
    const imgData = this.ctx.getImageData(0, 0, this.width, this.height);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.floor(data[i] * 0.958); // Liquid decay rate
      data[i + 1] = Math.floor(128 + (data[i + 1] - 128) * 0.93);
      data[i + 2] = Math.floor(128 + (data[i + 2] - 128) * 0.93);
    }
    this.ctx.putImageData(imgData, 0, 0);

    for (let i = this.points.length - 1; i >= 0; i--) {
      const p = this.points[i];
      p.alpha -= p.decay;

      if (p.alpha <= 0.01) {
        this.points.splice(i, 1);
        continue;
      }

      const grad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
      const intensity = Math.floor(p.alpha * 255);
      const velR_X = Math.floor(Math.max(0, Math.min(255, 128 + p.vx * 35)));
      const velR_Y = Math.floor(Math.max(0, Math.min(255, 128 + p.vy * 35)));

      grad.addColorStop(0, `rgba(${intensity}, ${velR_X}, ${velR_Y}, 1.0)`);
      grad.addColorStop(0.5, `rgba(${Math.floor(intensity * 0.7)}, ${velR_X}, ${velR_Y}, 0.7)`);
      grad.addColorStop(1, 'rgba(0, 128, 128, 0.0)');

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  getTextureSource() {
    return this.canvas;
  }
}

export function setFluidHouse(house) {
  currentHouse = house.toLowerCase();
  currentHouseGlow = HOUSE_GLOW_COLORS[currentHouse] || HOUSE_GLOW_COLORS.gryffindor;

  if (gl && revealTextureMap[currentHouse]) {
    activeRevealTexture = revealTextureMap[currentHouse];
  }
}

export function initFluidDistortion() {
  const container = document.getElementById('hero-fluid-frame');
  if (!container) return;

  let canvas = document.getElementById('hero-webgl-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'hero-webgl-canvas';
    canvas.className = 'hero-portrait-canvas';
    container.appendChild(canvas);
  }

  gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false });
  if (!gl) {
    console.warn('WebGL not supported, using fallback image.');
    const fallback = document.getElementById('hero-fallback-img');
    if (fallback) fallback.style.display = 'block';
    return;
  }

  function createShader(gl, type, source) {
    const s = gl.createShader(type);
    gl.shaderSource(s, source);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    return;
  }

  gl.useProgram(program);

  const posBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
    -1,  1,
     1, -1,
     1,  1,
  ]), gl.STATIC_DRAW);

  const aPosition = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(aPosition);
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

  const uBaseTexture = gl.getUniformLocation(program, 'u_baseTexture');
  const uRevealTexture = gl.getUniformLocation(program, 'u_revealTexture');
  const uFluidTexture = gl.getUniformLocation(program, 'u_fluidTexture');
  const uResolution = gl.getUniformLocation(program, 'u_resolution');
  const uImageResolution = gl.getUniformLocation(program, 'u_imageResolution');
  const uTime = gl.getUniformLocation(program, 'u_time');
  const uHouseColor = gl.getUniformLocation(program, 'u_houseColor');

  function createTexture(image, textureUnit) {
    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    return texture;
  }

  const baseImage = new Image();
  baseImage.crossOrigin = 'anonymous';
  baseImage.src = '/assets/krishna_real.png';
  baseImage.onload = () => {
    baseTexture = createTexture(baseImage, 0);
  };

  Object.keys(HOUSE_TEXTURES).forEach((hKey) => {
    const hImg = new Image();
    hImg.crossOrigin = 'anonymous';
    hImg.src = HOUSE_TEXTURES[hKey];
    hImg.onload = () => {
      revealTextureMap[hKey] = createTexture(hImg, 1);
      if (hKey === currentHouse) {
        activeRevealTexture = revealTextureMap[hKey];
      }
    };
  });

  try {
    const saved = localStorage.getItem('hp_house_theme') || 'gryffindor';
    setFluidHouse(saved);
  } catch (err) {}

  const fluidSim = new FluidPhysics(160, 160);
  const fluidTexture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, fluidTexture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  // Mouse trajectory with smooth sub-step interpolation for continuous fluid wakes
  let prevMouseX = 0;
  let prevMouseY = 0;
  let hasMoved = false;

  function handlePointer(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;

    if (x < 0 || x > 1 || y < 0 || y > 1) return;

    if (!hasMoved) {
      prevMouseX = x;
      prevMouseY = y;
      hasMoved = true;
      return;
    }

    const dx = x - prevMouseX;
    const dy = y - prevMouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const speed = dist * 25.0;

    const steps = Math.max(1, Math.min(Math.floor(dist * 60), 8));
    const radius = 22 + Math.min(speed * 25.0, 32);
    const strength = 0.85 + Math.min(speed * 1.2, 0.45);

    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      const interpX = prevMouseX + dx * t;
      const interpY = prevMouseY + dy * t;
      fluidSim.addSplats(interpX, interpY, dx * 10.0, dy * 10.0, radius, strength);
    }

    prevMouseX = x;
    prevMouseY = y;
  }

  container.addEventListener('mousemove', (e) => {
    handlePointer(e.clientX, e.clientY);
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      handlePointer(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  container.addEventListener('mouseleave', () => {
    hasMoved = false;
  });

  const heroCard = document.getElementById('hero-sticky-card');
  if (heroCard) {
    heroCard.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        handlePointer(e.clientX, e.clientY);
      } else if (hasMoved) {
        hasMoved = false;
      }
    }, { passive: true });
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = container.clientWidth;
    const height = container.clientHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
  }

  window.addEventListener('resize', resize);
  resize();

  let startTime = performance.now();

  function render(time) {
    const elapsed = (time - startTime) * 0.001;

    fluidSim.update();

    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, fluidTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, fluidSim.getTextureSource());

    if (baseTexture) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, baseTexture);
    }

    if (activeRevealTexture) {
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, activeRevealTexture);
    }

    gl.useProgram(program);
    gl.uniform1i(uBaseTexture, 0);
    gl.uniform1i(uRevealTexture, 1);
    gl.uniform1i(uFluidTexture, 2);
    gl.uniform2f(uResolution, canvas.width, canvas.height);
    gl.uniform2f(uImageResolution, 798.0, 1024.0);
    gl.uniform1f(uTime, elapsed);
    gl.uniform3fv(uHouseColor, currentHouseGlow);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}
