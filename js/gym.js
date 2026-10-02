/**
 * TẬP THỂ THAO — CÔNG VIỆC HẰNG NGÀY
 * Hướng dẫn tập luyện chuẩn 4 nhóm cơ: Ngực - Vai - Tay Sau - Lưng
 * Ảnh động GIF lặp vô tận + Hướng dẫn kỹ thuật & Bộ đếm Set/Nghỉ thông minh
 */

const GYM_WORKOUT_DATA = [
    {
        id: "nguc",
        category: "nguc",
        name: "Cơ Ngực",
        subName: "Chest Workout",
        badge: "Ngực Giữa · Ngực Dưới · Ngực Trên",
        badgeColor: "bg-rose-500",
        gradientHeader: "from-rose-500 via-pink-600 to-red-600",
        icon: "fa-solid fa-heart-pulse",
        gifUrl: "images/gym_co_nguc.gif",
        targetSummary: "Phát triển độ dày, vòm ngực rộng và rãnh ngực săn chắc",
        suggestedPlan: "4 hiệp · 10 - 12 lần/hiệp · Nghỉ 60s",
        exercises: [
            {
                num: "01",
                name: "Dumbbell Floor Press",
                viName: "Đẩy tạ đơn nằm trên sàn",
                target: "Cơ ngực giữa & ngực dưới (Pectoralis Major)",
                guide: "Nằm thẳng trên thảm/sàn, co gối 45°, hai bàn chân bám chắc mặt sàn. Giữ hai tạ đơn ở hai bên ngực, cùi chỏ mở 60° - 75° so với thân người. Hạ chậm đến khi bắp tay chạm nhẹ sàn, sau đó đẩy dứt khoát thẳng lên, gồng siết cơ ngực ở đỉnh 1 giây.",
                breathing: "💨 Đẩy lên thở ra — 🫁 Hạ tạ chạm sàn hít sâu",
                tip: "Khóa chặt bả vai áp sát thảm để dồn 100% lực vào cơ ngực, bảo vệ khớp vai."
            },
            {
                num: "02",
                name: "Dumbbell Incline Fly",
                viName: "Banh ngực tạ đơn nghiêng lên",
                target: "Cơ ngực trên (Clavicular Head) & mở rộng lồng ngực",
                guide: "Nằm trên ghế dốc nghiêng 30° - 45° (hoặc kê gối nghiêng). Giữ hai tạ hướng vào nhau trước ngực. Mở rộng cánh tay sang hai bên theo quỹ đạo vòng cung tròn, cùi chỏ giữ góc cong nhẹ tự nhiên. Cảm nhận thớ ngực trên căng giãn tối đa rồi dùng cơ ngực khép tạ về vị trí ban đầu.",
                breathing: "💨 Khép tạ về giữa thở ra — 🫁 Mở tay banh ngực hít sâu",
                tip: "Luôn giữ cùi chỏ cong nhẹ, không khóa thẳng khớp tay để tránh áp lực lên khuỷu tay."
            }
        ]
    },
    {
        id: "vai",
        category: "vai",
        name: "Cơ Vai",
        subName: "Shoulders Workout",
        badge: "Vai Trước · Vai Giữa · Vai Sau",
        badgeColor: "bg-indigo-600",
        gradientHeader: "from-indigo-600 via-violet-600 to-purple-700",
        icon: "fa-solid fa-angles-up",
        gifUrl: "images/gym_co_vai.gif",
        targetSummary: "Tạo khung vai chữ V vuông vắn, mở rộng bờ vai vạm vỡ cân đối",
        suggestedPlan: "4 hiệp · 12 - 15 lần/hiệp · Nghỉ 45s - 60s",
        exercises: [
            {
                num: "01",
                name: "Arnold Dumbbell Press",
                viName: "Đẩy vai xoay tạ Arnold huyền thoại",
                target: "Toàn diện 3 đầu cơ vai (Anterior, Lateral, Posterior Deltoid)",
                guide: "Bắt đầu với 2 tạ ở trước ngực ngang cằm, lòng bàn tay hướng vào mặt. Khi đẩy tạ lên cao, đồng thời xoay cẳng tay và cổ tay 180° ra ngoài sao cho khi tạ ở đỉnh, lòng bàn tay hướng về phía trước. Hạ xuống từ từ và xoay ngược lại vị trí ban đầu.",
                breathing: "💨 Đẩy lên xoay tạ thở ra — 🫁 Hạ về trước ngực hít sâu",
                tip: "Chuyển động xoay mượt mà liên tục, không nhún người hoặc giật lưng."
            },
            {
                num: "02",
                name: "Dumbbell Lateral Raise",
                viName: "Dang tạ đơn sang hai bên",
                target: "Cơ vai giữa (Lateral Deltoid) — Tác nhân chính tạo độ rộng vai",
                guide: "Đứng thẳng người, hơi nghiêng thân trên về phía trước khoảng 5°. Cầm 2 tạ trước đùi, cùi chỏ cong nhẹ. Dùng cơ vai nâng tạ sang hai bên ngang tầm vai, cùi chỏ dẫn hướng và cao hơn cổ tay. Dừng 0.5s ở đỉnh rồi hạ chậm có kiểm soát.",
                breathing: "💨 Nâng ngang vai thở ra — 🫁 Hạ tạ có kiểm soát hít sâu",
                tip: "Không vung tạ lấy đà theo quán tính. Chọn mức tạ vừa phải để cảm nhận đúng cơ vai giữa."
            }
        ]
    },
    {
        id: "tay_sau",
        category: "tay_sau",
        name: "Cơ Tay Sau",
        subName: "Triceps Workout",
        badge: "Đầu Dài · Đầu Ngoài · Đầu Trong",
        badgeColor: "bg-sky-500",
        gradientHeader: "from-sky-500 via-blue-600 to-indigo-700",
        icon: "fa-solid fa-hand-fist",
        gifUrl: "images/gym_co_tay_sau.gif",
        targetSummary: "Chiếm 60% kích thước bắp tay, tạo độ dày và săn chắc cho cánh tay",
        suggestedPlan: "4 hiệp · 12 - 15 lần/hiệp · Nghỉ 45s",
        exercises: [
            {
                num: "01",
                name: "Cable / Band Pushdown",
                viName: "Kéo dây / Cáp ép cơ tay sau",
                target: "Đầu ngoài (Lateral Head) & Đầu trong (Medial Head)",
                guide: "Đứng hơi chùng gối, thân người hơi cúi nhẹ. Khóa chặt hai cùi chỏ sát mạn sườn cố định không lay chuyển. Dùng cơ tay sau duỗi cẳng tay đẩy dây/cáp thẳng xuống sàn, tách nhẹ dây hoặc duỗi căng ở điểm cuối. Giữ co cứng cơ tay sau 1 giây trước khi thả nhẹ lên.",
                breathing: "💨 Ép duỗi thẳng tay thở ra — 🫁 Thả tay gập lên hít vào",
                tip: "Giữ bắp tay trên bất động hoàn toàn, chỉ duy nhất khớp cùi chỏ gập duỗi."
            },
            {
                num: "02",
                name: "Overhead Triceps Extension",
                viName: "Duỗi tay sau qua đầu với tạ đơn",
                target: "Đầu dài cơ tay sau (Long Head Triceps)",
                guide: "Ngồi thẳng hoặc đứng vững, dùng cả hai tay đỡ quả tạ đơn đưa lên thẳng qua đầu. Bắp tay ép sát hai bên tai. Từ từ gập cùi chỏ hạ tạ ra sau gáy đến khi cảm nhận độ căng sâu của cơ tay sau, sau đó dùng cơ tay sau đẩy tạ duỗi thẳng cánh tay lên cao.",
                breathing: "💨 Đẩy tạ duỗi thẳng thở ra — 🫁 Gập cùi chỏ hạ sau gáy hít sâu",
                tip: "Giữ cùi chỏ hướng về phía trước, tránh banh cùi chỏ quá rộng sang hai bên."
            }
        ]
    },
    {
        id: "lung",
        category: "lung",
        name: "Cơ Lưng & Xô",
        subName: "Back & Lats Workout",
        badge: "Cơ Xô · Cơ Trám · Cơ Lưng Giữa",
        badgeColor: "bg-emerald-600",
        gradientHeader: "from-emerald-500 via-teal-600 to-cyan-700",
        icon: "fa-solid fa-shield-halved",
        gifUrl: "images/gym_co_lung.gif",
        targetSummary: "Phát triển độ dày và độ rộng lưng xô, cải thiện vóc dáng thẳng lưng, chống gù",
        suggestedPlan: "4 hiệp · 10 - 12 lần/hiệp · Nghỉ 60s",
        exercises: [
            {
                num: "01",
                name: "Bent-Over Dumbbell Row",
                viName: "Cúi gập người chèo tạ đôi",
                target: "Cơ xô (Lats), cơ trám (Rhomboids) & độ dày lưng giữa",
                guide: "Đứng chân rộng bằng vai, chùng nhẹ gối, đẩy mông ra sau và cúi thân trên về trước 45°. Giữ lưng thẳng tự nhiên. Dùng cơ lưng xô kéo hai tạ ngược về phía hông, đưa cùi chỏ sát người ra sau và siết chặt hai bả vai vào nhau ở điểm cao nhất.",
                breathing: "💨 Kéo tạ ép bả vai thở ra — 🫁 Hạ tạ duỗi lưng hít vào",
                tip: "Luôn siết chặt cơ bụng và giữ thẳng lưng, tuyệt đối không gù lưng để bảo vệ cột sống."
            },
            {
                num: "02",
                name: "Single-Arm Dumbbell Row",
                viName: "Chèo tạ đơn 1 tay tựa ghế",
                target: "Cơ xô từng bên (Unilateral Lats) & cơ lưng trên",
                guide: "Đặt một bên gối và bàn tay cùng bên lên ghế phẳng tạo thế kiềng 3 chân vững chãi. Tay còn lại cầm tạ buông thẳng. Kéo tạ theo một đường cong hướng về phía hông, cùi chỏ bám sát thân người. Ép chặt cơ xô ở đỉnh rồi hạ chậm có kiểm soát.",
                breathing: "💨 Kéo tạ lên thở ra — 🫁 Hạ chậm có kiểm soát hít sâu",
                tip: "Không xoay vặn thân người khi kéo tạ; giữ hai vai luôn cân bằng song song mặt đất."
            }
        ]
    }
];

