/* ==========================================================================
   THÍ NGHIỆM SINH HỌC — MÔ HÌNH 3D HỆ CƠ QUAN CƠ THỂ NGƯỜI
   Human Body Organ Systems 3D Model — lab-biology.js
   ========================================================================== */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     DỮ LIỆU CÁC HỆ CƠ QUAN
  ───────────────────────────────────────────── */
  const ORGAN_SYSTEMS = {
    circulatory: {
      name: 'Hệ Tuần Hoàn',
      icon: '❤️',
      color: '#ef4444',
      colorLight: 'rgba(239,68,68,0.15)',
      organs: ['Tim', 'Động mạch chủ', 'Tĩnh mạch chủ', 'Mao mạch', 'Phổi (vòng nhỏ)'],
      function: 'Vận chuyển máu, oxy và chất dinh dưỡng đến tất cả tế bào cơ thể và đưa CO₂ về phổi thải ra ngoài.',
      facts: [
        'Tim đập khoảng 100.000 lần mỗi ngày',
        'Tổng chiều dài mạch máu ≈ 96.000 km',
        'Máu lưu thông toàn thân trong ~60 giây'
      ],
      drawFn: drawCirculatory
    },
    respiratory: {
      name: 'Hệ Hô Hấp',
      icon: '🫁',
      color: '#3b82f6',
      colorLight: 'rgba(59,130,246,0.15)',
      organs: ['Mũi / Miệng', 'Khí quản', 'Phế quản', 'Phổi trái', 'Phổi phải', 'Phế nang'],
      function: 'Trao đổi khí O₂ và CO₂ giữa cơ thể và môi trường. Cung cấp oxy cho máu và thải CO₂ ra ngoài.',
      facts: [
        'Người lớn thở 12–20 lần/phút',
        'Tổng diện tích phế nang ≈ 70 m²',
        'Phổi phải lớn hơn phổi trái'
      ],
      drawFn: drawRespiratory
    },
    digestive: {
      name: 'Hệ Tiêu Hóa',
      icon: '🫃',
      color: '#f97316',
      colorLight: 'rgba(249,115,22,0.15)',
      organs: ['Miệng', 'Thực quản', 'Dạ dày', 'Ruột non', 'Ruột già', 'Gan', 'Tụy'],
      function: 'Biến đổi thức ăn thành các chất dinh dưỡng nhỏ để cơ thể hấp thụ, đồng thời thải bỏ chất cặn bã.',
      facts: [
        'Ruột non dài khoảng 6–7 m',
        'Dạ dày có thể chứa 1–1,5 lít',
        'Gan là tuyến lớn nhất cơ thể (~1,5 kg)'
      ],
      drawFn: drawDigestive
    },
    nervous: {
      name: 'Hệ Thần Kinh',
      icon: '🧠',
      color: '#8b5cf6',
      colorLight: 'rgba(139,92,246,0.15)',
      organs: ['Não bộ', 'Tủy sống', 'Dây thần kinh ngoại biên', 'Hệ thần kinh tự chủ'],
      function: 'Tiếp nhận, xử lý thông tin và điều phối hoạt động của toàn bộ cơ thể thông qua các xung thần kinh.',
      facts: [
        'Não chứa ~86 tỷ tế bào thần kinh',
        'Xung thần kinh lan truyền 1–120 m/s',
        'Não chiếm 2% khối lượng nhưng tiêu thụ 20% năng lượng'
      ],
      drawFn: drawNervous
    },
    skeletal: {
      name: 'Hệ Xương',
      icon: '🦴',
      color: '#d4b483',
      colorLight: 'rgba(212,180,131,0.15)',
      organs: ['Xương sọ', 'Cột sống', 'Xương sườn', 'Xương chi trên', 'Xương chi dưới', 'Khớp'],
      function: 'Nâng đỡ cơ thể, bảo vệ nội tạng, cung cấp điểm tựa cho cơ và sản xuất tế bào máu trong tủy xương.',
      facts: [
        'Người lớn có 206 xương',
        'Trẻ sơ sinh có ~270–300 xương (nhiều sụn)',
        'Xương đùi là xương dài nhất và cứng nhất'
      ],
      drawFn: drawSkeletal
    },
    muscular: {
      name: 'Hệ Cơ',
      icon: '💪',
      color: '#ec4899',
      colorLight: 'rgba(236,72,153,0.15)',
      organs: ['Cơ vân (cơ xương)', 'Cơ trơn (nội tạng)', 'Cơ tim', 'Gân', 'Dây chằng'],
      function: 'Tạo ra chuyển động, duy trì tư thế cơ thể, sinh nhiệt và hỗ trợ tuần hoàn máu.',
      facts: [
        'Cơ thể có hơn 600 cơ vân',
        'Cơ chiếm 40–50% trọng lượng cơ thể',
        'Cơ mắt là cơ cử động nhanh nhất'
      ],
      drawFn: drawMuscular
    }
  };

  let currentSystem = 'circulatory';
  let canvas, ctx;
  let rotAngle = 0;
  let isDragging = false;
  let lastX = 0;
  let pulseAnim = 0;
  let animFrame = null;
  let isAnimating = true;

  /* ─────────────────────────────────────────────
     BUILD UI
  ───────────────────────────────────────────── */
  function buildBioUI() {
    const container = document.getElementById('experiment-biology');
    if (!container) return;

    const sysKeys = Object.keys(ORGAN_SYSTEMS);

    container.innerHTML = `
      <div class="bio-layout">
        <!-- Left: System selector -->
        <div class="bio-selector-panel">
          <h3 style="margin-bottom:0.75rem; font-size:0.95rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.06em;">Chọn Hệ Cơ Quan</h3>
          ${sysKeys.map(key => {
            const s = ORGAN_SYSTEMS[key];
            return `<button class="bio-system-btn ${key === currentSystem ? 'active' : ''}"
                            style="--sys-color:${s.color}"
                            onclick="bioSelectSystem('${key}')">
              <span class="bio-sys-icon">${s.icon}</span>
              <span class="bio-sys-name">${s.name}</span>
            </button>`;
          }).join('')}
        </div>

        <!-- Center: Canvas -->
        <div class="bio-canvas-panel">
          <canvas id="bio-canvas" width="340" height="440"></canvas>
          <div class="bio-canvas-overlay">
            <button class="canvas-ctrl-btn" onclick="bioToggleAnim()" title="Bật/Tắt hoạt ảnh" id="bio-anim-btn">⏸</button>
            <button class="canvas-ctrl-btn" onclick="bioRotateLeft()" title="Xoay trái">◀</button>
            <button class="canvas-ctrl-btn" onclick="bioRotateRight()" title="Xoay phải">▶</button>
          </div>
          <p class="bio-drag-hint">🖱️ Kéo để xoay mô hình</p>
        </div>

        <!-- Right: Info -->
        <div class="bio-info-panel" id="bio-info-panel">
          <div class="bio-info-header" id="bio-info-header">
            <span class="bio-info-icon" id="bio-info-icon"></span>
            <h3 id="bio-info-title"></h3>
          </div>

          <div class="bio-info-section">
            <h4>🔬 Chức năng chính</h4>
            <p id="bio-info-function"></p>
          </div>

          <div class="bio-info-section">
            <h4>🫀 Các cơ quan cấu thành</h4>
            <ul class="bio-organ-list" id="bio-organ-list"></ul>
          </div>

          <div class="bio-info-section">
            <h4>💡 Kiến thức thú vị</h4>
            <div class="bio-facts" id="bio-facts"></div>
          </div>
        </div>
      </div>
    `;

    canvas = document.getElementById('bio-canvas');
    ctx = canvas.getContext('2d');

    // Mouse drag
    canvas.addEventListener('mousedown', e => { isDragging = true; lastX = e.clientX; });
    canvas.addEventListener('mousemove', e => {
      if (!isDragging) return;
      rotAngle += (e.clientX - lastX) * 0.015;
      lastX = e.clientX;
    });
    canvas.addEventListener('mouseup', () => isDragging = false);
    canvas.addEventListener('mouseleave', () => isDragging = false);

    // Touch drag
    canvas.addEventListener('touchstart', e => { isDragging = true; lastX = e.touches[0].clientX; });
    canvas.addEventListener('touchmove', e => {
      if (!isDragging) return;
      rotAngle += (e.touches[0].clientX - lastX) * 0.015;
      lastX = e.touches[0].clientX;
      e.preventDefault();
    }, { passive: false });
    canvas.addEventListener('touchend', () => isDragging = false);

    updateBioInfo();
    startBioAnim();
  }

  function updateBioInfo() {
    const sys = ORGAN_SYSTEMS[currentSystem];
    const header = document.getElementById('bio-info-header');
    if (header) header.style.background = sys.colorLight;
    setTxt('bio-info-icon', sys.icon);
    setTxt('bio-info-title', sys.name);
    setTxt('bio-info-function', sys.function);
    const organList = document.getElementById('bio-organ-list');
    if (organList) organList.innerHTML = sys.organs.map(o => `<li>${o}</li>`).join('');
    const factsEl = document.getElementById('bio-facts');
    if (factsEl) factsEl.innerHTML = sys.facts.map(f => `<div class="bio-fact-item">📌 ${f}</div>`).join('');
  }

  /* ─────────────────────────────────────────────
     ANIMATION LOOP
  ───────────────────────────────────────────── */
  function startBioAnim() {
    if (animFrame) cancelAnimationFrame(animFrame);
    function loop() {
      pulseAnim += 0.04;
      if (isAnimating && !isDragging) rotAngle += 0.005;
      drawBody();
      animFrame = requestAnimationFrame(loop);
    }
    loop();
  }

  /* ─────────────────────────────────────────────
     VẼ CƠ THỂ NGƯỜI + HỆ CƠ QUAN
  ───────────────────────────────────────────── */
  function drawBody() {
    if (!ctx || !canvas) return;
    const W = canvas.width, H = canvas.height;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    ctx.clearRect(0, 0, W, H);

    // Background gradient
    const bg = ctx.createRadialGradient(W/2, H/2, 10, W/2, H/2, 220);
    bg.addColorStop(0, isDark ? '#1a2744' : '#f0f7ff');
    bg.addColorStop(1, isDark ? '#0f172a' : '#e8f0fe');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    const cx = W / 2;
    const pulse = Math.sin(pulseAnim) * 0.5 + 0.5; // 0..1
    const squeeze = Math.sin(rotAngle * 2) * 0.08; // simulate 3D rotation

    // Draw silhouette outline of body
    drawBodySilhouette(cx, H, isDark, squeeze);

    // Draw active organ system
    const sys = ORGAN_SYSTEMS[currentSystem];
    sys.drawFn(ctx, cx, H, pulse, squeeze, isDark, sys);

    // System label overlay
    ctx.fillStyle = sys.color;
    ctx.font = 'bold 13px Be Vietnam Pro, sans-serif';
    ctx.textAlign = 'center';
    ctx.globalAlpha = 0.9;
    ctx.fillText(sys.icon + ' ' + sys.name, cx, H - 10);
    ctx.globalAlpha = 1;
  }

  function drawBodySilhouette(cx, H, isDark, sq) {
    const bodyColor = isDark ? 'rgba(148,163,184,0.12)' : 'rgba(100,120,160,0.08)';
    const lineColor = isDark ? 'rgba(148,163,184,0.3)' : 'rgba(100,120,160,0.25)';
    ctx.save();
    ctx.translate(cx, 0);
    ctx.scale(1 + sq * 0.3, 1);

    // Head
    ctx.beginPath();
    ctx.ellipse(0, 55, 35, 42, 0, 0, Math.PI * 2);
    ctx.fillStyle = bodyColor; ctx.fill();
    ctx.strokeStyle = lineColor; ctx.lineWidth = 1.5; ctx.stroke();

    // Neck
    ctx.beginPath();
    ctx.rect(-12, 95, 24, 22);
    ctx.fillStyle = bodyColor; ctx.fill(); ctx.stroke();

    // Torso
    ctx.beginPath();
    ctx.roundRect(-62, 117, 124, 160, [12, 12, 20, 20]);
    ctx.fillStyle = bodyColor; ctx.fill(); ctx.stroke();

    // Pelvis
    ctx.beginPath();
    ctx.ellipse(0, 285, 58, 22, 0, 0, Math.PI * 2);
    ctx.fillStyle = bodyColor; ctx.fill(); ctx.stroke();

    // Left arm
    ctx.beginPath();
    ctx.roundRect(-95, 117, 30, 120, 15);
    ctx.fillStyle = bodyColor; ctx.fill(); ctx.stroke();

    // Right arm
    ctx.beginPath();
    ctx.roundRect(65, 117, 30, 120, 15);
    ctx.fillStyle = bodyColor; ctx.fill(); ctx.stroke();

    // Left leg
    ctx.beginPath();
    ctx.roundRect(-52, 300, 36, 130, 18);
    ctx.fillStyle = bodyColor; ctx.fill(); ctx.stroke();

    // Right leg
    ctx.beginPath();
    ctx.roundRect(16, 300, 36, 130, 18);
    ctx.fillStyle = bodyColor; ctx.fill(); ctx.stroke();

    ctx.restore();
  }

  /* ─── Individual system draw functions ─── */

  function drawCirculatory(ctx, cx, H, pulse, sq, isDark, sys) {
    ctx.save();
    ctx.translate(cx, 0);
    const alpha = 0.7 + pulse * 0.3;
    const scale = 1 + pulse * 0.04;

    // Heart
    ctx.save();
    ctx.translate(0, 175);
    ctx.scale(scale * (1 + sq * 0.2), scale);
    ctx.globalAlpha = alpha;
    drawHeart(ctx, 0, 0, 28, sys.color);
    ctx.restore();
    ctx.globalAlpha = 1;

    // Arteries (red)
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3 + pulse * 1.5;
    ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.moveTo(0, 162); ctx.lineTo(0, 80); ctx.stroke();  // up to head
    ctx.beginPath(); ctx.moveTo(-8, 178); ctx.lineTo(-50, 200); ctx.lineTo(-50, 290); ctx.stroke(); // left arm
    ctx.beginPath(); ctx.moveTo(8, 178); ctx.lineTo(50, 200); ctx.lineTo(50, 290); ctx.stroke();  // right arm
    ctx.beginPath(); ctx.moveTo(-5, 195); ctx.lineTo(-20, 310); ctx.stroke(); // left leg
    ctx.beginPath(); ctx.moveTo(5, 195); ctx.lineTo(20, 310); ctx.stroke();  // right leg

    // Veins (blue, dashed)
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath(); ctx.moveTo(5, 162); ctx.lineTo(5, 80); ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  function drawHeart(ctx, x, y, r, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(0, r * 0.3);
    ctx.bezierCurveTo(-r * 1.6, -r * 0.5, -r * 1.6, -r * 1.4, 0, -r * 0.3);
    ctx.bezierCurveTo(r * 1.6, -r * 1.4, r * 1.6, -r * 0.5, 0, r * 0.3);
    ctx.closePath();
    const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, 0, 0, 0, r * 1.2);
    grad.addColorStop(0, '#fca5a5');
    grad.addColorStop(1, color);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  function drawRespiratory(ctx, cx, H, pulse, sq, isDark, sys) {
    ctx.save();
    ctx.translate(cx, 0);

    // Trachea
    ctx.strokeStyle = sys.color;
    ctx.lineWidth = 5;
    ctx.globalAlpha = 0.8;
    ctx.beginPath(); ctx.moveTo(0, 107); ctx.lineTo(0, 165); ctx.stroke();

    // Left lung
    const lScale = 1 + pulse * 0.04;
    ctx.save();
    ctx.translate(-28, 195);
    ctx.scale(lScale * (1 - sq * 0.15), lScale);
    ctx.beginPath();
    ctx.ellipse(0, 0, 30, 50, -0.2, 0, Math.PI * 2);
    const lgL = ctx.createRadialGradient(-10, -15, 5, 0, 0, 35);
    lgL.addColorStop(0, '#93c5fd');
    lgL.addColorStop(1, '#2563eb');
    ctx.fillStyle = lgL;
    ctx.globalAlpha = 0.7 + pulse * 0.2;
    ctx.fill();
    ctx.strokeStyle = sys.color; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.restore();

    // Right lung
    ctx.save();
    ctx.translate(28, 195);
    ctx.scale(lScale * (1 + sq * 0.15), lScale);
    ctx.beginPath();
    ctx.ellipse(0, 0, 33, 50, 0.2, 0, Math.PI * 2);
    const lgR = ctx.createRadialGradient(10, -15, 5, 0, 0, 38);
    lgR.addColorStop(0, '#93c5fd');
    lgR.addColorStop(1, '#1d4ed8');
    ctx.fillStyle = lgR;
    ctx.globalAlpha = 0.7 + pulse * 0.2;
    ctx.fill();
    ctx.strokeStyle = sys.color; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.restore();

    ctx.globalAlpha = 1;
    ctx.restore();
  }

  function drawDigestive(ctx, cx, H, pulse, sq, isDark, sys) {
    ctx.save();
    ctx.translate(cx, 0);
    ctx.globalAlpha = 0.8;

    // Esophagus
    ctx.strokeStyle = sys.color; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(0, 107); ctx.lineTo(0, 160); ctx.stroke();

    // Stomach
    ctx.save();
    ctx.translate(-15, 190);
    ctx.scale(1 + Math.sin(pulseAnim * 0.5) * 0.03, 1);
    ctx.beginPath(); ctx.ellipse(0, 0, 32, 28, -0.3, 0, Math.PI * 2);
    ctx.fillStyle = '#fed7aa'; ctx.fill();
    ctx.strokeStyle = sys.color; ctx.lineWidth = 2; ctx.stroke();
    ctx.restore();

    // Small intestine (coiled)
    ctx.strokeStyle = '#fb923c'; ctx.lineWidth = 5;
    ctx.beginPath();
    for (let i = 0; i < 40; i++) {
      const t = i / 40;
      const angle = t * Math.PI * 6;
      const r = 15 + t * 20;
      const x = Math.cos(angle) * r * (1 + sq * 0.3);
      const y = 250 + Math.sin(angle) * r * 0.6 + t * 10;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Large intestine (frame)
    ctx.strokeStyle = '#ea580c'; ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(-48, 220); ctx.lineTo(-48, 295);
    ctx.lineTo(0, 310); ctx.lineTo(48, 295); ctx.lineTo(48, 220);
    ctx.stroke();

    ctx.globalAlpha = 1;
    ctx.restore();
  }

  function drawNervous(ctx, cx, H, pulse, sq, isDark, sys) {
    ctx.save();
    ctx.translate(cx, 0);

    // Brain (more detailed)
    const brainGrad = ctx.createRadialGradient(-5, 45, 5, 0, 55, 35);
    brainGrad.addColorStop(0, '#c4b5fd');
    brainGrad.addColorStop(1, '#7c3aed');
    ctx.fillStyle = brainGrad;
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.ellipse(0, 52, 30 * (1 + sq * 0.2), 28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = sys.color; ctx.lineWidth = 2; ctx.stroke();

    // Brain folds
    ctx.strokeStyle = '#ddd6fe'; ctx.lineWidth = 1.5;
    [-12, 0, 12].forEach(dx => {
      ctx.beginPath();
      ctx.arc(dx, 50, 8, -Math.PI * 0.7, Math.PI * 0.7);
      ctx.stroke();
    });

    // Spinal cord
    ctx.strokeStyle = '#a78bfa'; ctx.lineWidth = 6;
    ctx.globalAlpha = 0.7;
    ctx.beginPath(); ctx.moveTo(0, 97); ctx.lineTo(0, 285); ctx.stroke();

    // Nerve branches with pulse glow
    ctx.lineWidth = 2;
    ctx.shadowColor = sys.color;
    ctx.shadowBlur = 4 + pulse * 8;
    const nervePoints = [
      [-60, 140], [60, 140],
      [-75, 180], [75, 180],
      [-40, 240], [40, 240],
      [-30, 290], [30, 290]
    ];
    nervePoints.forEach(([nx, ny]) => {
      ctx.beginPath();
      ctx.moveTo(0, ny);
      ctx.lineTo(nx, ny);
      ctx.stroke();
    });
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  function drawSkeletal(ctx, cx, H, pulse, sq, isDark, sys) {
    ctx.save();
    ctx.translate(cx, 0);
    ctx.strokeStyle = sys.color;
    ctx.fillStyle = isDark ? '#d4b483' : '#fef3c7';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.85;

    // Skull
    ctx.beginPath();
    ctx.ellipse(0 * (1 + sq * 0.1), 50, 28, 32, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Jaw
    ctx.beginPath();
    ctx.arc(0, 78, 16, 0, Math.PI);
    ctx.stroke();

    // Spine (vertebrae)
    for (let i = 0; i < 12; i++) {
      const sy = 105 + i * 16;
      ctx.beginPath();
      ctx.roundRect(-7, sy, 14, 12, 3);
      ctx.fill(); ctx.stroke();
    }

    // Ribcage
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 6; i++) {
      const ry = 128 + i * 16;
      const rw = 30 + i * 3;
      // Left rib
      ctx.beginPath(); ctx.moveTo(-5, ry); ctx.quadraticCurveTo(-rw, ry + 8, -rw + 10, ry + 14); ctx.stroke();
      // Right rib
      ctx.beginPath(); ctx.moveTo(5, ry); ctx.quadraticCurveTo(rw, ry + 8, rw - 10, ry + 14); ctx.stroke();
    }

    // Pelvis
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 286, 50, 18, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Femur
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(-25, 295); ctx.lineTo(-28, 400); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(25, 295); ctx.lineTo(28, 400); ctx.stroke();

    ctx.globalAlpha = 1;
    ctx.restore();
  }

  function drawMuscular(ctx, cx, H, pulse, sq, isDark, sys) {
    ctx.save();
    ctx.translate(cx, 0);
    ctx.globalAlpha = 0.8;
    const flex = 1 + pulse * 0.03;

    const drawMuscle = (x, y, rx, ry, angle) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.scale(flex * (1 + sq * 0.1), flex);
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      const mg = ctx.createRadialGradient(-rx * 0.3, -ry * 0.3, 2, 0, 0, Math.max(rx, ry));
      mg.addColorStop(0, '#fbcfe8');
      mg.addColorStop(1, sys.color);
      ctx.fillStyle = mg;
      ctx.fill();
      ctx.strokeStyle = '#be185d'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.restore();
    };

    // Pectorals
    drawMuscle(-22, 148, 25, 22, 0.1);
    drawMuscle(22, 148, 25, 22, -0.1);
    // Biceps
    drawMuscle(-82, 175, 12, 30, 0.05);
    drawMuscle(82, 175, 12, 30, -0.05);
    // Abs
    [0, 1, 2].forEach(i => {
      drawMuscle(-14, 195 + i * 28, 12, 12, 0);
      drawMuscle(14, 195 + i * 28, 12, 12, 0);
    });
    // Quads
    drawMuscle(-32, 330, 16, 40, 0.05);
    drawMuscle(32, 330, 16, 40, -0.05);

    ctx.globalAlpha = 1;
    ctx.restore();
  }

  /* ─────────────────────────────────────────────
     PUBLIC API
  ───────────────────────────────────────────── */
  window.bioSelectSystem = function (key) {
    currentSystem = key;
    document.querySelectorAll('.bio-system-btn').forEach(b => b.classList.remove('active'));
    const btn = document.querySelector(`.bio-system-btn[onclick="bioSelectSystem('${key}')"]`);
    if (btn) btn.classList.add('active');
    updateBioInfo();
  };

  window.bioToggleAnim = function () {
    isAnimating = !isAnimating;
    const btn = document.getElementById('bio-anim-btn');
    if (btn) btn.textContent = isAnimating ? '⏸' : '▶';
  };

  window.bioRotateLeft = function () { rotAngle -= 0.3; };
  window.bioRotateRight = function () { rotAngle += 0.3; };

  function setTxt(id, txt) {
    const el = document.getElementById(id);
    if (el) el.textContent = txt;
  }

  /* ─────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────── */
  buildBioUI();

})();
