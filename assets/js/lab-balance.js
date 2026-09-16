/**
 * LAB-BALANCE.JS - TRÒ CHƠI CÂN BẰNG PHƯƠNG TRÌNH HÓA HỌC
 * Website: Đỗ Văn Nhật Minh - ĐHSP TP.HCM (HCMUE)
 * Nội dung bám sát Chương trình GDPT 2018 môn Khoa Học Tự Nhiên Cấp 2 (Lớp 7, 8, 9)
 */

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('experiment-balance');
    if (!container) return;

    // --- 1. CSS GIAO DIỆN TRÒ CHƠI ---
    const style = document.createElement('style');
    style.textContent = `
        .balance-game { font-family: 'Be Vietnam Pro', 'Plus Jakarta Sans', sans-serif; max-width: 860px; margin: 0 auto; padding: 24px; background: var(--bg-surface, #fff); border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); color: var(--text-main, #333); border: 1px solid var(--border-color, #e2e8f0); }
        [data-theme="dark"] .balance-game { background: #1e293b; color: #f1f5f9; border-color: #334155; }
        
        .bg-level-picker { display: flex; gap: 8px; justify-content: center; margin-bottom: 18px; flex-wrap: wrap; }
        .bg-picker-btn { padding: 7px 16px; border-radius: 20px; border: 1.5px solid var(--border-color, #cbd5e1); background: transparent; color: inherit; font-size: 0.88rem; font-weight: 600; cursor: pointer; transition: 0.25s; }
        .bg-picker-btn.active { background: var(--primary, #003c71); color: #fff; border-color: var(--primary, #003c71); box-shadow: 0 3px 10px rgba(0,60,113,0.25); }

        .bg-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 14px; border-bottom: 2px solid var(--border-color, #e2e8f0); flex-wrap: wrap; gap: 10px; }
        .bg-title-area h3 { margin: 0 0 4px 0; font-size: 1.3rem; color: var(--primary, #003c71); }
        [data-theme="dark"] .bg-title-area h3 { color: #60a5fa; }
        .bg-desc-badge { font-size: 0.82rem; background: rgba(0,60,113,0.1); color: var(--primary, #003c71); padding: 3px 10px; border-radius: 12px; font-weight: 600; }
        [data-theme="dark"] .bg-desc-badge { background: rgba(96,165,250,0.2); color: #93c5fd; }

        .bg-stats { display: flex; gap: 18px; font-weight: bold; font-size: 1.05rem; align-items: center; }
        .bg-timer { color: var(--accent, #cf2e2e); font-size: 1.25rem; font-weight: 800; }
        .bg-score-box { background: #ecfdf5; color: #059669; padding: 4px 12px; border-radius: 20px; border: 1px solid #a7f3d0; }
        [data-theme="dark"] .bg-score-box { background: #064e3b; color: #6ee7b7; border-color: #047857; }

        .bg-equation-container { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 12px; margin: 25px 0; font-size: 1.4rem; padding: 25px; background: var(--bg-surface-soft, #f8fafc); border-radius: 12px; border: 1.5px dashed var(--border-color, #cbd5e1); }
        [data-theme="dark"] .bg-equation-container { background: #0f172a; border-color: #334155; }
        
        .bg-react-note { text-align: center; color: var(--text-light, #64748b); font-size: 0.95rem; margin-top: -10px; margin-bottom: 20px; font-style: italic; }

        .bg-molecule { display: flex; align-items: center; gap: 6px; }
        .bg-coeff-input { width: 48px; height: 44px; text-align: center; font-size: 1.25rem; font-weight: 800; border: 2px solid var(--border-color, #94a3b8); border-radius: 8px; background: var(--bg-surface, #fff); color: var(--primary, #003c71); outline: none; transition: 0.2s; }
        [data-theme="dark"] .bg-coeff-input { background: #1e293b; color: #60a5fa; border-color: #475569; }
        .bg-coeff-input:focus { border-color: var(--primary, #003c71); box-shadow: 0 0 0 3px rgba(0,60,113,0.15); }
        .bg-arrow { font-weight: 800; color: var(--accent, #cf2e2e); margin: 0 6px; }
        
        .bg-controls { display: flex; justify-content: center; gap: 14px; margin-top: 22px; flex-wrap: wrap; }
        .bg-btn { padding: 10px 24px; font-size: 1rem; font-weight: 700; border: none; border-radius: 25px; cursor: pointer; transition: all 0.25s ease; display: inline-flex; align-items: center; gap: 6px; }
        .bg-btn-primary { background: var(--primary-gradient, linear-gradient(135deg, #003c71 0%, #0b589c 100%)); color: white; box-shadow: 0 4px 12px rgba(0,60,113,0.25); }
        .bg-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,60,113,0.35); }
        .bg-btn-hint { background: #f59e0b; color: white; box-shadow: 0 4px 12px rgba(245,158,11,0.25); }
        .bg-btn-hint:hover { background: #d97706; transform: translateY(-2px); }

        .bg-atom-count { display: flex; justify-content: space-around; margin-top: 20px; padding: 16px; border-radius: 12px; background: #fee2e2; border: 1px solid #fca5a5; display: none; }
        [data-theme="dark"] .bg-atom-count { background: #450a0a; border-color: #7f1d1d; }
        .bg-atom-col { text-align: center; font-size: 0.92rem; }
        .bg-atom-col strong { display: block; margin-bottom: 8px; font-size: 1rem; color: #991b1b; }
        [data-theme="dark"] .bg-atom-col strong { color: #fca5a5; }
        .bg-atom-row { display: flex; justify-content: space-between; gap: 24px; margin-top: 6px; font-weight: 600; }
        .bg-error-text { color: #dc2626; font-weight: 800; }
        .bg-success-text { color: #16a34a; font-weight: 800; }

        .bg-progress-bar { width: 100%; height: 8px; background: #e2e8f0; border-radius: 4px; margin-bottom: 16px; overflow: hidden; }
        [data-theme="dark"] .bg-progress-bar { background: #334155; }
        .bg-progress-fill { height: 100%; background: #10b981; width: 0%; transition: width 0.3s ease; }
        
        .bg-end-screen { text-align: center; padding: 40px 20px; }
        .bg-end-title { font-size: 2.2rem; color: var(--primary, #003c71); margin-bottom: 12px; }
        [data-theme="dark"] .bg-end-title { color: #60a5fa; }

        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
        .shake { animation: shake 0.35s ease-in-out; }
        @keyframes successPop { 0% { transform: scale(1); } 50% { transform: scale(1.04); background: #dcfce7; } 100% { transform: scale(1); } }
        .success-anim { animation: successPop 0.45s ease-in-out; }
    `;
    document.head.appendChild(style);

    // --- 2. BỘ PHƯƠNG TRÌNH CHUẨN KHTN CẤP 2 (LỚP 7, 8, 9 GDPT 2018) ---
    const equationsData = [
        // ================= CẤP ĐỘ 1: DỄ (KHTN 7 - 8 Cơ Bản) =================
        {
            level: 1,
            name: 'Đốt cháy khí hiđro tạo nước',
            reactants: [ { formula: 'H₂', atoms: {H: 2} }, { formula: 'O₂', atoms: {O: 2} } ],
            products: [ { formula: 'H₂O', atoms: {H: 2, O: 1} } ],
            correct: [2, 1, 2]
        },
        {
            level: 1,
            name: 'Kim loại natri tác dụng khí clo sinh muối ăn',
            reactants: [ { formula: 'Na', atoms: {Na: 1} }, { formula: 'Cl₂', atoms: {Cl: 2} } ],
            products: [ { formula: 'NaCl', atoms: {Na: 1, Cl: 1} } ],
            correct: [2, 1, 2]
        },
        {
            level: 1,
            name: 'Đốt cháy dải magie sáng chói trong không khí',
            reactants: [ { formula: 'Mg', atoms: {Mg: 1} }, { formula: 'O₂', atoms: {O: 2} } ],
            products: [ { formula: 'MgO', atoms: {Mg: 1, O: 1} } ],
            correct: [2, 1, 2]
        },
        {
            level: 1,
            name: 'Than cacbon cháy sinh khí cacbonic',
            reactants: [ { formula: 'C', atoms: {C: 1} }, { formula: 'O₂', atoms: {O: 2} } ],
            products: [ { formula: 'CO₂', atoms: {C: 1, O: 2} } ],
            correct: [1, 1, 1]
        },
        {
            level: 1,
            name: 'Lưu huỳnh cháy ngọn lửa xanh tạo khí mùi hắc',
            reactants: [ { formula: 'S', atoms: {S: 1} }, { formula: 'O₂', atoms: {O: 2} } ],
            products: [ { formula: 'SO₂', atoms: {S: 1, O: 2} } ],
            correct: [1, 1, 1]
        },
        {
            level: 1,
            name: 'Tổng hợp khí amoniac trong công nghiệp',
            reactants: [ { formula: 'N₂', atoms: {N: 2} }, { formula: 'H₂', atoms: {H: 2} } ],
            products: [ { formula: 'NH₃', atoms: {N: 1, H: 3} } ],
            correct: [1, 3, 2]
        },

        // ================= CẤP ĐỘ 2: TRUNG BÌNH (KHTN 8 Kim loại, Acid, Oxit) =================
        {
            level: 2,
            name: 'Đốt cháy dây sắt tạo oxit sắt từ',
            reactants: [ { formula: 'Fe', atoms: {Fe: 1} }, { formula: 'O₂', atoms: {O: 2} } ],
            products: [ { formula: 'Fe₃O₄', atoms: {Fe: 3, O: 4} } ],
            correct: [3, 2, 1]
        },
        {
            level: 2,
            name: 'Đốt cháy photpho đỏ sinh khói trắng điphotpho pentaoxit',
            reactants: [ { formula: 'P', atoms: {P: 1} }, { formula: 'O₂', atoms: {O: 2} } ],
            products: [ { formula: 'P₂O₅', atoms: {P: 2, O: 5} } ],
            correct: [4, 5, 2]
        },
        {
            level: 2,
            name: 'Kẽm tác dụng axit clohiđric điều chế khí hiđro',
            reactants: [ { formula: 'Zn', atoms: {Zn: 1} }, { formula: 'HCl', atoms: {H: 1, Cl: 1} } ],
            products: [ { formula: 'ZnCl₂', atoms: {Zn: 1, Cl: 2} }, { formula: 'H₂', atoms: {H: 2} } ],
            correct: [1, 2, 1, 1]
        },
        {
            level: 2,
            name: 'Sắt tác dụng axit clohiđric sinh muối sắt(II) và khí H₂',
            reactants: [ { formula: 'Fe', atoms: {Fe: 1} }, { formula: 'HCl', atoms: {H: 1, Cl: 1} } ],
            products: [ { formula: 'FeCl₂', atoms: {Fe: 1, Cl: 2} }, { formula: 'H₂', atoms: {H: 2} } ],
            correct: [1, 2, 1, 1]
        },
        {
            level: 2,
            name: 'Nung đá vôi (canxi cacbonat) tạo vôi sống',
            reactants: [ { formula: 'CaCO₃', atoms: {Ca: 1, C: 1, O: 3} } ],
            products: [ { formula: 'CaO', atoms: {Ca: 1, O: 1} }, { formula: 'CO₂', atoms: {C: 1, O: 2} } ],
            correct: [1, 1, 1]
        },
        {
            level: 2,
            name: 'Nhiệt phân kali clorat điều chế khí oxy trong PTN',
            reactants: [ { formula: 'KClO₃', atoms: {K: 1, Cl: 1, O: 3} } ],
            products: [ { formula: 'KCl', atoms: {K: 1, Cl: 1} }, { formula: 'O₂', atoms: {O: 2} } ],
            correct: [2, 2, 3]
        },
        {
            level: 2,
            name: 'Đốt nóng bột đồng kim loại đỏ thành đồng(II) oxit đen',
            reactants: [ { formula: 'Cu', atoms: {Cu: 1} }, { formula: 'O₂', atoms: {O: 2} } ],
            products: [ { formula: 'CuO', atoms: {Cu: 1, O: 1} } ],
            correct: [2, 1, 2]
        },
        {
            level: 2,
            name: 'Đốt cháy khí metan trong khí thiên nhiên / biogas (KHTN 9)',
            reactants: [ { formula: 'CH₄', atoms: {C: 1, H: 4} }, { formula: 'O₂', atoms: {O: 2} } ],
            products: [ { formula: 'CO₂', atoms: {C: 1, O: 2} }, { formula: 'H₂O', atoms: {H: 2, O: 1} } ],
            correct: [1, 2, 1, 2]
        },

        // ================= CẤP ĐỘ 3: NÂNG CAO (KHTN 8 - 9 Nhôm, Axit, Bazơ, Hữu cơ) =================
        {
            level: 3,
            name: 'Nhôm tác dụng axit clohiđric giải phóng khí hiđro',
            reactants: [ { formula: 'Al', atoms: {Al: 1} }, { formula: 'HCl', atoms: {H: 1, Cl: 1} } ],
            products: [ { formula: 'AlCl₃', atoms: {Al: 1, Cl: 3} }, { formula: 'H₂', atoms: {H: 2} } ],
            correct: [2, 6, 2, 3]
        },
        {
            level: 3,
            name: 'Nhôm tác dụng axit sunfuric loãng tạo muối nhôm sunfat',
            reactants: [ { formula: 'Al', atoms: {Al: 1} }, { formula: 'H₂SO₄', atoms: {H: 2, S: 1, O: 4} } ],
            products: [ { formula: 'Al₂(SO₄)₃', atoms: {Al: 2, S: 3, O: 12} }, { formula: 'H₂', atoms: {H: 2} } ],
            correct: [2, 3, 1, 3]
        },
        {
            level: 3,
            name: 'Phản ứng trung hòa dung dịch natri hiđroxit và axit sunfuric',
            reactants: [ { formula: 'NaOH', atoms: {Na: 1, O: 1, H: 1} }, { formula: 'H₂SO₄', atoms: {H: 2, S: 1, O: 4} } ],
            products: [ { formula: 'Na₂SO₄', atoms: {Na: 2, S: 1, O: 4} }, { formula: 'H₂O', atoms: {H: 2, O: 1} } ],
            correct: [2, 1, 1, 2]
        },
        {
            level: 3,
            name: 'Nhận biết gốc sunfat: BaCl₂ tác dụng H₂SO₄ tạo kết tủa trắng',
            reactants: [ { formula: 'BaCl₂', atoms: {Ba: 1, Cl: 2} }, { formula: 'H₂SO₄', atoms: {H: 2, S: 1, O: 4} } ],
            products: [ { formula: 'BaSO₄', atoms: {Ba: 1, S: 1, O: 4} }, { formula: 'HCl', atoms: {H: 1, Cl: 1} } ],
            correct: [1, 1, 1, 2]
        },
        {
            level: 3,
            name: 'Khí CO khử sắt(III) oxit trong lò cao luyện gang (KHTN 9)',
            reactants: [ { formula: 'Fe₂O₃', atoms: {Fe: 2, O: 3} }, { formula: 'CO', atoms: {C: 1, O: 1} } ],
            products: [ { formula: 'Fe', atoms: {Fe: 1} }, { formula: 'CO₂', atoms: {C: 1, O: 2} } ],
            correct: [1, 3, 2, 3]
        },
        {
            level: 3,
            name: 'Đốt cháy cồn etylic / ethanol tỏa nhiệt mạnh (KHTN 9)',
            reactants: [ { formula: 'C₂H₅OH', atoms: {C: 2, H: 6, O: 1} }, { formula: 'O₂', atoms: {O: 2} } ],
            products: [ { formula: 'CO₂', atoms: {C: 1, O: 2} }, { formula: 'H₂O', atoms: {H: 2, O: 1} } ],
            correct: [1, 3, 2, 3]
        },
        {
            level: 3,
            name: 'Nhiệt phân sắt(III) hiđroxit kết tủa nâu đỏ',
            reactants: [ { formula: 'Fe(OH)₃', atoms: {Fe: 1, O: 3, H: 3} } ],
            products: [ { formula: 'Fe₂O₃', atoms: {Fe: 2, O: 3} }, { formula: 'H₂O', atoms: {H: 2, O: 1} } ],
            correct: [2, 1, 3]
        }
    ];

    // --- 3. TRẠNG THÁI GAME ---
    let state = {
        selectedFilter: 'all', // 'all', 1, 2, 3
        currentEqIndex: 0,
        score: 0,
        timeLeft: 45,
        timerId: null,
        playList: []
    };

    function initGame(filter = 'all') {
        state.selectedFilter = filter;
        let pool = filter === 'all' 
            ? [...equationsData] 
            : equationsData.filter(eq => eq.level === filter);
        
        // Xáo trộn ngẫu nhiên
        state.playList = pool.sort(() => Math.random() - 0.5);
        state.currentEqIndex = 0;
        state.score = 0;

        renderBaseUI();
        loadEquation();
    }

    // --- 4. GIAO DIỆN CHÍNH ---
    function renderBaseUI() {
        container.innerHTML = `
            <div class="balance-game">
                <!-- Chọn cấp độ -->
                <div class="bg-level-picker">
                    <button class="bg-picker-btn ${state.selectedFilter === 'all' ? 'active' : ''}" data-filter="all">Tất cả KHTN (21 câu)</button>
                    <button class="bg-picker-btn ${state.selectedFilter === 1 ? 'active' : ''}" data-filter="1">Level 1: Cơ bản KHTN 7-8</button>
                    <button class="bg-picker-btn ${state.selectedFilter === 2 ? 'active' : ''}" data-filter="2">Level 2: Vận dụng KHTN 8</button>
                    <button class="bg-picker-btn ${state.selectedFilter === 3 ? 'active' : ''}" data-filter="3">Level 3: Nâng cao KHTN 8-9</button>
                </div>

                <div class="bg-progress-bar">
                    <div class="bg-progress-fill" id="bg-progress"></div>
                </div>

                <div class="bg-header">
                    <div class="bg-title-area">
                        <h3>Cân Bằng Phương Trình Hóa Học</h3>
                        <span class="bg-desc-badge" id="bg-level-info">Câu 1/21</span>
                    </div>
                    <div class="bg-stats">
                        <div class="bg-timer">⏱ <span id="bg-time">45</span>s</div>
                        <div class="bg-score-box">Điểm: <span id="bg-score">0</span></div>
                    </div>
                </div>

                <div id="bg-game-area"></div>
            </div>
        `;

        // Gắn sự kiện chọn cấp độ
        container.querySelectorAll('.bg-picker-btn').forEach(btn => {
            btn.onclick = () => {
                const f = btn.dataset.filter === 'all' ? 'all' : parseInt(btn.dataset.filter);
                initGame(f);
            };
        });
    }

    // --- 5. TẢI CÂU HỎI HIỆN TẠI ---
    function loadEquation() {
        if (state.currentEqIndex >= state.playList.length) {
            showEndScreen();
            return;
        }

        const eq = state.playList[state.currentEqIndex];
        const gameArea = document.getElementById('bg-game-area');
        
        const levelNames = {1: 'Cơ bản KHTN 7-8', 2: 'Vận dụng KHTN 8', 3: 'Nâng cao KHTN 8-9'};
        document.getElementById('bg-level-info').textContent = `Câu ${state.currentEqIndex + 1}/${state.playList.length} • ${levelNames[eq.level]}`;
        document.getElementById('bg-progress').style.width = `${((state.currentEqIndex) / state.playList.length) * 100}%`;
        document.getElementById('bg-score').textContent = state.score;

        // Cài đặt thời gian đếm ngược
        state.timeLeft = eq.level === 1 ? 40 : (eq.level === 2 ? 55 : 70);
        document.getElementById('bg-time').textContent = state.timeLeft;
        clearInterval(state.timerId);
        state.timerId = setInterval(updateTimer, 1000);

        let html = `
            <div class="bg-react-note">💡 ${eq.name}</div>
            <div class="bg-equation-container" id="bg-eq-box">
        `;
        
        // Vế trái (Chất phản ứng)
        eq.reactants.forEach((r, idx) => {
            html += createMoleculeInput(r.formula, idx);
            if (idx < eq.reactants.length - 1) html += '<div class="bg-arrow">+</div>';
        });

        html += '<div class="bg-arrow">→</div>';

        // Vế phải (Sản phẩm)
        eq.products.forEach((p, idx) => {
            html += createMoleculeInput(p.formula, eq.reactants.length + idx);
            if (idx < eq.products.length - 1) html += '<div class="bg-arrow">+</div>';
        });

        html += `
            </div>
            <div id="bg-atom-feedback" class="bg-atom-count"></div>
            <div class="bg-controls">
                <button class="bg-btn bg-btn-hint" id="btn-hint">💡 Gợi ý (-5 điểm)</button>
                <button class="bg-btn bg-btn-primary" id="btn-check">✓ Kiểm tra</button>
            </div>
        `;

        gameArea.innerHTML = html;

        document.getElementById('btn-check').addEventListener('click', checkAnswer);
        document.getElementById('btn-hint').addEventListener('click', giveHint);
        
        // Tự động focus vào ô đầu tiên
        const firstInput = gameArea.querySelector('.bg-coeff-input');
        if (firstInput) firstInput.focus();
    }

    function createMoleculeInput(formula, index) {
        return `
            <div class="bg-molecule">
                <input type="number" class="bg-coeff-input" data-index="${index}" min="1" max="20" value="" placeholder="1">
                <span>${formula}</span>
            </div>
        `;
    }

    function updateTimer() {
        state.timeLeft--;
        const timeElem = document.getElementById('bg-time');
        if (timeElem) timeElem.textContent = state.timeLeft;

        if (state.timeLeft <= 0) {
            clearInterval(state.timerId);
            handleWrongAnswer(true);
        }
    }

    // --- 6. KIỂM TRA ĐÁP ÁN ---
    function checkAnswer() {
        const eq = state.playList[state.currentEqIndex];
        const inputs = document.querySelectorAll('.bg-coeff-input');
        let userCoeffs = Array.from(inputs).map(inp => parseInt(inp.value) || 1);

        let isCorrect = true;
        for (let i = 0; i < eq.correct.length; i++) {
            if (userCoeffs[i] !== eq.correct[i]) {
                isCorrect = false;
                break;
            }
        }

        if (isCorrect) {
            handleCorrectAnswer();
        } else {
            showAtomMismatch(userCoeffs, eq);
            handleWrongAnswer(false);
        }
    }

    function handleCorrectAnswer() {
        clearInterval(state.timerId);
        const eqBox = document.getElementById('bg-eq-box');
        if (eqBox) eqBox.classList.add('success-anim');
        
        const timeBonus = Math.floor(state.timeLeft / 8);
        const pointsEarned = 10 + timeBonus;
        state.score += pointsEarned;
        
        const scoreElem = document.getElementById('bg-score');
        if (scoreElem) scoreElem.textContent = state.score;
        confettiEffect();

        setTimeout(() => {
            state.currentEqIndex++;
            loadEquation();
        }, 1200);
    }

    function handleWrongAnswer(isTimeOut) {
        const eqBox = document.getElementById('bg-eq-box');
        if (eqBox) {
            eqBox.classList.remove('shake');
            void eqBox.offsetWidth;
            eqBox.classList.add('shake');
        }
        
        state.score = Math.max(0, state.score - 2);
        const scoreElem = document.getElementById('bg-score');
        if (scoreElem) scoreElem.textContent = state.score;

        if (isTimeOut) {
            const feedback = document.getElementById('bg-atom-feedback');
            if (feedback) {
                feedback.style.display = 'block';
                feedback.innerHTML = '<div class="bg-error-text" style="width:100%; text-align:center;">⏱ Hết giờ! Tự động chuyển câu tiếp theo...</div>';
            }
            setTimeout(() => {
                state.currentEqIndex++;
                loadEquation();
            }, 1800);
        }
    }

    // Hiển thị số lượng nguyên tử 2 vế để học sinh dễ nhận biết điểm sai
    function showAtomMismatch(userCoeffs, eq) {
        let reactantsAtoms = {};
        let productsAtoms = {};

        eq.reactants.forEach((r, idx) => {
            const coeff = userCoeffs[idx];
            for (const [element, count] of Object.entries(r.atoms)) {
                reactantsAtoms[element] = (reactantsAtoms[element] || 0) + (count * coeff);
            }
        });

        eq.products.forEach((p, idx) => {
            const coeff = userCoeffs[eq.reactants.length + idx];
            for (const [element, count] of Object.entries(p.atoms)) {
                productsAtoms[element] = (productsAtoms[element] || 0) + (count * coeff);
            }
        });

        const allElements = new Set([...Object.keys(reactantsAtoms), ...Object.keys(productsAtoms)]);
        const feedback = document.getElementById('bg-atom-feedback');
        if (!feedback) return;
        feedback.style.display = 'flex';
        feedback.innerHTML = `
            <div class="bg-atom-col">
                <strong>Chất tham gia (Vế trái)</strong>
                ${Array.from(allElements).map(el => `<div class="bg-atom-row">${el}: ${reactantsAtoms[el] || 0}</div>`).join('')}
            </div>
            <div class="bg-atom-col">
                <strong>Sản phẩm (Vế phải)</strong>
                ${Array.from(allElements).map(el => {
                    const rCount = reactantsAtoms[el] || 0;
                    const pCount = productsAtoms[el] || 0;
                    const colorClass = rCount === pCount ? 'bg-success-text' : 'bg-error-text';
                    return `<div class="bg-atom-row ${colorClass}">${el}: ${pCount} ${rCount === pCount ? '✓' : '✗'}</div>`;
                }).join('')}
            </div>
        `;
    }

    function giveHint() {
        if (state.score < 5) {
            alert("Bạn cần tối thiểu 5 điểm để sử dụng gợi ý!");
            return;
        }
        
        state.score -= 5;
        document.getElementById('bg-score').textContent = state.score;

        const eq = state.playList[state.currentEqIndex];
        const inputs = document.querySelectorAll('.bg-coeff-input');
        
        let incorrectIndices = [];
        inputs.forEach((input, index) => {
            if (parseInt(input.value) !== eq.correct[index]) {
                incorrectIndices.push(index);
            }
        });

        if (incorrectIndices.length > 0) {
            const randomIdx = incorrectIndices[Math.floor(Math.random() * incorrectIndices.length)];
            inputs[randomIdx].value = eq.correct[randomIdx];
            inputs[randomIdx].style.backgroundColor = '#fef08a';
            setTimeout(() => { inputs[randomIdx].style.backgroundColor = ''; }, 1200);
        }
    }

    function showEndScreen() {
        clearInterval(state.timerId);
        container.innerHTML = `
            <div class="balance-game bg-end-screen">
                <h2 class="bg-end-title">Chúc Mừng Bạn! 🎉</h2>
                <p style="font-size: 1.2rem; color: var(--text-light); margin-bottom: 10px;">Bạn đã hoàn thành lượt chơi cân bằng phương trình KHTN!</p>
                <div style="font-size: 2.5rem; font-weight: 800; color: #059669; margin: 15px 0;">${state.score} <span style="font-size:1.2rem;font-weight:600;">điểm</span></div>
                <button class="bg-btn bg-btn-primary" id="btn-replay" style="margin-top: 15px;">🔄 Chơi lại từ đầu</button>
            </div>
        `;
        document.getElementById('btn-replay').addEventListener('click', () => initGame(state.selectedFilter));
    }

    function confettiEffect() {
        const colors = ['#cf2e2e', '#003c71', '#10b981', '#f59e0b'];
        for (let i = 0; i < 25; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '8px';
            confetti.style.height = '8px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.borderRadius = '50%';
            confetti.style.zIndex = '9999';
            confetti.style.pointerEvents = 'none';
            document.body.appendChild(confetti);

            const animation = confetti.animate([
                { transform: 'translate3d(0,0,0)', opacity: 1 },
                { transform: `translate3d(${Math.random()*160 - 80}px, ${window.innerHeight}px, 0)`, opacity: 0 }
            ], {
                duration: Math.random() * 800 + 1000,
                easing: 'cubic-bezier(0, .9, .57, 1)'
            });

            animation.onfinish = () => confetti.remove();
        }
    }

    initGame('all');
});
