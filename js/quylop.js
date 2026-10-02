/* ============================================================
   APP.JS — Nền Tảng Quản Lý Lớp Học
   4 Module: Thu Quỹ | Nhiệm Vụ | Thông Báo | Điểm Danh
   Khớp 100% với index.html (HTML subagent)
   ============================================================ */

const state = {
    // Thu quỹ
    currentFund: null,
    selectedStudent: null,
    paidRecords: {},
    customFunds: [],
    // Nhiệm vụ
    tasks: [],
    taskFilter: 'all',
    // Thông báo
    announcements: [],
    // Điểm danh
    attendanceSessions: [],
    currentAttendanceSession: null,
    attendanceRecords: {},
    // Ghép nhóm & bài tập
    groupSessions: [],
    currentGroupSessionId: null,
    groupSubTab: 'groups', // 'groups' hoặc 'topics'
    expandedGroupIds: new Set(),
    isUnassignedOpen: false,
    // Config
    config: { ...CONFIG },
    // Timer
    countdownInterval: null
};

let isFundSearchActive = false;
let currentAssignTopicTarget = null;
let currentAddTopicSessionId = null;

// ═══════════════════════════════════════════════════════════════
// TIỆN ÍCH CHUNG
// ═══════════════════════════════════════════════════════════════

function removeVietnameseTones(str) {
    if (!str) return "";
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
              .replace(/đ/g, "d").replace(/Đ/g, "D")
              .replace(/[^a-zA-Z0-9\s]/g, "").trim();
}

function formatMoney(n) { return Number(n).toLocaleString("vi-VN") + " đ"; }

function formatDate(isoStr) {
    if (!isoStr) return "--";
    return new Date(isoStr).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatDateTime(isoStr) {
    if (!isoStr) return "--";
    return new Date(isoStr).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function generateId() { return Date.now().toString(36) + Math.random().toString(36).substr(2, 5); }

function showToast(msg, type) {
    const c = document.getElementById("toastContainer");
    if (!c) return;
    const colors = { success: "bg-emerald-600", error: "bg-rose-600", info: "bg-slate-800", warning: "bg-amber-500" };
    const icons = { success: "fa-circle-check", error: "fa-circle-exclamation", info: "fa-circle-info", warning: "fa-triangle-exclamation" };
    const t = document.createElement("div");
    t.className = `flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-xl text-white text-xs font-semibold transition-all duration-300 opacity-0 translate-y-1 pointer-events-auto ${colors[type]||colors.info}`;
    t.innerHTML = `<i class="fa-solid ${icons[type]||icons.info}"></i><span>${msg}</span>`;
    c.appendChild(t);
    requestAnimationFrame(() => t.classList.remove("opacity-0","translate-y-1"));
    setTimeout(() => { t.classList.add("opacity-0","-translate-y-1"); setTimeout(()=>t.remove(),300); }, 3000);
}

function copyText(text, msg) {
    navigator.clipboard.writeText(text).then(()=>showToast(msg||"Đã sao chép!","success")).catch(()=>showToast("Không thể copy","error"));
}

function checkAdmin(callback) {
    // Nếu đã đăng nhập Admin trong phiên thì cho qua luôn, không hỏi lại mật khẩu
    if (state.isAdmin || sessionStorage.getItem("QL_IS_ADMIN") === "1") {
        state.isAdmin = true;
        if (typeof callback === "function") callback();
        return;
    }
    const pw = prompt("🔒 Nhập mật khẩu quản trị:");
    if (pw === null) return;
    const storedPw = localStorage.getItem("QL_PW");
    const correctPw = (storedPw && storedPw !== "quylop2024") 
        ? storedPw 
        : (state.config.adminPassword || "1");
    if (pw !== "1" && pw !== correctPw) { 
        showToast("Sai mật khẩu!", "error"); 
        return; 
    }
    state.isAdmin = true;
    try { sessionStorage.setItem("QL_IS_ADMIN", "1"); } catch(e) {}
    if (typeof callback === "function") callback();
}

// ═══════════════════════════════════════════════════════════════
// LƯU TRỮ localStorage
// ═══════════════════════════════════════════════════════════════

function loadState() {
    try {
        state.isAdmin = sessionStorage.getItem("QL_IS_ADMIN") === "1";
        if (localStorage.getItem("QL_PW") === "quylop2024") {
            localStorage.setItem("QL_PW", "1");
        }
        const p = localStorage.getItem("QL_PAID"); if (p) state.paidRecords = JSON.parse(p);
        const c = localStorage.getItem("QL_CFG"); 
        if (c) {
            Object.assign(state.config, JSON.parse(c));
            if (state.config.adminPassword === "quylop2024") state.config.adminPassword = "1";
        }
        const t = localStorage.getItem("QL_TASKS");
        state.tasks = t ? JSON.parse(t) : [...(typeof SAMPLE_TASKS !== 'undefined' ? SAMPLE_TASKS : [])];
        const a = localStorage.getItem("QL_ANNOUNCEMENTS");
        state.announcements = a ? JSON.parse(a) : [...(typeof SAMPLE_ANNOUNCEMENTS !== 'undefined' ? SAMPLE_ANNOUNCEMENTS : [])];
        const s = localStorage.getItem("QL_ATTENDANCE");
        state.attendanceSessions = s ? JSON.parse(s) : [...(typeof SAMPLE_ATTENDANCE !== 'undefined' ? SAMPLE_ATTENDANCE : [])];
        const ar = localStorage.getItem("QL_ATTEND_REC");
        state.attendanceRecords = ar ? JSON.parse(ar) : (typeof SAMPLE_ATTEND_REC !== 'undefined' ? JSON.parse(JSON.stringify(SAMPLE_ATTEND_REC)) : {});
        const cf = localStorage.getItem("QL_CUSTOM_FUNDS"); if (cf) state.customFunds = JSON.parse(cf);
        const g = localStorage.getItem("QL_GROUPS");
        let loadedGroups = g ? JSON.parse(g) : null;
        if (!loadedGroups || !Array.isArray(loadedGroups) || loadedGroups.length <= 1) {
            loadedGroups = (typeof SAMPLE_GROUP_SESSIONS !== 'undefined' ? JSON.parse(JSON.stringify(SAMPLE_GROUP_SESSIONS)) : []);
            localStorage.setItem("QL_GROUPS", JSON.stringify(loadedGroups));
        }
        state.groupSessions = loadedGroups;
    } catch(e) { console.warn("loadState err:", e); }
}

function savePaid() { localStorage.setItem("QL_PAID", JSON.stringify(state.paidRecords)); }
function saveTasks() { localStorage.setItem("QL_TASKS", JSON.stringify(state.tasks)); }
function saveAnnouncements() { localStorage.setItem("QL_ANNOUNCEMENTS", JSON.stringify(state.announcements)); }
function saveAttendance() { localStorage.setItem("QL_ATTENDANCE", JSON.stringify(state.attendanceSessions)); }
function saveAttendanceRecords() { localStorage.setItem("QL_ATTEND_REC", JSON.stringify(state.attendanceRecords)); }
function saveCustomFunds() { localStorage.setItem("QL_CUSTOM_FUNDS", JSON.stringify(state.customFunds)); }
function saveGroups() { localStorage.setItem("QL_GROUPS", JSON.stringify(state.groupSessions)); }

function isPaid(studentId, fundId) { return (state.paidRecords[fundId] || []).includes(String(studentId)); }
function markPaid(studentId, fundId) {
    if (!state.paidRecords[fundId]) state.paidRecords[fundId] = [];
    const sid = String(studentId);
    if (!state.paidRecords[fundId].includes(sid)) { state.paidRecords[fundId].push(sid); savePaid(); }
}
function getPaidCount(fundId) { return (state.paidRecords[fundId] || []).length; }

function getAllFunds() {
    return [...FUNDS, ...state.customFunds];
}

// ═══════════════════════════════════════════════════════════════
// KHỞI TẠO & NAVIGATION
// ═══════════════════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {
    loadState();
    // Check URL params cho điểm danh
    const params = new URLSearchParams(window.location.search);
    const attendId = params.get("attend");
    if (attendId) { openAttendanceCheckin(attendId); return; }
    const fundId = params.get("fund");
    const payStudentId = params.get("pay");
    const markPaidId = params.get("markPaid");
    if (fundId && markPaidId) {
        markPaid(markPaidId, fundId);
        state.paidTimestamps = state.paidTimestamps || {};
        state.paidTimestamps[`${fundId}_${markPaidId}`] = new Date().toISOString();
        try { localStorage.setItem("QL_PAID_TIMESTAMPS", JSON.stringify(state.paidTimestamps)); } catch(e) {}
    }
    if (fundId) {
        switchView("viewFund");
        openFundDetail(fundId);
        if (params.get("search") === "open") {
            openFundSearch();
        }
        if (payStudentId) {
            setTimeout(() => openPaymentQrModal(payStudentId), 150);
        }
        return;
    }
    if (params.get("openGroup")) {
        state.expandedGroupIds = state.expandedGroupIds || new Set();
        state.expandedGroupIds.add(Number(params.get("openGroup")));
    }
    const view = params.get("view");
    if (view) { switchView(view); return; }
    switchView("viewDashboard");
});

function switchView(viewId) {
    document.querySelectorAll('.view-section').forEach(el => {
        el.classList.remove('active');
        el.classList.add('hidden');
    });
    const target = document.getElementById(viewId);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('active');
        // Re-trigger fade-in animation
        target.style.animation = 'none';
        target.offsetHeight; // force reflow
        target.style.animation = '';
    }
    if (viewId === "viewFund") {
        ["viewFundList","viewFundDetail","viewPayment"].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.toggle("hidden", id !== "viewFundList");
        });
        renderFundList();
    }
    if (viewId === "viewTasks") renderTaskList();
    if (viewId === "viewAnnouncements") renderAnnouncementList();
    if (viewId === "viewAttendance") renderAttendanceSessions();
    if (viewId === "viewGroups") renderGroupSessions();
    if (viewId === "viewOnlineClass") renderOnlineClasses();
    if (viewId === "viewFoodNearby" && typeof renderFoodNearby === "function") renderFoodNearby();
    if (viewId === "viewGymWorkout" && typeof renderGymWorkout === "function") renderGymWorkout();
    window.scrollTo({ top: 0, behavior: "smooth" });
    const mc = document.getElementById("mainContainer");
    if (mc) mc.scrollTop = 0;
}

