/* ==========================================================================
   THÍ NGHIỆM VẬT LÝ — SỰ CHÌM NỔI & LỰC ĐẨY ARCHIMEDES (KHTN 8 - GDPT 2018)
   Học Liệu Số Tương Tác 4 Bước (POE) Phá Vỡ Quan Niệm Sai Lầm:
   "Vật Nặng Thì Chìm, Vật Nhẹ Thì Nổi" — Thí Nghiệm Quả Cam & Lực Đẩy Archimedes
   Tác giả: Đỗ Văn Nhật Minh — Trường ĐH Sư phạm TP.HCM (HCMUE)
   ========================================================================== */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────
     1. DỮ LIỆU CÁC CẶP VẬT THỂ THÍ NGHIỆM ĐỐI CHỨNG
  ───────────────────────────────────────────────────────────── */
  const OBJECT_PAIRS = {
    'orange': {
      id: 'orange',
      title: 'Quả Cam: Nguyên Vỏ vs Bóc Vỏ',
      badge: '🍊 Mẫu vật cốt lõi — Phá vỡ quan niệm',
      desc: 'Thí nghiệm kinh điển đập tan quan niệm "nặng = chìm, nhẹ = nổi". Quả cam nguyên vỏ nặng hơn nhưng lại nổi; quả bóc vỏ nhẹ hơn lại chìm nghỉm.',
      saltSupported: false,
      obj1: {
        id: 'orange-unpeeled',
        name: 'Cam Nguyên Vỏ',
        subName: 'Còn lớp vỏ xốp (Albedo)',
        mass: 260, // g (Nặng hơn!)
        volume: 280, // cm3
        density: 0.929, // g/cm3 < 1.0 -> Nổi!
        radius: 42,
        color: '#f97316',
        skinColor: '#ea580c',
        isPeeled: false,
        desc: 'Vỏ sần sùi dày, lớp xốp trắng chứa hàng ngàn túi khí li ti đóng vai trò như chiếc phao cứu sinh.',
        initX: 110,
        initY: 100
      },
      obj2: {
        id: 'orange-peeled',
        name: 'Cam Bóc Vỏ',
        subName: 'Đã bóc sạch lớp vỏ xốp',
        mass: 210, // g (Nhẹ hơn!)
        volume: 200, // cm3 (Thể tích giảm mạnh)
        density: 1.050, // g/cm3 > 1.0 -> Chìm!
        radius: 35,
        color: '#fb923c',
        skinColor: '#f97316',
        isPeeled: true,
        desc: 'Múi cam mọng nước chứa đường và axit hữu cơ đặc, không còn túi khí giữ thể tích.',
        initX: 250,
        initY: 100
      },
      question: {
        q: 'Bạn vừa cân: Quả cam nguyên vỏ nặng 260g, quả cam bóc vỏ nặng 210g. Khi thả cả hai quả vào bình nước, hiện tượng gì sẽ xảy ra?',
        options: [
          'Quả nguyên vỏ (nặng hơn) chìm, quả bóc vỏ (nhẹ hơn) nổi.',
          'Cả hai quả cùng chìm vì quả cam nào cũng nặng hơn nước.',
          'Quả nguyên vỏ (nặng hơn) nổi, quả bóc vỏ (nhẹ hơn) chìm.',
          'Cả hai quả cùng nổi bồng bềnh trên mặt nước.'
        ],
        misconceptionIndex: 0,
        correctIndex: 2,
        explain: 'BẤT NGỜ CHƯA? 😲 Quả cam nguyên vỏ (nặng 260g) lại NỔI, còn quả bóc vỏ (nhẹ 210g) lại CHÌM! Kết quả thực tế hoàn toàn trái ngược với trực giác "vật nặng thì chìm, vật nhẹ thì nổi".'
      }
    },

    'coke': {
      id: 'coke',
      title: 'Lon Coca Thường vs Lon Diet Coke',
      badge: '🥤 Thử thách đường hòa tan',
      desc: 'Cùng là lon nhôm dung tích 355ml, nhưng lon chứa đường nặng hơn nên chìm; lon ăn kiêng dùng chất tạo ngọt vi lượng nên nổi.',
      saltSupported: false,
      obj1: {
        id: 'coke-regular',
        name: 'Coca Thường (Có Đường)',
        subName: 'Chứa 39g đường mía hòa tan',
        mass: 384, // g
        volume: 355, // cm3
        density: 1.082, // g/cm3 > 1.0 -> Chìm!
        radius: 38,
        width: 48,
        height: 76,
        color: '#dc2626',
        isCan: true,
        desc: '39g đường Sacarôzơ hòa tan làm tăng khối lượng tổng thể mà không làm tăng thể tích lon.',
        initX: 110,
        initY: 100
      },
      obj2: {
        id: 'coke-diet',
        name: 'Diet Coke (Ăn Kiêng)',
        subName: 'Chất tạo ngọt Aspartame 0.18g',
        mass: 356, // g
        volume: 355, // cm3
        density: 0.992, // g/cm3 < 1.0 -> Nổi!
        radius: 38,
        width: 48,
        height: 76,
        color: '#64748b',
        isCan: true,
        desc: 'Độ ngọt tương đương nhưng chỉ cần 0.18g chất tạo ngọt nhân tạo, khối lượng riêng nhỏ hơn 1.0 g/cm³.',
        initX: 250,
        initY: 100
      },
      question: {
        q: 'Hai lon nước ngọt có cùng kích thước 355ml: Lon Coca thường nặng 384g (chứa đường), lon Diet Coke nặng 356g (dùng chất tạo ngọt ăn kiêng). Hiện tượng khi thả vào nước?',
        options: [
          'Lon Coca thường (nặng hơn) chìm, lon Diet Coke (nhẹ hơn) nổi.',
          'Cả 2 lon cùng chìm vì vỏ lon làm bằng kim loại nhôm.',
          'Cả 2 lon cùng nổi vì bên trong có chứa khí gas CO₂ nén.',
          'Lon Coca thường nổi, lon Diet Coke chìm.'
        ],
        misconceptionIndex: 1,
        correctIndex: 0,
        explain: 'Chính xác! Lon Coca thường chứa đến 39g đường khiến khối lượng riêng D = 1.08 g/cm³ > D_nước nên chìm. Lon Diet Coke có D = 0.99 g/cm³ < D_nước nên nổi bồng bềnh.'
      }
    },

    'boat': {
      id: 'boat',
      title: 'Tàu Thép Khổng Lồ vs Viên Bi Sắt',
      badge: '🚢 Bí mật hàng hải',
      desc: 'Vì sao một con tàu bằng thép nặng hàng vạn tấn lại nổi, trong khi một viên bi sắt bé tí hon nặng 100g lại chìm nghỉm?',
      saltSupported: false,
      obj1: {
        id: 'boat-ship',
        name: 'Mô Hình Tàu Thép Rỗng',
        subName: 'Thép uốn tạo khoang chứa không khí',
        mass: 500, // g (Nặng gấp 5 lần bi sắt!)
        volume: 1200, // cm3 (Khoang rỗng cực lớn)
        density: 0.417, // g/cm3 < 1.0 -> Nổi kiêu hãnh!
        isBoat: true,
        width: 100,
        height: 48,
        color: '#2563eb',
        desc: 'Vỏ thép mỏng uốn thành khoang rộng chứa đầy không khí, đẩy thể tích chiếm chỗ tăng vọt, giảm D xuống 0.42 g/cm³.',
        initX: 110,
        initY: 100
      },
      obj2: {
        id: 'steel-marble',
        name: 'Viên Bi Sắt Đặc',
        subName: 'Thép đặc nguyên khối',
        mass: 100, // g (Nhẹ hơn con tàu 5 lần!)
        volume: 12.7, // cm3
        density: 7.874, // g/cm3 >> 1.0 -> Chìm đáy!
        radius: 18,
        color: '#475569',
        desc: 'Khối sắt đặc không có khoang rỗng, khối lượng riêng 7.87 g/cm³ gấp gần 8 lần nước.',
        initX: 250,
        initY: 100
      },
      question: {
        q: 'Viên bi sắt nặng 100g, con tàu thép nặng tới 500g (nặng gấp 5 lần viên bi sắt). Hiện tượng gì sẽ xảy ra khi thả cả hai vào nước?',
        options: [
          'Tàu thép 500g nặng hơn chắc chắn chìm, bi sắt 100g nổi.',
          'Con tàu 500g nổi kiêu hãnh, viên bi sắt 100g chìm đáy.',
          'Cả 2 cùng chìm vì sắt thép luôn chìm trong nước.',
          'Cả 2 cùng nổi.'
        ],
        misconceptionIndex: 0,
        correctIndex: 1,
        explain: 'Bí mật nằm ở THỂ TÍCH KHOANG RỖNG: Con tàu nặng 500g nhưng uốn thành thân tàu chứa không khí, thể tích tổng lên tới 1200 cm³ nên D = 0.42 g/cm³ (rất nhẹ so với thể tích) ➔ Nổi!'
      }
    },

    'egg': {
      id: 'egg',
      title: 'Quả Trứng & Nước Muối',
      badge: '🥚 Thay đổi khối lượng riêng của nước',
      desc: 'Quả trứng chìm trong nước tinh khiết nhưng sẽ nổi bồng bềnh khi pha thêm muối ăn vào nước (tăng khối lượng riêng của chất lỏng).',
      saltSupported: true,
      obj1: {
        id: 'egg-fresh',
        name: 'Quả Trứng Gà',
        subName: 'Khối lượng riêng 1.08 g/cm³',
        mass: 60, // g
        volume: 55, // cm3
        density: 1.090, // g/cm3
        radius: 28,
        color: '#fef08a',
        skinColor: '#fde047',
        isEgg: true,
        desc: 'Trong nước ngọt (D = 1.00 g/cm³), trứng có D = 1.09 g/cm³ nên chìm. Khi pha muối làm D_nước tăng lên > 1.10 g/cm³, trứng sẽ nổi lên!',
        initX: 180,
        initY: 100
      },
      question: {
        q: 'Quả trứng gà nặng 60g có khối lượng riêng 1.09 g/cm³. Bình thường thả vào nước ngọt (D = 1.00 g/cm³) nó chìm. Nếu ta pha thật nhiều muối ăn vào nước, điều gì sẽ xảy ra?',
        options: [
          'Trứng vẫn chìm vì muối làm nước nặng hơn đè trứng xuống.',
          'Trứng sẽ từ từ nổi lên mặt nước vì khối lượng riêng của nước muối tăng lên.',
          'Trứng bị vỡ tan do áp suất muối.',
          'Trứng biến mất.'
        ],
        misconceptionIndex: 0,
        correctIndex: 1,
        explain: 'Chính xác! Khi hòa tan muối, khối lượng riêng của nước muối tăng lên (khoảng 1.15 g/cm³). Khi D_nước muối > D_trứng, lực đẩy Archimedes thắng trọng lực, nâng quả trứng nổi lên!'
      }
    }
  };

  /* ─────────────────────────────────────────────────────────────
     2. BIẾN TRẠNG THÁI TOÀN CỤC (STATE ENGINE)
  ───────────────────────────────────────────────────────────── */
  let currentPairKey = 'orange';
  let currentStep = 1; // 1: Cân khối lượng | 2: Dự đoán Plickers | 3: Thả nước & Xung đột | 4: Khám phá bí mật
  let selectedPrediction = null;
  let predictionLocked = false;
  let freeSandboxMode = false;

  // Công tắc hiển thị vật lý
  let showForceVectors = true;
  let showMagnifier = false;
  let saltGrams = 0; // Gam muối pha thêm (cho thí nghiệm trứng)

  // Canvas & Physics Loop
  let canvas, ctx;
  let animFrameId = null;
  let canvasWidth = 900, canvasHeight = 500;

  // Vị trí dụng cụ trong phòng thí nghiệm (Canvas coordinates)
  const SCALE = {
    x: 180,
    y: 360,
    w: 160,
    h: 22,
    panW: 130,
    panH: 10,
    panY: 345,
    ledX: 180,
    ledY: 410,
    tare: 0
  };

  const TANK = {
    x: 480,
    y: 160,
    w: 360,
    h: 290,
    waterY: 230, // Mực nước ban đầu
    baseWaterY: 230,
    waterDensity: 1.00, // g/cm3
    wallThick: 12
  };

  // Mẫu vật đang hoạt động trên bàn
  let activeObjects = [];
  let draggedObject = null;
  let dragOffsetX = 0, dragOffsetY = 0;

  // Hiệu ứng hạt nước & gợn sóng
  let waterRipples = [];
  let waterBubbles = [];

  /* ─────────────────────────────────────────────────────────────
     3. KHỞI TẠO VÀ BUILD GIAO DIỆN HTML
  ───────────────────────────────────────────────────────────── */
  function buildBuoyancyUI() {
    const container = document.getElementById('experiment-buoyancy');
    if (!container) return;

    const cur = OBJECT_PAIRS[currentPairKey];

    container.innerHTML = `
      <div class="buoyancy-wrapper">
        <!-- 4-Step Pedagogical POE Workflow Tracker -->
        <div class="buoyancy-poe-tracker">
          <div class="poe-step-item ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}" onclick="buoyancyJumpStep(1)">
            <div class="poe-step-num">1</div>
            <div class="poe-step-text">
              <h4>⚖️ Cung Cấp Dữ Kiện</h4>
              <small>Cân khối lượng 2 quả</small>
            </div>
          </div>
          <div class="poe-step-item ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}" onclick="buoyancyJumpStep(2)">
            <div class="poe-step-num">2</div>
            <div class="poe-step-text">
              <h4>❓ Khơi Gợi Quan Niệm</h4>
              <small>Dự đoán Plickers (POE)</small>
            </div>
          </div>
          <div class="poe-step-item ${currentStep === 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}" onclick="buoyancyJumpStep(3)">
            <div class="poe-step-num">3</div>
            <div class="poe-step-text">
              <h4>🌊 Xung Đột Nhận Thức</h4>
              <small>Thả nước & Quan sát</small>
            </div>
          </div>
          <div class="poe-step-item ${currentStep === 4 ? 'active' : ''}" onclick="buoyancyJumpStep(4)">
            <div class="poe-step-num">4</div>
            <div class="poe-step-text">
              <h4>🔬 Khám Phá & Sửa Sai</h4>
              <small>Giải thích Archimedes & D</small>
            </div>
          </div>
        </div>

        <!-- Main Lab Grid Layout: Canvas (Trái) + Sidebar Thao Tác & Kiến Thức (Phải) -->
        <div class="buoyancy-grid">
          <!-- Cột Trái: Bàn Thí Nghiệm Vật Lý Tương Tác Canvas -->
          <div class="buoyancy-canvas-box">
            <!-- Topbar bàn thí nghiệm -->
            <div class="buoyancy-canvas-topbar">
              <div class="buoyancy-active-pair-info">
                <span class="buoyancy-pair-badge">${cur.badge.split(' ')[0]}</span>
                <div>
                  <div class="buoyancy-pair-title">${cur.title}</div>
                  <small style="color: #94a3b8; font-size: 0.72rem;">${cur.badge}</small>
                </div>
              </div>

              <div class="buoyancy-topbar-actions">
                <button class="buoyancy-action-btn ${showForceVectors ? 'active' : ''}" id="btn-toggle-vectors" onclick="buoyancyToggleVectors()" title="Hiện mũi tên trọng lực P và lực đẩy Archimedes FA">
                  🏹 Vector Lực (${showForceVectors ? 'Bật' : 'Tắt'})
                </button>
                <button class="buoyancy-action-btn ${showMagnifier ? 'active' : ''}" id="btn-toggle-magnifier" onclick="buoyancyToggleMagnifier()" title="Kính lúp soi cấu trúc túi khí vỏ xốp">
                  🔬 Kính Lúp Vỏ Xốp
                </button>
                <button class="buoyancy-action-btn" onclick="buoyancyResetPositions()" title="Đưa mẫu vật về vị trí ban đầu">
                  ⚡ Đặt Lại Vị Trí
                </button>
              </div>
            </div>

            <!-- Canvas Physics Container -->
            <div class="buoyancy-canvas-wrap">
              <canvas id="buoyancy-canvas" width="900" height="480"></canvas>
            </div>

            <!-- Bottom HUD: Màn hình cân điện tử & Thước nước -->
            <div class="buoyancy-canvas-hud">
              <div class="buoyancy-hud-item">
                <span>⚖️ CÂN ĐIỆN TỬ:</span>
                <span class="buoyancy-hud-val" id="hud-scale-val">0.0 g</span>
              </div>
              <div class="buoyancy-hud-item">
                <span>🌊 DUNG DỊCH:</span>
                <span class="buoyancy-hud-val" id="hud-liquid-val">${cur.saltSupported ? 'Nước muối: ' + (1.00 + saltGrams * 0.0015).toFixed(3) + ' g/cm³' : 'Nước nguyên chất: 1.000 g/cm³'}</span>
              </div>
              <div class="buoyancy-hud-item">
                <span>🖱️ HƯỚNG DẪN:</span>
                <span style="color: #cbd5e1;">Kéo thả vật lên <strong>Cân</strong> hoặc vào <strong>Bình Nước</strong></span>
              </div>
            </div>
          </div>

          <!-- Cột Phải: Bảng Điều Khiển Sư Phạm & Câu Hỏi POE -->
          <div class="buoyancy-sidebar">
            <!-- Box 1: Chọn cặp mẫu vật -->
            <div class="buoyancy-card">
              <div class="buoyancy-card-header">
                <h3>📦 Chọn Mẫu Vật Thí Nghiệm</h3>
                <span style="font-size: 0.72rem; color: #64748b; font-weight: 700;">4 MẪU</span>
              </div>
              <div class="buoyancy-pairs-list">
                ${Object.keys(OBJECT_PAIRS).map(key => {
                  const p = OBJECT_PAIRS[key];
                  return `
                    <button class="buoyancy-pair-btn ${key === currentPairKey ? 'active' : ''}" onclick="buoyancySelectPair('${key}')">
                      <div>
                        <strong>${p.title}</strong>
                        <div style="font-size: 0.72rem; color: var(--text-muted);">${p.badge}</div>
                      </div>
                      <span>👉</span>
                    </button>
                  `;
                }).join('')}
              </div>

              ${cur.saltSupported ? `
                <div style="margin-top: 0.85rem; padding-top: 0.75rem; border-top: 1px dashed var(--border-light);">
                  <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 700; margin-bottom: 0.35rem;">
                    <span>🧂 Pha muối vào nước:</span>
                    <span id="salt-grams-lbl" style="color: #2563eb;">${saltGrams} g</span>
                  </div>
                  <input type="range" id="salt-slider" min="0" max="100" step="5" value="${saltGrams}" oninput="buoyancyChangeSalt(this.value)" style="width: 100%;">
                </div>
              ` : ''}
            </div>

            <!-- Box 2: Tương tác theo bước POE (Dự đoán Plickers hoặc Giải thích khoa học) -->
            <div id="poe-content-box">
              <!-- Nội dung sẽ render động theo currentStep -->
            </div>
          </div>
        </div>
      </div>
    `;

    canvas = document.getElementById('buoyancy-canvas');
    if (canvas) {
      ctx = canvas.getContext('2d');
      setupCanvasInteractions();
    }

    initObjectsForPair(currentPairKey);
    renderPOEContent();
    startPhysicsEngine();
  }

  /* ─────────────────────────────────────────────────────────────
     4. KHỞI TẠO MẪU VẬT CHO MỖI CẶP THÍ NGHIỆM
  ───────────────────────────────────────────────────────────── */
  function initObjectsForPair(pairKey) {
    const p = OBJECT_PAIRS[pairKey];
    activeObjects = [];

    // Tạo Object 1
    const o1 = Object.assign({}, p.obj1, {
      x: p.obj1.initX,
      y: p.obj1.initY,
      vx: 0,
      vy: 0,
      onScale: false,
      inWater: false,
      submergedRatio: 0
    });
    activeObjects.push(o1);

    // Tạo Object 2 (nếu có)
    if (p.obj2) {
      const o2 = Object.assign({}, p.obj2, {
        x: p.obj2.initX,
        y: p.obj2.initY,
        vx: 0,
        vy: 0,
        onScale: false,
        inWater: false,
        submergedRatio: 0
      });
      activeObjects.push(o2);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     5. RENDER NỘI DUNG SƯ PHẠM 4 BƯỚC (POE WORKFLOW)
  ───────────────────────────────────────────────────────────── */
  function renderPOEContent() {
    const box = document.getElementById('poe-content-box');
    if (!box) return;

    const cur = OBJECT_PAIRS[currentPairKey];

    // BƯỚC 1: Cung cấp dữ kiện & Cân khối lượng
    if (currentStep === 1) {
      box.innerHTML = `
        <div class="poe-interactive-card">
          <span class="poe-q-badge">BƯỚC 1: CUNG CẤP DỮ KIỆN</span>
          <div class="poe-q-text">⚖️ Đặt các mẫu vật lên cân điện tử để xác định khối lượng!</div>
          <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 0.75rem;">
            Hãy dùng chuột kéo lần lượt <strong>${cur.obj1.name}</strong> và <strong>${cur.obj2 ? cur.obj2.name : ''}</strong> đặt lên đĩa cân màu xám bên trái.
          </p>

          <table class="density-data-table">
            <thead>
              <tr>
                <th>Vật thể</th>
                <th>Khối lượng (<span class="m-inline">m</span>)</th>
                <th>Thể tích (<span class="m-inline">V</span>)</th>
              </tr>
            </thead>
            <tbody>
              <tr class="highlight">
                <td>${cur.obj1.name}</td>
                <td><strong>${cur.obj1.mass} g</strong></td>
                <td>${cur.obj1.volume} cm³</td>
              </tr>
              ${cur.obj2 ? `
                <tr class="highlight">
                  <td>${cur.obj2.name}</td>
                  <td><strong>${cur.obj2.mass} g</strong></td>
                  <td>${cur.obj2.volume} cm³</td>
                </tr>
              ` : ''}
            </tbody>
          </table>

          <div style="margin-top: 1rem; text-align: right;">
            <button class="buoyancy-action-btn active" style="padding: 0.5rem 1rem; font-size: 0.82rem;" onclick="buoyancyJumpStep(2)">
              Tiếp tục: Dự Đoán Hiện Tượng ➔
            </button>
          </div>
        </div>
      `;
    }

    // BƯỚC 2: Khơi gợi quan niệm sai lầm (Dự đoán Plickers)
    else if (currentStep === 2) {
      const letters = ['A', 'B', 'C', 'D'];
      box.innerHTML = `
        <div class="poe-interactive-card">
          <span class="poe-q-badge">BƯỚC 2: DỰ ĐOÁN (PLICKERS POE)</span>
          <div class="poe-q-text">${cur.question.q}</div>

          <div class="poe-options-list">
            ${cur.question.options.map((opt, idx) => `
              <button class="poe-opt-btn ${selectedPrediction === idx ? 'selected' : ''}" 
                      id="poe-opt-${idx}"
                      onclick="buoyancySelectPrediction(${idx})">
                <span class="poe-opt-letter">${letters[idx]}</span>
                <span style="line-height: 1.35;">${opt}</span>
              </button>
            `).join('')}
          </div>

          <div style="margin-top: 1rem; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.75rem; color: #64748b;">Chọn 1 đáp án để mở khóa thả nước!</span>
            <button class="buoyancy-action-btn ${selectedPrediction !== null ? 'active' : ''}" 
                    id="btn-confirm-prediction"
                    style="padding: 0.5rem 1rem; font-size: 0.82rem;"
                    ${selectedPrediction === null ? 'disabled' : ''}
                    onclick="buoyancyConfirmPrediction()">
              Chốt Dự Đoán ➔ Thả Nước
            </button>
          </div>
        </div>
      `;
    }

    // BƯỚC 3: Tạo xung đột nhận thức & Thử nghiệm thực tế
    else if (currentStep === 3) {
      box.innerHTML = `
        <div class="poe-interactive-card" style="border-color: #f59e0b;">
          <span class="poe-q-badge" style="background: rgba(245, 158, 11, 0.15); color: #d97706;">BƯỚC 3: XUNG ĐỘT NHẬN THỨC</span>
          <div class="poe-q-text">🌊 Kéo thả các vật vào bình nước để kiểm chứng!</div>
          
          <div style="background: rgba(37, 99, 235, 0.06); padding: 0.6rem 0.85rem; border-radius: var(--radius-sm); font-size: 0.8rem; margin-bottom: 0.75rem;">
            📌 <strong>Dự đoán của bạn:</strong> Đáp án ${['A','B','C','D'][selectedPrediction !== null ? selectedPrediction : 0]} — 
            <em>"${cur.question.options[selectedPrediction !== null ? selectedPrediction : 0]}"</em>
          </div>

          <!-- Alert Xung Đột Nhận Thức -->
          <div class="conflict-alert-card">
            <strong>😲 BẠN CÓ THẤY BẤT NGỜ KHÔNG?</strong>
            Quả cam nguyên vỏ <strong>NẶNG HƠN (260g) LẠI NỔI</strong> bồng bềnh!<br>
            Quả cam bóc vỏ <strong>NHẸ HƠN (210g) LẠI CHÌM</strong> xuống đáy bình!<br>
            👉 Quy tắc <em>"Cứ nặng là chìm, nhẹ là nổi"</em> đã hoàn toàn sai!
          </div>

          <div style="margin-top: 1rem; text-align: right;">
            <button class="buoyancy-action-btn active" style="padding: 0.5rem 1rem; font-size: 0.82rem;" onclick="buoyancyJumpStep(4)">
              🔍 Khám Phá Bản Chất & Sửa Sai ➔
            </button>
          </div>
        </div>
      `;
    }

    // BƯỚC 4: Giải thích bản chất & Tự sửa sai (Explain & Extend)
    else if (currentStep === 4) {
      box.innerHTML = `
        <div class="poe-interactive-card" style="border-color: #10b981;">
          <span class="poe-q-badge" style="background: rgba(16, 185, 129, 0.15); color: #059669;">BƯỚC 4: BẢN CHẤT KHOA HỌC & SỬA SAI</span>
          <div class="poe-q-text">🔬 Vì sao vật nặng lại nổi, vật nhẹ lại chìm?</div>

          <div class="peel-structure-card" style="margin-bottom: 0.75rem;">
            <h5>🍊 Bí mật nằm ở: KHỐI LƯỢNG RIÊNG & LỚP VỎ XỐP</h5>
            <p>
              Khối lượng không quyết định sự chìm nổi, mà là <strong>Khối lượng riêng: <span class="m-inline">D = m/V</span></strong> so với khối lượng riêng của nước (<span class="m-inline">D<sub>nước</sub> = 1.0 g/cm³</span>).
            </p>
          </div>

          <table class="density-data-table">
            <thead>
              <tr>
                <th>Mẫu vật</th>
                <th><span class="m-inline">m</span> (g)</th>
                <th><span class="m-inline">V</span> (cm³)</th>
                <th><span class="m-inline">D = m/V</span></th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr style="color: #059669; font-weight: 700;">
                <td>${cur.obj1.name}</td>
                <td>${cur.obj1.mass}</td>
                <td>${cur.obj1.volume}</td>
                <td>${cur.obj1.density.toFixed(2)} g/cm³</td>
                <td>🟢 NỔI (<span class="m-inline">D &lt; 1.0</span>)</td>
              </tr>
              ${cur.obj2 ? `
                <tr style="color: #dc2626; font-weight: 700;">
                  <td>${cur.obj2.name}</td>
                  <td>${cur.obj2.mass}</td>
                  <td>${cur.obj2.volume}</td>
                  <td>${cur.obj2.density.toFixed(2)} g/cm³</td>
                  <td>🔴 CHÌM (<span class="m-inline">D &gt; 1.0</span>)</td>
                </tr>
              ` : ''}
            </tbody>
          </table>

          <div style="margin-top: 0.75rem; font-size: 0.8rem; line-height: 1.5; color: var(--text-main); background: var(--bg-surface-soft); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
            <strong>🎯 Điều kiện chìm nổi (CTGDPT 2018 - KHTN 8):</strong><br>
            • <span class="m-inline">D<sub>vật</sub> &lt; D<sub>chất lỏng</sub> ⇔ P &lt; F<sub>A(max)</sub> →</span> Vật <strong>NỔI</strong>.<br>
            • <span class="m-inline">D<sub>vật</sub> &gt; D<sub>chất lỏng</sub> ⇔ P &gt; F<sub>A(max)</sub> →</span> Vật <strong>CHÌM</strong>.<br>
            • Lớp vỏ cam xốp chứa vô số túi khí đóng vai trò như <strong>chiếc áo phao</strong> làm tăng thể tích lên rất nhiều, khiến <span class="m-inline">D</span> giảm xuống dưới 1.0!
          </div>

          <div style="margin-top: 1rem; display: flex; justify-content: space-between;">
            <button class="buoyancy-action-btn" onclick="buoyancyJumpStep(1)">
              ↺ Làm lại từ Bước 1
            </button>
            <button class="buoyancy-action-btn active" onclick="buoyancySelectPair('coke')">
              Thử Thách Mở Rộng: Lon Coca ➔
            </button>
          </div>
        </div>
      `;
    }
  }

  /* ─────────────────────────────────────────────────────────────
     6. CÁC HÀM XỬ LÝ SỰ KIỆN SƯ PHẠM
  ───────────────────────────────────────────────────────────── */
  window.buoyancyJumpStep = function (stepNum) {
    currentStep = stepNum;
    renderPOEContent();
  };

  window.buoyancySelectPrediction = function (optIdx) {
    selectedPrediction = optIdx;
    document.querySelectorAll('.poe-opt-btn').forEach((btn, i) => {
      btn.classList.toggle('selected', i === optIdx);
    });
    const confirmBtn = document.getElementById('btn-confirm-prediction');
    if (confirmBtn) {
      confirmBtn.disabled = false;
      confirmBtn.classList.add('active');
    }
  };

  window.buoyancyConfirmPrediction = function () {
    if (selectedPrediction === null) return;
    currentStep = 3;
    renderPOEContent();

    // Tự động thả nhẹ 2 quả vào nước để học sinh quan sát ngay
    const cur = OBJECT_PAIRS[currentPairKey];
    if (activeObjects.length >= 2) {
      activeObjects[0].x = TANK.x + 80;
      activeObjects[0].y = 120;
      activeObjects[0].vy = 2;

      activeObjects[1].x = TANK.x + 200;
      activeObjects[1].y = 120;
      activeObjects[1].vy = 2;
    }
  };

  window.buoyancySelectPair = function (pairKey) {
    if (!OBJECT_PAIRS[pairKey]) return;
    currentPairKey = pairKey;
    currentStep = 1;
    selectedPrediction = null;
    saltGrams = 0;
    TANK.waterDensity = 1.00;

    initObjectsForPair(pairKey);
    buildBuoyancyUI();
  };

  window.buoyancyToggleVectors = function () {
    showForceVectors = !showForceVectors;
    const btn = document.getElementById('btn-toggle-vectors');
    if (btn) {
      btn.classList.toggle('active', showForceVectors);
      btn.textContent = `🏹 Vector Lực (${showForceVectors ? 'Bật' : 'Tắt'})`;
    }
  };

  window.buoyancyToggleMagnifier = function () {
    showMagnifier = !showMagnifier;
    const btn = document.getElementById('btn-toggle-magnifier');
    if (btn) {
      btn.classList.toggle('active', showMagnifier);
    }
  };

  window.buoyancyResetPositions = function () {
    initObjectsForPair(currentPairKey);
  };

  window.buoyancyChangeSalt = function (grams) {
    saltGrams = parseInt(grams, 10);
    const lbl = document.getElementById('salt-grams-lbl');
    if (lbl) lbl.textContent = `${saltGrams} g`;

    // Khối lượng riêng tăng từ 1.00 -> 1.15 g/cm3
    TANK.waterDensity = 1.00 + (saltGrams * 0.0015);

    const hudVal = document.getElementById('hud-liquid-val');
    if (hudVal) {
      hudVal.textContent = `Nước muối: ${TANK.waterDensity.toFixed(3)} g/cm³`;
    }
  };

  /* ─────────────────────────────────────────────────────────────
     7. VẬT LÝ ENGINE CANVAS 2D THỜI GIAN THỰC (60 FPS)
  ───────────────────────────────────────────────────────────── */
  function startPhysicsEngine() {
    if (animFrameId) cancelAnimationFrame(animFrameId);

    let lastTime = performance.now();

    function loop(currentTime) {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
      lastTime = currentTime;

      updatePhysics(dt);
      renderScene();

      animFrameId = requestAnimationFrame(loop);
    }

    animFrameId = requestAnimationFrame(loop);
  }

  function updatePhysics(dt) {
    const gravity = 800; // px/s^2

    // Tính tổng thể tích chiếm chỗ trong bình nước để dâng mực nước
    let totalSubmergedVol = 0;

    activeObjects.forEach(obj => {
      if (obj === draggedObject) {
        obj.vx = 0;
        obj.vy = 0;
        obj.onScale = false;
        obj.inWater = false;
        return;
      }

      // Trọng lực rơi
      obj.vy += gravity * dt;
      obj.y += obj.vy * dt;
      obj.x += obj.vx * dt;

      // 1. Va chạm với Đĩa cân điện tử
      const panLeft = SCALE.x - SCALE.panW / 2;
      const panRight = SCALE.x + SCALE.panW / 2;
      const objRadius = obj.radius || (obj.width / 2);

      if (obj.x >= panLeft && obj.x <= panRight && obj.y + objRadius >= SCALE.panY && obj.y + objRadius <= SCALE.panY + 25) {
        obj.y = SCALE.panY - objRadius;
        obj.vy = 0;
        obj.vx *= 0.8;
        obj.onScale = true;
      } else {
        obj.onScale = false;
      }

      // 2. Va chạm & Tương tác trong Bình Nước (Lực đẩy Archimedes)
      const tankLeft = TANK.x;
      const tankRight = TANK.x + TANK.w;
      const tankBottom = TANK.y + TANK.h - 14;

      if (obj.x >= tankLeft + objRadius && obj.x <= tankRight - objRadius && obj.y + objRadius >= TANK.waterY) {
        obj.inWater = true;

        // Tính độ chìm trong nước
        const depthInWater = (obj.y + objRadius) - TANK.waterY;
        const fullHeight = objRadius * 2;
        let subRatio = Math.min(Math.max(depthInWater / fullHeight, 0), 1);
        obj.submergedRatio = subRatio;

        totalSubmergedVol += obj.volume * subRatio;

        // Lực đẩy Archimedes: Fa = d_chất_lỏng * V_chìm
        // Lực cân bằng khi D_vật / D_nước = subRatio
        const buoyantFactor = (TANK.waterDensity / obj.density);
        const buoyantForce = gravity * subRatio * buoyantFactor;

        // Gia tốc hướng lên do lực đẩy
        obj.vy -= buoyantForce * dt;

        // Lực cản của nước (viscous water damping)
        obj.vy *= Math.pow(0.2, dt);
        obj.vx *= Math.pow(0.3, dt);

        // Chạm đáy bình
        if (obj.y + objRadius >= tankBottom) {
          obj.y = tankBottom - objRadius;
          obj.vy = 0;
          obj.vx *= 0.7;
        }

        // Tạo bọt khí ngẫu nhiên
        if (Math.abs(obj.vy) > 20 && Math.random() < 0.1) {
          waterBubbles.push({
            x: obj.x + (Math.random() - 0.5) * objRadius,
            y: obj.y + objRadius,
            r: Math.random() * 3 + 1,
            vy: -40 - Math.random() * 30
          });
        }
      } else {
        obj.inWater = false;
        obj.submergedRatio = 0;
      }

      // 3. Va chạm sàn bàn thí nghiệm
      const tableY = 440;
      if (obj.y + objRadius >= tableY) {
        obj.y = tableY - objRadius;
        obj.vy = 0;
        obj.vx *= 0.8;
      }

      // 4. Giới hạn biên canvas
      if (obj.x - objRadius < 20) { obj.x = 20 + objRadius; obj.vx = 0; }
      if (obj.x + objRadius > canvasWidth - 20) { obj.x = canvasWidth - 20 - objRadius; obj.vx = 0; }
    });

    // Mực nước dâng theo thể tích vật chiếm chỗ (1 cm3 dâng ~ 0.08px)
    TANK.waterY = TANK.baseWaterY - (totalSubmergedVol * 0.08);

    // Cập nhật bọt khí
    for (let i = waterBubbles.length - 1; i >= 0; i--) {
      const b = waterBubbles[i];
      b.y += b.vy * dt;
      if (b.y <= TANK.waterY) {
        waterBubbles.splice(i, 1);
      }
    }

    // Cập nhật số cân điện tử trên HUD
    updateScaleDisplay();
  }

  function updateScaleDisplay() {
    let scaleMass = 0;
    activeObjects.forEach(obj => {
      if (obj.onScale) {
        scaleMass += obj.mass;
      }
    });

    const scaleHud = document.getElementById('hud-scale-val');
    if (scaleHud) {
      scaleHud.textContent = `${scaleMass.toFixed(1)} g`;
    }
  }

  /* ─────────────────────────────────────────────────────────────
     8. HỌA VẼ TOÀN BỘ PHÒNG THÍ NGHIỆM CANVAS 2D
  ───────────────────────────────────────────────────────────── */
  function renderScene() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // 1. Vẽ phông nền bàn thí nghiệm hiện đại
    drawLabBackground();

    // 2. Vẽ Bàn Cân Điện Tử
    drawElectronicScale();

    // 3. Vẽ Bình Nước Thủy Tinh Trong Suốt & Nước
    drawWaterTank();

    // 4. Vẽ Các Mẫu Vật Thí Nghiệm
    activeObjects.forEach(obj => {
      drawObject(obj);
      if (showForceVectors) {
        drawForceVectors(obj);
      }
    });

    // 5. Vẽ Kính Lúp Soi Cấu Trúc Vỏ Xốp (nếu bật)
    if (showMagnifier) {
      drawPorousPeelMagnifier();
    }
  }

  function drawLabBackground() {
    // Mặt bàn gỗ công nghiệp phòng thí nghiệm
    const tableY = 430;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, tableY, canvasWidth, canvasHeight - tableY);

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, tableY);
    ctx.lineTo(canvasWidth, tableY);
    ctx.stroke();

    // Kệ khay đựng mẫu vật ở trên
    ctx.fillStyle = 'rgba(30, 41, 59, 0.6)';
    ctx.roundRect ? ctx.roundRect(40, 40, 320, 120, 8) : ctx.rect(40, 40, 320, 120);
    ctx.fill();
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.6)';
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('KHAY MẪU VẬT THỬ NGHIỆM', 55, 62);
  }

  function drawElectronicScale() {
    // Chân đế cân
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(SCALE.x - SCALE.w / 2, SCALE.y, SCALE.w, SCALE.h + 50, 8) : ctx.rect(SCALE.x - SCALE.w / 2, SCALE.y, SCALE.w, SCALE.h + 50);
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Trục đĩa cân
    ctx.fillStyle = '#64748b';
    ctx.fillRect(SCALE.x - 10, SCALE.panY + 8, 20, SCALE.y - (SCALE.panY + 8));

    // Đĩa cân inox sáng bóng
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.ellipse(SCALE.x, SCALE.panY, SCALE.panW / 2, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.stroke();

    // Màn hình LCD LED hiển thị số gram
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(SCALE.ledX - 45, SCALE.ledY - 14, 90, 26);
    ctx.strokeStyle = '#1e293b';
    ctx.stroke();

    let massText = '0.0 g';
    let hasItem = false;
    activeObjects.forEach(o => {
      if (o.onScale) {
        massText = o.mass.toFixed(1) + ' g';
        hasItem = true;
      }
    });

    ctx.fillStyle = hasItem ? '#38bdf8' : '#0284c7';
    ctx.font = '700 15px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(massText, SCALE.ledX, SCALE.ledY);

    ctx.font = '600 9px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('CÂN ĐIỆN TỬ (g)', SCALE.ledX, SCALE.ledY + 22);
  }

  function drawWaterTank() {
    const t = TANK;

    // Bình thủy tinh trong suốt
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.fillRect(t.x, t.y, t.w, t.h);

    // Khối nước bên trong
    const waterHeight = (t.y + t.h) - t.waterY;
    const waterGrad = ctx.createLinearGradient(0, t.waterY, 0, t.y + t.h);
    if (currentPairKey === 'egg' && saltGrams > 0) {
      waterGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
      waterGrad.addColorStop(1, 'rgba(14, 116, 144, 0.7)');
    } else {
      waterGrad.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
      waterGrad.addColorStop(1, 'rgba(2, 132, 199, 0.65)');
    }

    ctx.fillStyle = waterGrad;
    ctx.fillRect(t.x + t.wallThick, t.waterY, t.w - t.wallThick * 2, waterHeight - 8);

    // Mặt nước gợn sóng
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.8)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    const rippleAmp = 1.5;
    const time = performance.now() * 0.003;
    for (let x = t.x + t.wallThick; x <= t.x + t.w - t.wallThick; x += 4) {
      const y = t.waterY + Math.sin(x * 0.05 + time) * rippleAmp;
      if (x === t.x + t.wallThick) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Bọt khí nước
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    waterBubbles.forEach(b => {
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Thước chia vạch ml trên thành bình
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '9px monospace';
    ctx.textAlign = 'left';

    const tickSteps = [
      { y: t.y + 40, ml: '1600 ml' },
      { y: t.y + 80, ml: '1400 ml' },
      { y: t.y + 120, ml: '1200 ml' },
      { y: t.y + 160, ml: '1000 ml' },
      { y: t.y + 200, ml: '800 ml' }
    ];

    tickSteps.forEach(tick => {
      ctx.beginPath();
      ctx.moveTo(t.x + t.wallThick, tick.y);
      ctx.lineTo(t.x + t.wallThick + 12, tick.y);
      ctx.stroke();
      ctx.fillText(tick.ml, t.x + t.wallThick + 16, tick.y + 3);
    });

    // Viền thành bình thủy tinh
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.5)';
    ctx.lineWidth = t.wallThick;
    ctx.strokeRect(t.x + t.wallThick / 2, t.y, t.w - t.wallThick, t.h - t.wallThick / 2);

    // Nhãn tên bình
    ctx.fillStyle = '#e0f2fe';
    ctx.font = '700 11px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('BÌNH NƯỚC THÍ NGHIỆM', t.x + t.w / 2, t.y - 10);
  }

  function drawObject(obj) {
    ctx.save();
    ctx.translate(obj.x, obj.y);

    // 1. QUẢ CAM
    if (obj.id.includes('orange')) {
      // Bóng quả cam
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.ellipse(0, obj.radius + 3, obj.radius * 0.8, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      if (!obj.isPeeled) {
        // Quả cam nguyên vỏ: màu cam tươi có vân đốm lỗ chân lông
        ctx.fillStyle = obj.color;
        ctx.beginPath();
        ctx.arc(0, 0, obj.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = obj.skinColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Cuống lá nhỏ
        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.ellipse(0, -obj.radius + 2, 4, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Đốm sần sùi của vỏ
        ctx.fillStyle = 'rgba(234, 88, 12, 0.4)';
        for (let i = -20; i <= 20; i += 12) {
          ctx.beginPath();
          ctx.arc(i, -10, 1.5, 0, Math.PI * 2);
          ctx.arc(i + 5, 12, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Quả cam bóc vỏ: múi cam mọng nước
        ctx.fillStyle = obj.color;
        ctx.beginPath();
        ctx.arc(0, 0, obj.radius, 0, Math.PI * 2);
        ctx.fill();

        // Rãnh các múi cam
        ctx.strokeStyle = '#ea580c';
        ctx.lineWidth = 1.5;
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(a) * obj.radius, Math.sin(a) * obj.radius);
          ctx.stroke();
        }

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // 2. LON NƯỚC NGỌT
    else if (obj.isCan) {
      const w = obj.width, h = obj.height;
      ctx.fillStyle = obj.color;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(-w / 2, -h / 2, w, h, 6) : ctx.rect(-w / 2, -h / 2, w, h);
      ctx.fill();
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Nắp lon bạc
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(-w / 2 + 2, -h / 2, w - 4, 6);

      // Nhãn chữ trên lon
      ctx.fillStyle = '#fff';
      ctx.font = '800 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(obj.id.includes('diet') ? 'DIET' : 'COCA', 0, -2);
      ctx.font = '700 8px sans-serif';
      ctx.fillText('355ml', 0, 14);
    }

    // 3. CON TÀU THÉP
    else if (obj.isBoat) {
      ctx.fillStyle = obj.color;
      ctx.beginPath();
      ctx.moveTo(-obj.width / 2, -obj.height / 2);
      ctx.lineTo(obj.width / 2, -obj.height / 2);
      ctx.lineTo(obj.width / 2 - 15, obj.height / 2);
      ctx.lineTo(-obj.width / 2 + 15, obj.height / 2);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#1d4ed8';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Cabin tàu
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(-15, -obj.height / 2 - 16, 30, 16);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-4, -obj.height / 2 - 26, 8, 10);
    }

    // 4. BI SẮT
    else if (obj.id.includes('marble')) {
      const grad = ctx.createRadialGradient(-4, -4, 2, 0, 0, obj.radius);
      grad.addColorStop(0, '#cbd5e1');
      grad.addColorStop(0.5, '#64748b');
      grad.addColorStop(1, '#1e293b');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, obj.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.stroke();
    }

    // 5. QUẢ TRỨNG GÀ
    else if (obj.isEgg) {
      ctx.fillStyle = obj.skinColor;
      ctx.beginPath();
      ctx.ellipse(0, 0, obj.radius, obj.radius * 1.25, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Tên nhãn vật thể dưới chân
    ctx.fillStyle = '#f8fafc';
    ctx.font = '700 11px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 4;
    ctx.fillText(obj.name, 0, (obj.radius || (obj.height / 2)) + 18);
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  function drawForceVectors(obj) {
    if (!obj.inWater && !obj.onScale) return;

    ctx.save();
    ctx.translate(obj.x, obj.y);

    const arrowScale = 0.28; // Scale lực sang pixel vẽ

    // 1. Vector Trọng lực P (Mũi tên đỏ hướng xuống)
    const gravityForce = obj.mass * 9.8 * arrowScale;
    drawArrow(0, 0, 0, gravityForce, '#ef4444', `P = ${(obj.mass * 0.0098).toFixed(2)}N`);

    // 2. Vector Lực đẩy Archimedes Fa (Mũi tên xanh lá hướng lên)
    if (obj.inWater) {
      const buoyantForce = (obj.volume * obj.submergedRatio * TANK.waterDensity) * 9.8 * arrowScale;
      if (buoyantForce > 4) {
        drawArrow(0, 0, 0, -buoyantForce, '#22c55e', `FA = ${(obj.volume * obj.submergedRatio * TANK.waterDensity * 0.0098).toFixed(2)}N`);
      }
    }

    ctx.restore();
  }

  function drawArrow(fromX, fromY, toX, toY, color, label) {
    const headLen = 9;
    const angle = Math.atan2(toY - fromY, toX - fromX);

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    // Nhãn tên lực
    ctx.font = '800 10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(label, toX + 6, toY);
  }

  function drawPorousPeelMagnifier() {
    // Vòng kính lúp soi lớp vỏ cam ở góc trên bên phải bàn thí nghiệm
    const mx = 380, my = 100, mr = 55;

    ctx.save();
    // Khung kính lúp
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.beginPath();
    ctx.arc(mx, my, mr, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Cắt clip bên trong kính lúp
    ctx.clip();

    // Vẽ mô phỏng vi cấu trúc lớp vỏ xốp albedo
    ctx.fillStyle = '#fff7ed';
    ctx.fillRect(mx - mr, my - mr, mr * 2, mr * 2);

    // Hàng trăm túi khí li ti
    ctx.fillStyle = 'rgba(251, 146, 60, 0.3)';
    for (let i = 0; i < 40; i++) {
      const px = mx - 40 + (i % 7) * 12;
      const py = my - 40 + Math.floor(i / 7) * 14;
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    ctx.restore();

    // Chú thích kính lúp
    ctx.fillStyle = '#f59e0b';
    ctx.font = '700 10px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SOi VỎ CAM XỐP (ALBEDO)', mx, my + mr + 15);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '500 9px sans-serif';
    ctx.fillText('Vô số túi khí li ti như áo phao', mx, my + mr + 28);
  }

  /* ─────────────────────────────────────────────────────────────
     9. TƯƠNG TÁC CHUỘT / CẢM ỨNG KÉO THẢ (DRAG & DROP)
  ───────────────────────────────────────────────────────────── */
  function setupCanvasInteractions() {
    function getPointerPos(e) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
      };
    }

    function onPointerDown(e) {
      const pos = getPointerPos(e);
      // Tìm xem có nhấn trúng vật nào không
      for (let i = activeObjects.length - 1; i >= 0; i--) {
        const obj = activeObjects[i];
        const r = obj.radius || (obj.width / 2);
        const dist = Math.hypot(pos.x - obj.x, pos.y - obj.y);
        if (dist <= r + 10) {
          draggedObject = obj;
          dragOffsetX = pos.x - obj.x;
          dragOffsetY = pos.y - obj.y;
          obj.vx = 0;
          obj.vy = 0;
          break;
        }
      }
    }

    function onPointerMove(e) {
      if (!draggedObject) return;
      const pos = getPointerPos(e);
      draggedObject.x = pos.x - dragOffsetX;
      draggedObject.y = pos.y - dragOffsetY;
      draggedObject.vx = 0;
      draggedObject.vy = 0;
    }

    function onPointerUp() {
      if (draggedObject) {
        draggedObject = null;
      }
    }

    canvas.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    canvas.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
  }

  /* ─────────────────────────────────────────────────────────────
     10. KHỞI CHẠY KHI TRANG TẢI XONG
  ───────────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    buildBuoyancyUI();

    // Hỗ trợ resize & chuyển tab
    window.addEventListener('resize', () => {
      const canvasEl = document.getElementById('buoyancy-canvas');
      if (canvasEl && canvasEl.offsetParent !== null) {
        // resize logic if needed
      }
    });
  });

})();
