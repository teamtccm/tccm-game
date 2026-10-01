/**
 * ĐỒ ĂN QUANH TRƯỜNG — THPT CAO BÁ QUÁT GIA LÂM
 * Quản Lý Lớp 11A11 - Quét Map Quán Ngon, Top Đánh Giá & Gọi Món Nhanh
 */

const DEFAULT_FOOD_SHOPS = [
    {
        id: "quan_co_ba",
        name: "Trà Sữa & Ăn Vặt Cô Ba",
        category: "snack_tea",
        categoryLabel: "Trà Sữa & Ăn Vặt",
        distanceMeters: 30,
        distanceText: "30m · Cổng phụ trường",
        walkTime: "1 phút đi bộ",
        coords: { x: 58, y: 32 },
        address: "Ngõ Cổng Phụ THPT Cao Bá Quát, Cổ Bi, Gia Lâm, Hà Nội",
        phone: "0982345678",
        rating: 4.9,
        reviewCount: 328,
        badge: "Quán Ruột 11A11 ⭐",
        badgeBg: "bg-amber-500",
        avatar: "🧋",
        bannerGradient: "from-amber-400 via-orange-500 to-rose-500",
        priceRange: "15.000đ - 30.000đ",
        openHours: "06:30 - 18:30",
        highlightReview: "Trà sữa nướng trân châu hoàng kim béo ngậy, cô Ba hay cho thêm thạch phô mai miễn phí!",
        menu: [
            { id: "cb_ts_nuong", name: "Trà Sữa Nướng Trân Châu Hoàng Kim", price: 25000, emoji: "🧋", desc: "Đậm vị trà nướng, trân châu hoàng kim dẻo quánh dai ngon", isHot: true },
            { id: "cb_tra_mang_cau", name: "Trà Mãng Cầu Tươi Đậm Vị", price: 22000, emoji: "🍹", desc: "Mãng cầu tươi dầm ngọt thanh chua nhẹ giải nhiệt", isHot: true },
            { id: "cb_tra_dao", name: "Trà Đào Cam Sả Tươi", price: 20000, emoji: "🍑", desc: "Miếng đào giòn sần sật, sả thơm ngào ngạt", isHot: false },
            { id: "cb_banh_trang_cuon", name: "Bánh Tráng Cuộn Bơ Trứng Muối", price: 18000, emoji: "🌯", desc: "Bơ thơm béo, tép khô, sốt me cay đậm đà", isHot: true },
            { id: "cb_khoai_lac", name: "Khoai Tây Lắc Phô Mai Béo", price: 15000, emoji: "🍟", desc: "Khoai chiên giòn tan ngập phô mai lắc bùi bùi", isHot: false },
            { id: "cb_nem_chua_ran", name: "Nem Chua Rán Giòn Rụm (5 cái)", price: 25000, emoji: "🍢", desc: "Nem chua rán chuẩn vị phố cổ, chấm tương ớt cay nồng", isHot: true }
        ],
        reviews: [
            { author: "Nguyễn Hà Anh", class: "11A11", rating: 5, date: "Hôm nay", comment: "Trà sữa nướng đỉnh thật sự, trân châu dẻo mềm không bị cứng. Cô Ba còn cho thêm thạch miễn phí nữa!" },
            { author: "Đỗ Nguyễn Thanh Tùng", class: "11A11", rating: 5, date: "Hôm qua", comment: "Nem chua rán giòn thơm, ăn lúc ra chơi ca 2 bao phê luôn ae ơi." },
            { author: "Lê Ngọc Lục Bảo", class: "11A11", rating: 5, date: "3 ngày trước", comment: "Bánh tráng bơ trứng muối sốt me siêu bánh cuốn, 10/10 điểm!" }
        ]
    },
    {
        id: "quan_the_cbq_hub",
        name: "The CBQ Hub — Bingsu & Trà Trái Cây GenZ",
        category: "snack_tea",
        categoryLabel: "Trà Sữa & Đồ Uống",
        distanceMeters: 80,
        distanceText: "80m · Cạnh nhà thể chất",
        walkTime: "2 phút đi bộ",
        coords: { x: 22, y: 38 },
        address: "Ngõ 2 Cổ Bi (Cạnh nhà thể chất trường THPT Cao Bá Quát)",
        phone: "0963123456",
        rating: 5.0,
        reviewCount: 520,
        badge: "Top 1 Check-In 📸",
        badgeBg: "bg-fuchsia-600",
        avatar: "🍧",
        bannerGradient: "from-pink-500 via-rose-500 to-purple-600",
        priceRange: "20.000đ - 40.000đ",
        openHours: "07:00 - 21:30",
        highlightReview: "Decor điều hòa mát rượi, bingsu núi xoài ngập tràn sữa đặc và kem tươi!",
        menu: [
            { id: "hub_bingsu_xoai", name: "Bingsu Xoài Tuyết Sữa Núi Cao", price: 35000, emoji: "🍧", desc: "Đá bào tuyết mịn màng, ngập xoài cát chín ngọt và kem vani", isHot: true },
            { id: "hub_milo_dam", name: "Milo Dầm Trân Châu Lava Khổng Lồ", price: 25000, emoji: "🍫", desc: "Milo đậm đặc, sốt socola chảy ngập trân châu pudding", isHot: true },
            { id: "hub_tra_nhai_cheese", name: "Trà Ô Long Nhài Sữa Kem Cheese", price: 28000, emoji: "🍵", desc: "Lớp macchiato phô mai béo mặn sánh mịn phủ trên nền trà", isHot: true },
            { id: "hub_ga_lac_cay", name: "Gà Rán Lắc Phô Mai Cay Hàn Quốc", price: 25000, emoji: "🍗", desc: "Miếng gà không xương giòn rụm áo bột phô mai cay the", isHot: true },
            { id: "hub_tra_dau_tay", name: "Trà Dâu Tây Tươi Tầm Xuân", price: 22000, emoji: "🍓", desc: "Dâu tây Đà Lạt dầm chua ngọt thanh mát cực đã", isHot: false }
        ],
        reviews: [
            { author: "Nguyễn Thanh Vân", class: "11A11", rating: 5, date: "Hôm nay", comment: "Quán có điều hòa mát rượi, decor xinh xắn để sống ảo. Milo dầm đậm đặc siêu ngon!" },
            { author: "Hoàng Ngọc Vinh", class: "11A11", rating: 5, date: "Hôm qua", comment: "Quán ruột tụi mình mỗi khi tan học hay có tiết trống, bingsu số 1 Gia Lâm!" }
        ]
    },
    {
        id: "quan_chu_bay",
        name: "Cơm Tấm & Bún Thịt Nướng Chú Bảy",
        category: "rice_noodle",
        categoryLabel: "Cơm & Bún Phở",
        distanceMeters: 120,
        distanceText: "120m · Đường Cổ Bi",
        walkTime: "2-3 phút đi bộ",
        coords: { x: 78, y: 68 },
        address: "Số 28 Đường Cổ Bi, Gia Lâm, Hà Nội",
        phone: "0912456789",
        rating: 4.8,
        reviewCount: 280,
        badge: "Bổ Rẻ No Căng 🍚",
        badgeBg: "bg-emerald-600",
        avatar: "🍛",
        bannerGradient: "from-amber-600 via-orange-600 to-red-600",
        priceRange: "25.000đ - 35.000đ",
        openHours: "09:30 - 14:00 & 16:30 - 20:00",
        highlightReview: "Cơm sườn bì chả miếng sườn to đùng, nước mắm kẹo kẹo chuẩn vị Sài Gòn!",
        menu: [
            { id: "cb_com_suon_bi", name: "Cơm Sườn Bì Chả Đặc Biệt", price: 35000, emoji: "🍖", desc: "Miếng sườn nướng than hoa thơm lừng + bì + chả trứng hấp", isHot: true },
            { id: "cb_com_ga_xoi", name: "Cơm Gà Xối Mỡ Da Giòn Tan", price: 30000, emoji: "🍗", desc: "Đùi gà góc tư chiên vàng ruộm ăn kèm cơm đảo hạt ngọc", isHot: true },
            { id: "cb_bun_thit_nuong", name: "Bún Thịt Nướng Chả Giò Giòn", price: 30000, emoji: "🥗", desc: "Thịt nướng mè, chả giò rế tôm thịt, mỡ hành đậu phộng", isHot: true },
            { id: "cb_com_thit_kho", name: "Cơm Thịt Kho Trứng Cút Béo Bùi", price: 25000, emoji: "🍲", desc: "Thịt ba chỉ kho mềm rục đậm đà ăn kèm dưa chua", isHot: false },
            { id: "cb_canh_rong_bien", name: "Canh Rong Biển Thịt Bằm Thơm", price: 5000, emoji: "🥣", desc: "Nước dùng thanh ngọt nấu cùng đậu hũ non và thịt băm", isHot: false }
        ],
        reviews: [
            { author: "Đoàn Xuân Vinh", class: "11A11", rating: 5, date: "Hôm qua", comment: "Cơm nhiều ú ụ, sườn ướp đậm đà nước mắm kẹo kẹo chuẩn vị luôn." },
            { author: "Trần Bảo Minh", class: "11A11", rating: 5, date: "4 ngày trước", comment: "Buổi trưa đói meo vào ăn đĩa cơm sườn là chiều học 4 tiết khỏe re." }
        ]
    },
    {
        id: "quan_pate_cot_den",
        name: "Bánh Mì Chảo & Pate Cột Đèn",
        category: "bread_fastfood",
        categoryLabel: "Bánh Mì & Ăn Nhanh",
        distanceMeters: 50,
        distanceText: "50m · Đối diện cổng chính",
        walkTime: "1 phút đi bộ",
        coords: { x: 34, y: 72 },
        address: "Số 8 Cổ Bi (Đối diện cổng chính THPT Cao Bá Quát)",
        phone: "0977889900",
        rating: 4.9,
        reviewCount: 415,
        badge: "Top 1 Ăn Sáng 🥖",
        badgeBg: "bg-red-600",
        avatar: "🍳",
        bannerGradient: "from-red-500 via-amber-500 to-yellow-500",
        priceRange: "15.000đ - 30.000đ",
        openHours: "06:00 - 13:30 & 16:00 - 19:30",
        highlightReview: "Pate cột đèn tự làm béo ngậy tan trên đầu lưỡi, chảo nóng hổi thơm nức mũi!",
        menu: [
            { id: "bm_chao_full", name: "Bánh Mì Chảo Đầy Đủ Đặc Biệt", price: 30000, emoji: "🍳", desc: "Pate nóng hổi + xúc xích rán + trứng ốp lòng đào + bò xào", isHot: true },
            { id: "bm_pate_cot_den", name: "Bánh Mì Pate Cột Đèn Hải Phòng", price: 18000, emoji: "🥖", desc: "Bánh giòn rụm ngập pate béo ngậy, sốt ớt cay cay tê tái", isHot: true },
            { id: "bm_ga_xe_cay", name: "Bánh Mì Gà Xé Cay Xè Lá Chanh", price: 20000, emoji: "🥪", desc: "Gà xé sốt bơ trứng, rau răm dưa chuột giòn tan", isHot: false },
            { id: "bm_trung_xuc_xich", name: "Bánh Mì Trứng Ốp Xúc Xích Giòn", price: 15000, emoji: "🥖", desc: "Hai trứng ốp la lòng đào kèm xúc xích nướng sốt mayo", isHot: false },
            { id: "bm_sua_dau_nanh", name: "Sữa Đậu Nành / Sữa Ngô Nhà Nấu", price: 10000, emoji: "🥛", desc: "Nấu mới mỗi sáng, ít ngọt béo bùi tốt cho sức khỏe", isHot: false }
        ],
        reviews: [
            { author: "Phùng Trung Hiếu", class: "11A11", rating: 5, date: "Hôm nay", comment: "Pate tự làm thơm nức mũi, sốt bánh mì chảo chấm bánh giòn rụm hết nước chấm!" },
            { author: "Đỗ Lê Ngân Khánh", class: "11A11", rating: 5, date: "2 ngày trước", comment: "Sáng nào cũng làm cái bánh mì pate 18k mang vào lớp, vừa kịp giờ truy bài." }
        ]
    },
    {
        id: "quan_banh_trang_co_hoa",
        name: "Ăn Vặt Cổng Trường — Bánh Tráng Cô Hoa",
        category: "snack_tea",
        categoryLabel: "Ăn Vặt Cổng Trường",
        distanceMeters: 15,
        distanceText: "15m · Ngay trước cổng trường",
        walkTime: "30 giây đi bộ",
        coords: { x: 48, y: 55 },
        address: "Cổng chính THPT Cao Bá Quát, Số 12 Cổ Bi, Gia Lâm",
        phone: "0934567123",
        rating: 4.9,
        reviewCount: 380,
        badge: "Học Sinh Khuyên Thử 🔥",
        badgeBg: "bg-rose-600",
        avatar: "🌶️",
        bannerGradient: "from-orange-500 via-rose-500 to-red-600",
        priceRange: "10.000đ - 20.000đ",
        openHours: "06:30 - 18:00",
        highlightReview: "Cô Hoa siêu xởi lởi, gọi bánh tráng trộn cô cho cả nắm hành phi với trứng cút!",
        menu: [
            { id: "ch_banh_trang_tron", name: "Bánh Tráng Trộn Bò Khô Trứng Cút", price: 15000, emoji: "🥣", desc: "Bánh tráng sợi dẻo, bò khô, mực xé, xoài chua, rau răm", isHot: true },
            { id: "ch_bap_xao_bo", name: "Bắp Xào Bơ Tép Hành Phi Béo Ngậy", price: 15000, emoji: "🌽", desc: "Bắp mỹ ngọt lịm xào bơ thơm lừng, rắc tép đỏ giòn tan", isHot: true },
            { id: "ch_xuc_xich_loc_xoay", name: "Xúc Xích Phô Mai Lốc Xoáy Khổng Lồ", price: 12000, emoji: "🌭", desc: "Xúc xích Đức xiên que chiên phồng xốt cay phô mai", isHot: false },
            { id: "ch_xoai_lac", name: "Xoài Lắc Muối Tôm Cay Xè", price: 15000, emoji: "🥭", desc: "Xoài keo giòn rụm ngấm muối tôm Tây Ninh chua ngọt cay", isHot: true },
            { id: "ch_tra_chanh_gia_tay", name: "Trà Chanh Giã Tay Quảng Đông Thơm", price: 12000, emoji: "🍋", desc: "Chanh thơm giã tay giữ nguyên tinh dầu giải ngấy cực đã", isHot: false }
        ],
        reviews: [
            { author: "Đinh Lệnh Tuấn Vũ", class: "11A11", rating: 5, date: "Hôm qua", comment: "Cô Hoa siêu xởi lởi, gọi bánh tráng trộn cô cho cả nắm hành phi với trứng cút ăn no xỉu." },
            { author: "Nguyễn Vũ Hồng Anh", class: "11A11", rating: 5, date: "3 ngày trước", comment: "Bắp xào bơ tép béo ngậy nghiện lắm mn ơi, ra chơi là phải xếp hàng nhanh!" }
        ]
    },
    {
        id: "quan_pho_o_oanh",
        name: "Phở Bò & Bún Bò Huế O Oanh",
        category: "rice_noodle",
        categoryLabel: "Cơm & Bún Phở",
        distanceMeters: 200,
        distanceText: "200m · Ngã 3 Cổ Bi",
        walkTime: "3-4 phút đi bộ",
        coords: { x: 82, y: 24 },
        address: "Số 45 Đường Cổ Bi, Gia Lâm, Hà Nội",
        phone: "0904567890",
        rating: 4.8,
        reviewCount: 195,
        badge: "Nước Dùng Đậm Đà 🍲",
        badgeBg: "bg-indigo-600",
        avatar: "🍜",
        bannerGradient: "from-blue-600 via-indigo-600 to-purple-700",
        priceRange: "30.000đ - 40.000đ",
        openHours: "06:00 - 13:00 & 17:00 - 21:00",
        highlightReview: "Nước dùng ninh từ xương bò ngọt lịm tự nhiên, chả cua Huế to đùng thơm phức!",
        menu: [
            { id: "oo_bun_bo_hue", name: "Bún Bò Huế Đầy Đủ Chả Cua Thịt Bắp", price: 35000, emoji: "🍜", desc: "Bún sợi to, bắp bò hoa, chả cua Huế đậm vị ruốc sả", isHot: true },
            { id: "oo_pho_bo_tai", name: "Phở Bò Tái Nạm Nước Dùng Trong", price: 35000, emoji: "🍲", desc: "Thịt bò tươi mềm ngọt, nước dùng thơm hương quế hồi", isHot: true },
            { id: "oo_bun_moc_suon", name: "Bún Mọc Sườn Chua Dọc Mùng", price: 30000, emoji: "🥣", desc: "Viên mọc nấm hương giòn sần sật kèm sườn non sụn chua", isHot: false },
            { id: "oo_quay_gion", name: "Đĩa Quẩy Giòn Rụm (3 cái)", price: 5000, emoji: "🥖", desc: "Quẩy mới chiên giòn tan ăn kèm phở nóng hổi", isHot: false }
        ],
        reviews: [
            { author: "Đoàn Trung Hải", class: "11A11", rating: 5, date: "Hôm nay", comment: "Bún bò huế ở đây ngon nhất khu Cổ Bi rồi, nước dùng thơm nức sả ruốc." },
            { author: "Nguyễn Gia Huy", class: "11A11", rating: 4, date: "5 ngày trước", comment: "Bát phở bò đầy đặn nhiều thịt, ăn sáng vừa ấm bụng vừa tỉnh ngủ." }
        ]
    }
];

