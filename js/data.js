/**
 * CẤU HÌNH HỆ THỐNG QUẢN LÝ & THU QUỸ LỚP
 */

const CONFIG = {
    appName: "Công Việc Hằng Ngày",
    adminPassword: "1",
    settingsPassword: "1",
    bank: {
        bankId: "ACB",
        bankName: "ACB - Ngân hàng Á Châu",
        accountNo: "27384751",
        accountName: "DOAN QUANG TAN"
    },
    classroom: {
        className: "Lớp 11A11 - THPT Cao Bá Quát Gia Lâm",
        academicYear: "Năm học 2025-2026"
    },
    integration: {
        appsScriptUrl: "",
        telegramBotToken: "",
        telegramChatId: "",
    }
};

// 3 LOẠI QUỸ
const FUNDS = [
    {
        id: "QUY_LOP",
        code: "QUYLOP",
        title: "Quỹ Lớp",
        icon: "fa-solid fa-piggy-bank",
        color: "indigo",
        amount: 200000,
        description: "Quỹ hoạt động chung của lớp: in tài liệu, sinh nhật, tổ chức sự kiện, vệ sinh phòng học, thăm hỏi.",
        breakdown: [
            { item: "In ấn tài liệu học tập & đề cương ôn thi", cost: 60000 },
            { item: "Quỹ sinh nhật chung cho các thành viên", cost: 40000 },
            { item: "Tổ chức sự kiện 20/10, 20/11, 8/3", cost: 50000 },
            { item: "Nước uống, vệ sinh phòng học", cost: 20000 },
            { item: "Dự phòng thăm hỏi ốm đau & phát sinh", cost: 30000 }
        ]
    },
    {
        id: "QUY_DOAN",
        code: "QUYDOAN",
        title: "Quỹ Đoàn Khoa",
        icon: "fa-solid fa-flag",
        color: "rose",
        amount: 100000,
        description: "Quỹ đóng góp hoạt động Đoàn - Hội sinh viên khoa theo quy định.",
        breakdown: [
            { item: "Đoàn phí theo quy định Đoàn Thanh niên", cost: 30000 },
            { item: "Hội phí Hội Sinh viên khoa", cost: 20000 },
            { item: "Quỹ tổ chức các hoạt động phong trào khoa", cost: 30000 },
            { item: "Quỹ thi đua khen thưởng cuối kỳ", cost: 20000 }
        ]
    },
    {
        id: "QUY_KHAC",
        code: "QUYKHAC",
        title: "Quỹ Khác",
        icon: "fa-solid fa-ellipsis",
        color: "amber",
        amount: 150000,
        description: "Các khoản thu bổ sung: áo lớp, teambuilding, liên hoan cuối kỳ.",
        breakdown: [
            { item: "Áo đồng phục lớp (polo in logo)", cost: 100000 },
            { item: "Quỹ teambuilding & liên hoan cuối kỳ", cost: 50000 }
        ]
    }
];

