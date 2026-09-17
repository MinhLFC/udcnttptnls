/**
 * lab-acid-base.js
 * 
 * Mô phỏng thí nghiệm phản ứng axit - bazơ và đo pH
 * Sử dụng HTML/CSS/JS thuần, không thư viện ngoài.
 */

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('experiment-acid-base');
    if (!container) return;

    // --- Dữ liệu hóa chất ---
    const acids = [
        { id: 'HCl', name: 'Acid Hydrochloric (HCl)', strong: true, n: 1, formula: 'HCl' },
        { id: 'H2SO4', name: 'Acid Sulfuric (H2SO4)', strong: true, n: 2, formula: 'H2SO4' },
        { id: 'CH3COOH', name: 'Acid Acetic (CH3COOH)', strong: false, n: 1, pKa: 4.74, formula: 'CH3COOH' }
    ];

    const bases = [
        { id: 'NaOH', name: 'Natri Hydroxide (NaOH)', n: 1, formula: 'NaOH' },
        { id: 'KOH', name: 'Kali Hydroxide (KOH)', n: 1, formula: 'KOH' },
        { id: 'CaOH2', name: 'Canxi Hydroxide (Ca(OH)2)', n: 2, formula: 'Ca(OH)2' }
    ];

    // --- Tạo giao diện ---
    container.innerHTML = `
        <style>
            .lab-container {
                font-family: 'Be Vietnam Pro', 'Plus Jakarta Sans', sans-serif;
                background-color: var(--bg-color, #f8f9fa);
                color: var(--text-color, #333);
                padding: 20px;
                border-radius: 12px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                max-width: 900px;
                margin: 0 auto;
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            [data-theme="dark"] .lab-container {
                --bg-color: #1e1e1e;
                --text-color: #f0f0f0;
                --panel-bg: #2d2d2d;
                --border-color: #444;
            }
            .lab-panel {
                background: var(--panel-bg, #fff);
                padding: 15px;
                border-radius: 8px;
                border: 1px solid var(--border-color, #e0e0e0);
            }
            .controls-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
            }
            @media (max-width: 768px) {
                .controls-grid {
                    grid-template-columns: 1fr;
                }
            }
            .control-group {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .control-group label {
                font-weight: 600;
            }
            .control-group select, .control-group input[type="range"] {
                width: 100%;
                padding: 8px;
                border-radius: 6px;
                border: 1px solid var(--border-color, #ccc);
                background: var(--bg-color, #fff);
                color: var(--text-color, #333);
            }
            .slider-val {
                text-align: right;
                font-size: 0.9em;
                color: var(--primary, #003c71);
                font-weight: bold;
            }
            .buttons {
                display: flex;
                justify-content: center;
                gap: 15px;
            }
            .lab-container .buttons button {
                padding: 10px 25px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: bold;
                font-size: 16px;
                transition: opacity 0.2s;
            }
            .lab-container .buttons button:hover {
                opacity: 0.8;
            }
            .btn-mix {
                background-color: var(--primary, #003c71);
                color: white;
            }
            .btn-reset {
                background-color: var(--accent, #cf2e2e);
                color: white;
            }
            .visual-area {
                display: flex;
                align-items: flex-end;
                justify-content: center;
                gap: 40px;
                height: 250px;
                padding: 20px;
                position: relative;
            }
            .beaker {
                width: 120px;
                height: 180px;
                border: 4px solid rgba(200, 200, 200, 0.5);
                border-top: none;
                border-radius: 0 0 20px 20px;
                position: relative;
                overflow: hidden;
            }
            .liquid {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 0%;
                background-color: rgba(200, 200, 200, 0.2);
                transition: height 1s ease-in-out, background-color 1s ease;
            }
            .bubble {
                position: absolute;
                bottom: -10px;
                background-color: rgba(255,255,255,0.6);
                border-radius: 50%;
                animation: rise 2s infinite ease-in;
            }
            @keyframes rise {
                0% { bottom: 0; opacity: 1; transform: scale(1) translateX(0); }
                100% { bottom: 100%; opacity: 0; transform: scale(1.5) translateX(-10px); }
            }
            .indicator-strip {
                width: 30px;
                height: 150px;
                background: linear-gradient(to bottom, #ff0000, #ff0000);
                border: 2px solid #ccc;
                border-radius: 4px;
                transition: background 1s ease;
            }
            .ph-display {
                text-align: center;
                font-size: 24px;
                font-weight: bold;
                margin-top: 10px;
            }
            .ph-bar-container {
                width: 100%;
                height: 30px;
                background: linear-gradient(to right, 
                    #ff0000 0%, 
                    #ffa500 21%, 
                    #ffff00 35%, 
                    #00ff00 50%, 
                    #00ffff 64%, 
                    #0000ff 85%, 
                    #800080 100%);
                border-radius: 15px;
                position: relative;
                margin-top: 10px;
            }
            .ph-marker {
                width: 4px;
                height: 40px;
                background: #000;
                position: absolute;
                top: -5px;
                left: 50%;
                transform: translateX(-50%);
                transition: left 1s ease;
            }
            [data-theme="dark"] .ph-marker { background: #fff; }
            .equation {
                text-align: center;
                font-size: 1.2em;
                font-weight: bold;
                color: var(--primary, #003c71);
                margin: 15px 0;
            }
        </style>
        
        <div class="lab-container">
            <h2 style="text-align:center; margin: 0;">Thí nghiệm Phản ứng Acid - Base</h2>
            
            <div class="controls-grid">
                <!-- Cột Acid -->
                <div class="lab-panel control-group">
                    <label for="acid-select">Chọn Acid:</label>
                    <select id="acid-select">
                        ${acids.map(a => `<option value="${a.id}">${a.name}</option>`).join('')}
                    </select>
                    
                    <label>Nồng độ (M):</label>
                    <input type="range" id="acid-conc" min="0.01" max="1.0" step="0.01" value="0.1">
                    <div class="slider-val" id="acid-conc-val">0.1 M</div>
                    
                    <label>Thể tích (mL):</label>
                    <input type="range" id="acid-vol" min="1" max="100" step="1" value="50">
                    <div class="slider-val" id="acid-vol-val">50 mL</div>
                </div>

                <!-- Cột Base -->
                <div class="lab-panel control-group">
                    <label for="base-select">Chọn Base:</label>
                    <select id="base-select">
                        ${bases.map(b => `<option value="${b.id}">${b.name}</option>`).join('')}
                    </select>
                    
                    <label>Nồng độ (M):</label>
                    <input type="range" id="base-conc" min="0.01" max="1.0" step="0.01" value="0.1">
                    <div class="slider-val" id="base-conc-val">0.1 M</div>
                    
                    <label>Thể tích (mL):</label>
                    <input type="range" id="base-vol" min="1" max="100" step="1" value="50">
                    <div class="slider-val" id="base-vol-val">50 mL</div>
                </div>
            </div>

            <div class="buttons">
                <button class="btn-mix" id="btn-mix">Pha trộn</button>
                <button class="btn-reset" id="btn-reset">Đặt lại</button>
            </div>

            <div class="lab-panel">
                <div class="equation" id="reaction-equation">
                    Phương trình phản ứng sẽ hiển thị ở đây
                </div>
                
                <div class="visual-area">
                    <div class="beaker">
                        <div class="liquid" id="liquid"></div>
                    </div>
                    <div>
                        <div style="text-align:center; font-size:12px; margin-bottom:5px;">Giấy quỳ</div>
                        <div class="indicator-strip" id="indicator"></div>
                    </div>
                </div>
                
                <div class="ph-display">pH = <span id="ph-value">7.00</span></div>
                
                <div class="ph-bar-container">
                    <div class="ph-marker" id="ph-marker"></div>
                </div>
            </div>
        </div>
    `;

    // --- Lấy các phần tử DOM ---
    const els = {
        acidSel: document.getElementById('acid-select'),
        acidConc: document.getElementById('acid-conc'),
        acidConcVal: document.getElementById('acid-conc-val'),
        acidVol: document.getElementById('acid-vol'),
        acidVolVal: document.getElementById('acid-vol-val'),
        
        baseSel: document.getElementById('base-select'),
        baseConc: document.getElementById('base-conc'),
        baseConcVal: document.getElementById('base-conc-val'),
        baseVol: document.getElementById('base-vol'),
        baseVolVal: document.getElementById('base-vol-val'),
        
        btnMix: document.getElementById('btn-mix'),
        btnReset: document.getElementById('btn-reset'),
        
        liquid: document.getElementById('liquid'),
        indicator: document.getElementById('indicator'),
        phValue: document.getElementById('ph-value'),
        phMarker: document.getElementById('ph-marker'),
        equation: document.getElementById('reaction-equation')
    };

    let bubblesInterval = null;

    // --- Xử lý sự kiện cập nhật số liệu ---
    const updateLabels = () => {
        els.acidConcVal.innerText = `${parseFloat(els.acidConc.value).toFixed(2)} M`;
        els.acidVolVal.innerText = `${els.acidVol.value} mL`;
        els.baseConcVal.innerText = `${parseFloat(els.baseConc.value).toFixed(2)} M`;
        els.baseVolVal.innerText = `${els.baseVol.value} mL`;
    };

    els.acidConc.addEventListener('input', updateLabels);
    els.acidVol.addEventListener('input', updateLabels);
    els.baseConc.addEventListener('input', updateLabels);
    els.baseVol.addEventListener('input', updateLabels);

    // --- Các hàm tính toán hóa học ---
    const calculatePH = () => {
        const acidId = els.acidSel.value;
        const baseId = els.baseSel.value;
        const acid = acids.find(a => a.id === acidId);
        const base = bases.find(b => b.id === baseId);

        const Ca = parseFloat(els.acidConc.value);
        const Va = parseFloat(els.acidVol.value) / 1000; // Đổi sang Lít
        const Cb = parseFloat(els.baseConc.value);
        const Vb = parseFloat(els.baseVol.value) / 1000;
        
        const Vtotal = Va + Vb;
        if (Vtotal === 0) return 7;

        let pH = 7;

        if (acid.strong) {
            // Acid mạnh + Base mạnh
            const molesH = Ca * Va * acid.n;
            const molesOH = Cb * Vb * base.n;

            if (molesH > molesOH) {
                const excessH = molesH - molesOH;
                const concH = excessH / Vtotal;
                pH = -Math.log10(concH);
            } else if (molesOH > molesH) {
                const excessOH = molesOH - molesH;
                const concOH = excessOH / Vtotal;
                const pOH = -Math.log10(concOH);
                pH = 14 - pOH;
            } else {
                pH = 7; // Trung hòa
            }
        } else {
            // Acid yếu (CH3COOH) + Base mạnh
            const molesHA = Ca * Va; // CH3COOH có n=1
            const molesOH = Cb * Vb * base.n;

            if (molesOH === 0) {
                // Chỉ có acid yếu
                const Ka = Math.pow(10, -acid.pKa);
                const concH = Math.sqrt(Ka * Ca);
                pH = -Math.log10(concH);
            } else if (molesOH < molesHA) {
                // Hệ đệm
                const molesA = molesOH;
                const molesHARemaining = molesHA - molesOH;
                pH = acid.pKa + Math.log10(molesA / molesHARemaining);
            } else if (molesOH === molesHA) {
                // Thủy phân muối của acid yếu và base mạnh (tạo môi trường base)
                const C_salt = molesHA / Vtotal;
                const pKb = 14 - acid.pKa;
                const Kb = Math.pow(10, -pKb);
                const concOH = Math.sqrt(Kb * C_salt);
                pH = 14 + Math.log10(concOH);
            } else {
                // Dư base mạnh
                const excessOH = molesOH - molesHA;
                const concOH = excessOH / Vtotal;
                const pOH = -Math.log10(concOH);
                pH = 14 - pOH;
            }
        }

        // Giới hạn pH trong khoảng 0-14
        return Math.max(0, Math.min(14, pH));
    };

    const getEquation = () => {
        const a = acids.find(a => a.id === els.acidSel.value).formula;
        const b = bases.find(b => b.id === els.baseSel.value).formula;

        const equations = {
            'HCl_NaOH': 'HCl + NaOH &rarr; NaCl + H<sub>2</sub>O',
            'HCl_KOH': 'HCl + KOH &rarr; KCl + H<sub>2</sub>O',
            'HCl_CaOH2': '2HCl + Ca(OH)<sub>2</sub> &rarr; CaCl<sub>2</sub> + 2H<sub>2</sub>O',
            'H2SO4_NaOH': 'H<sub>2</sub>SO<sub>4</sub> + 2NaOH &rarr; Na<sub>2</sub>SO<sub>4</sub> + 2H<sub>2</sub>O',
            'H2SO4_KOH': 'H<sub>2</sub>SO<sub>4</sub> + 2KOH &rarr; K<sub>2</sub>SO<sub>4</sub> + 2H<sub>2</sub>O',
            'H2SO4_CaOH2': 'H<sub>2</sub>SO<sub>4</sub> + Ca(OH)<sub>2</sub> &rarr; CaSO<sub>4</sub> + 2H<sub>2</sub>O',
            'CH3COOH_NaOH': 'CH<sub>3</sub>COOH + NaOH &rarr; CH<sub>3</sub>COONa + H<sub>2</sub>O',
            'CH3COOH_KOH': 'CH<sub>3</sub>COOH + KOH &rarr; CH<sub>3</sub>COOK + H<sub>2</sub>O',
            'CH3COOH_CaOH2': '2CH<sub>3</sub>COOH + Ca(OH)<sub>2</sub> &rarr; (CH<sub>3</sub>COO)<sub>2</sub>Ca + 2H<sub>2</sub>O'
        };

        const key = `${els.acidSel.value}_${els.baseSel.value}`;
        return equations[key] || 'Phản ứng trung hòa';
    };

    // --- Các hàm trực quan ---
    const getColorFromPH = (pH) => {
        // gradient: 0(red), 3(orange), 5(yellow), 7(green), 9(blue), 14(purple)
        if (pH < 3) return interpolateColor([255, 0, 0], [255, 165, 0], pH / 3);
        if (pH < 5) return interpolateColor([255, 165, 0], [255, 255, 0], (pH - 3) / 2);
        if (pH < 7) return interpolateColor([255, 255, 0], [0, 255, 0], (pH - 5) / 2);
        if (pH < 9) return interpolateColor([0, 255, 0], [0, 0, 255], (pH - 7) / 2);
        return interpolateColor([0, 0, 255], [128, 0, 128], (pH - 9) / 5);
    };

    const interpolateColor = (color1, color2, factor) => {
        const r = Math.round(color1[0] + factor * (color2[0] - color1[0]));
        const g = Math.round(color1[1] + factor * (color2[1] - color1[1]));
        const b = Math.round(color1[2] + factor * (color2[2] - color1[2]));
        return `rgb(${r}, ${g}, ${b})`;
    };

    const getIndicatorColor = (pH) => {
        if (pH < 4) return '#ff4d4d'; // Đỏ
        if (pH > 10) return '#4d4dff'; // Xanh
        if (Math.abs(pH - 7) < 0.5) return '#9933ff'; // Tím (trung tính)
        // Nếu ở khoảng giữa
        if (pH <= 7) return interpolateColor([255, 77, 77], [153, 51, 255], (pH - 4)/3);
        return interpolateColor([153, 51, 255], [77, 77, 255], (pH - 7)/3);
    };

    const createBubbles = () => {
        clearInterval(bubblesInterval);
        const beaker = document.querySelector('.beaker');
        // Xóa bóng bóng cũ
        document.querySelectorAll('.bubble').forEach(b => b.remove());

        let count = 0;
        bubblesInterval = setInterval(() => {
            if (count > 15) {
                clearInterval(bubblesInterval);
                return;
            }
            const bubble = document.createElement('div');
            bubble.classList.add('bubble');
            const size = Math.random() * 10 + 5;
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.left = `${Math.random() * 80 + 10}%`;
            bubble.style.animationDuration = `${Math.random() * 1 + 1}s`;
            beaker.appendChild(bubble);
            
            setTimeout(() => {
                if (bubble.parentNode) bubble.remove();
            }, 2000);
            
            count++;
        }, 150);
    };

    // --- Xử lý Nút bấm ---
    els.btnMix.addEventListener('click', () => {
        const pH = calculatePH();
        
        // Cập nhật text
        els.phValue.innerText = pH.toFixed(2);
        els.equation.innerHTML = getEquation();

        // Cập nhật chất lỏng
        const totalVol = parseFloat(els.acidVol.value) + parseFloat(els.baseVol.value);
        // Tối đa 200ml -> 100% height
        const heightPct = Math.min(100, (totalVol / 200) * 100);
        
        const bgColor = getColorFromPH(pH);
        
        els.liquid.style.height = `${heightPct}%`;
        els.liquid.style.backgroundColor = bgColor.replace('rgb', 'rgba').replace(')', ', 0.8)');

        // Cập nhật giấy quỳ
        els.indicator.style.background = getIndicatorColor(pH);

        // Cập nhật thanh pH
        const phPosition = (pH / 14) * 100;
        els.phMarker.style.left = `${phPosition}%`;

        // Hiệu ứng bóng bóng
        createBubbles();
    });

    els.btnReset.addEventListener('click', () => {
        // Reset inputs
        els.acidConc.value = '0.1';
        els.acidVol.value = '50';
        els.baseConc.value = '0.1';
        els.baseVol.value = '50';
        
        updateLabels();

        // Reset visuals
        els.liquid.style.height = '0%';
        els.indicator.style.background = 'linear-gradient(to bottom, #ff0000, #ff0000)';
        els.phValue.innerText = '7.00';
        els.phMarker.style.left = '50%';
        els.equation.innerHTML = 'Phương trình phản ứng sẽ hiển thị ở đây';
        
        clearInterval(bubblesInterval);
        document.querySelectorAll('.bubble').forEach(b => b.remove());
    });

    // Khởi tạo ban đầu
    updateLabels();
});