// STATE MANAGEMENT
const foodState = {
    shops: [],
    cart: {
        shopId: null,
        items: {} // { itemId: { item, qty, note } }
    },
    activeCategory: "all",
    searchKeyword: "",
    sortBy: "rating", // "rating", "distance", "price"
    showMap: true,
    activeShopId: null,
    ordersHistory: []
};

// Khởi tạo Module Đồ Ăn
function initFoodModule() {
    try {
        const savedShops = localStorage.getItem("QL_FOOD_SHOPS");
        if (savedShops) {
            foodState.shops = JSON.parse(savedShops);
        } else {
            foodState.shops = JSON.parse(JSON.stringify(DEFAULT_FOOD_SHOPS));
            localStorage.setItem("QL_FOOD_SHOPS", JSON.stringify(foodState.shops));
        }

        const savedOrders = localStorage.getItem("QL_FOOD_ORDERS");
        if (savedOrders) {
            foodState.ordersHistory = JSON.parse(savedOrders);
        }

        const savedCart = localStorage.getItem("QL_FOOD_CART");
        if (savedCart) {
            foodState.cart = JSON.parse(savedCart);
        }
    } catch(e) {
        console.error("Lỗi khởi tạo Food Module:", e);
        foodState.shops = JSON.parse(JSON.stringify(DEFAULT_FOOD_SHOPS));
    }
}