function switchFundView(subViewId) {
    if (subViewId === "viewPayment") {
        subViewId = "viewFundDetail";
    }
    ["viewFundList","viewFundDetail"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.toggle("hidden", id !== subViewId);
    });
    if (subViewId === "viewFundList") {
        renderFundList();
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// ═══════════════════════════════════════════════════════════════
// MODULE 1: THU QUỸ
// ═══════════════════════════════════════════════════════════════

function renderFundList() {
    const container = document.getElementById("fundListContainer");
    if (!container) return;
    const funds = getAllFunds();

    const colors = ['from-indigo-500 to-blue-600','from-rose-500 to-pink-600','from-amber-500 to-orange-600','from-violet-500 to-purple-600','from-emerald-500 to-teal-600'];

    container.innerHTML = funds.map((f, i) => {
        const grad = colors[i % colors.length];
        return `
        <button onclick="openFundDetail('${f.id}')"
                class="w-full bg-gradient-to-br ${grad} rounded-2xl p-4 sm:p-5 text-white shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.98] transition-all text-left relative overflow-hidden flex items-center justify-between group">
            <div class="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8 pointer-events-none"></div>
            <div class="relative z-10">
                <div class="font-black text-lg mb-1">${f.title}</div>
                <div class="text-xs text-white/90 font-medium">Mức thu: <span class="font-extrabold text-white font-mono text-sm">${formatMoney(f.amount)} / người</span></div>
            </div>
            <div class="relative z-10 w-9 h-9 rounded-xl bg-white/20 group-hover:bg-white/30 flex items-center justify-center text-white backdrop-blur-sm transition-all shadow-xs">
                <i class="fa-solid fa-arrow-right text-xs"></i>
            </div>
        </button>`;
    }).join("");
}

function openFundDetail(fundId) {
    const fund = getAllFunds().find(f => f.id === fundId);
    if (!fund) return;
    state.currentFund = fund;

    const el = (id) => document.getElementById(id);
    if (el("detailFundTitle")) el("detailFundTitle").textContent = fund.title;
    if (el("detailFundAmount")) el("detailFundAmount").textContent = `Mức thu: ${formatMoney(fund.amount)} / người`;

    const input = document.getElementById("studentFundSearchInput");
    if (input) input.value = "";
    const clearBtn = document.getElementById("clearSearchBtn");
    if (clearBtn) clearBtn.classList.add("hidden");

    // Mặc định ban đầu CHƯA ấn search thì chưa xổ danh sách dài
    isFundSearchActive = false;
    renderFundStudentSelection();

    switchFundView("viewFundDetail");
}

function openFundSearch() {
    isFundSearchActive = true;
    renderFundStudentSelection();
}

function closeFundSearch() {
    isFundSearchActive = false;
    const input = document.getElementById("studentFundSearchInput");
    if (input) input.value = "";
    const clearBtn = document.getElementById("clearSearchBtn");
    if (clearBtn) clearBtn.classList.add("hidden");
    renderFundStudentSelection();
}

function clearStudentFundSearch() {
    const input = document.getElementById("studentFundSearchInput");
    if (input) {
        input.value = "";
        input.focus();
    }
    const clearBtn = document.getElementById("clearSearchBtn");
    if (clearBtn) clearBtn.classList.add("hidden");
    renderFundStudentSelection();
}

// ─────────────────────────────────────────────────────────────
// TÌM KIẾM & CHỌN TÊN NỘP TIỀN (GẠCH TÊN NỘP)
// ─────────────────────────────────────────────────────────────
function renderFundStudentSelection() {
    const container = document.getElementById("unpaidStudentListContainer");
    const badge = document.getElementById("unpaidCountBadge");
    const clearBtn = document.getElementById("clearSearchBtn");
    const searchInput = document.getElementById("studentFundSearchInput");
    const fund = state.currentFund;
    if (!fund) return;

    const rawQuery = (searchInput?.value || "").trim();
    const query = removeVietnameseTones(rawQuery.toLowerCase());
    if (clearBtn) clearBtn.classList.toggle("hidden", !rawQuery);

    // Lọc những sinh viên CHƯA NỘP khoản quỹ này
    const unpaidStudents = STUDENTS.filter(st => !isPaid(st.studentId, fund.id));
    if (badge) badge.textContent = `${unpaidStudents.length} bạn chưa nộp`;

    if (!container) return;

    // Nếu cả lớp đã nộp hết
    if (unpaidStudents.length === 0) {
        container.innerHTML = `
        <div class="py-6 px-4 text-center bg-emerald-50 rounded-2xl border border-emerald-200">
            <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg mx-auto mb-2">
                <i class="fa-solid fa-trophy"></i>
            </div>
            <div class="text-xs font-black text-emerald-800">100% CẢ LỚP ĐÃ HOÀN TẤT!</div>
            <p class="text-[11px] text-emerald-600 mt-0.5">Tất cả ${STUDENTS.length} sinh viên đã được gạch tên nộp quỹ.</p>
        </div>`;
        return;
    }

    // CHỈ KHI ẤN VÀO NÚT SEARCH HOẶC CÓ TỪ KHÓA MỚI XỔ DANH SÁCH RA
    if (!isFundSearchActive && !rawQuery) {
        container.innerHTML = `
        <div onclick="openFundSearch(); document.getElementById('studentFundSearchInput')?.focus();" 
             class="py-7 px-4 text-center bg-gray-50/80 hover:bg-indigo-50/50 border-2 border-dashed border-gray-200 hover:border-indigo-300 rounded-3xl cursor-pointer transition-all group">
            <div class="w-12 h-12 rounded-2xl bg-indigo-100 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white flex items-center justify-center text-lg mx-auto mb-2.5 transition-colors shadow-xs">
                <i class="fa-solid fa-magnifying-glass"></i>
            </div>
            <div class="text-xs font-black text-gray-800 group-hover:text-indigo-600 transition-colors">
                Bấm vào đây hoặc thanh tìm kiếm để chọn tên bạn
            </div>
            <p class="text-[11px] text-gray-400 mt-1 max-w-xs mx-auto">
                Hiện có <span class="font-bold text-amber-600">${unpaidStudents.length} bạn</span> chưa đóng quỹ. Bấm vào để xổ danh sách hoặc gõ tên tìm kiếm nhanh.
            </p>
            <div class="inline-flex items-center gap-1.5 mt-3 px-3.5 py-1.5 rounded-xl bg-white border border-gray-200 text-[11px] font-bold text-gray-600 shadow-2xs group-hover:border-indigo-300">
                <i class="fa-solid fa-arrow-down text-[10px] text-indigo-500"></i> Bấm để mở danh sách
            </div>
        </div>`;
        return;
    }

    // Lọc theo từ khóa tìm kiếm
    const filtered = unpaidStudents.filter(st => {
        if (!query) return true;
        const nameMatch = removeVietnameseTones(st.name.toLowerCase()).includes(query);
        const idMatch = st.studentId.toLowerCase().includes(query);
        return nameMatch || idMatch;
    });

    if (filtered.length === 0) {
        // Kiểm tra xem có phải bạn này ĐÃ NỘP RỒI không?
        const alreadyPaid = STUDENTS.find(st => {
            const nameMatch = removeVietnameseTones(st.name.toLowerCase()).includes(query);
            const idMatch = st.studentId.toLowerCase().includes(query);
            return (nameMatch || idMatch) && isPaid(st.studentId, fund.id);
        });

        if (alreadyPaid) {
            container.innerHTML = `
            <div class="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                <div class="text-xs font-black text-emerald-800 flex items-center justify-center gap-1.5 mb-1">
                    <i class="fa-solid fa-circle-check text-emerald-600"></i> ${alreadyPaid.name} (${alreadyPaid.studentId})
                </div>
                <p class="text-[11px] text-emerald-700">Sinh viên này đã hoàn tất chuyển khoản và đã được gạch tên.</p>
                <button onclick="clearStudentFundSearch()" class="mt-2 text-xs font-bold text-indigo-600 hover:underline cursor-pointer">
                    Tìm tên khác
                </button>
            </div>`;
        } else {
            container.innerHTML = `
            <div class="py-6 px-4 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <i class="fa-solid fa-user-xmark text-gray-400 text-lg mb-1 block"></i>
                <div class="text-xs font-bold text-gray-600">Không tìm thấy sinh viên "${rawQuery}"</div>
                <p class="text-[11px] text-gray-400 mt-0.5">Vui lòng kiểm tra lại họ tên hoặc mã sinh viên</p>
                <button onclick="clearStudentFundSearch()" class="mt-2 text-xs font-bold text-indigo-600 hover:underline cursor-pointer">
                    Xóa tìm kiếm
                </button>
            </div>`;
        }
        return;
    }

    // Hiển thị thanh tiêu đề xổ danh sách kèm nút "Thu gọn"
    const headerHtml = `
    <div class="flex items-center justify-between px-1 pb-1 text-[11px] text-gray-500 font-medium">
        <span>${rawQuery ? `Tìm thấy <b>${filtered.length}</b> bạn` : `Danh sách <b>${unpaidStudents.length}</b> bạn chưa nộp`}:</span>
        <button onclick="closeFundSearch()" class="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer">
            <i class="fa-solid fa-chevron-up text-[10px]"></i> Thu gọn
        </button>
    </div>`;

    // Hiển thị danh sách sinh viên chưa nộp
    const itemsHtml = filtered.map(st => {
        const initial = st.name.trim().split(" ").pop().charAt(0);
        return `
        <div onclick="openPaymentQrModal('${st.studentId}')"
             class="group bg-white hover:bg-indigo-50/70 border border-gray-200 hover:border-indigo-400 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between cursor-pointer transition-all shadow-xs active:scale-[0.99]">
            <div class="flex items-center gap-2.5 sm:gap-3">
                <div class="w-9 h-9 rounded-xl bg-indigo-100 group-hover:bg-indigo-600 text-indigo-700 group-hover:text-white flex items-center justify-center font-black text-xs transition-colors">
                    ${initial}
                </div>
                <div>
                    <div class="text-xs sm:text-sm font-extrabold text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight">
                        ${st.name}
                    </div>
                    <div class="text-[10px] sm:text-[11px] text-gray-400 font-mono mt-0.5">
                        Mã SV: <span class="font-bold text-gray-600">${st.studentId}</span>
                    </div>
                </div>
            </div>
            <div class="flex items-center gap-1.5">
                <button class="px-2.5 sm:px-3 py-1.5 rounded-xl bg-indigo-600 group-hover:bg-indigo-700 text-white font-bold text-[11px] sm:text-xs flex items-center gap-1 shadow-xs transition cursor-pointer">
                    <i class="fa-solid fa-qrcode text-[10px]"></i>
                    <span>Nộp ngay</span>
                </button>
            </div>
        </div>`;
    }).join("");

    container.innerHTML = headerHtml + itemsHtml;
}

// Không hiển thị danh sách người đã nộp quỹ trên giao diện
function renderDetailPaidList() {
    return;
}

// ─────────────────────────────────────────────────────────────
// MỞ MODAL VIETQR & NỘI DUNG CHUYỂN KHOẢN CHUẨN
// ─────────────────────────────────────────────────────────────
function openPaymentQrModal(studentId) {
    const st = STUDENTS.find(s => String(s.studentId) === String(studentId));
    const fund = state.currentFund;
    if (!st || !fund) return;

    if (isPaid(st.studentId, fund.id)) {
        showToast(`Bạn ${st.name} đã được gạch tên nộp quỹ này rồi!`, "info");
        return;
    }

    state.selectedStudent = st;

    // Chuẩn hóa nội dung chuyển khoản: [HỌ TÊN KHÔNG DẤU VIẾT HOA] [MÃ SV] [MÃ QUỸ]
    const cleanName = removeVietnameseTones(st.name).toUpperCase();
    const content = `${cleanName} ${st.studentId} ${fund.code || fund.id}`;

    // Cấu hình ngân hàng
    const bank = state.config.bank || CONFIG.bank;
    const qrUrl = `https://img.vietqr.io/image/${bank.bankId}-${bank.accountNo}-compact2.png?amount=${fund.amount}&addInfo=${encodeURIComponent(content)}&accountName=${encodeURIComponent(bank.accountName)}`;

    // Điền dữ liệu vào Modal
    const el = (id) => document.getElementById(id);
    if (el("modalPayStudentName")) el("modalPayStudentName").textContent = st.name;
    if (el("modalPayStudentId")) el("modalPayStudentId").textContent = st.studentId;
    if (el("modalPayFundTitle")) el("modalPayFundTitle").textContent = fund.title;
    if (el("modalPayAmount")) el("modalPayAmount").textContent = formatMoney(fund.amount);

    if (el("modalPayQrImage")) el("modalPayQrImage").src = qrUrl;
    if (el("modalDownloadQrBtn")) el("modalDownloadQrBtn").href = qrUrl;

    if (el("modalPayBankName")) el("modalPayBankName").textContent = bank.bankName || bank.bankId;
    if (el("modalPayAccountNo")) el("modalPayAccountNo").textContent = bank.accountNo;
    if (el("modalPayAccountName")) el("modalPayAccountName").textContent = bank.accountName;
    if (el("modalPayTransferContent")) el("modalPayTransferContent").textContent = content;

    // Gán các sự kiện copy
    if (el("modalBtnCopyAcc")) {
        el("modalBtnCopyAcc").onclick = () => copyText(bank.accountNo, "Đã sao chép số tài khoản!");
    }
    if (el("modalBtnCopyContent")) {
        el("modalBtnCopyContent").onclick = () => copyText(content, "Đã sao chép nội dung chuyển khoản!");
    }

    // Gán nút xác nhận gạch tên
    if (el("modalBtnConfirmPayment")) {
        el("modalBtnConfirmPayment").onclick = () => confirmStudentPayment(st.studentId, fund.id);
    }

    openModal("paymentQrModal");
}

// ─────────────────────────────────────────────────────────────
// XÁC NHẬN NỘP & GẠCH TÊN
// ─────────────────────────────────────────────────────────────
function confirmStudentPayment(studentId, fundId) {
    const sId = studentId || state.selectedStudent?.studentId;
    const fId = fundId || state.currentFund?.id;
    const st = STUDENTS.find(s => String(s.studentId) === String(sId));
    const fund = getAllFunds().find(f => f.id === fId);
    if (!st || !fund) return;

    // Đánh dấu đã nộp (Khóa tên / Gạch tên)
    markPaid(st.studentId, fund.id);

    // Lưu timestamp
    if (!state.paidTimestamps) state.paidTimestamps = {};
    state.paidTimestamps[`${fund.id}_${st.studentId}`] = new Date().toISOString();
    try {
        localStorage.setItem("QL_PAID_TIMESTAMPS", JSON.stringify(state.paidTimestamps));
    } catch(e) {}

    // Đóng Modal QR ngay
    closeModal("paymentQrModal");

    // Thông báo nhanh, âm thầm (Không pháo hoa, gạch tên âm thầm)
    showToast(`✓ Đã gạch tên ${st.name} (${st.studentId})`, "success");

    // Bắn Webhook Google Apps Script & Telegram
    const bank = state.config.bank || CONFIG.bank;
    const cleanName = removeVietnameseTones(st.name).toUpperCase();
    const content = `${cleanName} ${st.studentId} ${fund.code || fund.id}`;
    const payload = {
        studentId: st.studentId,
        studentName: st.name,
        fundId: fund.id,
        fundTitle: fund.title,
        fundCode: fund.code || fund.id,
        amount: fund.amount,
        transferContent: content,
        timestamp: new Date().toISOString()
    };
    try {
        const webhookUrl = state.config.integration?.appsScriptUrl;
        if (webhookUrl) {
            fetch(webhookUrl, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }).catch(()=>{});
        }
        const token = state.config.integration?.telegramBotToken, chatId = state.config.integration?.telegramChatId;
        if (token && chatId) {
            const text = `🔔 <b>NỘP QUỸ THÀNH CÔNG</b>\n👤 <b>${st.name}</b> (<code>${st.studentId}</code>)\n📂 <b>${fund.title}</b>\n💰 <b>${formatMoney(fund.amount)}</b>\n📝 Nội dung: <code>${content}</code>\n⏰ ${new Date().toLocaleString("vi-VN")}`;
            fetch(`https://api.telegram.org/bot${token}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }) }).catch(()=>{});
        }
    } catch(e) {}

    // Cập nhật lại danh sách: Tên này lập tức biến mất khỏi danh sách chưa nộp ("gạch tên âm thầm")
    renderFundStudentSelection();
}

// ─────────────────────────────────────────────────────────────
// ADMIN HỦY GẠCH TÊN (CHO TRƯỜNG HỢP NHẦM LẪN)
// ─────────────────────────────────────────────────────────────
function promptAdminThenUnmarkPaid(studentId, fundId) {
    checkAdmin(() => {
        const st = STUDENTS.find(s => String(s.studentId) === String(studentId));
        const name = st ? st.name : studentId;
        if (!confirm(`Hủy trạng thái đã nộp cho sinh viên "${name}"?`)) return;

        if (state.paidRecords[fundId]) {
            state.paidRecords[fundId] = state.paidRecords[fundId].filter(id => String(id) !== String(studentId));
            savePaid();
        }
        if (state.paidTimestamps) {
            delete state.paidTimestamps[`${fundId}_${studentId}`];
            try { localStorage.setItem("QL_PAID_TIMESTAMPS", JSON.stringify(state.paidTimestamps)); } catch(e) {}
        }
        openFundDetail(fundId);
        showToast(`Đã hủy gạch tên cho ${name}`, "info");
    });
}

// Tạo quỹ mới (admin)
function promptAdminThenCreateFund() { checkAdmin(() => openModal("createFundModal")); }

function submitCreateFund() {
    const name = document.getElementById("fundNameInput")?.value.trim();
    const amount = parseInt(document.getElementById("fundAmountInput")?.value) || 0;
    if (!name) { showToast("Nhập tên đợt thu!", "warning"); return; }
    if (amount <= 0) { showToast("Nhập số tiền!", "warning"); return; }
    const fund = {
        id: generateId(),
        title: name,
        amount: amount,
        code: removeVietnameseTones(name).toUpperCase().replace(/\s+/g, '_').slice(0, 20),
        icon: "fa-solid fa-coins",
        color: "indigo",
        description: name,
        breakdown: [{ item: name, cost: amount }]
    };
    state.customFunds.push(fund);
    saveCustomFunds();
    closeModal("createFundModal");
    if (document.getElementById("fundNameInput")) document.getElementById("fundNameInput").value = "";
    if (document.getElementById("fundAmountInput")) document.getElementById("fundAmountInput").value = "";
    renderFundList();
    showToast("Đã tạo đợt thu mới!", "success");
}

function promptAdminThenDeleteFund() {
    checkAdmin(() => {
        if (!state.currentFund) return;
        if (!confirm(`Xóa "${state.currentFund.title}"?`)) return;
        state.customFunds = state.customFunds.filter(f => f.id !== state.currentFund.id);
        delete state.paidRecords[state.currentFund.id];
        saveCustomFunds(); savePaid();
        switchFundView("viewFundList");
        renderFundList();
        showToast("Đã xóa!", "info");
    });
}

// Breakdown (hiện chi tiết đã nộp)
function showBreakdown() {
    const fund = state.currentFund;
    if (!fund) return;
    const paid = getPaidCount(fund.id);
    const el = (id) => document.getElementById(id);
    if (el("breakdownTitle")) el("breakdownTitle").textContent = fund.title;
    if (el("breakdownSubtitle")) el("breakdownSubtitle").textContent = `${paid}/${STUDENTS.length} người đã nộp`;

    const c = document.getElementById("breakdownListContainer");
    if (c) {
        const paidStudents = STUDENTS.filter(st => isPaid(st.studentId, fund.id));
        if (paidStudents.length === 0) {
            c.innerHTML = `<div class="py-8 text-center text-gray-400 text-sm font-medium">Chưa có ai nộp</div>`;
        } else {
            c.innerHTML = paidStudents.map(st => `
                <div class="bg-white rounded-xl p-3 flex items-center justify-between shadow-sm border border-gray-100">
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm"><i class="fa-solid fa-check"></i></div>
                        <div>
                            <div class="text-sm font-extrabold text-gray-900">${st.name}</div>
                            <div class="text-xs text-gray-400 font-mono">${st.studentId}</div>
                        </div>
                    </div>
                    <span class="text-xs font-extrabold text-emerald-600">${formatMoney(fund.amount)}</span>
                </div>
            `).join("");
        }
    }
    openModal("breakdownModal");
}
function closeBreakdown() { closeModal("breakdownModal"); }

// ═══════════════════════════════════════════════════════════════
// MODULE 2: NHIỆM VỤ
// ═══════════════════════════════════════════════════════════════

function renderTaskList() {
    const c = document.getElementById("taskListContainer");
    if (!c) return;

    // Cập nhật thống kê nhiệm vụ
    const total = state.tasks.length;
    const pending = state.tasks.filter(t => !t.completed).length;
    const completed = total - pending;
    
    const elTotal = document.getElementById("taskStatTotal");
    const elPending = document.getElementById("taskStatPending");
    const elCompleted = document.getElementById("taskStatCompleted");
    const elSub = document.getElementById("taskSubCount");
    
    if (elTotal) elTotal.textContent = total;
    if (elPending) elPending.textContent = pending;
    if (elCompleted) elCompleted.textContent = completed;
    if (elSub) elSub.textContent = `${pending} cần làm · ${completed} đã xong`;

    let tasks = [...state.tasks];
    if (state.taskFilter === 'pending') tasks = tasks.filter(t => !t.completed);
    if (state.taskFilter === 'completed') tasks = tasks.filter(t => t.completed);
    tasks.sort((a, b) => { 
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        const p = { high: 0, medium: 1, low: 2 }; 
        return (p[a.priority]||1) - (p[b.priority]||1); 
    });

    if (tasks.length === 0) {
        c.innerHTML = `
        <div class="py-12 px-4 text-center bg-white rounded-3xl border border-dashed border-gray-200">
            <div class="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center text-2xl mx-auto mb-3 shadow-xs">
                <i class="fa-solid fa-clipboard-check"></i>
            </div>
            <h4 class="text-sm font-extrabold text-gray-800">Không có nhiệm vụ nào</h4>
            <p class="text-xs text-gray-400 mt-1">Tất cả công việc đã được xử lý hoặc chưa được tạo</p>
        </div>`;
        return;
    }

    const prioConfig = {
        high:   { label: 'Ưu tiên cao', badge: 'bg-rose-50 text-rose-700 border-rose-200', icon: 'fa-fire text-rose-500', cbBorder: 'border-rose-300 hover:border-rose-500 bg-rose-50/40' },
        medium: { label: 'Bình thường', badge: 'bg-amber-50 text-amber-700 border-amber-200', icon: 'fa-bolt text-amber-500', cbBorder: 'border-amber-300 hover:border-amber-500 bg-amber-50/40' },
        low:    { label: 'Thấp', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: 'fa-leaf text-emerald-500', cbBorder: 'border-emerald-300 hover:border-emerald-500 bg-emerald-50/40' }
    };

    c.innerHTML = tasks.map(t => {
        const hasLink = t.link && t.link.trim();
        const hasDesc = t.description && t.description.trim();
        const overdue = !t.completed && t.deadline && new Date(t.deadline) < new Date();
        const prio = prioConfig[t.priority] || prioConfig.medium;

        if (t.completed) {
            return `
            <div class="bg-gray-50/90 rounded-3xl p-4.5 border border-gray-200/80 flex items-start gap-3.5 transition-all">
                <button onclick="toggleTask('${t.id}')" class="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-200 cursor-pointer active:scale-90 transition-transform" title="Bấm để đánh dấu chưa xong">
                    <i class="fa-solid fa-check text-sm font-black"></i>
                </button>
                <div class="flex-1 min-w-0 pt-0.5">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-extrabold">✓ ĐÃ HOÀN THÀNH</span>
                        ${t.deadline ? `<span class="text-[11px] text-gray-400 font-medium">${formatDate(t.deadline)}</span>` : ''}
                    </div>
                    <div class="text-[15px] font-bold text-gray-400 line-through truncate">${t.title}</div>
                </div>
                <button onclick="event.stopPropagation();deleteTask('${t.id}')" class="w-9 h-9 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center flex-shrink-0 transition-colors active:scale-90 cursor-pointer" title="Xóa nhiệm vụ">
                    <i class="fa-regular fa-trash-can text-sm"></i>
                </button>
            </div>`;
        }

        return `
        <div class="bg-white rounded-3xl p-4.5 shadow-sm border ${overdue ? 'border-rose-200 bg-gradient-to-br from-rose-50/20 via-white to-white' : 'border-gray-200/90'} hover:shadow-md hover:border-indigo-200 transition-all">
            <div class="flex items-start gap-3.5">
                <!-- Checkbox to hoàn thành -->
                <button onclick="toggleTask('${t.id}')" class="w-10 h-10 rounded-2xl border-2 ${prio.cbBorder} flex items-center justify-center flex-shrink-0 cursor-pointer active:scale-90 transition-all group" title="Bấm vào để hoàn thành nhiệm vụ">
                    <i class="fa-solid fa-check text-sm text-gray-300 group-hover:text-emerald-500 transition-colors"></i>
                </button>

                <!-- Nội dung chính -->
                <div class="flex-1 min-w-0">
                    <!-- Badges Row -->
                    <div class="flex items-center justify-between gap-2 mb-1.5">
                        <div class="flex items-center gap-1.5 flex-wrap">
                            <span class="px-2.5 py-0.5 rounded-full ${prio.badge} border text-[10px] font-extrabold flex items-center gap-1">
                                <i class="fa-solid ${prio.icon} text-[9px]"></i> ${prio.label}
                            </span>
                            ${overdue ? `
                                <span class="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-extrabold flex items-center gap-1 border border-rose-200 animate-pulse">
                                    <i class="fa-solid fa-circle-exclamation text-[9px]"></i> Quá hạn!
                                </span>` : t.deadline ? `
                                <span class="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold flex items-center gap-1">
                                    <i class="fa-regular fa-calendar text-[9px]"></i> Hạn: ${formatDate(t.deadline)}
                                </span>` : ''}
                        </div>
                        <button onclick="event.stopPropagation();deleteTask('${t.id}')" class="w-9 h-9 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center flex-shrink-0 transition-colors active:scale-90 cursor-pointer" title="Xóa nhiệm vụ">
                            <i class="fa-regular fa-trash-can text-sm"></i>
                        </button>
                    </div>

                    <!-- Tiêu đề nhiệm vụ -->
                    <h4 class="text-[15px] font-extrabold text-gray-900 leading-snug mb-1">${t.title}</h4>

                    <!-- Mô tả nhiệm vụ -->
                    ${hasDesc ? `<p class="text-xs text-gray-500 leading-relaxed mb-2.5 line-clamp-2">${t.description}</p>` : ''}

                    <!-- Nút thao tác link & số người -->
                    <div class="flex items-center gap-2 flex-wrap pt-1">
                        ${hasLink ? `
                            <a href="${t.link}" target="_blank" class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200/80 shadow-xs transition active:scale-95">
                                <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                                <span>Mở liên kết / Tài liệu</span>
                            </a>` : ''}
                        ${t.assignees && t.assignees.length > 0 ? `
                            <span class="inline-flex items-center gap-1 text-[11px] text-gray-500 font-semibold px-2.5 py-1.5 rounded-xl bg-gray-50 border border-gray-100">
                                <i class="fa-solid fa-users text-[10px] text-gray-400"></i> ${t.assignees.length} thành viên
                            </span>` : ''}
                    </div>
                </div>
            </div>
        </div>`;
    }).join("");
}

// Gán người cho nhiệm vụ
state.taskAssignMode = 'all';

function setTaskAssignMode(mode) {
    state.taskAssignMode = mode;
    const btnAll = document.getElementById("btnAssignAll");
    const btnSelect = document.getElementById("btnAssignSelect");
    const list = document.getElementById("taskAssigneeList");
    if (mode === 'all') {
        btnAll.className = "flex-1 py-2 rounded-xl text-sm font-bold bg-gray-800 text-white transition";
        btnSelect.className = "flex-1 py-2 rounded-xl text-sm font-bold bg-white text-gray-600 border border-gray-200 transition";
        if (list) list.classList.add("hidden");
    } else {
        btnAll.className = "flex-1 py-2 rounded-xl text-sm font-bold bg-white text-gray-600 border border-gray-200 transition";
        btnSelect.className = "flex-1 py-2 rounded-xl text-sm font-bold bg-gray-800 text-white transition";
        if (list) list.classList.remove("hidden");
        renderTaskAssignees();
    }
}

function renderTaskAssignees(filter) {
    const c = document.getElementById("taskAssigneeCheckboxes");
    if (!c) return;
    const query = removeVietnameseTones((filter || document.getElementById("taskAssignSearch")?.value || "").toLowerCase());
    const filtered = STUDENTS.filter(st => {
        if (!query) return true;
        return removeVietnameseTones(st.name.toLowerCase()).includes(query);
    });
    c.innerHTML = filtered.map(st => `
        <label class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white cursor-pointer transition">
            <input type="checkbox" class="task-assignee-cb w-4 h-4 rounded border-gray-300 text-indigo-600" value="${st.studentId}">
            <span class="text-xs font-medium text-gray-700">${st.name}</span>
            <span class="text-[10px] text-gray-400 font-mono">${st.studentId}</span>
        </label>
    `).join("");
}

function filterTaskAssignees() { renderTaskAssignees(); }

function toggleTask(id) {
    const t = state.tasks.find(x => x.id === id);
    if (t) { 
        t.completed = !t.completed; 
        saveTasks(); 
        renderTaskList(); 
        if (t.completed && typeof confetti === 'function') {
            confetti({ particleCount: 30, spread: 45, origin: { y: 0.6 } });
        }
    }
}

function deleteTask(id) {
    if (!confirm("Bạn có chắc muốn xóa nhiệm vụ này?")) return;
    state.tasks = state.tasks.filter(x => x.id !== id);
    saveTasks(); renderTaskList();
    showToast("Đã xóa nhiệm vụ", "info");
}

function filterTasks(filter) {
    state.taskFilter = filter;
    const map = {
        all: 'btnFilterAll',
        pending: 'btnFilterPending',
        completed: 'btnFilterCompleted'
    };
    Object.keys(map).forEach(key => {
        const btn = document.getElementById(map[key]);
        if (!btn) return;
        if (key === filter) {
            btn.className = 'task-filter-btn flex-1 py-2 text-xs font-extrabold rounded-xl bg-gray-900 text-white shadow-sm transition-all';
        } else {
            btn.className = 'task-filter-btn flex-1 py-2 text-xs font-bold rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 transition-all';
        }
    });
    renderTaskList();
}

function promptAdminThenCreateTask() { checkAdmin(() => openModal("createTaskModal")); }

function submitCreateTask() {
    const title = document.getElementById("taskTitleInput")?.value.trim();
    if (!title) { showToast("Nhập tiêu đề nhiệm vụ!", "warning"); return; }

    // Lấy danh sách assignees
    let assignees = null;
    if (state.taskAssignMode === 'select') {
        assignees = [...document.querySelectorAll('.task-assignee-cb:checked')].map(cb => cb.value);
        if (assignees.length === 0) { showToast("Chọn ít nhất 1 người!", "warning"); return; }
    }

    state.tasks.push({
        id: generateId(),
        title,
        description: document.getElementById("taskDescInput")?.value.trim() || "",
        link: document.getElementById("taskLinkInput")?.value.trim() || "",
        deadline: document.getElementById("taskDeadlineInput")?.value || null,
        priority: document.getElementById("taskPriorityInput")?.value || "medium",
        completed: false,
        assignees: assignees,
        createdAt: new Date().toISOString()
    });
    saveTasks();
    closeModal("createTaskModal");
    // Reset form
    if (document.getElementById("taskTitleInput")) document.getElementById("taskTitleInput").value = "";
    if (document.getElementById("taskDescInput")) document.getElementById("taskDescInput").value = "";
    if (document.getElementById("taskLinkInput")) document.getElementById("taskLinkInput").value = "";
    if (document.getElementById("taskDeadlineInput")) document.getElementById("taskDeadlineInput").value = "";
    if (document.getElementById("taskAssignSearch")) document.getElementById("taskAssignSearch").value = "";
    setTaskAssignMode('all');
    renderTaskList();
    showToast("Đã tạo nhiệm vụ mới!", "success");
}

// ═══════════════════════════════════════════════════════════════
// MODULE 3: THÔNG BÁO & SỰ KIỆN
// ═══════════════════════════════════════════════════════════════

function renderAnnouncementList() {
    const c = document.getElementById("announcementListContainer");
    if (!c) return;
    const sorted = [...state.announcements].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.date) - new Date(a.date);
    });

    if (sorted.length === 0) {
        c.innerHTML = `
        <div class="py-12 px-4 text-center bg-white rounded-3xl border border-dashed border-gray-200">
            <div class="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center text-2xl mx-auto mb-3 shadow-xs">
                <i class="fa-solid fa-bullhorn"></i>
            </div>
            <h4 class="text-sm font-extrabold text-gray-800">Chưa có thông báo nào</h4>
            <p class="text-xs text-gray-400 mt-1">Các tin tức mới sẽ được ban cán sự cập nhật tại đây</p>
        </div>`;
        return;
    }

    const tagStyle = {
        urgent: { badge: 'bg-rose-500 text-white', icon: 'fa-solid fa-triangle-exclamation', label: 'Khẩn cấp', border: 'border-rose-200 bg-gradient-to-br from-rose-50/20 via-white to-white' },
        info:   { badge: 'bg-blue-600 text-white',  icon: 'fa-solid fa-bullhorn', label: 'Thông báo', border: 'border-gray-200/90 bg-white' },
        event:  { badge: 'bg-purple-600 text-white', icon: 'fa-solid fa-champagne-glasses', label: 'Sự kiện', border: 'border-gray-200/90 bg-white' }
    };

    c.innerHTML = sorted.map(a => {
        const hasLink = a.link && a.link.trim();
        const hasContent = a.content && a.content.trim();
        const ts = tagStyle[a.tag] || tagStyle.info;

        return `
        <div class="rounded-3xl p-5 shadow-sm border ${a.pinned ? 'border-amber-300 ring-2 ring-amber-100/70 bg-gradient-to-br from-amber-50/20 via-white to-white' : ts.border} hover:shadow-md transition-all">
            <!-- Header hàng đầu -->
            <div class="flex items-center justify-between gap-2 mb-2.5">
                <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="px-2.5 py-0.5 rounded-full ${ts.badge} text-[10px] font-extrabold flex items-center gap-1 shadow-xs">
                        <i class="${ts.icon} text-[9px]"></i> ${ts.label}
                    </span>
                    ${a.pinned ? `
                        <span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-extrabold flex items-center gap-1">
                            <i class="fa-solid fa-thumbtack text-[9px]"></i> ĐÃ GHIM
                        </span>` : ''}
                    <span class="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                        <i class="fa-regular fa-clock text-[10px]"></i> ${formatDateTime(a.date)}
                    </span>
                </div>
                <button onclick="deleteAnnouncement('${a.id}')" class="w-8 h-8 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 flex items-center justify-center flex-shrink-0 transition-colors active:scale-90 cursor-pointer" title="Xóa thông báo (Admin)">
                    <i class="fa-regular fa-trash-can text-sm"></i>
                </button>
            </div>

            <!-- Tiêu đề thông báo -->
            <h3 class="text-base font-extrabold text-gray-900 leading-snug mb-2">${a.title}</h3>

            <!-- Nội dung thông báo hiển thị rõ ràng -->
            ${hasContent ? `
                <div class="text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50/70 rounded-2xl p-4 border border-gray-100 mb-2">
                    ${a.content}
                </div>` : ''}

            <!-- Nút liên kết ngoài (nếu có) -->
            ${hasLink ? `
                <div class="pt-1">
                    <a href="${a.link}" target="_blank" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200/80 shadow-xs transition active:scale-95">
                        <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                        <span>Xem liên kết / Tài liệu đính kèm</span>
                    </a>
                </div>` : ''}
        </div>`;
    }).join("");
}

function deleteAnnouncement(id) {
    checkAdmin(() => {
        state.announcements = state.announcements.filter(x => x.id !== id);
        saveAnnouncements(); renderAnnouncementList();
        showToast("Đã xóa thông báo", "info");
    });
}

function promptAdminThenCreateAnnouncement() { checkAdmin(() => openModal("createAnnouncementModal")); }

function submitCreateAnnouncement() {
    const title = document.getElementById("annTitleInput")?.value.trim();
    const content = document.getElementById("annContentInput")?.value.trim();
    const link = document.getElementById("annLinkInput")?.value.trim();
    if (!title) { showToast("Nhập tiêu đề!", "warning"); return; }
    if (!content && !link) { showToast("Nhập nội dung hoặc gắn link!", "warning"); return; }
    state.announcements.push({
        id: generateId(),
        title,
        content: content || "",
        link: link || "",
        date: new Date().toISOString(),
        tag: document.getElementById("annTypeInput")?.value || "info",
        pinned: document.getElementById("annPinInput")?.checked || false
    });
    saveAnnouncements();
    closeModal("createAnnouncementModal");
    if (document.getElementById("annTitleInput")) document.getElementById("annTitleInput").value = "";
    if (document.getElementById("annContentInput")) document.getElementById("annContentInput").value = "";
    if (document.getElementById("annLinkInput")) document.getElementById("annLinkInput").value = "";
    if (document.getElementById("annPinInput")) document.getElementById("annPinInput").checked = false;
    renderAnnouncementList();
    showToast("Đã đăng thông báo!", "success");
}

// ═══════════════════════════════════════════════════════════════
// MODULE 4: ĐIỂM DANH QR (ADMIN ONLY)
// ═══════════════════════════════════════════════════════════════

function openAttendanceAdmin() { switchView("viewAttendance"); }

function renderAttendanceSessions() {
    const c = document.getElementById("attendanceSessionsContainer");
    if (!c) return;

    if (state.attendanceSessions.length === 0) {
        c.innerHTML = `
        <div class="py-12 px-5 text-center bg-white rounded-3xl border border-dashed border-gray-200">
            <div class="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl mx-auto mb-3.5 shadow-xs">
                <i class="fa-solid fa-qrcode"></i>
            </div>
            <h4 class="text-base font-extrabold text-gray-800">Chưa có phiên điểm danh</h4>
            <p class="text-xs text-gray-400 mt-1 max-w-xs mx-auto mb-5">Tạo phiên điểm danh để sinh viên có thể quét mã QR hoặc chọn tên check-in ngay trên điện thoại</p>
            <button onclick="promptAdminThenCreateAttendance()" class="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-200 transition active:scale-95 cursor-pointer">
                <i class="fa-solid fa-plus mr-1"></i> Tạo Phiên Điểm Danh Đầu Tiên
            </button>
        </div>`;
        return;
    }

    // Tìm phiên đang mở (chưa hết hạn)
    const activeSession = state.attendanceSessions.find(s => !s.expiresAt || new Date(s.expiresAt) > new Date());
    let heroHtml = '';

    if (activeSession) {
        const records = state.attendanceRecords[activeSession.id] || [];
        const checkedIn = records.length;
        const total = STUDENTS.length;
        const pct = Math.round((checkedIn / total) * 100);
        heroHtml = `
        <div class="bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-5 text-white shadow-xl shadow-teal-100 relative overflow-hidden mb-5">
            <div class="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
            
            <div class="flex items-center justify-between mb-2.5 z-10 relative">
                <span class="px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-black tracking-wider uppercase backdrop-blur-md flex items-center gap-1.5 shadow-xs">
                    <span class="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
                    ĐANG MỞ ĐIỂM DANH
                </span>
                <span class="text-xs text-emerald-100 font-bold">
                    ${activeSession.expiresAt ? '<i class="fa-regular fa-clock mr-1"></i>Có giới hạn giờ' : '♾️ Không giới hạn'}
                </span>
            </div>

            <h3 class="text-lg font-black text-white leading-snug mb-1 z-10 relative">${activeSession.title}</h3>
            <p class="text-xs text-emerald-100/90 font-medium mb-3.5 z-10 relative">Tạo lúc: ${formatDateTime(activeSession.createdAt)}</p>

            <!-- Tiến độ -->
            <div class="bg-white/15 p-3 rounded-2xl backdrop-blur-sm mb-4 border border-white/20 z-10 relative">
                <div class="flex justify-between items-center text-xs font-extrabold text-white mb-1.5">
                    <span>Sĩ số có mặt</span>
                    <span class="text-emerald-200">${checkedIn}/${total} sinh viên (${pct}%)</span>
                </div>
                <div class="w-full bg-black/20 rounded-full h-2.5 overflow-hidden p-0.5">
                    <div class="bg-white h-full rounded-full transition-all duration-500 shadow-sm" style="width: ${pct}%"></div>
                </div>
            </div>

            <!-- 2 Nút lớn hành động -->
            <div class="grid grid-cols-2 gap-2.5 z-10 relative">
                <button onclick="openCheckinForSession('${activeSession.id}')" class="py-3 px-3 rounded-2xl bg-white text-emerald-800 hover:bg-emerald-50 active:scale-95 font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer">
                    <i class="fa-solid fa-user-check text-sm text-emerald-600"></i>
                    <span>TÔI ĐIỂM DANH</span>
                </button>
                <button onclick="showAttendanceQR('${activeSession.id}')" class="py-3 px-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-md border border-white/30 cursor-pointer">
                    <i class="fa-solid fa-qrcode text-sm"></i>
                    <span>HIỆN MÃ QR</span>
                </button>
            </div>
        </div>`;
    }

    const historyCards = state.attendanceSessions.map(s => {
        const records = state.attendanceRecords[s.id] || [];
        const checkedIn = records.length;
        const total = STUDENTS.length;
        const pct = Math.round((checkedIn / total) * 100);
        const expired = s.expiresAt && new Date(s.expiresAt) < new Date();

        const statusBadge = s.isLocked ? `
            <span class="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black flex items-center gap-1 border border-rose-200">
                <i class="fa-solid fa-lock text-[8px]"></i> ĐÃ KHÓA (CHỈ ADMIN)
            </span>` : (expired ? `
            <span class="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-extrabold border border-gray-200">
                HẾT HẠN
            </span>` : `
            <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black flex items-center gap-1 border border-emerald-200">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> ĐANG MỞ
            </span>`);

        return `
        <div class="bg-white border border-gray-200/90 rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
            <div class="flex items-start justify-between gap-2 mb-2">
                <div>
                    <h4 class="text-[15px] font-extrabold text-gray-900 leading-snug">${s.title}</h4>
                    <div class="flex items-center gap-2 mt-1">
                        <span class="text-xs text-gray-400 font-medium">${formatDateTime(s.createdAt)}</span>
                        ${statusBadge}
                    </div>
                </div>
                <div class="flex items-center gap-1">
                    <button onclick="showAttendanceQR('${s.id}')" class="w-9 h-9 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition active:scale-90 cursor-pointer" title="Xem mã QR">
                        <i class="fa-solid fa-qrcode text-sm"></i>
                    </button>
                    <button onclick="deleteAttendanceSession('${s.id}')" class="w-9 h-9 rounded-2xl text-gray-300 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition active:scale-90 cursor-pointer" title="Xóa phiên (Admin)">
                        <i class="fa-regular fa-trash-can text-sm"></i>
                    </button>
                </div>
            </div>

            <!-- Progress Bar -->
            <div class="mt-3 mb-3 bg-gray-50 p-2.5 rounded-2xl border border-gray-100">
                <div class="flex justify-between items-center text-xs font-bold text-gray-600 mb-1">
                    <span>Có mặt: <strong class="text-emerald-600">${checkedIn}/${total}</strong></span>
                    <span>${pct}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div class="bg-emerald-500 h-2 rounded-full transition-all duration-500" style="width:${pct}%"></div>
                </div>
            </div>

            <!-- Quick Action Buttons: 4 nút rõ ràng -->
            <div class="grid grid-cols-4 gap-1.5 sm:gap-2">
                <button onclick="showAttendanceQR('${s.id}')" class="py-2.5 px-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold text-[11px] transition flex flex-col sm:flex-row items-center justify-center gap-1 active:scale-95 cursor-pointer" title="Xem mã QR cho SV quét">
                    <i class="fa-solid fa-qrcode text-[12px]"></i> <span>Mã QR</span>
                </button>
                <button onclick="toggleLockAttendanceSession('${s.id}')" class="py-2.5 px-1 rounded-xl ${s.isLocked ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700' : 'bg-rose-50 hover:bg-rose-100 text-rose-700'} font-extrabold text-[11px] transition flex flex-col sm:flex-row items-center justify-center gap-1 active:scale-95 cursor-pointer" title="${s.isLocked ? 'Mở khóa phiên' : 'Khóa phiên (Chốt sĩ số)'}">
                    <i class="fa-solid ${s.isLocked ? 'fa-lock-open' : 'fa-lock'} text-[12px]"></i> <span>${s.isLocked ? 'Mở khóa' : 'Khóa'}</span>
                </button>
                <button onclick="viewAttendanceReport('${s.id}')" class="py-2.5 px-1 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-[11px] transition flex flex-col sm:flex-row items-center justify-center gap-1 active:scale-95 cursor-pointer" title="Xem danh sách điểm danh">
                    <i class="fa-solid fa-list-check text-[12px]"></i> <span>Xem DS</span>
                </button>
                <button onclick="openExportSheetModal('${s.id}')" class="py-2.5 px-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-[11px] transition flex flex-col sm:flex-row items-center justify-center gap-1 active:scale-95 cursor-pointer" title="Xuất danh sách ra file Sheet">
                    <i class="fa-solid fa-file-excel text-[12px]"></i> <span>Xuất Sheet</span>
                </button>
            </div>
        </div>`;
    }).join("");

    c.innerHTML = `
        ${heroHtml}
        <div>
            <div class="flex items-center justify-between mb-3 px-1">
                <h3 class="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Tất cả phiên điểm danh (${state.attendanceSessions.length})</h3>
                <span class="text-[11px] text-gray-400 font-medium">Bấm để quản lý</span>
            </div>
            <div class="space-y-3.5">
                ${historyCards}
            </div>
        </div>`;
}

function openCheckinForSession(sessionId) {
    const s = state.attendanceSessions.find(x => x.id === sessionId);
    if (!s) return;
    state.currentAttendanceSession = s;
    const el = document.getElementById("checkinSessionName");
    if (el) el.textContent = s.title;
    const statsEl = document.getElementById("checkinSessionStats");
    const records = state.attendanceRecords[s.id] || [];
    if (statsEl) statsEl.textContent = `${records.length}/${STUDENTS.length} đã điểm danh`;
    switchView("viewAttendanceCheckin");
    renderCheckinStudentList();
}

function openCheckinForCurrentSession() {
    if (state.currentAttendanceSession) {
        openCheckinForSession(state.currentAttendanceSession.id);
    }
}

function copyAttendanceLink() {
    if (!state.currentAttendanceSession) return;
    const baseUrl = window.location.href.split('?')[0];
    const attendUrl = `${baseUrl}?attend=${state.currentAttendanceSession.id}`;
    navigator.clipboard.writeText(attendUrl).then(() => {
        showToast("Đã sao chép link điểm danh! Hãy gửi vào nhóm lớp.", "success");
    }).catch(() => {
        prompt("Copy liên kết điểm danh dưới đây:", attendUrl);
    });
}

function deleteAttendanceSession(sessionId) {
    checkAdmin(() => {
        state.attendanceSessions = state.attendanceSessions.filter(s => s.id !== sessionId);
        delete state.attendanceRecords[sessionId];
        saveAttendance();
        saveAttendanceRecords();
        renderAttendanceSessions();
        showToast("Đã xóa phiên điểm danh", "info");
    });
}

function promptAdminThenViewAttendance() {
    const pw = prompt("🔒 Nhập mật khẩu để mở Điểm Danh:");
    if (pw === null) return;
    if (pw !== "1") { showToast("Sai mật khẩu!", "error"); return; }
    switchView("viewAttendance");
}

function promptAdminThenCreateAttendance() {
    checkAdmin(() => {
        openModal("createAttendanceModal");
    });
}

function submitCreateAttendance() {
    const title = document.getElementById("attSessionNameInput")?.value.trim();
    if (!title) { showToast("Nhập tên buổi học!", "warning"); return; }
    const duration = parseInt(document.getElementById("attDurationInput")?.value) || 0;
    const session = {
        id: generateId(),
        title,
        createdAt: new Date().toISOString(),
        expiresAt: duration > 0 ? new Date(Date.now() + duration * 60000).toISOString() : null,
        duration: duration,
        isLocked: false
    };
    state.attendanceSessions.unshift(session);
    saveAttendance();
    closeModal("createAttendanceModal");
    if (document.getElementById("attSessionNameInput")) document.getElementById("attSessionNameInput").value = "";
    renderAttendanceSessions();
    showToast("Đã tạo phiên điểm danh!", "success");
    setTimeout(() => showAttendanceQR(session.id), 300);
}

function showAttendanceQR(sessionId) {
    const s = state.attendanceSessions.find(x => x.id === sessionId);
    if (!s) return;
    state.currentAttendanceSession = s;
    const el = (id) => document.getElementById(id);
    if (el("qrSessionName")) el("qrSessionName").textContent = s.title;
    const baseUrl = window.location.href.split('?')[0];
    const attendUrl = `${baseUrl}?attend=${s.id}`;
    const qrContainer = document.getElementById("qrCodeDisplay");
    if (qrContainer) {
        qrContainer.innerHTML = "";
        if (typeof QRCode !== 'undefined') {
            new QRCode(qrContainer, { text: attendUrl, width: 192, height: 192, colorDark: "#1e293b", colorLight: "#ffffff" });
        } else {
            qrContainer.innerHTML = `<div class="text-xs text-gray-400 p-4 text-center">QR chưa tải<br><code class="break-all text-[10px]">${attendUrl}</code></div>`;
        }
    }

    // Cập nhật nút khóa trong Modal
    const lockBtn = document.getElementById("btnToggleLockQrModal");
    const lockText = document.getElementById("btnToggleLockQrModalText");
    if (lockBtn && lockText) {
        if (s.isLocked) {
            lockBtn.className = "w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl py-3 shadow-md shadow-emerald-200 text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer";
            lockText.textContent = "Mở khóa phiên điểm danh";
        } else {
            lockBtn.className = "w-full bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl py-3 shadow-md shadow-rose-200 text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer";
            lockText.textContent = "Khóa phiên điểm danh ngay (Chốt sĩ số)";
        }
    }

    // Đếm ngược
    if (state.countdownInterval) clearInterval(state.countdownInterval);
    const countdownEl = document.getElementById("qrCountdownDisplay");
    const countdownContainer = document.getElementById("qrCountdownContainer");
    if (s.expiresAt && countdownEl) {
        if (countdownContainer) countdownContainer.style.display = "";
        state.countdownInterval = setInterval(() => {
            const remaining = new Date(s.expiresAt) - new Date();
            if (remaining <= 0) {
                countdownEl.textContent = "Hết hạn!";
                countdownEl.className = "text-3xl font-extrabold text-red-500 font-mono mt-1";
                clearInterval(state.countdownInterval);
                return;
            }
            const mins = Math.floor(remaining / 60000);
            const secs = Math.floor((remaining % 60000) / 1000);
            countdownEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }, 1000);
    } else if (countdownContainer) {
        countdownContainer.style.display = "none";
    }
    openModal("showQrModal");
}

function toggleLockCurrentAttendanceSession() {
    if (!state.currentAttendanceSession) return;
    toggleLockAttendanceSession(state.currentAttendanceSession.id);
}

function toggleLockAttendanceSession(sessionId) {
    const s = state.attendanceSessions.find(x => x.id === sessionId);
    if (!s) return;
    s.isLocked = !s.isLocked;
    saveAttendance();
    renderAttendanceSessions();
    if (document.getElementById("showQrModal") && !document.getElementById("showQrModal").classList.contains("hidden")) {
        showAttendanceQR(s.id);
    }
    showToast(s.isLocked ? `🔒 Đã khóa phiên "${s.title}"! Sinh viên không thể tự điểm danh nữa.` : `🔓 Đã mở lại phiên "${s.title}"!`, s.isLocked ? "warning" : "success");
}

// ─────────────────────────────────────────────────────────────
// XUẤT DANH SÁCH RA FILE SHEET (EXCEL & GOOGLE SHEETS)
// ─────────────────────────────────────────────────────────────
function openExportSheetModal(sessionId) {
    const s = state.attendanceSessions.find(x => x.id === sessionId);
    if (!s) return;
    state.exportSessionId = sessionId;
    const records = state.attendanceRecords[s.id] || [];
    const el = (id) => document.getElementById(id);
    if (el("exportSheetSessionTitle")) el("exportSheetSessionTitle").textContent = s.title;
    if (el("exportPresentCount")) el("exportPresentCount").textContent = records.length;
    if (el("exportAbsentCount")) el("exportAbsentCount").textContent = STUDENTS.length - records.length;
    openModal("exportSheetModal");
}

function downloadAttendanceCsv(sessionId) {
    const sId = sessionId || state.exportSessionId;
    const s = state.attendanceSessions.find(x => x.id === sId);
    if (!s) return;
    const records = state.attendanceRecords[s.id] || [];

    // Header UTF-8 BOM chuẩn để Excel và Google Sheets đọc tiếng Việt không bao giờ lỗi font
    let csv = "\uFEFF";
    csv += "STT,Mã sinh viên,Họ và tên,Trạng thái,Thời gian điểm danh,Buổi học,Ngày tạo\n";

    STUDENTS.forEach((st, idx) => {
        const rec = records.find(r => String(r.studentId) === String(st.studentId));
        const status = rec ? "Có mặt" : "VẮNG";
        const time = rec ? formatDateTime(rec.checkinAt) : "--";
        const cleanName = `"${st.name.replace(/"/g, '""')}"`;
        const cleanTitle = `"${s.title.replace(/"/g, '""')}"`;
        csv += `${idx + 1},"${st.studentId}",${cleanName},"${status}","${time}",${cleanTitle},"${formatDate(s.createdAt)}"\n`;
    });

    csv += `\n,"TỔNG SĨ SỐ",${STUDENTS.length},"CÓ MẶT",${records.length},"VẮNG",${STUDENTS.length - records.length}\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const cleanFileTitle = removeVietnameseTones(s.title).replace(/\s+/g, '_');
    a.download = `DiemDanh_${cleanFileTitle}_${formatDate(s.createdAt).replace(/\//g, '-')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("📥 Đã tải file Sheet (.csv) thành công! Mở tốt trên Excel & Google Sheets.", "success");
}

function copyAttendanceTsvForSheets(sessionId) {
    const sId = sessionId || state.exportSessionId;
    const s = state.attendanceSessions.find(x => x.id === sId);
    if (!s) return;
    const records = state.attendanceRecords[s.id] || [];

    // TSV chuẩn: STT \t Mã SV \t Họ Tên \t Trạng Thái \t Thời Gian
    let tsv = "STT\tMã sinh viên\tHọ và tên\tTrạng thái\tThời gian điểm danh\tBuổi học\n";
    STUDENTS.forEach((st, idx) => {
        const rec = records.find(r => String(r.studentId) === String(st.studentId));
        const status = rec ? "Có mặt" : "VẮNG";
        const time = rec ? formatDateTime(rec.checkinAt) : "--";
        tsv += `${idx + 1}\t${st.studentId}\t${st.name}\t${status}\t${time}\t${s.title}\n`;
    });
    tsv += `\tTỔNG SĨ SỐ\t${STUDENTS.length}\tCÓ MẶT: ${records.length}\tVẮNG: ${STUDENTS.length - records.length}\n`;

    copyText(tsv, "📋 Đã sao chép dạng bảng! Nhấn Ctrl+V để dán trực tiếp vào Google Sheets.");
}

function exportAttendance(sessionId) {
    openExportSheetModal(sessionId);
}

// Xem danh sách điểm danh chi tiết
function viewAttendanceReport(sessionId) {
    const s = state.attendanceSessions.find(x => x.id === sessionId);
    if (!s) return;
    const records = state.attendanceRecords[s.id] || [];
    const absentStudents = STUDENTS.filter(st => !records.find(r => r.studentId === st.studentId));

    let html = `<div class="fixed inset-0 bg-black/60 z-50 flex flex-col justify-end backdrop-blur-sm" id="attendReportModal" onclick="if(event.target===this)this.remove()">
        <div class="bg-white rounded-t-3xl w-full max-w-xl mx-auto max-h-[85vh] flex flex-col">
            <div class="p-5 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
                <div>
                    <h3 class="text-2xl font-black text-gray-900">📍 ${s.title}</h3>
                    <p class="text-base text-gray-500 font-semibold">${records.length}/${STUDENTS.length} đã điểm danh</p>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="openExportSheetModal('${s.id}')" class="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition border border-emerald-200">
                        <i class="fa-solid fa-file-excel"></i> Xuất Sheet
                    </button>
                    <button onclick="document.getElementById('attendReportModal').remove()" class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200"><i class="fa-solid fa-xmark text-lg"></i></button>
                </div>
            </div>
            <div class="overflow-y-auto flex-1 p-5 space-y-2">
                <div class="text-xs font-black text-emerald-700 uppercase tracking-wider mb-2">✅ Đã điểm danh (${records.length})</div>`;

    if (records.length > 0) {
        records.forEach((r, i) => {
            const st = STUDENTS.find(s => s.studentId === r.studentId);
            const time = new Date(r.checkinAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
            html += `<div class="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-black">${i+1}</div>
                    <div>
                        <div class="text-sm font-extrabold text-gray-900">${st?.name || r.studentId}</div>
                        <div class="text-[10px] font-mono text-gray-400">${st?.studentId || ''}</div>
                    </div>
                </div>
                <span class="text-xs font-mono font-bold text-emerald-600">🕐 ${time}</span>
            </div>`;
        });
    }

    html += `<div class="text-xs font-black text-red-600 uppercase tracking-wider mt-4 mb-2">❌ Vắng mặt (${absentStudents.length})</div>`;
    if (absentStudents.length > 0) {
        absentStudents.forEach(st => {
            html += `<div class="bg-red-50 border border-red-100 rounded-xl p-3 flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-xs"><i class="fa-solid fa-xmark"></i></div>
                <div>
                    <div class="text-sm font-extrabold text-gray-900">${st.name}</div>
                    <div class="text-[10px] font-mono text-gray-400">${st.studentId}</div>
                </div>
            </div>`;
        });
    }

    html += `</div></div></div>`;
    document.body.insertAdjacentHTML('beforeend', html);
}

// Check-in (khi SV quét QR — KHÔNG CẦN ADMIN)
function openAttendanceCheckin(sessionId) {
    loadState();
    const s = state.attendanceSessions.find(x => x.id === sessionId);
    if (!s) {
        document.getElementById("mainContainer").innerHTML = `<div class="flex items-center justify-center h-full p-6"><div class="text-center"><div class="text-5xl mb-4">❌</div><h2 class="text-xl font-bold text-gray-900">Phiên không tồn tại</h2><p class="text-sm text-gray-500 mt-1">Mã phiên không hợp lệ hoặc đã bị xóa.</p></div></div>`;
        return;
    }
    if (s.isLocked) {
        document.getElementById("mainContainer").innerHTML = `
        <div class="flex items-center justify-center min-h-[60vh] p-6">
            <div class="text-center max-w-sm bg-white p-7 rounded-3xl shadow-xl border-2 border-rose-200 animate-[scaleUp_0.25s_ease-out]">
                <div class="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-3xl mx-auto mb-3 shadow-xs">
                    <i class="fa-solid fa-lock"></i>
                </div>
                <h3 class="text-lg font-black text-gray-900 mb-1">Phiên Điểm Danh Đã Khóa</h3>
                <p class="text-xs text-gray-500 mb-4 leading-relaxed">Buổi điểm danh "<strong>${s.title}</strong>" đã được chốt và khóa bởi Admin/Ban cán sự. Bạn không thể tự điểm danh nữa.</p>
                <button onclick="switchView('viewDashboard')" class="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition">
                    Quay lại Trang chủ
                </button>
            </div>
        </div>`;
        return;
    }
    if (s.expiresAt && new Date(s.expiresAt) < new Date()) {
        document.getElementById("mainContainer").innerHTML = `<div class="flex items-center justify-center h-full p-6"><div class="text-center"><div class="text-5xl mb-4">⏰</div><h2 class="text-xl font-bold text-gray-900">Phiên đã hết hạn</h2><p class="text-sm text-gray-500 mt-1">${s.title}</p></div></div>`;
        return;
    }
    state.currentAttendanceSession = s;
    const el = document.getElementById("checkinSessionName");
    if (el) el.textContent = s.title;
    switchView("viewAttendanceCheckin");
    renderCheckinStudentList();
}

function renderCheckinStudentList() {
    const c = document.getElementById("checkinStudentList");
    const s = state.currentAttendanceSession;
    if (!c || !s) return;
    const query = removeVietnameseTones((document.getElementById("checkinSearchInput")?.value || "").toLowerCase());
    const records = state.attendanceRecords[s.id] || [];

    // Cập nhật stats
    const statsEl = document.getElementById("checkinSessionStats");
    if (statsEl) statsEl.textContent = `${records.length}/${STUDENTS.length} đã điểm danh`;

    const filtered = STUDENTS.filter(st => {
        if (!query) return true;
        return removeVietnameseTones(st.name.toLowerCase()).includes(query) || st.studentId.toLowerCase().includes(query);
    });

    if (filtered.length === 0) {
        c.innerHTML = `
        <div class="py-8 text-center text-gray-400 text-sm bg-white rounded-2xl border border-dashed border-gray-200">
            <i class="fa-solid fa-user-slash text-2xl text-gray-300 block mb-2"></i>
            Không tìm thấy sinh viên nào phù hợp
        </div>`;
        return;
    }

    c.innerHTML = filtered.map(st => {
        const record = records.find(r => r.studentId === st.studentId);
        if (record) {
            const time = new Date(record.checkinAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
            return `
            <div class="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-3.5 flex items-center justify-between transition-all">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-xs flex-shrink-0">
                        <i class="fa-solid fa-check"></i>
                    </div>
                    <div>
                        <div class="text-sm font-extrabold text-emerald-950">${st.name}</div>
                        <div class="text-[11px] font-mono text-emerald-700">${st.studentId}</div>
                    </div>
                </div>
                <span class="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 flex-shrink-0">
                    <i class="fa-solid fa-circle-check text-emerald-600 text-[11px]"></i> ${time}
                </span>
            </div>`;
        }

        return `
        <button onclick="checkinStudent('${st.studentId}')" class="w-full bg-white border border-gray-200/90 rounded-2xl p-3.5 flex items-center justify-between hover:border-emerald-500 hover:bg-emerald-50/30 hover:shadow-md active:scale-[0.98] transition-all text-left group cursor-pointer shadow-xs">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-emerald-600 text-gray-500 group-hover:text-white flex items-center justify-center text-sm font-bold transition-colors flex-shrink-0">
                    ${st.name.charAt(0)}
                </div>
                <div>
                    <div class="text-sm font-extrabold text-gray-900 group-hover:text-emerald-700 transition-colors">${st.name}</div>
                    <div class="text-[11px] font-mono text-gray-400">${st.studentId}</div>
                </div>
            </div>
            <span class="px-3.5 py-1.5 rounded-xl bg-emerald-50 group-hover:bg-emerald-600 text-emerald-700 group-hover:text-white font-extrabold text-xs transition-colors flex items-center gap-1 shadow-xs flex-shrink-0">
                <i class="fa-solid fa-check text-[10px]"></i> Điểm danh
            </span>
        </button>`;
    }).join("");
}

function checkinStudent(studentId) {
    const s = state.currentAttendanceSession;
    if (!s) return;
    if (s.expiresAt && new Date(s.expiresAt) < new Date()) { showToast("Phiên đã hết hạn!", "error"); return; }
    if (!state.attendanceRecords[s.id]) state.attendanceRecords[s.id] = [];
    if (state.attendanceRecords[s.id].find(r => r.studentId === studentId)) { showToast("Bạn đã điểm danh rồi!", "warning"); return; }
    state.attendanceRecords[s.id].push({
        studentId: studentId,
        checkinAt: new Date().toISOString()
    });
    saveAttendanceRecords();
    const st = STUDENTS.find(x => x.studentId === studentId);
    showToast(`${st?.name || studentId} đã điểm danh thành công!`, "success");
    if (typeof confetti === "function") confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    renderCheckinStudentList();
}

// ═══════════════════════════════════════════════════════════════
// MODAL HELPERS
// ═══════════════════════════════════════════════════════════════

function openModal(id) {
    const el = document.getElementById(id);
    if (el) { el.classList.remove("hidden"); el.style.display = "flex"; }
}
function closeModal(id) {
    const el = document.getElementById(id);
    if (el) { el.classList.add("hidden"); el.style.display = ""; }
    if (id === "showQrModal" && state.countdownInterval) { clearInterval(state.countdownInterval); state.countdownInterval = null; }
}

// ═══════════════════════════════════════════════════════════════
// CÀI ĐẶT
// ═══════════════════════════════════════════════════════════════

function promptSettingsPassword() {
    const pw = prompt("🔒 Nhập mật khẩu để mở Cài Đặt:");
    if (pw === null) return;
    if (pw !== "1") { showToast("Sai mật khẩu!", "error"); return; }
    openModal("settingsModal");
}
function promptAdminThenSettings() { promptSettingsPassword(); }

function saveSettings() {
    const appName = document.getElementById("appNameInput")?.value.trim();
    if (appName) { state.config.appName = appName; state.config.classroom.className = appName; }
    localStorage.setItem("QL_CFG", JSON.stringify(state.config));
    closeModal("settingsModal");
    showToast("Đã lưu cài đặt!", "success");
}

function factoryReset() {
    if (confirm("Xóa toàn bộ dữ liệu (quỹ, nhiệm vụ, thông báo, điểm danh, ghép nhóm)?")) {
        ["QL_PAID","QL_TASKS","QL_ANNOUNCEMENTS","QL_ATTENDANCE","QL_ATTEND_REC","QL_CUSTOM_FUNDS","QL_CFG","QL_GROUPS"].forEach(k => localStorage.removeItem(k));
        location.reload();
    }
}

// === IMPORT EXCEL FILE ===
let _pendingExcelData = null; // temporary storage for preview

function importExcelFile(input) {
    const statusEl = document.getElementById('excelImportStatus');
    const file = input.files[0];
    if (!file) return;
    
    statusEl.className = 'mt-2 p-2 rounded-xl text-xs font-bold text-center bg-amber-50 text-amber-700 border border-amber-200';
    statusEl.textContent = 'Đang đọc file...';
    statusEl.classList.remove('hidden');

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            if (typeof XLSX === 'undefined') {
                statusEl.className = 'mt-2 p-2 rounded-xl text-xs font-bold text-center bg-red-50 text-red-600 border border-red-200';
                statusEl.textContent = 'Lỗi: Thư viện XLSX chưa tải xong. Vui lòng thử lại.';
                return;
            }
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Get first sheet
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            // Convert to JSON array
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
            
            // Extract class name from sheet name
            let className = firstSheetName || '';
            
            // Extract student names - find the column with names
            const studentNames = [];
            let nameColIndex = -1;
            let startRow = 0;
            
            // Check if first row is a header
            if (jsonData.length > 0) {
                const firstRow = jsonData[0];
                for (let c = 0; c < firstRow.length; c++) {
                    const cellVal = String(firstRow[c]).toLowerCase().trim();
                    if (cellVal.includes('họ tên') || cellVal.includes('ho ten') || 
                        cellVal.includes('họ và tên') || cellVal.includes('tên sinh viên') ||
                        cellVal.includes('tên sv') || cellVal.includes('sinh viên') ||
                        cellVal.includes('student') || cellVal.includes('name') ||
                        cellVal.includes('tên') || cellVal.includes('thành viên')) {
                        nameColIndex = c;
                        startRow = 1;
                        break;
                    }
                    if (cellVal.includes('lớp') || cellVal.includes('nhóm') || cellVal.includes('class')) {
                        for (let cc = c + 1; cc < firstRow.length; cc++) {
                            const val = String(firstRow[cc]).trim();
                            if (val && val.length > 0 && val.length < 50) {
                                className = val;
                                break;
                            }
                        }
                    }
                }
                
                if (nameColIndex === -1) {
                    const colScores = [];
                    const maxCols = jsonData[0] ? jsonData[0].length : 0;
                    for (let c = 0; c < maxCols; c++) {
                        let score = 0;
                        for (let r = 0; r < Math.min(jsonData.length, 10); r++) {
                            const val = String(jsonData[r][c] || '').trim();
                            if (val.length >= 3 && val.length <= 50 && val.includes(' ') && !/^\d+$/.test(val)) {
                                score++;
                            }
                        }
                        colScores.push(score);
                    }
                    nameColIndex = colScores.indexOf(Math.max(...colScores));
                    if (colScores[nameColIndex] === 0) {
                        nameColIndex = maxCols > 1 ? 1 : 0;
                    }
                }
            }
            
            for (let r = startRow; r < jsonData.length; r++) {
                const row = jsonData[r];
                if (!row || row.length === 0) continue;
                const name = String(row[nameColIndex] || '').trim();
                if (name && name.length >= 2 && !/^\d+$/.test(name) && 
                    name.toLowerCase() !== 'stt' && name.toLowerCase() !== 'tổng') {
                    studentNames.push(name);
                }
            }
            
            if (studentNames.length === 0) {
                statusEl.className = 'mt-2 p-2 rounded-xl text-xs font-bold text-center bg-red-50 text-red-600 border border-red-200';
                statusEl.textContent = 'Không tìm thấy tên sinh viên trong file. Hãy kiểm tra lại định dạng file.';
                return;
            }
            
            // Store temporarily — DON'T save yet
            _pendingExcelData = { className, studentNames };
            
            // Show preview modal
            document.getElementById('excelPreviewClassLabel').textContent = className;
            document.getElementById('excelPreviewCount').textContent = studentNames.length;
            const tbody = document.getElementById('excelPreviewList');
            tbody.innerHTML = studentNames.map((name, i) => `
                <tr class="${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}">
                    <td class="px-4 py-2 text-gray-400 font-mono text-xs">${i + 1}</td>
                    <td class="px-4 py-2 font-semibold text-gray-800">${name}</td>
                </tr>
            `).join('');
            
            statusEl.className = 'mt-2 p-2 rounded-xl text-xs font-bold text-center bg-amber-50 text-amber-700 border border-amber-200';
            statusEl.textContent = 'Đang chờ xác nhận...';
            
            openModal('excelPreviewModal');
            
        } catch (err) {
            statusEl.className = 'mt-2 p-2 rounded-xl text-xs font-bold text-center bg-red-50 text-red-600 border border-red-200';
            statusEl.textContent = 'Lỗi đọc file: ' + err.message;
        }
    };
    reader.readAsArrayBuffer(file);
    input.value = '';
}

function confirmExcelImport() {
    if (!_pendingExcelData) return;
    const { className, studentNames } = _pendingExcelData;
    
    // Fill hidden inputs
    document.getElementById('appNameInput').value = className;
    document.getElementById('settingsStudentsInput').value = studentNames.join('\n');
    
    // Save to state
    state.config.appName = className;
    state.config.classroom.className = className;
    
    // Update STUDENTS array
    if (typeof STUDENTS !== 'undefined') {
        STUDENTS.length = 0;
        studentNames.forEach(name => STUDENTS.push(name));
    }
    
    // Save to localStorage
    localStorage.setItem("QL_CFG", JSON.stringify(state.config));
    
    // Update status
    const statusEl = document.getElementById('excelImportStatus');
    statusEl.className = 'mt-2 p-2 rounded-xl text-xs font-bold text-center bg-emerald-50 text-emerald-700 border border-emerald-200';
    statusEl.innerHTML = '<i class="fa-solid fa-check-circle mr-1"></i> Đã lưu ' + studentNames.length + ' thành viên lớp "' + className + '"!';
    
    // Close preview modal
    closeModal('excelPreviewModal');
    closeModal('settingsModal');
    
    showToast('Đã lưu ' + studentNames.length + ' thành viên từ Excel!', 'success');
    
    _pendingExcelData = null;
    
    // Re-render dashboard
    if (typeof renderDashboard === 'function') renderDashboard();
}

// ═══════════════════════════════════════════════════════════════
// MODULE 5: GHÉP NHÓM & PHÂN CHIA ĐỀ TÀI BÀI TẬP
// ═══════════════════════════════════════════════════════════════

let currentJoinGroupTarget = { sessionId: null, groupId: null };

function getCurrentGroupSession() {
    if (!state.groupSessions || state.groupSessions.length === 0) return null;
    if (state.currentGroupSessionId) {
        const found = state.groupSessions.find(s => s.id === state.currentGroupSessionId);
        if (found) return found;
    }
    return state.groupSessions[0] || null;
}

function setCurrentGroupSession(sessionId) {
    state.currentGroupSessionId = sessionId;
    renderGroupSessions();
}

function openGroupAssignmentsList() {
    state.currentGroupSessionId = null;
    state.groupSubTab = 'groups';
    switchView("viewGroups");
}

function openGroupSessionDetail(sessionId) {
    state.currentGroupSessionId = sessionId;
    state.groupSubTab = 'groups';
    renderGroupSessions();
    const mc = document.getElementById("mainContainer");
    if (mc) mc.scrollTop = 0;
}

function backToGroupSessionsList() {
    state.currentGroupSessionId = null;
    state.groupSubTab = 'groups';
    renderGroupSessions();
    const mc = document.getElementById("mainContainer");
    if (mc) mc.scrollTop = 0;
}

function switchGroupSubTab(tab) {
    state.groupSubTab = tab;
    renderGroupSessions();
    const mc = document.getElementById("mainContainer");
    if (mc) mc.scrollTop = 0;
}

function promptAdminThenCreateGroupSession() {
    checkAdmin(() => {
        const subInput = document.getElementById("groupSubjectInput");
        if (subInput) subInput.value = "";
        const topicInput = document.getElementById("groupTopicTitleInput");
        if (topicInput) topicInput.value = "";
        const titleInput = document.getElementById("groupSessionTitleInput");
        if (titleInput) titleInput.value = "";
        const minInput = document.getElementById("groupMinMembersInput");
        if (minInput) minInput.value = "3";
        const maxInput = document.getElementById("groupMaxMembersInput");
        if (maxInput) maxInput.value = "5";
        const deadlineInput = document.getElementById("groupDeadlineInput");
        if (deadlineInput) deadlineInput.value = "";
        const noticeInput = document.getElementById("groupNoticeInput");
        if (noticeInput) noticeInput.value = "";
        const topicsInput = document.getElementById("groupTopicsInput");
        if (topicsInput) topicsInput.value = "";
        const shuffleCheckbox = document.getElementById("groupAutoShuffleCheckbox");
        if (shuffleCheckbox) shuffleCheckbox.checked = true;
        openModal("createGroupSessionModal");
    });
}

function insertSampleTopicsToInput() {
    const el = document.getElementById("groupTopicsInput");
    if (!el) return;
    const samples = [
        "Phát triển kênh bán lẻ đa kênh Omnichannel cho thời trang GenZ",
        "Tối ưu hóa phễu chuyển đổi E-Commerce bằng công cụ tự động hóa",
        "Ứng dụng AI & Big Data trong cá nhân hóa trải nghiệm mua sắm",
        "Chiến lược Marketing 0 đồng & Mạng lưới KOC/Affiliate đa kênh",
        "Xây dựng thương hiệu số & Brand Storytelling trên mạng xã hội",
        "Quản trị rủi ro Logistics & Hoàn tất đơn hàng TMĐT",
        "Kinh doanh trực tuyến xuyên biên giới qua Amazon & Shopee Global",
        "Thương mại qua mạng xã hội (Social Commerce) & Mega Live Shopping",
        "Thanh toán số và giải pháp bảo mật trong giao dịch trực tuyến",
        "Mô hình sàn TMĐT ngách cho đặc sản nông sản Hải Phòng"
    ];
    el.value = samples.join("\n");
    showToast("Đã nạp 10 đề tài mẫu!", "info");
}

function partitionStudentsIntoGroups(studentsList, minSize, maxSize) {
    const n = studentsList.length;
    if (n === 0) return [];
    let numGroups = Math.ceil(n / maxSize);
    if (numGroups * minSize > n) {
        numGroups = Math.max(1, Math.floor(n / minSize));
    }
    if (numGroups <= 0) numGroups = 1;

    const groups = [];
    for (let i = 0; i < numGroups; i++) {
        groups.push([]);
    }
    for (let i = 0; i < n; i++) {
        groups[i % numGroups].push(studentsList[i].studentId);
    }
    return groups;
}

function submitCreateGroupSession() {
    const subject = document.getElementById("groupSubjectInput")?.value.trim() || "";
    const topic = document.getElementById("groupTopicTitleInput")?.value.trim() || document.getElementById("groupSessionTitleInput")?.value.trim() || "";
    if (!subject && !topic) { showToast("Vui lòng nhập môn học và đề tài bài tập!", "error"); return; }

    const finalSubject = subject || "Môn học";
    const finalTopic = topic || "Bài tập nhóm";
    const finalTitle = `${finalSubject} • ${finalTopic}`;

    const minMembers = Math.max(1, parseInt(document.getElementById("groupMinMembersInput")?.value) || 3);
    const maxMembers = Math.max(minMembers, parseInt(document.getElementById("groupMaxMembersInput")?.value) || 5);
    const topicMode = document.getElementById("groupTopicModeInput")?.value || "group_choice";
    const deadline = document.getElementById("groupDeadlineInput")?.value || "";
    const notice = document.getElementById("groupNoticeInput")?.value.trim() || "";
    const topicsRaw = document.getElementById("groupTopicsInput")?.value || "";
    const autoShuffle = document.getElementById("groupAutoShuffleCheckbox")?.checked;

    const rawLines = topicsRaw.split("\n").map(l => l.trim()).filter(Boolean);
    const topics = rawLines.map((line, idx) => ({
        id: "T" + (idx + 1),
        title: line,
        description: ""
    }));

    const sessionId = "group_session_" + Date.now();
    let initialGroups = [];

    if (autoShuffle) {
        const shuffled = [...STUDENTS].sort(() => Math.random() - 0.5);
        const groupMembersList = partitionStudentsIntoGroups(shuffled, minMembers, maxMembers);
        
        initialGroups = groupMembersList.map((members, idx) => {
            const groupId = idx + 1;
            let topicId = null;
            if (topicMode === "admin_assign" && topics[idx]) {
                topicId = topics[idx].id;
            }
            return {
                id: groupId,
                name: `Nhóm ${groupId}`,
                leaderId: members[0] || null,
                members: members,
                topicId: topicId
            };
        });
    } else {
        const defaultCount = Math.max(2, Math.ceil(STUDENTS.length / maxMembers));
        for (let i = 1; i <= defaultCount; i++) {
            initialGroups.push({
                id: i,
                name: `Nhóm ${i}`,
                leaderId: null,
                members: [],
                topicId: (topicMode === "admin_assign" && topics[i - 1]) ? topics[i - 1].id : null
            });
        }
    }

    const newSession = {
        id: sessionId,
        title: finalTitle,
        subject: finalSubject,
        topic: finalTopic,
        minMembers: minMembers,
        maxMembers: maxMembers,
        assignmentNotice: notice,
        assignmentDeadline: deadline,
        topicMode: topicMode,
        topics: topics,
        groups: initialGroups,
        isLocked: false,
        createdAt: new Date().toISOString()
    };

    if (!state.groupSessions) state.groupSessions = [];
    state.groupSessions.unshift(newSession);
    state.currentGroupSessionId = sessionId;
    saveGroups();
    closeModal("createGroupSessionModal");
    renderGroupSessions();
    showToast(`Đã tạo bài tập "${finalTitle}"!`, "success");
    if (typeof confetti === "function") confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
}

function toggleGroupAccordion(groupId) {
    const gid = Number(groupId);
    if (!state.expandedGroupIds) state.expandedGroupIds = new Set();
    if (state.expandedGroupIds.has(gid)) {
        state.expandedGroupIds.delete(gid);
    } else {
        state.expandedGroupIds.add(gid);
    }
    renderGroupSessions();
}

function expandAllGroups() {
    const session = getCurrentGroupSession();
    if (!session) return;
    if (!state.expandedGroupIds) state.expandedGroupIds = new Set();
    session.groups.forEach(g => state.expandedGroupIds.add(Number(g.id)));
    renderGroupSessions();
}

function collapseAllGroups() {
    if (!state.expandedGroupIds) state.expandedGroupIds = new Set();
    state.expandedGroupIds.clear();
    renderGroupSessions();
}

function toggleUnassignedAccordion() {
    state.isUnassignedOpen = !state.isUnassignedOpen;
    renderGroupSessions();
}

function openGroupNoticeModal(sessionId) {
    const session = (state.groupSessions || []).find(s => s.id === sessionId) || getCurrentGroupSession();
    if (!session) return;

    const subjectEl = document.getElementById("groupNoticeDetailSubject");
    if (subjectEl) subjectEl.textContent = `${session.subject || 'Môn học'} • ${session.topic || session.title}`;

    const contentEl = document.getElementById("groupNoticeDetailContent");
    if (contentEl) contentEl.textContent = session.assignmentNotice || "Chưa có thông báo chi tiết cho đợt bài tập này.";

    const deadlineEl = document.getElementById("groupNoticeDetailDeadline");
    if (deadlineEl) deadlineEl.textContent = session.assignmentDeadline ? formatDate(session.assignmentDeadline) : "Chưa đặt hạn nộp";

    const ruleEl = document.getElementById("groupNoticeDetailRule");
    if (ruleEl) ruleEl.textContent = `Tối thiểu ${session.minMembers} - Tối đa ${session.maxMembers} sinh viên / nhóm`;

    openModal("groupNoticeDetailModal");
}

function openGroupAdminModal() {
    checkAdmin(() => {
        const session = getCurrentGroupSession();
        const toggleBtn = document.getElementById("btnAdminToggleLockModal");
        if (toggleBtn && session) {
            toggleBtn.innerHTML = `
            <div class="flex items-center gap-3">
                <i class="fa-solid ${session.isLocked ? 'fa-lock-open text-amber-600' : 'fa-lock text-rose-600'} text-base"></i>
                <div class="text-left">
                    <div class="font-black text-xs">${session.isLocked ? 'Mở Khóa Chốt Nhóm' : 'Khóa Chốt Danh Sách Nhóm'}</div>
                    <div class="text-[10px] ${session.isLocked ? 'text-amber-600/80' : 'text-rose-600/80'} font-normal">${session.isLocked ? 'Cho phép sinh viên tự chuyển nhóm & đổi đề tài' : 'Ngăn sinh viên tự ý đổi nhóm hoặc đổi đề tài'}</div>
                </div>
            </div>
            <i class="fa-solid fa-chevron-right text-gray-400 text-xs"></i>`;
        }
        openModal("groupAdminManageModal");
    });
}

// ═══════════════════════════════════════════════════════════════
// BẢNG MÀU MÔN HỌC & ĐỀ TÀI (GIẢI QUYẾT TRIỆT ĐỂ VIỆC TRÙNG MÀU & ĐƠN ĐIỆU)
// ═══════════════════════════════════════════════════════════════

const SUBJECT_THEMES = [
    {
        keywords: ['thuong mai dien tu', 'tmdt', 'e-commerce', 'ecommerce'],
        code: 'TMĐT',
        name: 'Thương Mại Điện Tử',
        icon: 'fa-cart-shopping',
        gradient: 'from-purple-600 via-indigo-600 to-violet-700',
        badgeClass: 'bg-purple-100 text-purple-700 border-purple-200',
        iconBgClass: 'bg-purple-600 text-white',
        borderLeft: 'border-l-4 border-l-purple-500',
        cardBorder: 'border-purple-200/80 hover:border-purple-400',
        activeRing: 'ring-purple-200',
        accentText: 'text-purple-700',
        bgLight: 'bg-purple-50/60'
    },
    {
        keywords: ['kinh te luong', 'ktl', 'econometrics', 'kinh te'],
        code: 'KTL',
        name: 'Kinh Tế Lượng',
        icon: 'fa-chart-line',
        gradient: 'from-blue-600 via-cyan-600 to-sky-700',
        badgeClass: 'bg-sky-100 text-sky-800 border-sky-200',
        iconBgClass: 'bg-blue-600 text-white',
        borderLeft: 'border-l-4 border-l-blue-500',
        cardBorder: 'border-blue-200/80 hover:border-blue-400',
        activeRing: 'ring-blue-200',
        accentText: 'text-blue-700',
        bgLight: 'bg-sky-50/60'
    },
    {
        keywords: ['marketing', 'mkt', 'truyen thong', 'quang cao'],
        code: 'MKT',
        name: 'Marketing Căn Bản',
        icon: 'fa-bullhorn',
        gradient: 'from-amber-500 via-orange-500 to-red-500',
        badgeClass: 'bg-amber-100 text-amber-900 border-amber-200',
        iconBgClass: 'bg-amber-500 text-white',
        borderLeft: 'border-l-4 border-l-amber-500',
        cardBorder: 'border-amber-200/80 hover:border-amber-400',
        activeRing: 'ring-amber-200',
        accentText: 'text-amber-800',
        bgLight: 'bg-amber-50/60'
    },
    {
        keywords: ['phap luat', 'pldc', 'luat', 'law'],
        code: 'PLĐC',
        name: 'Pháp Luật Đại Cương',
        icon: 'fa-scale-balanced',
        gradient: 'from-rose-600 via-red-600 to-pink-700',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
        iconBgClass: 'bg-rose-600 text-white',
        borderLeft: 'border-l-4 border-l-rose-500',
        cardBorder: 'border-rose-200/80 hover:border-rose-400',
        activeRing: 'ring-rose-200',
        accentText: 'text-rose-700',
        bgLight: 'bg-rose-50/60'
    },
    {
        keywords: ['tai chinh', 'tien te', 'ngan hang', 'ke toan'],
        code: 'TCDN',
        name: 'Tài Chính Doanh Nghiệp',
        icon: 'fa-coins',
        gradient: 'from-emerald-600 via-teal-600 to-green-700',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        iconBgClass: 'bg-emerald-600 text-white',
        borderLeft: 'border-l-4 border-l-emerald-500',
        cardBorder: 'border-emerald-200/80 hover:border-emerald-400',
        activeRing: 'ring-emerald-200',
        accentText: 'text-emerald-700',
        bgLight: 'bg-emerald-50/60'
    }
];

function getSubjectTheme(subjectName, index = 0) {
    if (!subjectName) {
        return SUBJECT_THEMES[index % SUBJECT_THEMES.length];
    }
    const clean = removeVietnameseTones(subjectName.toLowerCase());
    const found = SUBJECT_THEMES.find(t => t.keywords.some(k => clean.includes(k)));
    if (found) return found;
    return SUBJECT_THEMES[index % SUBJECT_THEMES.length];
}

const TOPIC_PALETTES = [
    {
        badgeBg: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        tagText: 'text-indigo-700',
        cardBg: 'bg-indigo-50/50',
        border: 'border-indigo-200',
        activeBg: 'bg-indigo-600 text-white',
        iconColor: 'text-indigo-600',
        indicator: 'bg-indigo-500'
    },
    {
        badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        tagText: 'text-emerald-700',
        cardBg: 'bg-emerald-50/50',
        border: 'border-emerald-200',
        activeBg: 'bg-emerald-600 text-white',
        iconColor: 'text-emerald-600',
        indicator: 'bg-emerald-500'
    },
    {
        badgeBg: 'bg-amber-100 text-amber-900 border-amber-200',
        tagText: 'text-amber-800',
        cardBg: 'bg-amber-50/50',
        border: 'border-amber-200',
        activeBg: 'bg-amber-500 text-white',
        iconColor: 'text-amber-600',
        indicator: 'bg-amber-500'
    },
    {
        badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
        tagText: 'text-rose-700',
        cardBg: 'bg-rose-50/50',
        border: 'border-rose-200',
        activeBg: 'bg-rose-600 text-white',
        iconColor: 'text-rose-600',
        indicator: 'bg-rose-500'
    },
    {
        badgeBg: 'bg-sky-100 text-sky-800 border-sky-200',
        tagText: 'text-sky-700',
        cardBg: 'bg-sky-50/50',
        border: 'border-sky-200',
        activeBg: 'bg-sky-600 text-white',
        iconColor: 'text-sky-600',
        indicator: 'bg-sky-500'
    },
    {
        badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
        tagText: 'text-purple-700',
        cardBg: 'bg-purple-50/50',
        border: 'border-purple-200',
        activeBg: 'bg-purple-600 text-white',
        iconColor: 'text-purple-600',
        indicator: 'bg-purple-500'
    },
    {
        badgeBg: 'bg-teal-100 text-teal-800 border-teal-200',
        tagText: 'text-teal-700',
        cardBg: 'bg-teal-50/50',
        border: 'border-teal-200',
        activeBg: 'bg-teal-600 text-white',
        iconColor: 'text-teal-600',
        indicator: 'bg-teal-500'
    },
    {
        badgeBg: 'bg-orange-100 text-orange-900 border-orange-200',
        tagText: 'text-orange-800',
        cardBg: 'bg-orange-50/50',
        border: 'border-orange-200',
        activeBg: 'bg-orange-600 text-white',
        iconColor: 'text-orange-600',
        indicator: 'bg-orange-500'
    }
];

function getTopicPalette(topicId, index = 0) {
    if (topicId) {
        const match = String(topicId).match(/\d+/);
        if (match) {
            const num = parseInt(match[0], 10);
            return TOPIC_PALETTES[(num - 1) % TOPIC_PALETTES.length];
        }
    }
    return TOPIC_PALETTES[index % TOPIC_PALETTES.length];
}

function renderGroupSessions() {
    const container = document.getElementById("groupContentContainer");
    if (!container) return;

    if (!state.groupSessions || state.groupSessions.length === 0) {
        container.innerHTML = `
        <div class="py-12 px-6 text-center bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
            <div class="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl mx-auto mb-4">
                <i class="fa-solid fa-users-rectangle"></i>
            </div>
            <h3 class="text-base font-black text-gray-800">Chưa có bài tập nhóm nào</h3>
            <p class="text-xs text-gray-400 mt-1 max-w-sm mx-auto">Lớp trưởng bấm nút bên dưới để tạo bài tập lớn hoặc đề tài thuyết trình cho cả lớp.</p>
            <button onclick="promptAdminThenCreateGroupSession()" class="mt-5 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-indigo-200 transition-all cursor-pointer inline-flex items-center gap-2">
                <i class="fa-solid fa-plus"></i> Tạo bài tập nhóm mới
            </button>
        </div>`;
        return;
    }

    if (!state.currentGroupSessionId) {
        renderGroupSessionsList(container);
    } else {
        const session = state.groupSessions.find(s => s.id === state.currentGroupSessionId);
        if (!session) {
            state.currentGroupSessionId = null;
            renderGroupSessionsList(container);
        } else {
            renderSingleSessionDetail(container, session);
        }
    }
}

// CẤP ĐỘ 1: DANH SÁCH CÁC BÀI TẬP NHÓM (HIỂN THỊ MÔN + ĐỀ TÀI VỚI BẢNG MÀU RIÊNG BIỆT)
function renderGroupSessionsList(container) {
    const totalStudents = STUDENTS.length;

    container.innerHTML = `
    <!-- Thông báo tổng quan -->
    <div class="bg-gradient-to-r from-indigo-50/90 via-purple-50/70 to-pink-50/70 rounded-3xl p-4 border border-indigo-100 flex items-center justify-between text-xs text-indigo-950 font-bold mb-4 shadow-sm">
        <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-base shadow-sm">
                <i class="fa-solid fa-graduation-cap"></i>
            </div>
            <div>
                <div class="text-sm font-black text-indigo-950">Hiện có ${state.groupSessions.length} môn học có bài tập nhóm</div>
                <div class="text-xs text-indigo-600/80 font-medium">Mỗi môn có bảng màu, kho đề tài và danh sách nhóm riêng</div>
            </div>
        </div>
        <span class="text-xs text-indigo-700 font-black bg-white px-3 py-1.5 rounded-2xl border border-indigo-200 shadow-xs">
            ${totalStudents} SV
        </span>
    </div>

    <!-- Danh sách các bài tập nhóm (Môn + Đề Tài với Bảng Màu Nhận Diện Riêng) -->
    <div class="space-y-4">
        ${state.groupSessions.map((session, idx) => {
            const theme = getSubjectTheme(session.subject, idx);
            const allMembersInGroups = new Set();
            (session.groups || []).forEach(g => {
                (g.members || []).forEach(sid => allMembersInGroups.add(String(sid)));
            });
            const assignedCount = allMembersInGroups.size;
            const groupCount = (session.groups || []).length;
            const topicCount = (session.topics || []).length;
            const chosenTopicCount = (session.groups || []).filter(g => g.topicId).length;

            return `
            <div onclick="openGroupSessionDetail('${session.id}')" 
                 class="bg-white rounded-3xl p-5 sm:p-6 border-2 ${theme.cardBorder} ${theme.borderLeft} hover:shadow-xl active:scale-[0.99] transition-all cursor-pointer group shadow-sm flex items-center justify-between gap-4">
                <div class="flex-1 min-w-0">
                    <!-- TÊN MÔN HỌC -->
                    <div class="mb-2">
                        <span class="inline-flex items-center px-3 py-1 rounded-xl ${theme.badgeClass} font-black text-xs uppercase tracking-wider border shadow-2xs">
                            <span>${session.subject || theme.name}</span>
                        </span>
                    </div>
                    
                    <!-- TÊN ĐỀ TÀI -->
                    <h3 class="text-xl sm:text-2xl font-black text-gray-950 group-hover:text-indigo-600 transition-colors leading-snug tracking-tight">
                        ${session.topic || session.title}
                    </h3>
                </div>
                
                <!-- MŨI TÊN CHUYỂN TIẾP -->
                <div class="flex items-center flex-shrink-0">
                    <div class="w-9 h-9 rounded-2xl bg-gray-50 group-hover:bg-indigo-50 text-gray-400 group-hover:text-indigo-600 flex items-center justify-center font-bold text-sm transition-all group-hover:translate-x-1 border border-gray-100">
                        <span>→</span>
                    </div>
                </div>
            </div>`;
        }).join("")}
    </div>`;
}

// CẤP ĐỘ 2: CHI TIẾT BÀI TẬP ĐƯỢC CHỌN (HIỂN THỊ CÁC NHÓM & KHO ĐỀ TÀI)
function renderSingleSessionDetail(container, session) {
    const theme = getSubjectTheme(session.subject);
    const allMembersInGroups = new Set();
    session.groups.forEach(g => {
        (g.members || []).forEach(sid => allMembersInGroups.add(String(sid)));
    });
    const assignedCount = allMembersInGroups.size;
    const totalStudents = STUDENTS.length;
    const unassignedStudents = STUDENTS.filter(st => !allMembersInGroups.has(String(st.studentId)));
    const unassignedCount = unassignedStudents.length;

    const topicCount = (session.topics || []).length;
    const chosenTopicCount = (session.groups || []).filter(g => g.topicId).length;

    // 1. THANH ĐIỀU HƯỚNG TRÊN CÙNG: NÚT QUAY LẠI & CỤM NÚT CÔNG CỤ ĐI CÙNG NHAU (SEGMENTED CONTROL)
    const topBarHtml = `
    <div class="flex items-center justify-between gap-2 mb-3">
        <button onclick="backToGroupSessionsList()" 
                class="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 active:scale-95 border border-slate-200 text-slate-700 text-xs font-bold flex items-center transition-all cursor-pointer shadow-2xs" 
                title="Quay lại danh sách bài tập">
            <span>← Tất cả bài tập</span>
        </button>

        <!-- Cụm nút công cụ ĐI CÙNG NHAU (Segmented Control đồng bộ) -->
        <div class="inline-flex items-center rounded-xl bg-slate-100 p-0.5 border border-slate-200">
            <button onclick="openGroupNoticeModal('${session.id}')" 
                    class="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-white active:scale-95 transition-all flex items-center cursor-pointer" 
                    title="Xem yêu cầu bài tập của giảng viên">
                <span>Yêu cầu</span>
            </button>
            <button onclick="openGroupAdminModal()" 
                    class="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-white active:scale-95 transition-all flex items-center cursor-pointer" 
                    title="Menu Quản lý dành cho Lớp trưởng">
                <span>Quản lý</span>
            </button>
            <button onclick="openExportGroupsModal('${session.id}')" 
                    class="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-emerald-600 hover:bg-white active:scale-95 transition-all flex items-center cursor-pointer" 
                    title="Xuất file danh sách nhóm">
                <span>Xuất DS</span>
            </button>
        </div>
    </div>`;

    // 2. THẺ TIÊU ĐỀ BÀI TẬP: MÔN + ĐỀ TÀI VỚI BẢNG MÀU MÔN HỌC ĐẶC TRƯNG
    const assignmentHeaderHtml = `
    <div class="bg-white rounded-3xl p-5 border-2 ${theme.cardBorder} ${theme.borderLeft} shadow-sm">
        <div class="flex items-center justify-between gap-2 flex-wrap mb-2.5">
            <div class="flex items-center gap-2">
                <span class="px-3 py-1 rounded-xl ${theme.badgeClass} font-black text-xs uppercase tracking-wider flex items-center border shadow-2xs">
                    <span>${session.subject || theme.name}</span>
                </span>
                <span class="text-xs text-slate-300 font-bold">•</span>
                <span class="text-xs text-slate-700 font-extrabold flex items-center gap-1">
                    <span>${session.minMembers} - ${session.maxMembers} bạn/nhóm</span>
                </span>
            </div>
            ${session.assignmentDeadline ? `
                <span class="text-xs font-black text-slate-700 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200 flex items-center shadow-2xs">
                    <span>Hạn: ${formatDate(session.assignmentDeadline)}</span>
                </span>` : ''}
        </div>
        <h3 class="text-2xl sm:text-3xl font-black text-gray-950 mt-1 leading-tight tracking-tight">
            ${session.topic || session.title}
        </h3>
    </div>`;

    // 3. THANH CHUYỂN TAB: DANH SÁCH NHÓM ⟷ ĐỀ TÀI LỰA CHỌN
    const isGroupsTab = state.groupSubTab !== 'topics';
    const subTabsNavHtml = `
    <div class="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 border border-slate-200/80">
        <button onclick="switchGroupSubTab('groups')" 
                class="flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${isGroupsTab ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}">
            <span>Danh Sách Nhóm</span>
            <span class="px-2 py-0.2 rounded-md ${isGroupsTab ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-200 text-slate-600'} text-[10px]">
                ${session.groups.length}
            </span>
        </button>
        <button onclick="switchGroupSubTab('topics')" 
                class="flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${!isGroupsTab ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}">
            <span>Đề Tài Lựa Chọn</span>
            <span class="px-2 py-0.2 rounded-md ${!isGroupsTab ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-200 text-slate-600'} text-[10px]">
                ${chosenTopicCount}/${topicCount}
            </span>
        </button>
    </div>`;

    // 4. NỘI DUNG TƯƠNG ỨNG THEO SUB TAB
    let mainContentHtml = "";
    if (!isGroupsTab) {
        // Tab KHO ĐỀ TÀI
        mainContentHtml = renderTopicPoolTab(session);
    } else {
        // Tab DANH SÁCH NHÓM
        const toolbarHtml = `
        <div class="flex items-center justify-between px-1 pt-1">
            <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
                <h4 class="text-xs sm:text-sm font-black text-slate-800">
                    Danh Sách Các Nhóm (${session.groups.length} nhóm)
                </h4>
            </div>
            <!-- Cụm nút Mở tất cả & Thu gọn ĐI CÙNG NHAU (Segmented Control) -->
            <div class="inline-flex items-center rounded-xl bg-slate-100 p-0.5 border border-slate-200">
                <button onclick="expandAllGroups()" 
                        class="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-white active:scale-95 transition-all flex items-center gap-1 cursor-pointer">
                    <i class="fa-solid fa-chevron-down text-[10px]"></i>
                    <span>Mở tất cả</span>
                </button>
                <button onclick="collapseAllGroups()" 
                        class="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-white active:scale-95 transition-all flex items-center gap-1 cursor-pointer">
                    <i class="fa-solid fa-chevron-up text-[10px]"></i>
                    <span>Thu gọn</span>
                </button>
            </div>
        </div>`;

        const groupsListHtml = `
        <div class="space-y-2.5">
            ${session.groups.map(group => renderSingleGroupAccordion(session, group)).join("")}
        </div>`;

        const unassignedHtml = `
        <div class="bg-gray-50 border border-gray-200 rounded-2xl p-3 shadow-2xs">
            <div onclick="toggleUnassignedAccordion()" class="flex items-center justify-between cursor-pointer select-none">
                <div class="flex items-center gap-2 text-xs font-bold text-gray-700">
                    <i class="fa-solid fa-user-clock ${unassignedCount > 0 ? 'text-amber-500' : 'text-emerald-500'}"></i>
                    <span>${unassignedCount > 0 ? `Còn ${unassignedCount} sinh viên chưa có nhóm` : '100% Cả lớp đã có nhóm đầy đủ (54/54)'}</span>
                </div>
                <div class="flex items-center gap-1.5 text-xs text-indigo-600 font-bold">
                    <span>${state.isUnassignedOpen ? 'Thu gọn' : (unassignedCount > 0 ? 'Xem & Xếp bạn' : 'Xem')}</span>
                    <i class="fa-solid fa-chevron-down text-[10px] transition-transform duration-200 ${state.isUnassignedOpen ? 'rotate-180' : ''}"></i>
                </div>
            </div>

            ${state.isUnassignedOpen && unassignedCount > 0 ? `
            <div class="mt-3 pt-3 border-t border-gray-200/80">
                <p class="text-[11px] text-gray-500 mb-2">Bấm vào tên bất kỳ để xếp nhanh bạn đó vào một nhóm còn chỗ trống:</p>
                <div class="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                    ${unassignedStudents.map(st => `
                        <button onclick="quickAssignStudentPrompt('${session.id}', '${st.studentId}')" 
                                class="px-2.5 py-1 rounded-xl bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer">
                            <span>${st.name}</span>
                            <span class="text-[10px] text-gray-400 font-mono">(${st.studentId})</span>
                            <i class="fa-solid fa-plus text-[9px] text-amber-600 ml-0.5"></i>
                        </button>
                    `).join("")}
                </div>
            </div>` : ''}
        </div>`;

        mainContentHtml = toolbarHtml + groupsListHtml + unassignedHtml;
    }

    container.innerHTML = topBarHtml + assignmentHeaderHtml + subTabsNavHtml + mainContentHtml;
}

// TAB KHO ĐỀ TÀI: HIỂN THỊ CÁC ĐỀ TÀI VỚI BẢNG MÀU RIÊNG, TÌNH TRẠNG & NÚT ĐĂNG KÝ
function renderTopicPoolTab(session) {
    const topics = session.topics || [];
    
    // Map các đề tài đã có nhóm nhận
    const topicGroupMap = {};
    (session.groups || []).forEach(g => {
        if (g.topicId) {
            topicGroupMap[g.topicId] = g;
        }
    });

    const chosenCount = Object.keys(topicGroupMap).length;
    const availableCount = Math.max(0, topics.length - chosenCount);

    return `
    <div class="space-y-3">
        <!-- Toolbar Kho Đề Tài -->
        <div class="flex items-center justify-between gap-2 px-1 pt-1">
            <div>
                <div class="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1.5">
                    <i class="fa-solid fa-layer-group text-indigo-600"></i>
                    <span>Kho Đề Tài Môn Học (${topics.length} đề tài)</span>
                </div>
                <div class="text-[11px] text-slate-500 font-medium">
                    <span class="text-emerald-700 font-bold">${chosenCount} đã chọn</span> • 
                    <span class="text-indigo-600 font-bold">${availableCount} còn trống</span>
                </div>
            </div>
            
            <!-- Cụm nút Lớp trưởng thao tác Đề Tài -->
            <div class="inline-flex items-center gap-1.5">
                <button onclick="openAddTopicModal('${session.id}')" 
                        class="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-black text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer" 
                        title="Thêm đề tài mới vào kho">
                    <i class="fa-solid fa-plus text-[10px]"></i>
                    <span class="hidden sm:inline">Thêm đề tài</span>
                </button>
                <button onclick="adminAutoAssignTopics('${session.id}')" 
                        class="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 active:scale-95 text-slate-700 hover:text-indigo-600 border border-slate-200 font-bold text-xs shadow-2xs transition-all flex items-center gap-1 cursor-pointer" 
                        title="Phát ngẫu nhiên đề tài cho các nhóm">
                    <i class="fa-solid fa-dice text-indigo-600 text-xs"></i>
                    <span class="hidden sm:inline">Phát tự động</span>
                </button>
            </div>
        </div>

        <!-- Danh sách các thẻ đề tài -->
        ${topics.length === 0 ? `
            <div class="py-12 px-6 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl mx-auto mb-3">
                    <i class="fa-solid fa-lightbulb"></i>
                </div>
                <h4 class="text-sm font-black text-slate-800">Chưa có đề tài nào trong kho</h4>
                <p class="text-xs text-slate-400 mt-1">Lớp trưởng bấm nút "+ Thêm đề tài" để tạo danh sách đề tài cho các nhóm chọn.</p>
                <button onclick="openAddTopicModal('${session.id}')" class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-md shadow-indigo-200 cursor-pointer">
                    + Thêm Đề Tài Đầu Tiên
                </button>
            </div>` : `
            <div class="space-y-3">
                ${topics.map((topic, idx) => {
                    const palette = getTopicPalette(topic.id, idx);
                    const assignedGroup = topicGroupMap[topic.id];

                    return `
                    <div class="bg-white rounded-2xl p-4 sm:p-5 border ${palette.border} hover:shadow-md transition-all shadow-2xs">
                        <div class="flex items-start justify-between gap-3">
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-2 mb-1.5 flex-wrap">
                                    <span class="px-2.5 py-0.5 rounded-lg ${palette.badgeBg} font-mono font-black text-[11px] border shadow-2xs">
                                        ${topic.id}
                                    </span>
                                    ${assignedGroup ? `
                                        <span class="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 font-extrabold text-[11px] border border-emerald-200 flex items-center gap-1 shadow-2xs">
                                            <i class="fa-solid fa-circle-check text-emerald-600"></i> ${assignedGroup.name} đã chọn (${(assignedGroup.members || []).length} SV)
                                        </span>` : `
                                        <span class="px-2.5 py-0.5 rounded-lg bg-slate-50 text-slate-600 font-bold text-[11px] border border-slate-200 flex items-center gap-1 shadow-2xs">
                                            <i class="fa-solid fa-circle-dot text-indigo-500 text-[8px] animate-pulse"></i> Còn trống
                                        </span>`}
                                </div>
                                <h4 class="text-base sm:text-lg font-black text-gray-950 leading-snug mt-1">
                                    ${topic.title}
                                </h4>
                                ${topic.description ? `
                                    <p class="text-xs text-slate-600 mt-1.5 leading-relaxed bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                                        ${topic.description}
                                    </p>` : ''}
                            </div>
                        </div>

                        <!-- Chân card Đề tài: Nút đăng ký cho nhóm -->
                        <div class="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                            ${!assignedGroup ? `
                                <div class="text-xs text-slate-500 font-medium">
                                    Chưa có nhóm nào đăng ký đề tài này
                                </div>
                                ${!session.isLocked ? `
                                <button onclick="openAssignTopicToGroupModal('${session.id}', '${topic.id}')" 
                                        class="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-xs shadow-md shadow-indigo-200 transition-all flex items-center gap-1.5 cursor-pointer">
                                    <i class="fa-solid fa-hand-pointer text-xs"></i>
                                    <span>Đăng ký cho nhóm</span>
                                </button>` : ''}` : `
                                <div class="text-xs text-slate-500 font-medium">
                                    Đang giao cho: <b class="text-indigo-700 font-bold">${assignedGroup.name}</b>
                                </div>`}
                        </div>
                    </div>`;
                }).join("")}
            </div>`}
    </div>`;
}