// DANH SÁCH 50 HỌC SINH LỚP 11A11 — THPT CAO BÁ QUÁT GIA LÂM
const STUDENTS = [
    { id: 1, name: "Nguyễn Hà Anh" },
    { id: 2, name: "Nguyễn Mai Anh" },
    { id: 3, name: "Nguyễn Thái Hải Anh" },
    { id: 4, name: "Nguyễn Vũ Hồng Anh" },
    { id: 5, name: "Lê Ngọc Lục Bảo" },
    { id: 6, name: "Nguyễn Thanh Bình" },
    { id: 7, name: "Nguyễn Khánh Chi" },
    { id: 8, name: "Ngô Việt Cường" },
    { id: 9, name: "Đặng Bùi Kim Minh Đức" },
    { id: 10, name: "Lê Ngọc Hà" },
    { id: 11, name: "Đoàn Trung Hải" },
    { id: 12, name: "Phùng Trung Hiếu" },
    { id: 13, name: "Nguyễn Xuân Hoàng" },
    { id: 14, name: "Lê Công Mạnh Hùng" },
    { id: 15, name: "Lưu Minh Huy" },
    { id: 16, name: "Nguyễn Gia Huy" },
    { id: 17, name: "Nguyễn Duy Hưng" },
    { id: 18, name: "Vũ Bảo Khanh" },
    { id: 19, name: "Đỗ Lê Ngân Khánh" },
    { id: 20, name: "Ngô Quang Khánh" },
    { id: 21, name: "Đỗ Nguyễn Thanh Lâm" },
    { id: 22, name: "Nguyễn Ngọc Thùy Lâm" },
    { id: 23, name: "Lê Hoàng Linh" },
    { id: 24, name: "Lê Khánh Linh" },
    { id: 25, name: "Trần Hà Linh" },
    { id: 26, name: "Trần Thảo Linh" },
    { id: 27, name: "Vũ Quyền Linh" },
    { id: 28, name: "Nguyễn Tường Minh" },
    { id: 29, name: "Trần Bảo Minh" },
    { id: 30, name: "Trần Đức Minh" },
    { id: 31, name: "Trịnh Hiểu Minh" },
    { id: 32, name: "Nguyễn Minh Ngọc" },
    { id: 33, name: "Nguyễn Tuấn Nhật" },
    { id: 34, name: "Nguyễn Yến Nhi" },
    { id: 35, name: "Vũ Duy Phúc" },
    { id: 36, name: "Lê Tần Phương" },
    { id: 37, name: "Nguyễn Hà Phương" },
    { id: 38, name: "Nguyễn Khắc Thành" },
    { id: 39, name: "Phạm Tiến Thành" },
    { id: 40, name: "Hoàng Thị Thanh Thảo" },
    { id: 41, name: "Lưu Phương Thảo" },
    { id: 42, name: "Trịnh Đức Thịnh" },
    { id: 43, name: "Lê Minh Trang" },
    { id: 44, name: "Nguyễn Tuấn Tú" },
    { id: 45, name: "Hà Anh Tuấn" },
    { id: 46, name: "Đỗ Nguyễn Thanh Tùng" },
    { id: 47, name: "Nguyễn Thanh Vân" },
    { id: 48, name: "Đoàn Xuân Vinh" },
    { id: 49, name: "Hoàng Ngọc Vinh" },
    { id: 50, name: "Đinh Lệnh Tuấn Vũ" }
];

// NHIỆM VỤ MẪU
const SAMPLE_TASKS = [
    {
        id: 1,
        title: "Hoàn thành thu Quỹ Lớp học kỳ 1",
        description: "Đôn đốc các thành viên trong lớp đóng quỹ đúng hạn để phục vụ in ấn tài liệu và hoạt động chung.",
        deadline: "2024-10-15T23:59:59.000Z",
        priority: "high",
        completed: false,
        createdAt: "2024-09-15T08:00:00.000Z"
    },
    {
        id: 2,
        title: "Đăng ký size áo đồng phục lớp",
        description: "Tổng hợp danh sách size áo polo đồng phục của 54 thành viên gửi cho xưởng may.",
        deadline: "2024-10-20T17:00:00.000Z",
        priority: "medium",
        completed: true,
        createdAt: "2024-09-16T09:30:00.000Z"
    },
    {
        id: 3,
        title: "Lập kế hoạch dã ngoại và teambuilding",
        description: "Khảo sát địa điểm dã ngoại cuối tuần, dự trù kinh phí di chuyển và ăn uống.",
        deadline: "2024-11-05T12:00:00.000Z",
        priority: "low",
        completed: false,
        createdAt: "2024-09-18T14:00:00.000Z"
    }
];

