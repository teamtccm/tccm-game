/**
 * MINIGAMES & YU-GI-OH DUEL SYSTEM CHO ĐẠI HỌC HẢI PHÒNG
 * Chứa:
 * 1. Đấu Thẻ Bài Sinh Viên ĐH Hải Phòng (Yu-Gi-Oh Card Battle)
 * 2. Vòng Quay Né Deadline & Thoát Nợ Quỹ (Lucky Wheel)
 * 3. Bộ lọc & Tự động chuyển đổi sự kiện theo ngày (Event Theme Auto-Switcher)
 */

// ==========================================
// 1. EVENT THEME AUTO-SWITCHER
// ==========================================
function getAutoEventTheme() {
    const saved = localStorage.getItem('QL_EVENT_THEME_OVERRIDE');
    if (saved && saved !== 'auto') return saved;

    const now = new Date();
    const month = now.getMonth() + 1; // 1-12
    const date = now.getDate(); // 1-31

    // Dịp Quốc Khánh 2/9 (từ 28/8 đến 5/9)
    if ((month === 9 && date <= 5) || (month === 8 && date >= 28)) {
        return 'quockhanh';
    }
    // Dịp Tri ân Thầy Cô 20/11 (từ 15/11 đến 22/11)
    if (month === 11 && date >= 15 && date <= 22) {
        return 'teacher_day';
    }
    // Mặc định: Đẳng Cấp Thuyết Trình Cổng trường ĐHHP
    return 'dhhp';
}

function applyEventTheme(themeKey) {
    if (themeKey === 'quockhanh') {
        const menuDhhp = document.getElementById('menuContentDhhp');
        const menuQk = document.getElementById('menuContentQk');
        const mitchumBg = document.getElementById('mitchumBgVideo');
        const defBg = document.getElementById('defaultBgVideo');
        if (menuDhhp) menuDhhp.style.display = 'none';
        if (menuQk) menuQk.style.display = 'flex';
        if (mitchumBg) { mitchumBg.style.display = 'none'; mitchumBg.pause(); }
        if (defBg) { defBg.style.display = 'block'; defBg.play().catch(()=>{}); }
        showNotify('🇻🇳 Tự động kích hoạt Giao diện Sự kiện Quốc Khánh 2/9 (Lăng Bác)!');
    } else {
        const menuDhhp = document.getElementById('menuContentDhhp');
        const menuQk = document.getElementById('menuContentQk');
        const mitchumBg = document.getElementById('mitchumBgVideo');
        const defBg = document.getElementById('defaultBgVideo');
        if (menuDhhp) menuDhhp.style.display = 'flex';
        if (menuQk) menuQk.style.display = 'none';
        if (mitchumBg) { mitchumBg.style.display = 'block'; mitchumBg.play().catch(()=>{}); }
        if (defBg) { defBg.style.display = 'none'; defBg.pause(); }
    }
}

function setManualEventTheme(themeKey) {
    localStorage.setItem('QL_EVENT_THEME_OVERRIDE', themeKey);
    const active = themeKey === 'auto' ? getAutoEventTheme() : themeKey;
    applyEventTheme(active);
    showNotify(themeKey === 'auto' ? '⚡ Đã bật Chế độ Tự động theo lịch sự kiện!' : `🎉 Đã chọn giao diện: ${themeKey === 'quockhanh' ? 'Quốc Khánh 2/9' : 'ĐH Hải Phòng'}`);
}

// ==========================================
// 2. YU-GI-OH CARD BATTLE SYSTEM (ĐH HẢI PHÒNG)
// ==========================================

// --- YGO SPRITE ANIMATION SYSTEM ---
// Map card id → sprite folder key (chỉ 8 nhân vật có sprite)
const YGO_SPRITE_MAP = {
    'c_tanbanhda': 'tanbanhda',
    'c_begautruc': 'begautruc',
    'c_hungtran': 'hungtran',
    'c_huyenlinh': 'huyenlinh',
    'c_tung': 'tung',
    'c_dungsenpai': 'dungsenpai',
    'c_tranlambo': 'tranlambo',
    'c_haify': 'haify'
};

function getYgoSpriteKey(cardId) {
    return YGO_SPRITE_MAP[cardId] || null;
}

// Hiện animation triệu hồi nhân vật lên sân (overlay nổi lên)
function ygoShowSummonAnim(card, callback) {
    const spriteKey = getYgoSpriteKey(card.id);
    if (!spriteKey) { if (callback) callback(); return; }

    // Xóa overlay cũ nếu có
    const old = document.getElementById('ygoSummonOverlay');
    if (old) old.remove();

    const overlay = document.createElement('div');
    overlay.id = 'ygoSummonOverlay';
    overlay.style.cssText = `
        position:fixed;inset:0;z-index:9990;pointer-events:none;
        display:flex;align-items:center;justify-content:center;
        background:rgba(0,0,0,0.6);backdrop-filter:blur(3px);
        animation:fadeIn 0.15s ease-out;
    `;

    const spriteImg = document.createElement('img');
    spriteImg.src = `images/sprites/${spriteKey}/idle.png`;
    spriteImg.style.cssText = `
        width:180px;height:auto;image-rendering:pixelated;
        filter:drop-shadow(0 0 30px rgba(100,200,255,0.8));
        animation:ygoSummonRise 0.8s cubic-bezier(0.22,1,0.36,1) forwards;
    `;

    const nameTag = document.createElement('div');
    nameTag.textContent = card.name;
    nameTag.style.cssText = `
        position:absolute;bottom:25%;left:50%;transform:translateX(-50%);
        font-size:18px;font-weight:900;color:#FCD34D;
        text-shadow:0 0 20px rgba(252,211,77,0.8),0 2px 8px rgba(0,0,0,0.9);
        letter-spacing:3px;text-transform:uppercase;
        animation:fadeIn 0.3s ease-out 0.4s both;
    `;

    overlay.appendChild(spriteImg);
    overlay.appendChild(nameTag);
    document.body.appendChild(overlay);

    // Cycle qua idle frames nhanh
    let frame = 0;
    const idleInterval = setInterval(() => {
        frame = (frame + 1) % 4;
        const action = frame === 0 ? 'idle' : `combo_${frame - 1}`;
        spriteImg.src = `images/sprites/${spriteKey}/${action}.png`;
    }, 150);

    setTimeout(() => {
        clearInterval(idleInterval);
        overlay.style.animation = 'fadeOut 0.3s ease-in forwards';
        setTimeout(() => {
            if (overlay.parentNode) overlay.remove();
            if (callback) callback();
        }, 300);
    }, 1200);
}