let currentGymCategory = 'all';
let gymRestTimerInterval = null;
let gymRestSecondsLeft = 0;

// Khởi tạo trạng thái đã lưu từ LocalStorage
function getGymCompletedSets() {
    try {
        const saved = localStorage.getItem('gym_completed_sets_cvhn');
        return saved ? JSON.parse(saved) : {};
    } catch(e) {
        return {};
    }
}

function saveGymCompletedSets(data) {
    try {
        localStorage.setItem('gym_completed_sets_cvhn', JSON.stringify(data));
    } catch(e) {}
}

// Chuyển đổi bộ lọc nhóm cơ
function filterGymCategory(cat) {
    currentGymCategory = cat;
    document.querySelectorAll('.gym-cat-btn').forEach(btn => {
        const btnCat = btn.getAttribute('data-cat');
        if (btnCat === cat) {
            btn.className = "gym-cat-btn whitespace-nowrap px-4 py-2.5 rounded-2xl font-black text-xs transition-all cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-300/40 scale-105";
        } else {
            btn.className = "gym-cat-btn whitespace-nowrap px-4 py-2.5 rounded-2xl font-bold text-xs bg-white text-gray-700 border border-gray-200 transition-all cursor-pointer hover:border-indigo-400";
        }
    });
    renderGymWorkout();
}

