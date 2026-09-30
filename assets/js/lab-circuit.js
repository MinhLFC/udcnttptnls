/* ==========================================================================
   PHÒNG THÍ NGHIỆM VẬT LÝ — MÔ PHỎNG MẠCH ĐIỆN TƯƠNG TÁC PHONG CÁCH PhET
   PhET-Style Interactive Circuit Construction Kit (DC)
   Tác giả: Đỗ Văn Nhật Minh — HCMUE
   ========================================================================== */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────
     1. CẤU HÌNH & TRẠNG THÁI TOÀN CỤC (STATE)
  ───────────────────────────────────────────────────────────── */
  const state = {
    viewMode: 'lifelike',       // 'lifelike' (hình ảnh thực) | 'schematic' (sơ đồ ký hiệu)
    currentDisplay: 'electrons',// 'electrons' | 'conventional' | 'none'
    preset: 'basic',            // 'basic' | 'series' | 'parallel' | 'ohm' | 'short'
    showVoltmeter: true,
    showAmmeter: true,
    isPaused: false,
    
    // Nguồn điện & linh kiện
    batteryVoltage: 9.0,        // Volt (0 - 36V)
    batteryReversed: false,
    
    // Trạng thái các công tắc
    switchMainClosed: true,     // Công tắc chính
    switchBranch2Closed: true,  // Công tắc nhánh 2 (mạch song song)
    
    // Thông số tải
    bulb1Resistance: 10.0,      // Ohm
    bulb2Resistance: 10.0,      // Ohm
    resistorResistance: 10.0,   // Ohm
    rheostatResistance: 15.0,   // Ohm (Biến trở mạch Ohm)

    // Que đo Vôn kế (Tọa độ x, y trên canvas)
    probeRed: { x: 580, y: 130, pinnedNode: null, isDragging: false },
    probeBlack: { x: 580, y: 220, pinnedNode: null, isDragging: false },
    
    // Linh kiện đang được chọn để chỉnh sửa thuộc tính
    selectedComponent: 'battery', // 'battery' | 'bulb1' | 'bulb2' | 'resistor' | null
    
    // Hoạt ảnh
    animOffset: 0,
    sparkParticles: [],
    lastTimestamp: 0
  };

  let canvas, ctx;
  let activeDragTarget = null;
  let dragOffset = { x: 0, y: 0 };
  let animFrameId = null;

  /* ─────────────────────────────────────────────────────────────
     2. ĐỊNH NGHĨA CÁC PRESETS MẠCH ĐIỆN PHET
  ───────────────────────────────────────────────────────────── */
  const PRESETS = {
    basic: {
      name: 'Mạch 1 Đèn Cơ Bản',
      badge: '💡 Đơn Giản',
      desc: 'Mạch gồm 1 Nguồn điện (Pin), 1 Công tắc gạt và 1 Bóng đèn sợi đốt. Quan sát dòng electron trôi và độ sáng đèn khi đóng/mở công tắc.',
      theory: 'Định luật Ohm cho đoạn mạch: I = U / R. Công suất tỏa nhiệt của bóng đèn: P = U · I = I² · R. Khi I càng lớn, đèn càng phát ra nhiều tia sáng vàng rực rỡ.'
    },
    series: {
      name: 'Mạch 2 Đèn Nối Tiếp',
      badge: '💡➕💡 Nối Tiếp',
      desc: 'Hai bóng đèn mắc nối tiếp. Cường độ dòng điện như nhau tại mọi điểm (I = I₁ = I₂), hiệu điện thế tổng bằng tổng các hiệu điện thế (U = U₁ + U₂).',
      theory: 'Điện trở tương đương: R_td = R₁ + R₂. Vì điện trở tăng gấp đôi nên dòng điện giảm một nửa, cả 2 bóng đèn sáng mờ hơn so với mạch đơn. Nếu tháo hoặc ngắt 1 bóng, bóng còn lại sẽ tắt ngay.'
    },
    parallel: {
      name: 'Mạch 2 Đèn Song Song',
      badge: '💡∥💡 Song Song',
      desc: 'Hai bóng đèn mắc song song vào 2 nhánh riêng biệt, mỗi nhánh có công tắc riêng. Khám phá cách vận hành của mạng điện chiếu sáng gia đình.',
      theory: 'Hiệu điện thế hai đầu mỗi nhánh bằng nhau: U = U₁ = U₂ = U_nguồn. Dòng điện mạch chính bằng tổng dòng các nhánh: I = I₁ + I₂. Khi ngắt một nhánh, bóng đèn ở nhánh kia vẫn sáng bình thường.'
    },
    ohm: {
      name: 'Khảo Sát Định Luật Ohm',
      badge: '📈 Đo Đạc & Đồ Thị',
      desc: 'Mạch thí nghiệm tiêu chuẩn gồm Pin, Biến trở R_b, Điện trở R cần khảo sát, Ampe kế mắc nối tiếp và Vôn kế mắc song song đo 2 đầu R.',
      theory: 'Cường độ dòng điện chạy qua dây dẫn tỉ lệ thuận với hiệu điện thế đặt vào hai đầu dây và tỉ lệ nghịch với điện trở của dây dẫn: I = U / R.'
    },
    short: {
      name: 'Hiện Tượng Đoản Mạch',
      badge: '⚠️ Nguy Hiểm',
      desc: 'Nối tắt hai cực của nguồn điện bằng dây dẫn có điện trở gần như bằng 0 (R ≈ 0). Cường độ dòng điện tăng vọt gây quá nhiệt bốc cháy.',
      theory: 'Khi R → 0, theo định luật Ohm I = U / R → ∞. Cực âm và cực dương đoản mạch làm electron chạy với tốc độ cực đại, nguồn điện phát nhiệt mãnh liệt gây cháy nổ!'
    }
  };

  /* ─────────────────────────────────────────────────────────────
     3. TÍNH TOÁN DÒNG ĐIỆN VÀ ĐIỆN THẾ TẠI CÁC NÚT (CIRCUIT SOLVER)
  ───────────────────────────────────────────────────────────── */
  function solveCircuit() {
    const U = state.batteryReversed ? -state.batteryVoltage : state.batteryVoltage;
    let Itotal = 0;
    let Rtotal = 0;
    let bulb1_I = 0, bulb1_U = 0, bulb1_P = 0;
    let bulb2_I = 0, bulb2_U = 0, bulb2_P = 0;
    let res_I = 0, res_U = 0;
    let isShort = false;

    // Danh sách các điểm đo (Test nodes) để que đo Vôn kế cắm vào
    const nodes = {};

    switch (state.preset) {
      case 'basic': {
        const R = state.bulb1Resistance;
        if (state.switchMainClosed) {
          Itotal = Math.abs(U) / R;
          Rtotal = R;
          bulb1_I = Itotal;
          bulb1_U = Math.abs(U);
          bulb1_P = bulb1_U * bulb1_I;
        } else {
          Itotal = 0;
          Rtotal = Infinity;
        }
        // Tọa độ các điểm nút mạch basic
        nodes.bat_pos = { x: 140, y: 260, V: state.batteryReversed ? 0 : state.batteryVoltage, label: 'Cực (+)' };
        nodes.bat_neg = { x: 140, y: 140, V: state.batteryReversed ? state.batteryVoltage : 0, label: 'Cực (-)' };
        nodes.switch_in = { x: 260, y: 140, V: nodes.bat_neg.V, label: 'Đầu công tắc' };
        nodes.switch_out = { x: 380, y: 140, V: state.switchMainClosed ? nodes.bat_neg.V : 0, label: 'Cuối công tắc' };
        nodes.bulb_in = { x: 500, y: 140, V: state.switchMainClosed ? nodes.bat_neg.V : 0, label: 'Đầu bóng đèn' };
        nodes.bulb_out = { x: 500, y: 260, V: nodes.bat_pos.V, label: 'Đuôi bóng đèn' };
        break;
      }

      case 'series': {
        const R = state.bulb1Resistance + state.bulb2Resistance;
        if (state.switchMainClosed) {
          Itotal = Math.abs(U) / R;
          Rtotal = R;
          bulb1_I = Itotal;
          bulb1_U = Itotal * state.bulb1Resistance;
          bulb1_P = bulb1_U * bulb1_I;

          bulb2_I = Itotal;
          bulb2_U = Itotal * state.bulb2Resistance;
          bulb2_P = bulb2_U * bulb2_I;
        } else {
          Itotal = 0;
          Rtotal = Infinity;
        }
        const Vpos = state.batteryReversed ? 0 : state.batteryVoltage;
        const Vneg = state.batteryReversed ? state.batteryVoltage : 0;
        nodes.bat_pos = { x: 120, y: 270, V: Vpos, label: 'Cực (+)' };
        nodes.bat_neg = { x: 120, y: 130, V: Vneg, label: 'Cực (-)' };
        nodes.sw_out = { x: 260, y: 130, V: state.switchMainClosed ? Vneg : 0, label: 'Sau công tắc' };
        nodes.mid = { x: 410, y: 130, V: state.switchMainClosed ? (state.batteryReversed ? Vpos + bulb2_U : Vpos - bulb2_U) : 0, label: 'Giữa 2 đèn' };
        nodes.bulb2_out = { x: 550, y: 130, V: state.switchMainClosed ? (state.batteryReversed ? Vpos : Vpos) : Vpos, label: 'Đầu đèn 2' };
        break;
      }

      case 'parallel': {
        const R1 = state.bulb1Resistance;
        const R2 = state.bulb2Resistance;
        const I1 = state.switchMainClosed ? Math.abs(U) / R1 : 0;
        const I2 = state.switchBranch2Closed ? Math.abs(U) / R2 : 0;
        Itotal = I1 + I2;
        Rtotal = Itotal > 0 ? Math.abs(U) / Itotal : Infinity;

        bulb1_I = I1;
        bulb1_U = I1 > 0 ? Math.abs(U) : 0;
        bulb1_P = bulb1_U * bulb1_I;

        bulb2_I = I2;
        bulb2_U = I2 > 0 ? Math.abs(U) : 0;
        bulb2_P = bulb2_U * bulb2_I;

        const Vpos = state.batteryReversed ? 0 : state.batteryVoltage;
        const Vneg = state.batteryReversed ? state.batteryVoltage : 0;
        nodes.bat_pos = { x: 120, y: 310, V: Vpos, label: 'Cực (+)' };
        nodes.bat_neg = { x: 120, y: 100, V: Vneg, label: 'Cực (-)' };
        nodes.bus_top = { x: 310, y: 100, V: Vneg, label: 'Dây âm chung' };
        nodes.bus_bot = { x: 310, y: 310, V: Vpos, label: 'Dây dương chung' };
        nodes.b1_top = { x: 450, y: 140, V: state.switchMainClosed ? Vneg : 0, label: 'Đèn 1 (trên)' };
        nodes.b2_top = { x: 450, y: 270, V: state.switchBranch2Closed ? Vneg : 0, label: 'Đèn 2 (dưới)' };
        break;
      }

      case 'ohm': {
        const R = state.resistorResistance + state.rheostatResistance;
        if (state.switchMainClosed) {
          Itotal = Math.abs(U) / R;
          Rtotal = R;
          res_I = Itotal;
          res_U = Itotal * state.resistorResistance;
        } else {
          Itotal = 0;
          Rtotal = Infinity;
        }
        const Vpos = state.batteryReversed ? 0 : state.batteryVoltage;
        const Vneg = state.batteryReversed ? state.batteryVoltage : 0;
        nodes.bat_pos = { x: 120, y: 270, V: Vpos, label: 'Cực (+)' };
        nodes.bat_neg = { x: 120, y: 130, V: Vneg, label: 'Cực (-)' };
        nodes.sw_out = { x: 250, y: 130, V: state.switchMainClosed ? Vneg : 0, label: 'Sau khóa K' };
        nodes.rheo_out = { x: 380, y: 130, V: state.switchMainClosed ? (Vneg + (state.batteryReversed ? -1 : 1) * Itotal * state.rheostatResistance) : 0, label: 'Sau biến trở' };
        nodes.res_out = { x: 530, y: 130, V: Vpos, label: 'Sau điện trở R' };
        break;
      }

      case 'short': {
        if (state.switchMainClosed) {
          isShort = true;
          Itotal = 25.0; // Dòng cực lớn khi ngắn mạch
          Rtotal = 0.05;
        } else {
          Itotal = 0;
          Rtotal = Infinity;
        }
        nodes.bat_pos = { x: 160, y: 260, V: state.batteryReversed ? 0 : state.batteryVoltage, label: 'Cực (+)' };
        nodes.bat_neg = { x: 160, y: 140, V: state.batteryReversed ? state.batteryVoltage : 0, label: 'Cực (-)' };
        break;
      }
    }

    return {
      U, Itotal, Rtotal,
      bulb1_I, bulb1_U, bulb1_P,
      bulb2_I, bulb2_U, bulb2_P,
      res_I, res_U,
      isShort,
      nodes
    };
  }

  /* ─────────────────────────────────────────────────────────────
     4. TÍNH TOÁN ĐIỆN THẾ ĐO BẰNG VÔN KẾ
  ───────────────────────────────────────────────────────────── */
  function getVoltmeterReading(calc) {
    const rRed = state.probeRed;
    const rBlack = state.probeBlack;

    let vRed = null;
    let vBlack = null;

    // Tìm xem mỗi que đo có đang cắm gần nút nào không (bán kính 35px)
    const SNAP_RADIUS = 35;
    for (const key in calc.nodes) {
      const node = calc.nodes[key];
      const dRed = Math.hypot(rRed.x - node.x, rRed.y - node.y);
      if (dRed < SNAP_RADIUS && vRed === null) {
        vRed = node.V;
      }
      const dBlack = Math.hypot(rBlack.x - node.x, rBlack.y - node.y);
      if (dBlack < SNAP_RADIUS && vBlack === null) {
        vBlack = node.V;
      }
    }

    if (vRed !== null && vBlack !== null) {
      return (vRed - vBlack);
    }
    return null; // Chưa cắm đủ 2 que đo vào mạch
  }

  /* ─────────────────────────────────────────────────────────────
     5. RENDER GIAO DIỆN HTML (TOOLBOX & CONTROLS PHET)
  ───────────────────────────────────────────────────────────── */
  function buildCircuitUI() {
    const container = document.getElementById('experiment-circuit');
    if (!container) return;

    container.innerHTML = `
      <div class="phet-lab-wrapper">
        <!-- Top Toolbar kiểu PhET -->
        <div class="phet-toolbar">
          <!-- Nhóm chọn mạch Preset -->
          <div class="phet-toolgroup phet-presets-nav">
            <span class="phet-tool-label">📋 Mạch Thí Nghiệm:</span>
            <div class="phet-btn-tabs">
              ${Object.entries(PRESETS).map(([key, p]) => `
                <button class="phet-tab-btn ${key === state.preset ? 'active' : ''}" 
                        onclick="circuitSelectPreset('${key}')" title="${p.desc}">
                  ${p.badge}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Nhóm Tùy Chọn Hiển Thị (Display options) -->
          <div class="phet-toolgroup">
            <span class="phet-tool-label">👁️ Chế Độ:</span>
            <div class="phet-btn-group">
              <button class="phet-opt-btn ${state.viewMode === 'lifelike' ? 'active' : ''}" 
                      onclick="circuitSetViewMode('lifelike')" title="Hình ảnh thực tế như phòng lab">
                🖼️ Trực Quan
              </button>
              <button class="phet-opt-btn ${state.viewMode === 'schematic' ? 'active' : ''}" 
                      onclick="circuitSetViewMode('schematic')" title="Sơ đồ ký hiệu chuẩn SGK Vật Lý">
                📐 Sơ Đồ
              </button>
            </div>
          </div>

          <!-- Nhóm Dòng Điện (Current animation) -->
          <div class="phet-toolgroup">
            <span class="phet-tool-label">⚡ Dòng Điện:</span>
            <div class="phet-btn-group">
              <button class="phet-opt-btn ${state.currentDisplay === 'electrons' ? 'active' : ''}" 
                      onclick="circuitSetCurrentDisplay('electrons')" title="Hạt electron (-) di chuyển từ cực âm sang dương">
                🔵 Electron (-)
              </button>
              <button class="phet-opt-btn ${state.currentDisplay === 'conventional' ? 'active' : ''}" 
                      onclick="circuitSetCurrentDisplay('conventional')" title="Dòng quy ước (->) từ cực dương sang âm">
                🔴 Quy Ước (→)
              </button>
              <button class="phet-opt-btn ${state.currentDisplay === 'none' ? 'active' : ''}" 
                      onclick="circuitSetCurrentDisplay('none')" title="Tắt hiển thị dòng">
                ⚪ Tắt
              </button>
            </div>
          </div>

          <!-- Dụng cụ đo di động -->
          <div class="phet-toolgroup">
            <span class="phet-tool-label">📟 Dụng Cụ:</span>
            <div class="phet-btn-group">
              <button class="phet-opt-btn ${state.showVoltmeter ? 'active' : ''}" 
                      onclick="circuitToggleVoltmeter()" title="Bật/Tắt Vôn kế có 2 que đo di động">
                📟 Vôn Kế
              </button>
              <button class="phet-opt-btn ${state.showAmmeter ? 'active' : ''}" 
                      onclick="circuitToggleAmmeter()" title="Bật/Tắt đồng hồ Ampe kế">
                ⚡ Ampe Kế
              </button>
            </div>
          </div>
        </div>

        <!-- Khu vực chính: Canvas bàn thí nghiệm + Inspector bên cạnh -->
        <div class="phet-workspace">
          <!-- Canvas bàn thí nghiệm PhET -->
          <div class="phet-canvas-container" id="phet-canvas-wrap">
            <canvas id="circuit-canvas" width="760" height="420"></canvas>
            
            <!-- Hint nổi tương tác -->
            <div class="phet-canvas-hint">
              <span>💡 Mẹo: Nhấp trực tiếp vào <strong>Công tắc</strong> để đóng/ngắt mạch. Kéo 2 <strong>Que đo Vôn kế</strong> (Đỏ / Đen) để đo điện thế!</span>
            </div>
          </div>

          <!-- Bảng Điều Khiển Thông Số Linh Kiện (Component Inspector) -->
          <div class="phet-inspector-panel">
            <div class="phet-panel-header">
              <h3>⚙️ Bảng Điều Khiển &amp; Tham Số</h3>
            </div>

            <!-- Công tắc nhanh -->
            <div class="phet-control-card">
              <div class="phet-card-title">🔌 Trạng Thái Công Tắc</div>
              <div class="phet-switches-row">
                <button class="phet-switch-toggle ${state.switchMainClosed ? 'closed' : 'open'}" 
                        onclick="circuitToggleSwitch('main')">
                  ${state.switchMainClosed ? '🟢 Khóa K: ĐANG ĐÓNG' : '🔴 Khóa K: ĐANG NGẮT'}
                </button>
                <div id="branch-switch-wrap" style="display: ${state.preset === 'parallel' ? 'block' : 'none'}; margin-top:0.5rem;">
                  <button class="phet-switch-toggle ${state.switchBranch2Closed ? 'closed' : 'open'}" 
                          onclick="circuitToggleSwitch('branch2')">
                    ${state.switchBranch2Closed ? '🟢 Khóa K₂ (Nhánh 2): ĐÓNG' : '🔴 Khóa K₂ (Nhánh 2): NGẮT'}
                  </button>
                </div>
              </div>
            </div>

            <!-- Nguồn điện (Pin) -->
            <div class="phet-control-card">
              <div class="phet-card-title">
                <span>🔋 Nguồn Điện (Pin DC)</span>
                <button class="phet-mini-btn" onclick="circuitReverseBattery()" title="Đảo chiều cực (+/-) của pin">
                  🔄 Đảo Cực
                </button>
              </div>
              <div class="slider-label">
                <span>Hiệu điện thế U:</span>
                <strong id="inspector-voltage-text">${state.batteryVoltage.toFixed(1)} V</strong>
              </div>
              <input type="range" class="phet-slider" min="0" max="36" step="0.5" value="${state.batteryVoltage}"
                     oninput="circuitUpdateVoltage(this.value)">
            </div>

            <!-- Tải (Bóng đèn 1 / Điện trở) -->
            <div class="phet-control-card" id="inspector-load-card">
              <!-- Render động theo preset -->
            </div>

            <!-- Số đo đo lường tức thời (Live Measurement HUD) -->
            <div class="phet-meters-hud">
              <div class="phet-meter-box ammeter-box">
                <span class="phet-meter-tag">AMPE KẾ (I)</span>
                <span class="phet-meter-val" id="hud-ammeter">0.00 A</span>
              </div>
              <div class="phet-meter-box voltmeter-box">
                <span class="phet-meter-tag">VÔN KẾ QUE ĐO (U)</span>
                <span class="phet-meter-val" id="hud-voltmeter">--.-- V</span>
              </div>
            </div>

            <!-- Thông tin lý thuyết tóm tắt -->
            <div class="phet-theory-box">
              <div class="phet-theory-title" id="phet-theory-title">📖 Kiến Thức Cốt Lõi</div>
              <p id="phet-theory-desc" class="phet-theory-text"></p>
            </div>

            <!-- Nút điều khiển hoạt ảnh / Reset -->
            <div class="phet-footer-actions">
              <button class="lab-btn lab-btn-secondary" onclick="circuitResetProbes()" title="Đưa 2 que đo về vị trí ban đầu">
                📍 Đặt Lại Que Đo
              </button>
              <button class="lab-btn lab-btn-primary" onclick="circuitResetDefaults()">
                🔄 Khôi Phục Mặc Định
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    canvas = document.getElementById('circuit-canvas');
    ctx = canvas.getContext('2d');

    setupCanvasEvents();
    renderInspectorLoadSliders();
    updateUIInfo();
    resizeCanvasResponsive();
    window.addEventListener('resize', resizeCanvasResponsive);

    if (animFrameId) cancelAnimationFrame(animFrameId);
    animFrameId = requestAnimationFrame(renderLoop);
  }

  function resizeCanvasResponsive() {
    const wrap = document.getElementById('phet-canvas-wrap');
    if (!wrap || !canvas) return;
    const w = wrap.clientWidth;
    if (w < 760) {
      canvas.style.width = w + 'px';
      canvas.style.height = (w * 420 / 760) + 'px';
    } else {
      canvas.style.width = '760px';
      canvas.style.height = '420px';
    }
  }

  function renderInspectorLoadSliders() {
    const card = document.getElementById('inspector-load-card');
    if (!card) return;

    if (state.preset === 'basic') {
      card.innerHTML = `
        <div class="phet-card-title">💡 Bóng Đèn Sợi Đốt</div>
        <div class="slider-label">
          <span>Điện trở bóng đèn R:</span>
          <strong id="inspector-bulb1-text">${state.bulb1Resistance.toFixed(1)} Ω</strong>
        </div>
        <input type="range" class="phet-slider" min="1" max="50" step="0.5" value="${state.bulb1Resistance}"
               oninput="circuitUpdateBulb1(this.value)">
      `;
    } else if (state.preset === 'series' || state.preset === 'parallel') {
      card.innerHTML = `
        <div class="phet-card-title">💡 Hai Bóng Đèn Độc Lập</div>
        <div class="slider-label">
          <span>Điện trở Đèn 1 (R₁):</span>
          <strong id="inspector-bulb1-text">${state.bulb1Resistance.toFixed(1)} Ω</strong>
        </div>
        <input type="range" class="phet-slider" min="1" max="50" step="0.5" value="${state.bulb1Resistance}"
               oninput="circuitUpdateBulb1(this.value)">
        <div class="slider-label" style="margin-top:0.6rem;">
          <span>Điện trở Đèn 2 (R₂):</span>
          <strong id="inspector-bulb2-text">${state.bulb2Resistance.toFixed(1)} Ω</strong>
        </div>
        <input type="range" class="phet-slider" min="1" max="50" step="0.5" value="${state.bulb2Resistance}"
               oninput="circuitUpdateBulb2(this.value)">
      `;
    } else if (state.preset === 'ohm') {
      card.innerHTML = `
        <div class="phet-card-title">🎛️ Điện Trở &amp; Biến Trở</div>
        <div class="slider-label">
          <span>Điện trở cần đo (R):</span>
          <strong id="inspector-res-text">${state.resistorResistance.toFixed(1)} Ω</strong>
        </div>
        <input type="range" class="phet-slider" min="1" max="50" step="1" value="${state.resistorResistance}"
               oninput="circuitUpdateResistor(this.value)">
        <div class="slider-label" style="margin-top:0.6rem;">
          <span>Biến trở con chạy (R_b):</span>
          <strong id="inspector-rheo-text">${state.rheostatResistance.toFixed(1)} Ω</strong>
        </div>
        <input type="range" class="phet-slider" min="0" max="50" step="1" value="${state.rheostatResistance}"
               oninput="circuitUpdateRheostat(this.value)">
      `;
    } else if (state.preset === 'short') {
      card.innerHTML = `
        <div class="phet-card-title" style="color:var(--accent);">⚠️ Dây Nối Tắt (R ≈ 0 Ω)</div>
        <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.45;">
          Dây dẫn đồng nguyên chất nối trực tiếp cực âm với cực dương. Hãy đóng khóa K để xem dòng điện cực đại và cảnh báo bốc cháy từ nguồn điện!
        </p>
      `;
    }
  }

  function updateUIInfo() {
    const curP = PRESETS[state.preset];
    const pTitle = document.getElementById('phet-theory-title');
    const pDesc = document.getElementById('phet-theory-desc');
    if (pTitle) pTitle.textContent = '📖 ' + curP.name;
    if (pDesc) pDesc.innerHTML = `<strong>Mô tả:</strong> ${curP.desc}<br><br><strong>Nguyên lý:</strong> ${curP.theory}`;
  }

  /* ─────────────────────────────────────────────────────────────
     6. SỰ KIỆN CHUỘT & CHẠM (DRAG QUE ĐO VÔN KẾ + CLICK CÔNG TẮC)
  ───────────────────────────────────────────────────────────── */
  function getCanvasCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  function setupCanvasEvents() {
    // Mouse down / Touch start
    const handleStart = (e) => {
      const pos = getCanvasCoords(e);

      // 1. Kiểm tra bấm vào que đo Đỏ
      const dRed = Math.hypot(pos.x - state.probeRed.x, pos.y - state.probeRed.y);
      if (dRed < 28) {
        activeDragTarget = 'probeRed';
        dragOffset = { x: pos.x - state.probeRed.x, y: pos.y - state.probeRed.y };
        if (e.cancelable) e.preventDefault();
        return;
      }

      // 2. Kiểm tra bấm vào que đo Đen
      const dBlack = Math.hypot(pos.x - state.probeBlack.x, pos.y - state.probeBlack.y);
      if (dBlack < 28) {
        activeDragTarget = 'probeBlack';
        dragOffset = { x: pos.x - state.probeBlack.x, y: pos.y - state.probeBlack.y };
        if (e.cancelable) e.preventDefault();
        return;
      }

      // 3. Kiểm tra nhấp vào Công tắc chính trên canvas
      const swArea = getSwitchClickBounds('main');
      if (swArea && pos.x >= swArea.x1 && pos.x <= swArea.x2 && pos.y >= swArea.y1 && pos.y <= swArea.y2) {
        window.circuitToggleSwitch('main');
        if (e.cancelable) e.preventDefault();
        return;
      }

      // 4. Kiểm tra nhấp vào Công tắc nhánh 2 (ở mạch song song)
      if (state.preset === 'parallel') {
        const sw2Area = getSwitchClickBounds('branch2');
        if (sw2Area && pos.x >= sw2Area.x1 && pos.x <= sw2Area.x2 && pos.y >= sw2Area.y1 && pos.y <= sw2Area.y2) {
          window.circuitToggleSwitch('branch2');
          if (e.cancelable) e.preventDefault();
          return;
        }
      }

      // 5. Kiểm tra nhấp vào Pin để đảo chiều hoặc mở thanh trượt
      const batArea = getBatteryClickBounds();
      if (batArea && pos.x >= batArea.x1 && pos.x <= batArea.x2 && pos.y >= batArea.y1 && pos.y <= batArea.y2) {
        window.circuitReverseBattery();
        if (e.cancelable) e.preventDefault();
        return;
      }
    };

    const handleMove = (e) => {
      const pos = getCanvasCoords(e);
      if (activeDragTarget === 'probeRed') {
        state.probeRed.x = Math.max(20, Math.min(canvas.width - 20, pos.x - dragOffset.x));
        state.probeRed.y = Math.max(20, Math.min(canvas.height - 20, pos.y - dragOffset.y));
        if (e.cancelable) e.preventDefault();
      } else if (activeDragTarget === 'probeBlack') {
        state.probeBlack.x = Math.max(20, Math.min(canvas.width - 20, pos.x - dragOffset.x));
        state.probeBlack.y = Math.max(20, Math.min(canvas.height - 20, pos.y - dragOffset.y));
        if (e.cancelable) e.preventDefault();
      } else {
        // Cập nhật con trỏ chuột hover
        const dRed = Math.hypot(pos.x - state.probeRed.x, pos.y - state.probeRed.y);
        const dBlack = Math.hypot(pos.x - state.probeBlack.x, pos.y - state.probeBlack.y);
        const sw = getSwitchClickBounds('main');
        const inSw = sw && pos.x >= sw.x1 && pos.x <= sw.x2 && pos.y >= sw.y1 && pos.y <= sw.y2;
        if (dRed < 28 || dBlack < 28) {
          canvas.style.cursor = 'grab';
        } else if (inSw) {
          canvas.style.cursor = 'pointer';
        } else {
          canvas.style.cursor = 'default';
        }
      }
    };

    const handleEnd = () => {
      if (activeDragTarget) {
        activeDragTarget = null;
        canvas.style.cursor = 'default';
      }
    };

    canvas.addEventListener('mousedown', handleStart);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);

    canvas.addEventListener('touchstart', handleStart, { passive: false });
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);
  }

  function getSwitchClickBounds(swName) {
    if (swName === 'main') {
      if (state.preset === 'parallel') return { x1: 270, y1: 110, x2: 370, y2: 170 };
      return { x1: 240, y1: 110, x2: 360, y2: 170 };
    }
    if (swName === 'branch2') {
      return { x1: 270, y1: 240, x2: 370, y2: 300 };
    }
    return null;
  }

  function getBatteryClickBounds() {
    return { x1: 80, y1: 160, x2: 180, y2: 240 };
  }

  /* ─────────────────────────────────────────────────────────────
     7. VÒNG LẶP VẼ CANVAS HOÀN HẢO THEO PHONG CÁCH PhET
  ───────────────────────────────────────────────────────────── */
  function renderLoop(timestamp) {
    if (!state.lastTimestamp) state.lastTimestamp = timestamp;
    const dt = (timestamp - state.lastTimestamp) / 1000;
    state.lastTimestamp = timestamp;

    const calc = solveCircuit();

    // Tốc độ di chuyển hạt theo dòng điện I
    if (!state.isPaused && calc.Itotal > 0) {
      const speed = Math.min(calc.Itotal * 60, 250); // pixels/sec
      state.animOffset = (state.animOffset + speed * dt) % 1000;
    }

    // Hiệu ứng tia lửa khi đoản mạch
    if (calc.isShort) {
      updateSparks();
    } else {
      state.sparkParticles = [];
    }

    drawPhETScene(calc);

    // Cập nhật giá trị hiển thị trên HUD
    updateHUD(calc);

    animFrameId = requestAnimationFrame(renderLoop);
  }

  function updateHUD(calc) {
    const ammeterEl = document.getElementById('hud-ammeter');
    if (ammeterEl) {
      ammeterEl.textContent = `${calc.Itotal.toFixed(2)} A`;
    }

    const voltEl = document.getElementById('hud-voltmeter');
    if (voltEl) {
      const reading = getVoltmeterReading(calc);
      if (reading !== null) {
        voltEl.textContent = `${reading >= 0 ? '+' : ''}${reading.toFixed(2)} V`;
        voltEl.style.color = '#22c55e';
      } else {
        voltEl.textContent = '--.-- V';
        voltEl.style.color = 'var(--text-muted)';
      }
    }
  }

  function updateSparks() {
    // Sinh thêm tia lửa ở vùng đoản mạch
    if (Math.random() < 0.6) {
      state.sparkParticles.push({
        x: 130 + (Math.random() - 0.5) * 40,
        y: 200 + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 120,
        vy: (Math.random() - 0.5) * 120 - 40,
        life: 0.3 + Math.random() * 0.3,
        maxLife: 0.5,
        color: Math.random() > 0.3 ? '#f59e0b' : '#ef4444'
      });
    }
    // Cập nhật hạt
    for (let i = state.sparkParticles.length - 1; i >= 0; i--) {
      const p = state.sparkParticles[i];
      p.x += p.vx * 0.016;
      p.y += p.vy * 0.016;
      p.life -= 0.016;
      if (p.life <= 0) state.sparkParticles.splice(i, 1);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     8. HỆ THỐNG VẼ ĐỒ HỌA PHET TRÊN CANVAS
  ───────────────────────────────────────────────────────────── */
  function drawPhETScene(calc) {
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    // 1. Nền canvas kiểu PhET: xanh nhạt với lưới ô vuông
    drawPhETBackground(W, H, isDark);

    // 2. Vẽ đường dây dẫn & dòng electron theo từng preset
    drawWiresAndCurrent(W, H, calc, isDark);

    // 3. Vẽ các linh kiện điện tử (Lifelike hoặc Schematic)
    drawComponents(calc, isDark);

    // 4. Vẽ que đo & Vôn kế di động
    if (state.showVoltmeter) {
      drawVoltmeter(calc, isDark);
    }

    // 5. Tia lửa điện nếu đoản mạch
    if (calc.isShort) {
      drawSparks();
    }
  }

  function drawPhETBackground(W, H, isDark) {
    // Nền
    ctx.fillStyle = isDark ? '#0c1a2e' : '#eaf4fa';
    ctx.fillRect(0, 0, W, H);

    // Lưới ô vuông mờ phong cách PhET
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,100,180,0.06)';
    ctx.lineWidth = 1;
    const gridSize = 20;
    ctx.beginPath();
    for (let x = 0; x <= W; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
    }
    for (let y = 0; y <= H; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
    }
    ctx.stroke();
  }

  /* ─────────────────────────────────────────────────────────────
     9. ĐƯỜNG DÂY DẪN & DÒNG CHUYỂN DỜI CỦA HẠT ĐIỆN TÍCH
  ───────────────────────────────────────────────────────────── */
  function drawWiresAndCurrent(W, H, calc, isDark) {
    const paths = getCircuitPaths();
    const wireColor = isDark ? '#4a6572' : '#2b5876';
    const wireInner = isDark ? '#607d8b' : '#3d84a8';

    // Vẽ từng đoạn dây dẫn đồng bọc vỏ
    paths.forEach(p => {
      // Viền dây
      ctx.strokeStyle = wireColor;
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(p.points[0].x, p.points[0].y);
      for (let i = 1; i < p.points.length; i++) {
        ctx.lineTo(p.points[i].x, p.points[i].y);
      }
      ctx.stroke();

      // Ruột dây
      ctx.strokeStyle = wireInner;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(p.points[0].x, p.points[0].y);
      for (let i = 1; i < p.points.length; i++) {
        ctx.lineTo(p.points[i].x, p.points[i].y);
      }
      ctx.stroke();
    });

    // Vẽ các chốt nối (Junctions - vòng tròn vàng/xám)
    paths.forEach(p => {
      p.points.forEach(pt => {
        drawJunctionPin(pt.x, pt.y, isDark);
      });
    });

    // Vẽ các hạt điện tích (Electrons hoặc Conventional current)
    if (state.currentDisplay !== 'none' && paths.length > 0) {
      drawChargesAlongPaths(paths, calc, isDark);
    }
  }

  function drawJunctionPin(x, y, isDark) {
    ctx.fillStyle = '#f59e0b';
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  function getCircuitPaths() {
    switch (state.preset) {
      case 'basic': {
        return [{
          points: [
            { x: 130, y: 140 }, // Cực âm pin
            { x: 280, y: 140 }, // Tới công tắc
            { x: 340, y: 140 }, // Qua công tắc
            { x: 500, y: 140 }, // Tới bóng đèn
            { x: 500, y: 260 }, // Xuống đuôi đèn
            { x: 130, y: 260 }, // Về cực dương pin
            { x: 130, y: 140 }  // Khép kín
          ],
          hasCurrent: state.switchMainClosed
        }];
      }

      case 'series': {
        return [{
          points: [
            { x: 120, y: 130 },
            { x: 260, y: 130 }, // Khóa K
            { x: 320, y: 130 },
            { x: 420, y: 130 }, // Đèn 1
            { x: 550, y: 130 }, // Đèn 2
            { x: 550, y: 270 },
            { x: 120, y: 270 },
            { x: 120, y: 130 }
          ],
          hasCurrent: state.switchMainClosed
        }];
      }

      case 'parallel': {
        return [
          // Nhánh 1 (Đèn 1 trên)
          {
            points: [
              { x: 120, y: 100 },
              { x: 300, y: 100 },
              { x: 300, y: 140 },
              { x: 340, y: 140 }, // Khóa K1
              { x: 480, y: 140 }, // Đèn 1
              { x: 560, y: 140 },
              { x: 560, y: 310 },
              { x: 120, y: 310 },
              { x: 120, y: 100 }
            ],
            hasCurrent: state.switchMainClosed
          },
          // Nhánh 2 (Đèn 2 dưới)
          {
            points: [
              { x: 300, y: 100 },
              { x: 300, y: 270 },
              { x: 340, y: 270 }, // Khóa K2
              { x: 480, y: 270 }, // Đèn 2
              { x: 560, y: 270 }
            ],
            hasCurrent: state.switchBranch2Closed
          }
        ];
      }

      case 'ohm': {
        return [{
          points: [
            { x: 120, y: 130 },
            { x: 240, y: 130 }, // Khóa K
            { x: 290, y: 130 },
            { x: 380, y: 130 }, // Biến trở
            { x: 500, y: 130 }, // Điện trở R
            { x: 590, y: 130 }, // Ampe kế
            { x: 590, y: 270 },
            { x: 120, y: 270 },
            { x: 120, y: 130 }
          ],
          hasCurrent: state.switchMainClosed
        }];
      }

      case 'short': {
        return [{
          points: [
            { x: 140, y: 140 },
            { x: 300, y: 140 },
            { x: 360, y: 140 },
            { x: 460, y: 140 },
            { x: 460, y: 260 },
            { x: 140, y: 260 },
            { x: 140, y: 140 }
          ],
          hasCurrent: state.switchMainClosed
        }];
      }

      default:
        return [];
    }
  }

  function drawChargesAlongPaths(paths, calc, isDark) {
    const isElectrons = state.currentDisplay === 'electrons';
    const spacing = 28; // Khoảng cách giữa các hạt

    paths.forEach(pathObj => {
      const pts = pathObj.points;
      const totalLen = getPathLength(pts);
      const numCharges = Math.floor(totalLen / spacing);

      // Chiều chuyển động:
      // Electron chạy ngược chiều kim đồng hồ hoặc cùng chiều kim đồng hồ tùy cực
      const dir = (isElectrons ? 1 : -1) * (state.batteryReversed ? -1 : 1);

      for (let i = 0; i < numCharges; i++) {
        let dist = (i * spacing + (pathObj.hasCurrent ? state.animOffset * dir : 0)) % totalLen;
        if (dist < 0) dist += totalLen;

        const pos = getPointAtDistance(pts, dist);
        if (!pos) continue;

        if (isElectrons) {
          // HẠT ELECTRON PHONG CÁCH PHET: Quả cầu xanh dương có dấu '-'
          ctx.fillStyle = '#0284c7';
          ctx.strokeStyle = '#bae6fd';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 6.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Ký hiệu '-'
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('–', pos.x, pos.y - 0.5);
        } else {
          // DÒNG QUY ƯỚC: Mũi tên đỏ phong cách PhET
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });
  }

  function getPathLength(pts) {
    let len = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      len += Math.hypot(pts[i+1].x - pts[i].x, pts[i+1].y - pts[i].y);
    }
    return len;
  }

  function getPointAtDistance(pts, targetDist) {
    let currentDist = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const segLen = Math.hypot(pts[i+1].x - pts[i].x, pts[i+1].y - pts[i].y);
      if (currentDist + segLen >= targetDist) {
        const t = (targetDist - currentDist) / segLen;
        return {
          x: pts[i].x + (pts[i+1].x - pts[i].x) * t,
          y: pts[i].y + (pts[i+1].y - pts[i].y) * t
        };
      }
      currentDist += segLen;
    }
    return pts[pts.length - 1];
  }

  /* ─────────────────────────────────────────────────────────────
     10. VẼ LINH KIỆN ĐIỆN TỬ (LIFELIKE & SCHEMATIC)
  ───────────────────────────────────────────────────────────── */
  function drawComponents(calc, isDark) {
    const isLifelike = state.viewMode === 'lifelike';

    // 1. PIN (BATTERY)
    if (state.preset === 'basic' || state.preset === 'series' || state.preset === 'parallel' || state.preset === 'ohm' || state.preset === 'short') {
      const batY = (state.preset === 'parallel') ? 205 : 200;
      const batX = (state.preset === 'parallel') ? 120 : (state.preset === 'short' ? 140 : 125);
      if (isLifelike) {
        drawLifelikeBattery(batX, batY, state.batteryVoltage, state.batteryReversed, calc.isShort);
      } else {
        drawSchematicBattery(batX, batY, state.batteryVoltage, state.batteryReversed, isDark);
      }
    }

    // 2. CÔNG TẮC (SWITCH)
    if (state.preset === 'basic') {
      if (isLifelike) drawLifelikeSwitch(310, 140, state.switchMainClosed, 'K');
      else drawSchematicSwitch(310, 140, state.switchMainClosed, 'K', isDark);
    } else if (state.preset === 'series' || state.preset === 'ohm' || state.preset === 'short') {
      const swX = state.preset === 'ohm' ? 265 : (state.preset === 'short' ? 330 : 290);
      if (isLifelike) drawLifelikeSwitch(swX, 130, state.switchMainClosed, 'K');
      else drawSchematicSwitch(swX, 130, state.switchMainClosed, 'K', isDark);
    } else if (state.preset === 'parallel') {
      // 2 công tắc nhánh
      if (isLifelike) {
        drawLifelikeSwitch(360, 140, state.switchMainClosed, 'K₁');
        drawLifelikeSwitch(360, 270, state.switchBranch2Closed, 'K₂');
      } else {
        drawSchematicSwitch(360, 140, state.switchMainClosed, 'K₁', isDark);
        drawSchematicSwitch(360, 270, state.switchBranch2Closed, 'K₂', isDark);
      }
    }

    // 3. BÓNG ĐÈN (LIGHT BULB)
    if (state.preset === 'basic') {
      if (isLifelike) drawLifelikeBulb(500, 200, calc.bulb1_P, calc.bulb1_I > 0, state.bulb1Resistance);
      else drawSchematicBulb(500, 200, calc.bulb1_I > 0, isDark);
    } else if (state.preset === 'series') {
      // 2 bóng đèn
      if (isLifelike) {
        drawLifelikeBulb(420, 130, calc.bulb1_P, calc.bulb1_I > 0, state.bulb1Resistance);
        drawLifelikeBulb(550, 200, calc.bulb2_P, calc.bulb2_I > 0, state.bulb2Resistance);
      } else {
        drawSchematicBulb(420, 130, calc.bulb1_I > 0, isDark);
        drawSchematicBulb(550, 200, calc.bulb2_I > 0, isDark);
      }
    } else if (state.preset === 'parallel') {
      if (isLifelike) {
        drawLifelikeBulb(480, 140, calc.bulb1_P, calc.bulb1_I > 0, state.bulb1Resistance);
        drawLifelikeBulb(480, 270, calc.bulb2_P, calc.bulb2_I > 0, state.bulb2Resistance);
      } else {
        drawSchematicBulb(480, 140, calc.bulb1_I > 0, isDark);
        drawSchematicBulb(480, 270, calc.bulb2_I > 0, isDark);
      }
    }

    // 4. ĐIỆN TRỞ & BIẾN TRỞ TRONG MẠCH OHM
    if (state.preset === 'ohm') {
      // Biến trở
      if (isLifelike) drawLifelikeRheostat(380, 130, state.rheostatResistance);
      else drawSchematicResistor(380, 130, state.rheostatResistance, 'R_b', isDark);

      // Điện trở R
      if (isLifelike) drawLifelikeResistor(500, 130, state.resistorResistance);
      else drawSchematicResistor(500, 130, state.resistorResistance, 'R', isDark);

      // Ampe kế mắc nối tiếp
      drawInlineAmmeter(590, 200, calc.Itotal, isDark);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     11. HÌNH VẼ CHI TIẾT LIFELIKE (PIN, BÓNG ĐÈN, CÔNG TẮC...)
  ───────────────────────────────────────────────────────────── */

  // Vẽ Viên Pin Thật Kiểu PhET
  function drawLifelikeBattery(x, y, voltage, isReversed, isOverheating) {
    ctx.save();
    ctx.translate(x, y);

    const h = 76;
    const w = 42;

    // Bóng đổ
    ctx.shadowColor = 'rgba(0,0,0,0.25)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 4;

    // Thân pin chính (hình chữ nhật bo góc)
    const bodyGrad = ctx.createLinearGradient(-w/2, 0, w/2, 0);
    if (isOverheating) {
      bodyGrad.addColorStop(0, '#7f1d1d');
      bodyGrad.addColorStop(0.5, '#ef4444');
      bodyGrad.addColorStop(1, '#991b1b');
    } else {
      bodyGrad.addColorStop(0, '#b45309');
      bodyGrad.addColorStop(0.4, '#f59e0b');
      bodyGrad.addColorStop(1, '#92400e');
    }

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    roundRect(ctx, -w/2, -h/2, w, h, 6);
    ctx.fill();

    ctx.shadowColor = 'transparent'; // Tắt bóng

    // Phần màu đen của pin (cực âm)
    const negHeight = h * 0.35;
    const topIsNeg = !isReversed;
    const negY = topIsNeg ? -h/2 : h/2 - negHeight;
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    roundRect(ctx, -w/2, negY, w, negHeight, 4);
    ctx.fill();

    // Núm cực dương (kim loại nhô ra)
    const capY = topIsNeg ? h/2 : -h/2 - 8;
    const capGrad = ctx.createLinearGradient(-8, 0, 8, 0);
    capGrad.addColorStop(0, '#94a3b8');
    capGrad.addColorStop(0.5, '#e2e8f0');
    capGrad.addColorStop(1, '#64748b');
    ctx.fillStyle = capGrad;
    ctx.beginPath();
    roundRect(ctx, -9, capY, 18, 8, 3);
    ctx.fill();

    // Nhãn cực và điện áp
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const posLabelY = topIsNeg ? h/4 : -h/4;
    const negLabelY = topIsNeg ? -h/3 : h/3;
    ctx.fillText('+', 0, posLabelY);
    ctx.fillText('–', 0, negLabelY);

    ctx.font = 'bold 10px Be Vietnam Pro, sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText(`${voltage.toFixed(1)}V`, 0, 0);

    ctx.restore();
  }

  // Vẽ Bóng Đèn Sợi Đốt Thật Kiểu PhET (Có tia sáng vàng hào quang)
  function drawLifelikeBulb(x, y, power, isOn, resistance) {
    ctx.save();
    ctx.translate(x, y);

    // 1. TIA SÁNG HÀO QUANG (LIGHT RAYS) KHI ĐÈN SÁNG
    if (isOn && power > 0.05) {
      const rayIntensity = Math.min(power / 6, 2.5); // Độ sáng
      const rayLen = 14 + rayIntensity * 16;
      const numRays = 12;

      ctx.save();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.shadowColor = '#fde047';
      ctx.shadowBlur = 15;

      for (let i = 0; i < numRays; i++) {
        const angle = (i * Math.PI * 2) / numRays;
        const x1 = Math.cos(angle) * 32;
        const y1 = Math.sin(angle) * 32 - 14;
        const x2 = Math.cos(angle) * (32 + rayLen);
        const y2 = Math.sin(angle) * (32 + rayLen) - 14;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.restore();

      // Hào quang vàng bao quanh bóng thủy tinh
      const glowGrad = ctx.createRadialGradient(0, -14, 5, 0, -14, 45 + rayIntensity * 12);
      glowGrad.addColorStop(0, 'rgba(255, 240, 100, 0.7)');
      glowGrad.addColorStop(0.5, 'rgba(250, 204, 21, 0.35)');
      glowGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(0, -14, 55, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. BẦU THỦY TINH
    const glassGrad = ctx.createRadialGradient(-6, -20, 2, 0, -14, 28);
    if (isOn && power > 0.05) {
      glassGrad.addColorStop(0, '#fffbeb');
      glassGrad.addColorStop(0.6, '#fef08a');
      glassGrad.addColorStop(1, 'rgba(234, 179, 8, 0.6)');
    } else {
      glassGrad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
      glassGrad.addColorStop(0.7, 'rgba(203, 213, 225, 0.4)');
      glassGrad.addColorStop(1, 'rgba(148, 163, 184, 0.6)');
    }

    ctx.fillStyle = glassGrad;
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, -14, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 3. SỢI ĐỐT WOLFRAM (FILAMENT)
    ctx.strokeStyle = (isOn && power > 0.05) ? '#ef4444' : '#64748b';
    ctx.lineWidth = (isOn && power > 0.05) ? 2.5 : 1.5;
    if (isOn && power > 0.05) {
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 8;
    }
    ctx.beginPath();
    ctx.moveTo(-8, -4);
    ctx.lineTo(-6, -18);
    ctx.lineTo(-3, -22);
    ctx.lineTo(0, -18);
    ctx.lineTo(3, -22);
    ctx.lineTo(6, -18);
    ctx.lineTo(8, -4);
    ctx.stroke();
    ctx.shadowColor = 'transparent';

    // 4. ĐUI ĐÈN KIM LOẠI XOẮN REN (METAL BASE)
    const baseGrad = ctx.createLinearGradient(-12, 0, 12, 0);
    baseGrad.addColorStop(0, '#64748b');
    baseGrad.addColorStop(0.5, '#cbd5e1');
    baseGrad.addColorStop(1, '#475569');
    ctx.fillStyle = baseGrad;
    ctx.beginPath();
    roundRect(ctx, -12, 12, 24, 18, 3);
    ctx.fill();

    // Rãnh xoắn ren đui đèn
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    [-6, 0, 6].forEach(dy => {
      ctx.beginPath();
      ctx.moveTo(-11, 18 + dy);
      ctx.lineTo(11, 18 + dy);
      ctx.stroke();
    });

    // Chốt tiếp điểm dưới đáy
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    roundRect(ctx, -6, 30, 12, 5, 2);
    ctx.fill();

    // Nhãn giá trị điện trở bên cạnh
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 10px Be Vietnam Pro, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${resistance.toFixed(0)}Ω`, 0, 48);

    ctx.restore();
  }

  // Vẽ Công Tắc Gạt Thật Kiểu PhET (Knife Switch)
  function drawLifelikeSwitch(x, y, isClosed, label) {
    ctx.save();
    ctx.translate(x, y);

    // Chốt nối bên trái (Bản lề)
    ctx.fillStyle = '#f59e0b';
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(-26, 0, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Chốt nối bên phải (Điểm tiếp xúc)
    ctx.beginPath();
    ctx.arc(26, 0, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Lưỡi dao gạt kim loại (Blade)
    ctx.save();
    ctx.translate(-26, 0);
    // Khi mở, gạt chéo lên 35 độ
    const angle = isClosed ? 0 : -Math.PI / 4.8;
    ctx.rotate(angle);

    // Thanh kim loại
    const bladeGrad = ctx.createLinearGradient(0, -3, 0, 3);
    bladeGrad.addColorStop(0, '#fde68a');
    bladeGrad.addColorStop(0.5, '#d97706');
    bladeGrad.addColorStop(1, '#78350f');
    ctx.fillStyle = bladeGrad;
    ctx.beginPath();
    roundRect(ctx, 0, -3, 52, 6, 2);
    ctx.fill();

    // Tay cầm cách điện màu đỏ (Insulated handle)
    ctx.fillStyle = '#dc2626';
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    roundRect(ctx, 42, -5, 14, 10, 3);
    ctx.fill();
    ctx.stroke();

    ctx.restore();

    // Nhãn công tắc
    ctx.fillStyle = isClosed ? '#16a34a' : '#dc2626';
    ctx.font = 'bold 11px Be Vietnam Pro, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${label}: ${isClosed ? 'ĐÓNG' : 'MỞ'}`, 0, -22);

    ctx.restore();
  }

  // Vẽ Điện Trở Thật Kiểu PhET (Resistor với các vạch màu)
  function drawLifelikeResistor(x, y, resistance) {
    ctx.save();
    ctx.translate(x, y);

    const w = 54, h = 18;

    // Thân trụ màu be
    ctx.fillStyle = '#fde68a';
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    roundRect(ctx, -w/2, -h/2, w, h, 6);
    ctx.fill();
    ctx.stroke();

    // Các vạch màu mã điện trở chuẩn
    const bands = ['#b91c1c', '#000000', '#d97706', '#ca8a04'];
    const bandX = [-16, -6, 4, 16];
    bands.forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.fillRect(bandX[i], -h/2, 4, h);
    });

    // Nhãn
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 10px Be Vietnam Pro, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`R: ${resistance.toFixed(0)}Ω`, 0, h + 5);

    ctx.restore();
  }

  // Vẽ Biến Trở Con Chạy Thật
  function drawLifelikeRheostat(x, y, resistance) {
    ctx.save();
    ctx.translate(x, y);

    const w = 64, h = 22;

    // Cuộn dây kim loại
    ctx.fillStyle = '#94a3b8';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    roundRect(ctx, -w/2, -h/2, w, h, 4);
    ctx.fill();
    ctx.stroke();

    // Các vòng dây quấn
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    for (let lx = -w/2 + 5; lx < w/2 - 5; lx += 4) {
      ctx.beginPath();
      ctx.moveTo(lx, -h/2 + 2);
      ctx.lineTo(lx, h/2 - 2);
      ctx.stroke();
    }

    // Con chạy trượt (Slider cursor)
    const ratio = Math.min(Math.max(resistance / 50, 0), 1);
    const cursorX = -w/2 + 6 + ratio * (w - 12);
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(cursorX - 5, -h/2 - 8);
    ctx.lineTo(cursorX + 5, -h/2 - 8);
    ctx.lineTo(cursorX, -h/2 + 2);
    ctx.closePath();
    ctx.fill();

    // Nhãn
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 10px Be Vietnam Pro, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`R_b: ${resistance.toFixed(0)}Ω`, 0, h + 5);

    ctx.restore();
  }

  // Vẽ Ampe kế tròn mắc nối tiếp
  function drawInlineAmmeter(x, y, current, isDark) {
    ctx.save();
    ctx.translate(x, y);

    ctx.fillStyle = isDark ? '#1e293b' : '#f8fafc';
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 13px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('A', 0, -6);

    ctx.fillStyle = isDark ? '#94a3b8' : '#334155';
    ctx.font = 'bold 9px Arial';
    ctx.fillText(`${current.toFixed(2)}A`, 0, 10);

    ctx.restore();
  }

  /* ─────────────────────────────────────────────────────────────
     12. HÌNH VẼ SƠ ĐỒ KÝ HIỆU CHUẨN SGK (SCHEMATIC VIEW)
  ───────────────────────────────────────────────────────────── */
  function drawSchematicBattery(x, y, voltage, isReversed, isDark) {
    ctx.save();
    ctx.translate(x, y);

    const strokeColor = isDark ? '#f8fafc' : '#0f172a';
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2.5;

    // 2 vạch nguồn điện: bản dương dài mỏng, bản âm ngắn dày
    const topIsPos = isReversed;
    const posH = 34, negH = 18;

    // Vạch 1 (trên)
    ctx.beginPath();
    ctx.moveTo(-16, topIsPos ? -posH/2 : -negH/2);
    ctx.lineTo(16, topIsPos ? -posH/2 : -negH/2);
    ctx.lineWidth = topIsPos ? 2 : 4;
    ctx.stroke();

    // Vạch 2 (dưới)
    ctx.beginPath();
    ctx.moveTo(-16, topIsPos ? negH/2 : posH/2);
    ctx.lineTo(16, topIsPos ? negH/2 : posH/2);
    ctx.lineWidth = topIsPos ? 4 : 2;
    ctx.stroke();

    // Ký hiệu + và -
    ctx.fillStyle = strokeColor;
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(topIsPos ? '+' : '–', 26, -10);
    ctx.fillText(topIsPos ? '–' : '+', 26, 14);

    ctx.font = '10px Be Vietnam Pro, sans-serif';
    ctx.fillText(`${voltage.toFixed(1)}V`, -28, 0);

    ctx.restore();
  }

  function drawSchematicBulb(x, y, isOn, isDark) {
    ctx.save();
    ctx.translate(x, y);

    const color = isOn ? '#eab308' : (isDark ? '#cbd5e1' : '#334155');
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.stroke();

    // Dấu X bên trong
    const r = 12;
    ctx.beginPath();
    ctx.moveTo(-r, -r);
    ctx.lineTo(r, r);
    ctx.moveTo(r, -r);
    ctx.lineTo(-r, r);
    ctx.stroke();

    ctx.restore();
  }

  function drawSchematicSwitch(x, y, isClosed, label, isDark) {
    ctx.save();
    ctx.translate(x, y);

    const color = isDark ? '#cbd5e1' : '#334155';
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;

    // 2 chốt tròn
    ctx.beginPath();
    ctx.arc(-20, 0, 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(20, 0, 3, 0, Math.PI * 2);
    ctx.stroke();

    // Thanh gạt
    ctx.beginPath();
    ctx.moveTo(-17, 0);
    if (isClosed) {
      ctx.lineTo(17, 0);
    } else {
      ctx.lineTo(15, -16);
    }
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(label, 0, -20);

    ctx.restore();
  }

  function drawSchematicResistor(x, y, val, label, isDark) {
    ctx.save();
    ctx.translate(x, y);

    const color = isDark ? '#cbd5e1' : '#334155';
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;

    // Hình chữ nhật ký hiệu điện trở SGK
    ctx.strokeRect(-24, -10, 48, 20);

    ctx.fillStyle = color;
    ctx.font = '10px Be Vietnam Pro, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${label} (${val}Ω)`, 0, -15);

    ctx.restore();
  }

  /* ─────────────────────────────────────────────────────────────
     13. ĐỒNG HỒ VÔN KẾ SỐ DI ĐỘNG & QUE ĐO (VOLTMETER & PROBES)
  ───────────────────────────────────────────────────────────── */
  function drawVoltmeter(calc, isDark) {
    // Vị trí thân đồng hồ Vôn kế đặt ở góc trên bên phải
    const bodyX = 640;
    const bodyY = 60;
    const w = 105, h = 65;

    // 1. DÂY NỐI TỪ QUE ĐO ĐẾN ĐỒNG HỒ (CABLE WIRES)
    // Dây đỏ
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(bodyX - 25, bodyY + h/2);
    ctx.bezierCurveTo(bodyX - 60, bodyY + 70, state.probeRed.x + 30, state.probeRed.y - 40, state.probeRed.x, state.probeRed.y);
    ctx.stroke();

    // Dây đen
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(bodyX + 25, bodyY + h/2);
    ctx.bezierCurveTo(bodyX + 60, bodyY + 90, state.probeBlack.x + 30, state.probeBlack.y - 40, state.probeBlack.x, state.probeBlack.y);
    ctx.stroke();

    // 2. THÂN ĐỒNG HỒ VÔN KẾ (VOLTMETER BODY)
    ctx.save();
    ctx.translate(bodyX, bodyY);

    // Hộp màu xanh cam PhET
    ctx.fillStyle = '#ea580c';
    ctx.strokeStyle = '#9a3412';
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    roundRect(ctx, -w/2, -h/2, w, h, 8);
    ctx.fill();
    ctx.stroke();
    ctx.shadowColor = 'transparent';

    // Màn hình LCD điện tử
    ctx.fillStyle = '#ecfccb';
    ctx.strokeStyle = '#365314';
    ctx.lineWidth = 1.5;
    roundRect(ctx, -w/2 + 8, -h/2 + 8, w - 16, 32, 4);
    ctx.fill();
    ctx.stroke();

    // Số đo điện áp LCD
    const val = getVoltmeterReading(calc);
    ctx.fillStyle = '#14532d';
    ctx.font = 'bold 15px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (val !== null) {
      ctx.fillText(`${val >= 0 ? ' ' : ''}${val.toFixed(2)} V`, 0, -h/2 + 24);
    } else {
      ctx.fillText(` ??.?? V`, 0, -h/2 + 24);
    }

    // Nhãn VOLTMETER
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px Arial';
    ctx.fillText('VOLTMETER', 0, h/2 - 8);

    ctx.restore();

    // 3. VẼ QUE ĐO ĐỎ (+) VÀ QUE ĐO ĐEN (-)
    drawProbe(state.probeRed.x, state.probeRed.y, '#dc2626', '+', state.probeRed.isDragging);
    drawProbe(state.probeBlack.x, state.probeBlack.y, '#1e293b', '–', state.probeBlack.isDragging);
  }

  function drawProbe(x, y, color, sign, isDragging) {
    ctx.save();
    ctx.translate(x, y);

    // Mũi kim loại nhọn (Tip)
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -12);
    ctx.stroke();

    // Thân que đo cầm tay
    ctx.fillStyle = color;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    roundRect(ctx, -6, -38, 12, 26, 4);
    ctx.fill();
    ctx.stroke();

    // Vành cầm tay chống trượt
    ctx.beginPath();
    roundRect(ctx, -8, -26, 16, 6, 2);
    ctx.fill();
    ctx.stroke();

    // Ký hiệu (+) hoặc (-)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sign, 0, -31);

    // Vòng tròn điểm chạm tip
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawSparks() {
    state.sparkParticles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });
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

  /* ─────────────────────────────────────────────────────────────
     14. CÁC HÀM XỬ LÝ SỰ KIỆN GỌI TỪ NGOÀI (PUBLIC API)
  ───────────────────────────────────────────────────────────── */
  window.circuitSelectPreset = function (key) {
    if (!PRESETS[key]) return;
    state.preset = key;
    document.querySelectorAll('.phet-tab-btn').forEach(btn => btn.classList.remove('active'));
    const b = document.querySelector(`.phet-tab-btn[onclick="circuitSelectPreset('${key}')"]`);
    if (b) b.classList.add('active');

    // Cập nhật vị trí que đo mặc định theo preset
    window.circuitResetProbes();

    const branchSw = document.getElementById('branch-switch-wrap');
    if (branchSw) branchSw.style.display = key === 'parallel' ? 'block' : 'none';

    renderInspectorLoadSliders();
    updateUIInfo();
  };

  window.circuitSetViewMode = function (mode) {
    state.viewMode = mode;
    document.querySelectorAll('.phet-opt-btn').forEach(b => {
      if (b.getAttribute('onclick')?.includes('circuitSetViewMode')) {
        b.classList.toggle('active', b.getAttribute('onclick').includes(mode));
      }
    });
  };

  window.circuitSetCurrentDisplay = function (type) {
    state.currentDisplay = type;
    document.querySelectorAll('.phet-opt-btn').forEach(b => {
      if (b.getAttribute('onclick')?.includes('circuitSetCurrentDisplay')) {
        b.classList.toggle('active', b.getAttribute('onclick').includes(type));
      }
    });
  };

  window.circuitToggleVoltmeter = function () {
    state.showVoltmeter = !state.showVoltmeter;
    const btn = document.querySelector('.phet-opt-btn[onclick="circuitToggleVoltmeter()"]');
    if (btn) btn.classList.toggle('active', state.showVoltmeter);
  };

  window.circuitToggleAmmeter = function () {
    state.showAmmeter = !state.showAmmeter;
    const btn = document.querySelector('.phet-opt-btn[onclick="circuitToggleAmmeter()"]');
    if (btn) btn.classList.toggle('active', state.showAmmeter);
  };

  window.circuitToggleSwitch = function (swName) {
    if (swName === 'main') {
      state.switchMainClosed = !state.switchMainClosed;
    } else if (swName === 'branch2') {
      state.switchBranch2Closed = !state.switchBranch2Closed;
    }

    // Cập nhật text nút
    const swButtons = document.querySelectorAll('.phet-switch-toggle');
    if (swButtons.length > 0) {
      swButtons[0].className = `phet-switch-toggle ${state.switchMainClosed ? 'closed' : 'open'}`;
      swButtons[0].textContent = state.switchMainClosed ? '🟢 Khóa K: ĐANG ĐÓNG' : '🔴 Khóa K: ĐANG NGẮT';
    }
    if (swButtons.length > 1) {
      swButtons[1].className = `phet-switch-toggle ${state.switchBranch2Closed ? 'closed' : 'open'}`;
      swButtons[1].textContent = state.switchBranch2Closed ? '🟢 Khóa K₂ (Nhánh 2): ĐÓNG' : '🔴 Khóa K₂ (Nhánh 2): NGẮT';
    }
  };

  window.circuitReverseBattery = function () {
    state.batteryReversed = !state.batteryReversed;
  };

  window.circuitUpdateVoltage = function (val) {
    state.batteryVoltage = parseFloat(val);
    const txt = document.getElementById('inspector-voltage-text');
    if (txt) txt.textContent = `${state.batteryVoltage.toFixed(1)} V`;
  };

  window.circuitUpdateBulb1 = function (val) {
    state.bulb1Resistance = parseFloat(val);
    const txt = document.getElementById('inspector-bulb1-text');
    if (txt) txt.textContent = `${state.bulb1Resistance.toFixed(1)} Ω`;
  };

  window.circuitUpdateBulb2 = function (val) {
    state.bulb2Resistance = parseFloat(val);
    const txt = document.getElementById('inspector-bulb2-text');
    if (txt) txt.textContent = `${state.bulb2Resistance.toFixed(1)} Ω`;
  };

  window.circuitUpdateResistor = function (val) {
    state.resistorResistance = parseFloat(val);
    const txt = document.getElementById('inspector-res-text');
    if (txt) txt.textContent = `${state.resistorResistance.toFixed(1)} Ω`;
  };

  window.circuitUpdateRheostat = function (val) {
    state.rheostatResistance = parseFloat(val);
    const txt = document.getElementById('inspector-rheo-text');
    if (txt) txt.textContent = `${state.rheostatResistance.toFixed(1)} Ω`;
  };

  window.circuitResetProbes = function () {
    // Đặt que đỏ và que đen ở 2 điểm đo điển hình của mạch hiện tại
    if (state.preset === 'basic') {
      state.probeRed.x = 500; state.probeRed.y = 140;
      state.probeBlack.x = 500; state.probeBlack.y = 260;
    } else if (state.preset === 'series') {
      state.probeRed.x = 420; state.probeRed.y = 130;
      state.probeBlack.x = 550; state.probeBlack.y = 270;
    } else if (state.preset === 'parallel') {
      state.probeRed.x = 480; state.probeRed.y = 140;
      state.probeBlack.x = 560; state.probeBlack.y = 310;
    } else if (state.preset === 'ohm') {
      state.probeRed.x = 440; state.probeRed.y = 130;
      state.probeBlack.x = 560; state.probeBlack.y = 130;
    } else {
      state.probeRed.x = 580; state.probeRed.y = 130;
      state.probeBlack.x = 580; state.probeBlack.y = 230;
    }
  };

  window.circuitResetDefaults = function () {
    state.batteryVoltage = 9.0;
    state.batteryReversed = false;
    state.switchMainClosed = true;
    state.switchBranch2Closed = true;
    state.bulb1Resistance = 10.0;
    state.bulb2Resistance = 10.0;
    state.resistorResistance = 10.0;
    state.rheostatResistance = 15.0;

    buildCircuitUI();
    window.circuitResetProbes();
  };

  /* ─────────────────────────────────────────────────────────────
     15. KHỞI TẠO KHI TẢI TRANG
  ───────────────────────────────────────────────────────────── */
  buildCircuitUI();

  // Đặt que đo vào vị trí 2 đầu bóng đèn mạch cơ bản ban đầu
  window.circuitResetProbes();

})();
