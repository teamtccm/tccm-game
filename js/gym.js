/**
 * TẬP THỂ THAO — CÔNG VIỆC HẰNG NGÀY
 * Thiết kế tối giản: Chỉ hiển thị tên bài tập & ảnh động GIF chuyển động
 */

const GYM_WORKOUT_DATA = [
    {
        id: "nguc",
        category: "nguc",
        name: "Cơ Ngực",
        categoryLabel: "Ngực",
        exercisesText: "1. Đẩy tạ sàn (Floor Press) · 2. Banh ngực nghiêng (Incline Fly)",
        gradientHeader: "from-rose-500 via-pink-600 to-red-600",
        icon: "fa-solid fa-heart-pulse",
        gifUrl: "images/gym_co_nguc.gif"
    },
    {
        id: "vai",
        category: "vai",
        name: "Cơ Vai",
        categoryLabel: "Vai",
        exercisesText: "1. Đẩy vai xoay Arnold · 2. Dang tạ hai bên (Lateral Raise)",
        gradientHeader: "from-indigo-600 via-violet-600 to-purple-700",
        icon: "fa-solid fa-angles-up",
        gifUrl: "images/gym_co_vai.gif"
    },
    {
        id: "tay_sau",
        category: "tay_sau",
        name: "Cơ Tay Sau",
        categoryLabel: "Tay Sau",
        exercisesText: "1. Kéo cáp ép tay sau (Pushdown) · 2. Duỗi tay sau qua đầu (Overhead)",
        gradientHeader: "from-sky-500 via-blue-600 to-indigo-700",
        icon: "fa-solid fa-hand-fist",
        gifUrl: "images/gym_co_tay_sau.gif"
    },
    {
        id: "lung",
        category: "lung",
        name: "Cơ Lưng & Xô",
        categoryLabel: "Lưng - Xô",
        exercisesText: "1. Chèo tạ đôi (Bent-Over Row) · 2. Chèo tạ 1 tay tựa ghế (Single-Arm Row)",
        gradientHeader: "from-emerald-500 via-teal-600 to-cyan-700",
        icon: "fa-solid fa-shield-halved",
        gifUrl: "images/gym_co_lung.gif"
    }
];

let currentGymCategory = 'all';

// Chuyển tab lọc nhóm cơ
function filterGymCategory(cat) {
    currentGymCategory = cat;
    document.querySelectorAll('.gym-cat-btn').forEach(btn => {
        const btnCat = btn.getAttribute('data-cat');
        if (btnCat === cat) {
            btn.className = "gym-cat-btn whitespace-nowrap px-4 py-2 rounded-2xl font-black text-xs transition-all cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-300/40 scale-105";
        } else {
            btn.className = "gym-cat-btn whitespace-nowrap px-4 py-2 rounded-2xl font-bold text-xs bg-white text-gray-700 border border-gray-200 transition-all cursor-pointer hover:border-indigo-400";
        }
    });
    renderGymWorkout();
}

// Render các bài tập (Tối giản: Tên bài tập + Ảnh GIF chuyển động)
function renderGymWorkout() {
    const container = document.getElementById('gymCardsContainer');
    if (!container) return;

    const filtered = currentGymCategory === 'all' 
        ? GYM_WORKOUT_DATA 
        : GYM_WORKOUT_DATA.filter(item => item.category === currentGymCategory);

    let html = '';

    filtered.forEach(item => {
        html += `
        <div class="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-200/80 transition-all">
            <!-- Tên nhóm cơ & tên bài tập -->
            <div class="bg-gradient-to-r ${item.gradientHeader} px-5 py-3.5 text-white flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-lg shadow-inner">
                        <i class="${item.icon}"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-black tracking-tight leading-tight">${item.name}</h3>
                        <p class="text-xs text-white/90 font-semibold mt-0.5">${item.exercisesText}</p>
                    </div>
                </div>
                <span class="text-[11px] font-black px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
                    ${item.categoryLabel}
                </span>
            </div>

            <!-- Khung hiển thị ảnh GIF chuyển động lặp -->
            <div class="bg-slate-950 p-2 sm:p-3 flex items-center justify-center">
                <img src="${item.gifUrl}" alt="${item.name}" class="w-full h-auto max-h-[420px] object-contain rounded-2xl">
            </div>
        </div>
        `;
    });

    container.innerHTML = html;
}

// Tự động render khi tải trang
document.addEventListener('DOMContentLoaded', () => {
    renderGymWorkout();
});