// THÔNG BÁO MẪU
const SAMPLE_ANNOUNCEMENTS = [
    {
        id: 1,
        title: "Thông báo về việc đóng quỹ lớp kỳ 1",
        content: "Ban cán sự thông báo toàn thể sinh viên hoàn thành đóng Quỹ Lớp trước ngày 15/10 để kịp chuẩn bị in tài liệu học tập và tổ chức sự kiện 20/10.",
        date: "2024-09-18T08:30:00.000Z",
        tag: "urgent",
        pinned: true
    },
    {
        id: 2,
        title: "Kế hoạch tổ chức sinh nhật chung tháng 10",
        content: "Ban cán sự sẽ tổ chức sinh nhật cho các bạn có ngày sinh trong tháng 10 vào buổi sinh hoạt lớp cuối tuần. Mọi người chuẩn bị tham gia đông đủ nhé!",
        date: "2024-09-19T10:00:00.000Z",
        tag: "event",
        pinned: false
    }
];

// PHIÊN ĐIỂM DANH MẪU
const SAMPLE_ATTENDANCE = [
    {
        id: "sess_demo_1",
        title: "Buổi 1: Giới thiệu môn học & Đăng ký nhóm thảo luận",
        createdAt: "2024-09-24T07:30:00.000Z",
        expiresAt: null, // Không giới hạn giờ
        duration: 0
    }
];

const SAMPLE_ATTEND_REC = {
    "sess_demo_1": [
        { studentId: "240101", checkinAt: "2024-09-24T07:35:12.000Z" },
        { studentId: "240102", checkinAt: "2024-09-24T07:36:45.000Z" },
        { studentId: "240103", checkinAt: "2024-09-24T07:38:02.000Z" },
        { studentId: "240104", checkinAt: "2024-09-24T07:39:15.000Z" },
        { studentId: "240105", checkinAt: "2024-09-24T07:40:30.000Z" }
    ]
};