// Render danh sách bài tập Gym
function renderGymWorkout() {
    const container = document.getElementById('gymCardsContainer');
    if (!container) return;

    const completedMap = getGymCompletedSets();
    const filtered = currentGymCategory === 'all' 
        ? GYM_WORKOUT_DATA 
        : GYM_WORKOUT_DATA.filter(item => item.category === currentGymCategory);

    let html = '';

    filtered.forEach(item => {
        const setsData = completedMap[item.id] || [false, false, false, false];
        const completedCount = setsData.filter(Boolean).length;
        const progressPercent = Math.round((completedCount / 4) * 100);

        html += `
        <div class="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 transition-all hover:shadow-2xl hover:border-indigo-200">
            <!-- Header Nhóm Cơ -->
            <div class="bg-gradient-to-r ${item.gradientHeader} p-4 sm:p-5 text-white flex justify-between items-center relative overflow-hidden">
                <div class="absolute -right-6 -bottom-6 text-white/10 text-8xl pointer-events-none">
                    <i class="${item.icon}"></i>
                </div>
                <div class="relative z-10">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
                            ${item.subName}
                        </span>
                        <span class="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-400 text-gray-900 flex items-center gap-1">
                            <i class="fa-solid fa-repeat text-[8px]"></i> GIF Lặp
                        </span>
                    </div>
                    <h3 class="text-2xl font-black tracking-tight leading-tight flex items-center gap-2">
                        <i class="${item.icon} text-xl"></i> ${item.name}
                    </h3>
                    <p class="text-xs text-white/90 font-medium mt-1">${item.badge}</p>
                </div>
                <div class="relative z-10 text-right">
                    <div class="text-2xl font-black">${completedCount}/4</div>
                    <div class="text-[10px] text-white/80 font-bold uppercase tracking-wider">Hiệp Xong</div>
                </div>
            </div>

            <!-- Thanh tiến độ Set -->
            <div class="w-full bg-gray-100 h-1.5">
                <div class="bg-emerald-500 h-1.5 transition-all duration-500" style="width: ${progressPercent}%"></div>
            </div>

            <div class="p-4 sm:p-5 space-y-5">
                <!-- KHUNG HÌNH ẢNH GIF ĐỘNG CHUYỂN ĐỘNG -->
                <div class="relative rounded-2xl overflow-hidden bg-slate-900 border-2 border-indigo-100 shadow-md group">
                    <img src="${item.gifUrl}" alt="${item.name}" class="w-full h-auto max-h-[360px] object-contain mx-auto block transition-transform duration-300 group-hover:scale-[1.02]">
                    <div class="absolute bottom-2.5 right-2.5 px-3 py-1 bg-black/75 backdrop-blur-md rounded-xl text-white text-[10px] font-black flex items-center gap-1.5 border border-white/20">
                        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Động tác lặp vô tận
                    </div>
                    <div class="absolute top-2.5 left-2.5 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-xl text-gray-800 text-[10px] font-black shadow-sm">
                        ${item.suggestedPlan}
                    </div>
                </div>

                <!-- Mục tiêu tác động tóm tắt -->
                <div class="bg-indigo-50/70 border border-indigo-100/80 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-indigo-950 font-semibold">
                    <i class="fa-solid fa-bullseye text-indigo-600 mt-0.5 text-sm"></i>
                    <div>
                        <span class="font-black text-indigo-900">Mục tiêu:</span> ${item.targetSummary}
                    </div>
                </div>

                <!-- DANH SÁCH 2 BÀI TẬP CHI TIẾT -->
                <div class="space-y-4">
                    ${item.exercises.map(ex => `
                        <div class="bg-gray-50/80 rounded-2xl p-4 border border-gray-200/70 hover:bg-gray-50 transition-colors">
                            <div class="flex items-start gap-3">
                                <span class="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm shadow-indigo-300">
                                    ${ex.num}
                                </span>
                                <div class="flex-1 min-w-0">
                                    <div class="flex flex-wrap items-center gap-2">
                                        <h4 class="text-sm font-black text-gray-900">${ex.name}</h4>
                                        <span class="text-[11px] font-bold text-indigo-600 bg-indigo-100/80 px-2 py-0.5 rounded-lg">${ex.viName}</span>
                                    </div>
                                    <div class="text-[11px] font-bold text-emerald-700 mt-1 flex items-center gap-1.5">
                                        <i class="fa-solid fa-bolt text-[10px]"></i> Tác động: ${ex.target}
                                    </div>
                                    <p class="text-xs text-gray-600 mt-2 leading-relaxed">
                                        ${ex.guide}
                                    </p>
                                    <div class="mt-2.5 pt-2 border-t border-gray-200/70 flex flex-col gap-1 text-[11px]">
                                        <div class="font-bold text-gray-700 flex items-center gap-1">
                                            <span>Nhịp thở:</span> <span class="text-rose-600 font-extrabold">${ex.breathing}</span>
                                        </div>
                                        <div class="text-amber-800 font-semibold flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                                            <i class="fa-solid fa-circle-exclamation text-[10px]"></i> <span>Mẹo form: ${ex.tip}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- BỘ ĐẾM 4 HIỆP TẬP (INTERACTIVE SET CHECKER) -->
                <div class="bg-gradient-to-r from-gray-50 to-slate-100 rounded-2xl p-3.5 border border-gray-200">
                    <div class="flex justify-between items-center mb-2.5">
                        <span class="text-xs font-black text-gray-800 uppercase tracking-wide flex items-center gap-1.5">
                            <i class="fa-solid fa-clipboard-check text-indigo-600"></i> Đánh dấu 4 Hiệp (Sets) hoàn thành:
                        </span>
                        <span class="text-[11px] font-extrabold text-indigo-600">${completedCount}/4 Đạt</span>
                    </div>
                    <div class="grid grid-cols-4 gap-2">
                        ${[0, 1, 2, 3].map(setIdx => {
                            const isDone = setsData[setIdx];
                            return `
                                <button onclick="toggleGymSet('${item.id}', ${setIdx})" class="py-2.5 px-1 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center gap-1 cursor-pointer border ${isDone ? 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-200 scale-[1.02]' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/50'}">
                                    <span class="text-[10px] uppercase font-bold text-opacity-80">Hiệp ${setIdx + 1}</span>
                                    <i class="fa-solid ${isDone ? 'fa-circle-check text-sm' : 'fa-circle text-xs text-gray-300'}"></i>
                                </button>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- THANH NÚT NHANH BẤM GIỜ NGHỈ CHO BÀI TẬP NÀY -->
                <div class="flex items-center justify-between pt-1">
                    <span class="text-[11px] font-bold text-gray-500 flex items-center gap-1">
                        <i class="fa-solid fa-stopwatch text-indigo-500"></i> Nghỉ giữa hiệp:
                    </span>
                    <div class="flex items-center gap-1.5">
                        <button onclick="startGymRestTimer(30)" class="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-gray-200 hover:border-indigo-400 rounded-lg text-[11px] font-black text-gray-700 transition-all cursor-pointer">
                            30s
                        </button>
                        <button onclick="startGymRestTimer(45)" class="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-gray-200 hover:border-indigo-400 rounded-lg text-[11px] font-black text-gray-700 transition-all cursor-pointer">
                            45s
                        </button>
                        <button onclick="startGymRestTimer(60)" class="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-gray-200 hover:border-indigo-400 rounded-lg text-[11px] font-black text-indigo-700 transition-all cursor-pointer bg-indigo-50/50 border-indigo-300">
                            60s
                        </button>
                        <button onclick="startGymRestTimer(90)" class="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-gray-200 hover:border-indigo-400 rounded-lg text-[11px] font-black text-gray-700 transition-all cursor-pointer">
                            90s
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;
    });

    container.innerHTML = html;
}

// Bật tắt trạng thái Set của bài tập
function toggleGymSet(groupId, setIdx) {
    const data = getGymCompletedSets();
    if (!data[groupId]) {
        data[groupId] = [false, false, false, false];
    }
    data[groupId][setIdx] = !data[groupId][setIdx];
    saveGymCompletedSets(data);

    if (data[groupId][setIdx] && typeof confetti === 'function') {
        confetti({
            particleCount: 25,
            spread: 45,
            origin: { y: 0.8 }
        });
    }

    renderGymWorkout();

    // Tự động nhắc bật đồng hồ nghỉ 60s nếu vừa hoàn thành set
    if (data[groupId][setIdx]) {
        if (typeof showNotify === 'function') {
            showNotify(`💪 Đã hoàn thành Hiệp ${setIdx + 1}! Hãy nghỉ ngơi lấy sức.`);
        }
    }
}

// Đặt lại toàn bộ tiến độ tập luyện hôm nay
function resetGymWorkoutTracker() {
    if (!confirm('Bạn có chắc muốn đặt lại tất cả các hiệp tập để bắt đầu buổi mới không?')) return;
    saveGymCompletedSets({});
    renderGymWorkout();
    if (typeof showNotify === 'function') {
        showNotify('🔄 Đã làm mới tiến độ tập luyện hôm nay!');
    }
}

// Bắt đầu bấm giờ nghỉ giữa hiệp
function startGymRestTimer(seconds) {
    if (gymRestTimerInterval) {
        clearInterval(gymRestTimerInterval);
        gymRestTimerInterval = null;
    }

    gymRestSecondsLeft = seconds;
    const bar = document.getElementById('gymTimerFloatingBar');
    const label = document.getElementById('gymTimerCountdown');
    if (bar) bar.classList.remove('hidden');
    if (label) label.textContent = `${gymRestSecondsLeft}s`;

    if (typeof showNotify === 'function') {
        showNotify(`⏱️ Đang bấm giờ nghỉ ${seconds}s... Chuẩn bị cho hiệp tiếp theo!`);
    }

    gymRestTimerInterval = setInterval(() => {
        gymRestSecondsLeft--;
        if (label) label.textContent = `${gymRestSecondsLeft}s`;

        if (gymRestSecondsLeft <= 0) {
            clearInterval(gymRestTimerInterval);
            gymRestTimerInterval = null;
            if (label) label.textContent = '0s';
            if (bar) bar.classList.add('hidden');
            
            // Thông báo hết giờ nghỉ
            if (typeof showNotify === 'function') {
                showNotify('🔔 HẾT GIỜ NGHỈ! Hãy vào hiệp tập tiếp theo ngay nào!');
            }
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 50,
                    spread: 60,
                    origin: { y: 0.7 }
                });
            }
        }
    }, 1000);
}

// Hủy đồng hồ nghỉ
function stopGymRestTimer() {
    if (gymRestTimerInterval) {
        clearInterval(gymRestTimerInterval);
        gymRestTimerInterval = null;
    }
    const bar = document.getElementById('gymTimerFloatingBar');
    if (bar) bar.classList.add('hidden');
    if (typeof showNotify === 'function') {
        showNotify('⏹️ Đã dừng đồng hồ nghỉ');
    }
}

// Khởi chạy khi tài liệu sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    // Tự động render bài tập nếu đang ở viewGymWorkout
    renderGymWorkout();
});
