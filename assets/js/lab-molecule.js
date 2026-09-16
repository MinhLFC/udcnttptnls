document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('experiment-molecule');
    if (!container) return;

    // --- 1. TẠO GIAO DIỆN (UI) ---
    container.innerHTML = `
        <div class="molecule-lab" style="display: flex; flex-direction: column; gap: 20px; font-family: 'Be Vietnam Pro', 'Plus Jakarta Sans', sans-serif;">
            <style>
                .molecule-lab { --primary: #003c71; --accent: #cf2e2e; --bg: #f9f9f9; --text: #333; --border: #ddd; }
                [data-theme="dark"] .molecule-lab { --bg: #222; --text: #f0f0f0; --border: #444; }
                .molecule-controls { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px; margin-bottom: 20px; }
                .mol-btn { padding: 10px; border: 1px solid var(--border); border-radius: 8px; background: var(--bg); color: var(--text); cursor: pointer; transition: 0.3s; }
                .mol-btn:hover { border-color: var(--primary); }
                .mol-btn.active { background: var(--primary); color: white; border-color: var(--primary); }
                .mol-btn-title { font-weight: bold; font-size: 1.1em; }
                .mol-btn-formula { font-size: 0.9em; opacity: 0.8; }
                
                .molecule-main { display: flex; flex-wrap: wrap; gap: 20px; }
                .molecule-viewer { flex: 1; min-width: 300px; position: relative; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; background: #000; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .molecule-canvas { display: block; width: 100%; height: 400px; cursor: grab; }
                .molecule-canvas:active { cursor: grabbing; }
                
                .molecule-info { flex: 0 0 300px; padding: 20px; background: var(--bg); border: 1px solid var(--border); border-radius: 12px; color: var(--text); }
                .info-row { margin-bottom: 12px; border-bottom: 1px solid var(--border); padding-bottom: 8px; }
                .info-label { font-weight: bold; font-size: 0.9em; opacity: 0.7; text-transform: uppercase; }
                .info-value { font-size: 1.1em; margin-top: 4px; }
                
                .toolbar { position: absolute; bottom: 10px; left: 10px; display: flex; gap: 10px; }
                .tool-btn { padding: 8px 15px; border-radius: 6px; border: none; background: rgba(255,255,255,0.8); color: #333; cursor: pointer; font-weight: bold; }
                .tool-btn:hover { background: white; }
                .tool-btn.active { background: var(--primary); color: white; }
            </style>
            
            <div class="molecule-controls" id="mol-selector"></div>
            
            <div class="molecule-main">
                <div class="molecule-viewer">
                    <canvas id="mol-canvas" class="molecule-canvas"></canvas>
                    <div class="toolbar">
                        <button id="btn-auto-rotate" class="tool-btn active">Tự động xoay</button>
                        <button id="btn-reset" class="tool-btn">Mặc định</button>
                    </div>
                </div>
                
                <div class="molecule-info" id="mol-info">
                    <!-- Sẽ được điền bằng JS -->
                </div>
            </div>
        </div>
    `;

    // --- 2. ĐỊNH NGHĨA DỮ LIỆU PHÂN TỬ ---
    const elements = {
        H:  { color: '#FFFFFF', radius: 10,  outline: '#CCCCCC' },
        C:  { color: '#333333', radius: 15,  outline: '#111111' },
        N:  { color: '#3050F8', radius: 14,  outline: '#1030C8' },
        O:  { color: '#FF0D0D', radius: 13,  outline: '#C00000' },
        Cl: { color: '#1FF01F', radius: 18,  outline: '#00C000' },
        Na: { color: '#AB5CF2', radius: 20,  outline: '#8B3CC2' }
    };

    const molecules = [
        {
            id: 'water', name: 'Nước', formula: 'H₂O', iupac: 'Oxidane',
            bondType: 'Cộng hóa trị phân cực', angle: '104.5°', geometry: 'Góc (Bent)', mass: '18.015 g/mol',
            atoms: [
                { el: 'O', x: 0, y: 0.5, z: 0 },
                { el: 'H', x: -1.2, y: -0.5, z: 0 },
                { el: 'H', x: 1.2, y: -0.5, z: 0 }
            ],
            bonds: [ { a: 0, b: 1, type: 1 }, { a: 0, b: 2, type: 1 } ]
        },
        {
            id: 'co2', name: 'Carbon Dioxide', formula: 'CO₂', iupac: 'Carbon dioxide',
            bondType: 'Cộng hóa trị phân cực', angle: '180°', geometry: 'Đường thẳng (Linear)', mass: '44.01 g/mol',
            atoms: [
                { el: 'C', x: 0, y: 0, z: 0 },
                { el: 'O', x: -2, y: 0, z: 0 },
                { el: 'O', x: 2, y: 0, z: 0 }
            ],
            bonds: [ { a: 0, b: 1, type: 2 }, { a: 0, b: 2, type: 2 } ]
        },
        {
            id: 'ch4', name: 'Methane', formula: 'CH₄', iupac: 'Methane',
            bondType: 'Cộng hóa trị không phân cực', angle: '109.5°', geometry: 'Tứ diện (Tetrahedral)', mass: '16.04 g/mol',
            atoms: [
                { el: 'C', x: 0, y: 0, z: 0 },
                { el: 'H', x: 0, y: 1.5, z: 0 },
                { el: 'H', x: -1.4, y: -0.5, z: 0 },
                { el: 'H', x: 0.7, y: -0.5, z: 1.2 },
                { el: 'H', x: 0.7, y: -0.5, z: -1.2 }
            ],
            bonds: [ { a: 0, b: 1, type: 1 }, { a: 0, b: 2, type: 1 }, { a: 0, b: 3, type: 1 }, { a: 0, b: 4, type: 1 } ]
        },
        {
            id: 'nh3', name: 'Ammonia', formula: 'NH₃', iupac: 'Azane',
            bondType: 'Cộng hóa trị phân cực', angle: '107°', geometry: 'Chóp tam giác (Trigonal pyramidal)', mass: '17.031 g/mol',
            atoms: [
                { el: 'N', x: 0, y: 0.5, z: 0 },
                { el: 'H', x: 0, y: -0.5, z: 1.2 },
                { el: 'H', x: 1.04, y: -0.5, z: -0.6 },
                { el: 'H', x: -1.04, y: -0.5, z: -0.6 }
            ],
            bonds: [ { a: 0, b: 1, type: 1 }, { a: 0, b: 2, type: 1 }, { a: 0, b: 3, type: 1 } ]
        },
        {
            id: 'c2h5oh', name: 'Ethanol', formula: 'C₂H₅OH', iupac: 'Ethanol',
            bondType: 'Cộng hóa trị', angle: '~109.5°', geometry: 'Chuỗi (Chain)', mass: '46.07 g/mol',
            atoms: [
                { el: 'C', x: -1.2, y: 0, z: 0 }, // C1
                { el: 'C', x: 0.2, y: 0, z: 0 },  // C2
                { el: 'O', x: 1.5, y: -0.8, z: 0 }, // O
                { el: 'H', x: -1.5, y: 1, z: 0 },   // C1-H
                { el: 'H', x: -1.5, y: -0.5, z: 0.86 }, // C1-H
                { el: 'H', x: -1.5, y: -0.5, z: -0.86 }, // C1-H
                { el: 'H', x: 0.5, y: 0.86, z: 0.5 }, // C2-H
                { el: 'H', x: 0.5, y: 0.86, z: -0.5 }, // C2-H
                { el: 'H', x: 2.2, y: -0.3, z: 0 }  // O-H
            ],
            bonds: [
                { a: 0, b: 1, type: 1 }, { a: 1, b: 2, type: 1 }, // C-C, C-O
                { a: 0, b: 3, type: 1 }, { a: 0, b: 4, type: 1 }, { a: 0, b: 5, type: 1 }, // C1-H
                { a: 1, b: 6, type: 1 }, { a: 1, b: 7, type: 1 }, // C2-H
                { a: 2, b: 8, type: 1 } // O-H
            ]
        },
        {
            id: 'c6h6', name: 'Benzene', formula: 'C₆H₆', iupac: 'Benzene',
            bondType: 'Cộng hóa trị (Liên hợp)', angle: '120°', geometry: 'Lục giác phẳng (Planar hexagonal)', mass: '78.11 g/mol',
            atoms: [
                { el: 'C', x: 0, y: 1.5, z: 0 }, { el: 'C', x: 1.3, y: 0.75, z: 0 },
                { el: 'C', x: 1.3, y: -0.75, z: 0 }, { el: 'C', x: 0, y: -1.5, z: 0 },
                { el: 'C', x: -1.3, y: -0.75, z: 0 }, { el: 'C', x: -1.3, y: 0.75, z: 0 },
                { el: 'H', x: 0, y: 2.5, z: 0 }, { el: 'H', x: 2.16, y: 1.25, z: 0 },
                { el: 'H', x: 2.16, y: -1.25, z: 0 }, { el: 'H', x: 0, y: -2.5, z: 0 },
                { el: 'H', x: -2.16, y: -1.25, z: 0 }, { el: 'H', x: -2.16, y: 1.25, z: 0 }
            ],
            bonds: [
                { a: 0, b: 1, type: 1.5 }, { a: 1, b: 2, type: 1.5 }, { a: 2, b: 3, type: 1.5 },
                { a: 3, b: 4, type: 1.5 }, { a: 4, b: 5, type: 1.5 }, { a: 5, b: 0, type: 1.5 },
                { a: 0, b: 6, type: 1 }, { a: 1, b: 7, type: 1 }, { a: 2, b: 8, type: 1 },
                { a: 3, b: 9, type: 1 }, { a: 4, b: 10, type: 1 }, { a: 5, b: 11, type: 1 }
            ]
        },
        {
            id: 'nacl', name: 'Sodium Chloride', formula: 'NaCl', iupac: 'Sodium chloride',
            bondType: 'Ion', angle: 'N/A', geometry: 'Mạng tinh thể lập phương', mass: '58.44 g/mol',
            atoms: [
                { el: 'Na', x: -1.5, y: 0, z: 0 },
                { el: 'Cl', x: 1.5, y: 0, z: 0 }
            ],
            bonds: [ { a: 0, b: 1, type: 1 } ] // Represenative bond
        },
        {
            id: 'hcl', name: 'Hydrochloric Acid', formula: 'HCl', iupac: 'Hydrogen chloride',
            bondType: 'Cộng hóa trị phân cực', angle: '180°', geometry: 'Đường thẳng (Linear)', mass: '36.46 g/mol',
            atoms: [
                { el: 'H', x: -1.5, y: 0, z: 0 },
                { el: 'Cl', x: 0.5, y: 0, z: 0 }
            ],
            bonds: [ { a: 0, b: 1, type: 1 } ]
        }
    ];

    let currentMolecule = molecules[0];
    let autoRotate = true;
    let angleX = 0, angleY = 0;
    let zoom = 60; // Scale factor cho 3D -> 2D
    
    // Khởi tạo các nút chọn phân tử
    const selector = document.getElementById('mol-selector');
    molecules.forEach((mol, index) => {
        const btn = document.createElement('button');
        btn.className = `mol-btn ${index === 0 ? 'active' : ''}`;
        btn.innerHTML = `<div class="mol-btn-title">${mol.name}</div><div class="mol-btn-formula">${mol.formula}</div>`;
        btn.onclick = () => selectMolecule(mol, btn);
        selector.appendChild(btn);
    });

    const infoPanel = document.getElementById('mol-info');
    function selectMolecule(mol, btn) {
        currentMolecule = mol;
        document.querySelectorAll('.mol-btn').forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');
        
        // Reset góc quay
        angleX = 0; angleY = 0;
        
        // Cập nhật thông tin
        infoPanel.innerHTML = `
            <div class="info-row"><div class="info-label">Tên phân tử</div><div class="info-value">${mol.name} (${mol.formula})</div></div>
            <div class="info-row"><div class="info-label">Tên IUPAC</div><div class="info-value">${mol.iupac}</div></div>
            <div class="info-row"><div class="info-label">Loại liên kết</div><div class="info-value">${mol.bondType}</div></div>
            <div class="info-row"><div class="info-label">Góc liên kết</div><div class="info-value">${mol.angle}</div></div>
            <div class="info-row"><div class="info-label">Hình học phân tử</div><div class="info-value">${mol.geometry}</div></div>
            <div class="info-row" style="border:none;"><div class="info-label">Khối lượng mol</div><div class="info-value">${mol.mass}</div></div>
        `;
    }
    
    // Gọi chọn phân tử đầu tiên
    selectMolecule(currentMolecule, selector.firstChild);

    // --- 3. RENDERING 3D VỚI CANVAS ---
    const canvas = document.getElementById('mol-canvas');
    const ctx = canvas.getContext('2d');
    
    // Cập nhật kích thước canvas
    function resizeCanvas() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height || 400;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Vòng lặp vẽ
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        if (autoRotate) {
            angleY += 0.01;
            angleX += 0.005;
        }

        // Ma trận xoay cơ bản
        const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
        const cosY = Math.cos(angleY), sinY = Math.sin(angleY);

        // Tính toán tọa độ 3D sau khi xoay cho các nguyên tử
        const projectedAtoms = currentMolecule.atoms.map((atom, idx) => {
            // Quay quanh trục Y
            let x1 = atom.x * cosY - atom.z * sinY;
            let z1 = atom.x * sinY + atom.z * cosY;
            // Quay quanh trục X
            let y2 = atom.y * cosX - z1 * sinX;
            let z2 = atom.y * sinX + z1 * cosX;
            
            return {
                idx: idx,
                el: atom.el,
                x3d: x1, y3d: y2, z3d: z2,
                // Chiếu phối cảnh đơn giản (tùy thuộc vào z2 để tạo chiều sâu)
                scale: 300 / (300 + z2 * zoom * 0.1),
                screenX: centerX + x1 * zoom,
                screenY: centerY + y2 * zoom
            };
        });

        // Sắp xếp các nguyên tử theo z3d để vẽ cái ở xa trước (Z-sorting)
        projectedAtoms.sort((a, b) => b.z3d - a.z3d);

        // Vẽ liên kết (bonds)
        currentMolecule.bonds.forEach(bond => {
            const atomA = projectedAtoms.find(a => a.idx === bond.a);
            const atomB = projectedAtoms.find(a => a.idx === bond.b);
            if (!atomA || !atomB) return;

            ctx.beginPath();
            if (bond.type === 2) {
                // Liên kết đôi
                const dx = atomB.screenX - atomA.screenX;
                const dy = atomB.screenY - atomA.screenY;
                const dist = Math.sqrt(dx*dx + dy*dy);
                const nx = -dy / dist * 5; // Độ dời pháp tuyến
                const ny = dx / dist * 5;
                
                ctx.moveTo(atomA.screenX + nx, atomA.screenY + ny);
                ctx.lineTo(atomB.screenX + nx, atomB.screenY + ny);
                ctx.moveTo(atomA.screenX - nx, atomA.screenY - ny);
                ctx.lineTo(atomB.screenX - nx, atomB.screenY - ny);
            } else if (bond.type === 1.5) {
                // Vòng benzen
                ctx.moveTo(atomA.screenX, atomA.screenY);
                ctx.lineTo(atomB.screenX, atomB.screenY);
            } else {
                // Liên kết đơn
                ctx.moveTo(atomA.screenX, atomA.screenY);
                ctx.lineTo(atomB.screenX, atomB.screenY);
            }
            
            ctx.strokeStyle = 'rgba(200, 200, 200, 0.6)';
            ctx.lineWidth = 4 * Math.min(atomA.scale, atomB.scale);
            ctx.lineCap = 'round';
            ctx.stroke();
            
            // Nếu là vòng benzen, vẽ thêm gạch rời
            if (bond.type === 1.5) {
                 const dx = atomB.screenX - atomA.screenX;
                 const dy = atomB.screenY - atomA.screenY;
                 const dist = Math.sqrt(dx*dx + dy*dy);
                 const nx = -dy / dist * 6; // Độ dời hướng vào trong vòng
                 const ny = dx / dist * 6;
                 
                 ctx.beginPath();
                 // Chỉ vẽ một phần đoạn giữa để tạo nét đứt
                 ctx.moveTo(atomA.screenX + dx*0.2 + nx, atomA.screenY + dy*0.2 + ny);
                 ctx.lineTo(atomA.screenX + dx*0.8 + nx, atomA.screenY + dy*0.8 + ny);
                 ctx.strokeStyle = 'rgba(200, 200, 200, 0.4)';
                 ctx.lineWidth = 2 * Math.min(atomA.scale, atomB.scale);
                 ctx.stroke();
            }
        });

        // Vẽ nguyên tử (atoms)
        projectedAtoms.forEach(atom => {
            const props = elements[atom.el];
            const radius = props.radius * atom.scale * (zoom / 40);

            // Gradient tạo hiệu ứng 3D (phản quang góc trên bên trái)
            const grad = ctx.createRadialGradient(
                atom.screenX - radius * 0.3, atom.screenY - radius * 0.3, radius * 0.1,
                atom.screenX, atom.screenY, radius
            );
            grad.addColorStop(0, '#FFFFFF'); // Sáng
            grad.addColorStop(0.3, props.color); // Màu gốc
            grad.addColorStop(1, props.outline); // Tối dần ở viền

            ctx.beginPath();
            ctx.arc(atom.screenX, atom.screenY, radius, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
            
            ctx.strokeStyle = props.outline;
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Vẽ ký hiệu nguyên tử
            ctx.fillStyle = (atom.el === 'H' || atom.el === 'C') ? '#000' : '#FFF';
            if (atom.el === 'C') ctx.fillStyle = '#FFF';
            ctx.font = `bold ${radius * 0.8}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            // ctx.fillText(atom.el, atom.screenX, atom.screenY); // Bỏ comment nếu muốn hiện ký hiệu
        });

        requestAnimationFrame(draw);
    }
    draw();

    // --- 4. TƯƠNG TÁC (KÉO CHUỘT, CUỘN, CHẠM) ---
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
        
        angleY += dx * 0.01;
        angleX += dy * 0.01;
        
        lastX = x;
        lastY = y;
    };

    const stopDrag = () => { isDragging = false; };

    // Chuột
    canvas.addEventListener('mousedown', e => startDrag(e.clientX, e.clientY));
    canvas.addEventListener('mousemove', e => doDrag(e.clientX, e.clientY));
    window.addEventListener('mouseup', stopDrag);

    // Cảm ứng (Mobile)
    canvas.addEventListener('touchstart', e => {
        if (e.touches.length > 0) {
            e.preventDefault();
            startDrag(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, {passive: false});
    canvas.addEventListener('touchmove', e => {
        if (e.touches.length > 0) {
            e.preventDefault();
            doDrag(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, {passive: false});
    window.addEventListener('touchend', stopDrag);

    // Zoom bằng lăn chuột
    canvas.addEventListener('wheel', e => {
        e.preventDefault();
        zoom += e.deltaY > 0 ? -5 : 5;
        if (zoom < 20) zoom = 20;
        if (zoom > 150) zoom = 150;
    }, {passive: false});

    // Các nút công cụ
    const btnAutoRotate = document.getElementById('btn-auto-rotate');
    btnAutoRotate.onclick = () => {
        autoRotate = !autoRotate;
        btnAutoRotate.classList.toggle('active', autoRotate);
    };

    document.getElementById('btn-reset').onclick = () => {
        angleX = 0;
        angleY = 0;
        zoom = 60;
    };
});