// Lưu dữ liệu vào localStorage
function saveFoodShops() {
    localStorage.setItem("QL_FOOD_SHOPS", JSON.stringify(foodState.shops));
}
function saveFoodOrders() {
    localStorage.setItem("QL_FOOD_ORDERS", JSON.stringify(foodState.ordersHistory));
}
function saveFoodCart() {
    localStorage.setItem("QL_FOOD_CART", JSON.stringify(foodState.cart));
}

// Giao diện chính: Render Food Nearby
function renderFoodNearby() {
    initFoodModule();
    renderFoodRadarMap();
    renderFoodShopList();
    updateFoodCartFloatingBar();
}

// ═══════════════════════════════════════════════════════════════
// 1. RADAR MAP TƯƠNG TÁC QUANH TRƯỜNG THPT CAO BÁ QUÁT
// ═══════════════════════════════════════════════════════════════
function renderFoodRadarMap() {
    const mapContainer = document.getElementById("foodRadarMapContainer");
    if (!mapContainer) return;

    const filteredShops = getFilteredFoodShops();

    let pinsHtml = "";
    filteredShops.forEach(shop => {
        const isSelected = foodState.activeShopId === shop.id;
        pinsHtml += `
            <div onclick="selectFoodPin('${shop.id}')" 
                 class="food-map-pin absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-125 z-20 group"
                 style="left: ${shop.coords.x}%; top: ${shop.coords.y}%;">
                <div class="relative flex flex-col items-center">
                    <!-- Pin Tooltip -->
                    <div class="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-1 pointer-events-none whitespace-nowrap bg-gray-900/90 backdrop-blur-md text-white px-2.5 py-1 rounded-xl text-[10px] font-bold shadow-lg border border-white/20 z-30 flex items-center gap-1.5">
                        <span>${shop.avatar}</span>
                        <span>${shop.name}</span>
                        <span class="text-amber-400">★ ${shop.rating}</span>
                        <span class="text-gray-400">(${shop.distanceText})</span>
                    </div>

                    <!-- Pin Bubble -->
                    <div class="w-9 h-9 rounded-2xl flex items-center justify-center text-sm shadow-xl transition-all border-2 ${
                        isSelected 
                            ? 'bg-amber-400 border-white scale-125 ring-4 ring-amber-400/40 animate-bounce' 
                            : 'bg-white/95 border-amber-400 hover:border-white hover:bg-amber-400'
                    }">
                        <span class="text-base">${shop.avatar}</span>
                    </div>
                    
                    <!-- Distance Tag -->
                    <div class="bg-gray-900/90 text-[9px] font-black text-amber-300 px-1.5 py-0.5 rounded-full mt-0.5 shadow-xs border border-white/10">
                        ${shop.distanceMeters}m
                    </div>
                </div>
            </div>
        `;
    });

    mapContainer.innerHTML = `
        <div class="relative w-full h-56 sm:h-64 rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-indigo-500/30 shadow-2xl p-4 flex flex-col justify-between">
            <!-- Grid Lines & Concentric Radar Rings -->
            <div class="absolute inset-0 pointer-events-none flex items-center justify-center">
                <!-- Outer Ring 200m -->
                <div class="w-64 h-64 sm:w-72 sm:h-72 rounded-full border border-indigo-500/20 absolute"></div>
                <!-- Middle Ring 100m -->
                <div class="w-44 h-44 sm:w-52 sm:h-52 rounded-full border border-indigo-400/25 absolute"></div>
                <!-- Inner Ring 50m -->
                <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-amber-400/30 absolute"></div>
                <!-- Radar Sweep Light -->
                <div class="w-72 h-72 rounded-full border-t-2 border-indigo-400/40 absolute animate-spin" style="animation-duration: 8s;"></div>
            </div>

            <!-- Header Map Info -->
            <div class="relative z-10 flex justify-between items-start">
                <div class="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span class="text-xs font-bold text-white tracking-wide">Radar Vệ Tinh 11A11</span>
                    <span class="text-[10px] text-amber-400 font-extrabold bg-amber-500/20 px-2 py-0.5 rounded-full">Bán kính 200m</span>
                </div>
                <button onclick="openGoogleMapsArea()" class="bg-white/15 hover:bg-white/25 active:scale-95 transition-all text-white text-[11px] font-bold px-3 py-1.5 rounded-2xl backdrop-blur-md border border-white/15 flex items-center gap-1.5 cursor-pointer" title="Xem trên Google Maps">
                    <i class="fa-solid fa-map-location-dot text-amber-400"></i>
                    <span>Mở Google Maps</span>
                </button>
            </div>

            <!-- CENTER SCHOOL BEACON -->
            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center pointer-events-none">
                <div class="relative flex items-center justify-center">
                    <div class="w-12 h-12 rounded-full bg-indigo-500/30 animate-ping absolute"></div>
                    <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 border-2 border-white flex items-center justify-center text-white shadow-xl shadow-indigo-500/50">
                        <i class="fa-solid fa-school text-sm"></i>
                    </div>
                </div>
                <div class="bg-indigo-950/90 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full border border-indigo-400/40 mt-1 shadow-md whitespace-nowrap">
                    🏫 THPT Cao Bá Quát
                </div>
            </div>

            <!-- RESTAURANT PINS -->
            ${pinsHtml}

            <!-- Bottom Street Label -->
            <div class="relative z-10 flex justify-between items-center text-[10px] text-slate-400 font-semibold px-2">
                <span>📍 Trục Đường Cổ Bi · Gia Lâm</span>
                <span class="text-amber-400/90 font-bold">Chạm vào icon để xem quán 👆</span>
            </div>
        </div>
    `;
}

