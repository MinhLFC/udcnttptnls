/* ==========================================================================
   THÍ NGHIỆM HÓA HỌC: SƠ ĐỒ PIN ĐIỆN HÓA & THẾ ĐIỆN CỰC CHUẨN (HÓA HỌC 12)
   Hình thành Dãy điện hóa kim loại, Mô phỏng Cầu muối, Dòng Electron & Ion
   Tác giả: Đỗ Văn Nhật Minh — HCMUE
   ========================================================================== */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────
     1. DỮ LIỆU ĐẦY ĐỦ CÁC CẶP OXI HÓA - KHỬ TRONG DÃY ĐIỆN HÓA KIM LOẠI
     (Sắp xếp theo chiều tăng dần thế điện cực chuẩn E° ở 25°C, 1 bar, 1M)
  ───────────────────────────────────────────────────────────── */
  const METALS = [
    { id: 'K',  name: 'Potassium (Kali)',     symbol: 'K',  ion: 'K⁺',     n: 1, e0: -2.93, color: '#a855f7', solColor: 'rgba(230, 240, 255, 0.45)', solName: 'KNO₃ 1M',     desc: 'Kim loại kiềm cực mạnh, tính khử rất mạnh' },
    { id: 'Ba', name: 'Barium (Bari)',        symbol: 'Ba', ion: 'Ba²⁺',   n: 2, e0: -2.90, color: '#818cf8', solColor: 'rgba(230, 240, 255, 0.45)', solName: 'Ba(NO₃)₂ 1M', desc: 'Kim loại kiềm thổ, tính khử rất mạnh' },
    { id: 'Ca', name: 'Calcium (Canxi)',      symbol: 'Ca', ion: 'Ca²⁺',   n: 2, e0: -2.87, color: '#f3e8ff', solColor: 'rgba(230, 240, 255, 0.45)', solName: 'Ca(NO₃)₂ 1M', desc: 'Kim loại kiềm thổ, khử mạnh' },
    { id: 'Na', name: 'Sodium (Natri)',       symbol: 'Na', ion: 'Na⁺',    n: 1, e0: -2.71, color: '#fde047', solColor: 'rgba(230, 240, 255, 0.45)', solName: 'NaNO₃ 1M',    desc: 'Kim loại kiềm, khử mạnh' },
    { id: 'Mg', name: 'Magnesium (Magie)',    symbol: 'Mg', ion: 'Mg²⁺',   n: 2, e0: -2.37, color: '#cbd5e1', solColor: 'rgba(230, 240, 255, 0.45)', solName: 'Mg(NO₃)₂ 1M', desc: 'Kim loại nhóm IIA, tính khử mạnh' },
    { id: 'Al', name: 'Aluminium (Nhôm)',     symbol: 'Al', ion: 'Al³⁺',   n: 3, e0: -1.66, color: '#94a3b8', solColor: 'rgba(230, 240, 255, 0.45)', solName: 'Al(NO₃)₃ 1M', desc: 'Kim loại nhóm IIIA, tính khử tương đối mạnh' },
    { id: 'Mn', name: 'Manganese (Mangan)',   symbol: 'Mn', ion: 'Mn²⁺',   n: 2, e0: -1.18, color: '#fbcfe8', solColor: 'rgba(253, 242, 248, 0.45)', solName: 'MnSO₄ 1M',    desc: 'Kim loại chuyển tiếp, E° âm' },
    { id: 'Zn', name: 'Zinc (Kẽm)',           symbol: 'Zn', ion: 'Zn²⁺',   n: 2, e0: -0.76, color: '#9ca3af', solColor: 'rgba(224, 231, 255, 0.45)', solName: 'ZnSO₄ 1M',    desc: 'Cực Anode kinh điển trong pin Daniell' },
    { id: 'Cr', name: 'Chromium (Crom)',      symbol: 'Cr', ion: 'Cr³⁺',   n: 3, e0: -0.74, color: '#67e8f9', solColor: 'rgba(165, 243, 252, 0.45)', solName: 'Cr(NO₃)₃ 1M', desc: 'Kim loại cứng, tạo màng thụ động' },
    { id: 'Fe', name: 'Iron (Sắt II)',        symbol: 'Fe', ion: 'Fe²⁺',   n: 2, e0: -0.44, color: '#64748b', solColor: 'rgba(209, 250, 229, 0.55)', solName: 'FeSO₄ 1M',    desc: 'Kim loại phổ biến, dung dịch màu xanh lục nhạt' },
    { id: 'Ni', name: 'Nickel (Niken)',       symbol: 'Ni', ion: 'Ni²⁺',   n: 2, e0: -0.26, color: '#86efac', solColor: 'rgba(187, 247, 208, 0.55)', solName: 'NiSO₄ 1M',    desc: 'Kim loại chuyển tiếp, ion Ni²⁺ màu xanh lục' },
    { id: 'Sn', name: 'Tin (Thiếc)',          symbol: 'Sn', ion: 'Sn²⁺',   n: 2, e0: -0.14, color: '#d1d5db', solColor: 'rgba(243, 244, 246, 0.45)', solName: 'SnCl₂ 1M',    desc: 'Kim loại nhóm IVA, thế điện cực gần 0' },
    { id: 'Pb', name: 'Lead (Chì)',           symbol: 'Pb', ion: 'Pb²⁺',   n: 2, e0: -0.13, color: '#475569', solColor: 'rgba(241, 245, 249, 0.45)', solName: 'Pb(NO₃)₂ 1M', desc: 'Kim loại nặng, dùng trong ắc quy' },
    { id: 'H2', name: 'Hydrogen (Hydro chuẩn)', symbol: 'H₂', ion: '2H⁺',  n: 2, e0:  0.00, color: '#38bdf8', solColor: 'rgba(224, 242, 254, 0.45)', solName: 'HCl 1M (SHE)', desc: 'Điện cực hydro chuẩn (SHE) - Mốc quy ước 0.00 V' },
    { id: 'Cu', name: 'Copper (Đồng)',        symbol: 'Cu', ion: 'Cu²⁺',   n: 2, e0: +0.34, color: '#b45309', solColor: 'rgba(56, 189, 248, 0.65)', solName: 'CuSO₄ 1M',    desc: 'Cực Cathode kinh điển trong pin Daniell (màu xanh lam)' },
    { id: 'Fe3',name: 'Iron (Sắt III/Sắt II)',symbol: 'Fe²⁺', ion: 'Fe³⁺', n: 1, e0: +0.77, color: '#f59e0b', solColor: 'rgba(254, 243, 199, 0.6)',  solName: 'FeCl₃/FeCl₂ 1M',desc: 'Cặp oxi hóa khử Fe³⁺/Fe²⁺' },
    { id: 'Ag', name: 'Silver (Bạc)',         symbol: 'Ag', ion: 'Ag⁺',    n: 1, e0: +0.80, color: '#e2e8f0', solColor: 'rgba(248, 250, 252, 0.45)', solName: 'AgNO₃ 1M',    desc: 'Kim loại quý, tính oxi hóa của Ag⁺ mạnh' },
    { id: 'Hg', name: 'Mercury (Thủy ngân)',  symbol: 'Hg', ion: 'Hg²⁺',   n: 2, e0: +0.85, color: '#94a3b8', solColor: 'rgba(241, 245, 249, 0.45)', solName: 'Hg(NO₃)₂ 1M', desc: 'Kim loại lỏng ở nhiệt độ thường' },
    { id: 'Pt', name: 'Platinum (Bạch kim)',  symbol: 'Pt', ion: 'Pt²⁺',   n: 2, e0: +1.20, color: '#f1f5f9', solColor: 'rgba(254, 249, 195, 0.5)',  solName: 'H₂PtCl₆ 1M',  desc: 'Kim loại trơ quý tộc' },
    { id: 'Au', name: 'Gold (Vàng)',          symbol: 'Au', ion: 'Au³⁺',   n: 3, e0: +1.50, color: '#eab308', solColor: 'rgba(254, 240, 138, 0.6)',  solName: 'HAuCl₄ 1M',   desc: 'Kim loại có tính khử rất yếu, Au³⁺ tính oxi hóa rất mạnh' }
  ];

  /* ─────────────────────────────────────────────────────────────
     2. TRẠNG THÁI THÍ NGHIỆM PIN ĐIỆN HÓA (STATE)
  ───────────────────────────────────────────────────────────── */
  let leftMetal = METALS.find(m => m.id === 'Zn');  // Mặc định bên trái: Zn (-0.76 V)
  let rightMetal = METALS.find(m => m.id === 'Cu'); // Mặc định bên phải: Cu (+0.34 V)
  let saltBridgeActive = true;                      // Cầu muối có gắn hay không
  let circuitClosed = true;                         // Khóa K đóng / mở
  let isSimulating = true;                          // Chạy hoạt ảnh
  let probeRightIsPositive = true;                  // Chốt que đo Vôn kế: true = Que Đỏ (+) nối Phải, Que Đen (-) nối Trái

  // Canvas context & Hoạt ảnh hạt
  let canvas, ctx;
  let animId = null;
  let electrons = []; // Hạt electron chạy trên dây dẫn
  let saltK = [];     // Ion K⁺ di chuyển trong cầu muối
  let saltNO3 = [];   // Ion NO₃⁻ di chuyển trong cầu muối
  let anodeIons = []; // Ion tan ra từ cực Anode
  let cathodeIons = []; // Ion bám vào cực Cathode

  /* ─────────────────────────────────────────────────────────────
     3. TÍNH TOÁN CÁC ĐẠI LƯỢNG ĐIỆN HÓA & PHÂN CỰC VÔN KẾ
  ───────────────────────────────────────────────────────────── */
  function getCellData() {
    // 1. Xác định bản chất hóa học: Anode (E° nhỏ hơn -> bị oxi hóa) và Cathode (E° lớn hơn -> bị khử)
    let anode, cathode;
    let anodePosition, cathodePosition; // 'left' hoặc 'right'

    if (leftMetal.e0 <= rightMetal.e0) {
      anode = leftMetal;
      cathode = rightMetal;
      anodePosition = 'left';
      cathodePosition = 'right';
    } else {
      anode = rightMetal;
      cathode = leftMetal;
      anodePosition = 'right';
      cathodePosition = 'left';
    }

    // Sức điện động chuẩn lý thuyết của pin (luôn dương hoặc bằng 0): E°pin = E°Cathode - E°Anode
    const eCell = cathode.e0 - anode.e0;
    
    // 2. Hiệu điện thế hiển thị trên Vôn kế thực tế: V_đo = V_que_đỏ(+) - V_que_đen(-)
    const redProbeMetal = probeRightIsPositive ? rightMetal : leftMetal;
    const blackProbeMetal = probeRightIsPositive ? leftMetal : rightMetal;
    const rawVoltage = redProbeMetal.e0 - blackProbeMetal.e0;

    // Nếu hở mạch (khóa K mở) hoặc rút cầu muối -> điện áp đo được = 0
    const measuredVoltage = (circuitClosed && saltBridgeActive) ? rawVoltage : 0;

    // Trạng thái ngược cực của que đo Vôn kế (khi que đỏ cắm vào Anode có thế thấp hơn)
    const isReversedPolarity = (circuitClosed && saltBridgeActive && rawVoltage < 0);

    // Chiều dịch chuyển electron: từ Anode sang Cathode qua dây dẫn ngoài
    const electronDirection = anodePosition === 'left' ? 1 : -1; // 1: Trái sang Phải, -1: Phải sang Trái

    return {
      anode,
      cathode,
      anodePosition,
      cathodePosition,
      eCell,
      rawVoltage,
      measuredVoltage,
      isReversedPolarity,
      probeRightIsPositive,
      redProbePosition: probeRightIsPositive ? 'right' : 'left',
      blackProbePosition: probeRightIsPositive ? 'left' : 'right',
      electronDirection,
      isIdentical: leftMetal.id === rightMetal.id
    };
  }

  /* ─────────────────────────────────────────────────────────────
     4. KHỞI TẠO VÀ BUILD GIAO DIỆN
  ───────────────────────────────────────────────────────────── */
  function buildGalvanicUI() {
    const container = document.getElementById('experiment-galvanic');
    if (!container) return;

    container.innerHTML = `
      <div class="galvanic-wrapper">
        
        <!-- Topbar điều khiển & Trạng thái -->
        <div class="galvanic-topbar">
          <div class="galvanic-title-box">
            <span class="galvanic-badge">Hóa Học 12 — Chuyên Đề Pin Điện Hóa</span>
            <div style="font-size: 0.95rem; font-weight: 800; color: var(--text-main);">
              Sơ Đồ Pin Điện Hóa & Dãy Điện Hóa Kim Loại
            </div>
          </div>
          <div class="galvanic-top-actions">
            <button class="galvanic-btn ${circuitClosed ? 'active' : ''}" id="btn-toggle-circuit" onclick="galvanicToggleCircuit()">
              ⚡ Công Tắc K: <strong>${circuitClosed ? 'ĐÓNG (Chạy)' : 'NGẮT (Hở Mạch)'}</strong>
            </button>
            <button class="galvanic-btn ${saltBridgeActive ? 'active' : ''}" id="btn-toggle-bridge" onclick="galvanicToggleSaltBridge()">
              🧪 Cầu Muối KNO₃: <strong>${saltBridgeActive ? 'ĐANG GẮN' : 'ĐÃ RÚT RA'}</strong>
            </button>
            <button class="galvanic-btn" onclick="galvanicResetStandard()">
              🔄 Pin Chuẩn Zn - Cu (1.10V)
            </button>
            <button class="galvanic-btn" id="btn-fullscreen" onclick="galvanicToggleFullscreen()" title="Chế độ toàn màn hình">
              ⛶ Toàn Màn Hình
            </button>
          </div>
        </div>

        <!-- Lưới chính: Canvas mô phỏng & Bảng điều khiển chọn điện cực -->
        <div class="galvanic-main-grid">
          
          <!-- Cột Trái: Bàn thí nghiệm Canvas 2D tương tác -->
          <div class="galvanic-canvas-card">
            <div class="galvanic-canvas-wrap">
              <canvas id="galvanic-canvas" width="860" height="520"></canvas>
            </div>
            
            <div class="galvanic-canvas-hud">
              <div class="hud-volt-display">
                <span>VÔN KẾ:</span>
                <span class="hud-volt-val" id="hud-voltage-val">0.00 V</span>
                <span class="hud-volt-tag forward" id="hud-voltage-tag">THUẬN CỰC</span>
              </div>
              <div class="hud-probe-btn-wrap">
                <button class="galvanic-btn" id="btn-toggle-probe" onclick="galvanicToggleProbe()" style="padding: 0.35rem 0.65rem; font-size: 0.78rem;" title="Đổi chỗ que cắm Đỏ (+) và Đen (-)">
                  🔄 Que Đo: <strong>Đỏ Phải (+) | Đen Trái (−)</strong>
                </button>
              </div>
              <div id="hud-status-text" style="color: #cbd5e1; font-weight: 600;">
                Đang nạp dữ liệu pin...
              </div>
            </div>
          </div>

          <!-- Cột Phải: Bảng chọn 2 Cực & Tính toán Phản ứng -->
          <div class="galvanic-ctrl-card">
            <div class="electrode-pick-grid">
              
              <!-- Cực Bên Trái -->
              <div class="electrode-box" id="card-left-electrode">
                <span class="electrode-badge" id="badge-left">CỰC TRÁI</span>
                <label style="display: block; font-size: 0.82rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.35rem;">
                  Thanh kim loại & Dung dịch 1:
                </label>
                <select class="electrode-select" id="select-metal-left" onchange="galvanicSelectLeft(this.value)">
                  ${METALS.map(m => `
                    <option value="${m.id}" ${m.id === leftMetal.id ? 'selected' : ''}>
                      ${m.symbol} (${m.name}) — E° = ${m.e0 >= 0 ? '+' : ''}${m.e0.toFixed(2)}V
                    </option>
                  `).join('')}
                </select>
                <div class="electrode-info-detail">
                  Dung dịch: <strong id="sol-left-name">${leftMetal.solName}</strong><br>
                  Bán phản ứng: <span id="rxn-left-text" class="m-inline">...</span>
                </div>
                <div class="electrode-potential-tag" id="pot-left-tag">
                  E° = ${leftMetal.e0 >= 0 ? '+' : ''}${leftMetal.e0.toFixed(2)} V
                </div>
              </div>

              <!-- Cực Bên Phải -->
              <div class="electrode-box" id="card-right-electrode">
                <span class="electrode-badge" id="badge-right">CỰC PHẢI</span>
                <label style="display: block; font-size: 0.82rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.35rem;">
                  Thanh kim loại & Dung dịch 2:
                </label>
                <select class="electrode-select" id="select-metal-right" onchange="galvanicSelectRight(this.value)">
                  ${METALS.map(m => `
                    <option value="${m.id}" ${m.id === rightMetal.id ? 'selected' : ''}>
                      ${m.symbol} (${m.name}) — E° = ${m.e0 >= 0 ? '+' : ''}${m.e0.toFixed(2)}V
                    </option>
                  `).join('')}
                </select>
                <div class="electrode-info-detail">
                  Dung dịch: <strong id="sol-right-name">${rightMetal.solName}</strong><br>
                  Bán phản ứng: <span id="rxn-right-text" class="m-inline">...</span>
                </div>
                <div class="electrode-potential-tag" id="pot-right-tag">
                  E° = ${rightMetal.e0 >= 0 ? '+' : ''}${rightMetal.e0.toFixed(2)} V
                </div>
              </div>

            </div>

            <!-- Khung Tính toán & Phương trình Hóa học -->
            <div class="galvanic-calc-box">
              <div class="calc-title">
                <span>⚡</span> SỨC ĐIỆN ĐỘNG VÀ PHẢN ỨNG TỔNG QUÁT TRONG PIN
              </div>
              
              <div class="calc-formula-row">
                <span>SĐĐ Lý Thuyết: E°<sub>pin</sub> = E°<sub>Cathode (+)</sub> − E°<sub>Anode (−)</sub></span>
                <strong id="calc-result-text" style="color: #2563eb; font-weight: 800;">+1.10 V</strong>
              </div>

              <div class="calc-formula-row" id="calc-measured-row" style="margin-top: 0.4rem; padding-top: 0.4rem; border-top: 1px dashed var(--border-color); font-size: 0.85rem;">
                <span>Số chỉ Vôn kế (V<sub>đo</sub> = V<sub>que đỏ (+)</sub> − V<sub>que đen (−)</sub>):</span>
                <strong id="calc-measured-text" style="color: #10b981; font-weight: 800;">+1.10 V</strong>
              </div>

              <div class="calc-rxn-row" id="calc-equation-box">
                <!-- Nội dung phản ứng tổng quát -->
              </div>
            </div>

            <!-- Thao tác nhanh đổi vai trò -->
            <div style="display: flex; gap: 0.5rem; justify-content: flex-end; flex-wrap: wrap; margin-top: 0.5rem;">
              <button class="galvanic-btn" onclick="galvanicSwapElectrodes()" title="Hoán đổi 2 điện cực Trái / Phải (Số chỉ Vôn kế sẽ đổi dấu)">
                ⇄ Đổi Vị Trí Trái / Phải (Đổi Dấu V)
              </button>
              <button class="galvanic-btn" onclick="galvanicToggleProbe()" title="Đảo chốt que cắm Vôn kế Đỏ ⇄ Đen">
                🔄 Đảo Que Đo (+ / −)
              </button>
            </div>
          </div>

        </div>

        <!-- ========================================================
             DÃY ĐIỆN HÓA KIM LOẠI TƯƠNG TÁC ĐẦY ĐỦ (20 CẶP OXI HÓA - KHỬ)
             ======================================================== -->
        <div class="ecs-series-card">
          <div class="ecs-header">
            <div>
              <h3><span>📊</span> DÃY ĐIỆN HÓA KIM LOẠI (THẾ ĐIỆN CỰC CHUẨN E°)</h3>
              <p>Thế điện cực chuẩn tăng dần từ trái sang phải. Bấm vào kim loại để gán nhanh làm Anode hoặc Cathode!</p>
            </div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">
              Đầy đủ: <strong>K, Ba, Ca, Na, Mg, Al, Mn, Zn, Cr, Fe, Ni, Sn, Pb, H₂, Cu, Fe³⁺/Fe²⁺, Ag, Hg, Pt, Au</strong>
            </div>
          </div>

          <!-- Mũi tên biến thiên quy luật Dãy điện hóa -->
          <div class="ecs-trend-arrow-box">
            <div class="trend-arrow-line ox-trend">
              <span>Tính oxi hóa của ion kim loại tăng dần (E° tăng) ➔</span>
              <span>Au³⁺ mạnh nhất</span>
            </div>
            <div class="trend-arrow-line red-trend">
              <span>K mạnh nhất</span>
              <span> Tính khử của kim loại giảm dần</span>
            </div>
          </div>

          <!-- Dải băng cuộn ngang các cặp điện hóa -->
          <div class="ecs-scroll-wrap">
            <div class="ecs-strip" id="ecs-strip-container">
              <!-- Render động 20 cặp -->
            </div>
          </div>

          <!-- Bảng tra cứu & Thẻ giải thích nguyên lý cầu muối -->
          <div class="galvanic-knowledge-grid">
            <div class="k-card">
              <h4><span>🧂</span> Vai Trò Cốt Lõi Của Cầu Muối (KNO₃)</h4>
              <p>
                Cầu muối chứa thạch agar ngâm dung dịch chất điện li trơ (KNO₃). Có 2 vai trò quyết định:<br>
                1. <strong>Khép kín mạch điện</strong> cho phép dòng điện chạy liên tục.<br>
                2. <strong>Trung hòa điện tích 2 cốc:</strong> Cation K⁺ di chuyển sang cốc Cathode để bù đắp điện tích dương; Anion NO₃⁻ di chuyển sang cốc Anode để trung hòa lượng ion kim loại tan ra. <em>Nếu rút cầu muối, mạch hở và SĐĐ giảm về 0V ngay lập tức!</em>
              </p>
            </div>

            <div class="k-card">
              <h4><span>🔬</span> Bản Chất Quy Tắc Alpha (α)</h4>
              <p>
                Dãy điện hóa cho phép dự đoán chiều phản ứng oxi hóa - khử theo quy tắc alpha (α):<br>
                <strong>Chất oxi hóa mạnh hơn + Chất khử mạnh hơn ➔ Chất oxi hóa yếu hơn + Chất khử yếu hơn.</strong><br>
                Ví dụ: Cặp Fe²⁺/Fe và Cu²⁺/Cu tạo thành pin: Cu²⁺ (ox mạnh) oxi hóa Fe (khử mạnh) tạo thành Fe²⁺ + Cu.
              </p>
            </div>
          </div>
        </div>

      </div>
    `;

    canvas = document.getElementById('galvanic-canvas');
    if (canvas) {
      ctx = canvas.getContext('2d');
    }

    renderECSSeriesStrip();
    updateUIElements();
    initParticleSystem();
    startSimulationLoop();
  }

  /* ─────────────────────────────────────────────────────────────
     5. RENDER DÃY ĐIỆN HÓA DẠNG NÚT BẤM TƯƠNG TÁC
  ───────────────────────────────────────────────────────────── */
  function renderECSSeriesStrip() {
    const strip = document.getElementById('ecs-strip-container');
    if (!strip) return;

    const cell = getCellData();

    strip.innerHTML = METALS.map(m => {
      const isLeft = m.id === leftMetal.id;
      const isRight = m.id === rightMetal.id;
      const isAnode = m.id === cell.anode.id;
      const isCathode = m.id === cell.cathode.id;

      let activeClass = '';
      if (isAnode) activeClass = 'active-anode';
      else if (isCathode) activeClass = 'active-cathode';

      return `
        <div class="ecs-metal-item ${activeClass}" onclick="galvanicClickSeriesItem('${m.id}')" title="${m.name}: E° = ${m.e0.toFixed(2)}V (Bấm để chọn)">
          <div class="ecs-ion-val">${m.ion}</div>
          <div class="ecs-divider"></div>
          <div class="ecs-metal-val">${m.symbol}</div>
          <div class="ecs-pot-val">${m.e0 >= 0 ? '+' : ''}${m.e0.toFixed(2)}V</div>
        </div>
      `;
    }).join('');
  }

  /* ─────────────────────────────────────────────────────────────
     6. CẬP NHẬT GIAO DIỆN VĂN BẢN & BÁN PHẢN ỨNG
  ───────────────────────────────────────────────────────────── */
  function updateUIElements() {
    const cell = getCellData();

    // 1. Cập nhật nhãn và màu thẻ Anode / Cathode
    const cardLeft = document.getElementById('card-left-electrode');
    const cardRight = document.getElementById('card-right-electrode');
    const badgeLeft = document.getElementById('badge-left');
    const badgeRight = document.getElementById('badge-right');

    if (cardLeft && cardRight) {
      if (cell.anodePosition === 'left') {
        cardLeft.className = 'electrode-box anode-box';
        cardRight.className = 'electrode-box cathode-box';
        if (badgeLeft) { badgeLeft.className = 'electrode-badge anode-badge'; badgeLeft.textContent = 'CỰC ÂM (ANODE)'; }
        if (badgeRight) { badgeRight.className = 'electrode-badge cathode-badge'; badgeRight.textContent = 'CỰC DƯƠNG (CATHODE)'; }
      } else {
        cardLeft.className = 'electrode-box cathode-box';
        cardRight.className = 'electrode-box anode-box';
        if (badgeLeft) { badgeLeft.className = 'electrode-badge cathode-badge'; badgeLeft.textContent = 'CỰC DƯƠNG (CATHODE)'; }
        if (badgeRight) { badgeRight.className = 'electrode-badge anode-badge'; badgeRight.textContent = 'CỰC ÂM (ANODE)'; }
      }
    }

    // 2. Cập nhật thông tin nồng độ & phản ứng từng cốc
    const solLeftName = document.getElementById('sol-left-name');
    const solRightName = document.getElementById('sol-right-name');
    const potLeftTag = document.getElementById('pot-left-tag');
    const potRightTag = document.getElementById('pot-right-tag');

    if (solLeftName) solLeftName.textContent = leftMetal.solName;
    if (solRightName) solRightName.textContent = rightMetal.solName;
    if (potLeftTag) potLeftTag.textContent = `E° = ${leftMetal.e0 >= 0 ? '+' : ''}${leftMetal.e0.toFixed(2)} V`;
    if (potRightTag) potRightTag.textContent = `E° = ${rightMetal.e0 >= 0 ? '+' : ''}${rightMetal.e0.toFixed(2)} V`;

    // Bán phản ứng Anode & Cathode
    const rxnLeft = document.getElementById('rxn-left-text');
    const rxnRight = document.getElementById('rxn-right-text');

    if (rxnLeft) {
      if (cell.anodePosition === 'left') {
        rxnLeft.innerHTML = `Quá trình oxi hóa: <strong>${leftMetal.symbol} → ${leftMetal.ion} + ${leftMetal.n}e</strong>`;
      } else {
        rxnLeft.innerHTML = `Quá trình khử: <strong>${leftMetal.ion} + ${leftMetal.n}e → ${leftMetal.symbol}</strong>`;
      }
    }

    if (rxnRight) {
      if (cell.anodePosition === 'right') {
        rxnRight.innerHTML = `Quá trình oxi hóa: <strong>${rightMetal.symbol} → ${rightMetal.ion} + ${rightMetal.n}e</strong>`;
      } else {
        rxnRight.innerHTML = `Quá trình khử: <strong>${rightMetal.ion} + ${rightMetal.n}e → ${rightMetal.symbol}</strong>`;
      }
    }

    // 3. Vôn kế trên HUD & Nút que đo
    const hudVal = document.getElementById('hud-voltage-val');
    const hudTag = document.getElementById('hud-voltage-tag');
    const hudStatus = document.getElementById('hud-status-text');
    const btnProbe = document.getElementById('btn-toggle-probe');

    if (btnProbe) {
      btnProbe.innerHTML = probeRightIsPositive 
        ? '🔄 Que Đo: <strong>Đỏ Phải (+) | Đen Trái (−)</strong>' 
        : '🔄 Que Đo: <strong>Đỏ Trái (+) | Đen Phải (−)</strong>';
    }

    if (hudVal) {
      if (!circuitClosed || !saltBridgeActive) {
        hudVal.textContent = '0.00 V';
        hudVal.style.color = '#94a3b8';
      } else if (cell.measuredVoltage < 0) {
        hudVal.textContent = `${cell.measuredVoltage.toFixed(2)} V`;
        hudVal.style.color = '#ef4444'; // Đỏ cảnh báo âm
      } else if (cell.measuredVoltage > 0) {
        hudVal.textContent = `+${cell.measuredVoltage.toFixed(2)} V`;
        hudVal.style.color = '#38bdf8'; // Xanh lam chuẩn
      } else {
        hudVal.textContent = '0.00 V';
        hudVal.style.color = '#94a3b8';
      }
    }

    if (hudTag) {
      if (!circuitClosed || !saltBridgeActive || cell.isIdentical) {
        hudTag.style.display = 'none';
      } else if (cell.measuredVoltage < 0) {
        hudTag.style.display = 'inline-block';
        hudTag.className = 'hud-volt-tag reverse';
        hudTag.textContent = '⚠️ NGƯỢC CỰC';
      } else {
        hudTag.style.display = 'inline-block';
        hudTag.className = 'hud-volt-tag forward';
        hudTag.textContent = '🟢 THUẬN CỰC';
      }
    }

    if (hudStatus) {
      if (!circuitClosed) {
        hudStatus.innerHTML = '<span style="color: #f87171;">⚠️ Khóa K đang mở: Mạch hở, không có dòng electron!</span>';
      } else if (!saltBridgeActive) {
        hudStatus.innerHTML = '<span style="color: #fbbf24;">⚠️ Cầu muối đã rút ra: Tích tụ điện tích làm ngắt mạch kín (U = 0.00V)!</span>';
      } else if (cell.isIdentical) {
        hudStatus.innerHTML = '<span style="color: #fbbf24;">ℹ️ Hai điện cực cùng kim loại: E° bằng nhau nên E°pin = 0.00V!</span>';
      } else if (cell.measuredVoltage < 0) {
        hudStatus.innerHTML = `<span style="color: #f87171;">⚠️ <strong>VÔN KẾ CHỈ SỐ ÂM (${cell.measuredVoltage.toFixed(2)} V):</strong> Do que đo dương (+) nối Anode (${cell.anode.symbol}, E° thấp hơn) và que đo âm (−) nối Cathode (${cell.cathode.symbol}, E° cao hơn). SĐĐ chuẩn pin là <strong>+${cell.eCell.toFixed(2)} V</strong>.</span>`;
      } else {
        hudStatus.innerHTML = `🟢 Pin hoạt động: Electron chạy từ Anode <strong>${cell.anode.symbol}</strong> sang Cathode <strong>${cell.cathode.symbol}</strong>. SĐĐ chuẩn pin = <strong>+${cell.eCell.toFixed(2)} V</strong>`;
      }
    }

    // 4. Phản ứng tổng quát & So sánh SĐĐ vs Số đo Vôn kế
    const calcResult = document.getElementById('calc-result-text');
    const calcMeasured = document.getElementById('calc-measured-text');
    const calcBox = document.getElementById('calc-equation-box');

    if (calcResult) {
      calcResult.textContent = `+${cell.eCell.toFixed(2)} V`;
    }

    if (calcMeasured) {
      if (!circuitClosed || !saltBridgeActive) {
        calcMeasured.innerHTML = `<span style="color: #94a3b8;">0.00 V (Mạch hở)</span>`;
      } else if (cell.measuredVoltage < 0) {
        calcMeasured.innerHTML = `<span style="color: #ef4444; font-weight: 800;">${cell.measuredVoltage.toFixed(2)} V (⚠️ Mắc ngược cực đo)</span>`;
      } else if (cell.measuredVoltage > 0) {
        calcMeasured.innerHTML = `<span style="color: #10b981; font-weight: 800;">+${cell.measuredVoltage.toFixed(2)} V (🟢 Mắc thuận cực)</span>`;
      } else {
        calcMeasured.innerHTML = `<span style="color: #94a3b8;">0.00 V</span>`;
      }
    }

    if (calcBox) {
      if (cell.isIdentical) {
        calcBox.innerHTML = 'Hai điện cực giống nhau, không phát sinh chênh lệch thế năng hóa học.';
      } else {
        // Cân bằng electron giữa Anode và Cathode
        const anN = cell.anode.n;
        const catN = cell.cathode.n;
        const lcm = (anN * catN) / gcd(anN, catN);
        const anCoeff = lcm / anN;
        const catCoeff = lcm / catN;

        const anPart = `${anCoeff > 1 ? anCoeff : ''}${cell.anode.symbol}`;
        const catIonPart = `${catCoeff > 1 ? catCoeff : ''}${cell.cathode.ion}`;
        const anIonPart = `${anCoeff > 1 ? anCoeff : ''}${cell.anode.ion}`;
        const catPart = `${catCoeff > 1 ? catCoeff : ''}${cell.cathode.symbol}`;

        let warningHtml = '';
        if (cell.measuredVoltage < 0 && circuitClosed && saltBridgeActive) {
          warningHtml = `
            <div style="margin-top: 0.65rem; padding: 0.5rem 0.75rem; background: rgba(239, 68, 68, 0.1); border-left: 3px solid #ef4444; border-radius: 4px; font-size: 0.8rem; color: #f87171; line-height: 1.45;">
              <strong>⚠️ Lưu ý sư phạm khi Vôn kế hiển thị số ÂM:</strong><br>
              • Sức điện động chuẩn lý thuyết của pin là đại lượng không đổi và luôn dương: <strong>E°<sub>pin</sub> = E°<sub>Cathode</sub> − E°<sub>Anode</sub> = +${cell.eCell.toFixed(2)} V</strong>.<br>
              • Vôn kế hiển thị số âm <strong>(${cell.measuredVoltage.toFixed(2)} V)</strong> do chốt dương (+) cắm vào điện cực có thế thấp hơn (Anode), còn chốt âm (−) cắm vào điện cực có thế cao hơn (Cathode).<br>
              • Nhấn nút <em>"⇄ Đổi Vị Trí Trái / Phải"</em> hoặc <em>"🔄 Đảo Que Đo (+ / −)"</em> để đưa số đo về giá trị dương chuẩn!
            </div>
          `;
        }

        calcBox.innerHTML = `
          <strong>Phản ứng tổng quát trong pin:</strong><br>
          <span style="font-size: 0.95rem; font-family: 'Cambria Math', serif; color: var(--text-main); font-weight: 700;">
            ${anPart} + ${catIonPart} → ${anIonPart} + ${catPart}
          </span><br>
          <small style="color: var(--text-muted);">
            (Anode: ${cell.anode.symbol} bị tan dần; Cathode: kim loại ${cell.cathode.symbol} bám dày thêm)
          </small>
          ${warningHtml}
        `;
      }
    }

    // Cập nhật lại thanh Dãy điện hóa
    renderECSSeriesStrip();
  }

  function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
  }

  /* ─────────────────────────────────────────────────────────────
     7. KHỞI TẠO HỆ THỐNG HẠT (PARTICLES: ELECTRON & ION CẦU MUỐI)
  ───────────────────────────────────────────────────────────── */
  function initParticleSystem() {
    electrons = [];
    saltK = [];
    saltNO3 = [];
    anodeIons = [];
    cathodeIons = [];

    // Tạo các hạt electron chạy trên dây dẫn hình chữ U lộn ngược
    for (let i = 0; i < 24; i++) {
      electrons.push({
        progress: i / 24, // 0 -> 1 trên đường dây
        speed: 0.003
      });
    }

    // Tạo các ion K⁺ và NO₃⁻ trong cầu muối hình chữ U lộn ngược
    for (let i = 0; i < 14; i++) {
      saltK.push({ progress: (i / 14) });
      saltNO3.push({ progress: (i / 14) });
    }
  }

  /* ─────────────────────────────────────────────────────────────
     8. VÒNG LẶP RENDER CANVAS 2D THỜI GIAN THỰC (60 FPS)
  ───────────────────────────────────────────────────────────── */
  function startSimulationLoop() {
    if (animId) cancelAnimationFrame(animId);

    function loop() {
      renderGalvanicCanvas();
      animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);
  }

  function renderGalvanicCanvas() {
    if (!ctx || !canvas) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const cell = getCellData();
    const isLive = circuitClosed && saltBridgeActive && !cell.isIdentical;

    // Tọa độ 2 cốc thí nghiệm
    const cupW = 190;
    const cupH = 220;
    const cupLeftX = 140;
    const cupRightX = 530;
    const cupY = 240;

    // 1. Vẽ mặt bàn phòng thí nghiệm
    drawLabTable(w, h);

    // 2. Vẽ 2 Cốc thủy tinh & Dung dịch chất điện li
    drawBeaker(cupLeftX, cupY, cupW, cupH, leftMetal, 'Trái: ' + leftMetal.solName);
    drawBeaker(cupRightX, cupY, cupW, cupH, rightMetal, 'Phải: ' + rightMetal.solName);

    // 3. Vẽ 2 Thanh điện cực kim loại nhúng vào dung dịch
    const rodW = 38;
    const rodH = 230;
    const rodLeftX = cupLeftX + 50;
    const rodRightX = cupRightX + cupW - 50 - rodW;
    const rodY = cupY - 40;

    drawElectrodeRod(rodLeftX, rodY, rodW, rodH, leftMetal, cell.anodePosition === 'left', cell.redProbePosition === 'left');
    drawElectrodeRod(rodRightX, rodY, rodW, rodH, rightMetal, cell.anodePosition === 'right', cell.redProbePosition === 'right');

    // 4. Vẽ Cầu Muối U-tube bắc qua 2 cốc
    if (saltBridgeActive) {
      drawSaltBridge(cupLeftX + cupW - 35, cupRightX + 35, cupY + 15, isLive, cell);
    }

    // 5. Vẽ Mạch dây dẫn ngoài & Vôn kế điện tử
    drawOuterCircuit(rodLeftX + rodW / 2, rodRightX + rodW / 2, rodY, isLive, cell);

    // 6. Vẽ Hoạt ảnh dòng electron & bọt khí / ion tan
    if (isLive) {
      drawElectronsOnWire(rodLeftX + rodW / 2, rodRightX + rodW / 2, rodY, cell.electronDirection);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     9. CÁC HÀM HỌA VẼ THÀNH PHẦN CANVAS
  ───────────────────────────────────────────────────────────── */
  function drawLabTable(w, h) {
    // Mặt bàn gỗ phòng thí nghiệm hiện đại
    const tableY = 460;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, tableY, w, h - tableY);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, tableY);
    ctx.lineTo(w, tableY);
    ctx.stroke();

    // Vách tường nền nhẹ
    const grad = ctx.createLinearGradient(0, 0, 0, tableY);
    grad.addColorStop(0, '#070d1e');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, tableY);
  }

  function drawBeaker(x, y, w, h, metal, label) {
    ctx.save();

    // Khối dung dịch chất điện li bên trong cốc
    const solY = y + 45;
    const solH = h - 50;
    ctx.fillStyle = metal.solColor;
    ctx.fillRect(x + 6, solY, w - 12, solH);

    // Gợn sóng nhẹ trên mặt dung dịch
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(x + 6, solY - 2, w - 12, 4);

    // Thành cốc thủy tinh trong suốt viền bo đáy
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.7)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x - 5, y);
    ctx.lineTo(x + 5, y);
    ctx.lineTo(x + 5, y + h - 10);
    ctx.quadraticCurveTo(x + 5, y + h, x + 15, y + h);
    ctx.lineTo(x + w - 15, y + h);
    ctx.quadraticCurveTo(x + w - 5, y + h, x + w - 5, y + h - 10);
    ctx.lineTo(x + w - 5, y);
    ctx.lineTo(x + w + 5, y);
    ctx.stroke();

    // Vạch chia thể tích thủy tinh (100ml, 200ml, 300ml)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.5;
    for (let i = 1; i <= 3; i++) {
      const markY = y + h - (i * 45);
      ctx.beginPath();
      ctx.moveTo(x + 8, markY);
      ctx.lineTo(x + 24, markY);
      ctx.stroke();
    }

    // Nhãn dung dịch dưới đáy cốc
    ctx.fillStyle = '#f8fafc';
    ctx.font = '700 11px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, x + w / 2, y + h + 22);

    ctx.restore();
  }

  function drawElectrodeRod(x, y, w, h, metal, isAnode, isRedProbe) {
    ctx.save();

    // Vẽ thanh kim loại nguyên khối
    const rodGrad = ctx.createLinearGradient(x, y, x + w, y);
    rodGrad.addColorStop(0, metal.color);
    rodGrad.addColorStop(0.5, '#ffffff');
    rodGrad.addColorStop(1, metal.color);

    ctx.fillStyle = rodGrad;
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    // Kẹp cá sấu giữ điện cực ở trên (đỏ nếu nối chốt +, đen xám nếu nối chốt -)
    const clipColor = isRedProbe ? '#dc2626' : '#1e293b';
    ctx.fillStyle = clipColor;
    ctx.fillRect(x - 4, y - 8, w + 8, 12);
    ctx.strokeStyle = isRedProbe ? '#fca5a5' : '#64748b';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(x - 4, y - 8, w + 8, 12);

    // Nhãn que đo nối kẹp cá sấu (+ hoặc −)
    ctx.fillStyle = isRedProbe ? '#fca5a5' : '#cbd5e1';
    ctx.font = '800 8.5px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(isRedProbe ? 'Que (+)' : 'Que (−)', x + w / 2, y - 11);

    // Tên kim loại in nổi trên thanh
    ctx.save();
    ctx.translate(x + w / 2, y + 45);
    ctx.fillStyle = '#0f172a';
    ctx.font = '800 13px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(metal.symbol, 0, 0);
    ctx.restore();

    // Nhãn cực Anode (-) / Cathode (+)
    ctx.fillStyle = isAnode ? '#60a5fa' : '#f87171';
    ctx.font = '800 11px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(isAnode ? 'ANODE (−)' : 'CATHODE (+)', x + w / 2, y - 22);

    ctx.restore();
  }

  function drawSaltBridge(x1, x2, yBase, isLive, cell) {
    ctx.save();

    const bridgeW = 32;
    const topY = 160;
    const legDepth = 150;

    // Dung dịch thạch Agar-agar ngâm KNO3 bên trong ống chữ U
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.55)';
    ctx.lineWidth = bridgeW - 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, yBase + legDepth);
    ctx.lineTo(x1, topY);
    ctx.lineTo(x2, topY);
    ctx.lineTo(x2, yBase + legDepth);
    ctx.stroke();

    // Ống thủy tinh chữ U ngược bên ngoài
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.85)';
    ctx.lineWidth = 3;
    ctx.lineCap = 'butt';
    
    // Viền ngoài
    ctx.beginPath();
    ctx.moveTo(x1 - bridgeW / 2, yBase + legDepth);
    ctx.lineTo(x1 - bridgeW / 2, topY - bridgeW / 2);
    ctx.lineTo(x2 + bridgeW / 2, topY - bridgeW / 2);
    ctx.lineTo(x2 + bridgeW / 2, yBase + legDepth);
    ctx.stroke();

    // Viền trong
    ctx.beginPath();
    ctx.moveTo(x1 + bridgeW / 2, yBase + legDepth);
    ctx.lineTo(x1 + bridgeW / 2, topY + bridgeW / 2);
    ctx.lineTo(x2 - bridgeW / 2, topY + bridgeW / 2);
    ctx.lineTo(x2 - bridgeW / 2, yBase + legDepth);
    ctx.stroke();

    // Nút bông xốp xốp ngăn dung dịch tràn ra
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x1 - bridgeW / 2 + 3, yBase + legDepth - 8, bridgeW - 6, 8);
    ctx.fillRect(x2 - bridgeW / 2 + 3, yBase + legDepth - 8, bridgeW - 6, 8);

    // Chữ chú thích Cầu Muối KNO3
    ctx.fillStyle = '#fef08a';
    ctx.font = '800 11px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CẦU MUỐI (KNO₃)', (x1 + x2) / 2, topY - 22);

    // Nếu pin đang hoạt động: Vẽ ion K⁺ và NO₃⁻ di chuyển
    if (isLive) {
      const time = performance.now() * 0.001;
      
      // Hướng ion: K⁺ sang Cathode, NO₃⁻ sang Anode
      const kTargetLeft = cell.cathodePosition === 'left';
      
      ctx.font = '700 9px monospace';
      
      // K⁺ (màu tím)
      ctx.fillStyle = '#c084fc';
      for (let i = 0; i < 4; i++) {
        const offset = ((time * 0.2 + i * 0.25) % 1);
        const pt = getBridgePoint(x1, x2, topY, yBase + legDepth, kTargetLeft ? (1 - offset) : offset);
        ctx.fillText('K⁺', pt.x, pt.y);
      }

      // NO₃⁻ (màu vàng nhạt)
      ctx.fillStyle = '#fef08a';
      for (let i = 0; i < 4; i++) {
        const offset = ((time * 0.2 + i * 0.25) % 1);
        const pt = getBridgePoint(x1, x2, topY, yBase + legDepth, kTargetLeft ? offset : (1 - offset));
        ctx.fillText('NO₃⁻', pt.x, pt.y + 4);
      }
    }

    ctx.restore();
  }

  function getBridgePoint(x1, x2, topY, bottomY, t) {
    const legLen = bottomY - topY;
    const topLen = x2 - x1;
    const totalLen = legLen * 2 + topLen;
    const dist = t * totalLen;

    if (dist < legLen) {
      return { x: x1, y: bottomY - dist };
    } else if (dist < legLen + topLen) {
      return { x: x1 + (dist - legLen), y: topY };
    } else {
      return { x: x2, y: topY + (dist - legLen - topLen) };
    }
  }

  function drawOuterCircuit(xLeft, xRight, yRod, isLive, cell) {
    ctx.save();

    const wireTopY = 60;
    const midX = (xLeft + xRight) / 2;

    // Màu dây dẫn:
    // Nhánh nối với que Đỏ (+): màu cam/đỏ `#f59e0b`
    // Nhánh nối với que Đen (−): màu xám chì `#475569`
    const leftWireColor = cell.redProbePosition === 'left' ? '#f59e0b' : '#475569';
    const rightWireColor = cell.redProbePosition === 'right' ? '#f59e0b' : '#475569';

    // Nhánh trái
    ctx.strokeStyle = circuitClosed ? leftWireColor : '#64748b';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(xLeft, yRod);
    ctx.lineTo(xLeft, wireTopY);
    ctx.lineTo(midX - 54, wireTopY);
    ctx.stroke();

    // Nhánh phải
    ctx.strokeStyle = circuitClosed ? rightWireColor : '#64748b';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(midX + 54, wireTopY);
    ctx.lineTo(xRight, wireTopY);
    ctx.lineTo(xRight, yRod);
    ctx.stroke();

    // Khóa K (Công tắc gạt) trên nhánh bên phải
    const switchX = xRight - 70;
    const switchY = wireTopY;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(switchX - 15, switchY - 8, 30, 16);
    
    ctx.strokeStyle = circuitClosed ? '#10b981' : '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(switchX - 12, switchY);
    if (circuitClosed) {
      ctx.lineTo(switchX + 12, switchY); // Khóa K đóng
    } else {
      ctx.lineTo(switchX + 8, switchY - 18); // Khóa K mở
    }
    ctx.stroke();

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '700 9px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Khóa K', switchX, switchY + 20);

    // Đồng hồ Vôn kế điện tử chính giữa
    const meterW = 108;
    const meterH = 72;
    const meterX = midX - meterW / 2;
    const meterY = wireTopY - meterH / 2;

    // Vỏ vôn kế
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(meterX, meterY, meterW, meterH, 8) : ctx.rect(meterX, meterY, meterW, meterH);
    ctx.fill();
    ctx.strokeStyle = cell.isReversedPolarity ? '#ef4444' : '#38bdf8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 2 Jack cắm (Trái và Phải) trên vôn kế
    // Jack Trái
    const jackLeftColor = cell.redProbePosition === 'left' ? '#dc2626' : '#1e293b';
    const jackLeftBorder = cell.redProbePosition === 'left' ? '#fca5a5' : '#64748b';
    const jackLeftSign = cell.redProbePosition === 'left' ? '+' : '−';
    ctx.fillStyle = jackLeftColor;
    ctx.strokeStyle = jackLeftBorder;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(meterX + 6, wireTopY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(jackLeftSign, meterX + 6, wireTopY - 7);

    // Jack Phải
    const jackRightColor = cell.redProbePosition === 'right' ? '#dc2626' : '#1e293b';
    const jackRightBorder = cell.redProbePosition === 'right' ? '#fca5a5' : '#64748b';
    const jackRightSign = cell.redProbePosition === 'right' ? '+' : '−';
    ctx.fillStyle = jackRightColor;
    ctx.strokeStyle = jackRightBorder;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(meterX + meterW - 6, wireTopY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(jackRightSign, meterX + meterW - 6, wireTopY - 7);

    // Màn hình LCD LED hiển thị số Vôn
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(meterX + 10, meterY + 10, meterW - 20, 34);
    ctx.strokeStyle = cell.isReversedPolarity ? '#7f1d1d' : '#1e293b';
    ctx.strokeRect(meterX + 10, meterY + 10, meterW - 20, 34);

    let vText = '0.00 V';
    let vColor = '#64748b';
    let subStatus = 'HỞ MẠCH';

    if (circuitClosed && saltBridgeActive) {
      if (cell.measuredVoltage < 0) {
        vText = `${cell.measuredVoltage.toFixed(2)} V`;
        vColor = '#ef4444'; // Đỏ cảnh báo âm
        subStatus = 'NGƯỢC CỰC (−)';
      } else if (cell.measuredVoltage > 0) {
        vText = `+${cell.measuredVoltage.toFixed(2)} V`;
        vColor = '#38bdf8'; // Xanh chuẩn dương
        subStatus = 'THUẬN CỰC (+)';
      } else {
        vText = '0.00 V';
        vColor = '#94a3b8';
        subStatus = 'E° = 0.00 V';
      }
    }

    ctx.fillStyle = vColor;
    ctx.font = '700 17px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(vText, midX, meterY + 28);

    // Dòng chữ phụ trên màn LCD
    ctx.font = '700 8px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = cell.isReversedPolarity ? '#f87171' : '#64748b';
    ctx.fillText(subStatus, midX, meterY + 40);

    // Nhãn tên Vôn kế bên dưới
    ctx.font = '800 9px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('VÔN KẾ (V)', midX, meterY + 58);

    ctx.restore();
  }

  function drawElectronsOnWire(xLeft, xRight, yRod, direction) {
    ctx.save();

    const wireTopY = 60;
    const time = performance.now() * 0.0015;

    // Chiều dịch chuyển electron (direction = 1: Trái -> Phải; direction = -1: Phải -> Trái)
    // 3 đoạn dây: (1) Trái đi lên, (2) Ngang qua vôn kế, (3) Phải đi xuống
    const legH = yRod - wireTopY;
    const topW = xRight - xLeft;
    const totalWire = legH * 2 + topW;

    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 6;

    for (let i = 0; i < 18; i++) {
      let t = ((time * 0.35 + i * (1 / 18)) % 1);
      if (direction === -1) {
        t = 1 - t; // Đảo chiều electron nếu Anode bên phải
      }

      const dist = t * totalWire;
      let px, py;

      if (dist < legH) {
        // Đoạn 1: từ đầu cực trái lên góc trên
        px = xLeft;
        py = yRod - dist;
      } else if (dist < legH + topW) {
        // Đoạn 2: chạy ngang qua
        px = xLeft + (dist - legH);
        py = wireTopY;
      } else {
        // Đoạn 3: từ góc trên bên phải xuống cực phải
        px = xRight;
        py = wireTopY + (dist - legH - topW);
      }

      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  /* ─────────────────────────────────────────────────────────────
     10. CÁC HÀM XỬ LÝ SỰ KIỆN GIAO DIỆN (INTERACTIONS)
  ───────────────────────────────────────────────────────────── */
  window.galvanicSelectLeft = function (metalId) {
    const found = METALS.find(m => m.id === metalId);
    if (found) {
      leftMetal = found;
      updateUIElements();
    }
  };

  window.galvanicSelectRight = function (metalId) {
    const found = METALS.find(m => m.id === metalId);
    if (found) {
      rightMetal = found;
      updateUIElements();
    }
  };

  window.galvanicToggleCircuit = function () {
    circuitClosed = !circuitClosed;
    const btn = document.getElementById('btn-toggle-circuit');
    if (btn) {
      btn.classList.toggle('active', circuitClosed);
      btn.innerHTML = `⚡ Công Tắc K: <strong>${circuitClosed ? 'ĐÓNG (Chạy)' : 'NGẮT (Hở Mạch)'}</strong>`;
    }
    updateUIElements();
  };

  window.galvanicToggleSaltBridge = function () {
    saltBridgeActive = !saltBridgeActive;
    const btn = document.getElementById('btn-toggle-bridge');
    if (btn) {
      btn.classList.toggle('active', saltBridgeActive);
      btn.innerHTML = `🧪 Cầu Muối KNO₃: <strong>${saltBridgeActive ? 'ĐANG GẮN' : 'ĐÃ RÚT RA'}</strong>`;
    }
    updateUIElements();
  };

  window.galvanicResetStandard = function () {
    leftMetal = METALS.find(m => m.id === 'Zn');
    rightMetal = METALS.find(m => m.id === 'Cu');
    circuitClosed = true;
    saltBridgeActive = true;
    probeRightIsPositive = true;

    const selL = document.getElementById('select-metal-left');
    const selR = document.getElementById('select-metal-right');
    if (selL) selL.value = 'Zn';
    if (selR) selR.value = 'Cu';

    const btnC = document.getElementById('btn-toggle-circuit');
    const btnB = document.getElementById('btn-toggle-bridge');
    const btnP = document.getElementById('btn-toggle-probe');
    if (btnC) { btnC.classList.add('active'); btnC.innerHTML = '⚡ Công Tắc K: <strong>ĐÓNG (Chạy)</strong>'; }
    if (btnB) { btnB.classList.add('active'); btnB.innerHTML = '🧪 Cầu Muối KNO₃: <strong>ĐANG GẮN</strong>'; }
    if (btnP) { btnP.innerHTML = '🔄 Que Đo: <strong>Đỏ Phải (+) | Đen Trái (−)</strong>'; }

    updateUIElements();
  };

  window.galvanicSwapElectrodes = function () {
    const temp = leftMetal;
    leftMetal = rightMetal;
    rightMetal = temp;

    const selL = document.getElementById('select-metal-left');
    const selR = document.getElementById('select-metal-right');
    if (selL) selL.value = leftMetal.id;
    if (selR) selR.value = rightMetal.id;

    updateUIElements();
  };

  window.galvanicToggleProbe = function () {
    probeRightIsPositive = !probeRightIsPositive;
    const btnP = document.getElementById('btn-toggle-probe');
    if (btnP) {
      btnP.innerHTML = probeRightIsPositive 
        ? '🔄 Que Đo: <strong>Đỏ Phải (+) | Đen Trái (−)</strong>' 
        : '🔄 Que Đo: <strong>Đỏ Trái (+) | Đen Phải (−)</strong>';
    }
    updateUIElements();
  };

  window.galvanicToggleFullscreen = function () {
    const wrapper = document.querySelector('.galvanic-wrapper');
    if (!wrapper) return;

    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (wrapper.requestFullscreen) {
        wrapper.requestFullscreen().catch(() => {
          wrapper.classList.toggle('is-fullscreen');
          updateFullscreenState(wrapper.classList.contains('is-fullscreen'));
        });
      } else if (wrapper.webkitRequestFullscreen) {
        wrapper.webkitRequestFullscreen();
      } else {
        wrapper.classList.toggle('is-fullscreen');
        updateFullscreenState(wrapper.classList.contains('is-fullscreen'));
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  };

  function updateFullscreenState(isFull) {
    const btn = document.getElementById('btn-fullscreen');
    if (btn) {
      btn.innerHTML = isFull ? '🗗 Thu Nhỏ Màn Hình' : '⛶ Toàn Màn Hình';
      btn.classList.toggle('active', isFull);
    }
    const wrapper = document.querySelector('.galvanic-wrapper');
    if (wrapper) {
      wrapper.classList.toggle('is-fullscreen', isFull);
    }
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 120);
  }

  document.addEventListener('fullscreenchange', () => {
    updateFullscreenState(!!document.fullscreenElement);
  });
  document.addEventListener('webkitfullscreenchange', () => {
    updateFullscreenState(!!document.webkitFullscreenElement);
  });

  window.galvanicClickSeriesItem = function (metalId) {
    // Nếu kim loại này chưa được chọn:
    // Tự động gán: nếu E° bé hơn cực trái hiện tại -> gán làm cực trái, ngược lại gán cực phải
    const m = METALS.find(x => x.id === metalId);
    if (!m) return;

    if (m.e0 <= leftMetal.e0) {
      leftMetal = m;
      const selL = document.getElementById('select-metal-left');
      if (selL) selL.value = m.id;
    } else {
      rightMetal = m;
      const selR = document.getElementById('select-metal-right');
      if (selR) selR.value = m.id;
    }

    updateUIElements();
  };

  /* ─────────────────────────────────────────────────────────────
     11. KHỞI TẠO KHI TẢI TRANG
  ───────────────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      buildGalvanicUI();
    });
  } else {
    buildGalvanicUI();
  }

  window.addEventListener('resize', () => {
    const c = document.getElementById('galvanic-canvas');
    if (c && c.offsetParent !== null) {
      // resize adjustments if needed
    }
  });

})();
