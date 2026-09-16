/**
 * LAB-MOLECULE.JS - MÔ HÌNH CẤU TRÚC PHÂN TỬ 3D TƯƠNG TÁC
 * Website: Đỗ Văn Nhật Minh - ĐHSP TP.HCM (HCMUE)
 * Phục vụ giảng dạy & học tập môn KHTN Cấp 2 (Lớp 7, 8, 9 GDPT 2018)
 */

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('experiment-molecule');
    if (!container) return;

    // --- 1. TẠO GIAO DIỆN (UI) ---
    container.innerHTML = `
        <div class="molecule-lab" style="display: flex; flex-direction: column; gap: 20px; font-family: 'Be Vietnam Pro', 'Plus Jakarta Sans', sans-serif;">
            <style>
                .molecule-lab { --primary: #003c71; --accent: #cf2e2e; --bg-box: #f8fafc; --text-box: #1e293b; --border-box: #cbd5e1; }
                [data-theme="dark"] .molecule-lab { --bg-box: #1e293b; --text-box: #f1f5f9; --border-box: #334155; }
                
                .mol-category-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
                .mol-cat-btn { padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border-box); background: var(--bg-box); color: var(--text-box); font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: 0.25s; }
                .mol-cat-btn.active { background: var(--primary); color: #fff; border-color: var(--primary); }

                .molecule-controls { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; margin-bottom: 15px; max-height: 220px; overflow-y: auto; padding: 4px; }
                .mol-btn { padding: 10px; border: 1.5px solid var(--border-box); border-radius: 10px; background: var(--bg-box); color: var(--text-box); cursor: pointer; transition: 0.25s; text-align: center; }
                .mol-btn:hover { border-color: var(--primary); transform: translateY(-2px); }
                .mol-btn.active { background: var(--primary); color: white; border-color: var(--primary); box-shadow: 0 4px 12px rgba(0,60,113,0.3); }
                .mol-btn-title { font-weight: 700; font-size: 0.95rem; }
                .mol-btn-formula { font-size: 0.85rem; opacity: 0.85; margin-top: 2px; }

                .molecule-main { display: flex; flex-wrap: wrap; gap: 20px; align-items: stretch; }
                .molecule-viewer { flex: 1; min-width: 320px; min-height: 420px; position: relative; border-radius: 16px; overflow: hidden; background: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%); box-shadow: inset 0 0 40px rgba(0,0,0,0.5), 0 10px 25px rgba(0,0,0,0.15); border: 1px solid rgba(255,255,255,0.1); }
                .molecule-canvas { display: block; width: 100%; height: 100%; min-height: 420px; cursor: grab; }
                .molecule-canvas:active { cursor: grabbing; }

                .molecule-info { flex: 0 0 320px; padding: 22px; background: var(--bg-box); border: 1px solid var(--border-box); border-radius: 16px; color: var(--text-box); box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
                .info-row { margin-bottom: 12px; border-bottom: 1px dashed var(--border-box); padding-bottom: 8px; }
                .info-label { font-weight: 700; font-size: 0.78rem; opacity: 0.75; text-transform: uppercase; letter-spacing: 0.5px; }
                .info-value { font-size: 1.05rem; margin-top: 4px; font-weight: 600; }
                .info-note { font-size: 0.85rem; color: var(--accent); margin-top: 4px; line-height: 1.4; }

                .toolbar { position: absolute; bottom: 12px; left: 12px; display: flex; gap: 8px; z-index: 10; flex-wrap: wrap; }
                .tool-btn { padding: 7px 13px; border-radius: 20px; border: none; background: rgba(255,255,255,0.2); backdrop-filter: blur(8px); color: #fff; cursor: pointer; font-weight: 600; font-size: 0.85rem; transition: 0.2s; }
                .tool-btn:hover { background: rgba(255,255,255,0.4); }
                .tool-btn.active { background: var(--accent); color: #fff; }

                .legend { position: absolute; top: 12px; left: 12px; background: rgba(0,0,0,0.45); backdrop-filter: blur(8px); border-radius: 10px; padding: 8px 12px; display: flex; gap: 10px; font-size: 0.78rem; color: #fff; z-index: 10; pointer-events: none; }
                .legend-item { display: flex; align-items: center; gap: 5px; }
                .legend-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
            </style>
            
            <!-- Bộ lọc phân loại phân tử KHTN -->
            <div class="mol-category-tabs">
                <button class="mol-cat-btn active" data-cat="all">Tất cả (15)</button>
                <button class="mol-cat-btn" data-cat="element">Đơn chất KHTN 7</button>
                <button class="mol-cat-btn" data-cat="inorganic">Hợp chất vô cơ KHTN 8</button>
                <button class="mol-cat-btn" data-cat="organic">Hợp chất hữu cơ KHTN 9</button>
            </div>

            <!-- Danh sách chọn phân tử -->
            <div class="molecule-controls" id="mol-selector"></div>
            
            <div class="molecule-main">
                <div class="molecule-viewer">
                    <!-- Bảng chú thích màu nguyên tử CPK -->
                    <div class="legend">
                        <span class="legend-item"><span class="legend-dot" style="background:#FFF;border:1px solid #999;"></span> H</span>
                        <span class="legend-item"><span class="legend-dot" style="background:#333;"></span> C</span>
                        <span class="legend-item"><span class="legend-dot" style="background:#EF4444;"></span> O</span>
                        <span class="legend-item"><span class="legend-dot" style="background:#2563EB;"></span> N</span>
                        <span class="legend-item"><span class="legend-dot" style="background:#22C55E;"></span> Cl</span>
                        <span class="legend-item"><span class="legend-dot" style="background:#EAB308;"></span> S</span>
                        <span class="legend-item"><span class="legend-dot" style="background:#A855F7;"></span> Na</span>
                    </div>

                    <canvas id="mol-canvas" class="molecule-canvas"></canvas>
                    
                    <div class="toolbar">
                        <button id="btn-auto-rotate" class="tool-btn active">🔄 Tự động xoay</button>
                        <button id="btn-toggle-labels" class="tool-btn active">🏷️ Hiện ký hiệu</button>
                        <button id="btn-zoom-in" class="tool-btn">➕ Phóng to</button>
                        <button id="btn-zoom-out" class="tool-btn">➖ Thu nhỏ</button>
                        <button id="btn-reset" class="tool-btn">🎯 Đặt lại</button>
                    </div>
                </div>
                
                <div class="molecule-info" id="mol-info">
                    <!-- Sẽ được điền bằng JS -->
                </div>
            </div>
        </div>
    `;

    // --- 2. BẢNG MÀU NGUYÊN TỬ (CPK) VÀ THÔNG SỐ BÁN KÍNH ---
    const elements = {
        H:  { color: '#FFFFFF', radius: 12, outline: '#94A3B8', text: '#0F172A' },
        C:  { color: '#334155', radius: 18, outline: '#0F172A', text: '#FFFFFF' },
        N:  { color: '#2563EB', radius: 17, outline: '#1D4ED8', text: '#FFFFFF' },
        O:  { color: '#EF4444', radius: 16, outline: '#B91C1C', text: '#FFFFFF' },
        Cl: { color: '#22C55E', radius: 20, outline: '#15803D', text: '#FFFFFF' },
        Na: { color: '#A855F7', radius: 22, outline: '#7E22CE', text: '#FFFFFF' },
        S:  { color: '#EAB308', radius: 21, outline: '#A16207', text: '#0F172A' }
    };

    // --- 3. DỮ LIỆU 15 PHÂN TỬ CHUẨN KHTN CẤP 2 (LỚP 7, 8, 9) ---
    const molecules = [
        // --- NHÓM 1: ĐƠN CHẤT KHTN 7 ---
        {
            id: 'h2', cat: 'element', name: 'Khí Hydrogen (Hiđro)', formula: 'H₂', iupac: 'Molecular hydrogen',
            bondType: 'Cộng hóa trị không phân cực (H-H)', angle: '180°', geometry: 'Đường thẳng (Linear)', mass: '2.016 g/mol',
            note: 'Khí nhẹ nhất trong tự nhiên, cháy tạo ra nước.',
            atoms: [
                { el: 'H', x: -0.75, y: 0, z: 0 },
                { el: 'H', x: 0.75, y: 0, z: 0 }
            ],
            bonds: [ { a: 0, b: 1, type: 1 } ]
        },
        {
            id: 'o2', cat: 'element', name: 'Khí Oxygen (Oxi)', formula: 'O₂', iupac: 'Molecular oxygen',
            bondType: 'Cộng hóa trị không phân cực (O=O)', angle: '180°', geometry: 'Đường thẳng (Linear)', mass: '31.998 g/mol',
            note: 'Duy trì sự sống và sự cháy. Hai nguyên tử O liên kết đôi.',
            atoms: [
                { el: 'O', x: -0.95, y: 0, z: 0 },
                { el: 'O', x: 0.95, y: 0, z: 0 }
            ],
            bonds: [ { a: 0, b: 1, type: 2 } ]
        },
        {
            id: 'n2', cat: 'element', name: 'Khí Nitrogen (Nitơ)', formula: 'N₂', iupac: 'Molecular nitrogen',
            bondType: 'Cộng hóa trị không phân cực (N≡N)', angle: '180°', geometry: 'Đường thẳng (Linear)', mass: '28.014 g/mol',
            note: 'Chiếm khoảng 78% thể tích không khí. Hai nguyên tử N liên kết ba rất bền.',
            atoms: [
                { el: 'N', x: -0.9, y: 0, z: 0 },
                { el: 'N', x: 0.9, y: 0, z: 0 }
            ],
            bonds: [ { a: 0, b: 1, type: 3 } ]
        },
        {
            id: 'cl2', cat: 'element', name: 'Khí Chlorine (Clo)', formula: 'Cl₂', iupac: 'Molecular chlorine',
            bondType: 'Cộng hóa trị không phân cực (Cl-Cl)', angle: '180°', geometry: 'Đường thẳng (Linear)', mass: '70.90 g/mol',
            note: 'Khí màu vàng lục, mùi xốc, dùng khử trùng nước sinh hoạt.',
            atoms: [
                { el: 'Cl', x: -1.1, y: 0, z: 0 },
                { el: 'Cl', x: 1.1, y: 0, z: 0 }
            ],
            bonds: [ { a: 0, b: 1, type: 1 } ]
        },

        // --- NHÓM 2: HỢP CHẤT VÔ CƠ KHTN 8 ---
        {
            id: 'water', cat: 'inorganic', name: 'Nước', formula: 'H₂O', iupac: 'Oxidane / Dihydrogen monoxide',
            bondType: 'Cộng hóa trị phân cực', angle: '104.5°', geometry: 'Góc (Bent)', mass: '18.015 g/mol',
            note: 'Phân tử có dạng gấp khúc, đóng vai trò dung môi hòa tan sự sống.',
            atoms: [
                { el: 'O', x: 0, y: 0.4, z: 0 },
                { el: 'H', x: -1.1, y: -0.4, z: 0 },
                { el: 'H', x: 1.1, y: -0.4, z: 0 }
            ],
            bonds: [ { a: 0, b: 1, type: 1 }, { a: 0, b: 2, type: 1 } ]
        },
        {
            id: 'co2', cat: 'inorganic', name: 'Carbon Dioxide (Cacbonic)', formula: 'CO₂', iupac: 'Carbon dioxide',
            bondType: 'Cộng hóa trị phân cực (O=C=O)', angle: '180°', geometry: 'Đường thẳng (Linear)', mass: '44.01 g/mol',
            note: 'Khí nhà kính, sản phẩm của quá trình hô hấp và đốt cháy.',
            atoms: [
                { el: 'C', x: 0, y: 0, z: 0 },
                { el: 'O', x: -1.8, y: 0, z: 0 },
                { el: 'O', x: 1.8, y: 0, z: 0 }
            ],
            bonds: [ { a: 0, b: 1, type: 2 }, { a: 0, b: 2, type: 2 } ]
        },
        {
            id: 'co', cat: 'inorganic', name: 'Carbon Monoxide', formula: 'CO', iupac: 'Carbon monoxide',
            bondType: 'Cộng hóa trị phân cực (C≡O)', angle: '180°', geometry: 'Đường thẳng (Linear)', mass: '28.01 g/mol',
            note: 'Khí cực độc sinh ra khi đốt nhiên liệu thiếu oxy.',
            atoms: [
                { el: 'C', x: -0.8, y: 0, z: 0 },
                { el: 'O', x: 0.8, y: 0, z: 0 }
            ],
            bonds: [ { a: 0, b: 1, type: 3 } ]
        },
        {
            id: 'hcl', cat: 'inorganic', name: 'Hydrochloric Acid', formula: 'HCl', iupac: 'Hydrogen chloride',
            bondType: 'Cộng hóa trị phân cực (H-Cl)', angle: '180°', geometry: 'Đường thẳng (Linear)', mass: '36.46 g/mol',
            note: 'Có trong dịch vị dạ dày giúp tiêu hóa thức ăn, là acid mạnh điển hình trong KHTN 8.',
            atoms: [
                { el: 'H', x: -1.3, y: 0, z: 0 },
                { el: 'Cl', x: 0.5, y: 0, z: 0 }
            ],
            bonds: [ { a: 0, b: 1, type: 1 } ]
        },
        {
            id: 'so2', cat: 'inorganic', name: 'Sulfur Dioxide (Lưu huỳnh đioxit)', formula: 'SO₂', iupac: 'Sulfur dioxide',
            bondType: 'Cộng hóa trị phân cực', angle: '119°', geometry: 'Góc (Bent)', mass: '64.06 g/mol',
            note: 'Khí mùi hắc, nguyên nhân chính gây ra mưa acid.',
            atoms: [
                { el: 'S', x: 0, y: 0.45, z: 0 },
                { el: 'O', x: -1.4, y: -0.4, z: 0 },
                { el: 'O', x: 1.4, y: -0.4, z: 0 }
            ],
            bonds: [ { a: 0, b: 1, type: 2 }, { a: 0, b: 2, type: 2 } ]
        },
        {
            id: 'nh3', cat: 'inorganic', name: 'Ammonia (Amoniac)', formula: 'NH₃', iupac: 'Azane',
            bondType: 'Cộng hóa trị phân cực', angle: '107°', geometry: 'Chóp tam giác (Trigonal pyramidal)', mass: '17.03 g/mol',
            note: 'Khí mùi khai, tan cực nhiều trong nước, dùng sản xuất phân đạm.',
            atoms: [
                { el: 'N', x: 0, y: 0.4, z: 0 },
                { el: 'H', x: 0, y: -0.4, z: 1.1 },
                { el: 'H', x: 0.95, y: -0.4, z: -0.55 },
                { el: 'H', x: -0.95, y: -0.4, z: -0.55 }
            ],
            bonds: [ { a: 0, b: 1, type: 1 }, { a: 0, b: 2, type: 1 }, { a: 0, b: 3, type: 1 } ]
        },
        {
            id: 'nacl', cat: 'inorganic', name: 'Sodium Chloride (Muối ăn)', formula: 'NaCl', iupac: 'Sodium chloride',
            bondType: 'Liên kết Ion (Na⁺ ··· Cl⁻)', angle: 'N/A', geometry: 'Mạng tinh thể lập phương', mass: '58.44 g/mol',
            note: 'Gồm ion Na⁺ và Cl⁻ hút nhau bằng lực hút tĩnh điện, gia vị quen thuộc hàng ngày.',
            atoms: [
                { el: 'Na', x: -1.2, y: 0, z: 0 },
                { el: 'Cl', x: 1.2, y: 0, z: 0 }
            ],
            bonds: [ { a: 0, b: 1, type: 1 } ]
        },

        // --- NHÓM 3: HỢP CHẤT HỮU CƠ KHTN 9 ---
        {
            id: 'ch4', cat: 'organic', name: 'Methane (Metan)', formula: 'CH₄', iupac: 'Methane',
            bondType: 'Cộng hóa trị không phân cực (4 liên kết đơn C-H)', angle: '109.5°', geometry: 'Tứ diện đều (Tetrahedral)', mass: '16.04 g/mol',
            note: 'Thành phần chính của khí thiên nhiên và khí bùn ao (biogas).',
            atoms: [
                { el: 'C', x: 0, y: 0, z: 0 },
                { el: 'H', x: 0, y: 1.35, z: 0 },
                { el: 'H', x: -1.25, y: -0.45, z: 0 },
                { el: 'H', x: 0.62, y: -0.45, z: 1.08 },
                { el: 'H', x: 0.62, y: -0.45, z: -1.08 }
            ],
            bonds: [ { a: 0, b: 1, type: 1 }, { a: 0, b: 2, type: 1 }, { a: 0, b: 3, type: 1 }, { a: 0, b: 4, type: 1 } ]
        },
        {
            id: 'c2h4', cat: 'organic', name: 'Ethylene (Etilen)', formula: 'C₂H₄', iupac: 'Ethene',
            bondType: 'Có 1 liên kết đôi C=C và 4 liên kết đơn C-H', angle: '120°', geometry: 'Mặt phẳng (Planar)', mass: '28.05 g/mol',
            note: 'Làm quả mau chín, làm mất màu dung dịch Brom, monome trùng hợp sản xuất nhựa PE.',
            atoms: [
                { el: 'C', x: -0.75, y: 0, z: 0 },
                { el: 'C', x: 0.75, y: 0, z: 0 },
                { el: 'H', x: -1.45, y: 0.9, z: 0 },
                { el: 'H', x: -1.45, y: -0.9, z: 0 },
                { el: 'H', x: 1.45, y: 0.9, z: 0 },
                { el: 'H', x: 1.45, y: -0.9, z: 0 }
            ],
            bonds: [
                { a: 0, b: 1, type: 2 },
                { a: 0, b: 2, type: 1 }, { a: 0, b: 3, type: 1 },
                { a: 1, b: 4, type: 1 }, { a: 1, b: 5, type: 1 }
            ]
        },
        {
            id: 'c2h2', cat: 'organic', name: 'Acetylene (Axetilen)', formula: 'C₂H₂', iupac: 'Ethyne',
            bondType: 'Có 1 liên kết ba C≡C và 2 liên kết đơn C-H', angle: '180°', geometry: 'Đường thẳng (Linear)', mass: '26.04 g/mol',
            note: 'Dùng trong đèn xì oxy-axetilen để hàn cắt kim loại do nhiệt độ ngọn lửa rất cao.',
            atoms: [
                { el: 'H', x: -1.9, y: 0, z: 0 },
                { el: 'C', x: -0.65, y: 0, z: 0 },
                { el: 'C', x: 0.65, y: 0, z: 0 },
                { el: 'H', x: 1.9, y: 0, z: 0 }
            ],
            bonds: [
                { a: 0, b: 1, type: 1 },
                { a: 1, b: 2, type: 3 },
                { a: 2, b: 3, type: 1 }
            ]
        },
        {
            id: 'c2h5oh', cat: 'organic', name: 'Ethanol (Cồn etylic)', formula: 'C₂H₅OH', iupac: 'Ethanol',
            bondType: 'Cộng hóa trị, chứa nhóm chức hiđroxyl (-OH)', angle: '~109.5°', geometry: 'Mạch hở uốn khúc', mass: '46.07 g/mol',
            note: 'Thành phần của bia rượu, cồn y tế sát trùng, nhiên liệu sinh học E5.',
            atoms: [
                { el: 'C', x: -1.1, y: 0, z: 0 },      // C1
                { el: 'C', x: 0.2, y: 0, z: 0 },       // C2
                { el: 'O', x: 1.3, y: -0.7, z: 0 },    // O
                { el: 'H', x: -1.4, y: 0.9, z: 0 },    // C1-H
                { el: 'H', x: -1.4, y: -0.5, z: 0.8 }, // C1-H
                { el: 'H', x: -1.4, y: -0.5, z: -0.8 },// C1-H
                { el: 'H', x: 0.5, y: 0.8, z: 0.5 },   // C2-H
                { el: 'H', x: 0.5, y: 0.8, z: -0.5 },  // C2-H
                { el: 'H', x: 2.0, y: -0.3, z: 0 }     // O-H
            ],
            bonds: [
                { a: 0, b: 1, type: 1 }, { a: 1, b: 2, type: 1 },
                { a: 0, b: 3, type: 1 }, { a: 0, b: 4, type: 1 }, { a: 0, b: 5, type: 1 },
                { a: 1, b: 6, type: 1 }, { a: 1, b: 7, type: 1 },
                { a: 2, b: 8, type: 1 }
            ]
        }
    ];

    let currentMolecule = molecules[4]; // Default: Nước H2O
    let autoRotate = true;
    let showLabels = true;
    let angleX = 0.2, angleY = 0.3;
    let zoom = 65;

    // --- 4. KHỞI TẠO NÚT CHỌN PHÂN TỬ VÀ BỘ LỌC ---
    const selector = document.getElementById('mol-selector');
    const catBtns = document.querySelectorAll('.mol-cat-btn');

    function renderMoleculeButtons(category = 'all') {
        selector.innerHTML = '';
        const filtered = category === 'all' ? molecules : molecules.filter(m => m.cat === category);
        
        filtered.forEach((mol) => {
            const btn = document.createElement('button');
            btn.className = `mol-btn ${mol.id === currentMolecule.id ? 'active' : ''}`;
            btn.innerHTML = `<div class="mol-btn-title">${mol.name}</div><div class="mol-btn-formula">${mol.formula}</div>`;
            btn.onclick = () => selectMolecule(mol, btn);
            selector.appendChild(btn);
        });
    }

    catBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            catBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderMoleculeButtons(btn.dataset.cat);
        });
    });

    renderMoleculeButtons('all');

    const infoPanel = document.getElementById('mol-info');
    function selectMolecule(mol, btn) {
        currentMolecule = mol;
        document.querySelectorAll('.mol-btn').forEach(b => {
            if (b.innerText.includes(mol.formula)) b.classList.add('active');
            else b.classList.remove('active');
        });
        
        angleX = 0.2; angleY = 0.3;
        
        infoPanel.innerHTML = `
            <div class="info-row">
                <div class="info-label">Tên phân tử</div>
                <div class="info-value" style="color:var(--primary); font-size:1.2rem;">${mol.name} (${mol.formula})</div>
            </div>
            <div class="info-row">
                <div class="info-label">Tên IUPAC</div>
                <div class="info-value">${mol.iupac}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Loại liên kết</div>
                <div class="info-value">${mol.bondType}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Góc liên kết & Hình học</div>
                <div class="info-value">${mol.angle} • ${mol.geometry}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Khối lượng phân tử</div>
                <div class="info-value">${mol.mass}</div>
            </div>
            <div class="info-row" style="border:none;">
                <div class="info-label">Ứng dụng & Đặc điểm KHTN</div>
                <div class="info-note">💡 ${mol.note}</div>
            </div>
        `;
    }
    
    selectMolecule(currentMolecule);

    // --- 5. CANVAS 3D RENDERING ---
    const canvas = document.getElementById('mol-canvas');
    const ctx = canvas.getContext('2d');

    function updateCanvasSize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        if (rect.width > 0) {
            canvas.width = rect.width;
            canvas.height = rect.height > 100 ? rect.height : 420;
        }
    }
    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();

    function draw() {
        // Tự động kiểm tra và cập nhật kích thước canvas nếu trước đó bị ẩn (tab switch)
        if (canvas.width === 0 || canvas.width !== canvas.parentElement.clientWidth) {
            updateCanvasSize();
        }

        if (canvas.width > 0 && canvas.height > 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            if (autoRotate) {
                angleY += 0.01;
                angleX += 0.004;
            }

            const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
            const cosY = Math.cos(angleY), sinY = Math.sin(angleY);

            // Tính tọa độ chiếu 3D -> 2D
            const projectedAtoms = currentMolecule.atoms.map((atom, idx) => {
                // Xoay Y
                let x1 = atom.x * cosY - atom.z * sinY;
                let z1 = atom.x * sinY + atom.z * cosY;
                // Xoay X
                let y2 = atom.y * cosX - z1 * sinX;
                let z2 = atom.y * sinX + z1 * cosX;
                
                const scale = 350 / (350 + z2 * zoom * 0.12);
                return {
                    idx: idx,
                    el: atom.el,
                    x3d: x1, y3d: y2, z3d: z2,
                    scale: scale,
                    screenX: centerX + x1 * zoom,
                    screenY: centerY + y2 * zoom
                };
            });

            // Sắp xếp nguyên tử theo chiều sâu Z (vẽ từ xa đến gần)
            projectedAtoms.sort((a, b) => b.z3d - a.z3d);

            // Vẽ các liên kết hóa học
            currentMolecule.bonds.forEach(bond => {
                const atomA = projectedAtoms.find(a => a.idx === bond.a);
                const atomB = projectedAtoms.find(a => a.idx === bond.b);
                if (!atomA || !atomB) return;

                const dx = atomB.screenX - atomA.screenX;
                const dy = atomB.screenY - atomA.screenY;
                const dist = Math.sqrt(dx*dx + dy*dy) || 1;
                const nx = -dy / dist;
                const ny = dx / dist;

                ctx.strokeStyle = 'rgba(226, 232, 240, 0.7)';
                ctx.lineCap = 'round';

                if (bond.type === 3) {
                    // Liên kết ba (3 vạch song song)
                    const offset = 6 * Math.min(atomA.scale, atomB.scale);
                    ctx.lineWidth = 3;
                    // Vạch giữa
                    ctx.beginPath(); ctx.moveTo(atomA.screenX, atomA.screenY); ctx.lineTo(atomB.screenX, atomB.screenY); ctx.stroke();
                    // Vạch 1
                    ctx.beginPath(); ctx.moveTo(atomA.screenX + nx*offset, atomA.screenY + ny*offset); ctx.lineTo(atomB.screenX + nx*offset, atomB.screenY + ny*offset); ctx.stroke();
                    // Vạch 2
                    ctx.beginPath(); ctx.moveTo(atomA.screenX - nx*offset, atomA.screenY - ny*offset); ctx.lineTo(atomB.screenX - nx*offset, atomB.screenY - ny*offset); ctx.stroke();
                } else if (bond.type === 2) {
                    // Liên kết đôi (2 vạch song song)
                    const offset = 4.5 * Math.min(atomA.scale, atomB.scale);
                    ctx.lineWidth = 3.5;
                    ctx.beginPath(); ctx.moveTo(atomA.screenX + nx*offset, atomA.screenY + ny*offset); ctx.lineTo(atomB.screenX + nx*offset, atomB.screenY + ny*offset); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(atomA.screenX - nx*offset, atomA.screenY - ny*offset); ctx.lineTo(atomB.screenX - nx*offset, atomB.screenY - ny*offset); ctx.stroke();
                } else {
                    // Liên kết đơn
                    ctx.lineWidth = 5 * Math.min(atomA.scale, atomB.scale);
                    ctx.beginPath();
                    ctx.moveTo(atomA.screenX, atomA.screenY);
                    ctx.lineTo(atomB.screenX, atomB.screenY);
                    ctx.stroke();
                }
            });

            // Vẽ các nguyên tử (Sphere với hiệu ứng phản quang 3D)
            projectedAtoms.forEach(atom => {
                const props = elements[atom.el] || { color: '#888', radius: 15, outline: '#444', text: '#fff' };
                const radius = props.radius * atom.scale * (zoom / 45);

                const grad = ctx.createRadialGradient(
                    atom.screenX - radius * 0.35, atom.screenY - radius * 0.35, radius * 0.1,
                    atom.screenX, atom.screenY, radius
                );
                grad.addColorStop(0, '#FFFFFF');
                grad.addColorStop(0.25, props.color);
                grad.addColorStop(1, props.outline);

                ctx.beginPath();
                ctx.arc(atom.screenX, atom.screenY, Math.max(radius, 2), 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();
                
                ctx.strokeStyle = props.outline;
                ctx.lineWidth = 1.2;
                ctx.stroke();
                
                // Hiển thị ký hiệu nguyên tố hóa học
                if (showLabels && radius > 8) {
                    ctx.fillStyle = props.text;
                    ctx.font = `bold ${Math.round(radius * 0.85)}px 'Plus Jakarta Sans', sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.shadowColor = 'rgba(0,0,0,0.4)';
                    ctx.shadowBlur = 3;
                    ctx.fillText(atom.el, atom.screenX, atom.screenY);
                    ctx.shadowBlur = 0;
                }
            });
        }

        requestAnimationFrame(draw);
    }
    draw();

    // --- 6. TƯƠNG TÁC CHUỘT VÀ CẢM ỨNG ---
    let isDragging = false;
    let lastX = 0, lastY = 0;

    const startDrag = (x, y) => {
        isDragging = true;
        autoRotate = false;
        document.getElementById('btn-auto-rotate').classList.remove('active');
        lastX = x;
        lastY = y;
    };

    const doDrag = (x, y) => {
        if (!isDragging) return;
        const dx = x - lastX;
        const dy = y - lastY;
        angleY += dx * 0.012;
        angleX += dy * 0.012;
        lastX = x;
        lastY = y;
    };

    const stopDrag = () => { isDragging = false; };

    canvas.addEventListener('mousedown', e => startDrag(e.clientX, e.clientY));
    canvas.addEventListener('mousemove', e => doDrag(e.clientX, e.clientY));
    window.addEventListener('mouseup', stopDrag);

    canvas.addEventListener('touchstart', e => {
        if (e.touches.length > 0) {
            startDrag(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });
    canvas.addEventListener('touchmove', e => {
        if (e.touches.length > 0) {
            doDrag(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });
    window.addEventListener('touchend', stopDrag);

    // Zoom bằng cuộn chuột
    canvas.addEventListener('wheel', e => {
        e.preventDefault();
        zoom += e.deltaY > 0 ? -4 : 4;
        if (zoom < 30) zoom = 30;
        if (zoom > 140) zoom = 140;
    }, { passive: false });

    // Nút toolbar
    const btnAutoRotate = document.getElementById('btn-auto-rotate');
    btnAutoRotate.onclick = () => {
        autoRotate = !autoRotate;
        btnAutoRotate.classList.toggle('active', autoRotate);
    };

    const btnToggleLabels = document.getElementById('btn-toggle-labels');
    btnToggleLabels.onclick = () => {
        showLabels = !showLabels;
        btnToggleLabels.classList.toggle('active', showLabels);
    };

    document.getElementById('btn-zoom-in').onclick = () => {
        if (zoom < 140) zoom += 10;
    };
    document.getElementById('btn-zoom-out').onclick = () => {
        if (zoom > 30) zoom -= 10;
    };

    document.getElementById('btn-reset').onclick = () => {
        angleX = 0.2;
        angleY = 0.3;
        zoom = 65;
        autoRotate = true;
        btnAutoRotate.classList.add('active');
    };
});