// Khi click vào 1 pin trên map
function selectFoodPin(shopId) {
    foodState.activeShopId = shopId;
    renderFoodRadarMap();
    openShopMenuModal(shopId);
}

// Mở bản đồ Google Maps khu vực trường
function openGoogleMapsArea() {
    window.open("https://www.google.com/maps/search/qu%C3%A1n+%C4%83n+g%E1%BA%A7n+THPT+Cao+B%C3%A1+Qu%C3%A1t+Gia+L%C3%A2m/@21.01185,105.9525,17z", "_blank");
}

// ═══════════════════════════════════════════════════════════════
// 2. BỘ LỌC, TÌM KIẾM & SẮP XẾP QUÁN ĂN
// ═══════════════════════════════════════════════════════════════
function getFilteredFoodShops() {
    let result = [...foodState.shops];

    // Filter theo category
    if (foodState.activeCategory === "top") {
        result = result.filter(s => s.rating >= 4.9);
    } else if (foodState.activeCategory !== "all") {
        result = result.filter(s => s.category === foodState.activeCategory);
    }

    // Filter theo từ khóa
    if (foodState.searchKeyword.trim()) {
        const kw = foodState.searchKeyword.trim().toLowerCase();
        result = result.filter(s => {
            const matchName = s.name.toLowerCase().includes(kw);
            const matchAddress = s.address.toLowerCase().includes(kw);
            const matchMenu = s.menu.some(m => m.name.toLowerCase().includes(kw) || m.desc.toLowerCase().includes(kw));
            return matchName || matchAddress || matchMenu;
        });
    }

    // Sắp xếp
    if (foodState.sortBy === "rating") {
        result.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    } else if (foodState.sortBy === "distance") {
        result.sort((a, b) => a.distanceMeters - b.distanceMeters);
    } else if (foodState.sortBy === "price") {
        result.sort((a, b) => (a.menu[0]?.price || 0) - (b.menu[0]?.price || 0));
    }

    return result;
}