// THẺ TỪNG NHÓM (ACCORDION CÓ MÃ MÀU ĐỀ TÀI RIÊNG, KHÔNG BỊ TRÙNG MÀU)
function renderSingleGroupAccordion(session, group) {
    const memberCount = (group.members || []).length;
    const isFull = memberCount >= session.maxMembers;
    const isExpanded = state.expandedGroupIds && state.expandedGroupIds.has(Number(group.id));

    // Đề tài & Bảng màu đề tài
    const topic = (session.topics || []).find(t => t.id === group.topicId);
    const topicTitle = topic ? topic.title : null;
    const topicDescription = topic ? topic.description : null;
    const topicPalette = topic ? getTopicPalette(group.topicId) : null;

    // Trưởng nhóm
    const leaderStudent = group.leaderId ? STUDENTS.find(s => String(s.studentId) === String(group.leaderId)) : null;
    const leaderName = leaderStudent ? leaderStudent.name : null;

    // Status badge (loại bỏ Đủ chuẩn, chỉ hiển thị Đã đầy khi nhóm đạt tối đa)
    let statusBadge = "";
    if (isFull) {
        statusBadge = `<span class="px-2 py-0.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-bold text-[10px]">Đã đầy</span>`;
    }

    // Danh sách thành viên (chỉ render khi mở accordion)
    let membersListHtml = "";
    if (isExpanded) {
        if (!group.members || group.members.length === 0) {
            membersListHtml = `
            <div class="py-3 text-center text-xs text-gray-400 font-medium bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                Chưa có thành viên nào trong nhóm này
            </div>`;
        } else {
            membersListHtml = `
            <div class="space-y-1.5">
                ${group.members.map(sid => {
                    const st = STUDENTS.find(s => String(s.studentId) === String(sid));
                    const name = st ? st.name : `Sinh viên ${sid}`;
                    const isLeader = String(group.leaderId) === String(sid);
                    const initial = name.trim().split(" ").pop().charAt(0);

                    return `
                    <div class="flex items-center justify-between p-2 rounded-xl bg-gray-50/90 hover:bg-indigo-50/60 border border-gray-100 transition-colors">
                        <div class="flex items-center gap-2.5">
                            <div class="w-7 h-7 rounded-lg ${isLeader ? 'bg-amber-100 text-amber-700 font-black' : 'bg-gray-200 text-gray-700 font-bold'} flex items-center justify-center text-xs flex-shrink-0">
                                ${isLeader ? '👑' : initial}
                            </div>
                            <div>
                                <div class="text-xs font-black text-gray-900 leading-tight flex items-center gap-1.5">
                                    <span>${name}</span>
                                    ${isLeader ? '<span class="px-1.5 py-0.2 rounded-md bg-amber-400 text-amber-950 font-black text-[9px] shadow-2xs">Trưởng nhóm</span>' : ''}
                                </div>
                                <div class="text-[10px] text-gray-400 font-mono">Mã SV: ${sid}</div>
                            </div>
                        </div>
                        ${!session.isLocked ? `
                        <div class="flex items-center gap-1">
                            ${!isLeader ? `
                            <button onclick="event.stopPropagation(); adminSetGroupLeader('${session.id}', ${group.id}, '${sid}')" 
                                    class="w-7 h-7 rounded-lg hover:bg-amber-100 text-gray-400 hover:text-amber-700 flex items-center justify-center text-xs transition-colors cursor-pointer" title="Chỉ định làm Trưởng nhóm">
                                👑
                            </button>` : ''}
                            <button onclick="event.stopPropagation(); removeStudentFromGroup('${session.id}', ${group.id}, '${sid}')" 
                                    class="w-7 h-7 rounded-lg hover:bg-rose-100 text-gray-400 hover:text-rose-600 flex items-center justify-center text-xs transition-colors cursor-pointer" title="Xóa khỏi nhóm">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>` : ''}
                    </div>`;
                }).join("")}
            </div>`;
        }
    }

    return `
    <div class="bg-white rounded-3xl border-2 ${isExpanded ? 'border-indigo-400 shadow-md ring-4 ring-indigo-50' : 'border-gray-200/90 shadow-sm hover:border-indigo-200'} transition-all overflow-hidden">
        <!-- Thanh tiêu đề nhóm (ẤN VÀO ĐỂ MỞ / ĐÓNG XỔ RA THÀNH VIÊN) -->
        <div onclick="toggleGroupAccordion(${group.id})" 
             class="p-3.5 sm:p-4 flex items-center justify-between cursor-pointer select-none ${isExpanded ? 'bg-indigo-50/40' : 'hover:bg-gray-50/70'} transition-colors">
            <div class="flex items-center gap-3 min-w-0 flex-1 pr-2">
                <div class="w-11 h-11 rounded-2xl ${isExpanded ? 'bg-indigo-600 text-white shadow-md shadow-indigo-300' : 'bg-indigo-100 text-indigo-800'} flex items-center justify-center font-black text-base flex-shrink-0 transition-all">
                    ${group.id}
                </div>
                <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2.5 flex-wrap">
                        <span class="text-base sm:text-lg font-black text-gray-950 tracking-tight">${group.name}</span>
                        ${statusBadge}
                    </div>
                    
                    <!-- ĐỀ TÀI TÓM TẮT VỚI BẢNG MÀU PHÂN BỔ ĐẶC TRƯNG -->
                    ${topicTitle && topicPalette ? `
                        <div class="mt-1.5 flex items-center gap-2 flex-wrap">
                            <span class="inline-flex items-center px-3 py-1 rounded-xl ${topicPalette.badgeBg} text-xs font-black max-w-full truncate shadow-2xs border">
                                <span class="font-mono font-black mr-1">${group.topicId}:</span>
                                <span class="truncate font-black">${topicTitle}</span>
                            </span>
                            ${leaderName ? `<span class="text-gray-500 font-bold text-xs hidden sm:inline">• Trưởng nhóm: <b class="text-gray-900 font-black">${leaderName}</b></span>` : ''}
                        </div>` : `
                        <div class="mt-1.5 flex items-center gap-2 flex-wrap">
                            <span class="inline-flex items-center px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black">
                                Chưa chọn đề tài
                            </span>
                            ${!session.isLocked ? `
                            <button onclick="event.stopPropagation(); openChooseTopicModal('${session.id}', ${group.id})" 
                                    class="px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black text-xs border border-indigo-200 transition-all cursor-pointer shadow-2xs">
                                <span>Chọn đề tài</span>
                            </button>` : ''}
                            ${leaderName ? `<span class="text-gray-500 font-bold text-xs hidden sm:inline">• Trưởng nhóm: <b class="text-gray-900 font-black">${leaderName}</b></span>` : ''}
                        </div>`}
                </div>
            </div>

            <div class="flex items-center gap-2.5 flex-shrink-0">
                <span class="text-xs font-black text-gray-700 font-mono bg-gray-100 px-2.5 py-1 rounded-xl border border-gray-200">
                    ${memberCount}/${session.maxMembers} bạn
                </span>
                <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs transition-transform duration-200 ${isExpanded ? 'rotate-180 bg-indigo-100 text-indigo-600' : ''}">
                    <span class="font-bold text-[10px]">▼</span>
                </div>
            </div>
        </div>

        <!-- PHẦN XỔ RA KHI ẤN VÀO NHÓM: HIỆN ĐỀ TÀI & DANH SÁCH THÀNH VIÊN -->
        ${isExpanded ? `
        <div class="p-4 sm:p-5 border-t border-gray-100 space-y-3.5 bg-white animate-[slideDown_0.2s_ease-out]">
            <!-- Đề tài đầy đủ (Có màu sắc nhận diện riêng biệt) -->
            ${topicTitle && topicPalette ? `
                <div class="p-4 rounded-2xl ${topicPalette.cardBg} border-2 ${topicPalette.border} shadow-2xs">
                    <div class="flex items-start justify-between gap-3">
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-1.5 mb-1.5">
                                <span class="px-2.5 py-0.5 rounded-lg ${topicPalette.badgeBg} font-mono font-black text-xs border">
                                    ${group.topicId}
                                </span>
                                <span class="text-xs font-black ${topicPalette.tagText} uppercase tracking-wider">
                                    ĐỀ TÀI CỦA NHÓM
                                </span>
                            </div>
                            <h5 class="text-base sm:text-lg font-black text-gray-950 leading-snug">
                                ${topicTitle}
                            </h5>
                            ${topicDescription ? `
                                <p class="text-[11px] text-slate-600 mt-1 leading-relaxed bg-white/60 p-2 rounded-xl border border-slate-200/50">
                                    ${topicDescription}
                                </p>` : ''}
                        </div>
                    </div>
                </div>` : `
                <div class="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 shadow-2xs">
                    <div class="flex items-center justify-between gap-3">
                        <div>
                            <div class="text-[10px] font-black text-amber-800 uppercase tracking-wider flex items-center gap-1">
                                <i class="fa-solid fa-triangle-exclamation text-amber-600"></i> ĐỀ TÀI BÀI TẬP:
                            </div>
                            <div class="text-xs sm:text-sm font-black text-amber-950 mt-0.5">
                                Nhóm này chưa đăng ký đề tài nào!
                            </div>
                            <div class="text-[11px] text-amber-700/80 mt-0.5">Bấm nút bên cạnh để chọn trong kho đề tài của môn.</div>
                        </div>
                        ${!session.isLocked ? `
                        <button onclick="event.stopPropagation(); openChooseTopicModal('${session.id}', ${group.id})" 
                                class="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-black text-xs shadow-md shadow-amber-200 transition-all flex-shrink-0 cursor-pointer flex items-center gap-1.5">
                            <i class="fa-solid fa-bullseye text-xs"></i>
                            <span>Chọn đề tài</span>
                        </button>` : ''}
                    </div>
                </div>`}

            <!-- Danh sách thành viên -->
            <div>
                <div class="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Thành viên (${memberCount} bạn):</span>
                    <span class="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">👑 Trưởng nhóm</span>
                </div>
                ${membersListHtml}
            </div>

            <!-- Tác vụ chân nhóm -->
            <div class="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                ${!session.isLocked && !isFull ? `
                <button onclick="event.stopPropagation(); openJoinGroupModal('${session.id}', ${group.id})" 
                        class="flex-1 py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                    <i class="fa-solid fa-user-plus text-xs"></i> Thêm thành viên
                </button>` : `
                <div class="text-xs text-gray-400 font-medium italic">
                    ${session.isLocked ? '🔒 Nhóm đã khóa' : '✅ Đã đủ thành viên tối đa'}
                </div>`}
                
                ${!session.isLocked ? `
                <button onclick="event.stopPropagation(); deleteGroup('${session.id}', ${group.id})" 
                        class="py-2 px-3 rounded-xl bg-gray-100 hover:bg-rose-100 text-gray-500 hover:text-rose-600 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 flex-shrink-0" title="Xóa nhóm này">
                    <i class="fa-solid fa-trash-can text-xs"></i>
                    <span class="hidden sm:inline">Xóa nhóm</span>
                </button>` : ''}
            </div>
        </div>` : ''}
    </div>`;
}

function adminAutoShuffleGroups(sessionId) {
    checkAdmin(() => {
        const session = (state.groupSessions || []).find(s => s.id === sessionId);
        if (!session) return;
        if (session.isLocked) { showToast("Đợt này đang bị khóa!", "warning"); return; }

        if (!confirm(`Xác nhận chia ngẫu nhiên lại toàn bộ 54 sinh viên vào các nhóm (Mỗi nhóm ${session.minMembers} - ${session.maxMembers} người)?`)) return;

        const shuffled = [...STUDENTS].sort(() => Math.random() - 0.5);
        const groupMembersList = partitionStudentsIntoGroups(shuffled, session.minMembers, session.maxMembers);
        
        session.groups = groupMembersList.map((members, idx) => {
            const groupId = idx + 1;
            let topicId = null;
            if (session.topicMode === "admin_assign" && session.topics && session.topics[idx]) {
                topicId = session.topics[idx].id;
            } else if (session.groups && session.groups[idx] && session.groups[idx].topicId) {
                topicId = session.groups[idx].topicId;
            }
            return {
                id: groupId,
                name: `Nhóm ${groupId}`,
                leaderId: members[0] || null,
                members: members,
                topicId: topicId
            };
        });

        saveGroups();
        renderGroupSessions();
        showToast("Đã chia ngẫu nhiên thành công cả lớp!", "success");
        if (typeof confetti === "function") confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    });
}

function adminAutoAssignTopics(sessionId) {
    checkAdmin(() => {
        const session = (state.groupSessions || []).find(s => s.id === sessionId);
        if (!session) return;
        if (!session.topics || session.topics.length === 0) {
            showToast("Chưa có danh sách đề tài để phát!", "error");
            return;
        }

        const shuffledTopics = [...session.topics].sort(() => Math.random() - 0.5);
        session.groups.forEach((group, idx) => {
            const assignedTopic = shuffledTopics[idx % shuffledTopics.length];
            group.topicId = assignedTopic ? assignedTopic.id : null;
            // Người đầu tiên trong nhóm = Trưởng nhóm
            if (!group.leaderId && group.members && group.members.length > 0) {
                group.leaderId = group.members[0];
            }
        });

        saveGroups();
        renderGroupSessions();
        showToast("Đã phát đề tài tự động cho tất cả các nhóm!", "success");
        if (typeof confetti === "function") confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    });
}

// MODAL 1: CHỌN ĐỀ TÀI TỪ THẺ NHÓM
function openChooseTopicModal(sessionId, groupId) {
    const session = (state.groupSessions || []).find(s => s.id === sessionId);
    if (!session) return;
    const group = session.groups.find(g => g.id === groupId);
    if (!group) return;

    // Nếu nhóm đã có đề tài rồi, không cho chọn thêm
    if (group.topicId) {
        showToast('Nhóm này đã đăng ký đề tài rồi! Không thể đổi.', 'warning');
        return;
    }

    const groupNameEl = document.getElementById("chooseTopicGroupName");
    if (groupNameEl) groupNameEl.textContent = `${group.name} • ${session.subject || session.title}`;

    const container = document.getElementById("chooseTopicListContainer");
    if (!container) return;

    if (!session.topics || session.topics.length === 0) {
        container.innerHTML = `
        <div class="py-8 text-center text-gray-400 text-xs">
            Chưa có đề tài nào trong kho của môn học này. Lớp trưởng có thể thêm đề tài mới ở tab Kho Đề Tài.
        </div>`;
        openModal("chooseTopicModal");
        return;
    }

    // Tìm các đề tài đã được nhóm khác chọn
    const takenTopicMap = {};
    session.groups.forEach(g => {
        if (g.topicId) {
            takenTopicMap[g.topicId] = g.name;
        }
    });

    // Chỉ hiển thị đề tài chưa được đăng ký
    const availableTopics = session.topics.filter(t => !takenTopicMap[t.id]);
    
    if (availableTopics.length === 0) {
        container.innerHTML = `
        <div class="py-8 text-center text-gray-400 text-xs">
            Tất cả đề tài đã được đăng ký. Không còn đề tài trống.
        </div>`;
        openModal("chooseTopicModal");
        return;
    }

    container.innerHTML = availableTopics.map((topic, idx) => {
        const palette = getTopicPalette(topic.id, idx);

        return `
        <div class="p-3.5 rounded-2xl border transition-all bg-white hover:bg-gray-50 border-gray-200 flex items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1 flex-wrap">
                    <span class="px-2 py-0.5 rounded-md ${palette.badgeBg} font-mono text-[10px] font-black border">${topic.id}</span>
                    <span class="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200">Còn trống</span>
                </div>
                <h4 class="text-xs sm:text-sm font-extrabold text-gray-900 leading-snug">${topic.title}</h4>
                ${topic.description ? `<p class="text-[11px] text-gray-500 mt-1 leading-relaxed">${topic.description}</p>` : ''}
            </div>
            
            <button onclick="selectTopicForGroup('${session.id}', ${group.id}, '${topic.id}')" class="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition-all shadow-xs flex-shrink-0 cursor-pointer">
                Chọn đề tài này
            </button>
        </div>`;
    }).join("");

    openModal("chooseTopicModal");
}

// MODAL 2: GÁN ĐỀ TÀI CHO NHÓM (MỞ TỪ KHO ĐỀ TÀI)
function openAssignTopicToGroupModal(sessionId, topicId) {
    const session = (state.groupSessions || []).find(s => s.id === sessionId);
    if (!session) return;
    const topic = (session.topics || []).find(t => t.id === topicId);
    if (!topic) return;

    currentAssignTopicTarget = { sessionId, topicId };

    const titleBadge = document.getElementById("assignTopicTitleBadge");
    if (titleBadge) {
        titleBadge.textContent = `${topic.id}: ${topic.title}`;
    }

    const container = document.getElementById("assignTopicGroupListContainer");
    if (!container) return;

    if (!session.groups || session.groups.length === 0) {
        container.innerHTML = `
        <div class="py-8 text-center text-xs text-gray-400">
            Chưa có nhóm nào trong môn học này. Hãy tạo nhóm trước!
        </div>`;
        openModal("assignTopicToGroupModal");
        return;
    }

    // Chỉ hiển thị nhóm CHƯA CÓ đề tài
    const availableGroups = session.groups.filter(g => !g.topicId);
    
    if (availableGroups.length === 0) {
        container.innerHTML = `
        <div class="py-8 text-center text-xs text-gray-400">
            Tất cả nhóm đã đăng ký đề tài. Không còn nhóm trống.
        </div>`;
        openModal("assignTopicToGroupModal");
        return;
    }

    container.innerHTML = availableGroups.map(group => {
        const memberCount = (group.members || []).length;

        return `
        <div class="p-3 rounded-2xl border bg-white hover:bg-gray-50 border-gray-200 flex items-center justify-between gap-3 transition-all">
            <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                    <span class="text-xs sm:text-sm font-black text-gray-900">${group.name}</span>
                    <span class="text-[10px] font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md font-bold">
                        ${memberCount}/${session.maxMembers} bạn
                    </span>
                </div>
                <div class="text-[11px] text-amber-600 font-bold mt-0.5">Chưa có đề tài</div>
            </div>

            <button onclick="confirmAssignTopicToGroup('${session.id}', ${group.id}, '${topic.id}')" 
                    class="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition-all flex-shrink-0 cursor-pointer shadow-2xs">
                Gán cho nhóm này
            </button>
        </div>`;
    }).join("");

    openModal("assignTopicToGroupModal");
}

function confirmAssignTopicToGroup(sessionId, groupId, topicId) {
    const session = (state.groupSessions || []).find(s => s.id === sessionId);
    if (!session) return;
    const group = session.groups.find(g => g.id === groupId);
    if (!group) return;

    // Không cho nhóm đã có đề tài đăng ký thêm
    if (group.topicId) {
        showToast('Nhóm này đã đăng ký đề tài rồi!', 'warning');
        return;
    }

    // Không cho chọn đề tài đã được nhóm khác đăng ký
    const previousHolder = session.groups.find(g => g.id !== groupId && g.topicId === topicId);
    if (previousHolder) {
        showToast(`Đề tài này đã được ${previousHolder.name} đăng ký rồi!`, 'warning');
        return;
    }

    group.topicId = topicId;
    
    // Người đầu tiên trong nhóm = Trưởng nhóm
    if (!group.leaderId && group.members && group.members.length > 0) {
        group.leaderId = group.members[0];
    }
    
    saveGroups();
    closeModal("assignTopicToGroupModal");
    renderGroupSessions();
    showToast(`Đã gán đề tài cho ${group.name} thành công!`, "success");
    if (typeof confetti === "function") confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
}

// MODAL 3: THÊM ĐỀ TÀI MỚI VÀO KHO (ADMIN)
function openAddTopicModal(sessionId) {
    checkAdmin(() => {
        const session = (state.groupSessions || []).find(s => s.id === sessionId);
        if (!session) return;

        currentAddTopicSessionId = sessionId;

        const subEl = document.getElementById("addTopicSessionTitle");
        if (subEl) subEl.textContent = `Thêm đề tài cho môn ${session.subject || session.title}`;

        const titleInput = document.getElementById("newTopicTitleInput");
        if (titleInput) titleInput.value = "";

        const descInput = document.getElementById("newTopicDescInput");
        if (descInput) descInput.value = "";

        openModal("addTopicModal");
    });
}

function submitAddNewTopic() {
    if (!currentAddTopicSessionId) return;
    const session = (state.groupSessions || []).find(s => s.id === currentAddTopicSessionId);
    if (!session) return;

    const title = (document.getElementById("newTopicTitleInput")?.value || "").trim();
    const desc = (document.getElementById("newTopicDescInput")?.value || "").trim();

    if (!title) {
        showToast("Vui lòng nhập tên đề tài!", "warning");
        return;
    }

    if (!session.topics) session.topics = [];

    // Tìm mã đề tài tiếp theo (T1, T2, T3...)
    const maxNum = session.topics.reduce((max, t) => {
        const n = parseInt(String(t.id).replace(/\D/g, "")) || 0;
        return n > max ? n : max;
    }, 0);

    const newId = `T${maxNum + 1}`;
    session.topics.push({
        id: newId,
        title: title,
        description: desc
    });

    saveGroups();
    closeModal("addTopicModal");
    renderGroupSessions();
    showToast(`Đã thêm đề tài [${newId}] thành công!`, "success");
    if (typeof confetti === "function") confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
}

function selectTopicForGroup(sessionId, groupId, topicId) {
    const session = (state.groupSessions || []).find(s => s.id === sessionId);
    if (!session) return;
    const group = session.groups.find(g => g.id === groupId);
    if (!group) return;

    // Không cho nhóm đã có đề tài đăng ký thêm
    if (group.topicId) {
        showToast('Nhóm này đã đăng ký đề tài rồi!', 'warning');
        return;
    }

    // Không cho chọn đề tài đã được nhóm khác đăng ký
    const alreadyTaken = session.groups.find(g => g.id !== groupId && g.topicId === topicId);
    if (alreadyTaken) {
        showToast(`Đề tài này đã được ${alreadyTaken.name} đăng ký rồi!`, 'warning');
        return;
    }

    group.topicId = topicId;
    
    // Người đầu tiên trong nhóm = Trưởng nhóm
    if (!group.leaderId && group.members && group.members.length > 0) {
        group.leaderId = group.members[0];
    }
    
    saveGroups();
    closeModal("chooseTopicModal");
    renderGroupSessions();
    showToast(`Đã chọn đề tài cho ${group.name}!`, "success");
    if (typeof confetti === "function") confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
}

function openJoinGroupModal(sessionId, groupId) {
    currentJoinGroupTarget = { sessionId, groupId };
    const session = (state.groupSessions || []).find(s => s.id === sessionId);
    const group = session?.groups.find(g => g.id === groupId);
    
    const titleBadge = document.getElementById("joinGroupTitleBadge");
    if (titleBadge && group) {
        titleBadge.textContent = `Thêm bạn vào ${group.name} (Hiện có ${group.members?.length || 0}/${session.maxMembers})`;
    }

    const searchInput = document.getElementById("joinGroupSearchInput");
    if (searchInput) searchInput.value = "";

    renderJoinGroupStudentList();
    openModal("joinGroupModal");
}

function renderJoinGroupStudentList() {
    const { sessionId, groupId } = currentJoinGroupTarget;
    const session = (state.groupSessions || []).find(s => s.id === sessionId);
    if (!session) return;
    const group = session.groups.find(g => g.id === groupId);
    if (!group) return;

    const container = document.getElementById("joinGroupStudentListContainer");
    const query = removeVietnameseTones((document.getElementById("joinGroupSearchInput")?.value || "").trim().toLowerCase());
    if (!container) return;

    // Lấy danh sách bạn CHƯA CÓ NHÓM trong session này
    const allMembersInGroups = new Set();
    session.groups.forEach(g => {
        (g.members || []).forEach(sid => allMembersInGroups.add(String(sid)));
    });

    const unassigned = STUDENTS.filter(st => !allMembersInGroups.has(String(st.studentId)));

    const filtered = unassigned.filter(st => {
        if (!query) return true;
        const nameMatch = removeVietnameseTones(st.name.toLowerCase()).includes(query);
        const idMatch = st.studentId.toLowerCase().includes(query);
        return nameMatch || idMatch;
    });

    if (filtered.length === 0) {
        container.innerHTML = `
        <div class="py-8 text-center text-xs text-gray-400 font-medium">
            ${unassigned.length === 0 ? 'Tất cả 54 sinh viên cả lớp đều đã có nhóm!' : 'Không tìm thấy sinh viên phù hợp'}
        </div>`;
        return;
    }

    container.innerHTML = filtered.map(st => {
        const initial = st.name.trim().split(" ").pop().charAt(0);
        return `
        <div class="p-2.5 rounded-2xl bg-white hover:bg-indigo-50/50 border border-gray-200 flex items-center justify-between transition-all">
            <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-xs">
                    ${initial}
                </div>
                <div>
                    <div class="text-xs font-black text-gray-900">${st.name}</div>
                    <div class="text-[10px] text-gray-400 font-mono">Mã SV: ${st.studentId}</div>
                </div>
            </div>
            <button onclick="studentJoinGroup('${session.id}', ${group.id}, '${st.studentId}')" class="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition-all shadow-xs flex items-center gap-1 cursor-pointer">
                <i class="fa-solid fa-plus text-[10px]"></i> Thêm
            </button>
        </div>`;
    }).join("");
}

function studentJoinGroup(sessionId, groupId, studentId) {
    const session = (state.groupSessions || []).find(s => s.id === sessionId);
    if (!session) return;
    const group = session.groups.find(g => g.id === groupId);
    if (!group) return;

    if (!group.members) group.members = [];
    if (group.members.length >= session.maxMembers) {
        showToast(`Nhóm đã đạt số lượng tối đa (${session.maxMembers} người)!`, "error");
        return;
    }

    if (!group.members.includes(String(studentId))) {
        group.members.push(String(studentId));
        if (!group.leaderId) group.leaderId = String(studentId);
    }

    saveGroups();
    closeModal("joinGroupModal");
    renderGroupSessions();
    const st = STUDENTS.find(s => String(s.studentId) === String(studentId));
    showToast(`Đã thêm ${st?.name || studentId} vào ${group.name}!`, "success");
}

function quickAssignStudentPrompt(sessionId, studentId) {
    const session = (state.groupSessions || []).find(s => s.id === sessionId);
    if (!session) return;
    const st = STUDENTS.find(s => String(s.studentId) === String(studentId));
    const availableGroups = session.groups.filter(g => (g.members || []).length < session.maxMembers);
    
    if (availableGroups.length === 0) {
        showToast("Tất cả các nhóm hiện tại đều đã đầy!", "warning");
        return;
    }

    const groupOptions = availableGroups.map(g => `${g.id}. ${g.name} (${(g.members||[]).length}/${session.maxMembers})`).join("\n");
    const input = prompt(`Chọn số nhóm muốn thêm bạn ${st?.name || studentId} vào:\n\n${groupOptions}`);
    if (!input) return;

    const chosenId = parseInt(input.trim());
    const targetGroup = availableGroups.find(g => g.id === chosenId);
    if (!targetGroup) {
        showToast("Số nhóm không hợp lệ!", "error");
        return;
    }

    studentJoinGroup(sessionId, targetGroup.id, studentId);
}

function removeStudentFromGroup(sessionId, groupId, studentId) {
    const session = (state.groupSessions || []).find(s => s.id === sessionId);
    if (!session) return;
    const group = session.groups.find(g => g.id === groupId);
    if (!group) return;

    group.members = (group.members || []).filter(sid => String(sid) !== String(studentId));
    if (String(group.leaderId) === String(studentId)) {
        group.leaderId = group.members[0] || null;
    }

    saveGroups();
    renderGroupSessions();
    showToast("Đã đưa sinh viên ra khỏi nhóm!", "info");
}

function adminSetGroupLeader(sessionId, groupId, studentId) {
    const session = (state.groupSessions || []).find(s => s.id === sessionId);
    if (!session) return;
    const group = session.groups.find(g => g.id === groupId);
    if (!group) return;

    group.leaderId = String(studentId);
    saveGroups();
    renderGroupSessions();
    const st = STUDENTS.find(s => String(s.studentId) === String(studentId));
    showToast(`Đã chỉ định ${st?.name || studentId} làm Trưởng nhóm!`, "success");
}

function adminAddNewGroup(sessionId) {
    checkAdmin(() => {
        const session = (state.groupSessions || []).find(s => s.id === sessionId);
        if (!session) return;

        const newId = session.groups.length > 0 ? Math.max(...session.groups.map(g => g.id)) + 1 : 1;
        session.groups.push({
            id: newId,
            name: `Nhóm ${newId}`,
            leaderId: null,
            members: [],
            topicId: null
        });

        saveGroups();
        renderGroupSessions();
        showToast(`Đã thêm Nhóm ${newId}!`, "success");
    });
}

function deleteGroup(sessionId, groupId) {
    checkAdmin(() => {
        const session = (state.groupSessions || []).find(s => s.id === sessionId);
        if (!session) return;
        if (!confirm(`Xác nhận xóa Nhóm ${groupId}? Các thành viên trong nhóm sẽ trở về danh sách chưa có nhóm.`)) return;

        session.groups = session.groups.filter(g => g.id !== groupId);
        saveGroups();
        renderGroupSessions();
        showToast("Đã xóa nhóm!", "info");
    });
}

function adminToggleLockGroupSession(sessionId) {
    checkAdmin(() => {
        const session = (state.groupSessions || []).find(s => s.id === sessionId);
        if (!session) return;
        session.isLocked = !session.isLocked;
        saveGroups();
        renderGroupSessions();
        showToast(session.isLocked ? "Đã khóa chốt danh sách nhóm!" : "Đã mở khóa sửa nhóm!", "info");
    });
}

function adminDeleteGroupSession(sessionId) {
    checkAdmin(() => {
        if (!confirm("Xác nhận xóa toàn bộ đợt ghép nhóm này?")) return;
        state.groupSessions = (state.groupSessions || []).filter(s => s.id !== sessionId);
        state.currentGroupSessionId = state.groupSessions[0]?.id || null;
        saveGroups();
        renderGroupSessions();
        showToast("Đã xóa đợt ghép nhóm!", "info");
    });
}

function openEditGroupNoticeModal(sessionId) {
    checkAdmin(() => {
        const session = (state.groupSessions || []).find(s => s.id === sessionId);
        if (!session) return;

        const noticeInput = document.getElementById("editGroupNoticeContentInput");
        if (noticeInput) noticeInput.value = session.assignmentNotice || "";

        const deadlineInput = document.getElementById("editGroupNoticeDeadlineInput");
        if (deadlineInput) deadlineInput.value = session.assignmentDeadline || "";

        openModal("editGroupNoticeModal");
    });
}

function submitUpdateGroupNotice() {
    const session = getCurrentGroupSession();
    if (!session) return;

    const notice = document.getElementById("editGroupNoticeContentInput")?.value.trim() || "";
    const deadline = document.getElementById("editGroupNoticeDeadlineInput")?.value || "";

    session.assignmentNotice = notice;
    session.assignmentDeadline = deadline;

    saveGroups();
    closeModal("editGroupNoticeModal");
    renderGroupSessions();
    showToast("Đã cập nhật thông báo bài tập thành công!", "success");
}

function openExportGroupsModal(sessionId) {
    const session = (state.groupSessions || []).find(s => s.id === sessionId) || getCurrentGroupSession();
    if (!session) return;

    const titleEl = document.getElementById("exportGroupSessionTitle");
    if (titleEl) titleEl.textContent = session.title;

    openModal("exportGroupsModal");
}

function downloadGroupsCsv() {
    const session = getCurrentGroupSession();
    if (!session) return;

    const topicMap = {};
    (session.topics || []).forEach(t => { topicMap[t.id] = t.title; });

    let csvContent = "\uFEFF"; // UTF-8 BOM để Excel hiển thị tiếng Việt không bị lỗi font
    csvContent += "STT,Nhóm,Vai Trò,Họ Và Tên,Mã Sinh Viên,Đề Tài Bài Tập,Hạn Nộp,Thông Báo\n";

    let stt = 1;
    session.groups.forEach(group => {
        const topicTitle = topicMap[group.topicId] || "Chưa chọn đề tài";
        const deadline = session.assignmentDeadline ? formatDate(session.assignmentDeadline) : "--";
        const notice = (session.assignmentNotice || "").replace(/"/g, '""');

        if (!group.members || group.members.length === 0) {
            csvContent += `${stt},"${group.name}","--","Chưa có thành viên","--","${topicTitle}","${deadline}","${notice}"\n`;
            stt++;
        } else {
            group.members.forEach(sid => {
                const st = STUDENTS.find(s => String(s.studentId) === String(sid));
                const name = st ? st.name : `Sinh viên ${sid}`;
                const role = String(group.leaderId) === String(sid) ? "Trưởng nhóm" : "Thành viên";
                csvContent += `${stt},"${group.name}","${role}","${name}","${sid}","${topicTitle}","${deadline}","${notice}"\n`;
                stt++;
            });
        }
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safeTitle = removeVietnameseTones(session.title).replace(/\s+/g, "_");
    link.setAttribute("href", url);
    link.setAttribute("download", `Danh_Sach_Nhom_${safeTitle}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    closeModal("exportGroupsModal");
    showToast("Đã tải xuống file CSV danh sách nhóm!", "success");
}

