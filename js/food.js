/**
 * ĐỒ ĂN QUANH TRƯỜNG — THPT CAO BÁ QUÁT GIA LÂM (FOOD DELIVERY APP STYLE)
 * - Tích hợp bản đồ Google Maps tương tác (Leaflet + Google Maps Tiles + Ghim ảnh quán thực tế)
 * - Đặt món trực tiếp qua Link Fanpage Facebook / Messenger của quán (KHÔNG dùng mã QR chuyển khoản cá nhân)
 * - Giao diện hiện đại học hỏi các app đặt đồ ăn hàng đầu (ShopeeFood, GrabFood)
 */

const DEFAULT_FOOD_SHOPS = [
    {
        id: "quan_co_ba",
        name: "Trà Sữa & Ăn Vặt Cô Ba",
        category: "snack_tea",
        categoryLabel: "Trà Sữa & Ăn Vặt",
        distanceMeters: 30,
        distanceText: "30m · Cổng phụ",
        walkTime: "1 phút đi bộ",
        lat: 21.01170,
        lng: 105.95280,
        address: "Ngõ Cổng Phụ THPT Cao Bá Quát, Cổ Bi, Gia Lâm, Hà Nội",
        phone: "0982345678",
        fanpageUrl: "https://www.facebook.com/trasuacobacbq",
        messengerUrl: "https://m.me/trasuacobacbq",
        rating: 4.9,
        reviewCount: 328,
        badge: "Quán Ruột 11A11 ⭐",
        badgeBg: "bg-amber-500",
        coverImage: "https://images.unsplash.com/photo-1558857563-b371f30ca6a5?w=600&auto=format&fit=crop&q=80",
        avatar: "🧋",
        priceRange: "15.000đ - 30.000đ",
        openHours: "06:30 - 18:30 (Đang mở cửa)",
        highlightReview: "Trà sữa nướng trân châu hoàng kim béo ngậy, cô Ba hay cho thêm thạch phô mai miễn phí!",
        menu: [
            { 
                id: "cb_ts_nuong", 
                name: "Trà Sữa Nướng Trân Châu Hoàng Kim", 
                price: 25000, 
                image: "https://images.unsplash.com/photo-1558857563-b371f30ca6a5?w=200&auto=format&fit=crop&q=80", 
                desc: "Đậm vị trà nướng, trân châu hoàng kim dẻo quánh dai ngon", 
                isHot: true 
            },
            { 
                id: "cb_tra_mang_cau", 
                name: "Trà Mãng Cầu Tươi Đậm Vị", 
                price: 22000, 
                image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=200&auto=format&fit=crop&q=80", 
                desc: "Mãng cầu tươi dầm ngọt thanh chua nhẹ giải nhiệt", 
                isHot: true 
            },
            { 
                id: "cb_tra_dao", 
                name: "Trà Đào Cam Sả Tươi Mát", 
                price: 20000, 
                image: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=200&auto=format&fit=crop&q=80", 
                desc: "Miếng đào giòn sần sật, sả thơm ngào ngạt", 
                isHot: false 
            },
            { 
                id: "cb_banh_trang_cuon", 
                name: "Bánh Tráng Cuộn Bơ Trứng Muối", 
                price: 18000, 
                image: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=200&auto=format&fit=crop&q=80", 
                desc: "Bơ thơm béo, tép khô, sốt me cay đậm đà", 
                isHot: true 
            },
            { 
                id: "cb_nem_chua_ran", 
                name: "Nem Chua Rán Giòn Rụm (5 cái)", 
                price: 25000, 
                image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=200&auto=format&fit=crop&q=80", 
                desc: "Nem chua rán chuẩn vị phố cổ, chấm tương ớt cay nồng", 
                isHot: true 
            }
        ],
        reviews: [
            { author: "Nguyễn Hà Anh", class: "11A11", rating: 5, date: "Hôm nay", comment: "Trà sữa nướng đỉnh thật sự, trân châu dẻo mềm không bị cứng. Cô Ba còn cho thêm thạch miễn phí nữa!" },
            { author: "Đỗ Nguyễn Thanh Tùng", class: "11A11", rating: 5, date: "Hôm qua", comment: "Nem chua rán giòn thơm, ăn lúc ra chơi ca 2 bao phê luôn ae ơi." }
        ]
    },
    {
        id: "quan_the_cbq_hub",
        name: "The CBQ Hub — Bingsu & Trà Trái Cây",
        category: "snack_tea",
        categoryLabel: "Trà Sữa & Đồ Uống",
        distanceMeters: 80,
        distanceText: "80m · Cạnh nhà thể chất",
        walkTime: "2 phút đi bộ",
        lat: 21.01140,
        lng: 105.95210,
        address: "Ngõ 2 Cổ Bi (Cạnh nhà thể chất trường THPT Cao Bá Quát)",
        phone: "0963123456",
        fanpageUrl: "https://www.facebook.com/thecbqhub",
        messengerUrl: "https://m.me/thecbqhub",
        rating: 5.0,
        reviewCount: 520,
        badge: "Top 1 Check-In 📸",
        badgeBg: "bg-fuchsia-600",
        coverImage: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&auto=format&fit=crop&q=80",
        avatar: "🍧",
        priceRange: "20.000đ - 40.000đ",
        openHours: "07:00 - 21:30 (Đang mở cửa)",
        highlightReview: "Decor điều hòa mát rượi, bingsu núi xoài ngập tràn sữa đặc và kem tươi!",
        menu: [
            { 
                id: "hub_bingsu_xoai", 
                name: "Bingsu Xoài Tuyết Sữa Núi Cao", 
                price: 35000, 
                image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=200&auto=format&fit=crop&q=80", 
                desc: "Đá bào tuyết mịn màng, ngập xoài cát chín ngọt và kem vani", 
                isHot: true 
            },
            { 
                id: "hub_milo_dam", 
                name: "Milo Dầm Trân Châu Lava Khổng Lồ", 
                price: 25000, 
                image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=200&auto=format&fit=crop&q=80", 
                desc: "Milo đậm đặc, sốt socola chảy ngập trân châu pudding", 
                isHot: true 
            },
            { 
                id: "hub_ga_lac_cay", 
                name: "Gà Rán Lắc Phô Mai Cay Hàn Quốc", 
                price: 25000, 
                image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=200&auto=format&fit=crop&q=80", 
                desc: "Miếng gà không xương giòn rụm áo bột phô mai cay the", 
                isHot: true 
            }
        ],
        reviews: [
            { author: "Nguyễn Thanh Vân", class: "11A11", rating: 5, date: "Hôm nay", comment: "Quán có điều hòa mát rượi, decor xinh xắn để sống ảo. Milo dầm đậm đặc siêu ngon!" }
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
        lat: 21.01260,
        lng: 105.95320,
        address: "Số 28 Đường Cổ Bi, Gia Lâm, Hà Nội",
        phone: "0912456789",
        fanpageUrl: "https://www.facebook.com/comtamchubaycbq",
        messengerUrl: "https://m.me/comtamchubaycbq",
        rating: 4.8,
        reviewCount: 280,
        badge: "Bổ Rẻ No Căng 🍚",
        badgeBg: "bg-emerald-600",
        coverImage: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
        avatar: "🍛",
        priceRange: "25.000đ - 35.000đ",
        openHours: "09:30 - 14:00 & 16:30 - 20:00",
        highlightReview: "Cơm sườn bì chả miếng sườn to đùng, nước mắm kẹo kẹo chuẩn vị Sài Gòn!",
        menu: [
            { 
                id: "cb_com_suon_bi", 
                name: "Cơm Sườn Bì Chả Đặc Biệt", 
                price: 35000, 
                image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200&auto=format&fit=crop&q=80", 
                desc: "Miếng sườn nướng than hoa thơm lừng + bì + chả trứng hấp", 
                isHot: true 
            },
            { 
                id: "cb_bun_thit_nuong", 
                name: "Bún Thịt Nướng Chả Giò Giòn", 
                price: 30000, 
                image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&auto=format&fit=crop&q=80", 
                desc: "Thịt nướng mè, chả giò rế tôm thịt, mỡ hành đậu phộng", 
                isHot: true 
            },
            { 
                id: "cb_com_ga_xoi", 
                name: "Cơm Gà Xối Mỡ Da Giòn Tan", 
                price: 30000, 
                image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=200&auto=format&fit=crop&q=80", 
                desc: "Đùi gà góc tư chiên vàng ruộm ăn kèm cơm đảo hạt ngọc", 
                isHot: true 
            }
        ],
        reviews: [
            { author: "Đoàn Xuân Vinh", class: "11A11", rating: 5, date: "Hôm qua", comment: "Cơm nhiều ú ụ, sườn ướp đậm đà nước mắm kẹo kẹo chuẩn vị luôn." }
        ]
    },
    {
        id: "quan_pate_cot_den",
        name: "Bánh Mì Chảo & Pate Cột Đèn",
        category: "bread_fastfood",
        categoryLabel: "Bánh Mì & Ăn Nhanh",
        distanceMeters: 50,
        distanceText: "50m · Đối diện cổng trường",
        walkTime: "1 phút đi bộ",
        lat: 21.01220,
        lng: 105.95230,
        address: "Số 8 Cổ Bi (Đối diện cổng chính THPT Cao Bá Quát)",
        phone: "0977889900",
        fanpageUrl: "https://www.facebook.com/banhmichaocbq",
        messengerUrl: "https://m.me/banhmipatecbq",
        rating: 4.9,
        reviewCount: 415,
        badge: "Top 1 Ăn Sáng 🥖",
        badgeBg: "bg-red-600",
        coverImage: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&auto=format&fit=crop&q=80",
        avatar: "🍳",
        priceRange: "15.000đ - 30.000đ",
        openHours: "06:00 - 13:30 & 16:00 - 19:30",
        highlightReview: "Pate cột đèn tự làm béo ngậy tan trên đầu lưỡi, chảo nóng hổi thơm nức mũi!",
        menu: [
            { 
                id: "bm_chao_full", 
                name: "Bánh Mì Chảo Đầy Đủ Đặc Biệt", 
                price: 30000, 
                image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=200&auto=format&fit=crop&q=80", 
                desc: "Pate nóng hổi + xúc xích rán + trứng ốp lòng đào + bò xào", 
                isHot: true 
            },
            { 
                id: "bm_pate_cot_den", 
                name: "Bánh Mì Pate Cột Đèn Hải Phòng", 
                price: 18000, 
                image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=200&auto=format&fit=crop&q=80", 
                desc: "Bánh giòn rụm ngập pate béo ngậy, sốt ớt cay cay tê tái", 
                isHot: true 
            }
        ],
        reviews: [
            { author: "Phùng Trung Hiếu", class: "11A11", rating: 5, date: "Hôm nay", comment: "Pate tự làm thơm nức mũi, sốt bánh mì chảo chấm bánh giòn rụm hết nước chấm!" }
        ]
    },
    {
        id: "quan_banh_trang_co_hoa",
        name: "Ăn Vặt Cổng Trường — Bánh Tráng Cô Hoa",
        category: "snack_tea",
        categoryLabel: "Ăn Vặt Cổng Trường",
        distanceMeters: 15,
        distanceText: "15m · Ngay trước cổng chính",
        walkTime: "30 giây đi bộ",
        lat: 21.01195,
        lng: 105.95240,
        address: "Cổng chính THPT Cao Bá Quát, Số 12 Cổ Bi, Gia Lâm",
        phone: "0934567123",
        fanpageUrl: "https://www.facebook.com/anvatcohoacbq",
        messengerUrl: "https://m.me/anvatcohoacbq",
        rating: 4.9,
        reviewCount: 380,
        badge: "Học Sinh Khuyên Thử 🔥",
        badgeBg: "bg-rose-600",
        coverImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80",
        avatar: "🌶️",
        priceRange: "10.000đ - 20.000đ",
        openHours: "06:30 - 18:00 (Đang mở cửa)",
        highlightReview: "Cô Hoa siêu xởi lởi, gọi bánh tráng trộn cô cho cả nắm hành phi với trứng cút!",
        menu: [
            { 
                id: "ch_banh_trang_tron", 
                name: "Bánh Tráng Trộn Bò Khô Trứng Cút", 
                price: 15000, 
                image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&auto=format&fit=crop&q=80", 
                desc: "Bánh tráng sợi dẻo, bò khô, mực xé, xoài chua, rau răm", 
                isHot: true 
            },
            { 
                id: "ch_bap_xao_bo", 
                name: "Bắp Xào Bơ Tép Hành Phi", 
                price: 15000, 
                image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=200&auto=format&fit=crop&q=80", 
                desc: "Bắp mỹ ngọt lịm xào bơ thơm lừng, rắc tép đỏ giòn tan", 
                isHot: true 
            }
        ],
        reviews: [
            { author: "Đinh Lệnh Tuấn Vũ", class: "11A11", rating: 5, date: "Hôm qua", comment: "Cô Hoa siêu xởi lởi, bánh tráng bơ sốt me ăn no xỉu." }
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
        lat: 21.01310,
        lng: 105.95180,
        address: "Số 45 Đường Cổ Bi, Gia Lâm, Hà Nội",
        phone: "0904567890",
        fanpageUrl: "https://www.facebook.com/phoboooanhcbq",
        messengerUrl: "https://m.me/phoboooanhcbq",
        rating: 4.8,
        reviewCount: 195,
        badge: "Nước Dùng Đậm Đà 🍲",
        badgeBg: "bg-indigo-600",
        coverImage: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&auto=format&fit=crop&q=80",
        avatar: "🍜",
        priceRange: "30.000đ - 40.000đ",
        openHours: "06:00 - 13:00 & 17:00 - 21:00",
        highlightReview: "Nước dùng ninh từ xương bò ngọt lịm tự nhiên, chả cua Huế to đùng thơm phức!",
        menu: [
            { 
                id: "oo_bun_bo_hue", 
                name: "Bún Bò Huế Đầy Đủ Chả Cua Thịt Bắp", 
                price: 35000, 
                image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=200&auto=format&fit=crop&q=80", 
                desc: "Bún sợi to, bắp bò hoa, chả cua Huế đậm vị ruốc sả", 
                isHot: true 
            },
            { 
                id: "oo_pho_bo_tai", 
                name: "Phở Bò Tái Nạm Nước Dùng Trong", 
                price: 35000, 
                image: "https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=200&auto=format&fit=crop&q=80", 
                desc: "Thịt bò tươi mềm ngọt, nước dùng thơm hương quế hồi", 
                isHot: true 
            }
        ],
        reviews: [
            { author: "Đoàn Trung Hải", class: "11A11", rating: 5, date: "Hôm nay", comment: "Bún bò huế ở đây ngon nhất khu Cổ Bi rồi, nước dùng thơm nức sả ruốc." }
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
    sortBy: "rating",
    activeShopId: null,
    ordersHistory: []
};

let foodLeafletMap = null;
let foodMapMarkers = [];

// Khởi tạo Module Đồ Ăn
function initFoodModule() {
    try {
        const savedShops = localStorage.getItem("QL_FOOD_SHOPS_V3");
        if (savedShops) {
            foodState.shops = JSON.parse(savedShops);
        } else {
            foodState.shops = JSON.parse(JSON.stringify(DEFAULT_FOOD_SHOPS));
            localStorage.setItem("QL_FOOD_SHOPS_V3", JSON.stringify(foodState.shops));
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

function saveFoodShops() {
    localStorage.setItem("QL_FOOD_SHOPS_V3", JSON.stringify(foodState.shops));
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
    setTimeout(() => {
        renderFoodGoogleMap();
    }, 150);
    renderFoodShopList();
    updateFoodCartFloatingBar();
}

// ═══════════════════════════════════════════════════════════════
// 1. BẢN ĐỒ GOOGLE MAPS TƯƠNG TÁC VỚI MARKER ẢNH QUÁN THỰC TẾ
// ═══════════════════════════════════════════════════════════════
function renderFoodGoogleMap() {
    const mapEl = document.getElementById("foodLeafletMap");
    if (!mapEl || typeof L === "undefined") return;

    const schoolCoords = [21.01185, 105.95250]; // THPT Cao Bá Quát Gia Lâm

    if (!foodLeafletMap) {
        foodLeafletMap = L.map('foodLeafletMap', {
            center: schoolCoords,
            zoom: 17,
            zoomControl: false,
            attributionControl: false
        });

        // Layer Bản Đồ Google Maps Chuẩn (Đầy đủ đường phố, tiếng Việt)
        L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            maxZoom: 20
        }).addTo(foodLeafletMap);

        // Marker Trường THPT Cao Bá Quát
        const schoolIcon = L.divIcon({
            className: 'leaflet-div-icon',
            html: `
                <div class="food-map-pin school-pin">
                    <div class="pin-body">
                        <i class="fa-solid fa-graduation-cap"></i>
                    </div>
                    <div class="pin-label">
                        <span>🏫 THPT Cao Bá Quát</span>
                    </div>
                </div>
            `,
            iconSize: [46, 75],
            iconAnchor: [23, 75]
        });
        L.marker(schoolCoords, { icon: schoolIcon }).addTo(foodLeafletMap);
    }

    foodLeafletMap.invalidateSize();

    // Xóa marker quán cũ
    foodMapMarkers.forEach(m => foodLeafletMap.removeLayer(m));
    foodMapMarkers = [];

    // Tạo Marker với HÌNH ẢNH THẬT của từng quán ăn
    const filteredShops = getFilteredFoodShops();
    filteredShops.forEach(shop => {
        if (!shop.lat || !shop.lng) return;

        const isSelected = foodState.activeShopId === shop.id;
        const pinIcon = L.divIcon({
            className: 'leaflet-div-icon',
            html: `
                <div class="food-map-pin ${isSelected ? 'pin-selected' : ''}" onclick="selectFoodShopPin('${shop.id}')">
                    <div class="pin-body" style="background-image: url('${shop.coverImage}');">
                        <span class="pin-badge">★ ${shop.rating}</span>
                    </div>
                    <div class="pin-label">
                        <span class="truncate max-w-[110px]">${shop.name}</span>
                        <span class="pin-dist">${shop.distanceMeters}m</span>
                    </div>
                </div>
            `,
            iconSize: [46, 75],
            iconAnchor: [23, 75]
        });

        const marker = L.marker([shop.lat, shop.lng], { icon: pinIcon }).addTo(foodLeafletMap);
        marker.on('click', () => {
            selectFoodShopPin(shop.id);
        });
        foodMapMarkers.push(marker);
    });
}

function selectFoodShopPin(shopId) {
    foodState.activeShopId = shopId;
    const shop = foodState.shops.find(s => s.id === shopId);
    if (shop && foodLeafletMap) {
        foodLeafletMap.panTo([shop.lat, shop.lng], { animate: true, duration: 0.6 });
    }
    openShopMenuModal(shopId);
}

// Mở bản đồ Google Maps bên ngoài
function openGoogleMapsArea() {
    window.open("https://www.google.com/maps/search/qu%C3%A1n+%C4%83n+g%E1%BA%A7n+THPT+Cao+B%C3%A1+Qu%C3%A1t+Gia+L%C3%A2m/@21.01185,105.9525,17z", "_blank");
}

// ═══════════════════════════════════════════════════════════════
// 2. BỘ LỌC & TÌM KIẾM
// ═══════════════════════════════════════════════════════════════
function getFilteredFoodShops() {
    let result = [...foodState.shops];

    if (foodState.activeCategory === "top") {
        result = result.filter(s => s.rating >= 4.9);
    } else if (foodState.activeCategory !== "all") {
        result = result.filter(s => s.category === foodState.activeCategory);
    }

    if (foodState.searchKeyword.trim()) {
        const kw = foodState.searchKeyword.trim().toLowerCase();
        result = result.filter(s => {
            const matchName = s.name.toLowerCase().includes(kw);
            const matchAddress = s.address.toLowerCase().includes(kw);
            const matchMenu = s.menu.some(m => m.name.toLowerCase().includes(kw) || (m.desc && m.desc.toLowerCase().includes(kw)));
            return matchName || matchAddress || matchMenu;
        });
    }

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
            btn.className = "food-cat-btn whitespace-nowrap px-3.5 py-2 rounded-2xl font-black text-xs transition-all cursor-pointer bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-orange-300/40";
        } else {
            btn.className = "food-cat-btn whitespace-nowrap px-3.5 py-2 rounded-2xl font-bold text-xs bg-white text-gray-700 border border-gray-200 transition-all cursor-pointer hover:border-amber-400";
        }
    });
    renderFoodGoogleMap();
    renderFoodShopList();
}

function handleFoodSearch(keyword) {
    foodState.searchKeyword = keyword;
    renderFoodGoogleMap();
    renderFoodShopList();
}

function handleFoodSort(criteria) {
    foodState.sortBy = criteria;
    renderFoodShopList();
}

// ═══════════════════════════════════════════════════════════════
// 3. RENDER DANH SÁCH QUÁN ĂN (SHOPEEFOOD / GRABFOOD STYLE)
// ═══════════════════════════════════════════════════════════════
function renderFoodShopList() {
    const container = document.getElementById("foodShopListContainer");
    if (!container) return;

    const shops = getFilteredFoodShops();

    if (shops.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <div class="text-5xl mb-3">🔍</div>
                <h4 class="text-base font-black text-gray-800">Không tìm thấy quán nào!</h4>
                <p class="text-xs text-gray-500 mt-1">Thử đổi từ khóa hoặc danh mục khác nhé.</p>
                <button onclick="setFoodCategory('all')" class="mt-4 px-4 py-2 bg-amber-500 text-white font-bold text-xs rounded-xl shadow-md">
                    Xem tất cả quán quanh trường
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = shops.map(shop => {
        return `
            <div class="bg-white rounded-3xl overflow-hidden border border-gray-200/80 shadow-md hover:shadow-xl transition-all">
                <!-- Cover Image & Badges -->
                <div class="relative h-36 sm:h-40 overflow-hidden bg-slate-900 group cursor-pointer" onclick="openShopMenuModal('${shop.id}')">
                    <img src="${shop.coverImage}" alt="${shop.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    
                    <!-- Top Badges -->
                    <div class="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span class="text-[10px] font-black text-white px-2.5 py-1 rounded-full ${shop.badgeBg} shadow-md">
                            ${shop.badge}
                        </span>
                        <span class="text-[10px] font-bold text-white bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
                            ${shop.distanceText}
                        </span>
                    </div>

                    <!-- Bottom Title on Image -->
                    <div class="absolute bottom-2.5 left-3 right-3 text-white">
                        <h3 class="text-base font-black leading-tight drop-shadow-sm">${shop.name}</h3>
                        <div class="flex items-center gap-2 text-[11px] text-white/90 mt-0.5">
                            <span class="font-extrabold text-amber-300 flex items-center gap-0.5">
                                <i class="fa-solid fa-star text-[10px]"></i> ${shop.rating}
                            </span>
                            <span>(${shop.reviewCount} đánh giá)</span>
                            <span>·</span>
                            <span>${shop.priceRange}</span>
                        </div>
                    </div>
                </div>

                <!-- Body Content -->
                <div class="p-3.5 sm:p-4">
                    <!-- Top Popular Dishes Tag -->
                    <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 text-[11px]">
                        ${shop.menu.slice(0, 3).map(m => `
                            <span class="bg-amber-50 text-amber-900 border border-amber-200/70 px-2 py-1 rounded-xl whitespace-nowrap font-semibold">
                                ${m.name} · <b class="text-amber-600">${(m.price/1000)}k</b>
                            </span>
                        `).join("")}
                    </div>

                    <!-- Action Buttons: Đặt qua Fanpage hoặc Xem Menu -->
                    <div class="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-gray-100">
                        <!-- Nút Nhắn Fanpage Đặt Món -->
                        <a href="${shop.fanpageUrl}" target="_blank" 
                           class="py-2.5 px-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-md shadow-indigo-200 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer text-center">
                            <i class="fa-brands fa-facebook-messenger text-sm"></i>
                            <span>Nhắn Fanpage</span>
                        </a>

                        <!-- Nút Xem Menu & Chọn Món -->
                        <button onclick="openShopMenuModal('${shop.id}')" 
                                class="py-2.5 px-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-500 text-white font-black text-xs rounded-xl shadow-md shadow-orange-200 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer text-center">
                            <i class="fa-solid fa-utensils text-xs"></i>
                            <span>Xem Menu</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

// ═══════════════════════════════════════════════════════════════
// 4. MODAL XEM MENU CHI TIẾT CỦA QUÁN (SHOPEEFOOD STYLE)
// ═══════════════════════════════════════════════════════════════
function openShopMenuModal(shopId) {
    const shop = foodState.shops.find(s => s.id === shopId);
    if (!shop) return;

    foodState.activeShopId = shopId;

    const modalTitle = document.getElementById("shopMenuModalTitle");
    const modalCover = document.getElementById("shopMenuModalCover");
    const modalDistance = document.getElementById("shopMenuModalDistance");
    const modalAddress = document.getElementById("shopMenuModalAddress");
    const modalHours = document.getElementById("shopMenuModalHours");
    const modalBadge = document.getElementById("shopMenuModalBadge");
    const modalFanpageBtn = document.getElementById("shopMenuModalFanpageBtn");
    const modalCallBtn = document.getElementById("shopMenuModalCallBtn");
    const modalMapBtn = document.getElementById("shopMenuModalMapBtn");
    const modalList = document.getElementById("shopMenuItemsList");
    const modalReviews = document.getElementById("shopMenuReviewsList");

    if (modalTitle) modalTitle.innerText = shop.name;
    if (modalCover) modalCover.src = shop.coverImage;
    if (modalDistance) modalDistance.innerText = `${shop.distanceText} · ${shop.walkTime}`;
    if (modalAddress) modalAddress.innerText = shop.address;
    if (modalHours) modalHours.innerText = shop.openHours;
    if (modalBadge) modalBadge.innerText = shop.badge;

    // Direct Links
    if (modalFanpageBtn) {
        modalFanpageBtn.href = shop.fanpageUrl;
        modalFanpageBtn.onclick = () => {
            if (typeof showToast === "function") {
                showToast(`Đang mở Fanpage "${shop.name}" để nhắn tin đặt món! 💬`);
            }
        };
    }
    if (modalCallBtn) modalCallBtn.href = `tel:${shop.phone}`;
    if (modalMapBtn) {
        modalMapBtn.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(shop.address)}`;
    }

    // Render Menu Items với hình ảnh thực tế
    if (modalList) {
        modalList.innerHTML = shop.menu.map(item => {
            const currentQty = (foodState.cart.shopId === shop.id && foodState.cart.items[item.id]) 
                ? foodState.cart.items[item.id].qty 
                : 0;

            return `
                <div class="bg-gray-50/80 hover:bg-amber-50/30 border border-gray-200/80 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between gap-3 transition-all">
                    <!-- Ảnh món & thông tin -->
                    <div class="flex items-center gap-2.5 min-w-0 flex-1">
                        <img src="${item.image}" alt="${item.name}" class="w-14 h-14 rounded-xl object-cover shadow-xs shrink-0 border border-gray-200">
                        <div class="min-w-0 flex-1">
                            <div class="flex items-center gap-1.5 flex-wrap">
                                <h4 class="text-xs font-bold text-gray-900 truncate">${item.name}</h4>
                                ${item.isHot ? '<span class="text-[9px] bg-rose-500 text-white font-black px-1.5 py-0.2 rounded-md shrink-0">HOT</span>' : ''}
                            </div>
                            <p class="text-[11px] text-gray-500 leading-tight mt-0.5 line-clamp-1">${item.desc}</p>
                            <div class="text-xs font-black text-amber-600 mt-1">${item.price.toLocaleString('vi-VN')}đ</div>
                        </div>
                    </div>

                    <!-- Nút Thêm hoặc Bộ đếm -->
                    <div class="shrink-0">
                        ${currentQty > 0 ? `
                            <div class="flex items-center gap-1.5 bg-white rounded-xl border border-amber-300 p-0.5 shadow-xs">
                                <button onclick="changeCartItemQty('${shop.id}', '${item.id}', -1)" class="w-6 h-6 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold flex items-center justify-center text-xs active:scale-95 transition cursor-pointer">
                                    -
                                </button>
                                <span class="text-xs font-black text-gray-900 px-1 min-w-[14px] text-center">${currentQty}</span>
                                <button onclick="changeCartItemQty('${shop.id}', '${item.id}', 1)" class="w-6 h-6 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold flex items-center justify-center text-xs active:scale-95 transition cursor-pointer">
                                    +
                                </button>
                            </div>
                        ` : `
                            <button onclick="addFoodToCart('${shop.id}', '${item.id}')" 
                                    class="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1 transition cursor-pointer">
                                <i class="fa-solid fa-plus text-[10px]"></i>
                                <span>Thêm</span>
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
            <div class="bg-gray-50 rounded-2xl p-2.5 border border-gray-100 text-xs">
                <div class="flex items-center justify-between mb-1">
                    <div class="flex items-center gap-1.5 font-bold text-gray-800">
                        <span class="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-black">
                            ${r.author.charAt(0)}
                        </span>
                        <span>${r.author}</span>
                        <span class="text-[9px] bg-indigo-50 text-indigo-600 px-1 rounded font-extrabold">${r.class}</span>
                    </div>
                    <div class="text-amber-500 text-[10px] font-black">
                        ${'★'.repeat(r.rating)}
                    </div>
                </div>
                <p class="text-gray-600 text-[11px] leading-relaxed">"${r.comment}"</p>
            </div>
        `).join("");
    }

    openModal("shopMenuModal");
}

// ═══════════════════════════════════════════════════════════════
// 5. GIỎ HÀNG & GỌI MÓN (CART)
// ═══════════════════════════════════════════════════════════════
function addFoodToCart(shopId, itemId) {
    const shop = foodState.shops.find(s => s.id === shopId);
    if (!shop) return;
    const item = shop.menu.find(m => m.id === itemId);
    if (!item) return;

    if (foodState.cart.shopId && foodState.cart.shopId !== shopId) {
        const currentShop = foodState.shops.find(s => s.id === foodState.cart.shopId);
        const confirmChange = confirm(`Giỏ hàng của bạn đang có món của "${currentShop?.name || 'quán khác'}". Bạn có muốn đổi sang chọn quán "${shop.name}" không?`);
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
    openShopMenuModal(shopId);

    if (typeof showToast === "function") {
        showToast(`Đã thêm "${item.name}" vào giỏ! 🛒`);
    }
}

function changeCartItemQty(shopId, itemId, delta) {
    if (!foodState.cart.items[itemId]) return;
    foodState.cart.items[itemId].qty += delta;

    if (foodState.cart.items[itemId].qty <= 0) {
        delete foodState.cart.items[itemId];
    }

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
    const badge = document.getElementById("foodCartBadge");
    if (!bar) return;

    const itemCount = Object.values(foodState.cart.items).reduce((sum, i) => sum + i.qty, 0);
    const totalPrice = Object.values(foodState.cart.items).reduce((sum, i) => sum + (i.item.price * i.qty), 0);

    if (badge) {
        if (itemCount > 0) {
            badge.innerText = itemCount;
            badge.classList.remove("hidden");
        } else {
            badge.classList.add("hidden");
        }
    }

    if (itemCount > 0) {
        const shop = foodState.shops.find(s => s.id === foodState.cart.shopId);
        bar.classList.remove("hidden");
        bar.innerHTML = `
            <div class="w-full max-w-xl mx-auto px-4">
                <div onclick="openFoodCartModal()" 
                     class="bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 text-white rounded-3xl p-3.5 shadow-2xl shadow-orange-500/50 flex items-center justify-between cursor-pointer border border-white/30 backdrop-blur-md">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-lg font-black">
                            🛒
                        </div>
                        <div>
                            <div class="text-[11px] text-amber-100 font-bold">Giỏ hàng · ${shop?.name || 'Đang chọn'}</div>
                            <div class="text-sm font-black tracking-tight">${itemCount} món · ${totalPrice.toLocaleString('vi-VN')}đ</div>
                        </div>
                    </div>
                    <div class="flex items-center gap-1.5 bg-white text-gray-900 font-black text-xs px-3.5 py-2 rounded-2xl shadow-md">
                        <span>Xem giỏ & đặt</span>
                        <i class="fa-solid fa-arrow-right text-[10px]"></i>
                    </div>
                </div>
            </div>
        `;
    } else {
        bar.classList.add("hidden");
    }
}

// Mở Modal Giỏ Hàng
function openFoodCartModal() {
    const shop = foodState.shops.find(s => s.id === foodState.cart.shopId);
    if (!shop || Object.keys(foodState.cart.items).length === 0) {
        alert("Giỏ hàng đang trống! Bạn hãy chọn món trước nhé.");
        return;
    }

    const shopNameEl = document.getElementById("foodCartShopName");
    if (shopNameEl) shopNameEl.innerText = shop.name;

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
            <div class="flex items-center justify-between p-2.5 bg-gray-50 rounded-2xl border border-gray-200/80">
                <div class="flex items-center gap-2.5">
                    <img src="${entry.item.image || 'https://images.unsplash.com/photo-1558857563-b371f30ca6a5?w=100'}" class="w-10 h-10 rounded-xl object-cover border border-gray-200">
                    <div>
                        <div class="text-xs font-bold text-gray-900">${entry.item.name}</div>
                        <div class="text-[11px] text-amber-600 font-extrabold">${entry.item.price.toLocaleString('vi-VN')}đ</div>
                    </div>
                </div>
                <div class="flex items-center gap-1.5">
                    <button onclick="changeCartItemQty('${foodState.cart.shopId}', '${entry.item.id}', -1)" class="w-6 h-6 rounded-lg bg-white border border-gray-200 text-gray-700 font-bold flex items-center justify-center text-xs active:scale-95">
                        -
                    </button>
                    <span class="text-xs font-black text-gray-900 min-w-[14px] text-center">${entry.qty}</span>
                    <button onclick="changeCartItemQty('${foodState.cart.shopId}', '${entry.item.id}', 1)" class="w-6 h-6 rounded-lg bg-amber-500 text-white font-bold flex items-center justify-center text-xs active:scale-95">
                        +
                    </button>
                    <span class="text-xs font-black text-gray-900 ml-1.5 min-w-[55px] text-right">${itemTotal.toLocaleString('vi-VN')}đ</span>
                </div>
            </div>
        `;
    }).join("");

    if (totalEl) totalEl.innerText = `${total.toLocaleString('vi-VN')}đ`;
}

// ═══════════════════════════════════════════════════════════════
// 6. ĐẶT MÓN QUA FANPAGE HOẶC HOTLINE (KHÔNG QUÉT QR CODE)
// ═══════════════════════════════════════════════════════════════
function getOrderDetailsString() {
    const shop = foodState.shops.find(s => s.id === foodState.cart.shopId);
    const studentName = document.getElementById("foodOrderStudentSelect")?.value || "Học sinh 11A11";
    const phone = document.getElementById("foodOrderPhoneInput")?.value || "09xxxx";
    const location = document.getElementById("foodOrderLocationSelect")?.value || "Lớp 11A11 (Tầng 2)";
    const note = document.getElementById("foodOrderNoteInput")?.value || "";

    const items = Object.values(foodState.cart.items);
    const itemsListStr = items.map(i => `• ${i.item.name} x${i.qty} (${(i.item.price * i.qty).toLocaleString('vi-VN')}đ)`).join("\n");
    const total = items.reduce((sum, i) => sum + (i.item.price * i.qty), 0);

    const message = `[ĐƠN ĐẶT MÓN 11A11 - THPT CAO BÁ QUÁT]\nQuán: ${shop?.name}\nNgười đặt: ${studentName} - SĐT: ${phone}\nĐịa điểm nhận: ${location}\n${note ? 'Ghi chú: ' + note + '\n' : ''}Danh sách món:\n${itemsListStr}\n-------------------------\nTổng cộng: ${total.toLocaleString('vi-VN')}đ\nNhờ quán xác nhận và ship giúp em nhé!`;

    return { shop, studentName, phone, location, note, items, total, message };
}

// Đặt hàng qua Fanpage Messenger trực tiếp
function submitOrderFanpage() {
    const order = getOrderDetailsString();
    if (!order.shop) return;

    // Tự động sao chép tin nhắn đơn hàng vào clipboard
    if (navigator.clipboard) {
        navigator.clipboard.writeText(order.message);
    }

    const fanpageLink = order.shop.messengerUrl || order.shop.fanpageUrl;

    alert(`✅ ĐÃ SAO CHÉP ĐƠN HÀNG!\n\nĐang mở Fanpage: "${order.shop.name}"\nBạn chỉ cần bấm DÁN (Paste) tin nhắn vào chat với quán để chốt đơn ngay nhé!`);

    window.open(fanpageLink, "_blank");

    recordOrderSuccess(order, "Fanpage Messenger 💬");
}

// Gọi hotline trực tiếp
function submitOrderCall() {
    const order = getOrderDetailsString();
    if (!order.shop) return;

    if (confirm(`Bạn có muốn gọi hotline ${order.shop.phone} của "${order.shop.name}" để đọc đơn không?`)) {
        window.location.href = `tel:${order.shop.phone}`;
        recordOrderSuccess(order, "Gọi điện thoại 📞");
    }
}

// Gửi đơn qua Zalo
function submitOrderZalo() {
    const order = getOrderDetailsString();
    if (!order.shop) return;

    if (navigator.clipboard) {
        navigator.clipboard.writeText(order.message);
    }

    alert(`Đã sao chép nội dung đơn hàng!\nĐang mở Zalo số: ${order.shop.phone}\nBạn bấm DÁN để gửi cho quán nhé!`);
    window.open(`https://zalo.me/${order.shop.phone}`, "_blank");

    recordOrderSuccess(order, "Zalo 💬");
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
        status: "Đã gửi tới quán 🍳"
    };

    foodState.ordersHistory.unshift(newRecord);
    saveFoodOrders();

    foodState.cart = { shopId: null, items: {} };
    saveFoodCart();
    updateFoodCartFloatingBar();
    closeModal("foodCartModal");

    if (typeof confetti === "function") {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
}

// ═══════════════════════════════════════════════════════════════
// 7. ĐÁNH GIÁ QUÁN ĂN
// ═══════════════════════════════════════════════════════════════
function openReviewModalForActiveShop() {
    const shop = foodState.shops.find(s => s.id === foodState.activeShopId);
    if (!shop) return;

    const titleEl = document.getElementById("foodReviewShopName");
    if (titleEl) titleEl.innerText = shop.name;

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

    const author = document.getElementById("foodReviewStudentSelect")?.value || "Học sinh 11A11";
    const rating = parseInt(document.getElementById("foodReviewRatingSelect")?.value || "5");
    const comment = document.getElementById("foodReviewCommentInput")?.value || "";

    if (!comment.trim()) {
        alert("Vui lòng nhập nhận xét của bạn về quán nhé!");
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
    const sumRating = shop.reviews.reduce((acc, r) => acc + r.rating, 0);
    shop.rating = parseFloat((sumRating / shop.reviews.length).toFixed(1));

    saveFoodShops();
    closeModal("foodReviewModal");
    openShopMenuModal(shop.id);
    renderFoodShopList();

    alert(`Cảm ơn bạn ${author} đã đánh giá quán "${shop.name}"! ⭐`);
}

// Khởi chạy khi tài liệu sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    initFoodModule();
});