// ĐỢT GHÉP NHÓM & BÀI TẬP MẪU (NHIỀU MÔN HỌC & ĐỀ TÀI)
const SAMPLE_GROUP_SESSIONS = [
    {
        id: "group_session_demo",
        subject: "Thương Mại Điện Tử",
        topic: "Chiến Lược Bán Lẻ Omnichannel K25",
        title: "Thương Mại Điện Tử • Chiến Lược Bán Lẻ Omnichannel",
        minMembers: 3,
        maxMembers: 5,
        assignmentNotice: "📌 Yêu cầu bài tập: Mỗi nhóm xây dựng 1 kế hoạch kinh doanh số trên sàn TMĐT hoặc TikTok Shop. Nộp file báo cáo PDF (tối đa 20 trang) và slide thuyết trình nhóm. Thời hạn nộp: 23:59 ngày 25/10/2026.",
        assignmentDeadline: "2026-10-25",
        topicMode: "group_choice",
        topics: [
            { id: "T1", title: "Phát triển kênh bán lẻ đa kênh Omnichannel cho thời trang GenZ", description: "Chiến lược TikTok Shop + Livestream kết hợp cửa hàng trải nghiệm." },
            { id: "T2", title: "Tối ưu hóa phễu chuyển đổi E-Commerce bằng công cụ tự động hóa", description: "Triển khai hệ thống tự động chốt đơn và chăm sóc khách hàng qua Chatbot & CRM." },
            { id: "T3", title: "Ứng dụng AI & Big Data trong cá nhân hóa trải nghiệm mua sắm", description: "Phân tích hành vi duyệt web và thuật toán gợi ý sản phẩm phù hợp sở thích." },
            { id: "T4", title: "Chiến lược Marketing 0 đồng & Mạng lưới KOC/Affiliate đa kênh", description: "Xây dựng đội ngũ KOC tiếp thị liên kết và chia sẻ hoa hồng doanh thu." },
            { id: "T5", title: "Xây dựng thương hiệu số & Brand Storytelling trên mạng xã hội", description: "Kế hoạch nội dung video ngắn định vị thương hiệu có gu cho giới trẻ." },
            { id: "T6", title: "Quản trị rủi ro Logistics & Hoàn tất đơn hàng TMĐT", description: "Tối ưu chi phí vận chuyển, kho bãi và giải pháp giảm tỷ lệ hủy đơn COD." }
        ],
        groups: [
            {
                id: 1,
                name: "Nhóm 1",
                leaderId: "240101",
                members: ["240101", "240102", "240103", "240104"],
                topicId: "T1"
            },
            {
                id: 2,
                name: "Nhóm 2",
                leaderId: "240105",
                members: ["240105", "240106", "240107"],
                topicId: "T2"
            },
            {
                id: 3,
                name: "Nhóm 3",
                leaderId: "240108",
                members: ["240108", "240109", "240110", "240111"],
                topicId: null
            }
        ],
        isLocked: false,
        createdAt: "2026-09-24T08:00:00.000Z"
    },
    {
        id: "group_session_ktl",
        subject: "Kinh Tế Lượng",
        topic: "Mô Hình Hồi Quy Thực Nghiệm Đa Biến",
        title: "Kinh Tế Lượng • Mô Hình Hồi Quy Thực Nghiệm",
        minMembers: 3,
        maxMembers: 4,
        assignmentNotice: "📌 Yêu cầu bài tập: Mỗi nhóm thu thập dữ liệu bảng hoặc dữ liệu chuỗi thời gian, chạy hồi quy OLS trên phần mềm SPSS/Stata/EViews, kiểm định đa cộng tuyến, phương sai thay đổi và viết báo cáo kết quả.",
        assignmentDeadline: "2026-11-15",
        topicMode: "group_choice",
        topics: [
            { id: "KTL1", title: "Ước lượng tác động của FDI và xuất khẩu đến tăng trưởng kinh tế Việt Nam", description: "Dữ liệu vĩ mô 2010 - 2025." },
            { id: "KTL2", title: "Phân tích các nhân tố ảnh hưởng đến quyết định chi tiêu của GenZ", description: "Khảo sát thực nghiệm 300 mẫu sinh viên đại học." },
            { id: "KTL3", title: "Đánh giá mối quan hệ giữa lạm phát, lãi suất và tỷ giá hối đoái", description: "Mô hình hồi quy chuỗi thời gian VAR/VECM." },
            { id: "KTL4", title: "Khảo sát sự hài lòng của khách hàng đối với dịch vụ ngân hàng số", description: "Mô hình cấu trúc SEM / Hồi quy Logistic." }
        ],
        groups: [
            {
                id: 1,
                name: "Nhóm 1",
                leaderId: "240112",
                members: ["240112", "240113", "240114", "240115"],
                topicId: "KTL1"
            },
            {
                id: 2,
                name: "Nhóm 2",
                leaderId: "240116",
                members: ["240116", "240117", "240118"],
                topicId: "KTL2"
            }
        ],
        isLocked: false,
        createdAt: "2026-09-25T01:00:00.000Z"
    },
    {
        id: "group_session_mkt",
        subject: "Marketing Căn Bản",
        topic: "Kế Hoạch Ra Mắt Sản Phẩm Mới F&B",
        title: "Marketing Căn Bản • Kế Hoạch Ra Mắt Sản Phẩm Mới F&B",
        minMembers: 4,
        maxMembers: 6,
        assignmentNotice: "📌 Yêu cầu: Xây dựng chiến dịch 4P hoàn chỉnh cho một thương hiệu đồ uống healthy thế hệ mới tại thị trường Hải Phòng. Slide thuyết trình 20 slide + Video mockup quảng cáo 30s.",
        assignmentDeadline: "2026-12-05",
        topicMode: "group_choice",
        topics: [
            { id: "MKT1", title: "Định vị thương hiệu Kombucha hữu cơ hướng đến dân văn phòng trẻ", description: "Chiến lược phân phối chuỗi tiện lợi và văn phòng cao ốc." },
            { id: "MKT2", title: "Xây dựng chiến dịch Viral TikTok cho trà hoa quả địa phương", description: "Hợp tác food reviewer và trào lưu check-in giới trẻ." },
            { id: "MKT3", title: "Mô hình trạm nạp đồ uống không rác thải nhựa tại trường đại học", description: "Truyền thông phát triển bền vững ESG." }
        ],
        groups: [
            {
                id: 1,
                name: "Nhóm 1",
                leaderId: "240119",
                members: ["240119", "240120", "240121", "240122", "240123"],
                topicId: "MKT1"
            }
        ],
        isLocked: false,
        createdAt: "2026-09-25T02:00:00.000Z"
    },
    {
        id: "group_session_pldc",
        subject: "Pháp Luật Đại Cương",
        topic: "Phiên Tòa Giả Định & Xử Lý Tranh Chấp Hợp Đồng",
        title: "Pháp Luật Đại Cương • Phiên Tòa Giả Định & Tranh Chấp Hợp Đồng",
        minMembers: 4,
        maxMembers: 5,
        assignmentNotice: "📌 Yêu cầu: Phân vai Hội đồng xét xử, Viện kiểm sát, Luật sư nguyên đơn và bị đơn. Diễn án phiên tòa giả định 15 phút tại hội trường và nộp bản án dự thảo.",
        assignmentDeadline: "2026-10-30",
        topicMode: "admin_assign",
        topics: [
            { id: "PL1", title: "Tranh chấp hợp đồng mua bán hàng hóa quốc tế có vi phạm điều khoản thanh toán", description: "Áp dụng Công ước Viên 1980 (CISG) và Luật Thương Mại 2005." },
            { id: "PL2", title: "Xử lý bồi thường thiệt hại ngoài hợp đồng trong tai nạn giao thông liên hoàn", description: "Áp dụng Bộ luật Dân sự 2015." },
            { id: "PL3", title: "Tranh chấp quyền sở hữu trí tuệ đối với tác phẩm đồ họa tạo bởi Trí tuệ Nhân tạo", description: "Luật Sở hữu Trí tuệ sửa đổi bổ sung 2022." }
        ],
        groups: [
            {
                id: 1,
                name: "Nhóm 1 (Nguyên Đơn)",
                leaderId: "240124",
                members: ["240124", "240125", "240126", "240127"],
                topicId: "PL1"
            },
            {
                id: 2,
                name: "Nhóm 2 (Bị Đơn)",
                leaderId: "240128",
                members: ["240128", "240129", "240130", "240131", "240132"],
                topicId: "PL1"
            }
        ],
        isLocked: false,
        createdAt: "2026-09-25T03:00:00.000Z"
    }
];

