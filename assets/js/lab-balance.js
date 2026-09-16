document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('experiment-balance');
    if (!container) return;

    // --- CSS INJECTION (Basic styles for the game) ---
    const style = document.createElement('style');
    style.textContent = `
        .balance-game { font-family: 'Be Vietnam Pro', 'Plus Jakarta Sans', sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: var(--bg-card, #fff); border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); color: var(--text-main, #333); }
        [data-theme="dark"] .balance-game { background: var(--bg-card-dark, #1e1e1e); color: var(--text-light, #eee); }
        .bg-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid var(--primary, #003c71); }
        .bg-stats { display: flex; gap: 20px; font-weight: bold; font-size: 1.1em; }
        .bg-equation-container { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 15px; margin: 30px 0; font-size: 1.5em; padding: 20px; background: var(--bg-soft, #f5f7fa); border-radius: 8px; }
        [data-theme="dark"] .bg-equation-container { background: var(--bg-soft-dark, #2a2a2a); }
        .bg-molecule { display: flex; align-items: center; gap: 5px; }
        .bg-coeff-input { width: 50px; height: 40px; text-align: center; font-size: 1.2em; border: 2px solid #ccc; border-radius: 6px; background: transparent; color: inherit; }
        .bg-coeff-input:focus { border-color: var(--primary, #003c71); outline: none; }
        .bg-arrow { font-weight: bold; color: var(--accent, #cf2e2e); margin: 0 10px; }
        .bg-controls { display: flex; justify-content: center; gap: 15px; margin-top: 20px; }
        .bg-btn { padding: 10px 25px; font-size: 1.1em; font-weight: bold; border: none; border-radius: 6px; cursor: pointer; transition: all 0.3s ease; }
        .bg-btn-primary { background: var(--primary, #003c71); color: white; }
        .bg-btn-primary:hover { opacity: 0.9; transform: translateY(-2px); }
        .bg-btn-hint { background: #f39c12; color: white; }
        .bg-btn-hint:hover { background: #e67e22; }
        .bg-atom-count { display: flex; justify-content: space-around; margin-top: 20px; padding: 15px; border-radius: 8px; background: #ffebee; display: none; }
        [data-theme="dark"] .bg-atom-count { background: #4a1919; }
        .bg-atom-col { text-align: center; }
        .bg-atom-row { display: flex; justify-content: space-between; gap: 20px; margin-top: 10px; }
        .bg-error-text { color: var(--accent, #cf2e2e); font-weight: bold; }
        .bg-success-text { color: #2ecc71; font-weight: bold; }
        .bg-timer { font-size: 1.2em; color: var(--accent, #cf2e2e); font-weight: bold; }
        .bg-end-screen { text-align: center; padding: 40px 20px; }
        .bg-end-title { font-size: 2em; color: var(--primary, #003c71); margin-bottom: 20px; }
        .bg-progress-bar { width: 100%; height: 10px; background: #ddd; border-radius: 5px; margin-bottom: 20px; overflow: hidden; }
        .bg-progress-fill { height: 100%; background: #2ecc71; width: 0%; transition: width 0.3s ease; }
        
        /* Animations */
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }
        .shake { animation: shake 0.4s ease-in-out; }
        @keyframes successPop { 0% { transform: scale(1); } 50% { transform: scale(1.05); background: #d4edda; } 100% { transform: scale(1); } }
        .success-anim { animation: successPop 0.5s ease-in-out; }
    `;
    document.head.appendChild(style);

    // --- DỮ LIỆU CÁC PHƯƠNG TRÌNH HÓA HỌC ---
    // Tổ chức theo 3 cấp độ. format: Reactants, Products, và correct (hệ số đúng)
    // Để dễ tính toán số lượng nguyên tử, ta khai báo rõ số nguyên tử của từng nguyên tố trong mỗi phân tử
    const equationsData = [
        // LEVEL 1 (Dễ)
        {
            level: 1,
            reactants: [ { formula: 'H₂', atoms: {H: 2} }, { formula: 'O₂', atoms: {O: 2} } ],
            products: [ { formula: 'H₂O', atoms: {H: 2, O: 1} } ],
            correct: [2, 1, 2]
        },
        {
            level: 1,
            reactants: [ { formula: 'Na', atoms: {Na: 1} }, { formula: 'Cl₂', atoms: {Cl: 2} } ],
            products: [ { formula: 'NaCl', atoms: {Na: 1, Cl: 1} } ],
            correct: [2, 1, 2]
        },
        {
            level: 1,
            reactants: [ { formula: 'Fe', atoms: {Fe: 1} }, { formula: 'O₂', atoms: {O: 2} } ],
            products: [ { formula: 'Fe₂O₃', atoms: {Fe: 2, O: 3} } ],
            correct: [4, 3, 2]
        },
        {
            level: 1,
            reactants: [ { formula: 'N₂', atoms: {N: 2} }, { formula: 'H₂', atoms: {H: 2} } ],
            products: [ { formula: 'NH₃', atoms: {N: 1, H: 3} } ],
            correct: [1, 3, 2]
        },
        {
            level: 1,
            reactants: [ { formula: 'P', atoms: {P: 1} }, { formula: 'O₂', atoms: {O: 2} } ],
            products: [ { formula: 'P₂O₅', atoms: {P: 2, O: 5} } ],
            correct: [4, 5, 2]
        },
        // LEVEL 2 (Trung bình)
        {
            level: 2,
            reactants: [ { formula: 'Fe₂O₃', atoms: {Fe: 2, O: 3} }, { formula: 'CO', atoms: {C: 1, O: 1} } ],
            products: [ { formula: 'Fe', atoms: {Fe: 1} }, { formula: 'CO₂', atoms: {C: 1, O: 2} } ],
            correct: [1, 3, 2, 3]
        },
        {
            level: 2,
            reactants: [ { formula: 'Al', atoms: {Al: 1} }, { formula: 'HCl', atoms: {H: 1, Cl: 1} } ],
            products: [ { formula: 'AlCl₃', atoms: {Al: 1, Cl: 3} }, { formula: 'H₂', atoms: {H: 2} } ],
            correct: [2, 6, 2, 3]
        },
        {
            level: 2,
            reactants: [ { formula: 'CH₄', atoms: {C: 1, H: 4} }, { formula: 'O₂', atoms: {O: 2} } ],
            products: [ { formula: 'CO₂', atoms: {C: 1, O: 2} }, { formula: 'H₂O', atoms: {H: 2, O: 1} } ],
            correct: [1, 2, 1, 2]
        },
        {
            level: 2,
            reactants: [ { formula: 'KClO₃', atoms: {K: 1, Cl: 1, O: 3} } ],
            products: [ { formula: 'KCl', atoms: {K: 1, Cl: 1} }, { formula: 'O₂', atoms: {O: 2} } ],
            correct: [2, 2, 3]
        },
        {
            level: 2,
            reactants: [ { formula: 'C₂H₆', atoms: {C: 2, H: 6} }, { formula: 'O₂', atoms: {O: 2} } ],
            products: [ { formula: 'CO₂', atoms: {C: 1, O: 2} }, { formula: 'H₂O', atoms: {H: 2, O: 1} } ],
            correct: [2, 7, 4, 6]
        },
        // LEVEL 3 (Khó)
        {
            level: 3,
            reactants: [ { formula: 'Cu', atoms: {Cu: 1} }, { formula: 'HNO₃', atoms: {H: 1, N: 1, O: 3} } ],
            products: [ { formula: 'Cu(NO₃)₂', atoms: {Cu: 1, N: 2, O: 6} }, { formula: 'NO', atoms: {N: 1, O: 1} }, { formula: 'H₂O', atoms: {H: 2, O: 1} } ],
            correct: [3, 8, 3, 2, 4]
        },
        {
            level: 3,
            reactants: [ { formula: 'KMnO₄', atoms: {K: 1, Mn: 1, O: 4} }, { formula: 'HCl', atoms: {H: 1, Cl: 1} } ],
            products: [ { formula: 'KCl', atoms: {K: 1, Cl: 1} }, { formula: 'MnCl₂', atoms: {Mn: 1, Cl: 2} }, { formula: 'Cl₂', atoms: {Cl: 2} }, { formula: 'H₂O', atoms: {H: 2, O: 1} } ],
            correct: [2, 16, 2, 2, 5, 8]
        },
        {
            level: 3,
            reactants: [ { formula: 'FeS₂', atoms: {Fe: 1, S: 2} }, { formula: 'O₂', atoms: {O: 2} } ],
            products: [ { formula: 'Fe₂O₃', atoms: {Fe: 2, O: 3} }, { formula: 'SO₂', atoms: {S: 1, O: 2} } ],
            correct: [4, 11, 2, 8]
        },
        {
            level: 3,
            reactants: [ { formula: 'Al', atoms: {Al: 1} }, { formula: 'HNO₃', atoms: {H: 1, N: 1, O: 3} } ],
            products: [ { formula: 'Al(NO₃)₃', atoms: {Al: 1, N: 3, O: 9} }, { formula: 'N₂O', atoms: {N: 2, O: 1} }, { formula: 'H₂O', atoms: {H: 2, O: 1} } ],
            correct: [8, 30, 8, 3, 15]
        },
        {
            level: 3,
            reactants: [ { formula: 'P', atoms: {P: 1} }, { formula: 'HNO₃', atoms: {H: 1, N: 1, O: 3} }, { formula: 'H₂O', atoms: {H: 2, O: 1} } ],
            products: [ { formula: 'H₃PO₄', atoms: {H: 3, P: 1, O: 4} }, { formula: 'NO', atoms: {N: 1, O: 1} } ],
            correct: [3, 5, 2, 3, 5]
        }
    ];

    // --- TRẠNG THÁI TRÒ CHƠI ---
    let state = {
        currentEqIndex: 0,
        score: 0,
        timeLeft: 60,
        timerId: null,
        playList: [], // Danh sách câu hỏi đã xáo trộn
    };

    // --- KHỞI TẠO TRÒ CHƠI ---
    function initGame() {
        // Xáo trộn danh sách câu hỏi
        state.playList = [...equationsData].sort(() => Math.random() - 0.5);
        state.currentEqIndex = 0;
        state.score = 0;
        
        renderBaseUI();
        loadEquation();
    }

    // --- TẠO GIAO DIỆN CƠ BẢN ---
    function renderBaseUI() {
        container.innerHTML = `
            <div class="balance-game">
                <div class="bg-progress-bar">
                    <div class="bg-progress-fill" id="bg-progress"></div>
                </div>
                <div class="bg-header">
                    <div>
                        <h2>Cân bằng Phương trình Hóa học</h2>
                        <div id="bg-level-info">Cấp độ: Dễ</div>
                    </div>
                    <div class="bg-stats">
                        <div class="bg-timer">⏱ <span id="bg-time">60</span>s</div>
                        <div>Điểm: <span id="bg-score">0</span></div>
                    </div>
                </div>
                <div id="bg-game-area"></div>
            </div>
        `;
    }

    // --- TẢI PHƯƠNG TRÌNH HIỆN TẠI ---
    function loadEquation() {
        if (state.currentEqIndex >= state.playList.length) {
            showEndScreen();
            return;
        }

        const eq = state.playList[state.currentEqIndex];
        const gameArea = document.getElementById('bg-game-area');
        
        // Cập nhật thông tin cấp độ và tiến độ
        const levelNames = {1: 'Dễ', 2: 'Trung bình', 3: 'Khó'};
        document.getElementById('bg-level-info').textContent = \`Cấp độ: \${levelNames[eq.level]}\`;
        document.getElementById('bg-progress').style.width = \`\${(state.currentEqIndex / state.playList.length) * 100}%\`;
        document.getElementById('bg-score').textContent = state.score;

        // Reset thời gian
        state.timeLeft = eq.level === 1 ? 40 : (eq.level === 2 ? 60 : 90);
        document.getElementById('bg-time').textContent = state.timeLeft;
        clearInterval(state.timerId);
        state.timerId = setInterval(updateTimer, 1000);

        // Render các phân tử
        let html = '<div class="bg-equation-container" id="bg-eq-box">';
        
        // Reactants
        eq.reactants.forEach((r, idx) => {
            html += createMoleculeInput(r.formula, idx);
            if (idx < eq.reactants.length - 1) html += '<div class="bg-arrow">+</div>';
        });

        html += '<div class="bg-arrow">→</div>';

        // Products
        eq.products.forEach((p, idx) => {
            html += createMoleculeInput(p.formula, eq.reactants.length + idx);
            if (idx < eq.products.length - 1) html += '<div class="bg-arrow">+</div>';
        });

        html += '</div>';

        // Khu vực thông báo lỗi nguyên tử
        html += '<div id="bg-atom-feedback" class="bg-atom-count"></div>';

        // Nút điều khiển
        html += `
            <div class="bg-controls">
                <button class="bg-btn bg-btn-hint" id="btn-hint">Gợi ý (-5 điểm)</button>
                <button class="bg-btn bg-btn-primary" id="btn-check">Kiểm tra</button>
            </div>
        `;

        gameArea.innerHTML = html;

        // Gắn sự kiện
        document.getElementById('btn-check').addEventListener('click', checkAnswer);
        document.getElementById('btn-hint').addEventListener('click', giveHint);
    }

    // --- TẠO Ô NHẬP HỆ SỐ ---
    function createMoleculeInput(formula, index) {
        return `
            <div class="bg-molecule">
                <input type="number" class="bg-coeff-input" data-index="${index}" min="1" max="50" value="" placeholder="1">
                <span>${formula}</span>
            </div>
        `;
    }

    // --- CẬP NHẬT THỜI GIAN ---
    function updateTimer() {
        state.timeLeft--;
        document.getElementById('bg-time').textContent = state.timeLeft;
        if (state.timeLeft <= 0) {
            clearInterval(state.timerId);
            handleWrongAnswer(true); // Hết giờ coi như sai
        }
    }

    // --- KIỂM TRA ĐÁP ÁN ---
    function checkAnswer() {
        const eq = state.playList[state.currentEqIndex];
        const inputs = document.querySelectorAll('.bg-coeff-input');
        let userCoeffs = Array.from(inputs).map(inp => parseInt(inp.value) || 1); // Trống mặc định là 1

        // Kiểm tra tỉ lệ tối giản (Ví dụ đúng là 2,1,2 nhưng user nhập 4,2,4 thì vẫn đúng nhưng chưa tối giản)
        // Trong game này, ta yêu cầu hệ số phải đúng khớp với correct array (đã tối giản)
        let isCorrect = true;
        for(let i = 0; i < eq.correct.length; i++) {
            if (userCoeffs[i] !== eq.correct[i]) {
                isCorrect = false;
                break;
            }
        }

        if (isCorrect) {
            handleCorrectAnswer();
        } else {
            // Kiểm tra số lượng nguyên tử 2 vế để hiển thị feedback
            showAtomMismatch(userCoeffs, eq);
            handleWrongAnswer(false);
        }
    }

    // --- XỬ LÝ ĐÁP ÁN ĐÚNG ---
    function handleCorrectAnswer() {
        clearInterval(state.timerId);
        const eqBox = document.getElementById('bg-eq-box');
        eqBox.classList.add('success-anim');
        
        // Tính điểm thưởng thời gian
        const timeBonus = Math.floor(state.timeLeft / 10);
        const pointsEarned = 10 + timeBonus;
        state.score += pointsEarned;
        
        document.getElementById('bg-score').textContent = state.score;
        confettiEffect();

        setTimeout(() => {
            state.currentEqIndex++;
            loadEquation();
        }, 1500);
    }

    // --- XỬ LÝ ĐÁP ÁN SAI ---
    function handleWrongAnswer(isTimeOut) {
        const eqBox = document.getElementById('bg-eq-box');
        eqBox.classList.remove('shake');
        void eqBox.offsetWidth; // trigger reflow
        eqBox.classList.add('shake');
        
        state.score = Math.max(0, state.score - 2);
        document.getElementById('bg-score').textContent = state.score;

        if (isTimeOut) {
            const feedback = document.getElementById('bg-atom-feedback');
            feedback.style.display = 'block';
            feedback.innerHTML = '<div class="bg-error-text" style="width:100%; text-align:center;">Hết giờ! Tự động chuyển câu...</div>';
            setTimeout(() => {
                state.currentEqIndex++;
                loadEquation();
            }, 2000);
        }
    }

    // --- HIỂN THỊ SAI SỐ NGUYÊN TỬ ---
    function showAtomMismatch(userCoeffs, eq) {
        let reactantsAtoms = {};
        let productsAtoms = {};

        // Tính tổng nguyên tử chất tham gia
        eq.reactants.forEach((r, idx) => {
            const coeff = userCoeffs[idx];
            for (const [element, count] of Object.entries(r.atoms)) {
                reactantsAtoms[element] = (reactantsAtoms[element] || 0) + (count * coeff);
            }
        });

        // Tính tổng nguyên tử sản phẩm
        eq.products.forEach((p, idx) => {
            const coeff = userCoeffs[eq.reactants.length + idx];
            for (const [element, count] of Object.entries(p.atoms)) {
                productsAtoms[element] = (productsAtoms[element] || 0) + (count * coeff);
            }
        });

        // Tìm tất cả các nguyên tố
        const allElements = new Set([...Object.keys(reactantsAtoms), ...Object.keys(productsAtoms)]);
        
        const feedback = document.getElementById('bg-atom-feedback');
        feedback.style.display = 'flex';
        feedback.innerHTML = `
            <div class="bg-atom-col">
                <strong>Chất tham gia</strong>
                ${Array.from(allElements).map(el => `<div class="bg-atom-row">${el}: ${reactantsAtoms[el] || 0}</div>`).join('')}
            </div>
            <div class="bg-atom-col">
                <strong>Sản phẩm</strong>
                ${Array.from(allElements).map(el => {
                    const rCount = reactantsAtoms[el] || 0;
                    const pCount = productsAtoms[el] || 0;
                    const colorClass = rCount === pCount ? 'bg-success-text' : 'bg-error-text';
                    return `<div class="bg-atom-row ${colorClass}">${el}: ${pCount}</div>`;
                }).join('')}
            </div>
        `;
    }

    // --- GỢI Ý ---
    function giveHint() {
        if (state.score < 5) {
            alert("Bạn không đủ điểm để dùng gợi ý! Cần 5 điểm.");
            return;
        }
        
        state.score -= 5;
        document.getElementById('bg-score').textContent = state.score;

        const eq = state.playList[state.currentEqIndex];
        const inputs = document.querySelectorAll('.bg-coeff-input');
        
        // Điền ngẫu nhiên 1 hệ số đúng vào ô trống hoặc ô đang nhập sai
        let incorrectIndices = [];
        inputs.forEach((input, index) => {
            if (parseInt(input.value) !== eq.correct[index]) {
                incorrectIndices.push(index);
            }
        });

        if (incorrectIndices.length > 0) {
            const randomIdx = incorrectIndices[Math.floor(Math.random() * incorrectIndices.length)];
            inputs[randomIdx].value = eq.correct[randomIdx];
            inputs[randomIdx].style.backgroundColor = '#fff3cd';
            setTimeout(() => { inputs[randomIdx].style.backgroundColor = 'transparent'; }, 1000);
        }
    }

    // --- KẾT THÚC TRÒ CHƠI ---
    function showEndScreen() {
        clearInterval(state.timerId);
        container.innerHTML = `
            <div class="balance-game bg-end-screen">
                <h2 class="bg-end-title">Hoàn thành Thí nghiệm! 🎉</h2>
                <p style="font-size: 1.5em; margin: 20px 0;">Tổng điểm của bạn: <strong>${state.score}</strong></p>
                <button class="bg-btn bg-btn-primary" id="btn-replay">Chơi lại</button>
            </div>
        `;
        document.getElementById('btn-replay').addEventListener('click', initGame);
    }

    // --- HIỆU ỨNG PHÁO HOA ĐƠN GIẢN ---
    function confettiEffect() {
        const colors = ['#cf2e2e', '#003c71', '#2ecc71', '#f1c40f'];
        for (let i = 0; i < 30; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.borderRadius = '50%';
            confetti.style.zIndex = '9999';
            document.body.appendChild(confetti);

            const animation = confetti.animate([
                { transform: 'translate3d(0,0,0)', opacity: 1 },
                { transform: \`translate3d(\${Math.random()*200 - 100}px, \${window.innerHeight}px, 0)\`, opacity: 0 }
            ], {
                duration: Math.random() * 1000 + 1000,
                easing: 'cubic-bezier(0, .9, .57, 1)'
            });

            animation.onfinish = () => confetti.remove();
        }
    }

    // Bắt đầu game
    initGame();
});