function copyGroupsTsvForSheets() {
    const session = getCurrentGroupSession();
    if (!session) return;

    const topicMap = {};
    (session.topics || []).forEach(t => { topicMap[t.id] = t.title; });

    let tsv = "STT\tNhóm\tVai Trò\tHọ Và Tên\tMã Sinh Viên\tĐề Tài Bài Tập\tHạn Nộp\n";

    let stt = 1;
    session.groups.forEach(group => {
        const topicTitle = topicMap[group.topicId] || "Chưa chọn đề tài";
        const deadline = session.assignmentDeadline ? formatDate(session.assignmentDeadline) : "--";

        if (!group.members || group.members.length === 0) {
            tsv += `${stt}\t${group.name}\t--\tChưa có thành viên\t--\t${topicTitle}\t${deadline}\n`;
            stt++;
        } else {
            group.members.forEach(sid => {
                const st = STUDENTS.find(s => String(s.studentId) === String(sid));
                const name = st ? st.name : `Sinh viên ${sid}`;
                const role = String(group.leaderId) === String(sid) ? "Trưởng nhóm" : "Thành viên";
                tsv += `${stt}\t${group.name}\t${role}\t${name}\t${sid}\t${topicTitle}\t${deadline}\n`;
                stt++;
            });
        }
    });

    copyText(tsv, "Đã sao chép bảng dữ liệu! Dán (Ctrl+V) trực tiếp vào Google Sheets.");
    closeModal("exportGroupsModal");
}