function setFoodCategory(cat) {
    foodState.activeCategory = cat;
    document.querySelectorAll(".food-cat-btn").forEach(btn => {
        const c = btn.getAttribute("data-cat");
        if (c === cat) {
            btn.classList.add("bg-gradient-to-r", "from-amber-500", "to-orange-600", "text-white", "shadow-md", "shadow-orange-300/40");
            btn.classList.remove("bg-white", "text-gray-700", "border", "border-gray-200");
        } else {
            btn.classList.remove("bg-gradient-to-r", "from-amber-500", "to-orange-600", "text-white", "shadow-md", "shadow-orange-300/40");
            btn.classList.add("bg-white", "text-gray-700", "border", "border-gray-200");
        }
    });
    renderFoodRadarMap();
    renderFoodShopList();
}

function handleFoodSearch(keyword) {
    foodState.searchKeyword = keyword;
    renderFoodRadarMap();
    renderFoodShopList();
}

function handleFoodSort(criteria) {
    foodState.sortBy = criteria;
    renderFoodShopList();
}

// ═══════════════════════════════════════════════════════════════
// 3. RENDER DANH SÁCH QUÁN ĂN (CARDS)
// ═══════════════════════════════════════════════════════════════
function renderFoodShopList() {
    const container = document.getElementById("foodShopListContainer");
    if (!container) return;

    const shops = getFilteredFoodShops();

    if (shops.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <div class="text-5xl mb-3">🔍</div>
                <h4 class="text-lg font-black text-gray-800">Không tìm thấy quán nào!</h4>
                <p class="text-xs text-gray-500 mt-1">Thử đổi từ khóa hoặc chọn mục khác xem sao nhé.</p>
                <button onclick="setFoodCategory('all')" class="mt-4 px-4 py-2 bg-amber-500 text-white font-bold text-xs rounded-xl shadow-md">
                    Xem tất cả quán quanh trường
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = shops.map(shop => {
        // Lấy 3 món hot đầu tiên
        const hotMenuHtml = shop.menu.slice(0, 3).map(m => `
            <div class="flex items-center justify-between text-xs py-1.5 border-b border-gray-50 last:border-0">
                <div class="flex items-center gap-1.5 truncate pr-2">
                    <span>${m.emoji}</span>
                    <span class="font-bold text-gray-800 truncate">${m.name}</span>
                    ${m.isHot ? '<span class="text-[9px] bg-rose-100 text-rose-600 font-extrabold px-1 rounded">HOT</span>' : ''}
                </div>
                <span class="font-black text-amber-600 whitespace-nowrap">${m.price.toLocaleString('vi-VN')}đ</span>
            </div>
        `).join("");

        return `
            <div class="bg-white rounded-3xl p-5 border border-gray-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-amber-200 transition-all flex flex-col justify-between">
                <!-- Shop Header -->
                <div>
                    <div class="flex items-start justify-between gap-3">
                        <div class="flex items-center gap-3">
                            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br ${shop.bannerGradient} flex items-center justify-center text-3xl shadow-lg shadow-orange-200">
                                ${shop.avatar}
                            </div>
                            <div>
                                <div class="flex items-center gap-1.5 flex-wrap">
                                    <span class="text-[10px] font-black text-white px-2 py-0.5 rounded-full ${shop.badgeBg}">
                                        ${shop.badge}
                                    </span>
                                    <span class="text-[11px] font-bold text-gray-400">· ${shop.categoryLabel}</span>
                                </div>
                                <h3 class="text-base font-black text-gray-900 leading-tight mt-1 hover:text-amber-600 cursor-pointer" onclick="openShopMenuModal('${shop.id}')">
                                    ${shop.name}
                                </h3>
                                <p class="text-xs text-gray-500 font-medium flex items-center gap-1.5 mt-0.5">
                                    <i class="fa-solid fa-location-dot text-amber-500 text-[11px]"></i>
                                    <span class="font-bold text-gray-700">${shop.distanceText}</span>
                                    <span>(${shop.walkTime})</span>
                                </p>
                            </div>
                        </div>

                        <!-- Rating Badge -->
                        <div class="bg-amber-50 border border-amber-200/60 rounded-2xl px-3 py-1.5 text-center shrink-0">
                            <div class="text-sm font-black text-amber-600 flex items-center justify-center gap-1">
                                <i class="fa-solid fa-star text-xs text-amber-500"></i>
                                <span>${shop.rating}</span>
                            </div>
                            <div class="text-[9px] text-gray-400 font-bold">${shop.reviewCount} đánh giá</div>
                        </div>
                    </div>

                    <!-- Highlight Student Review -->
                    <div class="bg-amber-50/60 rounded-2xl p-3 border border-amber-100/80 my-3.5 flex items-start gap-2">
                        <span class="text-base">💬</span>
                        <div class="text-xs text-gray-700 italic leading-relaxed">
                            "${shop.highlightReview}"
                        </div>
                    </div>

                    <!-- Preview Menu -->
                    <div class="bg-gray-50/80 rounded-2xl p-3 border border-gray-100 mb-4">
                        <div class="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1 flex justify-between">
                            <span>Món nổi bật được 11A11 gọi nhiều</span>
                            <span class="text-amber-600 cursor-pointer hover:underline" onclick="openShopMenuModal('${shop.id}')">Xem tất cả (${shop.menu.length}) ▶</span>
                        </div>
                        ${hotMenuHtml}
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-2 pt-2 border-t border-gray-100">
                    <button onclick="openShopMenuModal('${shop.id}')" 
                            class="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 active:scale-95 text-white font-black text-xs rounded-2xl shadow-lg shadow-orange-300/40 flex items-center justify-center gap-2 cursor-pointer transition-all">
                        <i class="fa-solid fa-utensils"></i>
                        <span>Xem Menu & Gọi Món</span>
                    </button>
                    
                    <button onclick="callShopPhone('${shop.phone}', '${shop.name}')" 
                            class="w-11 h-11 bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-emerald-600 rounded-2xl border border-emerald-200 flex items-center justify-center transition-all cursor-pointer" title="Gọi điện cho quán">
                        <i class="fa-solid fa-phone text-sm"></i>
                    </button>
                    
                    <button onclick="openDirections('${encodeURIComponent(shop.address)}')" 
                            class="w-11 h-11 bg-gray-50 hover:bg-gray-100 active:scale-95 text-gray-700 rounded-2xl border border-gray-200 flex items-center justify-center transition-all cursor-pointer" title="Chỉ đường trên Google Maps">
                        <i class="fa-solid fa-diamond-turn-right text-sm text-indigo-600"></i>
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

// ═══════════════════════════════════════════════════════════════
// 4. MODAL XEM MENU CHI TIẾT & CHỌN MÓN
// ═══════════════════════════════════════════════════════════════
function openShopMenuModal(shopId) {
    const shop = foodState.shops.find(s => s.id === shopId);
    if (!shop) return;

    foodState.activeShopId = shopId;

    const modalTitle = document.getElementById("shopMenuModalTitle");
    const modalSubtitle = document.getElementById("shopMenuModalSubtitle");
    const modalAvatar = document.getElementById("shopMenuModalAvatar");
    const modalBadge = document.getElementById("shopMenuModalBadge");
    const modalList = document.getElementById("shopMenuItemsList");
    const modalReviews = document.getElementById("shopMenuReviewsList");
    const modalAddress = document.getElementById("shopMenuModalAddress");
    const modalPhone = document.getElementById("shopMenuModalPhone");

    if (modalTitle) modalTitle.innerText = shop.name;
    if (modalSubtitle) modalSubtitle.innerText = `${shop.distanceText} · ${shop.openHours}`;
    if (modalAvatar) modalAvatar.innerText = shop.avatar;
    if (modalAddress) modalAddress.innerText = shop.address;
    if (modalPhone) modalPhone.innerText = shop.phone;
    if (modalBadge) {
        modalBadge.innerText = `★ ${shop.rating} (${shop.reviewCount} đánh giá) · ${shop.badge}`;
    }

    // Render Menu Items
    if (modalList) {
        modalList.innerHTML = shop.menu.map(item => {
            const currentQty = (foodState.cart.shopId === shop.id && foodState.cart.items[item.id]) 
                ? foodState.cart.items[item.id].qty 
                : 0;

            return `
                <div class="bg-gray-50 hover:bg-amber-50/40 border border-gray-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 transition-all">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shadow-xs border border-gray-100">
                            ${item.emoji}
                        </div>
                        <div>
                            <div class="flex items-center gap-1.5">
                                <h4 class="text-sm font-bold text-gray-900">${item.name}</h4>
                                ${item.isHot ? '<span class="text-[9px] bg-rose-500 text-white font-black px-1.5 py-0.2 rounded-md">HOT</span>' : ''}
                            </div>
                            <p class="text-[11px] text-gray-500 leading-tight mt-0.5 line-clamp-1">${item.desc}</p>
                            <div class="text-xs font-black text-amber-600 mt-1">${item.price.toLocaleString('vi-VN')}đ</div>
                        </div>
                    </div>

                    <!-- Add to Cart or Stepper -->
                    <div>
                        ${currentQty > 0 ? `
                            <div class="flex items-center gap-2 bg-white rounded-xl border border-amber-300 p-1 shadow-xs">
                                <button onclick="changeCartItemQty('${shop.id}', '${item.id}', -1)" class="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold flex items-center justify-center text-xs active:scale-95 transition">
                                    -
                                </button>
                                <span class="text-xs font-black text-gray-900 px-1 min-w-[16px] text-center">${currentQty}</span>
                                <button onclick="changeCartItemQty('${shop.id}', '${item.id}', 1)" class="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold flex items-center justify-center text-xs active:scale-95 transition">
                                    +
                                </button>
                            </div>
                        ` : `
                            <button onclick="addFoodToCart('${shop.id}', '${item.id}')" 
                                    class="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-black text-xs rounded-xl shadow-md shadow-amber-300/50 flex items-center gap-1.5 transition cursor-pointer">
                                <i class="fa-solid fa-plus"></i>
                                <span>Chọn</span>
                            </button>
                        `}
                    </div>
                </div>
            `;
        }).join("");
    }

    // Render Student Reviews
    if (modalReviews) {
        modalReviews.innerHTML = shop.reviews.map(r => `
            <div class="bg-gray-50 rounded-2xl p-3 border border-gray-100 text-xs">
                <div class="flex items-center justify-between mb-1">
                    <div class="flex items-center gap-1.5 font-bold text-gray-800">
                        <span class="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-black">
                            ${r.author.charAt(0)}
                        </span>
                        <span>${r.author}</span>
                        <span class="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.2 rounded font-extrabold">${r.class}</span>
                    </div>
                    <div class="text-amber-500 text-[10px] font-black">
                        ${'★'.repeat(r.rating)}
                    </div>
                </div>
                <p class="text-gray-600 text-xs leading-relaxed">"${r.comment}"</p>
                <div class="text-[10px] text-gray-400 mt-1">${r.date}</div>
            </div>
        `).join("");
    }

    openModal("shopMenuModal");
}

// ═══════════════════════════════════════════════════════════════
// 5. GIỎ HÀNG & GỌI MÓN (CART & ORDERING)
// ═══════════════════════════════════════════════════════════════
function addFoodToCart(shopId, itemId) {
    const shop = foodState.shops.find(s => s.id === shopId);
    if (!shop) return;
    const item = shop.menu.find(m => m.id === itemId);
    if (!item) return;

    // Nếu giỏ đang có món của quán khác -> Hỏi xác nhận đổi quán
    if (foodState.cart.shopId && foodState.cart.shopId !== shopId) {
        const currentShop = foodState.shops.find(s => s.id === foodState.cart.shopId);
        const confirmChange = confirm(`Giỏ hàng của bạn đang có món của "${currentShop?.name || 'quán khác'}". Bạn có muốn làm mới giỏ hàng để chọn quán "${shop.name}" không?`);
        if (!confirmChange) return;
        foodState.cart = { shopId: shopId, items: {} };
    }

    foodState.cart.shopId = shopId;
    if (!foodState.cart.items[itemId]) {
        foodState.cart.items[itemId] = {
            item: item,
            qty: 1,
            note: ""
        };
    } else {
        foodState.cart.items[itemId].qty++;
    }

    saveFoodCart();
    updateFoodCartFloatingBar();
    openShopMenuModal(shopId); // refresh modal

    // Hiển thị toast nhẹ
    if (typeof showToast === "function") {
        showToast(`Đã thêm "${item.name}" vào giỏ hàng! 🛒`, "success");
    }
}

function changeCartItemQty(shopId, itemId, delta) {
    if (!foodState.cart.items[itemId]) return;
    foodState.cart.items[itemId].qty += delta;

    if (foodState.cart.items[itemId].qty <= 0) {
        delete foodState.cart.items[itemId];
    }

    // Nếu không còn món nào -> reset shopId
    if (Object.keys(foodState.cart.items).length === 0) {
        foodState.cart.shopId = null;
    }

    saveFoodCart();
    updateFoodCartFloatingBar();
    if (foodState.activeShopId === shopId) {
        openShopMenuModal(shopId);
    }
    renderCartModalItems();
}

function updateFoodCartFloatingBar() {
    const bar = document.getElementById("foodCartFloatingBar");
    if (!bar) return;

    const itemCount = Object.values(foodState.cart.items).reduce((sum, i) => sum + i.qty, 0);
    const totalPrice = Object.values(foodState.cart.items).reduce((sum, i) => sum + (i.item.price * i.qty), 0);

    if (itemCount > 0) {
        const shop = foodState.shops.find(s => s.id === foodState.cart.shopId);
        bar.classList.remove("hidden");
        bar.innerHTML = `
            <div class="w-full max-w-xl mx-auto px-4">
                <div onclick="openFoodCartModal()" 
                     class="bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 text-white rounded-3xl p-4 shadow-2xl shadow-orange-500/50 flex items-center justify-between cursor-pointer border border-white/30 backdrop-blur-md animate-[bounce_1s_ease_1]">
                    <div class="flex items-center gap-3">
                        <div class="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl font-black">
                            🛒
                        </div>
                        <div>
                            <div class="text-xs text-amber-100 font-bold">Giỏ hàng · ${shop?.name || 'Đang chọn'}</div>
                            <div class="text-base font-black tracking-tight">${itemCount} món · ${totalPrice.toLocaleString('vi-VN')}đ</div>
                        </div>
                    </div>
                    <div class="flex items-center gap-1.5 bg-white text-gray-900 font-black text-xs px-4 py-2.5 rounded-2xl shadow-md">
                        <span>Gọi món</span>
                        <i class="fa-solid fa-arrow-right text-[11px]"></i>
                    </div>
                </div>
            </div>
        `;
    } else {
        bar.classList.add("hidden");
    }
}

// Mở Modal Giỏ Hàng & Đặt Món
function openFoodCartModal() {
    const shop = foodState.shops.find(s => s.id === foodState.cart.shopId);
    if (!shop || Object.keys(foodState.cart.items).length === 0) {
        alert("Giỏ hàng đang trống! Hãy chọn món trước nhé.");
        return;
    }

    const shopNameEl = document.getElementById("foodCartShopName");
    if (shopNameEl) shopNameEl.innerText = shop.name;

    // Populate danh sách học sinh 11A11 vào dropdown nếu chưa có
    const studentSelect = document.getElementById("foodOrderStudentSelect");
    if (studentSelect && studentSelect.options.length <= 1 && typeof STUDENTS !== "undefined") {
        studentSelect.innerHTML = `<option value="">-- Chọn tên học sinh 11A11 --</option>` + 
            STUDENTS.map(st => `<option value="${st.name}">${st.name} (Lớp 11A11)</option>`).join("");
    }

    renderCartModalItems();
    openModal("foodCartModal");
}

function renderCartModalItems() {
    const container = document.getElementById("foodCartItemsList");
    const totalEl = document.getElementById("foodCartTotalPrice");
    if (!container) return;

    const items = Object.values(foodState.cart.items);
    if (items.length === 0) {
        closeModal("foodCartModal");
        updateFoodCartFloatingBar();
        return;
    }

    let total = 0;
    container.innerHTML = items.map(entry => {
        const itemTotal = entry.item.price * entry.qty;
        total += itemTotal;
        return `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-200/80">
                <div class="flex items-center gap-3">
                    <span class="text-2xl">${entry.item.emoji}</span>
                    <div>
                        <div class="text-xs font-bold text-gray-900">${entry.item.name}</div>
                        <div class="text-[11px] text-amber-600 font-extrabold">${entry.item.price.toLocaleString('vi-VN')}đ</div>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="changeCartItemQty('${foodState.cart.shopId}', '${entry.item.id}', -1)" class="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-700 font-bold flex items-center justify-center text-xs active:scale-95">
                        -
                    </button>
                    <span class="text-xs font-black text-gray-900 min-w-[14px] text-center">${entry.qty}</span>
                    <button onclick="changeCartItemQty('${foodState.cart.shopId}', '${entry.item.id}', 1)" class="w-7 h-7 rounded-lg bg-amber-500 text-white font-bold flex items-center justify-center text-xs active:scale-95">
                        +
                    </button>
                    <span class="text-xs font-black text-gray-900 ml-2 min-w-[60px] text-right">${itemTotal.toLocaleString('vi-VN')}đ</span>
                </div>
            </div>
        `;
    }).join("");

    if (totalEl) totalEl.innerText = `${total.toLocaleString('vi-VN')}đ`;
}

// ═══════════════════════════════════════════════════════════════
// 6. CÁC PHƯƠNG THỨC GỌI MÓN (CALL, ZALO/SMS, QR CHUYỂN KHOẢN)
// ═══════════════════════════════════════════════════════════════

function getOrderDetailsString() {
    const shop = foodState.shops.find(s => s.id === foodState.cart.shopId);
    const studentName = document.getElementById("foodOrderStudentSelect")?.value || document.getElementById("foodOrderNameInput")?.value || "Học sinh 11A11";
    const phone = document.getElementById("foodOrderPhoneInput")?.value || "09xxxx";
    const location = document.getElementById("foodOrderLocationSelect")?.value || "Lớp 11A11 (Tầng 2 Nhà A - THPT Cao Bá Quát)";
    const note = document.getElementById("foodOrderNoteInput")?.value || "";

    const items = Object.values(foodState.cart.items);
    const itemsListStr = items.map(i => `• ${i.item.name} x${i.qty} (${(i.item.price * i.qty).toLocaleString('vi-VN')}đ)`).join("\n");
    const total = items.reduce((sum, i) => sum + (i.item.price * i.qty), 0);

    const message = `[ĐẶT MÓN 11A11 - THPT CAO BÁ QUÁT]\nQuán: ${shop?.name}\nNgười đặt: ${studentName} - SĐT: ${phone}\nĐịa điểm nhận: ${location}\n${note ? 'Ghi chú: ' + note + '\n' : ''}\nDanh sách món:\n${itemsListStr}\n-------------------------\nTổng cộng: ${total.toLocaleString('vi-VN')}đ`;

    return { shop, studentName, phone, location, note, items, total, message };
}

// 1. Gọi điện thoại trực tiếp cho quán
function submitOrderCall() {
    const order = getOrderDetailsString();
    if (!order.shop) return;

    if (confirm(`Bạn có muốn gọi hotline ${order.shop.phone} của "${order.shop.name}" để đọc đơn không?`)) {
        window.location.href = `tel:${order.shop.phone}`;
        recordOrderSuccess(order, "Gọi điện thoại 📞");
    }
}

// 2. Gửi đơn hàng qua Zalo / SMS
function submitOrderZalo() {
    const order = getOrderDetailsString();
    if (!order.shop) return;

    // Copy nội dung tin nhắn vào clipboard
    if (navigator.clipboard) {
        navigator.clipboard.writeText(order.message);
    }

    const zaloUrl = `https://zalo.me/${order.shop.phone}`;
    alert(`Đã sao chép nội dung đơn hàng vào bộ nhớ tạm!\n\nĐang mở Zalo số: ${order.shop.phone}\nBạn chỉ cần bấm DÁN (Paste) để gửi cho quán nhé!`);
    window.open(zaloUrl, "_blank");

    recordOrderSuccess(order, "Nhắn tin Zalo/SMS 💬");
}

// 3. Quét mã QR chuyển khoản trước
function submitOrderQR() {
    const order = getOrderDetailsString();
    if (!order.shop) return;

    closeModal("foodCartModal");

    const qrContainer = document.getElementById("foodQrCodeDisplay");
    const qrAmount = document.getElementById("foodQrAmountDisplay");
    const qrDesc = document.getElementById("foodQrDescDisplay");

    if (qrAmount) qrAmount.innerText = `${order.total.toLocaleString('vi-VN')}đ`;
    if (qrDesc) qrDesc.innerText = `Chuyển khoản đơn ăn: ${order.studentName} - 11A11`;

    if (qrContainer) {
        qrContainer.innerHTML = "";
        const qrUrl = `https://img.vietqr.io/image/ACB-27384751-compact2.png?amount=${order.total}&addInfo=${encodeURIComponent(`DO AN 11A11 ${order.studentName}`)}&accountName=DOAN%20QUANG%20TAN`;
        qrContainer.innerHTML = `
            <img src="${qrUrl}" alt="VietQR Đặt Món" class="w-64 h-auto rounded-2xl mx-auto shadow-lg border border-gray-200">
        `;
    }

    openModal("foodQrModal");
    recordOrderSuccess(order, "Chuyển khoản QR 💳");
}

function recordOrderSuccess(order, method) {
    const newRecord = {
        id: "ORDER_" + Date.now(),
        date: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + " " + new Date().toLocaleDateString('vi-VN'),
        shopName: order.shop.name,
        studentName: order.studentName,
        total: order.total,
        itemsCount: order.items.reduce((s, i) => s + i.qty, 0),
        method: method,
        status: "Đang chờ quán làm 🍳"
    };

    foodState.ordersHistory.unshift(newRecord);
    saveFoodOrders();

    // Reset cart
    foodState.cart = { shopId: null, items: {} };
    saveFoodCart();
    updateFoodCartFloatingBar();
    closeModal("foodCartModal");

    // Hiệu ứng pháo giấy ăn mừng
    if (typeof confetti === "function") {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    }
}

// ═══════════════════════════════════════════════════════════════
// 7. ĐÁNH GIÁ & REVIEW QUÁN ĂN
// ═══════════════════════════════════════════════════════════════
function openReviewModalForActiveShop() {
    const shop = foodState.shops.find(s => s.id === foodState.activeShopId);
    if (!shop) return;

    const titleEl = document.getElementById("foodReviewShopName");
    if (titleEl) titleEl.innerText = shop.name;

    // Student select for review
    const sel = document.getElementById("foodReviewStudentSelect");
    if (sel && sel.options.length <= 1 && typeof STUDENTS !== "undefined") {
        sel.innerHTML = `<option value="">-- Chọn tên học sinh 11A11 --</option>` + 
            STUDENTS.map(st => `<option value="${st.name}">${st.name}</option>`).join("");
    }

    openModal("foodReviewModal");
}

function submitFoodReview() {
    const shop = foodState.shops.find(s => s.id === foodState.activeShopId);
    if (!shop) return;

    const author = document.getElementById("foodReviewStudentSelect")?.value || document.getElementById("foodReviewAuthorInput")?.value || "Học sinh 11A11";
    const rating = parseInt(document.getElementById("foodReviewRatingSelect")?.value || "5");
    const comment = document.getElementById("foodReviewCommentInput")?.value || "";

    if (!comment.trim()) {
        alert("Vui lòng nhập vài dòng cảm nhận về đồ ăn/quán nhé!");
        return;
    }

    const newRev = {
        author: author,
        class: "11A11",
        rating: rating,
        date: "Vừa xong",
        comment: comment.trim()
    };

    shop.reviews.unshift(newRev);
    shop.reviewCount++;
    // Cập nhật lại rating trung bình
    const sumRating = shop.reviews.reduce((acc, r) => acc + r.rating, 0);
    shop.rating = parseFloat((sumRating / shop.reviews.length).toFixed(1));

    saveFoodShops();
    closeModal("foodReviewModal");
    openShopMenuModal(shop.id);
    renderFoodShopList();

    alert(`Cảm ơn bạn ${author} đã đánh giá quán "${shop.name}"! ⭐`);
}

// Gọi điện nhanh cho quán
function callShopPhone(phone, shopName) {
    if (confirm(`Bạn có muốn gọi cho quán "${shopName}" qua số điện thoại: ${phone} không?`)) {
        window.location.href = `tel:${phone}`;
    }
}

// Mở chỉ đường Google Maps
function openDirections(encodedAddress) {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, "_blank");
}
