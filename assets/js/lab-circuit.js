/* ==========================================================================
   THÍ NGHIỆM VẬT LÝ — SƠ ĐỒ MẠCH ĐIỆN TƯƠNG TÁC
   Interactive Electric Circuit Diagram — lab-circuit.js
   ========================================================================== */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     DỮ LIỆU MẠCH ĐIỆN MẪU
  ───────────────────────────────────────────── */
  const CIRCUIT_PRESETS = {
    series: {
      name: 'Mạch Nối Tiếp',
      desc: 'Các điện trở R₁, R₂, R₃ mắc nối tiếp — cường độ dòng điện như nhau qua mọi phần.',
      R: [30, 40, 50],
      type: 'series'
    },
    parallel: {
      name: 'Mạch Song Song',
      desc: 'Các điện trở R₁, R₂, R₃ mắc song song — hiệu điện thế như nhau qua mọi nhánh.',
      R: [60, 40, 120],
      type: 'parallel'
    },
    mixed: {
      name: 'Mạch Hỗn Hợp',
      desc: 'R₁ nối tiếp với nhóm (R₂ // R₃) — kết hợp cả hai cách mắc.',
      R: [20, 60, 60],
      type: 'mixed'
    }
  };

  let currentPreset = 'series';
  let voltage = 12; // Volts
  let animFrame = null;
  let electronPos = [0, 0, 0]; // fraction along path for each electron
  let canvas, ctx;
  let isRunning = false;

  /* ─────────────────────────────────────────────
     RENDER HTML
  ───────────────────────────────────────────── */
  function buildCircuitUI() {
    const container = document.getElementById('experiment-circuit');
    if (!container) return;

    container.innerHTML = `
      <div class="circuit-layout">
        <!-- Left: Controls -->
        <div class="circuit-controls-panel">
          <div class="circuit-section">
            <h3>⚡ Chọn Loại Mạch</h3>
            <div class="circuit-preset-btns">
              ${Object.entries(CIRCUIT_PRESETS).map(([key, p]) => `
                <button class="circuit-preset-btn ${key === currentPreset ? 'active' : ''}"
                        onclick="circuitSelectPreset('${key}')">${p.name}</button>
              `).join('')}
            </div>
          </div>

          <div class="circuit-section">
            <h3>🔋 Hiệu Điện Thế (U)</h3>
            <div class="slider-label">
              <span>1 V</span>
              <strong id="circuit-voltage-val">${voltage} V</strong>
              <span>30 V</span>
            </div>
            <input type="range" id="circuit-voltage" min="1" max="30" value="${voltage}"
                   oninput="circuitUpdateVoltage(this.value)">
          </div>

          <div class="circuit-section">
            <h3>🔧 Giá Trị Điện Trở (Ω)</h3>
            <div id="circuit-resistor-sliders"></div>
          </div>

          <div class="circuit-section circuit-desc-box" id="circuit-desc-box">
            <p id="circuit-desc-text"></p>
          </div>
        </div>

        <!-- Right: Canvas + Results -->
        <div class="circuit-viewer-panel">
          <canvas id="circuit-canvas" width="560" height="320"></canvas>

          <div class="circuit-results" id="circuit-results">
            <div class="circuit-result-item">
              <span class="circuit-result-label">R tổng</span>
              <span class="circuit-result-value" id="res-rtotal">—</span>
            </div>
            <div class="circuit-result-item">
              <span class="circuit-result-label">I tổng</span>
              <span class="circuit-result-value" id="res-itotal">—</span>
            </div>
            <div class="circuit-result-item" id="res-r1-wrap">
              <span class="circuit-result-label">I₁ / U₁</span>
              <span class="circuit-result-value" id="res-r1">—</span>
            </div>
            <div class="circuit-result-item" id="res-r2-wrap">
              <span class="circuit-result-label">I₂ / U₂</span>
              <span class="circuit-result-value" id="res-r2">—</span>
            </div>
            <div class="circuit-result-item" id="res-r3-wrap">
              <span class="circuit-result-label">I₃ / U₃</span>
              <span class="circuit-result-value" id="res-r3">—</span>
            </div>
          </div>

          <div class="circuit-formulas" id="circuit-formulas"></div>

          <div class="lab-actions" style="margin-top:1rem;">
            <button class="lab-btn lab-btn-primary" onclick="circuitToggleAnim()">
              <span id="circuit-anim-icon">▶</span>
              <span id="circuit-anim-label">Bật Dòng Điện</span>
            </button>
            <button class="lab-btn lab-btn-secondary" onclick="circuitReset()">🔄 Đặt Lại</button>
          </div>
        </div>
      </div>
    `;

    canvas = document.getElementById('circuit-canvas');
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    renderResistorSliders();
    updateCircuit();
  }

  function resizeCanvas() {
    const panel = document.querySelector('.circuit-viewer-panel');
    if (!panel || !canvas) return;
    const w = Math.min(panel.offsetWidth - 4, 560);
    canvas.style.width = w + 'px';
    canvas.style.height = Math.round(w * 320 / 560) + 'px';
  }

  function renderResistorSliders() {
    const preset = CIRCUIT_PRESETS[currentPreset];
    const wrap = document.getElementById('circuit-resistor-sliders');
    if (!wrap) return;
    const labels = ['R₁', 'R₂', 'R₃'];
    wrap.innerHTML = preset.R.map((r, i) => `
      <div class="slider-label">
        <span>${labels[i]}</span>
        <strong id="circuit-r${i+1}-val">${r} Ω</strong>
        <span>200 Ω</span>
      </div>
      <input type="range" id="circuit-r${i+1}" min="1" max="200" value="${r}"
             oninput="circuitUpdateR(${i}, this.value)">
    `).join('');
  }

  /* ─────────────────────────────────────────────
     TÍNH TOÁN
  ───────────────────────────────────────────── */
  function calcCircuit() {
    const preset = CIRCUIT_PRESETS[currentPreset];
    const [R1, R2, R3] = preset.R;
    const U = voltage;
    let Rtotal, Itotal, results;

    if (preset.type === 'series') {
      Rtotal = R1 + R2 + R3;
      Itotal = U / Rtotal;
      results = [
        { I: Itotal, U: Itotal * R1 },
        { I: Itotal, U: Itotal * R2 },
        { I: Itotal, U: Itotal * R3 }
      ];
    } else if (preset.type === 'parallel') {
      Rtotal = 1 / (1/R1 + 1/R2 + 1/R3);
      Itotal = U / Rtotal;
      results = [
        { I: U / R1, U: U },
        { I: U / R2, U: U },
        { I: U / R3, U: U }
      ];
    } else { // mixed: R1 + (R2 // R3)
      const R23 = 1 / (1/R2 + 1/R3);
      Rtotal = R1 + R23;
      Itotal = U / Rtotal;
      const U1 = Itotal * R1;
      const U23 = Itotal * R23;
      results = [
        { I: Itotal, U: U1 },
        { I: U23 / R2, U: U23 },
        { I: U23 / R3, U: U23 }
      ];
    }
    return { Rtotal, Itotal, results };
  }

  function fmt(n) { return n.toFixed(2); }

  function updateCircuit() {
    const { Rtotal, Itotal, results } = calcCircuit();
    const preset = CIRCUIT_PRESETS[currentPreset];

    // Update results panel
    setTxt('res-rtotal', fmt(Rtotal) + ' Ω');
    setTxt('res-itotal', fmt(Itotal * 1000) + ' mA');
    results.forEach((r, i) => {
      const el = document.getElementById(`res-r${i+1}`);
      if (el) el.textContent = `${fmt(r.I * 1000)} mA / ${fmt(r.U)} V`;
    });

    // Update description
    setTxt('circuit-desc-text', preset.desc);

    // Update formulas
    const fEl = document.getElementById('circuit-formulas');
    if (fEl) {
      if (preset.type === 'series') {
        fEl.innerHTML = `<div class="circuit-formula">R<sub>td</sub> = R₁ + R₂ + R₃ = ${fmt(Rtotal)} Ω &nbsp;|&nbsp; I = U / R<sub>td</sub> = ${fmt(Itotal*1000)} mA</div>`;
      } else if (preset.type === 'parallel') {
        fEl.innerHTML = `<div class="circuit-formula">1/R<sub>td</sub> = 1/R₁ + 1/R₂ + 1/R₃ &nbsp;→&nbsp; R<sub>td</sub> = ${fmt(Rtotal)} Ω &nbsp;|&nbsp; I = ${fmt(Itotal*1000)} mA</div>`;
      } else {
        const R23 = 1/(1/preset.R[1]+1/preset.R[2]);
        fEl.innerHTML = `<div class="circuit-formula">R₂₃ = R₂//R₃ = ${fmt(R23)} Ω &nbsp;→&nbsp; R<sub>td</sub> = R₁ + R₂₃ = ${fmt(Rtotal)} Ω &nbsp;|&nbsp; I = ${fmt(Itotal*1000)} mA</div>`;
      }
    }

    drawCircuit();
  }

  /* ─────────────────────────────────────────────
     VẼ MẠCH ĐIỆN TRÊN CANVAS
  ───────────────────────────────────────────── */
  function drawCircuit() {
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const wireColor = isDark ? '#94a3b8' : '#475569';
    const resistorFill = isDark ? '#1e3a5f' : '#dbeafe';
    const resistorStroke = isDark ? '#60a5fa' : '#2563eb';
    const batteryPos = { x: 60, y: H / 2 };

    // Draw based on type
    const preset = CIRCUIT_PRESETS[currentPreset];
    if (preset.type === 'series') drawSeries(W, H, wireColor, resistorFill, resistorStroke, batteryPos);
    else if (preset.type === 'parallel') drawParallel(W, H, wireColor, resistorFill, resistorStroke, batteryPos);
    else drawMixed(W, H, wireColor, resistorFill, resistorStroke, batteryPos);

    if (isRunning) drawElectrons(W, H, preset.type);
  }

  function drawWire(x1, y1, x2, y2, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  function drawBattery(x, y, voltage, isDark) {
    const h = 36, tw = 12;
    ctx.strokeStyle = isDark ? '#fbbf24' : '#d97706';
    ctx.lineWidth = 2.5;
    // negative plate
    ctx.beginPath(); ctx.moveTo(x, y - h/2 + 8); ctx.lineTo(x, y + h/2 - 8); ctx.stroke();
    // positive plate
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(x + tw, y - h/2); ctx.lineTo(x + tw, y + h/2); ctx.stroke();
    ctx.lineWidth = 2.5;
    // U label
    ctx.fillStyle = isDark ? '#fbbf24' : '#b45309';
    ctx.font = 'bold 12px Be Vietnam Pro, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${voltage}V`, x + 6, y - h/2 - 8);
    ctx.fillText('🔋', x + 5, y + h/2 + 18);
  }

  function drawResistor(cx, cy, label, valOhm, fill, stroke) {
    const w = 54, h = 22;
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    roundRect(ctx, cx - w/2, cy - h/2, w, h, 5);
    ctx.fill(); ctx.stroke();

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    ctx.fillStyle = isDark ? '#e2e8f0' : '#1e3a5f';
    ctx.font = 'bold 11px Be Vietnam Pro, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, cx, cy - 3);
    ctx.font = '9px Be Vietnam Pro, sans-serif';
    ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
    ctx.fillText(valOhm + 'Ω', cx, cy + 7);
    ctx.textBaseline = 'alphabetic';
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  function drawSeries(W, H, wc, rf, rs, bat) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const midY = H / 2;
    const batX = 70;
    const endX = W - 40;
    const rPositions = [180, 300, 420];
    const preset = CIRCUIT_PRESETS[currentPreset];

    // Top and bottom rails
    drawWire(batX + 18, midY - 60, endX, midY - 60, wc);
    drawWire(batX, midY + 60, endX, midY + 60, wc);
    // Left side
    drawWire(batX, midY - 60, batX, midY + 60, wc);
    drawWire(endX, midY - 60, endX, midY + 60, wc);

    // Battery
    drawBattery(batX, midY, voltage, isDark);

    // Resistors on top rail
    rPositions.forEach((rx, i) => {
      drawResistor(rx, midY - 60, `R${i+1}`, preset.R[i], rf, rs);
    });

    // Current direction arrows
    if (isRunning) {
      drawArrow(batX + 30, midY - 60, 1, wc);
    }
  }

  function drawParallel(W, H, wc, rf, rs, bat) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const midY = H / 2;
    const batX = 60;
    const leftBus = 130;
    const rightBus = W - 60;
    const preset = CIRCUIT_PRESETS[currentPreset];
    const rows = [midY - 80, midY, midY + 80];

    // Battery
    drawWire(batX, midY - 100, batX, midY + 100, wc);
    drawWire(batX + 18, midY - 100, leftBus, midY - 100, wc);
    drawWire(batX, midY + 100, leftBus, midY + 100, wc);
    drawBattery(batX, midY, voltage, isDark);

    // Bus bars
    drawWire(leftBus, midY - 100, leftBus, midY + 100, wc);
    drawWire(rightBus, midY - 100, rightBus, midY + 100, wc);
    // End connection
    drawWire(rightBus, midY - 100, rightBus, midY - 100, wc);
    drawWire(rightBus, midY + 100, rightBus + 0, midY + 100, wc);

    // Branches
    rows.forEach((ry, i) => {
      drawWire(leftBus, ry, leftBus + 40, ry, wc);
      drawWire(rightBus - 40, ry, rightBus, ry, wc);
      const mx = (leftBus + 40 + rightBus - 40) / 2;
      drawResistor(mx, ry, `R${i+1}`, preset.R[i], rf, rs);
    });
  }

  function drawMixed(W, H, wc, rf, rs, bat) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const midY = H / 2;
    const batX = 55;
    const preset = CIRCUIT_PRESETS[currentPreset];

    // Battery vertical wire
    drawWire(batX, midY - 100, batX, midY + 100, wc);
    drawBattery(batX, midY, voltage, isDark);

    // Top horizontal rail
    drawWire(batX + 18, midY - 100, W - 50, midY - 100, wc);
    // Bottom horizontal rail
    drawWire(batX, midY + 100, W - 50, midY + 100, wc);
    // Right vertical close
    drawWire(W - 50, midY - 100, W - 50, midY + 100, wc);

    // R1 on top rail (series)
    drawResistor(160, midY - 100, 'R₁', preset.R[0], rf, rs);

    // Parallel section (R2 // R3)
    const splitX = 250;
    const joinX = W - 90;
    // R2 top branch
    drawWire(splitX, midY - 100, splitX, midY - 40, wc);
    drawWire(splitX, midY - 40, joinX, midY - 40, wc);
    drawWire(joinX, midY - 40, joinX, midY - 100, wc);
    drawResistor((splitX + joinX)/2, midY - 40, 'R₂', preset.R[1], rf, rs);

    // R3 bottom branch
    drawWire(splitX, midY + 100, splitX, midY + 40, wc);
    drawWire(splitX, midY + 40, joinX, midY + 40, wc);
    drawWire(joinX, midY + 40, joinX, midY + 100, wc);
    drawResistor((splitX + joinX)/2, midY + 40, 'R₃', preset.R[2], rf, rs);

    // Junction dots
    drawJunction(splitX, midY - 100, wc);
    drawJunction(joinX, midY - 100, wc);
  }

  function drawJunction(x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }

  function drawArrow(x, y, dir, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    if (dir > 0) {
      ctx.moveTo(x, y - 5);
      ctx.lineTo(x + 12, y);
      ctx.lineTo(x, y + 5);
    } else {
      ctx.moveTo(x + 12, y - 5);
      ctx.lineTo(x, y);
      ctx.lineTo(x + 12, y + 5);
    }
    ctx.fill();
  }

  /* ─────────────────────────────────────────────
     ANIMATION ELECTRON
  ───────────────────────────────────────────── */
  function drawElectrons(W, H, type) {
    const { Itotal } = calcCircuit();
    const speed = Math.min(Itotal * 0.005, 0.005);

    electronPos = electronPos.map(p => (p + speed) % 1);

    const midY = H / 2;
    const paths = getElectronPaths(W, H, type, midY);

    ctx.fillStyle = '#facc15';
    ctx.shadowColor = '#fde68a';
    ctx.shadowBlur = 8;
    paths.forEach((path, pi) => {
      const t = electronPos[pi % electronPos.length];
      const pt = pointOnPath(path, t);
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;
  }

  function getElectronPaths(W, H, type, midY) {
    const batX = 70;
    if (type === 'series') {
      return [[
        { x: batX + 18, y: midY - 60 },
        { x: W - 40, y: midY - 60 },
        { x: W - 40, y: midY + 60 },
        { x: batX, y: midY + 60 }
      ]];
    } else if (type === 'parallel') {
      const leftBus = 130, rightBus = W - 60;
      return [
        [{ x: leftBus, y: midY - 100 }, { x: rightBus, y: midY - 100 }, { x: rightBus, y: midY + 100 }, { x: leftBus, y: midY + 100 }],
        [{ x: leftBus, y: midY }, { x: rightBus, y: midY }],
        [{ x: leftBus, y: midY + 80 }, { x: rightBus, y: midY + 80 }]
      ];
    } else {
      return [[
        { x: 73, y: midY - 100 },
        { x: W - 50, y: midY - 100 },
        { x: W - 50, y: midY + 100 },
        { x: 55, y: midY + 100 }
      ]];
    }
  }

  function pointOnPath(pts, t) {
    const total = pts.length - 1;
    const seg = t * total;
    const idx = Math.min(Math.floor(seg), total - 1);
    const f = seg - idx;
    const a = pts[idx], b = pts[idx + 1] || pts[idx];
    return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
  }

  function animate() {
    if (!isRunning) return;
    drawCircuit();
    animFrame = requestAnimationFrame(animate);
  }

  /* ─────────────────────────────────────────────
     PUBLIC API (called from HTML)
  ───────────────────────────────────────────── */
  window.circuitSelectPreset = function (key) {
    currentPreset = key;
    document.querySelectorAll('.circuit-preset-btn').forEach(b => b.classList.remove('active'));
    const btn = document.querySelector(`.circuit-preset-btn[onclick="circuitSelectPreset('${key}')"]`);
    if (btn) btn.classList.add('active');
    renderResistorSliders();
    updateCircuit();
  };

  window.circuitUpdateVoltage = function (v) {
    voltage = parseFloat(v);
    setTxt('circuit-voltage-val', v + ' V');
    updateCircuit();
  };

  window.circuitUpdateR = function (idx, val) {
    CIRCUIT_PRESETS[currentPreset].R[idx] = parseFloat(val);
    setTxt(`circuit-r${idx+1}-val`, val + ' Ω');
    updateCircuit();
  };

  window.circuitToggleAnim = function () {
    isRunning = !isRunning;
    setTxt('circuit-anim-icon', isRunning ? '⏸' : '▶');
    setTxt('circuit-anim-label', isRunning ? 'Tắt Dòng Điện' : 'Bật Dòng Điện');
    if (isRunning) animate();
    else { cancelAnimationFrame(animFrame); drawCircuit(); }
  };

  window.circuitReset = function () {
    isRunning = false;
    cancelAnimationFrame(animFrame);
    setTxt('circuit-anim-icon', '▶');
    setTxt('circuit-anim-label', 'Bật Dòng Điện');
    voltage = 12;
    const vSlider = document.getElementById('circuit-voltage');
    if (vSlider) { vSlider.value = 12; setTxt('circuit-voltage-val', '12 V'); }
    currentPreset = 'series';
    CIRCUIT_PRESETS.series.R = [30, 40, 50];
    CIRCUIT_PRESETS.parallel.R = [60, 40, 120];
    CIRCUIT_PRESETS.mixed.R = [20, 60, 60];
    document.querySelectorAll('.circuit-preset-btn').forEach((b, i) => {
      b.classList.toggle('active', i === 0);
    });
    renderResistorSliders();
    updateCircuit();
  };

  /* Helper */
  function setTxt(id, txt) {
    const el = document.getElementById(id);
    if (el) el.textContent = txt;
  }

  /* ─────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────── */
  buildCircuitUI();

  // Redraw when theme changes
  const observer = new MutationObserver(() => drawCircuit());
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

})();