// Hiện animation tấn công (character đánh)
function ygoShowAttackAnim(attackerCard, defenderCard, callback) {
    const spriteKey = getYgoSpriteKey(attackerCard.id);
    if (!spriteKey) { if (callback) callback(); return; }

    const old = document.getElementById('ygoAttackOverlay');
    if (old) old.remove();

    const overlay = document.createElement('div');
    overlay.id = 'ygoAttackOverlay';
    overlay.style.cssText = `
        position:fixed;inset:0;z-index:9990;pointer-events:none;
        display:flex;align-items:center;justify-content:center;
        background:rgba(0,0,0,0.5);
        animation:fadeIn 0.1s ease-out;
    `;

    const spriteImg = document.createElement('img');
    spriteImg.src = `images/sprites/${spriteKey}/punch_0.png`;
    spriteImg.style.cssText = `
        width:160px;height:auto;image-rendering:pixelated;
        filter:drop-shadow(0 0 20px rgba(255,100,50,0.8));
    `;

    // Nổ tia sáng
    const vfxFlash = document.createElement('div');
    vfxFlash.style.cssText = `
        position:absolute;width:200px;height:200px;border-radius:50%;
        background:radial-gradient(circle,rgba(255,200,50,0.6) 0%,transparent 70%);
        opacity:0;animation:ygoVfxFlash 0.6s ease-out 0.3s forwards;
    `;

    overlay.appendChild(vfxFlash);
    overlay.appendChild(spriteImg);
    document.body.appendChild(overlay);

    // Cycle punch frames
    let frame = 0;
    const punchInterval = setInterval(() => {
        spriteImg.src = `images/sprites/${spriteKey}/punch_${frame}.png`;
        frame++;
        if (frame > 3) frame = 0;
    }, 100);

    setTimeout(() => {
        clearInterval(punchInterval);
        overlay.style.animation = 'fadeOut 0.2s ease-in forwards';
        setTimeout(() => {
            if (overlay.parentNode) overlay.remove();
            if (callback) callback();
        }, 200);
    }, 800);
}