const CLASS_SCHEDULE = [
    { day: 2, subject: 'Marketing trực tuyến', teacher: 'Cô Phương', period: '1-3', link: 'https://meet.google.com/brp-pmjg-wun' },
    { day: 3, subject: 'Tư tưởng Hồ Chí Minh', teacher: 'Thầy Yên', period: '1-3', link: 'https://meet.google.com/bww-wmhj-too' },
    { day: 3, subject: 'Content Marketing', teacher: 'Thầy Long', period: '4-6', link: 'https://meet.google.com/bqn-zfbg-jgh' },
    { day: 4, subject: 'Phân tích hoạt động kinh doanh', teacher: 'Cô Dung', period: '1-3', link: 'https://meet.google.com/pny-gzso-tag' },
    { day: 4, subject: 'Kỹ thuật soạn thảo văn bản', teacher: 'Cô Mến', period: '4-6', link: 'https://meet.google.com/gtq-zjrz-qqi' },
    { day: 5, subject: 'Hệ thống các ERP', teacher: 'Cô Quỳnh', period: '1-3', link: 'https://meet.google.com/ugd-jxwr-xed' },
    { day: 5, subject: 'Phân tích hoạt động kinh doanh', teacher: 'Cô Dung', period: '4-6', link: 'https://meet.google.com/pny-gzso-tag' },
    { day: 6, subject: 'Content Marketing', teacher: 'Thầy Long', period: '1-3', link: 'https://meet.google.com/jch-hkgb-ehb' },
    { day: 6, subject: 'Media', teacher: 'Thầy Trường', period: '4-6', link: 'https://meet.google.com/xbb-otgf-mfe' }
];



