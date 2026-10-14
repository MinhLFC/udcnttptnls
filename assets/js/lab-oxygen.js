/**
 * lab-oxygen.js
 * 
 * Mô phỏng thí nghiệm xác định thành phần phần trăm thể tích của Oxygen trong không khí
 * Giải mã quan niệm sai lầm kinh điển:
 *   - Yếu tố Hóa học: Sự tiêu hao oxygen trong phản ứng cháy
 *   - Yếu tố Vật lí: Sự giãn nở vì nhiệt của chất khí và chênh lệch áp suất (áp suất khí quyển đẩy nước)
 *   - Trực quan hóa hạt phân tử khí & đồ thị cảm biến thời gian thực (Real-time Sensors)
 * 
 * Viết bằng JavaScript thuần, Canvas 2D mượt mà, không phụ thuộc thư viện ngoài.
 */

(function() {
  'use strict';

  // --- Biến trạng thái toàn cục của mô phỏng ---
  let canvas, ctx;
  let chartCanvas, chartCtx;
  let animId = null;

  // Cấu hình thí nghiệm
  const state = {
    preset: 'candle', // 'candle' | 'phosphorus' | 'hot_cup'
    phase: 'idle',    // 'idle' | 'burning' | 'cooling' | 'finished'
    simTime: 0,       // giây mô phỏng
    speed: 1,         // 1x, 2x, 5x
    isPlaying: false,

    // Thông số nhiệt động học & nồng độ
    temp: 25.0,        // °C
    pressure: 101.3,   // kPa (P_atm)
    oxygenPct: 21.0,   // %
    waterLevelPct: 0.0,// % (tối đa 100% của cốc)
    maxWaterLevel: 0,  // % mục tiêu tùy theo bài
    
    // Trạng thái cơ học
    cupY: 0,           // Vị trí y của cốc (0: đang úp, <0: đang nhấc lên)
    cupState: 'covered',// 'covered' | 'lifted'
    flameIntensity: 1.0,
    bubbles: [],       // Bọt khí thoát ra ngoài lúc giãn nở
    smokeParticles: [],// Khói P2O5 hoặc khói nến
    dewDrops: [],      // Hơi nước ngưng tụ quanh thành cốc

    // Hiển thị
    showMolecules: true,
    showRuler: true,
    molecules: [],

    // Lịch sử dữ liệu cho đồ thị
    history: []
  };

  // Preset chi tiết
  const presets = {
    candle: {
      name: "1. Đốt Cây Nến (Candle)",
      tagline: "Hiện tượng quen thuộc nhưng dễ ngộ nhận bản chất",
      reactant: "Sáp Paraffin + O₂ ➔ CO₂ + H₂O",
      targetOxygen: 15.6, // Nến tắt khi O2 còn khoảng 15.6%
      maxTemp: 82.0,      // °C
      targetWaterPct: 17.5,// %
      burnDuration: 7.0,  // giây
      coolingDuration: 10.0,
      hasFlame: true,
      flameColor: '#f59e0b',
      smokeType: 'gray',
      desc: "Nến cháy sinh khí CO₂ và hơi nước. Nến tắt sớm khi nồng độ O₂ còn khoảng 15-16%. Nước dâng chủ yếu khi không khí nóng trong cốc nguội đi làm áp suất giảm."
    },
    phosphorus: {
      name: "2. Đốt Photpho Đỏ (P)",
      tagline: "Thí nghiệm chuẩn SGK KHTN — Đo chính xác 1/5 thể tích",
      reactant: "4P + 5O₂ ➔ 2P₂O₅ (chất rắn tan vào nước)",
      targetOxygen: 0.8,  // Photpho cháy kiệt O2
      maxTemp: 135.0,     // °C
      targetWaterPct: 21.0,// Đúng 1/5 = 20-21%
      burnDuration: 6.0,
      coolingDuration: 12.0,
      hasFlame: true,
      flameColor: '#fbbf24',
      smokeType: 'white_dense',
      desc: "Photpho cháy mãnh liệt sinh khói trắng P₂O₅. Khói trắng tan hoàn toàn vào nước (tạo H₃PO₄) không sinh khí thừa. Khi nguội hẳn, nước dâng đúng 1/5 (21%) thể tích."
    },
    hot_cup: {
      name: "3. Úp Cốc Nung Nóng (Không có chất cháy)",
      tagline: "Đối chứng Vật lí thuần túy — Không tiêu hao Oxygen",
      reactant: "Không có phản ứng hóa học (O₂ không đổi 21%)",
      targetOxygen: 21.0, // O2 hoàn toàn không đổi
      maxTemp: 85.0,      // Bắt đầu từ 85°C
      targetWaterPct: 16.0,// Nước vẫn dâng do co nhiệt!
      burnDuration: 0.0,  // Không có giai đoạn cháy
      coolingDuration: 12.0,
      hasFlame: false,
      flameColor: null,
      smokeType: 'none',
      desc: "Cốc thủy tinh được hơ nóng không khí bên trong rồi úp nhanh vào nước. Hoàn toàn không có O₂ bị tiêu thụ nhưng nước VẪN DÂNG LÊN khi cốc nguội đi do áp suất giảm!"
    }
  };

  // Khởi tạo giao diện
  function initOxygenLab() {
    const container = document.getElementById('experiment-oxygen');
    if (!container) return;

    container.innerHTML = `
      <div class="oxygen-lab-container">
        <!-- Mission Banner -->
        <div class="oxygen-banner">
          <h3><span>🔥</span> Thí Nghiệm Xác Định Thành Phần % Thể Tích Của Oxygen Trong Không Khí</h3>
          <p>
            Trực quan hóa cái vô hình: Kết hợp đồng thời <strong>yếu tố Hóa học</strong> (sự tiêu hao oxygen trong phản ứng cháy) và 
            <strong>yếu tố Vật lí</strong> (sự giãn nở vì nhiệt và chênh lệch áp suất làm nước dâng lên). Giúp học sinh hiểu thấu đáo bản chất khoa học chuẩn mực.
          </p>
        </div>

        <!-- Main Layout: Canvas & Controls -->
        <div class="oxygen-main-grid">
          
          <!-- Left: Canvas Card -->
          <div class="oxygen-canvas-card">
            <!-- Toolbar -->
            <div class="oxygen-canvas-toolbar">
              <div class="oxygen-preset-select">
                <span>🧪 Bài Thí Nghiệm:</span>
                <select id="oxygenPresetSelect" class="oxygen-select-input">
                  <option value="candle">1. Đốt Cây Nến (Candle - Hiện tượng quen thuộc)</option>
                  <option value="phosphorus">2. Đốt Photpho Đỏ (P - Thí nghiệm chuẩn SGK)</option>
                  <option value="hot_cup">3. Úp Cốc Nung Nóng (Đối chứng thuần Vật Lí)</option>
                </select>
              </div>

              <div class="oxygen-view-toggles">
                <button id="toggleMoleculesBtn" class="oxygen-toggle-btn active" title="Bật/Tắt hiển thị hạt phân tử khí">
                  <span>🔬</span> Hạt Phân Tử
                </button>
                <button id="toggleRulerBtn" class="oxygen-toggle-btn active" title="Bật/Tắt vạch chia 5 phần">
                  <span>📏</span> Vạch Chia 1/5
                </button>
              </div>
            </div>

            <!-- Canvas Viewport -->
            <div class="oxygen-canvas-wrapper">
              <canvas id="oxygenCanvas"></canvas>
              <div class="canvas-watermark-overlay" id="statusBadge">
                ● Trạng thái: Sẵn sàng thực hiện
              </div>
            </div>

            <!-- Sensors Strip -->
            <div class="oxygen-sensors-strip">
              <div class="sensor-card">
                <div class="sensor-title">
                  <span>Nhiệt Độ Trong Cốc (T)</span>
                  <span>🌡️</span>
                </div>
                <div class="sensor-val temp" id="sensorTemp">25.0 °C</div>
                <div class="sensor-sub">T ban đầu: 25.0 °C</div>
              </div>

              <div class="sensor-card">
                <div class="sensor-title">
                  <span>Áp Suất Trong Cốc (P)</span>
                  <span>⏱️</span>
                </div>
                <div class="sensor-val pressure" id="sensorPressure">101.3 kPa</div>
                <div class="sensor-sub" id="sensorDeltaP">ΔP = 0.0 kPa (Cân bằng)</div>
              </div>

              <div class="sensor-card">
                <div class="sensor-title">
                  <span>Nồng Độ Oxygen (% O₂)</span>
                  <span>🫧</span>
                </div>
                <div class="sensor-val oxygen" id="sensorOxygen">21.0 %</div>
                <div class="sensor-sub">Khí quyển: 21.0% O₂</div>
              </div>

              <div class="sensor-card">
                <div class="sensor-title">
                  <span>Mực Nước Dâng (h)</span>
                  <span>🌊</span>
                </div>
                <div class="sensor-val water" id="sensorWater">0.0 %</div>
                <div class="sensor-sub" id="sensorFraction">≈ 0/5 thể tích cốc</div>
              </div>
            </div>
          </div>

          <!-- Right: Control Sidebar -->
          <div class="oxygen-sidebar">
            <div class="oxygen-panel">
              <h4><span>⚙️</span> Thao Tác Thí Nghiệm</h4>
              <div class="oxygen-action-buttons">
                <button id="btnStartExp" class="btn-primary-action">
                  <span>🔥</span> Bắt Đầu Đốt & Úp Cốc
                </button>
                <button id="btnPauseExp" class="btn-secondary-action">
                  <span>⏸️</span> Tạm Dừng / Tiếp Tục
                </button>
                <button id="btnResetExp" class="btn-secondary-action">
                  <span>🔄</span> Làm Lại Từ Đầu
                </button>
              </div>

              <div class="speed-control-row">
                <span>Tốc độ mô phỏng:</span>
                <div class="speed-chips">
                  <button class="speed-chip active" data-speed="1">1x</button>
                  <button class="speed-chip" data-speed="2">2x</button>
                  <button class="speed-chip" data-speed="5">5x (Nhanh)</button>
                </div>
              </div>
            </div>

            <!-- Gas Molecule Legend -->
            <div class="oxygen-panel">
              <h4><span>🔬</span> Phân Loại Hạt Phân Tử Khí</h4>
              <div class="gas-legend-list">
                <div class="gas-legend-item">
                  <div><span class="gas-dot o2"></span><strong>Oxygen (O₂)</strong> — Màu đỏ</div>
                  <span id="legendCountO2">21%</span>
                </div>
                <div class="gas-legend-item">
                  <div><span class="gas-dot n2"></span><strong>Nitrogen (N₂)</strong> — Xanh dương</div>
                  <span>~78%</span>
                </div>
                <div class="gas-legend-item">
                  <div><span class="gas-dot co2"></span><strong>Carbon Dioxide (CO₂)</strong></div>
                  <span id="legendCountCO2">0%</span>
                </div>
                <div class="gas-legend-item">
                  <div><span class="gas-dot h2o"></span><strong>Hơi nước (H₂O)</strong></div>
                  <span id="legendCountH2O">Vết</span>
                </div>
              </div>
            </div>

            <!-- Reaction Summary -->
            <div class="oxygen-panel">
              <h4><span>📝</span> Phản Ứng Đang Xảy Ra</h4>
              <div id="reactionSummaryText" style="font-size: 0.88rem; line-height: 1.6; color: #334155;">
                <strong>Sáp Nến + O₂ ➔ CO₂ + H₂O</strong><br>
                <span style="font-size: 0.8rem; color: #64748b;">Nến cháy tiêu hao O₂, sinh khí CO₂ và hơi nước. Khi nến tắt, hơi nước ngưng tụ và không khí nguội làm giảm áp suất.</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Real-Time Live Multi-Chart -->
        <div class="oxygen-charts-panel">
          <div class="charts-header">
            <h4>📈 Đồ Thị Biến Thiên Thời Gian Thực (Live Sensors Chart)</h4>
            <div class="chart-legend-row">
              <div class="chart-legend-tag">
                <span class="legend-line temp"></span>
                <span>Nhiệt độ T (°C)</span>
              </div>
              <div class="chart-legend-tag">
                <span class="legend-line pressure"></span>
                <span>Áp suất P (kPa)</span>
              </div>
              <div class="chart-legend-tag">
                <span class="legend-line oxygen"></span>
                <span>Nồng độ % O₂</span>
              </div>
              <div class="chart-legend-tag">
                <span class="legend-line water"></span>
                <span>Mực nước dâng (%)</span>
              </div>
            </div>
          </div>

          <div class="chart-canvas-wrap">
            <canvas id="oxygenLiveChart"></canvas>
          </div>
        </div>

        <!-- Scientific Deconstruction: Misconception Buster Grid -->
        <div class="misconception-buster-grid">
          <div class="buster-card wrong">
            <h5><span>❌</span> Quan Niệm Sai Lầm Phổ Biến Của Học Sinh</h5>
            <ul>
              <li><strong>"Nước dâng lên bao nhiêu là do lượng oxygen bị cháy hết bấy nhiêu tạo ra khoảng trống hút nước lên."</strong></li>
              <li>Học sinh ngộ nhận rằng toàn bộ sự dâng nước chỉ đơn thuần do thể tích O₂ mất đi, xem cốc thủy tinh như một ống hút chân không tức thời.</li>
              <li>Bỏ qua hoàn toàn định luật chất khí và hiện tượng giãn nở vì nhiệt của chất khí khi cháy.</li>
            </ul>
          </div>

          <div class="buster-card right">
            <h5><span>✔️</span> Bản Chất Khoa Học Đúng Đắn (Hóa Học + Vật Lí)</h5>
            <ul>
              <li><strong>Yếu tố Hóa học:</strong> O₂ tham gia phản ứng cháy tạo ra oxit. Đốt nến tạo CO₂ (khí) và H₂O (hơi), nến tắt khi O₂ còn khoảng 15%. Đốt photpho tạo P₂O₅ (chất rắn tan trong nước), đốt kiệt O₂.</li>
              <li><strong>Yếu tố Vật lí (Quyết định lực đẩy):</strong> Khi cháy, nhiệt độ tăng làm không khí giãn nở và <em>một phần bị đẩy ra ngoài ở chân cốc</em>. Khi lửa tắt, khí nguội đi, áp suất trong cốc giảm mạnh xuống dưới áp suất khí quyển. <strong>Chính áp suất khí quyển bên ngoài đã đẩy nước dâng lên</strong> cho đến khi áp suất cân bằng!</li>
            </ul>
          </div>
        </div>

        <!-- Reflection Questions for Students -->
        <div class="reflection-box">
          <h5><span>💡</span> Thử Thách Tư Duy & Câu Hỏi Khám Phá Bản Chất</h5>
          
          <div class="reflection-item" onclick="this.classList.toggle('open')">
            <div class="reflection-q">
              <span>1. Tại sao khi ngọn nến vừa tắt, nước chưa dâng lên cao nhất ngay mà phải đợi một lúc nguội đi nước mới dâng tiếp?</span>
              <span></span>
            </div>
            <div class="reflection-a">
              <strong>Giải thích khoa học:</strong> Khi nến vừa tắt, không khí bên trong cốc vẫn còn rất nóng ($T \approx 70-80^\circ\text{C}$). Theo định luật chất khí ($P \cdot V = n \cdot R \cdot T$), nhiệt độ còn cao thì áp suất bên trong chưa giảm sâu. Chỉ khi không khí nguội dần về nhiệt độ phòng ($25^\circ\text{C}$), khí co lại và áp suất trong cốc mới giảm mạnh, tạo chênh lệch áp suất lớn nhất để áp suất khí quyển đẩy nước dâng lên mức tối đa.
            </div>
          </div>

          <div class="reflection-item" onclick="this.classList.toggle('open')">
            <div class="reflection-q">
              <span>2. Tại sao ở bài thí nghiệm số 3 (Úp cốc nung nóng không có chất cháy), nước vẫn dâng lên vào trong cốc?</span>
              <span></span>
            </div>
            <div class="reflection-a">
              <strong>Giải thích khoa học:</strong> Cốc được nung nóng chứa không khí giãn nở thưa thớt. Khi úp vào chậu nước và nguội đi, các phân tử khí co cụm lại, áp suất bên trong tụt xuống thấp hơn áp suất khí quyển bên ngoài. Áp suất khí quyển ép mặt nước bên ngoài chậu, đẩy nước tràn vào trong cốc. Thí nghiệm này là bằng chứng thép chứng minh: <em>Chênh lệch áp suất là nguyên nhân trực tiếp làm nước dâng lên</em>!
            </div>
          </div>

          <div class="reflection-item" onclick="this.classList.toggle('open')">
            <div class="reflection-q">
              <span>3. Tại sao trong sách giáo khoa KHTN, thí nghiệm đốt Photpho đỏ lại cho kết quả chính xác 1/5 thể tích hơn thí nghiệm đốt nến?</span>
              <span></span>
            </div>
            <div class="reflection-a">
              <strong>Giải thích khoa học:</strong> Có 2 lý do cốt lõi:<br>
              • <em>Thứ nhất:</em> Sản phẩm cháy của photpho là điphotpho pentaoxit ($P_2O_5$) ở dạng khói trắng mịn (chất rắn) và tan hoàn toàn vào nước để tạo axit photphoric ($H_3PO_4$), không sinh ra chất khí như $CO_2$ của nến.<br>
              • <em>Thứ hai:</em> Photpho đỏ có khả năng cháy kiệt gần như 100% lượng oxygen trong cốc (nồng độ $O_2$ giảm về $\approx 0\%$), trong khi ngọn lửa nến bị tắt sớm khi nồng độ $O_2$ còn tới $15-16\%$. Do đó, photpho đỏ cho mực nước dâng chuẩn xác đúng $\approx 21\% \approx 1/5$ thể tích!
            </div>
          </div>
        </div>

      </div>
    `;

    setupDOMEvents();
    initCanvases();
    resetSimulation();
  }

  // Cấu hình sự kiện DOM
  function setupDOMEvents() {
    const presetSelect = document.getElementById('oxygenPresetSelect');
    if (presetSelect) {
      presetSelect.addEventListener('change', (e) => {
        state.preset = e.target.value;
        updatePresetUI();
        resetSimulation();
      });
    }

    const btnStart = document.getElementById('btnStartExp');
    if (btnStart) {
      btnStart.addEventListener('click', () => {
        if (state.phase === 'idle' || state.phase === 'finished') {
          startSimulation();
        }
      });
    }

    const btnPause = document.getElementById('btnPauseExp');
    if (btnPause) {
      btnPause.addEventListener('click', () => {
        state.isPlaying = !state.isPlaying;
        btnPause.innerHTML = state.isPlaying ? '<span>⏸️</span> Tạm Dừng' : '<span>▶️</span> Tiếp Tục';
      });
    }

    const btnReset = document.getElementById('btnResetExp');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        resetSimulation();
      });
    }

    // Tốc độ
    document.querySelectorAll('.speed-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.speed-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state.speed = parseFloat(chip.getAttribute('data-speed')) || 1;
      });
    });

    // Toggle hiển thị
    const toggleMol = document.getElementById('toggleMoleculesBtn');
    if (toggleMol) {
      toggleMol.addEventListener('click', () => {
        state.showMolecules = !state.showMolecules;
        toggleMol.classList.toggle('active', state.showMolecules);
      });
    }

    const toggleRuler = document.getElementById('toggleRulerBtn');
    if (toggleRuler) {
      toggleRuler.addEventListener('click', () => {
        state.showRuler = !state.showRuler;
        toggleRuler.classList.toggle('active', state.showRuler);
      });
    }

    // Resize window
    window.addEventListener('resize', () => {
      resizeCanvases();
    });
  }

  // Cập nhật giao diện theo preset
  function updatePresetUI() {
    const cur = presets[state.preset];
    const summary = document.getElementById('reactionSummaryText');
    if (summary) {
      summary.innerHTML = `
        <strong>${cur.reactant}</strong><br>
        <span style="font-size: 0.8rem; color: #64748b;">${cur.desc}</span>
      `;
    }
  }

  // Khởi tạo Canvas
  function initCanvases() {
    canvas = document.getElementById('oxygenCanvas');
    if (canvas) {
      ctx = canvas.getContext('2d');
    }

    chartCanvas = document.getElementById('oxygenLiveChart');
    if (chartCanvas) {
      chartCtx = chartCanvas.getContext('2d');
    }

    resizeCanvases();
  }

  function resizeCanvases() {
    if (canvas && canvas.parentElement) {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * (window.devicePixelRatio || 1);
      canvas.height = rect.height * (window.devicePixelRatio || 1);
    }

    if (chartCanvas && chartCanvas.parentElement) {
      const rect = chartCanvas.parentElement.getBoundingClientRect();
      chartCanvas.width = rect.width * (window.devicePixelRatio || 1);
      chartCanvas.height = rect.height * (window.devicePixelRatio || 1);
    }
  }

  // Khởi tạo lại hạt phân tử
  function initMolecules() {
    state.molecules = [];
    const count = 75; // Tổng số hạt biểu diễn trong cốc
    // 21% O2 (khoảng 16 hạt), 78% N2 (khoảng 58 hạt), 1% CO2/H2O (1 hạt)
    for (let i = 0; i < count; i++) {
      let type = 'n2';
      if (i < 16) type = 'o2';
      else if (i === 16) type = 'co2';

      state.molecules.push({
        type: type,
        x: 0.15 + Math.random() * 0.7, // tương đối trong lòng cốc [0.15, 0.85]
        y: 0.15 + Math.random() * 0.7, // tương đối trong lòng cốc [0.15, 0.85]
        vx: (Math.random() - 0.5) * 0.008,
        vy: (Math.random() - 0.5) * 0.008,
        radius: type === 'co2' ? 5.5 : 4.5
      });
    }
  }

  // Bắt đầu mô phỏng
  function startSimulation() {
    const cur = presets[state.preset];
    state.phase = (state.preset === 'hot_cup') ? 'cooling' : 'burning';
    state.isPlaying = true;
    state.simTime = 0;
    state.bubbles = [];
    state.smokeParticles = [];
    state.dewDrops = [];

    if (state.preset === 'hot_cup') {
      state.temp = cur.maxTemp;
      state.pressure = 101.3;
      state.oxygenPct = 21.0;
    } else {
      state.temp = 25.0;
      state.pressure = 101.3;
      state.oxygenPct = 21.0;
    }

    const btnStart = document.getElementById('btnStartExp');
    if (btnStart) {
      btnStart.disabled = true;
      btnStart.innerHTML = '<span>⏳</span> Đang Thực Hiện Thí Nghiệm...';
    }

    const statusBadge = document.getElementById('statusBadge');
    if (statusBadge) {
      statusBadge.innerHTML = (state.preset === 'hot_cup') 
        ? '● Cốc nung nóng vừa úp: Không khí đang nguội dần...'
        : '● Đang cháy: Nhiệt độ tăng, không khí giãn nở...';
      statusBadge.style.color = '#ea580c';
    }
  }

  // Reset mô phỏng
  function resetSimulation() {
    const cur = presets[state.preset];
    state.phase = 'idle';
    state.isPlaying = false;
    state.simTime = 0;
    state.temp = 25.0;
    state.pressure = 101.3;
    state.oxygenPct = 21.0;
    state.waterLevelPct = 0.0;
    state.flameIntensity = cur.hasFlame ? 1.0 : 0.0;
    state.bubbles = [];
    state.smokeParticles = [];
    state.dewDrops = [];
    state.history = [{ time: 0, temp: 25, pressure: 101.3, oxygen: 21, water: 0 }];

    initMolecules();
    updateSensorDisplays();

    const btnStart = document.getElementById('btnStartExp');
    if (btnStart) {
      btnStart.disabled = false;
      btnStart.innerHTML = '<span>🔥</span> Bắt Đầu Đốt & Úp Cốc';
    }

    const btnPause = document.getElementById('btnPauseExp');
    if (btnPause) {
      btnPause.innerHTML = '<span>⏸️</span> Tạm Dừng / Tiếp Tục';
    }

    const statusBadge = document.getElementById('statusBadge');
    if (statusBadge) {
      statusBadge.innerHTML = '● Trạng thái: Sẵn sàng thực hiện';
      statusBadge.style.color = '#64748b';
    }

    if (!animId) {
      loop();
    }
  }

  // Cập nhật vật lí & hóa học theo từng frame
  function updatePhysics(dt) {
    if (!state.isPlaying || state.phase === 'idle' || state.phase === 'finished') return;

    const cur = presets[state.preset];
    const effectiveDt = dt * state.speed;
    state.simTime += effectiveDt;

    // GIAI ĐOẠN 1: ĐANG CHÁY (BURNING)
    if (state.phase === 'burning') {
      const burnProgress = Math.min(1.0, state.simTime / cur.burnDuration);

      // Nhiệt độ tăng vọt theo đường cong mượt
      state.temp = 25.0 + (cur.maxTemp - 25.0) * Math.sin(burnProgress * Math.PI * 0.5);

      // Tiêu hao Oxygen
      state.oxygenPct = 21.0 - (21.0 - cur.targetOxygen) * burnProgress;

      // Áp suất tăng nhẹ lúc đầu do nhiệt, nhưng do có bọt khí xì ra ngoài mép cốc nên áp suất tiệm cận hoặc nhích nhẹ
      const thermalExpansion = (state.temp - 25.0) * 0.08;
      state.pressure = 101.3 + Math.sin(burnProgress * Math.PI) * 1.5;

      // Sinh bọt khí thoát ra ngoài ở chân cốc (chứng minh giãn nở nhiệt!)
      if (burnProgress > 0.1 && burnProgress < 0.6 && Math.random() < 0.25 * state.speed) {
        state.bubbles.push({
          x: (Math.random() < 0.5) ? -0.42 : 0.42, // ở mép trái hoặc mép phải chân cốc
          y: 0.05,
          vy: -0.015 - Math.random() * 0.01,
          size: 3 + Math.random() * 4,
          life: 1.0
        });
      }

      // Biến đổi phân tử: một số hạt O2 chuyển thành CO2 / H2O
      if (state.preset === 'candle') {
        state.molecules.forEach(m => {
          if (m.type === 'o2' && Math.random() < 0.005 * state.speed) {
            m.type = Math.random() < 0.6 ? 'co2' : 'h2o';
          }
        });
      } else if (state.preset === 'phosphorus') {
        // Sinh khói trắng P2O5 dày đặc
        if (Math.random() < 0.4 * state.speed) {
          state.smokeParticles.push({
            x: (Math.random() - 0.5) * 0.3,
            y: 0.4 + (Math.random() - 0.5) * 0.2,
            vx: (Math.random() - 0.5) * 0.005,
            vy: -0.005 - Math.random() * 0.005,
            size: 6 + Math.random() * 10,
            alpha: 0.8
          });
        }
      }

      // Ngọn lửa lụi dần về cuối giai đoạn cháy
      state.flameIntensity = Math.max(0.0, 1.0 - Math.pow(burnProgress, 2));

      // Hơi nước ngưng tụ trên thành cốc
      if (state.preset === 'candle' && burnProgress > 0.4 && Math.random() < 0.15) {
        state.dewDrops.push({
          side: Math.random() < 0.5 ? 'left' : 'right',
          y: 0.2 + Math.random() * 0.5,
          size: 2 + Math.random() * 3
        });
      }

      // Nước lúc này CHƯA DÂNG hoặc chỉ nhấp nhô rất nhẹ (thậm chí mặt nước hơi bị ép xuống nhẹ do khí nở ra!)
      state.waterLevelPct = 0.5 * Math.sin(burnProgress * Math.PI);

      // Chuyển sang giai đoạn nguội khi cháy xong
      if (burnProgress >= 1.0) {
        state.phase = 'cooling';
        state.flameIntensity = 0.0;
        const statusBadge = document.getElementById('statusBadge');
        if (statusBadge) {
          statusBadge.innerHTML = '● Lửa đã tắt! Không khí bắt đầu nguội đi ➔ Áp suất giảm ➔ Nước dâng!';
          statusBadge.style.color = '#0284c7';
        }
      }
    }

    // GIAI ĐOẠN 2: NGUỘI DẦN & NƯỚC DÂNG LÊN (COOLING & WATER RISING)
    else if (state.phase === 'cooling') {
      const coolingElapsed = state.simTime - cur.burnDuration;
      const coolProgress = Math.min(1.0, coolingElapsed / cur.coolingDuration);

      // Nhiệt độ giảm dần về 25°C
      state.temp = 25.0 + (cur.maxTemp - 25.0) * Math.exp(-coolProgress * 3.2);

      // Áp suất bên trong tụt dốc sâu do khí co lại và O2 đã mất
      // Theo P = nRT/V, khi T giảm và n giảm, P_trong < P_ngoài
      const pDropMax = (cur.targetWaterPct / 100.0) * 12.0; // độ chênh áp suất tương đương chiều cao cột nước
      state.pressure = 101.3 - pDropMax * (1.0 - Math.exp(-coolProgress * 3.0));

      // NƯỚC DÂNG LÊN MẠNH MẼ TRONG GIAI ĐOẠN NÀY!
      // Nước dâng tỉ lệ thuận với độ nguội của chất khí
      state.waterLevelPct = cur.targetWaterPct * (1.0 - Math.exp(-coolProgress * 3.5));

      // Khói P2O5 tan dần vào nước
      state.smokeParticles.forEach(p => {
        p.alpha = Math.max(0, p.alpha - 0.008 * state.speed);
      });
      state.smokeParticles = state.smokeParticles.filter(p => p.alpha > 0.02);

      // Kết thúc khi đã nguội hoàn toàn
      if (coolProgress >= 1.0) {
        state.phase = 'finished';
        state.isPlaying = false;
        state.temp = 25.0;
        state.pressure = 101.3 - (cur.targetWaterPct / 100.0) * 3.0; // chênh lệch cột nước thủy tĩnh
        state.waterLevelPct = cur.targetWaterPct;

        const btnStart = document.getElementById('btnStartExp');
        if (btnStart) {
          btnStart.disabled = false;
          btnStart.innerHTML = '<span>✅</span> Thí Nghiệm Hoàn Thành!';
        }

        const statusBadge = document.getElementById('statusBadge');
        if (statusBadge) {
          statusBadge.innerHTML = `● Hoàn tất: Mực nước dâng ổn định ở mức ${state.waterLevelPct.toFixed(1)}% (≈ 1/5 thể tích)!`;
          statusBadge.style.color = '#16a34a';
        }
      }
    }

    // Cập nhật bọt khí
    state.bubbles.forEach(b => {
      b.y += b.vy;
      b.life -= 0.02 * state.speed;
    });
    state.bubbles = state.bubbles.filter(b => b.life > 0);

    // Cập nhật phân tử khí (vận tốc phụ thuộc nhiệt độ)
    const speedFactor = Math.sqrt((state.temp + 273.15) / 298.15);
    const waterCeiling = 1.0 - (state.waterLevelPct / 100.0) * 0.75; // không gian khí còn lại trên mặt nước
    state.molecules.forEach(m => {
      m.x += m.vx * speedFactor * state.speed;
      m.y += m.vy * speedFactor * state.speed;

      // Phản xạ trong lòng cốc
      if (m.x < 0.15) { m.x = 0.15; m.vx = Math.abs(m.vx); }
      if (m.x > 0.85) { m.x = 0.85; m.vx = -Math.abs(m.vx); }
      if (m.y < 0.12) { m.y = 0.12; m.vy = Math.abs(m.vy); }
      // Va đập với mặt nước đang dâng
      if (m.y > waterCeiling) { m.y = waterCeiling; m.vy = -Math.abs(m.vy); }
    });

    // Cập nhật lịch sử đồ thị (mỗi 0.25s)
    if (state.history.length === 0 || state.simTime - state.history[state.history.length - 1].time >= 0.25) {
      state.history.push({
        time: state.simTime,
        temp: state.temp,
        pressure: state.pressure,
        oxygen: state.oxygenPct,
        water: state.waterLevelPct
      });
      if (state.history.length > 250) state.history.shift();
    }

    updateSensorDisplays();
  }

  // Cập nhật các đồng hồ LED trên màn hình
  function updateSensorDisplays() {
    const sTemp = document.getElementById('sensorTemp');
    if (sTemp) sTemp.textContent = `${state.temp.toFixed(1)} °C`;

    const sPress = document.getElementById('sensorPressure');
    if (sPress) sPress.textContent = `${state.pressure.toFixed(1)} kPa`;

    const sDeltaP = document.getElementById('sensorDeltaP');
    if (sDeltaP) {
      const delta = state.pressure - 101.3;
      sDeltaP.textContent = delta < -0.1 ? `ΔP = ${delta.toFixed(1)} kPa (Áp suất giảm!)` : (delta > 0.1 ? `ΔP = +${delta.toFixed(1)} kPa (Tăng áp)` : `ΔP = 0.0 kPa (Cân bằng)`);
      sDeltaP.style.color = delta < -0.5 ? '#0284c7' : '#64748b';
    }

    const sO2 = document.getElementById('sensorOxygen');
    if (sO2) sO2.textContent = `${state.oxygenPct.toFixed(1)} %`;

    const sWater = document.getElementById('sensorWater');
    if (sWater) sWater.textContent = `${state.waterLevelPct.toFixed(1)} %`;

    const sFrac = document.getElementById('sensorFraction');
    if (sFrac) {
      const frac = (state.waterLevelPct / 20.0).toFixed(1);
      sFrac.textContent = `≈ ${frac}/5 vạch thể tích cốc`;
    }

    // Đếm số lượng hiển thị trên chú thích
    let o2Count = 0, co2Count = 0, h2oCount = 0;
    state.molecules.forEach(m => {
      if (m.type === 'o2') o2Count++;
      else if (m.type === 'co2') co2Count++;
      else if (m.type === 'h2o') h2oCount++;
    });
    const elO2 = document.getElementById('legendCountO2');
    if (elO2) elO2.textContent = `${state.oxygenPct.toFixed(1)}%`;
    const elCO2 = document.getElementById('legendCountCO2');
    if (elCO2) elCO2.textContent = (state.preset === 'candle') ? `${((16 - o2Count) * 0.9).toFixed(1)}%` : '0%';
  }

  // Vẽ Canvas thí nghiệm 2D
  function renderScene() {
    if (!ctx || !canvas) return;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    // Tọa độ trung tâm và kích thước các bộ phận
    const centerX = w * 0.5;
    const basinY = h * 0.72;
    const basinW = Math.min(w * 0.82, 540);
    const basinH = h * 0.22;

    const cupW = Math.min(w * 0.36, 210);
    const cupH = h * 0.52;
    const cupX = centerX - cupW * 0.5;
    const cupY = basinY - cupH + basinH * 0.28; // Đáy cốc cắm vào trong chậu nước

    // 1. VẼ NỀN VÀ BÀN THÍ NGHIỆM
    ctx.fillStyle = isDark ? '#0b0f19' : '#f8fafc';
    ctx.fillRect(0, 0, w, h);

    // Mặt bàn thí nghiệm
    const tableY = basinY + basinH * 0.82;
    ctx.fillStyle = isDark ? '#1e293b' : '#e2e8f0';
    ctx.fillRect(0, tableY, w, h - tableY);
    ctx.fillStyle = isDark ? '#0f172a' : '#cbd5e1';
    ctx.fillRect(0, tableY, w, 4);

    // 2. VẼ ĐẾ ĐỠ / NẾN / MUÔI ĐỐT PHOTPHO (Bên trong cốc)
    drawCombustionSource(centerX, basinY + 10, isDark);

    // 3. VẼ CHẬU NƯỚC THỦY TINH & MẶT NƯỚC BÊN NGOÀI
    drawWaterBasin(centerX, basinY, basinW, basinH, isDark);

    // 4. VẼ CỐC THỦY TINH ÚP NGƯỢC (CYLINDER)
    drawInvertedCylinder(cupX, cupY, cupW, cupH, basinY, isDark);

    // 5. VẼ CÁC BỌT KHÍ THOÁT RA KHI KHÍ GIÃN NỞ
    drawBubbles(centerX, basinY);

    // 6. VẼ HẠT PHÂN TỬ KHÍ ("KÍNH HIỂN VI PHÂN TỬ")
    if (state.showMolecules) {
      drawMolecules(cupX, cupY, cupW, cupH, basinY);
    }

    // 7. VẼ THƯỚC ĐO 5 PHẦN BẰNG NHAU (RULER 1/5)
    if (state.showRuler) {
      drawVolumeRuler(cupX, cupY, cupW, cupH, basinY, isDark);
    }

    // 8. VẼ ĐỒ THỊ LIVE TRÊN CANVAS PHỤ
    renderLiveChart(isDark);
  }

  // Vẽ ngọn lửa / nguồn đốt
  function drawCombustionSource(cx, baseCy, isDark) {
    if (state.preset === 'candle') {
      // Cây nến màu trắng ngà
      const candleW = 28;
      const candleH = 65;
      const candleX = cx - candleW * 0.5;
      const candleY = baseCy - candleH;

      // Đế nến kim loại tròn
      ctx.fillStyle = isDark ? '#475569' : '#94a3b8';
      ctx.beginPath();
      ctx.ellipse(cx, baseCy + 4, 30, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Thân nến sáp
      const candleGrad = ctx.createLinearGradient(candleX, 0, candleX + candleW, 0);
      candleGrad.addColorStop(0, '#fef08a');
      candleGrad.addColorStop(0.5, '#fef9c3');
      candleGrad.addColorStop(1, '#fde047');
      ctx.fillStyle = candleGrad;
      ctx.fillRect(candleX, candleY, candleW, candleH);

      // Tim nến màu đen
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx, candleY);
      ctx.lineTo(cx, candleY - 12);
      ctx.stroke();

      // Ngọn lửa bập bùng (khi có lửa)
      if (state.flameIntensity > 0.05) {
        drawRealisticFlame(cx, candleY - 14, 18 * state.flameIntensity, 34 * state.flameIntensity);
      } else if (state.phase === 'cooling' || state.phase === 'finished') {
        // Khói sau khi tắt
        drawExtinguishedSmoke(cx, candleY - 14);
      }
    } else if (state.preset === 'phosphorus') {
      // Muôi sắt đốt photpho đỏ
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx + 45, baseCy - 120);
      ctx.lineTo(cx, baseCy - 15);
      ctx.stroke();

      // Thìa/muôi múc
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.ellipse(cx, baseCy - 15, 20, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Đống bột photpho đỏ
      ctx.fillStyle = '#b91c1c';
      ctx.beginPath();
      ctx.ellipse(cx, baseCy - 18, 14, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Lửa photpho & Khói trắng P2O5
      if (state.flameIntensity > 0.05) {
        drawRealisticFlame(cx, baseCy - 22, 26 * state.flameIntensity, 48 * state.flameIntensity, '#fef08a');
      }

      // Vẽ các hạt khói P2O5
      drawPhosphorusSmoke(cx, baseCy - 30);
    } else {
      // Hot cup: chỉ có đế đặt rỗng
      ctx.fillStyle = isDark ? '#334155' : '#cbd5e1';
      ctx.beginPath();
      ctx.ellipse(cx, baseCy + 5, 25, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Biểu tượng khí nóng tỏa nhiệt
      if (state.temp > 35) {
        ctx.fillStyle = `rgba(234, 88, 12, ${Math.min(0.4, (state.temp - 25) / 100)})`;
        ctx.beginPath();
        ctx.arc(cx, baseCy - 45, 35, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Vẽ ngọn lửa nến thực tế
  function drawRealisticFlame(x, y, w, h, coreColor) {
    ctx.save();
    const time = performance.now() * 0.005;
    const flicker = Math.sin(time * 3) * 2;

    // Vầng hào quang sáng ấm
    const glowGrad = ctx.createRadialGradient(x, y - h * 0.4, 0, x, y - h * 0.4, h * 1.5);
    glowGrad.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
    glowGrad.addColorStop(0.5, 'rgba(249, 115, 22, 0.15)');
    glowGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(x, y - h * 0.4, h * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Vỏ ngoài ngọn lửa (cam/đỏ)
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(x - w * 0.5, y);
    ctx.quadraticCurveTo(x - w * 0.6, y - h * 0.5, x + flicker, y - h);
    ctx.quadraticCurveTo(x + w * 0.6, y - h * 0.5, x + w * 0.5, y);
    ctx.closePath();
    ctx.fill();

    // Lõi ngọn lửa (vàng rực)
    ctx.fillStyle = coreColor || '#fde047';
    ctx.beginPath();
    ctx.moveTo(x - w * 0.28, y);
    ctx.quadraticCurveTo(x - w * 0.35, y - h * 0.45, x + flicker * 0.6, y - h * 0.75);
    ctx.quadraticCurveTo(x + w * 0.35, y - h * 0.45, x + w * 0.28, y);
    ctx.closePath();
    ctx.fill();

    // Chân lửa xanh lam (đặc trưng ngọn lửa nến hydrocarbon)
    ctx.fillStyle = 'rgba(59, 130, 246, 0.7)';
    ctx.beginPath();
    ctx.ellipse(x, y, w * 0.25, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Khói khi nến tắt
  function drawExtinguishedSmoke(x, y) {
    ctx.save();
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x - 10, y - 20, x + 15, y - 45, x - 5, y - 75);
    ctx.stroke();
    ctx.restore();
  }

  // Khói trắng dày đặc của photpho
  function drawPhosphorusSmoke(cx, cy) {
    ctx.save();
    state.smokeParticles.forEach(p => {
      ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(cx + p.x * 200, cy + p.y * 100, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  // Vẽ chậu nước thủy tinh
  function drawWaterBasin(cx, cy, bw, bh, isDark) {
    const left = cx - bw * 0.5;
    const top = cy;

    // Mặt nước trong chậu (màu đỏ thực phẩm / mực loãng để dễ nhìn)
    const waterColor = isDark ? 'rgba(14, 165, 233, 0.45)' : 'rgba(239, 68, 68, 0.42)'; // Màu đỏ nước mực
    const waterDeep = isDark ? 'rgba(3, 105, 161, 0.75)' : 'rgba(185, 28, 28, 0.65)';

    // Khối nước trong chậu
    const basinWaterGrad = ctx.createLinearGradient(0, top, 0, top + bh);
    basinWaterGrad.addColorStop(0, waterColor);
    basinWaterGrad.addColorStop(1, waterDeep);
    ctx.fillStyle = basinWaterGrad;
    ctx.beginPath();
    ctx.roundRect(left, top, bw, bh, [0, 0, 16, 16]);
    ctx.fill();

    // Mặt thoáng nước bên ngoài
    ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.7)' : 'rgba(248, 113, 113, 0.85)';
    ctx.beginPath();
    ctx.ellipse(cx, top, bw * 0.5, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Thành chậu thủy tinh trong suốt
    ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.5)' : 'rgba(100, 116, 139, 0.45)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(left, top, bw, bh, [0, 0, 16, 16]);
    ctx.stroke();

    // Vành chậu trên
    ctx.beginPath();
    ctx.ellipse(cx, top, bw * 0.5, 12, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Vẽ cốc thủy tinh úp ngược (cylinder) & CỘT NƯỚC DÂNG BÊN TRONG CỐC
  function drawInvertedCylinder(cx, cy, cw, ch, basinY, isDark) {
    const r = 14; // bo góc đỉnh cốc

    // Chiều cao cột nước dâng trong lòng cốc
    const maxWaterRiseHeight = ch * 0.82;
    const currentRiseH = (state.waterLevelPct / 100.0) * maxWaterRiseHeight;
    const waterTopY = basinY - currentRiseH;

    // 1. CỘT NƯỚC DÂNG BÊN TRONG CỐC (Nếu nước dâng > 0)
    if (currentRiseH > 0) {
      const riseGrad = ctx.createLinearGradient(cx, waterTopY, cx, basinY);
      riseGrad.addColorStop(0, isDark ? 'rgba(14, 165, 233, 0.8)' : 'rgba(220, 38, 38, 0.75)');
      riseGrad.addColorStop(1, isDark ? 'rgba(3, 105, 161, 0.95)' : 'rgba(153, 27, 27, 0.9)');
      ctx.fillStyle = riseGrad;
      ctx.fillRect(cx + 4, waterTopY, cw - 8, basinY - waterTopY);

      // Khum mặt nước dâng (meniscus)
      ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.95)' : 'rgba(248, 113, 113, 0.95)';
      ctx.beginPath();
      ctx.ellipse(cx + cw * 0.5, waterTopY, (cw - 8) * 0.5, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      // Đường viền cong của mặt nước bên trong
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // 2. GIỌT NƯỚC NGƯNG TỤ BÁM QUANH THÀNH CỐC (H2O sương)
    if (state.dewDrops.length > 0) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      state.dewDrops.forEach(d => {
        const dropX = (d.side === 'left') ? cx + 7 : cx + cw - 7;
        const dropY = cy + d.y * ch;
        if (dropY < waterTopY) { // chỉ vẽ ở phần không khí chưa bị nước ngập
          ctx.beginPath();
          ctx.arc(dropX, dropY, d.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }

    // 3. THÀNH THỦY TINH CỦA CỐC ÚP
    ctx.strokeStyle = isDark ? 'rgba(226, 232, 240, 0.75)' : 'rgba(51, 65, 85, 0.7)';
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    // Đỉnh cốc (đáy cốc đang úp ngược)
    ctx.moveTo(cx, basinY + 15);
    ctx.lineTo(cx, cy + r);
    ctx.quadraticCurveTo(cx, cy, cx + r, cy);
    ctx.lineTo(cx + cw - r, cy);
    ctx.quadraticCurveTo(cx + cw, cy, cx + cw, cy + r);
    ctx.lineTo(cx + cw, basinY + 15);
    ctx.stroke();

    // Vệt sáng phản chiếu ánh sáng trên thủy tinh
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx + 8, cy + 20);
    ctx.lineTo(cx + 8, basinY - 20);
    ctx.stroke();
  }

  // Vẽ các bọt khí thoát ra ở chân cốc lúc không khí nở ra vì nhiệt
  function drawBubbles(cx, basinY) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.9)';
    ctx.lineWidth = 1.5;

    state.bubbles.forEach(b => {
      const bx = cx + b.x * 240;
      const by = basinY + b.y * 60;
      ctx.beginPath();
      ctx.arc(bx, by, b.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
    ctx.restore();
  }

  // Vẽ hạt phân tử khí bên trong cốc
  function drawMolecules(cx, cy, cw, ch, basinY) {
    const maxWaterRiseHeight = ch * 0.82;
    const currentRiseH = (state.waterLevelPct / 100.0) * maxWaterRiseHeight;
    const waterTopY = basinY - currentRiseH;

    ctx.save();
    // Vùng clip chỉ trong lòng cốc và phía trên mặt nước
    ctx.beginPath();
    ctx.rect(cx + 6, cy + 6, cw - 12, Math.max(10, waterTopY - cy - 6));
    ctx.clip();

    state.molecules.forEach(m => {
      const px = cx + m.x * cw;
      const py = cy + m.y * ch;

      if (py < waterTopY - 4) {
        if (m.type === 'o2') {
          // Hạt O2 (Đỏ cam)
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(px - 2.5, py, 3.5, 0, Math.PI * 2);
          ctx.arc(px + 2.5, py, 3.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (m.type === 'n2') {
          // Hạt N2 (Xanh dương)
          ctx.fillStyle = '#3b82f6';
          ctx.beginPath();
          ctx.arc(px - 2.2, py, 3.2, 0, Math.PI * 2);
          ctx.arc(px + 2.2, py, 3.2, 0, Math.PI * 2);
          ctx.fill();
        } else if (m.type === 'co2') {
          // Hạt CO2 (Xám đen ở giữa, 2 đỏ hai bên)
          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.arc(px, py, 3.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(px - 4, py, 2.5, 0, Math.PI * 2);
          ctx.arc(px + 4, py, 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (m.type === 'h2o') {
          // Hạt H2O (Xanh cyan)
          ctx.fillStyle = '#06b6d4';
          ctx.beginPath();
          ctx.arc(px, py - 2, 3.2, 0, Math.PI * 2);
          ctx.arc(px - 3, py + 2, 2.2, 0, Math.PI * 2);
          ctx.arc(px + 3, py + 2, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });

    ctx.restore();
  }

  // Vẽ thước chia 5 phần bằng nhau (1/5)
  function drawVolumeRuler(cx, cy, cw, ch, basinY, isDark) {
    const rulerX = cx + cw + 14;
    const maxWaterRiseHeight = ch * 0.82;
    const zeroY = basinY;
    const topY = basinY - maxWaterRiseHeight;

    ctx.save();
    // Đường thẳng trục thước
    ctx.strokeStyle = isDark ? '#94a3b8' : '#475569';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(rulerX, zeroY);
    ctx.lineTo(rulerX, topY);
    ctx.stroke();

    ctx.font = 'bold 11px JetBrains Mono, monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    // 5 vạch chia đều (tương ứng 0, 1, 2, 3, 4, 5)
    for (let i = 0; i <= 5; i++) {
      const markY = zeroY - (i / 5.0) * maxWaterRiseHeight;
      const isOneFifth = (i === 1);

      ctx.lineWidth = isOneFifth ? 3.5 : 2;
      ctx.strokeStyle = isOneFifth ? '#22c55e' : (isDark ? '#cbd5e1' : '#334155');

      ctx.beginPath();
      ctx.moveTo(rulerX, markY);
      ctx.lineTo(rulerX + (isOneFifth ? 18 : 10), markY);
      ctx.stroke();

      // Nhãn vạch
      if (isOneFifth) {
        ctx.fillStyle = '#16a34a';
        ctx.font = 'bold 13px JetBrains Mono, sans-serif';
        ctx.fillText(`Vạch 1 (≈ 20-21% O₂) ➔ [1/5]`, rulerX + 24, markY);
      } else {
        ctx.fillStyle = isDark ? '#cbd5e1' : '#475569';
        ctx.font = '11px JetBrains Mono, sans-serif';
        ctx.fillText(`Vạch ${i} (${i * 20}%)`, rulerX + 15, markY);
      }
    }

    ctx.restore();
  }

  // Vẽ đồ thị biến thiên đa kênh thời gian thực
  function renderLiveChart(isDark) {
    if (!chartCtx || !chartCanvas) return;
    const cw = chartCanvas.width;
    const ch = chartCanvas.height;

    chartCtx.clearRect(0, 0, cw, ch);

    // Nền lưới
    chartCtx.fillStyle = isDark ? '#0b0f19' : '#ffffff';
    chartCtx.fillRect(0, 0, cw, ch);

    chartCtx.strokeStyle = isDark ? '#1e293b' : '#f1f5f9';
    chartCtx.lineWidth = 1;
    for (let y = 30; y < ch; y += 35) {
      chartCtx.beginPath();
      chartCtx.moveTo(0, y);
      chartCtx.lineTo(cw, y);
      chartCtx.stroke();
    }

    if (state.history.length < 2) return;

    const maxTime = Math.max(15, state.simTime);
    const getX = (t) => (t / maxTime) * (cw - 60) + 40;

    // Vẽ 4 đường cong biểu diễn
    // 1. Nhiệt độ T: map [20°C, 150°C] -> [ch-15, 20]
    drawChartLine(state.history, (d) => getX(d.time), (d) => ch - 15 - ((d.temp - 20) / 130) * (ch - 35), '#ea580c', 2.5);

    // 2. Áp suất P: map [90 kPa, 105 kPa] -> [ch-15, 20]
    drawChartLine(state.history, (d) => getX(d.time), (d) => ch - 15 - ((d.pressure - 92) / 13) * (ch - 35), '#0284c7', 2);

    // 3. % Oxygen: map [0%, 25%] -> [ch-15, 20]
    drawChartLine(state.history, (d) => getX(d.time), (d) => ch - 15 - (d.oxygen / 25) * (ch - 35), '#16a34a', 2.5);

    // 4. Mực nước dâng: map [0%, 30%] -> [ch-15, 20]
    drawChartLine(state.history, (d) => getX(d.time), (d) => ch - 15 - (d.water / 30) * (ch - 35), '#2563eb', 3);
  }

  function drawChartLine(hist, getX, getY, color, lineWidth) {
    chartCtx.save();
    chartCtx.strokeStyle = color;
    chartCtx.lineWidth = lineWidth;
    chartCtx.beginPath();

    hist.forEach((pt, idx) => {
      const x = getX(pt);
      const y = Math.max(15, Math.min(chartCanvas.height - 10, getY(pt)));
      if (idx === 0) chartCtx.moveTo(x, y);
      else chartCtx.lineTo(x, y);
    });

    chartCtx.stroke();
    chartCtx.restore();
  }

  // Vòng lặp Animation Frame chính
  let lastTimestamp = 0;
  function loop(timestamp = 0) {
    const dt = (timestamp - lastTimestamp) * 0.001 || 0.016;
    lastTimestamp = timestamp;

    updatePhysics(Math.min(dt, 0.1));
    renderScene();

    animId = requestAnimationFrame(loop);
  }

  // Tự động khởi động khi tải xong DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOxygenLab);
  } else {
    initOxygenLab();
  }

})();