// CSS keyframes cho YGO animations (inject 1 lần)
(function injectYgoAnimStyles() {
    if (document.getElementById('ygoAnimStyles')) return;
    const style = document.createElement('style');
    style.id = 'ygoAnimStyles';
    style.textContent = `
        @keyframes ygoSummonRise {
            0% { transform: translateY(120px) scale(0.3); opacity: 0; }
            50% { transform: translateY(-20px) scale(1.1); opacity: 1; }
            100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes ygoVfxFlash {
            0% { opacity: 0; transform: scale(0.3); }
            50% { opacity: 1; transform: scale(1.5); }
            100% { opacity: 0; transform: scale(2); }
        }
        @keyframes fadeOut {
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
})();

const YGO_CARDS_DATABASE = [
    {
        id: "c_tanbanhda",
        name: "TÂN BÁNH ĐA",
        title: "Chiến Thần Hỏa Cước",
        type: "monster",
        stars: 4,
        atk: 1900,
        def: 1400,
        img: "images/characters/char_tanbanhda.jpg",
        desc: "Kỹ năng: Phóng hỏa cước liên hoàn. Tăng 200 ATK khi tấn công."
    },
    {
        id: "c_begautruc",
        name: "BÉ GẤU TRÚC",
        title: "Huyền Thoại Khói Thuốc",
        type: "monster",
        stars: 5,
        atk: 2200,
        def: 1800,
        img: "images/characters/char_begautruc.jpg",
        desc: "Kỹ năng: Hắc khói cà phê. Gây 300 sát thương trực tiếp vào LP đối thủ."
    },
    {
        id: "c_hungtran",
        name: "HÙNG TRẦN",
        title: "Hiệp Sĩ Maid Hầu Gái",
        type: "monster",
        stars: 4,
        atk: 1600,
        def: 2100,
        img: "images/characters/char9.jpg",
        desc: "Kỹ năng: Vòng xoáy trái tim. Khi ở thế Thủ, hồi 400 LP cho bạn mỗi lượt."
    },
    {
        id: "c_huyenlinh",
        name: "HUYỀN LINH",
        title: "Tiên Nữ Phong Hoa",
        type: "monster",
        stars: 4,
        atk: 1800,
        def: 1500,
        img: "images/characters/char_huyenlinh.jpg",
        desc: "Kỹ năng: Cuồng phong hoa anh đào. Giảm 300 ATK của quái thú đối phương."
    },
    {
        id: "c_tung",
        name: "TÙNG LẨU NƯỚNG",
        title: "Đầu Bếp Siêu Cay",
        type: "monster",
        stars: 4,
        atk: 1700,
        def: 1300,
        img: "images/characters/char_tung.jpg",
        desc: "Kỹ năng: Nồi lẩu cấp 7. Thiêu đốt 300 LP đối thủ khi ra trận."
    },
    {
        id: "c_thaylong",
        name: "THẦY LONG",
        title: "Boss Content Marketing",
        type: "monster",
        stars: 6,
        atk: 2500,
        def: 2000,
        img: "images/characters/char_thaylong.jpg",
        desc: "Kỹ năng: Bắt bẻ logic phản biện. Vô hiệu hóa 1 đòn tấn công."
    },
    {
        id: "c_thaytruong",
        name: "THẦY TRƯỜNG",
        title: "Tiền Đạo Media ĐHHP",
        type: "monster",
        stars: 7,
        atk: 2800,
        def: 2300,
        img: "images/characters/char_thaytruong.jpg",
        desc: "Kỹ năng: Sút phạt cháy lưới. Có thể tấn công thẳng vào LP đối thủ nếu có bóng."
    },
    {
        id: "c_cophuong",
        name: "CÔ PHƯƠNG",
        title: "Thần Hộ Mệnh Cố Vấn",
        type: "monster",
        stars: 5,
        atk: 1300,
        def: 2600,
        img: "images/characters/char_cophuong.jpg",
        desc: "Kỹ năng: Hộ trì học tập. Miễn nhiễm mọi sát thương trong 1 hiệp."
    },
    // Lá bài phép (Spell Cards)
    {
        id: "s_banhdacua",
        name: "BÁNH ĐA CUA HẢI PHÒNG",
        title: "Bài Phép Phục Hồi",
        type: "spell",
        stars: 0,
        atk: 0,
        def: 0,
        img: "images/characters/char_tanbanhda.jpg",
        desc: "Húp trọn bát bánh đa cua chuẩn vị Hải Phòng: Hồi ngay 1000 LP!"
    },
    {
        id: "s_deadline",
        name: "DEADLINE 23:59",
        title: "Bài Bẫy Khẩn Cấp",
        type: "spell",
        stars: 0,
        atk: 0,
        def: 0,
        img: "images/characters/char_begautruc.jpg",
        desc: "Cú sốc trước nửa đêm: Tiêu diệt 1 quái thú bất kỳ của đối thủ trên sân!"
    },
    {
        id: "s_nopquy",
        name: "NỘP QUỸ LỚP ĐẦY ĐỦ",
        title: "Bài Phép Tăng Lực",
        type: "spell",
        stars: 0,
        atk: 0,
        def: 0,
        img: "images/characters/char_loptruong.jpg",
        desc: "Đóng tiền quỹ đúng hạn: Tất cả quái thú của bạn trên sân được tăng +500 ATK!"
    }
];

let ygoState = {
    playerLP: 4000,
    botLP: 4000,
    playerHand: [],
    botHand: [],
    playerField: [null, null, null], // 3 ô Monster: { card, pos: 'atk'|'def', hasAttacked: boolean }
    botField: [null, null, null],
    selectedHandIndex: null,
    selectedFieldIndex: null,
    isPlayerTurn: true,
    turnCount: 1,
    combatLog: ["★ TRẬN ĐẤU BẮT ĐẦU! BẠN ĐI TRƯỚC ★"]
};

function addCombatLog(msg) {
    ygoState.combatLog.unshift(msg);
    if (ygoState.combatLog.length > 8) ygoState.combatLog.pop();
    const logBox = document.getElementById('ygoLogBox');
    if (logBox) {
        logBox.innerHTML = ygoState.combatLog.map((l, idx) => `
            <div class="${idx === 0 ? 'text-amber-300 font-bold' : 'text-slate-300'} text-xs leading-relaxed">
                ${l}
            </div>
        `).join("");
    }
}

function startYuGiOhGame() {
    ygoState = {
        playerLP: 4000,
        botLP: 4000,
        playerHand: [],
        botHand: [],
        playerField: [null, null, null],
        botField: [null, null, null],
        selectedHandIndex: null,
        selectedFieldIndex: null,
        isPlayerTurn: true,
        turnCount: 1,
        combatLog: ["★ TRẬN CHIẾN BẮT ĐẦU! HÃY TRIỆU HỒI QUÁI THÚ ★"]
    };

    // Chia bài khởi đầu: 4 lá cho mỗi bên
    for (let i = 0; i < 4; i++) {
        drawCardFor('player');
        drawCardFor('bot');
    }

    // Bot triệu hồi sẵn 1 lá khởi đầu
    botSummonInitial();

    showScreen('yugioh');
    renderYuGiOhUI();
}

function drawCardFor(who) {
    const randCard = YGO_CARDS_DATABASE[Math.floor(Math.random() * YGO_CARDS_DATABASE.length)];
    const cardCopy = { ...randCard, uid: Math.random().toString(36).substring(2, 9) };
    if (who === 'player' && ygoState.playerHand.length < 5) {
        ygoState.playerHand.push(cardCopy);
    } else if (who === 'bot' && ygoState.botHand.length < 5) {
        ygoState.botHand.push(cardCopy);
    }
}

function botSummonInitial() {
    const monsters = YGO_CARDS_DATABASE.filter(c => c.type === 'monster');
    const c = monsters[Math.floor(Math.random() * monsters.length)];
    ygoState.botField[1] = { card: { ...c }, pos: 'atk', hasAttacked: false };
}

function renderYuGiOhUI() {
    // 1. Cập nhật LP
    const pLpTxt = document.getElementById('ygoPlayerLp');
    const bLpTxt = document.getElementById('ygoBotLp');
    const pLpBar = document.getElementById('ygoPlayerLpBar');
    const bLpBar = document.getElementById('ygoBotLpBar');

    if (pLpTxt) pLpTxt.textContent = Math.max(0, ygoState.playerLP);
    if (bLpTxt) bLpTxt.textContent = Math.max(0, ygoState.botLP);
    if (pLpBar) pLpBar.style.width = Math.max(0, Math.min(100, (ygoState.playerLP / 4000) * 100)) + '%';
    if (bLpBar) bLpBar.style.width = Math.max(0, Math.min(100, (ygoState.botLP / 4000) * 100)) + '%';

    // 2. Render Bot Field (Top)
    const bFieldEl = document.getElementById('ygoBotField');
    if (bFieldEl) {
        bFieldEl.innerHTML = ygoState.botField.map((slot, idx) => {
            if (!slot) {
                return `
                <div onclick="selectBotTarget(${idx})" class="w-[72px] h-[100px] sm:w-24 sm:h-32 rounded-xl border-2 border-dashed border-red-500/20 bg-red-950/20 flex items-center justify-center text-[9px] text-red-400/50 font-mono cursor-pointer hover:border-red-400/40 hover:bg-red-900/20 transition-all">
                    <i class="fa-solid fa-skull-crossbones text-lg text-red-500/20"></i>
                </div>`;
            }
            return `
            <div onclick="selectBotTarget(${idx})" class="w-[72px] h-[100px] sm:w-24 sm:h-32 rounded-xl border-2 border-red-500 bg-gradient-to-b from-red-900/80 to-red-950 p-1 flex flex-col justify-between shadow-lg shadow-red-500/20 relative cursor-pointer hover:scale-110 hover:shadow-red-500/40 transition-all group">
                <div class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-[8px] font-black text-white border border-red-400 shadow-md">★${slot.card.stars}</div>
                <div class="text-[8px] font-black text-red-200 truncate uppercase leading-none">${slot.card.name}</div>
                <div class="w-full h-12 sm:h-16 rounded-lg overflow-hidden border border-red-400/30 bg-black shadow-inner">
                    <img src="${slot.card.img}" class="w-full h-full object-cover group-hover:scale-110 transition-transform">
                </div>
                <div class="text-[7px] text-center font-black px-1 py-0.5 rounded-lg ${slot.pos === 'atk' ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'} shadow-sm">
                    ${slot.pos === 'atk' ? '⚔ ' + slot.card.atk : '🛡 ' + slot.card.def}
                </div>
            </div>`;
        }).join("");
    }

    // 3. Render Player Field (Middle)
    const pFieldEl = document.getElementById('ygoPlayerField');
    if (pFieldEl) {
        pFieldEl.innerHTML = ygoState.playerField.map((slot, idx) => {
            if (!slot) {
                return `
                <div onclick="summonToSlot(${idx})" class="w-[72px] h-[100px] sm:w-24 sm:h-32 rounded-xl border-2 border-dashed border-cyan-400/30 bg-cyan-950/20 flex flex-col items-center justify-center text-[9px] text-cyan-300/50 font-mono cursor-pointer hover:border-cyan-300 hover:bg-cyan-900/30 hover:shadow-cyan-500/20 hover:shadow-lg transition-all gap-1">
                    <i class="fa-solid fa-plus text-lg text-cyan-400/30"></i>
                    <span>ĐẶT BÀI</span>
                </div>`;
            }
            const isSelected = ygoState.selectedFieldIndex === idx;
            return `
            <div onclick="selectPlayerFieldCard(${idx})" class="w-[72px] h-[100px] sm:w-24 sm:h-32 rounded-xl border-2 ${isSelected ? 'border-yellow-400 ring-2 ring-yellow-400/50 scale-110 shadow-yellow-400/30' : 'border-cyan-400/60'} bg-gradient-to-b from-slate-800/90 to-slate-900 p-1 flex flex-col justify-between shadow-lg cursor-pointer hover:scale-105 transition-all relative group">
                <div class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cyan-600 flex items-center justify-center text-[8px] font-black text-white border border-cyan-400 shadow-md">★${slot.card.stars}</div>
                <div class="text-[8px] font-black text-cyan-200 truncate uppercase leading-none">${slot.card.name}</div>
                <div class="w-full h-12 sm:h-16 rounded-lg overflow-hidden border border-cyan-300/30 bg-black shadow-inner">
                    <img src="${slot.card.img}" class="w-full h-full object-cover ${isSelected ? 'brightness-125' : ''} group-hover:scale-110 transition-transform">
                </div>
                <div class="text-[7px] text-center font-black px-1 py-0.5 rounded-lg ${slot.pos === 'atk' ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'} shadow-sm">
                    ${slot.pos === 'atk' ? '⚔ ' + slot.card.atk : '🛡 ' + slot.card.def}
                </div>
                ${slot.hasAttacked ? '<div class="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center text-[8px] font-black text-amber-300 backdrop-blur-[1px]"><i class="fa-solid fa-check mr-1"></i>ĐÃ RA ĐÒN</div>' : ''}
            </div>`;
        }).join("");
    }

    // 4. Render Player Hand (Bottom)
    const pHandEl = document.getElementById('ygoPlayerHand');
    if (pHandEl) {
        pHandEl.innerHTML = ygoState.playerHand.map((c, idx) => {
            const isSelected = ygoState.selectedHandIndex === idx;
            const isSpell = c.type === 'spell';
            return `
            <div onclick="selectHandCard(${idx})" class="w-[68px] sm:w-[88px] h-[96px] sm:h-[120px] rounded-xl border-2 ${isSelected ? 'border-yellow-400 -translate-y-3 ring-4 ring-yellow-400/40 shadow-yellow-400/30 shadow-xl' : (isSpell ? 'border-emerald-400/70' : 'border-amber-400/50')} ${isSpell ? 'bg-gradient-to-b from-emerald-800/90 to-teal-950' : 'bg-gradient-to-b from-amber-700/90 to-amber-950'} p-1 flex flex-col justify-between shadow-xl cursor-pointer hover:-translate-y-1 transition-all select-none flex-shrink-0 relative overflow-hidden group">
                ${!isSpell ? '<div class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-[7px] font-black text-black border border-amber-300">'+c.stars+'</div>' : ''}
                <div class="text-[7px] font-black ${isSpell ? 'text-emerald-200' : 'text-amber-200'} truncate uppercase leading-none pr-3">
                    ${c.name}
                </div>
                <div class="w-full h-10 sm:h-14 rounded-lg overflow-hidden border border-white/15 bg-black shadow-inner">
                    <img src="${c.img}" class="w-full h-full object-cover group-hover:scale-110 transition-transform">
                </div>
                <div class="text-[6px] ${isSpell ? 'text-emerald-200/80' : 'text-amber-200/80'} line-clamp-2 leading-tight">
                    ${c.desc}
                </div>
                <div class="text-[7px] text-center font-black rounded-lg px-1 py-0.5 ${isSpell ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white' : 'bg-gradient-to-r from-amber-500 to-orange-500 text-black'} shadow-sm">
                    ${isSpell ? '🔮 PHÉP' : '⚔' + c.atk + '/🛡' + c.def}
                </div>
            </div>`;
        }).join("");
    }

    // Cập nhật log
    addCombatLog(ygoState.combatLog[0] || "");
}

function selectHandCard(idx) {
    if (!ygoState.isPlayerTurn) return;
    ygoState.selectedHandIndex = idx;
    ygoState.selectedFieldIndex = null;
    const card = ygoState.playerHand[idx];
    if (card.type === 'spell') {
        activateSpell(idx);
    } else {
        renderYuGiOhUI();
        showNotify(`🃏 Đã chọn [${card.name}]. Hãy bấm vào một ô trống trên sân để Triệu hồi!`);
    }
}

function summonToSlot(slotIdx) {
    if (!ygoState.isPlayerTurn) return;
    if (ygoState.selectedHandIndex === null) {
        showNotify('⚠️ Hãy chọn một lá bài quái thú trên tay trước!');
        return;
    }
    const card = ygoState.playerHand[ygoState.selectedHandIndex];
    if (card.type === 'spell') return;

    ygoState.playerField[slotIdx] = {
        card: card,
        pos: 'atk',
        hasAttacked: false
    };

    ygoState.playerHand.splice(ygoState.selectedHandIndex, 1);
    ygoState.selectedHandIndex = null;
    addCombatLog(`⚔️ Bạn đã triệu hồi [${card.name}] (ATK: ${card.atk}) ra sân!`);
    renderYuGiOhUI();
    // Hiện animation triệu hồi nhân vật
    ygoShowSummonAnim(card);
}

function activateSpell(handIdx) {
    const card = ygoState.playerHand[handIdx];
    if (card.id === 's_banhdacua') {
        ygoState.playerLP = Math.min(4000, ygoState.playerLP + 1000);
        addCombatLog(`🍜 Kích hoạt [Bánh Đa Cua Hải Phòng]: Hồi +1000 LP!`);
    } else if (card.id === 's_deadline') {
        let destroyed = false;
        for (let i = 0; i < ygoState.botField.length; i++) {
            if (ygoState.botField[i]) {
                const targetName = ygoState.botField[i].card.name;
                ygoState.botField[i] = null;
                addCombatLog(`💥 Kích hoạt [Deadline 23:59]: Tiêu diệt quái thú [${targetName}] của đối thủ!`);
                destroyed = true;
                break;
            }
        }
        if (!destroyed) addCombatLog(`💥 Kích hoạt [Deadline 23:59] nhưng đối phương không có quái thú.`);
    } else if (card.id === 's_nopquy') {
        ygoState.playerField.forEach(slot => {
            if (slot) slot.card.atk += 500;
        });
        addCombatLog(`💰 Kích hoạt [Nộp Quỹ Lớp]: Toàn đội tăng +500 ATK!`);
    }
    ygoState.playerHand.splice(handIdx, 1);
    ygoState.selectedHandIndex = null;
    renderYuGiOhUI();
}

function selectPlayerFieldCard(slotIdx) {
    if (!ygoState.isPlayerTurn) return;
    const slot = ygoState.playerField[slotIdx];
    if (!slot) return;
    if (slot.hasAttacked) {
        showNotify('⚠️ Quái thú này đã tấn công trong lượt này!');
        return;
    }
    ygoState.selectedFieldIndex = slotIdx;
    ygoState.selectedHandIndex = null;
    renderYuGiOhUI();
    showNotify(`🎯 [${slot.card.name}] sẵn sàng chiến đấu! Bấm vào quái thú đối thủ để tấn công!`);
}

function selectBotTarget(botSlotIdx) {
    if (!ygoState.isPlayerTurn) return;
    if (ygoState.selectedFieldIndex === null) {
        showNotify('⚠️ Hãy chọn quái thú của bạn trên sân trước khi chọn mục tiêu tấn công!');
        return;
    }
    const mySlot = ygoState.playerField[ygoState.selectedFieldIndex];
    const targetSlot = ygoState.botField[botSlotIdx];

    if (!mySlot || mySlot.hasAttacked) return;

    if (!targetSlot) {
        // Tấn công trực tiếp nếu không còn quái thú nào trên sân đối phương
        const botHasMonsters = ygoState.botField.some(s => s !== null);
        if (botHasMonsters) {
            showNotify('⚠️ Đối phương vẫn còn quái thú phòng thủ! Bạn phải tấn công quái thú trước.');
            return;
        }
        // Hiện animation tấn công trực tiếp
        ygoShowAttackAnim(mySlot.card, null, () => {
            ygoState.botLP -= mySlot.card.atk;
            mySlot.hasAttacked = true;
            ygoState.selectedFieldIndex = null;
            addCombatLog(`💥 [${mySlot.card.name}] TẤN CÔNG TRỰC TIẾP! Đối thủ bị trừ -${mySlot.card.atk} LP!`);
            checkWinCondition();
            renderYuGiOhUI();
        });
        return;
    }

    // Hiện animation tấn công quái thú đối phương
    const savedFieldIdx = ygoState.selectedFieldIndex;
    ygoShowAttackAnim(mySlot.card, targetSlot.card, () => {
        const diff = mySlot.card.atk - targetSlot.card.atk;
        if (diff > 0) {
            ygoState.botField[botSlotIdx] = null;
            ygoState.botLP -= diff;
            addCombatLog(`⚔️ [${mySlot.card.name}] tiêu diệt [${targetSlot.card.name}]! Đối thủ mất ${diff} LP!`);
        } else if (diff === 0) {
            ygoState.playerField[savedFieldIdx] = null;
            ygoState.botField[botSlotIdx] = null;
            addCombatLog(`💥 [${mySlot.card.name}] và [${targetSlot.card.name}] cùng bị tiêu diệt!`);
        } else {
            ygoState.playerField[savedFieldIdx] = null;
            ygoState.playerLP -= Math.abs(diff);
            addCombatLog(`🛡️ [${targetSlot.card.name}] phản công! Bạn mất ${Math.abs(diff)} LP!`);
        }

        if (ygoState.playerField[savedFieldIdx]) {
            ygoState.playerField[savedFieldIdx].hasAttacked = true;
        }
        ygoState.selectedFieldIndex = null;
        checkWinCondition();
        renderYuGiOhUI();
    });
}

function ygoDirectAttack() {
    if (!ygoState.isPlayerTurn || ygoState.selectedFieldIndex === null) {
        showNotify('⚠️ Hãy chọn một quái thú của bạn trên sân trước!');
        return;
    }
    const mySlot = ygoState.playerField[ygoState.selectedFieldIndex];
    const botHasMonsters = ygoState.botField.some(s => s !== null);
    if (botHasMonsters) {
        showNotify('⚠️ Đối phương còn quái thú cản đường! Hãy chọn quái thú của đối thủ để giao chiến.');
        return;
    }
    // Hiện animation tấn công trực tiếp
    ygoShowAttackAnim(mySlot.card, null, () => {
        ygoState.botLP -= mySlot.card.atk;
        mySlot.hasAttacked = true;
        ygoState.selectedFieldIndex = null;
        addCombatLog(`💥 [${mySlot.card.name}] TẤN CÔNG TRỰC TIẾP! Đối thủ bị trừ -${mySlot.card.atk} LP!`);
        checkWinCondition();
        renderYuGiOhUI();
    });
}

function endPlayerTurn() {
    if (!ygoState.isPlayerTurn) return;
    ygoState.isPlayerTurn = false;
    ygoState.selectedFieldIndex = null;
    ygoState.selectedHandIndex = null;
    addCombatLog("⏳ HẾT LƯỢT CỦA BẠN. ĐẾN LƯỢT ĐỐI THỦ...");
    renderYuGiOhUI();

    // AI Bot hành động sau 1 giây
    setTimeout(() => {
        executeBotTurn();
    }, 1000);
}

function executeBotTurn() {
    // 1. Rút bài
    drawCardFor('bot');

    // 2. Triệu hồi quái thú nếu còn ô trống
    const emptySlot = ygoState.botField.findIndex(s => s === null);
    if (emptySlot !== -1) {
        const monsters = YGO_CARDS_DATABASE.filter(c => c.type === 'monster');
        const c = monsters[Math.floor(Math.random() * monsters.length)];
        ygoState.botField[emptySlot] = { card: { ...c }, pos: 'atk', hasAttacked: false };
        addCombatLog(`🤖 Đối thủ đã triệu hồi [${c.name}] (ATK: ${c.atk})!`);
    }

    // 3. Tấn công
    setTimeout(() => {
        for (let i = 0; i < ygoState.botField.length; i++) {
            const bSlot = ygoState.botField[i];
            if (!bSlot) continue;

            // Tìm mục tiêu tấn công bên người chơi
            const pTargets = ygoState.playerField.map((s, idx) => s ? idx : null).filter(idx => idx !== null);
            if (pTargets.length > 0) {
                const targetIdx = pTargets[0];
                const pSlot = ygoState.playerField[targetIdx];
                const diff = bSlot.card.atk - pSlot.card.atk;
                if (diff > 0) {
                    ygoState.playerField[targetIdx] = null;
                    ygoState.playerLP -= diff;
                    addCombatLog(`⚔️ Đối thủ dùng [${bSlot.card.name}] tiêu diệt [${pSlot.card.name}]! Bạn mất ${diff} LP!`);
                } else if (diff === 0) {
                    ygoState.playerField[targetIdx] = null;
                    ygoState.botField[i] = null;
                    addCombatLog(`💥 [${bSlot.card.name}] và [${pSlot.card.name}] tiêu diệt lẫn nhau!`);
                } else {
                    ygoState.botField[i] = null;
                    ygoState.botLP -= Math.abs(diff);
                    addCombatLog(`🛡️ [${pSlot.card.name}] phản công đánh gục [${bSlot.card.name}]! Đối thủ mất ${Math.abs(diff)} LP!`);
                }
            } else {
                // Tấn công trực tiếp người chơi
                ygoState.playerLP -= bSlot.card.atk;
                addCombatLog(`⚠️ Đối thủ TẤN CÔNG TRỰC TIẾP bằng [${bSlot.card.name}]! Bạn mất ${bSlot.card.atk} LP!`);
            }
            break; // Bot tấn công 1 đòn mỗi hiệp
        }

        checkWinCondition();

        // Chuẩn bị lượt mới cho người chơi
        ygoState.isPlayerTurn = true;
        ygoState.turnCount++;
        drawCardFor('player');
        // Reset trạng thái tấn công
        ygoState.playerField.forEach(s => { if (s) s.hasAttacked = false; });
        addCombatLog(`★ HIỆP ${ygoState.turnCount}: BẮT ĐẦU LƯỢT CỦA BẠN! Rút 1 lá bài ★`);
        renderYuGiOhUI();
    }, 1200);
}

function checkWinCondition() {
    if (ygoState.botLP <= 0) {
        ygoState.botLP = 0;
        setTimeout(() => {
            if (typeof confetti === 'function') confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
            ygoShowResultOverlay(true);
        }, 300);
    } else if (ygoState.playerLP <= 0) {
        ygoState.playerLP = 0;
        setTimeout(() => {
            ygoShowResultOverlay(false);
        }, 300);
    }
}

function ygoShowResultOverlay(isWin) {
    const old = document.getElementById('ygoResultOverlay');
    if (old) old.remove();

    const overlay = document.createElement('div');
    overlay.id = 'ygoResultOverlay';
    overlay.style.cssText = `
        position:fixed;inset:0;z-index:9999;
        display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;
        background:${isWin ? 'radial-gradient(circle,rgba(16,85,30,0.95),rgba(0,0,0,0.95))' : 'radial-gradient(circle,rgba(100,10,10,0.95),rgba(0,0,0,0.95))'};
        animation:fadeIn 0.3s ease-out;
    `;

    const icon = isWin ? '🏆' : '💀';
    const title = isWin ? 'CHIẾN THẮNG!' : 'THẤT BẠI!';
    const subtitle = isWin
        ? 'BẠN ĐÃ ĐÁNH BẠI ĐỐI THỦ TRÊN ĐẤU TRƯỜNG THẺ BÀI ĐH HẢI PHÒNG!'
        : 'BẠN ĐÃ HẾT ĐIỂM LP! THỬ LẠI TRẬN ĐẤU MỚI.';
    const btnColor = isWin ? 'from-emerald-500 to-green-600' : 'from-rose-600 to-red-700';

    overlay.innerHTML = `
        <div style="font-size:64px;animation:ygoSummonRise 0.5s ease-out;">${icon}</div>
        <div style="font-size:28px;font-weight:900;color:${isWin ? '#FCD34D' : '#F87171'};text-shadow:0 0 30px currentColor;letter-spacing:4px;">${title}</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.7);text-align:center;max-width:280px;line-height:1.6;">${subtitle}</div>
        <div style="display:flex;gap:10px;margin-top:12px;">
            <button onclick="document.getElementById('ygoResultOverlay').remove();startYuGiOhGame();"
                class="px-5 py-2.5 rounded-xl bg-gradient-to-r ${btnColor} text-white font-black text-xs shadow-lg cursor-pointer active:scale-95 transition-all border border-white/20">
                <i class="fa-solid fa-rotate-right mr-1"></i> CHƠI LẠI
            </button>
            <button onclick="document.getElementById('ygoResultOverlay').remove();showScreen('gameHub');"
                class="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer active:scale-95 transition-all border border-white/10">
                <i class="fa-solid fa-arrow-left mr-1"></i> SẢNH GAME
            </button>
        </div>
    `;
    document.body.appendChild(overlay);
}

// ==========================================
// 3. VÒNG QUAY MAY MẮN & MAY MẮN
// (Dùng danh sách sinh viên STUDENTS từ data.js)
// ==========================================

// Bảng màu pastel ngẫu nhiên cho vòng quay
const WHEEL_PASTEL_COLORS = [
    '#10B981','#3B82F6','#EF4444','#8B5CF6','#F59E0B','#06B6D4','#EC4899','#6366F1',
    '#14B8A6','#F97316','#84CC16','#E11D48','#0EA5E9','#A855F7','#22C55E','#FB7185',
    '#FBBF24','#34D399','#818CF8','#F472B6','#2DD4BF','#FB923C','#A3E635','#C084FC',
    '#38BDF8','#4ADE80','#FACC15','#F87171','#60A5FA','#C084FC','#2DD4BF','#FCA5A1',
    '#86EFAC','#93C5FD','#FDE68A','#D8B4FE','#67E8F9','#FCA5A1','#BEF264','#FDA4AF',
    '#A5B4FC','#FDBA74','#6EE7B7','#F9A8D4','#5EEAD4','#FCD34D','#C4B5FD','#F0ABFC',
    '#7DD3FC','#BBF7D0','#FEF08A','#E879F9'
];

let wheelSegments = []; // [{text, color}] — được build từ STUDENTS
let wheelCurrentAngle = 0;
let isWheelSpinning = false;

function buildWheelSegments() {
    if (typeof STUDENTS === 'undefined' || !Array.isArray(STUDENTS) || STUDENTS.length === 0) {
        wheelSegments = [];
        return;
    }
    // Xáo trộn màu để mỗi lần mở đều khác
    const shuffledColors = [...WHEEL_PASTEL_COLORS].sort(() => Math.random() - 0.5);
    wheelSegments = STUDENTS.map((st, i) => ({
        text: st.name,
        color: shuffledColors[i % shuffledColors.length]
    }));
}

function drawWheelCanvas() {
    const canvas = document.getElementById('luckyWheelCanvas');
    if (!canvas || wheelSegments.length === 0) return;
    const ctx = canvas.getContext('2d');
    const numSlices = wheelSegments.length;
    const sliceAngle = (2 * Math.PI) / numSlices;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = centerX - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    wheelSegments.forEach((seg, i) => {
        const angle = wheelCurrentAngle + i * sliceAngle;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, angle, angle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = seg.color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Chữ tên sinh viên
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle + sliceAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#FFFFFF';
        // Thu nhỏ font khi nhiều người
        const fontSize = numSlices > 30 ? 8 : numSlices > 20 ? 10 : 12;
        ctx.font = `bold ${fontSize}px 'Be Vietnam Pro', sans-serif`;
        ctx.shadowColor = 'rgba(0,0,0,0.9)';
        ctx.shadowBlur = 3;
        // Cắt tên dài
        let displayName = seg.text;
        if (displayName.length > 14) displayName = displayName.substring(0, 12) + '..';
        ctx.fillText(displayName, radius - 16, 4);
        ctx.restore();
    });

    // Tâm bánh xe
    ctx.beginPath();
    ctx.arc(centerX, centerY, 22, 0, 2 * Math.PI);
    ctx.fillStyle = '#1E293B';
    ctx.fill();
    ctx.strokeStyle = '#FCD34D';
    ctx.lineWidth = 4;
    ctx.stroke();
    // Chữ trung tâm
    ctx.fillStyle = '#FCD34D';
    ctx.font = "bold 9px 'Be Vietnam Pro', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillText('QUAY', centerX, centerY + 4);
}

function spinLuckyWheel() {
    if (isWheelSpinning) return;
    if (wheelSegments.length === 0) {
        showNotify('Danh sach lop trong! Hay nhap danh sach sinh vien trong Cai Dat truoc.');
        return;
    }
    isWheelSpinning = true;

    // Ẩn kết quả cũ
    const resultEl = document.getElementById('wheelResultTxt');
    if (resultEl) resultEl.textContent = 'Dang quay...';

    const extraRounds = 5 + Math.random() * 5;
    const targetAngle = wheelCurrentAngle + extraRounds * 2 * Math.PI + Math.random() * 2 * Math.PI;
    const duration = 5000; // 5 giây hồi hộp
    const startTime = performance.now();
    const initialAngle = wheelCurrentAngle;

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / duration);
        // Easing out quart — chậm dần mượt mà hơn
        const easeOut = 1 - Math.pow(1 - progress, 4);
        wheelCurrentAngle = initialAngle + (targetAngle - initialAngle) * easeOut;
        drawWheelCanvas();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isWheelSpinning = false;
            // Tính kết quả
            const numSlices = wheelSegments.length;
            const sliceAngle = (2 * Math.PI) / numSlices;
            const normalizedAngle = (3 * Math.PI / 2 - (wheelCurrentAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
            const index = Math.floor(normalizedAngle / sliceAngle) % numSlices;
            const winner = wheelSegments[index];

            // Hiện kết quả trên dòng text
            if (resultEl) {
                resultEl.textContent = `KET QUA: ${winner.text}`;
            }

            // Hiện overlay thông báo hoành tráng
            showWheelResultOverlay(winner.text);

            if (typeof confetti === 'function') {
                confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
            }
        }
    }
    requestAnimationFrame(animate);
}

// Overlay thông báo kết quả vòng quay — auto đóng sau 5s hoặc bấm đóng
function showWheelResultOverlay(studentName) {
    // Xóa overlay cũ nếu có
    const old = document.getElementById('wheelResultOverlay');
    if (old) old.remove();

    const overlay = document.createElement('div');
    overlay.id = 'wheelResultOverlay';
    overlay.style.cssText = `
        position:fixed;inset:0;z-index:9999;
        display:flex;flex-direction:column;align-items:center;justify-content:center;
        background:rgba(0,0,0,0.85);backdrop-filter:blur(12px);
        animation:fadeIn 0.3s ease-out;
    `;
    overlay.innerHTML = `
        <div style="text-align:center;max-width:380px;padding:32px 24px;">
            <div style="font-size:56px;margin-bottom:12px;animation:bounceIn 0.5s ease-out;">🎯</div>
            <div style="font-size:13px;font-weight:800;color:#94A3B8;text-transform:uppercase;letter-spacing:3px;margin-bottom:8px;">
                VONG QUAY NE DEADLINE
            </div>
            <div style="font-size:14px;color:#CBD5E1;margin-bottom:16px;">
                Nguoi duoc chon la
            </div>
            <div style="font-size:28px;font-weight:900;color:#FCD34D;text-shadow:0 0 30px rgba(252,211,77,0.6);
                        padding:12px 28px;border-radius:16px;border:2px solid #FCD34D;
                        background:linear-gradient(135deg,rgba(252,211,77,0.15),rgba(245,158,11,0.1));
                        animation:pulseGlow 1.5s ease-in-out infinite;">
                ${studentName}
            </div>
            <button onclick="this.closest('#wheelResultOverlay').remove()"
                    style="margin-top:24px;padding:10px 32px;border-radius:12px;border:1px solid rgba(255,255,255,0.2);
                           background:rgba(255,255,255,0.1);color:#FFF;font-weight:700;font-size:12px;cursor:pointer;
                           transition:all 0.15s;letter-spacing:1px;"
                    onmouseover="this.style.background='rgba(255,255,255,0.2)'"
                    onmouseout="this.style.background='rgba(255,255,255,0.1)'">
                DONG
            </button>
        </div>
    `;
    document.body.appendChild(overlay);

    // Tự đóng sau 6 giây
    setTimeout(() => {
        if (overlay.parentNode) overlay.remove();
    }, 6000);
}

function startLuckyWheelGame() {
    buildWheelSegments();
    if (wheelSegments.length === 0) {
        showNotify('Chua co danh sach sinh vien! Hay nhap danh sach trong Cai Dat.');
        return;
    }
    showScreen('wheel');
    // Reset kết quả
    const resultEl = document.getElementById('wheelResultTxt');
    if (resultEl) resultEl.textContent = 'BAM QUAY DE THU VAN MAY!';
    setTimeout(() => {
        drawWheelCanvas();
    }, 150);
}
