/**
 * ==============================================================================
 * THÍ NGHIỆM HÓA HỌC: ĐIỆN PHÂN DUNG DỊCH & NÓNG CHẢY (HÓA HỌC 12)
 * Mô phỏng bộ nguồn DC một chiều, hiện tượng bọt khí, mạ kim loại & Định luật Faraday
 * Khoa Hóa học / ĐH Sư Phạm TP.HCM (HCMUE)
 * ==============================================================================
 */

(function () {
  'use strict';

  // Hằng số Faraday
  const FARADAY = 96485; // C/mol

  // 6 Chế độ thí nghiệm tiêu chuẩn SGK Hóa học 12
  const PRESETS = [
    {
      id: 'cu_inert',
      name: '1. ĐP dung dịch CuSO₄ (Điện cực trơ Pt/Graphite)',
      shortTitle: 'CuSO₄ (Điện cực trơ)',
      solName: 'Dung dịch CuSO₄ 1M',
      solColor: 'rgba(37, 99, 235, 0.45)', // Xanh lam
      hasDiaphragm: false,
      cathodeMaterial: 'Graphite (Trơ)',
      anodeMaterial: 'Graphite (Trơ)',
      cathodeDepositMetal: 'Cu', // Đồng đỏ bám
      cathodeGas: null,
      anodeGas: 'O₂', // Khí O2 sủi bọt
      anodeSoluble: false,
      A_cat: 64, // Cu
      n_cat: 2,
      A_an: 32,  // O2
      n_an: 4,
      defaultU: 6.0, // V
      defaultI: 2.5, // A
      catHalfRxn: 'Cu²⁺ + 2e → Cu ↓ (Đồng đỏ bám lên Catot)',
      anHalfRxn: '2H₂O → O₂ ↑ + 4H⁺ + 4e (Khí O₂ sủi bọt, tạo môi trường axit)',
      overallRxn: '2CuSO₄ + 2H₂O ➔ 2Cu ↓ + O₂ ↑ + 2H₂SO₄',
      desc: 'Điện phân dung dịch CuSO₄ với điện cực trơ: Cu²⁺ bị khử tạo đồng đỏ bám ở Catot, H₂O bị oxi hóa tạo khí O₂ thoát ra ở Anot. Màu xanh dung dịch nhạt dần.'
    },
    {
      id: 'nacl_diaphragm',
      name: '2. ĐP dung dịch NaCl (Có màng ngăn xốp - Sản xuất Xút/Clo)',
      shortTitle: 'NaCl (Có màng ngăn)',
      solName: 'Dung dịch NaCl bão hòa (+ Phenolphthalein)',
      solColor: 'rgba(236, 72, 153, 0.25)', // Hồng phớt do OH- sinh ra
      hasDiaphragm: true,
      cathodeMaterial: 'Sắt / Than chì',
      anodeMaterial: 'Graphite / Titan',
      cathodeDepositMetal: null,
      cathodeGas: 'H₂', // Khí H2 sủi bọt
      anodeGas: 'Cl₂', // Khí Clo vàng lục
      anodeSoluble: false,
      A_cat: 2,   // H2
      n_cat: 2,
      A_an: 71,  // Cl2
      n_an: 2,
      defaultU: 5.0,
      defaultI: 3.0,
      catHalfRxn: '2H₂O + 2e → H₂ ↑ + 2OH⁻ (Dung dịch hóa kiềm làm hồng phenolphthalein)',
      anHalfRxn: '2Cl⁻ → Cl₂ ↑ + 2e (Khí Clo màu vàng lục sủi bọt)',
      overallRxn: '2NaCl + 2H₂O ➔ 2NaOH + H₂ ↑ + Cl₂ ↑ (Có màng ngăn)',
      desc: 'Sản xuất Xút (NaOH), khí Clo và Hydro trong công nghiệp. Màng ngăn xốp ngăn Cl₂ tiếp xúc với NaOH để tránh tạo nước Javel.'
    },
    {
      id: 'cu_active',
      name: '3. ĐP dung dịch CuSO₄ (Anot tan Cu - Mạ điện & Tinh luyện)',
      shortTitle: 'CuSO₄ (Anot tan Cu)',
      solName: 'Dung dịch CuSO₄ 1M + H₂SO₄',
      solColor: 'rgba(37, 99, 235, 0.55)',
      hasDiaphragm: false,
      cathodeMaterial: 'Vật mạ / Cu tinh khiết',
      anodeMaterial: 'Thanh Cu thô (Tan)',
      cathodeDepositMetal: 'Cu',
      cathodeGas: null,
      anodeGas: null,
      anodeSoluble: true, // Thanh đồng tan ra
      A_cat: 64,
      n_cat: 2,
      A_an: 64,
      n_an: 2,
      defaultU: 3.5,
      defaultI: 4.0,
      catHalfRxn: 'Cu²⁺ + 2e → Cu ↓ (Đồng bám dày lên vật mạ ở Catot)',
      anHalfRxn: 'Cu (thô) → Cu²⁺ + 2e (Anot bằng đồng bị hòa tan dần)',
      overallRxn: 'Cu (anot) ➔ Cu (catot) (Nồng độ Cu²⁺ và màu dung dịch không đổi)',
      desc: 'Ứng dụng trong mạ điện và tinh chế đồng kỹ thuật đạt độ tinh khiết 99.99%. Anot tan đúng bằng lượng đồng bám ở Catot.'
    },
    {
      id: 'ag_electroplate',
      name: '4. Mạ bạc (Dung dịch AgNO₃ - Anot bạc Ag)',
      shortTitle: 'AgNO₃ (Mạ bạc)',
      solName: 'Dung dịch AgNO₃ 0.5M',
      solColor: 'rgba(241, 245, 249, 0.45)', // Trong suốt ánh bạc
      hasDiaphragm: false,
      cathodeMaterial: 'Thìa kim loại (Vật mạ)',
      anodeMaterial: 'Thanh bạc Ag (Tan)',
      cathodeDepositMetal: 'Ag',
      cathodeGas: null,
      anodeGas: null,
      anodeSoluble: true,
      A_cat: 108,
      n_cat: 1,
      A_an: 108,
      n_an: 1,
      defaultU: 2.5,
      defaultI: 1.5,
      catHalfRxn: 'Ag⁺ + e → Ag ↓ (Lớp bạc trắng sáng bóng phủ lên thìa kim loại)',
      anHalfRxn: 'Ag → Ag⁺ + e (Thanh bạc ở Anot bị tan dần vào dung dịch)',
      overallRxn: 'Ag (anot) ➔ Ag (catot) (Mạ bạc trang sức, đồ dùng cao cấp)',
      desc: 'Công nghệ mạ điện bạc: Lớp bạc mạ bám chắc, bóng mịn trên bề mặt chi tiết kim loại cần mạ tại Catot.'
    },
    {
      id: 'water_splitting',
      name: '5. Điện phân nước (H₂O dung dịch H₂SO₄ loãng - Tỉ lệ 2:1)',
      shortTitle: 'H₂O (Điện phân nước)',
      solName: 'Dung dịch H₂SO₄ 0.1M (Chất dẫn điện)',
      solColor: 'rgba(224, 242, 254, 0.35)',
      hasDiaphragm: false,
      cathodeMaterial: 'Bạch kim Pt (Trơ)',
      anodeMaterial: 'Bạch kim Pt (Trơ)',
      cathodeDepositMetal: null,
      cathodeGas: 'H₂',
      anodeGas: 'O₂',
      anodeSoluble: false,
      A_cat: 2,
      n_cat: 2,
      A_an: 32,
      n_an: 4,
      defaultU: 8.0,
      defaultI: 2.0,
      catHalfRxn: '4H⁺ + 4e → 2H₂ ↑ (Khí H₂ thoát ra gấp đôi ở Catot)',
      anHalfRxn: '2H₂O → O₂ ↑ + 4H⁺ + 4e (Khí O₂ thoát ra ở Anot)',
      overallRxn: '2H₂O ➔ 2H₂ ↑ + O₂ ↑ (Tỉ lệ thể tích VH₂ : VO₂ = 2 : 1)',
      desc: 'Điện phân nước tạo khí Hydro và Oxy tinh khiết. Thể tích khí H₂ thu được ở Catot luôn gấp 2 lần thể tích khí O₂ ở Anot.'
    },
    {
      id: 'molten_nacl',
      name: '6. Điện phân nóng chảy NaCl (Nhiệt độ cao ~800°C)',
      shortTitle: 'NaCl nóng chảy (800°C)',
      solName: 'NaCl lỏng nóng chảy (800°C)',
      solColor: 'rgba(249, 115, 22, 0.65)', // Màu cam đỏ nóng rực
      hasDiaphragm: true,
      cathodeMaterial: 'Sắt (Chịu nhiệt)',
      anodeMaterial: 'Than chì (Graphite)',
      cathodeDepositMetal: 'Na',
      cathodeGas: null,
      anodeGas: 'Cl₂',
      anodeSoluble: false,
      A_cat: 23,
      n_cat: 1,
      A_an: 71,
      n_an: 2,
      defaultU: 7.0,
      defaultI: 5.0,
      catHalfRxn: 'Na⁺ + e → Na ↓ (Kim loại Natri nóng chảy nổi lên trên bề mặt)',
      anHalfRxn: '2Cl⁻ → Cl₂ ↑ + 2e (Khí Clo màu vàng lục thoát ra ở Anot)',
      overallRxn: '2NaCl ➔ 2Na + Cl₂ ↑ (Điện phân nóng chảy)',
      desc: 'Phương pháp duy nhất điều chế kim loại kiềm mạnh (Na, K, Ca, Al). Không có nước tham gia, cation kim loại bị khử trực tiếp thành kim loại tự do.'
    }
  ];

  // Trạng thái thí nghiệm toàn cục
  let curPreset = PRESETS[0];
  let isPowered = true;           // Khóa K: bật/tắt nguồn DC
  let polarityReversed = false;   // Đảo chiều cực que cắm (Đỏ Trái / Đen Phải)
  let voltage = 6.0;              // Điện áp DC (V)
  let currentAmps = 2.5;          // Cường độ dòng điện (A)
  let speedMultiplier = 10;       // Tốc độ thời gian (1x, 5x, 10x, 60x)
  let hasDiaphragm = false;       // Màng ngăn xốp
  let elapsedSeconds = 0;         // Thời gian điện phân tích lũy (giây)

  // Hệ thống hạt mô phỏng đồ họa Canvas
  let canvas, ctx;
  let animId = null;
  let lastFrameTime = performance.now();
  let electrons = [];
  let bubblesLeft = [];
  let bubblesRight = [];

  /* ─────────────────────────────────────────────────────────────
     1. KHỞI TẠO VÀ BUILD GIAO DIỆN HTML
  ───────────────────────────────────────────────────────────── */
  function buildElectrolysisUI() {
    const container = document.getElementById('experiment-electrolysis');
    if (!container) return;

    voltage = curPreset.defaultU;
    currentAmps = curPreset.defaultI;
    hasDiaphragm = curPreset.hasDiaphragm;
    elapsedSeconds = 0;

    container.innerHTML = `
      <div class="electrolysis-wrapper">
        
        <!-- Topbar điều khiển & Trạng thái -->
        <div class="electrolysis-topbar">
          <div class="electrolysis-title-box">
            <span class="electrolysis-badge">Hóa Học 12 — Chuyên Đề Điện Phân</span>
            <div style="font-size: 0.95rem; font-weight: 800; color: var(--text-main);">
              Bình Điện Phân Dung Dịch & Nóng Chảy (Nguồn DC)
            </div>
          </div>
          <div class="electrolysis-top-actions">
            <button class="electrolysis-btn ${isPowered ? 'active' : ''}" id="btn-toggle-dc" onclick="electrolysisTogglePower()">
              ⚡ Nguồn DC (Khóa K): <strong>${isPowered ? 'BẬT (Đang Chạy)' : 'TẮT (Ngắt Mạch)'}</strong>
            </button>
            <button class="electrolysis-btn" id="btn-toggle-polarity" onclick="electrolysisTogglePolarity()" title="Hoán đổi cực cắm nguồn điện: Catot và Anot sẽ đổi vị trí">
              🔄 Đảo Cực Nguồn (+ / −)
            </button>
            <button class="electrolysis-btn" onclick="electrolysisResetTime()" title="Đặt lại đồng hồ thời gian điện phân về 0">
              ⏱ Đặt Lại Thời Gian
            </button>
            <button class="electrolysis-btn" id="btn-fullscreen-el" onclick="electrolysisToggleFullscreen()" title="Chế độ toàn màn hình">
              ⛶ Toàn Màn Hình
            </button>
          </div>
        </div>

        <!-- Lưới chính: Canvas mô phỏng & Bảng điều khiển -->
        <div class="electrolysis-main-grid">
          
          <!-- Cột Trái: Bàn thí nghiệm Canvas 2D tương tác -->
          <div class="electrolysis-canvas-card">
            <div class="electrolysis-canvas-wrap">
              <canvas id="electrolysis-canvas" width="860" height="520"></canvas>
            </div>
            
            <div class="electrolysis-canvas-hud">
              <div class="hud-dc-display">
                <span>NGUỒN DC:</span>
                <span class="hud-dc-val" id="hud-voltage-text">${voltage.toFixed(1)} V</span>
                <span class="hud-dc-val" id="hud-current-text" style="color: #10b981;">${currentAmps.toFixed(2)} A</span>
                <span class="hud-dc-tag running" id="hud-status-badge">ĐANG ĐIỆN PHÂN</span>
              </div>
              
              <div style="display: flex; gap: 0.75rem; align-items: center; font-family: monospace; font-size: 0.92rem;">
                <span>⏱ Thời gian: <strong id="hud-time-text" style="color: #38bdf8; font-size: 1.05rem;">00:00</strong></span>
                <span>⚡ Điện lượng Q: <strong id="hud-q-text" style="color: #fbbf24;">0 C</strong></span>
              </div>
            </div>
          </div>

          <!-- Cột Phải: Bảng chọn bài, thanh trượt & Định luật Faraday -->
          <div class="electrolysis-ctrl-card">
            
            <!-- Chọn bài thí nghiệm -->
            <div class="preset-select-group">
              <label class="preset-select-label">
                <span>🧪</span> Chọn Bài Thí Nghiệm Chuẩn SGK 12:
              </label>
              <select class="preset-select-box" id="select-preset" onchange="electrolysisSelectPreset(this.value)">
                ${PRESETS.map(p => `
                  <option value="${p.id}" ${p.id === curPreset.id ? 'selected' : ''}>
                    ${p.name}
                  </option>
                `).join('')}
              </select>
            </div>

            <!-- Thanh trượt điều chỉnh I, U, Tốc độ, Màng ngăn -->
            <div class="param-slider-grid">
              
              <!-- Cường độ dòng điện I (A) -->
              <div class="param-item">
                <div class="param-item-header">
                  <span>Cường độ dòng (I):</span>
                  <strong id="val-slider-i">${currentAmps.toFixed(1)} A</strong>
                </div>
                <input type="range" id="slider-current" min="0.5" max="10.0" step="0.5" value="${currentAmps}" oninput="electrolysisSetCurrent(this.value)">
              </div>

              <!-- Điện áp nguồn U (V) -->
              <div class="param-item">
                <div class="param-item-header">
                  <span>Điện áp nguồn (U):</span>
                  <strong id="val-slider-u">${voltage.toFixed(1)} V</strong>
                </div>
                <input type="range" id="slider-voltage" min="1.0" max="24.0" step="0.5" value="${voltage}" oninput="electrolysisSetVoltage(this.value)">
              </div>

              <!-- Tốc độ thời gian -->
              <div class="param-item">
                <div class="param-item-header">
                  <span>Tốc độ mô phỏng:</span>
                  <strong id="val-slider-speed">${speedMultiplier}×</strong>
                </div>
                <input type="range" id="slider-speed" min="1" max="60" step="1" value="${speedMultiplier}" oninput="electrolysisSetSpeed(this.value)">
              </div>

              <!-- Màng ngăn xốp (bật/tắt) -->
              <div class="param-item" style="justify-content: center;">
                <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.88rem; font-weight: 700; cursor: pointer; color: var(--text-main);">
                  <input type="checkbox" id="check-diaphragm" ${hasDiaphragm ? 'checked' : ''} onchange="electrolysisToggleDiaphragm(this.checked)" style="width: 17px; height: 17px; cursor: pointer;">
                  <span>Gắn Màng Ngăn Xốp</span>
                </label>
                <small style="font-size: 0.72rem; color: var(--text-muted);">Cần thiết cho sản xuất NaOH/Cl₂</small>
              </div>

            </div>

            <!-- Khung Tính toán Định luật Faraday -->
            <div class="faraday-calc-box">
              <div class="faraday-title">
                <span>📐</span> ĐỊNH LUẬT FARADAY (KHỐI LƯỢNG & THỂ TÍCH CHẤT THOÁT RA)
              </div>

              <div class="faraday-formula-card">
                <div class="faraday-eq-row">
                  <span>Công thức: <strong>m = (A · I · t) / (n · F)</strong></span>
                  <span id="faraday-sub-cat">Catot: <strong>...</strong></span>
                </div>
                <div class="faraday-eq-row" style="margin-top: 0.35rem; padding-top: 0.35rem; border-top: 1px dashed var(--border-color);">
                  <span>Khối lượng Catot tăng (m):</span>
                  <strong class="faraday-val" id="calc-mass-cat">0.000 g</strong>
                </div>
                <div class="faraday-eq-row" id="row-gas-anode" style="margin-top: 0.25rem;">
                  <span>Thể tích khí Anot (V đkc, 25°C):</span>
                  <strong class="faraday-val" id="calc-vol-an" style="color: #f59e0b;">0.00 mL</strong>
                </div>
              </div>

              <!-- Thẻ Bán Phản ứng Catot và Anot -->
              <div class="rxn-box-grid">
                <div class="rxn-card cathode" id="card-rxn-cat">
                  <h5>🔵 CATOT (−) — Sự Khử</h5>
                  <div id="text-rxn-cat" style="font-family: 'Cambria Math', serif; font-size: 0.88rem;">${curPreset.catHalfRxn}</div>
                </div>
                <div class="rxn-card anode" id="card-rxn-an">
                  <h5>🔴 ANOT (+) — Sự Oxi Hóa</h5>
                  <div id="text-rxn-an" style="font-family: 'Cambria Math', serif; font-size: 0.88rem;">${curPreset.anHalfRxn}</div>
                </div>
              </div>

              <div class="rxn-overall">
                <strong>Phương trình điện phân tổng quát:</strong><br>
                <span id="text-rxn-overall" style="font-family: 'Cambria Math', serif; font-weight: 700; color: var(--text-main); font-size: 0.95rem;">
                  ${curPreset.overallRxn}
                </span>
              </div>
            </div>

          </div>

        </div>

        <!-- ========================================================
             KIẾN THỨC BỔ TRỢ: SO SÁNH PIN ĐIỆN HÓA VÀ BÌNH ĐIỆN PHÂN
             ======================================================== -->
        <div class="electrolysis-knowledge-grid">
          
          <div class="e-k-card">
            <h4><span>⚖️</span> So Sánh Bản Chất: Pin Điện Hóa vs Bình Điện Phân</h4>
            <table class="compare-table">
              <thead>
                <tr>
                  <th>Đặc điểm</th>
                  <th>Pin Điện Hóa (Galvanic Cell)</th>
                  <th>Bình Điện Phân (Electrolytic Cell)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Năng lượng</strong></td>
                  <td>Hóa năng ➔ Điện năng (Tự phát)</td>
                  <td>Điện năng ➔ Hóa năng (Cưỡng bức)</td>
                </tr>
                <tr>
                  <td><strong>Catot</strong></td>
                  <td>Cực DƯƠNG (+) — Xảy ra sự Khử</td>
                  <td>Cực ÂM (−) — Xảy ra sự Khử</td>
                </tr>
                <tr>
                  <td><strong>Anot</strong></td>
                  <td>Cực ÂM (−) — Xảy ra sự Oxi hóa</td>
                  <td>Cực DƯƠNG (+) — Xảy ra sự Oxi hóa</td>
                </tr>
                <tr>
                  <td><strong>Quy tắc nhớ</strong></td>
                  <td>"Anode luôn oxi hóa, Cathode luôn khử"</td>
                  <td>"Dấu cực bị đảo ngược so với Pin"</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="e-k-card">
            <h4><span>🏭</span> Ứng Dụng Thực Tiễn Quan Trọng Của Điện Phân</h4>
            <ul>
              <li><strong>Mạ điện (Electroplating):</strong> Mạ vàng, bạc, crom, niken bảo vệ kim loại chống ăn mòn và làm tăng vẻ đẹp thẩm mỹ (Catot là vật cần mạ, Anot là kim loại mạ).</li>
              <li><strong>Tinh luyện kim loại:</strong> Tinh chế đồng kỹ thuật thô đạt độ tinh khiết cực cao (99.99%) để làm dây cáp điện cao thế.</li>
              <li><strong>Sản xuất hóa chất cơ bản:</strong> Điện phân dung dịch NaCl có màng ngăn sản xuất hàng triệu tấn xút (NaOH), khí Clo và khí Hydro mỗi năm.</li>
              <li><strong>Luyện kim nhôm:</strong> Điện phân nóng chảy Al₂O₃ với xúc tác Criolit Na₃AlF₆ để sản xuất toàn bộ nhôm kim loại trên thế giới.</li>
            </ul>
          </div>

        </div>

      </div>
    `;

    canvas = document.getElementById('electrolysis-canvas');
    if (canvas) {
      ctx = canvas.getContext('2d');
    }

    initParticleEngine();
    updateUI();
    startSimulationLoop();
  }

  /* ─────────────────────────────────────────────────────────────
     2. HỆ THỐNG HẠT ĐỒ HỌA (ELECTRON & BỌT KHÍ)
  ───────────────────────────────────────────────────────────── */
  function initParticleEngine() {
    electrons = [];
    bubblesLeft = [];
    bubblesRight = [];

    // Tạo 20 electron chạy dọc dây dẫn ngoài
    for (let i = 0; i < 20; i++) {
      electrons.push({ progress: i / 20 });
    }
  }

  function spawnBubbles() {
    if (!isPowered) return;

    // Xác định điện cực trái/phải là Catot hay Anot
    const leftIsCathode = !polarityReversed;

    const gasLeft = leftIsCathode ? curPreset.cathodeGas : curPreset.anodeGas;
    const gasRight = !leftIsCathode ? curPreset.cathodeGas : curPreset.anodeGas;

    // Sinh bọt khí bên trái nếu có khí (tâm thanh trái x = 248)
    if (gasLeft && Math.random() < 0.35) {
      bubblesLeft.push({
        x: 248 + (Math.random() - 0.5) * 24,
        y: 420 - Math.random() * 120,
        r: 2 + Math.random() * 3.5,
        speed: 1.2 + Math.random() * 1.5,
        gas: gasLeft
      });
    }

    // Sinh bọt khí bên phải nếu có khí (tâm thanh phải x = 612)
    if (gasRight && Math.random() < 0.35) {
      bubblesRight.push({
        x: 612 + (Math.random() - 0.5) * 24,
        y: 420 - Math.random() * 120,
        r: 2 + Math.random() * 3.5,
        speed: 1.2 + Math.random() * 1.5,
        gas: gasRight
      });
    }
  }

  /* ─────────────────────────────────────────────────────────────
     3. VÒNG LẶP RENDER CANVAS 2D THỜI GIAN THỰC (60 FPS)
  ───────────────────────────────────────────────────────────── */
  function startSimulationLoop() {
    if (animId) cancelAnimationFrame(animId);

    function loop(now) {
      const dt = (now - lastFrameTime) / 1000;
      lastFrameTime = now;

      // Cập nhật tích lũy thời gian điện phân nếu nguồn bật
      if (isPowered) {
        elapsedSeconds += dt * speedMultiplier;
        spawnBubbles();
      }

      renderCanvas();
      updateFaradayCalculations();

      animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);
  }

  function renderCanvas() {
    if (!ctx || !canvas) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const leftIsCathode = !polarityReversed;

    // 1. Vẽ mặt bàn phòng thí nghiệm
    drawTable(w, h);

    // 2. Vẽ Bộ nguồn 1 chiều DC Power Supply ở phía trên
    const psX = 280;
    const psY = 25;
    const psW = 300;
    const psH = 110;
    drawPowerSupply(psX, psY, psW, psH);

    // 3. Vẽ Bình điện phân ở phía dưới
    const cupX = 160;
    const cupY = 220;
    const cupW = 540;
    const cupH = 240;
    drawElectrolyticCell(cupX, cupY, cupW, cupH, leftIsCathode);

    // 4. Vẽ Dây dẫn điện nối từ Bộ nguồn xuống 2 điện cực
    drawWiresAndElectrons(psX, psY, psW, psH, cupX, cupY, cupW, leftIsCathode);
  }

  /* ─────────────────────────────────────────────────────────────
     4. HỌA VẼ BÀN THÍ NGHIỆM & BỘ NGUỒN DC
  ───────────────────────────────────────────────────────────── */
  function drawTable(w, h) {
    const tableY = 465;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, tableY, w, h - tableY);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, tableY);
    ctx.lineTo(w, tableY);
    ctx.stroke();

    const grad = ctx.createLinearGradient(0, 0, 0, tableY);
    grad.addColorStop(0, '#060b18');
    grad.addColorStop(1, '#0c1427');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, tableY);
  }

  function drawPowerSupply(x, y, w, h) {
    ctx.save();

    // Vỏ hộp kim loại của bộ nguồn DC công nghiệp
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, w, h, 10) : ctx.rect(x, y, w, h);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Tên thiết bị trên mặt bộ nguồn
    ctx.fillStyle = '#94a3b8';
    ctx.font = '800 11.5px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('DC POWER SUPPLY (NGUỒN 1 CHIỀU)', x + 16, y + 22);

    // Màn hình LED kỹ thuật số hiển thị V và A
    const dispX = x + 16;
    const dispY = y + 32;
    const dispW = 145;
    const dispH = 62;

    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(dispX, dispY, dispW, dispH, 6) : ctx.rect(dispX, dispY, dispW, dispH);
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.stroke();

    // Số LED đỏ hiển thị Volt
    ctx.font = '900 21px "Courier New", monospace';
    ctx.fillStyle = isPowered ? '#ef4444' : '#52525b';
    ctx.fillText(`${voltage.toFixed(1)} V`, dispX + 12, dispY + 28);

    // Số LED xanh hiển thị Ampe
    ctx.fillStyle = isPowered ? '#10b981' : '#52525b';
    ctx.fillText(`${(isPowered ? currentAmps : 0).toFixed(2)} A`, dispX + 12, dispY + 52);

    // Nút công tắc nguồn tròn (Power Toggle)
    const switchX = x + 185;
    const switchY = y + 63;
    ctx.fillStyle = isPowered ? '#10b981' : '#ef4444';
    ctx.beginPath();
    ctx.arc(switchX, switchY, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '800 10.5px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(isPowered ? 'BẬT' : 'TẮT', switchX, switchY + 25);

    // 2 Cọc cắm đầu ra: Cọc ĐỎ (+) và Cọc ĐEN (−)
    // Nếu polarityReversed = false: Trái là cực âm (-), Phải là cực dương (+)
    const termLeftX = x + 230;
    const termRightX = x + 270;
    const termY = y + 63;

    const leftIsPositive = polarityReversed;
    const rightIsPositive = !polarityReversed;

    // Cọc bên trái
    drawTerminalJack(termLeftX, termY, leftIsPositive ? '#dc2626' : '#1e293b', leftIsPositive ? '+' : '−');
    // Cọc bên phải
    drawTerminalJack(termRightX, termY, rightIsPositive ? '#dc2626' : '#1e293b', rightIsPositive ? '+' : '−');

    ctx.restore();
  }

  function drawTerminalJack(x, y, color, sign) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 14px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(sign, x, y + 4.5);
  }

  /* ─────────────────────────────────────────────────────────────
     5. HỌA VẼ BÌNH ĐIỆN PHÂN, DUNG DỊCH, MÀNG NGĂN & ĐIỆN CỰC
  ───────────────────────────────────────────────────────────── */
  function drawElectrolyticCell(x, y, w, h, leftIsCathode) {
    ctx.save();

    // 1. Khối dung dịch bên trong cốc
    const solY = y + 45;
    const solH = h - 50;

    ctx.fillStyle = curPreset.solColor;
    ctx.fillRect(x + 8, solY, w - 16, solH);

    // Gợn sóng lăn tăn mặt nước
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(x + 8, solY - 2, w - 16, 4);

    // 2. Màng ngăn xốp (Diaphragm) ở giữa cốc nếu được kích hoạt
    if (hasDiaphragm) {
      const midX = x + w / 2;
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.85)';
      ctx.lineWidth = 6;
      ctx.setLineDash([6, 4]); // Nét đứt biểu thị màng xốp cho ion đi qua
      ctx.beginPath();
      ctx.moveTo(midX, solY);
      ctx.lineTo(midX, y + h);
      ctx.stroke();
      ctx.setLineDash([]); // Bỏ nét đứt

      // Nhãn màng ngăn
      ctx.fillStyle = '#fbbf24';
      ctx.font = '800 11px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('MÀNG NGĂN XỐP', midX, solY - 12);
    }

    // 3. Thành cốc thủy tinh chịu lực
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.75)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x - 5, y);
    ctx.lineTo(x + 5, y);
    ctx.lineTo(x + 5, y + h - 12);
    ctx.quadraticCurveTo(x + 5, y + h, x + 18, y + h);
    ctx.lineTo(x + w - 18, y + h);
    ctx.quadraticCurveTo(x + w - 5, y + h, x + w - 5, y + h - 12);
    ctx.lineTo(x + w - 5, y);
    ctx.lineTo(x + w + 5, y);
    ctx.stroke();

    // Vạch chia độ thủy tinh
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.5;
    for (let i = 1; i <= 4; i++) {
      const my = y + h - (i * 40);
      ctx.beginPath();
      ctx.moveTo(x + 8, my);
      ctx.lineTo(x + 24, my);
      ctx.stroke();
    }

    // 4. Nhãn tên dung dịch dưới đáy cốc
    const labelY = y + h + 24;
    ctx.font = '800 13px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    const textW = ctx.measureText(curPreset.solName).width;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x + w / 2 - textW / 2 - 12, labelY - 13, textW + 24, 25, 6) : ctx.rect(x + w / 2 - textW / 2 - 12, labelY - 13, textW + 24, 25);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.stroke();
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(curPreset.solName, x + w / 2, labelY + 4);

    // 5. Vẽ 2 Thanh điện cực nhúng vào cốc
    const rodW = 36;
    const rodH = 220;
    const rodLeftX = x + 70;
    const rodRightX = x + w - 70 - rodW;
    const rodY = y - 30;

    // Tính độ dày lớp kim loại bám (Catot) và độ mòn (Anot tan)
    const faradayMass = getAccumulatedMass();
    const depositThickness = Math.min(rodW * 0.45, (faradayMass / 5.0) * 8); // Tối đa bám thêm
    const dissolvedThickness = curPreset.anodeSoluble ? Math.min(rodW * 0.5, (faradayMass / 5.0) * 8) : 0;

    // Thanh Điện Cực Trái
    drawElectrode(
      rodLeftX, rodY, rodW, rodH,
      leftIsCathode,
      leftIsCathode ? curPreset.cathodeMaterial : curPreset.anodeMaterial,
      leftIsCathode ? depositThickness : 0,
      !leftIsCathode ? dissolvedThickness : 0,
      bubblesLeft
    );

    // Thanh Điện Cực Phải
    drawElectrode(
      rodRightX, rodY, rodW, rodH,
      !leftIsCathode,
      !leftIsCathode ? curPreset.cathodeMaterial : curPreset.anodeMaterial,
      !leftIsCathode ? depositThickness : 0,
      leftIsCathode ? dissolvedThickness : 0,
      bubblesRight
    );

    ctx.restore();
  }

  function drawElectrode(x, y, w, h, isCathode, materialName, depositThick, dissolveThick, bubbleList) {
    ctx.save();

    // Bề rộng thực tế của thanh lõi kim loại/than chì
    const activeW = Math.max(12, w - dissolveThick);

    // Màu thanh điện cực
    let rodColor = '#475569'; // Graphite / than chì
    if (materialName.includes('Cu')) rodColor = '#b45309'; // Đồng
    else if (materialName.includes('Ag')) rodColor = '#cbd5e1'; // Bạc
    else if (materialName.includes('Pt')) rodColor = '#94a3b8'; // Bạch kim

    // Vẽ thanh điện cực chính
    ctx.fillStyle = rodColor;
    ctx.fillRect(x + dissolveThick / 2, y, activeW, h);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + dissolveThick / 2, y, activeW, h);

    // Nếu là Catot và có kim loại bám dày lên: vẽ lớp phủ kim loại bám ngoài
    if (depositThick > 0.5 && curPreset.cathodeDepositMetal) {
      const depColor = curPreset.cathodeDepositMetal === 'Cu' ? '#ea580c' : '#f8fafc';
      ctx.fillStyle = depColor;
      // Lớp mạ bám hai bên hông và đáy thanh
      ctx.fillRect(x - depositThick / 2, y + 40, depositThick / 2, h - 40);
      ctx.fillRect(x + w, y + 40, depositThick / 2, h - 40);
      ctx.fillRect(x - depositThick / 2, y + h - depositThick / 2, w + depositThick, depositThick / 2);
    }

    // Kẹp cá sấu ở đỉnh thanh
    const clipH = 16;
    const clipColor = isCathode ? '#1e293b' : '#dc2626'; // Catot nối cực âm (- đen), Anot nối cực dương (+ đỏ)
    ctx.fillStyle = clipColor;
    ctx.fillRect(x - 5, y - clipH, w + 10, clipH);
    ctx.strokeStyle = isCathode ? '#64748b' : '#fca5a5';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - 5, y - clipH, w + 10, clipH);

    // Dấu cực que cắm (+ hoặc −)
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(isCathode ? 'CỰC (−)' : 'CỰC (+)', x + w / 2, y - 4);

    // Nhãn danh tính Catot/Anot trên đầu thanh (TO RÕ NỔI BẬT)
    ctx.fillStyle = isCathode ? '#60a5fa' : '#f87171';
    ctx.font = '900 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(isCathode ? 'CATOT (−)' : 'ANOT (+)', x + w / 2, y - 25);

    // Tên chất liệu điện cực
    ctx.fillStyle = '#f1f5f9';
    ctx.font = '800 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(materialName.split(' ')[0], x + w / 2, y + 60);

    // Vẽ các bọt khí thoát ra từ điện cực
    drawBubbles(bubbleList);

    ctx.restore();
  }

  function drawBubbles(bubbleList) {
    for (let i = bubbleList.length - 1; i >= 0; i--) {
      const b = bubbleList[i];
      b.y -= b.speed;

      // Màu bọt khí tùy theo loại khí (Cl2 vàng lục, O2/H2 trong suốt)
      if (b.gas === 'Cl₂') {
        ctx.fillStyle = 'rgba(234, 179, 8, 0.7)'; // Vàng lục
        ctx.strokeStyle = '#ca8a04';
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)'; // O2 hoặc H2 trắng trong
        ctx.strokeStyle = '#93c5fd';
      }

      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Điểm sáng phản chiếu trên bọt
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.35, 0, Math.PI * 2);
      ctx.fill();

      // Nếu bọt chạm mặt nước thì nổ và biến mất
      if (b.y < 265) {
        bubbleList.splice(i, 1);
      }
    }
  }

  /* ─────────────────────────────────────────────────────────────
     6. HỌA VẼ DÂY DẪN & DÒNG ELECTRON DI CHUYỂN
  ───────────────────────────────────────────────────────────── */
  function drawWiresAndElectrons(psX, psY, psW, psH, cupX, cupY, cupW, leftIsCathode) {
    ctx.save();

    const termLeftX = psX + 230;
    const termRightX = psX + 270;
    const termY = psY + 63;

    const rodLeftTop = { x: cupX + 70 + 18, y: cupY - 46 };
    const rodRightTop = { x: cupX + cupW - 70 - 18, y: cupY - 46 };
    const wireMidY = 155;

    // Đường dây 1 (Cọc trái sang Điện cực trái)
    const p0 = { x: termLeftX, y: termY };
    const p1 = { x: termLeftX, y: wireMidY };
    const p2 = { x: rodLeftTop.x, y: wireMidY };
    const p3 = { x: rodLeftTop.x, y: rodLeftTop.y };

    ctx.strokeStyle = leftIsCathode ? '#1e293b' : '#dc2626';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.stroke();

    // Đường dây 2 (Cọc phải sang Điện cực phải)
    const q0 = { x: termRightX, y: termY };
    const q1 = { x: termRightX, y: wireMidY };
    const q2 = { x: rodRightTop.x, y: wireMidY };
    const q3 = { x: rodRightTop.x, rodRightTop.y };

    ctx.strokeStyle = !leftIsCathode ? '#1e293b' : '#dc2626';
    ctx.beginPath();
    ctx.moveTo(q0.x, q0.y);
    ctx.lineTo(q1.x, q1.y);
    ctx.lineTo(q2.x, q2.y);
    ctx.lineTo(q3.x, q3.y);
    ctx.stroke();

    // Hạt electron chạy trên dây dẫn nếu nguồn điện bật
    if (isPowered) {
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#0284c7';
      ctx.shadowBlur = 6;

      const time = performance.now() * 0.0015;

      electrons.forEach((el, idx) => {
        const tVal = ((time * 0.4 + idx / electrons.length) % 1);

        // Nguồn đẩy electron vào Catot, hút electron từ Anot
        let ptLeft, ptRight;
        if (leftIsCathode) {
          // Trái là Catot: dòng e từ Nguồn p0 -> p3
          ptLeft = getPointOnOrthogonalWire(tVal, p0, p1, p2, p3);
          // Phải là Anot: dòng e từ Anot q3 -> Nguồn q0
          ptRight = getPointOnOrthogonalWire(1 - tVal, q0, q1, q2, q3);
        } else {
          // Trái là Anot: dòng e từ p3 -> p0
          ptLeft = getPointOnOrthogonalWire(1 - tVal, p0, p1, p2, p3);
          // Phải là Catot: dòng e từ q0 -> q3
          ptRight = getPointOnOrthogonalWire(tVal, q0, q1, q2, q3);
        }

        ctx.beginPath();
        ctx.arc(ptLeft.x, ptLeft.y, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(ptRight.x, ptRight.y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    ctx.restore();
  }

  function getPointOnOrthogonalWire(t, p0, p1, p2, p3) {
    const L1 = Math.abs(p1.y - p0.y);
    const L2 = Math.abs(p2.x - p1.x);
    const L3 = Math.abs(p3.y - p2.y);
    const total = L1 + L2 + L3;
    const d = t * total;

    if (d <= L1) {
      const r = d / L1;
      return { x: p0.x, y: p0.y + (p1.y - p0.y) * r };
    } else if (d <= L1 + L2) {
      const r = (d - L1) / L2;
      return { x: p1.x + (p2.x - p1.x) * r, y: p1.y };
    } else {
      const r = (d - L1 - L2) / L3;
      return { x: p2.x, y: p2.y + (p3.y - p2.y) * r };
    }
  }

  /* ─────────────────────────────────────────────────────────────
     7. TÍNH TOÁN THEO ĐỊNH LUẬT FARADAY & CẬP NHẬT GIAO DIỆN
  ───────────────────────────────────────────────────────────── */
  function getAccumulatedMass() {
    if (!isPowered || elapsedSeconds <= 0) return 0;
    // m = (A * I * t) / (n * F)
    const t = elapsedSeconds;
    const I = currentAmps;
    return (curPreset.A_cat * I * t) / (curPreset.n_cat * FARADAY);
  }

  function getGasVolumeCathode() {
    if (!isPowered || elapsedSeconds <= 0 || !curPreset.cathodeGas) return 0;
    // V = (I * t) / (n * F) * 24.79 (lít ở đkc 25°C, 1 bar)
    const t = elapsedSeconds;
    const I = currentAmps;
    return (I * t / (curPreset.n_cat * FARADAY)) * 24.79 * 1000; // mL
  }

  function getGasVolumeAnode() {
    if (!isPowered || elapsedSeconds <= 0 || !curPreset.anodeGas) return 0;
    // V = (I * t) / (n * F) * 24.79 (lít ở đkc 25°C, 1 bar)
    const t = elapsedSeconds;
    const I = currentAmps;
    return (I * t / (curPreset.n_an * FARADAY)) * 24.79 * 1000; // mL
  }

  function updateFaradayCalculations() {
    // 1. Cập nhật đồng hồ thời gian HUD
    const hudTime = document.getElementById('hud-time-text');
    const hudQ = document.getElementById('hud-q-text');

    if (hudTime) {
      const totalSec = Math.floor(elapsedSeconds);
      const mins = Math.floor(totalSec / 60);
      const secs = totalSec % 60;
      hudTime.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    if (hudQ) {
      const q = currentAmps * elapsedSeconds;
      hudQ.textContent = `${q.toFixed(0)} C`;
    }

    // 2. Tính sản phẩm giải phóng ở Catot (kim loại bám hoặc khí H2)
    const massCatEl = document.getElementById('calc-mass-cat');
    const subCatEl = document.getElementById('faraday-sub-cat');

    if (massCatEl) {
      if (curPreset.cathodeDepositMetal) {
        const mass = getAccumulatedMass();
        massCatEl.textContent = `+${mass.toFixed(4)} g (${curPreset.cathodeDepositMetal})`;
        massCatEl.style.color = '#0284c7';
      } else if (curPreset.cathodeGas) {
        const vCatMl = getGasVolumeCathode();
        massCatEl.textContent = `+${vCatMl.toFixed(2)} mL (${curPreset.cathodeGas} ↑)`;
        massCatEl.style.color = '#0284c7';
      } else {
        massCatEl.textContent = `0.000 g`;
        massCatEl.style.color = '#94a3b8';
      }
    }

    if (subCatEl) {
      if (curPreset.cathodeDepositMetal) {
        subCatEl.innerHTML = `Catot: <strong>A=${curPreset.A_cat}, n=${curPreset.n_cat}</strong>`;
      } else {
        subCatEl.innerHTML = `Catot: <strong>Khí ${curPreset.cathodeGas || 'H₂'} (n=${curPreset.n_cat})</strong>`;
      }
    }

    // 3. Tính sản phẩm giải phóng ở Anot (khí hoặc khối lượng Anot tan)
    const volAnEl = document.getElementById('calc-vol-an');
    const rowGasAnEl = document.getElementById('row-gas-anode');

    if (volAnEl && rowGasAnEl) {
      if (curPreset.anodeSoluble) {
        rowGasAnEl.style.display = 'flex';
        const massAn = (curPreset.A_an * currentAmps * elapsedSeconds) / (curPreset.n_an * FARADAY);
        volAnEl.textContent = `−${massAn.toFixed(4)} g (${curPreset.anodeMaterial.split(' ')[1] || 'Cu'} tan)`;
        volAnEl.style.color = '#ef4444';
      } else if (curPreset.anodeGas) {
        rowGasAnEl.style.display = 'flex';
        const vMl = getGasVolumeAnode();
        volAnEl.textContent = `+${vMl.toFixed(2)} mL (${curPreset.anodeGas} ↑)`;
        volAnEl.style.color = '#f59e0b';
      } else {
        rowGasAnEl.style.display = 'none';
      }
    }
  }

  function updateUI() {
    // Cập nhật nhãn và nút điều khiển
    const btnDc = document.getElementById('btn-toggle-dc');
    const hudStatus = document.getElementById('hud-status-badge');
    const hudVolt = document.getElementById('hud-voltage-text');
    const hudCurr = document.getElementById('hud-current-text');

    if (btnDc) {
      btnDc.classList.toggle('active', isPowered);
      btnDc.innerHTML = `⚡ Nguồn DC (Khóa K): <strong>${isPowered ? 'BẬT (Đang Chạy)' : 'TẮT (Ngắt Mạch)'}</strong>`;
    }

    if (hudStatus) {
      hudStatus.className = `hud-dc-tag ${isPowered ? 'running' : 'stopped'}`;
      hudStatus.textContent = isPowered ? 'ĐANG ĐIỆN PHÂN' : 'MẠCH HỞ (TẮT NGUỒN)';
    }

    if (hudVolt) hudVolt.textContent = `${voltage.toFixed(1)} V`;
    if (hudCurr) hudCurr.textContent = `${(isPowered ? currentAmps : 0).toFixed(2)} A`;

    // Cập nhật phương trình phản ứng
    const rxnCat = document.getElementById('text-rxn-cat');
    const rxnAn = document.getElementById('text-rxn-an');
    const rxnOver = document.getElementById('text-rxn-overall');

    if (rxnCat) rxnCat.textContent = curPreset.catHalfRxn;
    if (rxnAn) rxnAn.textContent = curPreset.anHalfRxn;
    if (rxnOver) rxnOver.textContent = curPreset.overallRxn;

    // Cập nhật checkbox màng ngăn
    const chkDia = document.getElementById('check-diaphragm');
    if (chkDia) chkDia.checked = hasDiaphragm;
  }

  /* ─────────────────────────────────────────────────────────────
     8. CÁC HÀM XỬ LÝ SỰ KIỆN GIAO DIỆN (INTERACTIONS)
  ───────────────────────────────────────────────────────────── */
  window.electrolysisTogglePower = function () {
    isPowered = !isPowered;
    updateUI();
  };

  window.electrolysisTogglePolarity = function () {
    polarityReversed = !polarityReversed;
    // Xóa các bọt khí cũ khi đảo cực
    bubblesLeft = [];
    bubblesRight = [];
    updateUI();
  };

  window.electrolysisResetTime = function () {
    elapsedSeconds = 0;
    updateFaradayCalculations();
  };

  window.electrolysisSelectPreset = function (presetId) {
    const found = PRESETS.find(p => p.id === presetId);
    if (!found) return;

    curPreset = found;
    voltage = found.defaultU;
    currentAmps = found.defaultI;
    hasDiaphragm = found.hasDiaphragm;
    elapsedSeconds = 0;
    bubblesLeft = [];
    bubblesRight = [];

    // Cập nhật giá trị hiển thị trên slider
    const sI = document.getElementById('slider-current');
    const sU = document.getElementById('slider-voltage');
    const vI = document.getElementById('val-slider-i');
    const vU = document.getElementById('val-slider-u');

    if (sI) sI.value = currentAmps;
    if (sU) sU.value = voltage;
    if (vI) vI.textContent = `${currentAmps.toFixed(1)} A`;
    if (vU) vU.textContent = `${voltage.toFixed(1)} V`;

    updateUI();
  };

  window.electrolysisSetCurrent = function (val) {
    currentAmps = parseFloat(val);
    const txt = document.getElementById('val-slider-i');
    if (txt) txt.textContent = `${currentAmps.toFixed(1)} A`;
    updateUI();
  };

  window.electrolysisSetVoltage = function (val) {
    voltage = parseFloat(val);
    const txt = document.getElementById('val-slider-u');
    if (txt) txt.textContent = `${voltage.toFixed(1)} V`;
    updateUI();
  };

  window.electrolysisSetSpeed = function (val) {
    speedMultiplier = parseInt(val, 10);
    const txt = document.getElementById('val-slider-speed');
    if (txt) txt.textContent = `${speedMultiplier}×`;
  };

  window.electrolysisToggleDiaphragm = function (checked) {
    hasDiaphragm = checked;
  };

  window.electrolysisToggleFullscreen = function () {
    const wrapper = document.querySelector('.electrolysis-wrapper');
    if (!wrapper) return;

    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (wrapper.requestFullscreen) {
        wrapper.requestFullscreen().catch(() => {
          wrapper.classList.toggle('is-fullscreen');
          updateFullscreenStateEl(wrapper.classList.contains('is-fullscreen'));
        });
      } else if (wrapper.webkitRequestFullscreen) {
        wrapper.webkitRequestFullscreen();
      } else {
        wrapper.classList.toggle('is-fullscreen');
        updateFullscreenStateEl(wrapper.classList.contains('is-fullscreen'));
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  };

  function updateFullscreenStateEl(isFull) {
    const btn = document.getElementById('btn-fullscreen-el');
    if (btn) {
      btn.innerHTML = isFull ? '🗗 Thu Nhỏ Màn Hình' : '⛶ Toàn Màn Hình';
      btn.classList.toggle('active', isFull);
    }
    const wrapper = document.querySelector('.electrolysis-wrapper');
    if (wrapper) {
      wrapper.classList.toggle('is-fullscreen', isFull);
    }
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 120);
  }

  document.addEventListener('fullscreenchange', () => {
    updateFullscreenStateEl(!!document.fullscreenElement);
  });
  document.addEventListener('webkitfullscreenchange', () => {
    updateFullscreenStateEl(!!document.webkitFullscreenElement);
  });

  // Khởi tạo khi trang tải
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      buildElectrolysisUI();
    });
  } else {
    buildElectrolysisUI();
  }

  window.addEventListener('resize', () => {
    const c = document.getElementById('electrolysis-canvas');
    if (c && c.offsetParent !== null) {
      renderCanvas();
    }
  });

})();
