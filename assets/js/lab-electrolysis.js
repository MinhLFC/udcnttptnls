/**
 * ==============================================================================
 * PHÒNG THÍ NGHIỆM HÓA HỌC ẢO: BÌNH ĐIỆN PHÂN DUNG DỊCH & NÓNG CHẢY (HÓA HỌC 12)
 * Tính năng chính:
 * 1. Danh mục 7 bài thí nghiệm chuẩn SGK (kèm điều chế NƯỚC JAVEL khi không có màng ngăn)
 * 2. Phông chữ to rõ, độ tương phản cao, tối ưu tuyệt đối cho máy chiếu lớp học
 * 3. Lưu giữ nguyên kết quả khối lượng Catot & thể tích khí Anot khi tạm dừng
 * 4. Cân phân tích điện tử (0.0001 g) đặt trên bàn thí nghiệm: Cân Catot/Anot trước & sau pư
 * 5. Hệ thống hạt ion phát sáng lớn có nhãn rõ nét (kèm ion ClO⁻ của nước Javel)
 * 6. Bọt khí, mạ kim loại dày lên, Anot tan, màng ngăn xốp & định luật Faraday
 * ==============================================================================
 */

(function () {
  'use strict';

  // Hằng số Faraday (C/mol) và khối lượng que điện cực ban đầu
  const FARADAY = 96485;
  const INITIAL_ELECTRODE_MASS = 10.0000; // m0 = 10.0000 g

  /* ─────────────────────────────────────────────────────────────
     DANH MỤC 7 BÀI THÍ NGHIỆM ĐIỆN PHÂN CHUẨN SGK HÓA HỌC 12
  ───────────────────────────────────────────────────────────── */
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
      defaultU: 6.0,
      defaultI: 2.5,
      catHalfRxn: 'Cu²⁺ + 2e → Cu ↓ (Đồng đỏ bám lên Catot)',
      anHalfRxn: '2H₂O → O₂ ↑ + 4H⁺ + 4e (Khí O₂ sủi bọt, tạo môi trường axit)',
      overallRxn: '2CuSO₄ + 2H₂O ➔ 2Cu ↓ + O₂ ↑ + 2H₂SO₄',
      desc: 'Điện phân dung dịch CuSO₄ với điện cực trơ: Cu²⁺ bị khử tạo đồng đỏ bám ở Catot, H₂O bị oxi hóa tạo khí O₂ thoát ra ở Anot. Màu xanh dung dịch nhạt dần.',
      ions: [
        { s: 'Cu²⁺', q: 2, c: '#38bdf8', r: 17, isTargetCat: true },
        { s: 'SO₄²⁻', q: -2, c: '#eab308', r: 17, isTargetAn: false },
        { s: 'H⁺', q: 1, c: '#f87171', r: 13, isTargetCat: false },
        { s: 'OH⁻', q: -1, c: '#34d399', r: 14, isTargetAn: true }
      ]
    },
    {
      id: 'nacl_diaphragm',
      name: '2. ĐP dung dịch NaCl (Có màng ngăn xốp - Sản xuất Xút/Clo)',
      shortTitle: 'NaCl (Có màng ngăn)',
      solName: 'Dung dịch NaCl bão hòa (+ Phenolphthalein)',
      solColor: 'rgba(236, 72, 153, 0.28)', // Hồng phớt do OH- sinh ra
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
      overallRxn: '2NaCl + 2H₂O ➔ 2NaOH + H₂ ↑ + Cl₂ ↑ (Có màng ngăn xốp)',
      desc: 'Sản xuất Xút (NaOH), khí Clo và Hydro trong công nghiệp. Màng ngăn xốp ngăn Cl₂ tiếp xúc với NaOH để tránh tạo nước Javel.',
      ions: [
        { s: 'Na⁺', q: 1, c: '#c084fc', r: 16, isTargetCat: false },
        { s: 'Cl⁻', q: -1, c: '#4ade80', r: 16, isTargetAn: true },
        { s: 'H⁺', q: 1, c: '#f87171', r: 13, isTargetCat: true },
        { s: 'OH⁻', q: -1, c: '#f43f5e', r: 14, isTargetAn: false }
      ]
    },
    {
      id: 'nacl_nodim_javel',
      name: '3. ĐP dung dịch NaCl KHÔNG màng ngăn (Điều chế Nước Javel - Tẩy màu)',
      shortTitle: 'NaCl (Không màng ngăn - Nước Javel)',
      solName: 'Nước Javel (Hỗn hợp NaCl + NaClO - Tẩy màu)',
      solColor: 'rgba(254, 240, 138, 0.35)', // Vàng rơm nhạt nước Javel, mất màu hồng phenolphthalein do NaClO tẩy trắng
      hasDiaphragm: false,
      cathodeMaterial: 'Sắt / Than chì',
      anodeMaterial: 'Graphite / Titan',
      cathodeDepositMetal: null,
      cathodeGas: 'H₂', // Khí H2 sủi bọt
      anodeGas: null,  // Cl2 tan và phản ứng ngay với NaOH trong dung dịch
      anodeSoluble: false,
      A_cat: 2,   // H2
      n_cat: 2,
      A_an: 74.5, // NaClO
      n_an: 2,
      defaultU: 5.0,
      defaultI: 3.0,
      catHalfRxn: '2H₂O + 2e → H₂ ↑ + 2OH⁻ (Khí H₂ sủi bọt ở Catot)',
      anHalfRxn: '2Cl⁻ → Cl₂ + 2e, sau đó Cl₂ + 2OH⁻ → Cl⁻ + ClO⁻ + H₂O (Tạo nước Javel)',
      overallRxn: 'NaCl + H₂O ➔ NaClO + H₂ ↑ (Không màng ngăn tạo Nước Javel tẩy màu)',
      desc: 'Khi không có màng ngăn, khí Cl₂ vừa sinh ra ở Anot phản ứng ngay với dung dịch NaOH kiềm sinh ra ở Catot tạo thành Nước Javel (hỗn hợp NaCl và NaClO). Muối NaClO có tính oxi hóa cực mạnh làm mất màu (tẩy trắng) phenolphthalein!',
      ions: [
        { s: 'Na⁺', q: 1, c: '#c084fc', r: 16, isTargetCat: false },
        { s: 'Cl⁻', q: -1, c: '#4ade80', r: 16, isTargetAn: true },
        { s: 'ClO⁻', q: -1, c: '#f59e0b', r: 17, isTargetAn: false },
        { s: 'H⁺', q: 1, c: '#f87171', r: 13, isTargetCat: true },
        { s: 'OH⁻', q: -1, c: '#34d399', r: 14, isTargetAn: false }
      ]
    },
    {
      id: 'cu_active',
      name: '4. ĐP dung dịch CuSO₄ (Anot tan Cu - Mạ điện & Tinh luyện)',
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
      desc: 'Ứng dụng trong mạ điện và tinh chế đồng kỹ thuật đạt độ tinh khiết 99.99%. Anot tan đúng bằng lượng đồng bám ở Catot.',
      ions: [
        { s: 'Cu²⁺', q: 2, c: '#38bdf8', r: 17, isTargetCat: true },
        { s: 'SO₄²⁻', q: -2, c: '#eab308', r: 17, isTargetAn: false },
        { s: 'H⁺', q: 1, c: '#f87171', r: 13, isTargetCat: false }
      ]
    },
    {
      id: 'ag_electroplate',
      name: '5. Mạ bạc (Dung dịch AgNO₃ - Anot bạc Ag)',
      shortTitle: 'AgNO₃ (Mạ bạc)',
      solName: 'Dung dịch AgNO₃ 0.5M',
      solColor: 'rgba(241, 245, 249, 0.35)', // Trong suốt ánh bạc
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
      desc: 'Công nghệ mạ điện bạc: Lớp bạc mạ bám chắc, bóng mịn trên bề mặt chi tiết kim loại cần mạ tại Catot.',
      ions: [
        { s: 'Ag⁺', q: 1, c: '#e2e8f0', r: 17, isTargetCat: true },
        { s: 'NO₃⁻', q: -1, c: '#fb923c', r: 16, isTargetAn: false },
        { s: 'H⁺', q: 1, c: '#f87171', r: 13, isTargetCat: false },
        { s: 'OH⁻', q: -1, c: '#34d399', r: 14, isTargetAn: false }
      ]
    },
    {
      id: 'water_splitting',
      name: '6. Điện phân nước (H₂O dung dịch H₂SO₄ loãng - Tỉ lệ 2:1)',
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
      desc: 'Điện phân nước tạo khí Hydro và Oxy tinh khiết. Thể tích khí H₂ thu được ở Catot luôn gấp 2 lần thể tích khí O₂ ở Anot.',
      ions: [
        { s: 'H⁺', q: 1, c: '#f87171', r: 13, isTargetCat: true },
        { s: 'SO₄²⁻', q: -2, c: '#eab308', r: 17, isTargetAn: false },
        { s: 'OH⁻', q: -1, c: '#38bdf8', r: 14, isTargetAn: true }
      ]
    },
    {
      id: 'molten_nacl',
      name: '7. Điện phân nóng chảy NaCl (Nhiệt độ cao ~800°C)',
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
      desc: 'Phương pháp duy nhất điều chế kim loại kiềm mạnh (Na, K, Ca, Al). Không có nước tham gia, cation kim loại bị khử trực tiếp thành kim loại tự do.',
      ions: [
        { s: 'Na⁺', q: 1, c: '#c084fc', r: 17, isTargetCat: true },
        { s: 'Cl⁻', q: -1, c: '#4ade80', r: 17, isTargetAn: true }
      ]
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

  // Trạng thái cân điện tử: null | 'cathode' | 'anode'
  let weighingTarget = null;

  // Hệ thống hạt mô phỏng đồ họa Canvas
  let canvas, ctx;
  let animId = null;
  let lastFrameTime = performance.now();
  let electrons = [];
  let bubblesLeft = [];
  let bubblesRight = [];
  let ions = [];
  let ionSparks = [];

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
    weighingTarget = null;

    container.innerHTML = `
      <div class="electrolysis-wrapper">
        
        <!-- Topbar điều khiển & Trạng thái -->
        <div class="electrolysis-topbar">
          <div class="electrolysis-title-box">
            <span class="electrolysis-badge">Hóa Học 12 — Chuyên Đề Điện Phân</span>
            <div style="font-size: 1.12rem; font-weight: 800; color: var(--text-main);">
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
            <button class="electrolysis-btn btn-weigh ${weighingTarget === 'cathode' ? 'active' : ''}" id="btn-top-weigh-cat" onclick="electrolysisWeighElectrode('cathode')" title="Nhấc Catot đặt lên cân phân tích điện tử">
              ⚖️ Cân Catot
            </button>
            <button class="electrolysis-btn btn-weigh ${weighingTarget === 'anode' ? 'active' : ''}" id="btn-top-weigh-an" onclick="electrolysisWeighElectrode('anode')" title="Nhấc Anot đặt lên cân phân tích điện tử">
              ⚖️ Cân Anot
            </button>
            <button class="electrolysis-btn btn-return ${weighingTarget ? 'active' : ''}" id="btn-top-return" onclick="electrolysisReturnElectrode()" title="Đưa thanh điện cực trở lại bình điện phân">
              ↩ Đặt Lại Vào Bình
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
              <canvas id="electrolysis-canvas" width="880" height="520"></canvas>
            </div>
            
            <div class="electrolysis-canvas-hud">
              <div class="hud-dc-display">
                <span>NGUỒN DC:</span>
                <span class="hud-dc-val" id="hud-voltage-text">${voltage.toFixed(1)} V</span>
                <span class="hud-dc-val" id="hud-current-text" style="color: #10b981;">${currentAmps.toFixed(2)} A</span>
                <span class="hud-dc-tag ${isPowered ? 'running' : 'stopped'}" id="hud-status-badge">
                  ${isPowered ? 'ĐANG ĐIỆN PHÂN' : (weighingTarget ? 'ĐANG CÂN ĐIỆN CỰC' : 'TẠM DỪNG (GIỮ SỐ LIỆU)')}
                </span>
              </div>
              
              <div style="display: flex; gap: 1rem; align-items: center; font-family: monospace; font-size: 1.05rem; flex-wrap: wrap;">
                <span>⏱ Thời gian: <strong id="hud-time-text" style="color: #38bdf8; font-size: 1.25rem;">00:00</strong></span>
                <span>⚡ Điện lượng Q: <strong id="hud-q-text" style="color: #fbbf24; font-size: 1.25rem;">0 C</strong></span>
                <span style="color: #a7f3d0; border-left: 2px solid #334155; padding-left: 0.85rem;">
                  ⚖️ Cân: <strong id="hud-scale-text" style="color: #34d399; font-size: 1.25rem;">0.0000 g</strong>
                </span>
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
                <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.95rem; font-weight: 700; cursor: pointer; color: var(--text-main);">
                  <input type="checkbox" id="check-diaphragm" ${hasDiaphragm ? 'checked' : ''} onchange="electrolysisToggleDiaphragm(this.checked)" style="width: 19px; height: 19px; cursor: pointer;">
                  <span>Gắn Màng Ngăn Xốp</span>
                </label>
                <small id="text-diaphragm-hint" style="font-size: 0.78rem; color: ${hasDiaphragm ? 'var(--text-muted)' : '#f59e0b'};">
                  ${hasDiaphragm ? 'Cần thiết cho sản xuất NaOH/Cl₂' : '⚠️ Bỏ màng ngăn: tạo NƯỚC JAVEL (NaClO)'}
                </small>
              </div>

            </div>

            <!-- Khung Cân Phân Tích Điện Tử -->
            <div class="weigh-ctrl-box">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 800; font-size: 0.98rem; color: var(--text-main); display: flex; align-items: center; gap: 0.4rem;">
                  <span>⚖️</span> CÂN PHÂN TÍCH ĐIỆN TỬ (0.0001 g):
                </span>
                <span id="weigh-status-text" style="font-size: 0.85rem; font-weight: 800; color: #10b981; background: rgba(16,185,129,0.15); padding: 0.2rem 0.6rem; border-radius: 4px;">
                  ${weighingTarget ? 'ĐANG CÂN' : 'SẴN SÀNG'}
                </span>
              </div>
              <div class="weigh-btns-wrap">
                <button type="button" class="electrolysis-btn btn-weigh ${weighingTarget === 'cathode' ? 'active' : ''}" id="btn-card-weigh-cat" onclick="electrolysisWeighElectrode('cathode')" style="flex: 1; font-size: 0.92rem; padding: 0.55rem;">
                  ⚖️ Cân Catot
                </button>
                <button type="button" class="electrolysis-btn btn-weigh ${weighingTarget === 'anode' ? 'active' : ''}" id="btn-card-weigh-an" onclick="electrolysisWeighElectrode('anode')" style="flex: 1; font-size: 0.92rem; padding: 0.55rem;">
                  ⚖️ Cân Anot
                </button>
                <button type="button" class="electrolysis-btn btn-return ${weighingTarget ? 'active' : ''}" id="btn-card-return" onclick="electrolysisReturnElectrode()" style="font-size: 0.92rem; padding: 0.55rem;">
                  ↩ Vào Bình
                </button>
              </div>
              <div id="weigh-detail-info" style="font-size: 0.92rem; font-weight: 700; color: var(--text-main); font-family: monospace; background: rgba(0,0,0,0.22); padding: 0.45rem 0.75rem; border-radius: 6px;">
                Que ban đầu m₀ = 10.0000 g | Bấm 'Cân Catot' để xem số đo
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
                <div class="faraday-eq-row" style="margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px dashed var(--border-color);">
                  <span id="label-faraday-cat">Khối lượng Catot tăng (m):</span>
                  <strong class="faraday-val" id="calc-mass-cat" style="font-size: 1.35rem;">+0.0000 g</strong>
                </div>
                <div class="faraday-eq-row" id="row-gas-anode" style="margin-top: 0.4rem;">
                  <span id="label-faraday-an">Thể tích khí Anot (V đkc, 25°C):</span>
                  <strong class="faraday-val" id="calc-vol-an" style="color: #f59e0b; font-size: 1.35rem;">+0.00 mL</strong>
                </div>
              </div>

              <!-- Thẻ Bán Phản ứng Catot và Anot -->
              <div class="rxn-box-grid">
                <div class="rxn-card cathode" id="card-rxn-cat">
                  <h5>🔵 CATOT (−) — Sự Khử</h5>
                  <div id="text-rxn-cat" style="font-family: 'Cambria Math', serif; font-size: 1.05rem; font-weight: 700;">${curPreset.catHalfRxn}</div>
                </div>
                <div class="rxn-card anode" id="card-rxn-an">
                  <h5>🔴 ANOT (+) — Sự Oxi Hóa</h5>
                  <div id="text-rxn-an" style="font-family: 'Cambria Math', serif; font-size: 1.05rem; font-weight: 700;">${curPreset.anHalfRxn}</div>
                </div>
              </div>

              <div class="rxn-overall">
                <strong style="font-size: 1.02rem;">Phương trình điện phân tổng quát:</strong><br>
                <span id="text-rxn-overall" style="font-family: 'Cambria Math', serif; font-weight: 800; color: var(--text-main); font-size: 1.15rem; display: inline-block; margin-top: 0.3rem;">
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
                  <td><strong>Khẩu quyết</strong></td>
                  <td>"Anode luôn oxi hóa, Cathode luôn khử"</td>
                  <td>"Dấu cực bị đảo ngược so với Pin"</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="e-k-card">
            <h4><span>🏭</span> Ứng Dụng Thực Tiễn Quan Trọng Của Điện Phân</h4>
            <ul>
              <li><strong>Điều chế Nước Javel (Không màng ngăn):</strong> Điện phân dung dịch NaCl không màng ngăn để khí Cl₂ phản ứng trực tiếp với NaOH tạo hỗn hợp muối NaCl và NaClO (nước Javel) tẩy trắng, diệt khuẩn cực mạnh.</li>
              <li><strong>Sản xuất Xút - Clo (Có màng ngăn):</strong> Màng ngăn xốp ngăn Cl₂ tiếp xúc NaOH, thu được hàng triệu tấn hóa chất công nghiệp cơ bản mỗi năm.</li>
              <li><strong>Mạ điện (Electroplating):</strong> Mạ vàng, bạc, crom, niken bảo vệ kim loại chống ăn mòn và làm tăng vẻ đẹp thẩm mỹ (Catot là vật cần mạ, Anot là kim loại mạ).</li>
              <li><strong>Tinh luyện kim loại:</strong> Tinh chế đồng kỹ thuật thô đạt độ tinh khiết cực cao (99.99%) để làm dây cáp điện cao thế.</li>
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
    initIons();
    updateUI();
    startSimulationLoop();
  }

  /* ─────────────────────────────────────────────────────────────
     2. HỆ THỐNG HẠT ĐỒ HỌA (ELECTRON & BỌT KHÍ & ION)
  ───────────────────────────────────────────────────────────── */
  function initParticleEngine() {
    electrons = [];
    bubblesLeft = [];
    bubblesRight = [];
    ionSparks = [];

    // Tạo 22 electron chạy dọc dây dẫn ngoài
    for (let i = 0; i < 22; i++) {
      electrons.push({ progress: i / 22 });
    }
  }

  function initIons() {
    ions = [];
    if (!curPreset.ions || curPreset.ions.length === 0) return;

    // Vùng chứa dung dịch trong bình điện phân
    const solX = 55 + 14;
    const solY = 210 + 44;
    const solW = 440 - 28;
    const solH = 245 - 52;

    const templateIons = curPreset.ions;
    const targetCount = 20;

    for (let i = 0; i < targetCount; i++) {
      const tmpl = templateIons[i % templateIons.length];
      ions.push({
        s: tmpl.s,
        q: tmpl.q,
        c: tmpl.c,
        r: tmpl.r || 16,
        isTargetCat: !!tmpl.isTargetCat,
        isTargetAn: !!tmpl.isTargetAn,
        x: solX + 24 + Math.random() * (solW - 48),
        y: solY + 18 + Math.random() * (solH - 36),
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.5) * 16
      });
    }
  }

  function spawnBubbles() {
    if (!isPowered || weighingTarget !== null) return;

    const leftIsCathode = !polarityReversed;
    const gasLeft = leftIsCathode ? curPreset.cathodeGas : curPreset.anodeGas;
    const gasRight = !leftIsCathode ? curPreset.cathodeGas : curPreset.anodeGas;

    // Sinh bọt khí bên trái (x = 127)
    if (gasLeft && Math.random() < 0.38) {
      bubblesLeft.push({
        x: 127 + (Math.random() - 0.5) * 22,
        y: 410 - Math.random() * 110,
        r: 2.5 + Math.random() * 4,
        speedY: 1.5 + Math.random() * 2.5,
        driftX: (Math.random() - 0.5) * 0.8,
        gasType: gasLeft
      });
    }

    // Sinh bọt khí bên phải (x = 423)
    if (gasRight && Math.random() < 0.38) {
      bubblesRight.push({
        x: 423 + (Math.random() - 0.5) * 22,
        y: 410 - Math.random() * 110,
        r: 2.5 + Math.random() * 4,
        speedY: 1.5 + Math.random() * 2.5,
        driftX: (Math.random() - 0.5) * 0.8,
        gasType: gasRight
      });
    }
  }

  function updateIons(dt) {
    const solX = 55 + 14;
    const solY = 210 + 44;
    const solW = 440 - 28;
    const solH = 245 - 52;

    const leftIsCathode = !polarityReversed;
    const rodLeftCenterX = 127;
    const rodRightCenterX = 423;
    const diaphragmX = 55 + 220;

    const catX = leftIsCathode ? rodLeftCenterX : rodRightCenterX;
    const anX = leftIsCathode ? rodRightCenterX : rodLeftCenterX;

    const circuitClosed = isPowered && weighingTarget === null;

    ions.forEach(ion => {
      if (circuitClosed) {
        // Có điện trường: Cation (+) bơi về Catot, Anion (-) bơi về Anot
        const targetX = ion.q > 0 ? catX : anX;
        const dir = targetX > ion.x ? 1 : -1;
        const eForce = (42 + Math.abs(ion.q) * 26) * dir;

        ion.vx += eForce * dt + (Math.random() - 0.5) * 25 * dt;
        ion.vy += (Math.random() - 0.5) * 25 * dt;

        ion.vx = Math.max(-65, Math.min(65, ion.vx));
        ion.vy = Math.max(-30, Math.min(30, ion.vy));

        const distCat = Math.abs(ion.x - catX);
        const distAn = Math.abs(ion.x - anX);

        if (ion.q > 0 && distCat < 16) {
          if (ion.isTargetCat && Math.random() < 0.08) {
            ionSparks.push({ x: catX + (Math.random() - 0.5) * 10, y: ion.y, life: 1.0, color: ion.c });
            ion.x = diaphragmX + (Math.random() - 0.5) * 60;
            ion.y = solY + 20 + Math.random() * (solH - 40);
            ion.vx = (Math.random() - 0.5) * 10;
          } else {
            ion.vx *= -0.5;
          }
        } else if (ion.q < 0 && distAn < 16) {
          if (ion.isTargetAn && Math.random() < 0.08) {
            ionSparks.push({ x: anX + (Math.random() - 0.5) * 10, y: ion.y, life: 1.0, color: ion.c });
            ion.x = diaphragmX + (Math.random() - 0.5) * 60;
            ion.y = solY + 20 + Math.random() * (solH - 40);
            ion.vx = (Math.random() - 0.5) * 10;
          } else {
            ion.vx *= -0.5;
          }
        }

      } else {
        // Tắt điện: chuyển động nhiệt hỗn loạn (Brownian motion)
        ion.vx += (Math.random() - 0.5) * 35 * dt;
        ion.vy += (Math.random() - 0.5) * 35 * dt;
        ion.vx *= 0.985;
        ion.vy *= 0.985;
      }

      ion.x += ion.vx * dt;
      ion.y += ion.vy * dt;

      if (ion.x < solX + ion.r) {
        ion.x = solX + ion.r;
        ion.vx = Math.abs(ion.vx) * 0.8;
      } else if (ion.x > solX + solW - ion.r) {
        ion.x = solX + solW - ion.r;
        ion.vx = -Math.abs(ion.vx) * 0.8;
      }

      if (ion.y < solY + ion.r) {
        ion.y = solY + ion.r;
        ion.vy = Math.abs(ion.vy) * 0.8;
      } else if (ion.y > solY + solH - ion.r) {
        ion.y = solY + solH - ion.r;
        ion.vy = -Math.abs(ion.vy) * 0.8;
      }

      // Xử lý màng ngăn xốp
      if (hasDiaphragm) {
        const diaL = diaphragmX - 6;
        const diaR = diaphragmX + 6;
        if (ion.x > diaL - ion.r && ion.x < diaR + ion.r) {
          if ((ion.s === 'H⁺' || ion.s === 'OH⁻') && Math.random() < 0.1) {
            // Cho qua
          } else {
            ion.vx *= -1;
            ion.x = ion.vx > 0 ? diaR + ion.r : diaL - ion.r;
          }
        }
      }
    });

    for (let i = ionSparks.length - 1; i >= 0; i--) {
      ionSparks[i].life -= dt * 2.5;
      if (ionSparks[i].life <= 0) {
        ionSparks.splice(i, 1);
      }
    }
  }

  /* ─────────────────────────────────────────────────────────────
     3. VÒNG LẶP MÔ PHỎNG VÀ VẼ CANVAS (SIMULATION LOOP)
  ───────────────────────────────────────────────────────────── */
  function startSimulationLoop() {
    if (animId) cancelAnimationFrame(animId);

    function loop(timestamp) {
      const dt = Math.min(0.05, (timestamp - lastFrameTime) * 0.001);
      lastFrameTime = timestamp;

      if (isPowered && weighingTarget === null) {
        elapsedSeconds += dt * speedMultiplier;
        spawnBubbles();
      }

      updateIons(dt);
      updateFaradayCalculations();
      renderCanvas();

      animId = requestAnimationFrame(loop);
    }

    lastFrameTime = performance.now();
    animId = requestAnimationFrame(loop);
  }

  function renderCanvas() {
    if (!ctx || !canvas) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const leftIsCathode = !polarityReversed;

    // 1. Mặt bàn phòng thí nghiệm & phông nền
    drawTable(w, h);

    // 2. Bộ nguồn DC ở góc trên bên trái
    const psX = 130;
    const psY = 18;
    const psW = 280;
    const psH = 96;
    drawPowerSupply(psX, psY, psW, psH);

    // 3. Bình điện phân dung dịch ở phía dưới bên trái
    const cupX = 55;
    const cupY = 210;
    const cupW = 440;
    const cupH = 245;
    drawElectrolyticCell(cupX, cupY, cupW, cupH, leftIsCathode);

    // 4. Cân phân tích điện tử (0.0001 g) ở bên phải mặt bàn
    const scaleX = 535;
    const scaleY = 190;
    const scaleW = 310;
    const scaleH = 270;
    drawDigitalScale(scaleX, scaleY, scaleW, scaleH, leftIsCathode);

    // 5. Dây dẫn điện nối từ Bộ nguồn DC
    drawWiresAndElectrons(psX, psY, psW, psH, cupX, cupY, cupW, leftIsCathode);
  }

  /* ─────────────────────────────────────────────────────────────
     4. HỌA VẼ BÀN THÍ NGHIỆM & BỘ NGUỒN DC
  ───────────────────────────────────────────────────────────── */
  function drawTable(w, h) {
    const tableY = 460;
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

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, w, h, 10) : ctx.rect(x, y, w, h);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '900 13px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('DC POWER SUPPLY (NGUỒN 1 CHIỀU)', x + 14, y + 21);

    const dispX = x + 14;
    const dispY = y + 29;
    const dispW = 142;
    const dispH = 60;

    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(dispX, dispY, dispW, dispH, 6) : ctx.rect(dispX, dispY, dispW, dispH);
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.stroke();

    const circuitActive = isPowered && weighingTarget === null;

    ctx.font = '900 22px "Courier New", monospace';
    ctx.fillStyle = circuitActive ? '#ef4444' : '#52525b';
    ctx.fillText(`${voltage.toFixed(1)} V`, dispX + 10, dispY + 25);

    ctx.fillStyle = circuitActive ? '#10b981' : '#52525b';
    ctx.fillText(`${(circuitActive ? currentAmps : 0).toFixed(2)} A`, dispX + 10, dispY + 50);

    const switchX = x + 185;
    const switchY = y + 56;
    ctx.fillStyle = circuitActive ? '#10b981' : '#ef4444';
    ctx.beginPath();
    ctx.arc(switchX, switchY, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 13px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(circuitActive ? 'BẬT' : 'TẮT', switchX, switchY + 25);

    const termLeftX = x + 228;
    const termRightX = x + 263;
    const termY = y + 56;

    const leftIsPositive = polarityReversed;
    const rightIsPositive = !polarityReversed;

    drawTerminalJack(termLeftX, termY, leftIsPositive ? '#dc2626' : '#1e293b', leftIsPositive ? '+' : '−');
    drawTerminalJack(termRightX, termY, rightIsPositive ? '#dc2626' : '#1e293b', rightIsPositive ? '+' : '−');

    ctx.restore();
  }

  function drawTerminalJack(x, y, color, sign) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 15px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sign, x, y);
  }

  /* ─────────────────────────────────────────────────────────────
     5. HỌA VẼ BÌNH ĐIỆN PHÂN DUNG DỊCH, ION & 2 ĐIỆN CỰC
  ───────────────────────────────────────────────────────────── */
  function drawElectrolyticCell(x, y, w, h, leftIsCathode) {
    ctx.save();

    // 1. Thân Cốc Thủy Tinh (Beaker)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x + w, y);
    ctx.stroke();

    ctx.lineWidth = 4;
    ctx.strokeStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(x - 8, y);
    ctx.lineTo(x + w + 8, y);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1.5;
    for (let i = 1; i <= 6; i++) {
      const markY = y + h - i * 32;
      ctx.beginPath();
      ctx.moveTo(x + 5, markY);
      ctx.lineTo(x + (i % 2 === 0 ? 20 : 12), markY);
      ctx.stroke();
    }

    // 2. Dung dịch điện phân bên trong cốc
    const solY = y + 42;
    const solH = h - 45;
    const solGrad = ctx.createLinearGradient(x, solY, x, y + h);
    solGrad.addColorStop(0, curPreset.solColor);
    solGrad.addColorStop(1, 'rgba(15, 23, 42, 0.9)');

    ctx.fillStyle = solGrad;
    ctx.fillRect(x + 4, solY, w - 8, solH);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 4, solY);
    ctx.lineTo(x + w - 4, solY);
    ctx.stroke();

    // 3. Màng ngăn xốp (nếu có)
    if (hasDiaphragm) {
      const midX = x + w / 2;
      ctx.fillStyle = 'rgba(251, 191, 36, 0.65)';
      ctx.fillRect(midX - 6, y + 25, 12, h - 25);
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(midX - 6, y + 25, 12, h - 25);

      ctx.fillStyle = '#78350f';
      for (let py = y + 35; py < y + h - 10; py += 14) {
        ctx.beginPath();
        ctx.arc(midX, py, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (curPreset.id === 'nacl_nodim_javel') {
      // Huy hiệu chú thích nước Javel trong bình
      ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';
      ctx.fillRect(x + 10, y + 46, w - 20, 24);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 10, y + 46, w - 20, 24);

      ctx.fillStyle = '#fef08a';
      ctx.font = '900 11.5px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✨ ĐANG ĐIỀU CHẾ NƯỚC JAVEL (NaCl + NaClO) • TẨY MÀU PHENOLPHTHALEIN', x + w / 2, y + 62);
    }

    // 4. Họa vẽ các hạt ion đang bơi trong dung dịch
    drawIonsInSolution();

    // 5. Tia sáng phản ứng tại bề mặt
    drawIonSparks();

    // 6. Nhãn tên dung dịch dưới đáy cốc
    const labelY = y + h + 24;
    ctx.font = '900 15px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    const textW = ctx.measureText(curPreset.solName).width;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x + w / 2 - textW / 2 - 14, labelY - 14, textW + 28, 28, 8) : ctx.rect(x + w / 2 - textW / 2 - 14, labelY - 14, textW + 28, 28);
    ctx.fill();
    ctx.strokeStyle = curPreset.id === 'nacl_nodim_javel' ? '#f59e0b' : '#38bdf8';
    ctx.lineWidth = 1.6;
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.fillText(curPreset.solName, x + w / 2, labelY + 5);

    // 7. Vẽ 2 Thanh điện cực nhúng vào cốc
    const rodW = 34;
    const rodH = 215;
    const rodLeftX = x + 55;
    const rodRightX = x + w - 55 - rodW;
    const rodY = y - 25;

    const faradayMass = getAccumulatedMass();
    const depositThickness = Math.min(rodW * 0.45, (faradayMass / 5.0) * 8);
    const dissolvedThickness = curPreset.anodeSoluble ? Math.min(rodW * 0.5, (faradayMass / 5.0) * 8) : 0;

    const leftIsWeighed = (leftIsCathode && weighingTarget === 'cathode') || (!leftIsCathode && weighingTarget === 'anode');
    if (!leftIsWeighed) {
      drawElectrode(
        rodLeftX, rodY, rodW, rodH,
        leftIsCathode,
        leftIsCathode ? curPreset.cathodeMaterial : curPreset.anodeMaterial,
        leftIsCathode ? depositThickness : 0,
        !leftIsCathode ? dissolvedThickness : 0,
        bubblesLeft
      );
    } else {
      drawEmptyElectrodeHolder(rodLeftX, rodY, rodW, leftIsCathode);
    }

    const rightIsWeighed = (!leftIsCathode && weighingTarget === 'cathode') || (leftIsCathode && weighingTarget === 'anode');
    if (!rightIsWeighed) {
      drawElectrode(
        rodRightX, rodY, rodW, rodH,
        !leftIsCathode,
        !leftIsCathode ? curPreset.cathodeMaterial : curPreset.anodeMaterial,
        !leftIsCathode ? depositThickness : 0,
        leftIsCathode ? dissolvedThickness : 0,
        bubblesRight
      );
    } else {
      drawEmptyElectrodeHolder(rodRightX, rodY, rodW, !leftIsCathode);
    }

    ctx.restore();
  }

  function drawEmptyElectrodeHolder(x, y, w, isCathode) {
    ctx.save();
    ctx.fillStyle = 'rgba(71, 85, 105, 0.45)';
    ctx.fillRect(x + 2, y, w - 4, 28);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(x + 2, y, w - 4, 28);

    ctx.fillStyle = '#f87171';
    ctx.font = '900 11.5px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('[ĐÃ CÂN]', x + w / 2, y + 18);
    ctx.restore();
  }

  function drawElectrode(x, y, w, h, isCathode, materialName, depositThick, dissolveThick, bubbleList) {
    ctx.save();

    const activeW = Math.max(12, w - dissolveThick);

    let rodColor = '#475569';
    if (materialName.includes('Cu')) rodColor = '#b45309';
    else if (materialName.includes('Ag')) rodColor = '#cbd5e1';
    else if (materialName.includes('Pt')) rodColor = '#94a3b8';

    ctx.fillStyle = rodColor;
    ctx.fillRect(x + dissolveThick / 2, y, activeW, h);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + dissolveThick / 2, y, activeW, h);

    if (depositThick > 0.4 && curPreset.cathodeDepositMetal) {
      const depColor = curPreset.cathodeDepositMetal === 'Cu' ? '#ea580c' : '#f8fafc';
      ctx.fillStyle = depColor;
      ctx.fillRect(x - depositThick / 2, y + 40, depositThick / 2, h - 40);
      ctx.fillRect(x + w, y + 40, depositThick / 2, h - 40);
      ctx.fillRect(x - depositThick / 2, y + h - depositThick / 2, w + depositThick, depositThick / 2);
    }

    const clipH = 18;
    const clipColor = isCathode ? '#1e293b' : '#dc2626';
    ctx.fillStyle = clipColor;
    ctx.fillRect(x - 5, y - clipH, w + 10, clipH);
    ctx.strokeStyle = isCathode ? '#64748b' : '#fca5a5';
    ctx.lineWidth = 1.8;
    ctx.strokeRect(x - 5, y - clipH, w + 10, clipH);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 12.5px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(isCathode ? 'CỰC (−)' : 'CỰC (+)', x + w / 2, y - 5);

    ctx.fillStyle = isCathode ? '#38bdf8' : '#f87171';
    ctx.font = '900 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(isCathode ? 'CATOT (−)' : 'ANOT (+)', x + w / 2, y - 27);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 13px "Plus Jakarta Sans", sans-serif';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 4;
    ctx.fillText(materialName.split(' ')[0], x + w / 2, y + 55);

    drawBubbles(bubbleList);

    ctx.restore();
  }

  function drawBubbles(bubbleList) {
    if (!bubbleList) return;
    for (let i = bubbleList.length - 1; i >= 0; i--) {
      const b = bubbleList[i];
      b.y -= b.speedY;
      b.x += b.driftX;

      if (b.gasType === 'Cl₂') {
        ctx.fillStyle = 'rgba(234, 179, 8, 0.75)';
        ctx.strokeStyle = '#ca8a04';
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.strokeStyle = '#93c5fd';
      }

      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.35, 0, Math.PI * 2);
      ctx.fill();

      if (b.y < 255) {
        bubbleList.splice(i, 1);
      }
    }
  }

  function drawIonsInSolution() {
    ctx.save();
    ions.forEach(ion => {
      ctx.shadowColor = ion.c;
      ctx.shadowBlur = 9;

      ctx.fillStyle = ion.c;
      ctx.beginPath();
      ctx.arc(ion.x, ion.y, ion.r, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 12.5px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(ion.s, ion.x, ion.y + 0.5);
    });
    ctx.restore();
  }

  function drawIonSparks() {
    ctx.save();
    ionSparks.forEach(sp => {
      ctx.fillStyle = sp.color;
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 12;
      ctx.globalAlpha = Math.max(0, sp.life);
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, 5 * sp.life, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  /* ─────────────────────────────────────────────────────────────
     6. HỌA VẼ CÂN PHÂN TÍCH ĐIỆN TỬ (0.0001 g)
  ───────────────────────────────────────────────────────────── */
  function drawDigitalScale(scaleX, scaleY, scaleW, scaleH, leftIsCathode) {
    ctx.save();

    const baseX = scaleX;
    const baseY = scaleY + 168;
    const baseW = scaleW;
    const baseH = 102;

    const shieldX = scaleX + 30;
    const shieldY = scaleY + 10;
    const shieldW = scaleW - 60;
    const shieldH = 160;

    ctx.fillStyle = 'rgba(224, 242, 254, 0.06)';
    ctx.fillRect(shieldX, shieldY, shieldW, shieldH);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
    ctx.lineWidth = 2;
    ctx.strokeRect(shieldX, shieldY, shieldW, shieldH);

    ctx.fillStyle = '#334155';
    ctx.fillRect(shieldX - 4, shieldY - 6, shieldW + 8, 8);

    ctx.fillStyle = '#64748b';
    ctx.fillRect(shieldX, shieldY, 4, shieldH);
    ctx.fillRect(shieldX + shieldW - 4, shieldY, 4, shieldH);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(shieldX + 15, shieldY + 15);
    ctx.lineTo(shieldX + 45, shieldY + shieldH - 20);
    ctx.stroke();

    const panX = shieldX + shieldW / 2;
    const panY = baseY - 8;
    const panW = 86;
    const panH = 9;

    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(panX - 4, panY, 8, baseY - panY);

    const panGrad = ctx.createLinearGradient(panX - panW / 2, panY, panX + panW / 2, panY);
    panGrad.addColorStop(0, '#94a3b8');
    panGrad.addColorStop(0.5, '#f8fafc');
    panGrad.addColorStop(1, '#64748b');

    ctx.fillStyle = panGrad;
    ctx.beginPath();
    ctx.ellipse(panX, panY, panW / 2, panH / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    if (weighingTarget !== null) {
      drawElectrodeOnScale(panX, panY, leftIsCathode);
    }

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(baseX, baseY, baseW, baseH, 8) : ctx.rect(baseX, baseY, baseW, baseH);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(baseX + 16, baseY + baseH, 18, 5);
    ctx.fillRect(baseX + baseW - 34, baseY + baseH, 18, 5);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '900 12.5px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('⚖️ METTLER TOLEDO • ANALYTICAL BALANCE (0.0001 g)', baseX + 14, baseY + 20);

    const dispX = baseX + 14;
    const dispY = baseY + 28;
    const dispW = baseW - 28;
    const dispH = 50;

    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(dispX, dispY, dispW, dispH, 6) : ctx.rect(dispX, dispY, dispW, dispH);
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.stroke();

    const scaleData = getScaleMeasurement(leftIsCathode);

    ctx.font = '900 30px "Courier New", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'right';
    ctx.fillText(`${scaleData.displayMass} g`, dispX + dispW - 14, dispY + 34);

    ctx.font = '900 12px "Plus Jakarta Sans", monospace';
    ctx.fillStyle = '#10b981';
    ctx.textAlign = 'left';
    ctx.fillText('● STABLE', dispX + 10, dispY + 19);

    ctx.font = '900 11px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(weighingTarget ? `[${weighingTarget.toUpperCase()}]` : '[TARE]', dispX + 10, dispY + 38);

    ctx.font = '900 13px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(scaleData.subText, baseX + baseW / 2, baseY + 91);

    ctx.restore();
  }

  function getScaleMeasurement(leftIsCathode) {
    if (weighingTarget === 'cathode') {
      const mCat = getAccumulatedMass();
      const totalM = INITIAL_ELECTRODE_MASS + mCat;
      const metalName = curPreset.cathodeDepositMetal || 'chất bám';
      return {
        displayMass: totalM.toFixed(4),
        subText: `Catot: m₀ = 10.0000 g | Δm = +${mCat.toFixed(4)} g (${metalName})`
      };
    } else if (weighingTarget === 'anode') {
      if (curPreset.anodeSoluble) {
        const mTan = (curPreset.A_an * currentAmps * elapsedSeconds) / (curPreset.n_an * FARADAY);
        const totalM = Math.max(0, INITIAL_ELECTRODE_MASS - mTan);
        return {
          displayMass: totalM.toFixed(4),
          subText: `Anot Cu: m₀ = 10.0000 g | Δm = −${mTan.toFixed(4)} g (Tan)`
        };
      } else {
        return {
          displayMass: INITIAL_ELECTRODE_MASS.toFixed(4),
          subText: `Anot ${curPreset.anodeMaterial.split(' ')[0]}: m₀ = 10.0000 g | Không đổi (Trơ)`
        };
      }
    }

    return {
      displayMass: '0.0000',
      subText: 'Đĩa cân trống (Bấm "Cân Catot" hoặc "Cân Anot")'
    };
  }

  function drawElectrodeOnScale(panX, panY, leftIsCathode) {
    ctx.save();

    const isCathode = weighingTarget === 'cathode';
    const materialName = isCathode ? curPreset.cathodeMaterial : curPreset.anodeMaterial;

    const faradayMass = getAccumulatedMass();
    const depositThickness = isCathode ? Math.min(34 * 0.45, (faradayMass / 5.0) * 8) : 0;
    const dissolvedThickness = (!isCathode && curPreset.anodeSoluble) ? Math.min(34 * 0.5, (faradayMass / 5.0) * 8) : 0;

    const rodW = 32;
    const rodH = 120;
    const rodX = panX - rodW / 2;
    const rodY = panY - rodH;

    const activeW = Math.max(12, rodW - dissolvedThickness);

    let rodColor = '#475569';
    if (materialName.includes('Cu')) rodColor = '#b45309';
    else if (materialName.includes('Ag')) rodColor = '#cbd5e1';
    else if (materialName.includes('Pt')) rodColor = '#94a3b8';

    ctx.fillStyle = rodColor;
    ctx.fillRect(rodX + dissolvedThickness / 2, rodY, activeW, rodH);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(rodX + dissolvedThickness / 2, rodY, activeW, rodH);

    if (depositThickness > 0.4 && curPreset.cathodeDepositMetal) {
      const depColor = curPreset.cathodeDepositMetal === 'Cu' ? '#ea580c' : '#f8fafc';
      ctx.fillStyle = depColor;
      ctx.fillRect(rodX - depositThickness / 2, rodY + 20, depositThickness / 2, rodH - 20);
      ctx.fillRect(rodX + rodW, rodY + 20, depositThickness / 2, rodH - 20);
      ctx.fillRect(rodX - depositThickness / 2, rodY + rodH - depositThickness / 2, rodW + depositThickness, depositThickness / 2);
    }

    ctx.fillStyle = isCathode ? '#38bdf8' : '#f87171';
    ctx.font = '900 16px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(isCathode ? 'ĐANG CÂN CATOT' : 'ĐANG CÂN ANOT', panX, rodY - 12);

    ctx.restore();
  }

  /* ─────────────────────────────────────────────────────────────
     7. HỌA VẼ DÂY DẪN & DÒNG ELECTRON DI CHUYỂN
  ───────────────────────────────────────────────────────────── */
  function drawWiresAndElectrons(psX, psY, psW, psH, cupX, cupY, cupW, leftIsCathode) {
    ctx.save();

    const termLeftX = psX + 228;
    const termRightX = psX + 263;
    const termY = psY + 56;

    const rodLeftTop = { x: cupX + 55 + 17, y: cupY - 41 };
    const rodRightTop = { x: cupX + cupW - 55 - 17, y: cupY - 41 };
    const wireMidY = 145;

    const leftIsWeighed = (leftIsCathode && weighingTarget === 'cathode') || (!leftIsCathode && weighingTarget === 'anode');
    const rightIsWeighed = (!leftIsCathode && weighingTarget === 'cathode') || (leftIsCathode && weighingTarget === 'anode');

    const p0 = { x: termLeftX, y: termY };
    const p1 = { x: termLeftX, y: wireMidY };
    const p2 = { x: rodLeftTop.x, y: wireMidY };
    const p3 = { x: rodLeftTop.x, y: leftIsWeighed ? wireMidY + 25 : rodLeftTop.y };

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

    if (leftIsWeighed) {
      drawOpenAlligatorClip(p3.x, p3.y, leftIsCathode ? '#1e293b' : '#dc2626');
    }

    const q0 = { x: termRightX, y: termY };
    const q1 = { x: termRightX, y: wireMidY };
    const q2 = { x: rodRightTop.x, y: wireMidY };
    const q3 = { x: rodRightTop.x, y: rightIsWeighed ? wireMidY + 25 : rodRightTop.y };

    ctx.strokeStyle = !leftIsCathode ? '#1e293b' : '#dc2626';
    ctx.beginPath();
    ctx.moveTo(q0.x, q0.y);
    ctx.lineTo(q1.x, q1.y);
    ctx.lineTo(q2.x, q2.y);
    ctx.lineTo(q3.x, q3.y);
    ctx.stroke();

    if (rightIsWeighed) {
      drawOpenAlligatorClip(q3.x, q3.y, !leftIsCathode ? '#1e293b' : '#dc2626');
    }

    if (isPowered && weighingTarget === null) {
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#0284c7';
      ctx.shadowBlur = 7;

      const time = performance.now() * 0.0015;

      electrons.forEach((el, idx) => {
        const tVal = ((time * 0.4 + idx / electrons.length) % 1);

        let ptLeft, ptRight;
        if (leftIsCathode) {
          ptLeft = getPointOnOrthogonalWire(tVal, p0, p1, p2, p3);
          ptRight = getPointOnOrthogonalWire(1 - tVal, q0, q1, q2, q3);
        } else {
          ptLeft = getPointOnOrthogonalWire(1 - tVal, p0, p1, p2, p3);
          ptRight = getPointOnOrthogonalWire(tVal, q0, q1, q2, q3);
        }

        ctx.beginPath();
        ctx.arc(ptLeft.x, ptLeft.y, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(ptRight.x, ptRight.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    ctx.restore();
  }

  function drawOpenAlligatorClip(x, y, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(x - 5, y, 10, 14);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(x - 5, y, 10, 14);
    ctx.fillStyle = '#f87171';
    ctx.font = '900 11.5px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('[HỞ]', x, y + 24);
    ctx.restore();
  }

  function getPointOnOrthogonalWire(t, p0, p1, p2, p3) {
    const len1 = Math.abs(p1.y - p0.y);
    const len2 = Math.abs(p2.x - p1.x);
    const len3 = Math.abs(p3.y - p2.y);
    const totalLen = len1 + len2 + len3;

    const dist = t * totalLen;

    if (dist <= len1) {
      const frac = dist / (len1 || 1);
      return { x: p0.x, y: p0.y + (p1.y - p0.y) * frac };
    } else if (dist <= len1 + len2) {
      const frac = (dist - len1) / (len2 || 1);
      return { x: p1.x + (p2.x - p1.x) * frac, y: p1.y };
    } else {
      const frac = (dist - len1 - len2) / (len3 || 1);
      return { x: p2.x, y: p2.y + (p3.y - p2.y) * frac };
    }
  }

  /* ─────────────────────────────────────────────────────────────
     8. TÍNH TOÁN ĐỊNH LUẬT FARADAY (BẢO LƯU SỐ LIỆU KHI DỪNG)
  ───────────────────────────────────────────────────────────── */
  function getAccumulatedMass() {
    if (elapsedSeconds <= 0) return 0;
    const t = elapsedSeconds;
    const I = currentAmps;
    return (curPreset.A_cat * I * t) / (curPreset.n_cat * FARADAY);
  }

  function getGasVolumeCathode() {
    if (elapsedSeconds <= 0 || !curPreset.cathodeGas) return 0;
    const t = elapsedSeconds;
    const I = currentAmps;
    return (I * t / (curPreset.n_cat * FARADAY)) * 24.79 * 1000; // mL
  }

  function getGasVolumeAnode() {
    if (elapsedSeconds <= 0 || !curPreset.anodeGas) return 0;
    const t = elapsedSeconds;
    const I = currentAmps;
    return (I * t / (curPreset.n_an * FARADAY)) * 24.79 * 1000; // mL
  }

  function updateFaradayCalculations() {
    // 1. Cập nhật HUD thời gian và điện lượng Q
    const hudTime = document.getElementById('hud-time-text');
    const hudQ = document.getElementById('hud-q-text');
    const hudScale = document.getElementById('hud-scale-text');

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

    if (hudScale) {
      const scaleMeas = getScaleMeasurement(!polarityReversed);
      hudScale.textContent = `${scaleMeas.displayMass} g`;
    }

    // 2. Tính sản phẩm giải phóng ở Catot
    const massCatEl = document.getElementById('calc-mass-cat');
    const subCatEl = document.getElementById('faraday-sub-cat');
    const labelCat = document.getElementById('label-faraday-cat');

    if (massCatEl) {
      if (curPreset.cathodeDepositMetal) {
        if (labelCat) labelCat.textContent = 'Khối lượng Catot tăng (m):';
        const mass = getAccumulatedMass();
        massCatEl.textContent = `+${mass.toFixed(4)} g (${curPreset.cathodeDepositMetal})`;
        massCatEl.style.color = '#38bdf8';
      } else if (curPreset.cathodeGas) {
        if (labelCat) labelCat.textContent = 'Thể tích khí Catot (V đkc):';
        const vCatMl = getGasVolumeCathode();
        massCatEl.textContent = `+${vCatMl.toFixed(2)} mL (${curPreset.cathodeGas} ↑)`;
        massCatEl.style.color = '#38bdf8';
      } else {
        if (labelCat) labelCat.textContent = 'Sản phẩm ở Catot:';
        massCatEl.textContent = `+0.0000 g`;
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

    // 3. Tính sản phẩm giải phóng ở Anot (hoặc Nước Javel NaClO)
    const volAnEl = document.getElementById('calc-vol-an');
    const rowGasAnEl = document.getElementById('row-gas-anode');
    const labelAn = document.getElementById('label-faraday-an');

    if (volAnEl && rowGasAnEl) {
      if (curPreset.id === 'nacl_nodim_javel') {
        rowGasAnEl.style.display = 'flex';
        if (labelAn) labelAn.textContent = 'Khối lượng NaClO (Nước Javel):';
        const massJavel = (74.5 * currentAmps * elapsedSeconds) / (2 * FARADAY);
        volAnEl.textContent = `+${massJavel.toFixed(4)} g (NaClO)`;
        volAnEl.style.color = '#f59e0b';
      } else if (curPreset.anodeSoluble) {
        rowGasAnEl.style.display = 'flex';
        if (labelAn) labelAn.textContent = 'Khối lượng Anot giảm:';
        const massAn = (curPreset.A_an * currentAmps * elapsedSeconds) / (curPreset.n_an * FARADAY);
        volAnEl.textContent = `−${massAn.toFixed(4)} g (${curPreset.anodeMaterial.split(' ')[1] || 'Cu'} tan)`;
        volAnEl.style.color = '#ef4444';
      } else if (curPreset.anodeGas) {
        rowGasAnEl.style.display = 'flex';
        if (labelAn) labelAn.textContent = 'Thể tích khí Anot (V đkc, 25°C):';
        const vMl = getGasVolumeAnode();
        volAnEl.textContent = `+${vMl.toFixed(2)} mL (${curPreset.anodeGas} ↑)`;
        volAnEl.style.color = '#f59e0b';
      } else {
        rowGasAnEl.style.display = 'none';
      }
    }

    // Cập nhật thẻ cân chi tiết
    const weighDetailEl = document.getElementById('weigh-detail-info');
    if (weighDetailEl) {
      const scaleMeas = getScaleMeasurement(!polarityReversed);
      weighDetailEl.textContent = scaleMeas.subText;
    }
  }

  function updateUI() {
    const circuitActive = isPowered && weighingTarget === null;

    const btnDc = document.getElementById('btn-toggle-dc');
    const hudStatus = document.getElementById('hud-status-badge');
    const hudVolt = document.getElementById('hud-voltage-text');
    const hudCurr = document.getElementById('hud-current-text');

    if (btnDc) {
      btnDc.classList.toggle('active', isPowered);
      btnDc.innerHTML = `⚡ Nguồn DC (Khóa K): <strong>${isPowered ? 'BẬT (Đang Chạy)' : 'TẮT (Ngắt Mạch)'}</strong>`;
    }

    if (hudStatus) {
      hudStatus.className = `hud-dc-tag ${circuitActive ? 'running' : 'stopped'}`;
      hudStatus.textContent = circuitActive ? 'ĐANG ĐIỆN PHÂN' : (weighingTarget ? 'ĐANG CÂN ĐIỆN CỰC' : 'TẠM DỪNG (GIỮ SỐ LIỆU)');
    }

    if (hudVolt) hudVolt.textContent = `${voltage.toFixed(1)} V`;
    if (hudCurr) hudCurr.textContent = `${(circuitActive ? currentAmps : 0).toFixed(2)} A`;

    // Cập nhật trạng thái các nút cân
    const btnTopWeighCat = document.getElementById('btn-top-weigh-cat');
    const btnTopWeighAn = document.getElementById('btn-top-weigh-an');
    const btnTopReturn = document.getElementById('btn-top-return');

    const btnCardWeighCat = document.getElementById('btn-card-weigh-cat');
    const btnCardWeighAn = document.getElementById('btn-card-weigh-an');
    const btnCardReturn = document.getElementById('btn-card-return');
    const weighStatus = document.getElementById('weigh-status-text');

    const isWeighCat = weighingTarget === 'cathode';
    const isWeighAn = weighingTarget === 'anode';

    [btnTopWeighCat, btnCardWeighCat].forEach(b => b && b.classList.toggle('active', isWeighCat));
    [btnTopWeighAn, btnCardWeighAn].forEach(b => b && b.classList.toggle('active', isWeighAn));
    [btnTopReturn, btnCardReturn].forEach(b => b && b.classList.toggle('active', weighingTarget !== null));

    if (weighStatus) {
      weighStatus.textContent = weighingTarget ? 'ĐANG CÂN' : 'SẴN SÀNG';
      weighStatus.style.color = weighingTarget ? '#38bdf8' : '#10b981';
    }

    // Cập nhật phương trình phản ứng
    const rxnCat = document.getElementById('text-rxn-cat');
    const rxnAn = document.getElementById('text-rxn-an');
    const rxnOver = document.getElementById('text-rxn-overall');

    if (rxnCat) rxnCat.textContent = curPreset.catHalfRxn;
    if (rxnAn) rxnAn.textContent = curPreset.anHalfRxn;
    if (rxnOver) rxnOver.textContent = curPreset.overallRxn;

    const chkDia = document.getElementById('check-diaphragm');
    if (chkDia) chkDia.checked = hasDiaphragm;

    const diaHint = document.getElementById('text-diaphragm-hint');
    if (diaHint) {
      if (curPreset.id === 'nacl_nodim_javel' || (curPreset.id === 'nacl_diaphragm' && !hasDiaphragm)) {
        diaHint.textContent = '⚠️ Bỏ màng ngăn: tạo NƯỚC JAVEL (NaClO)';
        diaHint.style.color = '#f59e0b';
      } else {
        diaHint.textContent = 'Cần thiết cho sản xuất NaOH/Cl₂';
        diaHint.style.color = 'var(--text-muted)';
      }
    }

    const sel = document.getElementById('select-preset');
    if (sel && sel.value !== curPreset.id) {
      sel.value = curPreset.id;
    }
  }

  /* ─────────────────────────────────────────────────────────────
     9. CÁC HÀM XỬ LÝ SỰ KIỆN GIAO DIỆN (INTERACTIONS)
  ───────────────────────────────────────────────────────────── */
  window.electrolysisTogglePower = function () {
    if (weighingTarget !== null && !isPowered) {
      weighingTarget = null;
    }
    isPowered = !isPowered;
    updateUI();
  };

  window.electrolysisTogglePolarity = function () {
    polarityReversed = !polarityReversed;
    bubblesLeft = [];
    bubblesRight = [];
    updateUI();
  };

  window.electrolysisResetTime = function () {
    elapsedSeconds = 0;
    updateFaradayCalculations();
  };

  window.electrolysisWeighElectrode = function (target) {
    if (weighingTarget === target) {
      electrolysisReturnElectrode();
      return;
    }
    isPowered = false;
    weighingTarget = target;
    updateUI();
  };

  window.electrolysisReturnElectrode = function () {
    weighingTarget = null;
    updateUI();
  };

  window.electrolysisSelectPreset = function (presetId) {
    const found = PRESETS.find(p => p.id === presetId);
    if (!found) return;

    curPreset = found;
    voltage = found.defaultU;
    currentAmps = found.defaultI;
    hasDiaphragm = found.hasDiaphragm;
    elapsedSeconds = 0;
    weighingTarget = null;
    bubblesLeft = [];
    bubblesRight = [];

    initIons();

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

    // Tự động chuyển đổi giữa Sản xuất Xút/Clo (Có màng ngăn) và Nước Javel (Không màng ngăn)
    if (curPreset.id === 'nacl_diaphragm' && !checked) {
      electrolysisSelectPreset('nacl_nodim_javel');
      return;
    } else if (curPreset.id === 'nacl_nodim_javel' && checked) {
      electrolysisSelectPreset('nacl_diaphragm');
      return;
    }

    updateUI();
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