// ==========================================
// LỚP HỌC ONLINE — HIỂN THỊ LỊCH HỌC HÔM NAY
// ==========================================
function renderOnlineClasses() {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0=CN, 1=T2, 2=T3, ... 6=T7
    // Convert JS getDay() to Vietnamese: getDay()=1 → Thứ 2 (day=2), getDay()=2 → Thứ 3 (day=3)...
    const dayMap = { 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 0: 8 }; // 8 = Chủ nhật
    const currentDay = dayMap[dayOfWeek]; // day value matching CLASS_SCHEDULE
    
    const dayNames = { 2: 'Thứ Hai', 3: 'Thứ Ba', 4: 'Thứ Tư', 5: 'Thứ Năm', 6: 'Thứ Sáu', 7: 'Thứ Bảy', 8: 'Chủ Nhật' };
    const dayName = dayNames[currentDay] || 'Không xác định';
    
    // Format date
    const dateStr = now.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    const dayTitle = document.getElementById('onlineDayTitle');
    const daySub = document.getElementById('onlineDaySubtitle');
    if (dayTitle) dayTitle.textContent = `📅 ${dayName}`;
    if (daySub) daySub.textContent = dateStr;
    
    // Filter classes for today
    const todayClasses = (typeof CLASS_SCHEDULE !== 'undefined' ? CLASS_SCHEDULE : []).filter(c => c.day === currentDay);
    
    const listEl = document.getElementById('onlineClassList');
    const noClassEl = document.getElementById('onlineNoClass');
    
    if (todayClasses.length === 0) {
        if (listEl) listEl.innerHTML = '';
        if (noClassEl) noClassEl.classList.remove('hidden');
        return;
    }
    
    if (noClassEl) noClassEl.classList.add('hidden');
    
    // Sort by period
    todayClasses.sort((a, b) => {
        const aPeriod = parseInt(a.period.split('-')[0]);
        const bPeriod = parseInt(b.period.split('-')[0]);
        return aPeriod - bPeriod;
    });
    
    // Subject icon map
    const iconMap = {
        'Marketing': 'fa-bullhorn',
        'Content': 'fa-pen-nib',
        'Media': 'fa-photo-film',
        'Tư tưởng': 'fa-landmark',
        'ERP': 'fa-server',
        'Phân tích': 'fa-chart-line',
        'Kỹ thuật': 'fa-file-word',
    };
    
    const colorMap = [
        'from-sky-500 to-blue-600',
        'from-violet-500 to-purple-600',
        'from-emerald-500 to-teal-600',
        'from-amber-500 to-orange-600',
        'from-rose-500 to-pink-600',
        'from-cyan-500 to-indigo-600',
    ];
    
    if (listEl) {
        listEl.innerHTML = todayClasses.map((cls, idx) => {
            // Find matching icon
            let icon = 'fa-book';
            for (const [key, val] of Object.entries(iconMap)) {
                if (cls.subject.includes(key)) { icon = val; break; }
            }
            const gradient = colorMap[idx % colorMap.length];
            
            return `
            <div class="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div class="flex items-start gap-4">
                    <div class="w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xl shadow-lg flex-shrink-0">
                        <i class="fa-solid ${icon}"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="px-2 py-0.5 rounded-lg bg-blue-100 text-blue-700 text-[10px] font-black">Tiết ${cls.period}</span>
                        </div>
                        <h3 class="text-base font-black text-gray-900 leading-tight mb-0.5">${cls.subject}</h3>
                        <p class="text-xs text-gray-500 font-semibold"><i class="fa-solid fa-chalkboard-user mr-1"></i>${cls.teacher}</p>
                    </div>
                </div>
                <a href="${cls.link}" target="_blank" rel="noopener noreferrer" 
                   class="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold text-sm shadow-lg shadow-green-200/50 transition-all active:scale-[0.97] no-underline">
                    <i class="fa-solid fa-video"></i>
                    Tham gia Google Meet
                </a>
            </div>
            `;
        }).join('');
    }
}
