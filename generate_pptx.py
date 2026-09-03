import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

# Color Palette: Clean & Minimalist, Bright, DMX Blue & Yellow
C_WHITE = RGBColor(255, 255, 255)
C_BG_LIGHT = RGBColor(248, 249, 250)     # #F8F9FA
C_DMX_BLUE = RGBColor(0, 114, 188)      # #0072BC
C_DMX_CYAN = RGBColor(0, 174, 239)      # #00AEEF
C_DMX_YELLOW = RGBColor(255, 204, 0)    # #FFCC00
C_NAVY = RGBColor(10, 37, 64)           # #0A2540
C_TEXT_MAIN = RGBColor(30, 41, 59)      # #1E293B
C_TEXT_MUTED = RGBColor(100, 116, 139)  # #64748B
C_BORDER = RGBColor(226, 232, 240)      # #E2E8F0

C_CARD_YELLOW = RGBColor(255, 252, 235) # #FFFCF0
C_CARD_BLUE = RGBColor(240, 249, 255)   # #F0F9FF
C_CARD_RED = RGBColor(254, 242, 242)    # #FEF2F2
C_CARD_GREEN = RGBColor(236, 253, 245)  # #ECFDF5

C_RED = RGBColor(239, 68, 68)
C_GREEN = RGBColor(16, 185, 129)

BLANK_LAYOUT = prs.slide_layouts[6]
IMG_DIR = "/Users/phuongpham/Downloads/QuocKhanh_2thang9/images"

def set_slide_bg(slide, color=C_BG_LIGHT):
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg.fill.solid()
    bg.fill.fore_color.rgb = color
    bg.line.fill.background()
    return bg

def add_header(slide, badge_text, title_text, subtitle_text=""):
    # Badge
    badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.4), Inches(3.2), Inches(0.35))
    badge.fill.solid()
    badge.fill.fore_color.rgb = C_DMX_BLUE
    badge.line.fill.background()
    p_b = badge.text_frame.paragraphs[0]
    p_b.text = "🎯 " + badge_text
    p_b.font.size = Pt(11)
    p_b.font.bold = True
    p_b.font.color.rgb = C_WHITE
    p_b.alignment = PP_ALIGN.CENTER

    # Title
    tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.8), Inches(11.7), Inches(0.95))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = title_text
    p.font.size = Pt(22)
    p.font.bold = True
    p.font.color.rgb = C_NAVY

    if subtitle_text:
        p2 = tf.add_paragraph()
        p2.text = subtitle_text
        p2.font.size = Pt(12)
        p2.font.color.rgb = C_TEXT_MUTED
        p2.space_before = Pt(2)

def add_card(slide, left, top, width, height, bg_color=C_WHITE, border_color=C_BORDER):
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    card.fill.solid()
    card.fill.fore_color.rgb = bg_color
    if border_color:
        card.line.color.rgb = border_color
        card.line.width = Pt(1.5)
    else:
        card.line.fill.background()
    return card

def add_visual_split(slide, img_name, key_items, card_bg=C_WHITE, card_border=C_BORDER, header_color=C_DMX_BLUE):
    # Left image
    img_path = os.path.join(IMG_DIR, img_name)
    if os.path.exists(img_path):
        slide.shapes.add_picture(img_path, Inches(0.8), Inches(1.85), Inches(5.8), Inches(4.9))

    # Right Card for punchy keywords
    card = add_card(slide, Inches(6.8), Inches(1.85), Inches(5.7), Inches(4.9), card_bg, card_border)
    tf = card.text_frame
    tf.word_wrap = True
    
    for i, item in enumerate(key_items):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        if isinstance(item, tuple):
            title, desc = item
            p.text = f"⚡ {title}"
            p.font.size = Pt(15)
            p.font.bold = True
            p.font.color.rgb = header_color
            p.space_after = Pt(2)
            
            p_desc = tf.add_paragraph()
            p_desc.text = desc
            p_desc.font.size = Pt(12)
            p_desc.font.color.rgb = C_TEXT_MAIN
            p_desc.space_after = Pt(10)
        else:
            p.text = f"• {item}"
            p.font.size = Pt(13)
            p.font.bold = True
            p.font.color.rgb = C_TEXT_MAIN
            p.space_after = Pt(8)

# ==================== SLIDE 1: COVER ====================
s1 = prs.slides.add_slide(BLANK_LAYOUT)
set_slide_bg(s1, C_WHITE)

img_m1 = os.path.join(IMG_DIR, "megaphone_magnet.jpg")
if os.path.exists(img_m1):
    s1.shapes.add_picture(img_m1, Inches(6.6), Inches(1.2), Inches(6.0), Inches(5.2))

# Left info
c1_box = add_card(s1, Inches(0.8), Inches(1.2), Inches(5.6), Inches(5.2), C_CARD_BLUE, C_DMX_BLUE)
tf1 = c1_box.text_frame
tf1.word_wrap = True

p = tf1.paragraphs[0]
p.text = "⚡ TEAM TCCM — MARKETING"
p.font.size = Pt(11)
p.font.bold = True
p.font.color.rgb = C_DMX_BLUE
p.space_after = Pt(8)

p2 = tf1.add_paragraph()
p2.text = "KÉO (INBOUND)\nvs ĐẨY (OUTBOUND)"
p2.font.size = Pt(28)
p2.font.bold = True
p2.font.color.rgb = C_NAVY
p2.space_after = Pt(6)

p3 = tf1.add_paragraph()
p3.text = "\"Yêu\" Tự Nguyện Hay \"Ép\" Hẹn Hò? 🎤"
p3.font.size = Pt(16)
p3.font.bold = True
p3.font.color.rgb = RGBColor(180, 100, 0)
p3.space_after = Pt(14)

bullets_s1 = [
    ("📢 ĐẨY (OUTBOUND)", "Trường phái 'Đi săn' · Chiếc loa phóng thanh · Mua chú ý"),
    ("🧲 KÉO (INBOUND)", "Trường phái 'Nuôi trồng' · Thỏi nam châm · Trao giải pháp"),
    ("🎯 CASE STUDY", "Chiến lược IMC bách chiến bách thắng của Điện máy Xanh")
]
for t, d in bullets_s1:
    p_t = tf1.add_paragraph()
    p_t.text = f"• {t}: {d}"
    p_t.font.size = Pt(11.5)
    p_t.font.color.rgb = C_TEXT_MAIN
    p_t.space_after = Pt(4)

# ==================== SLIDE 2: NGƯỜI TIÊU DÙNG LƯƠN KHƯỚC ====================
s2 = prs.slides.add_slide(BLANK_LAYOUT)
set_slide_bg(s2)
add_header(s2, "BỐI CẢNH", "KHI NGƯỜI TIÊU DÙNG NGÀY CÀNG \"LƯƠN KHƯỚC\" 🎯", "Quyền lực truyền thông thuộc về tay người dùng")

add_visual_split(s2, "ad_shield.jpg", [
    ("DỊCH CHUYỂN QUYỀN LỰC", "Khách hàng nắm quyền kiểm soát, chủ động né tránh quảng cáo ép buộc."),
    ("CƠ CHẾ PHÒNG THỦ", "Bấm 'Skip Ad' sau 5s · Bật Ad Blocker · Tắt tiếng (Mute) · Báo Spam."),
    ("HỘI CHỨNG 'AD FATIGUE'", "Dội bom tần suất cao + Giá trị rỗng ➔ Khách hàng chán ghét & tẩy chay."),
    ("BẪY TÀI CHÍNH CAC/CVR", "Chi phí mua khách (CAC) tăng vọt · Tỷ lệ chuyển đổi (CVR) về 0.")
], C_CARD_RED, C_RED, C_RED)

# ==================== SLIDE 3: OUTBOUND - LOA PHÓNG THANH ====================
s3 = prs.slides.add_slide(BLANK_LAYOUT)
set_slide_bg(s3)
add_header(s3, "VŨ KHÍ 1", "\"LOA PHÓNG THANH\" OUTBOUND: AI CŨNG NGHE, MẤY AI THẤU? 📢", "Chiến lược Đẩy (Push) — Dùng tiền mua sự chú ý tức thì")

add_visual_split(s3, "megaphone_magnet.jpg", [
    ("BẢN CHẤT CỐT LÕI", "Tiếp thị làm gián đoạn (Interruption Marketing) · Chủ động phát tán đại chúng."),
    ("MỤC TIÊU TỐI THƯỢNG", "Bao phủ nhanh (Mass Reach) · Chiếm lĩnh nhận diện (Top of Mind) · Kích cầu ngắn hạn."),
    ("VỊ TRÍ CHIẾN LƯỢC", "Lực lượng 'Săn bắn' chủ lực tại đỉnh phễu TOFU (Top of Funnel)."),
    ("CƠ CHẾ 'PAY-TO-PLAY'", "Chi tiền = Có hiển thị · Ngừng chi tiền = Mất hút hoàn toàn."),
    ("KÊNH THỰC THI CHÍNH", "TVC giờ vàng · Billboard ngã tư · YouTube Bumper Ads 6s · Display Ads.")
], C_CARD_YELLOW, C_DMX_YELLOW, RGBColor(180, 100, 0))

# ==================== SLIDE 4: INBOUND - NAM CHÂM ====================
s4 = prs.slides.add_slide(BLANK_LAYOUT)
set_slide_bg(s4)
add_header(s4, "VŨ KHÍ 2", "\"NAM CHÂM\" INBOUND: HỮU XẠ TỰ NHIÊN HƯƠNG 🧲", "Chiến lược Kéo (Pull) — Hút khách hàng bằng tri thức và giải pháp")

add_visual_split(s4, "megaphone_magnet.jpg", [
    ("BẢN CHẤT CỐT LÕI", "Tiếp thị được cho phép (Permission Marketing) · Khách chủ động tìm đến khi có nhu cầu."),
    ("MỤC TIÊU DÀI HẠN", "Xây dựng Niềm tin (Trust) · Lòng trung thành (Loyalty) · Tối ưu giá trị vòng đời (LTV)."),
    ("VỊ TRÍ CHIẾN LƯỢC", "Lực lượng 'Nuôi trồng' tại Giữa & Đáy phễu MOFU & BOFU."),
    ("TÀI SẢN SỐ VĨNH CỬU", "Đầu tư chất xám ban đầu ➔ Chi phí thu hút khách (CAC) giảm dần về 0."),
    ("KÊNH THỰC THI CHÍNH", "Hệ thống Blog SEO · Cẩm nang Ebook · Video DIY hướng dẫn · Podcast tri thức.")
], C_CARD_BLUE, C_DMX_BLUE, C_DMX_BLUE)

# ==================== SLIDE 5: SO SÁNH 1 (TRIẾT LÝ & TÂM LÝ) ====================
s5 = prs.slides.add_slide(BLANK_LAYOUT)
set_slide_bg(s5, C_WHITE)
add_header(s5, "SO SÁNH 10 TIÊU CHÍ (1/2)", "TRẬN CHIẾN VƯƠNG QUYỀN: TRIẾT LÝ & TÂM LÝ TIẾP CẬN ⚖️", "Tâm thế người dùng và mô thức truyền thông")

t_shape5 = s5.shapes.add_table(5, 3, Inches(0.8), Inches(1.85), Inches(11.7), Inches(5.0))
t5 = t_shape5.table
t5.columns[0].width = Inches(2.7)
t5.columns[1].width = Inches(4.5)
t5.columns[2].width = Inches(4.5)

h5 = ["Tiêu Chí So Sánh", "📢 OUTBOUND (ĐẨY)", "🧲 INBOUND (KÉO)"]
for col_idx, text in enumerate(h5):
    cell = t5.cell(0, col_idx)
    cell.text = text
    cell.fill.solid()
    cell.fill.fore_color.rgb = C_NAVY if col_idx == 0 else (C_DMX_YELLOW if col_idx == 1 else C_DMX_BLUE)
    p = cell.text_frame.paragraphs[0]
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = C_NAVY if col_idx == 1 else C_WHITE

data_s5 = [
    ("1. Cách tiếp cận\n(Approach)", "GÂY GIÁN ĐOẠN (Interruption)\nChen ngang khi khách đang giải trí", "ĐƯỢC CHO PHÉP (Permission)\nXuất hiện đúng lúc khách tìm kiếm"),
    ("2. Tâm thế khách hàng\n(Mindset)", "BỊ ĐỘNG (Passive)\nPhòng thủ, muốn bấm 'Skip Ad' ngay", "CHỦ ĐỘNG (Active)\nTìm kiếm giải pháp theo ý định (Intent)"),
    ("3. Cơ chế giao tiếp\n(Flow)", "ĐỘC THOẠI 1 CHIỀU\n'Tôi là số 1, mua sản phẩm ngay!'", "ĐỐI THOẠI 2 CHIỀU\nLắng nghe nỗi đau ➔ Trao giải pháp"),
    ("4. Giá trị cốt lõi\n(Value)", "KHOE TÍNH NĂNG & GIẢM GIÁ\nKêu gọi mua hàng gấp (Hard CTA)", "TRAO TRI THỨC & GIẢI PHÁP\nGiúp đỡ trước, bán hàng sau")
]
for r_idx, row in enumerate(data_s5, start=1):
    for c_idx, val in enumerate(row):
        cell = t5.cell(r_idx, c_idx)
        cell.text = val
        cell.fill.solid()
        cell.fill.fore_color.rgb = C_WHITE if r_idx % 2 == 0 else C_BG_LIGHT
        p = cell.text_frame.paragraphs[0]
        p.font.size = Pt(12)
        p.font.color.rgb = C_NAVY if c_idx == 0 else C_TEXT_MAIN
        if c_idx == 0:
            p.font.bold = True

# ==================== SLIDE 6: SO SÁNH 2 (HÀNH TRÌNH & TÀI CHÍNH) ====================
s6 = prs.slides.add_slide(BLANK_LAYOUT)
set_slide_bg(s6, C_WHITE)
add_header(s6, "SO SÁNH 10 TIÊU CHÍ (2/2)", "TRẬN CHIẾN VƯƠNG QUYỀN: HÀNH TRÌNH & THƯỚC ĐO TÀI CHÍNH 📊", "Cơ cấu chi phí và tính bền vững kinh doanh")

t_shape6 = s6.shapes.add_table(7, 3, Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.2))
t6 = t_shape6.table
t6.columns[0].width = Inches(2.7)
t6.columns[1].width = Inches(4.5)
t6.columns[2].width = Inches(4.5)

for col_idx, text in enumerate(h5):
    cell = t6.cell(0, col_idx)
    cell.text = text
    cell.fill.solid()
    cell.fill.fore_color.rgb = C_NAVY if col_idx == 0 else (C_DMX_YELLOW if col_idx == 1 else C_DMX_BLUE)
    p = cell.text_frame.paragraphs[0]
    p.font.size = Pt(12.5)
    p.font.bold = True
    p.font.color.rgb = C_NAVY if col_idx == 1 else C_WHITE

data_s6 = [
    ("5. Mục tiêu cốt lõi", "Tăng sales ngắn hạn, phủ rộng Mass Reach", "Nuôi dưỡng Loyalty, tối ưu giữ chân khách"),
    ("6. Vị trí trong phễu", "Đỉnh phễu TOFU (Săn bắt nhận diện)", "Giữa & Đáy phễu MOFU/BOFU (Nuôi trồng)"),
    ("7. Cơ chế chi phí", "'Pay-to-play' (Ngừng nạp tiền là biến mất)", "Định phí chất xám (CAC giảm dần về 0)"),
    ("8. Tính bền vững", "Ngắn hạn, phụ thuộc từng chiến dịch Ads", "Dài hạn, tích lũy thành Tài sản số vĩnh cửu"),
    ("9. Thước đo KPI", "Reach, Frequency, Impressions, CPM, CPC", "Organic Traffic, CVR, Time-on-site, LTV/CAC"),
    ("10. Định dạng chính", "TVC, Billboard, Banner hiển thị, Cold Call", "Blog SEO, Ebook, Video DIY, Podcast")
]
for r_idx, row in enumerate(data_s6, start=1):
    for c_idx, val in enumerate(row):
        cell = t6.cell(r_idx, c_idx)
        cell.text = val
        cell.fill.solid()
        cell.fill.fore_color.rgb = C_WHITE if r_idx % 2 == 0 else C_BG_LIGHT
        p = cell.text_frame.paragraphs[0]
        p.font.size = Pt(11)
        p.font.color.rgb = C_NAVY if c_idx == 0 else C_TEXT_MAIN
        if c_idx == 0:
            p.font.bold = True

# ==================== SLIDE 7: CASE STUDY ĐMX OUTBOUND ====================
s7 = prs.slides.add_slide(BLANK_LAYOUT)
set_slide_bg(s7)
add_header(s7, "CASE STUDY ĐMX (1/2)", "CÚ NỔ 2016: ĐỘI QUÂN NGƯỜI XANH \"TẤN CÔNG\" GIÁC QUAN 🔵🟢", "Dùng Outbound 'Dị' để thống trị Top of Mind tức thì")

add_visual_split(s7, "dmx_tvc.jpg", [
    ("BỐI CẢNH 2016", "Đại dương đỏ điện máy khốc liệt · ĐMX là tân binh cần bứt phá tức thì."),
    ("CHIẾN THUẬT DỘI BOM", "Đội quân người xanh nhảy múa · Điệp khúc lặp lại bắt tai: 'Bạn muốn mua tivi? Đến ĐMX!'."),
    ("NGHỆ THUẬT 'DỊ'", "Chấp nhận bị chê để xuyên thủng rào cản nhận thức của khách hàng."),
    ("KẾT QUẢ ĐỈNH PHỄU", "150M+ views · Top 1 Brand Recall · Chiếm trọn vị trí #1 Top of Mind."),
    ("SỨ MỆNH HOÀN THÀNH", "Kéo hàng triệu người tò mò đứng 'trước cửa hàng' của Điện máy Xanh!")
], C_CARD_YELLOW, C_DMX_YELLOW, RGBColor(180, 100, 0))

# ==================== SLIDE 8: CASE STUDY ĐMX INBOUND ====================
s8 = prs.slides.add_slide(BLANK_LAYOUT)
set_slide_bg(s8)
add_header(s8, "CASE STUDY ĐMX (2/2)", "ĐẾ CHẾ SEO \"THẦM LẶNG\": KHI ĐMX TRỞ THÀNH BÁCH KHOA TOÀN THƯ 🕵️‍♂️", "Dùng Inbound 'Trí' giải quyết nỗi đau và chốt đơn tại đáy phễu BOFU")

add_visual_split(s8, "dmx_blog.jpg", [
    ("ĐẾ CHẾ >100.000 BÀI SEO", "Thư viện hướng dẫn tự sửa chữa, so sánh tủ lạnh, máy giặt, điều hòa."),
    ("BẮT TRỌN SEARCH INTENT", "Xuất hiện đúng lúc khách gặp sự cố: 'Máy giặt kêu to phải làm sao?'."),
    ("VỊ THẾ CHUYÊN GIA", "Cung cấp cẩm nang miễn phí ➔ Xây dựng Niềm tin (Trust) tuyệt đối."),
    ("CHỐT ĐƠN TỰ NHIÊN", "Cài cắm khéo léo nút 'Mua máy mới chính hãng' ngay dưới bài viết."),
    ("SỨ MỆNH HOÀN THÀNH", "Mời khách 'vào nhà, rót trà thấu hiểu và thuyết phục tự nguyện rút ví'!")
], C_CARD_BLUE, C_DMX_BLUE, C_DMX_BLUE)

# ==================== SLIDE 9: CÔNG THỨC IMC ====================
s9 = prs.slides.add_slide(BLANK_LAYOUT)
set_slide_bg(s9)
add_header(s9, "TỔNG KẾT IMC", "BẮT TAY TẠO LỊCH SỬ: CÔNG THỨC IMC \"BÁCH CHIẾN BÁCH THẮNG\" 🤝", "Đẩy mua ánh nhìn (TOFU) — Kéo chiếm trọn trái tim (BOFU)")

add_visual_split(s9, "imc_infinity.jpg", [
    ("CÔNG THỨC BẤT BẠI", "Dùng 'DỊ' mở đường (Outbound) + Dùng 'TRÍ' chốt sale (Inbound)."),
    ("OUTBOUND (ĐỈNH PHỄU)", "Mua lấy ánh nhìn chú ý ban đầu · Lôi kéo khách hàng đến trước cửa."),
    ("INBOUND (ĐÁY PHỄU)", "Giải quyết nỗi đau · Xây dựng niềm tin · Chốt đơn ngọt ngào."),
    ("TỐI ƯU HÓA TÀI CHÍNH", "Kéo giảm CAC về mức tối thiểu · Tăng vọt CVR · Tối đa hóa LTV.")
], C_CARD_BLUE, C_DMX_BLUE, C_DMX_BLUE)

# ==================== SLIDE 10: MINH & HÀ ====================
s10 = prs.slides.add_slide(BLANK_LAYOUT)
set_slide_bg(s10)
add_header(s10, "GÓC NHÌN TÁN GÁI HỌC", "CHUYỆN TÌNH MINH & HÀ VÀ SAI LẦM ĐỐT TIỀN CỦA OUTBOUND 💔", "Ẩn dụ hài hước về mối quan hệ giữa Thương hiệu và Khách hàng")

add_visual_split(s10, "minh_ha.jpg", [
    ("NHÂN VẬT GIẢ ĐỊNH", "Minh = Thương hiệu · Hà = Khách hàng mục tiêu."),
    ("CHIẾN THUẬT CỦA MINH", "Chỉ dùng Outbound cực đoan: Cầm loa hét, nhắn tin spam, chặn đường ép yêu."),
    ("ẢO TƯỞNG SỨC MẠNH", "Nghĩ rằng xuất hiện tần suất càng dày thì đối phương sẽ tự động yêu."),
    ("LỖ HỔNG CHÍ MẠNG", "Thiếu hoàn toàn 'Reason to Believe' (Lý do để tin yêu) & sự thấu hiểu."),
    ("KẾT QUẢ", "Hà bịt tai khó chịu, chuẩn bị kích hoạt cơ chế phòng vệ!")
], C_CARD_RED, C_RED, C_RED)

# ==================== SLIDE 11: AD FATIGUE ====================
s11 = prs.slides.add_slide(BLANK_LAYOUT)
set_slide_bg(s11)
add_header(s11, "CẢNH BÁO TÂM LÝ", "KHI MINH SPOIL ĐỜI HÀ: TẦN SUẤT CAO, GIÁ TRỊ RỖNG & AD FATIGUE 🚨", "Cơ chế phòng vệ tự nhiên trước sự làm phiền")

add_visual_split(s11, "ad_shield.jpg", [
    ("CÔNG THỨC THẤT BẠI", "Tần suất cực cao (High Frequency) + Giá trị rỗng (Zero Value)."),
    ("TÂM LÝ KHÁCH HÀNG", "Từ tò mò ban đầu ➔ Bực bội vì không gian riêng tư bị xâm phạm."),
    ("HỘI CHỨNG AD FATIGUE", "Hà dựng lên bức tường phòng thủ kiên cố để tự bảo vệ."),
    ("HÀNH ĐỘNG PHẢN KHÁNG", "Bấm 'Block This Caller' (Chặn số) · Báo Spam · Cài Ad Blocker."),
    ("GẮN MÁC THƯƠNG HIỆU", "Minh chính thức trở thành 'Kẻ quấy rối' (Spammer) đáng ghét!")
], C_CARD_RED, C_RED, C_RED)

# ==================== SLIDE 12: ROI SỤP ĐỔ ====================
s12 = prs.slides.add_slide(BLANK_LAYOUT)
set_slide_bg(s12)
add_header(s12, "THẢM HỌA TÀI CHÍNH", "HẬU QUẢ NHÃN TIỀN: KHI HÀ BÁO CÁO SPAM VÀ ROI SỤP ĐỔ VỀ 0 📉", "Bi kịch 'Đốt tiền mua nhận diện để đối thủ chốt sale'")

# 3 big metric cards
c12_1 = add_card(s12, Inches(0.8), Inches(1.85), Inches(3.7), Inches(4.9), C_CARD_RED, C_RED)
tf = c12_1.text_frame
tf.word_wrap = True
p = tf.paragraphs[0]
p.text = "Awareness 10/10\nTRUST = 0"
p.font.size = Pt(20)
p.font.bold = True
p.font.color.rgb = C_RED
p.space_after = Pt(10)
p_d = tf.add_paragraph()
p_d.text = "Hà nhớ rõ tên Minh nhưng không hề có niềm tin. Thiếu Reason to Believe nên không thể phát sinh tình cảm."
p_d.font.size = Pt(13)
p_d.font.color.rgb = C_TEXT_MAIN

c12_2 = add_card(s12, Inches(4.8), Inches(1.85), Inches(3.7), Inches(4.9), C_CARD_RED, C_RED)
tf = c12_2.text_frame
tf.word_wrap = True
p = tf.paragraphs[0]
p.text = "MẤT KHÁCH\nVÀO ĐỐI THỦ"
p.font.size = Pt(20)
p.font.bold = True
p.font.color.rgb = C_RED
p.space_after = Pt(10)
p_d = tf.add_paragraph()
p_d.text = "Khi Hà buồn (phát sinh nhu cầu), Hà chọn chàng trai Inbound sâu sắc biết lắng nghe thay vì kẻ cầm loa gào thét."
p_d.font.size = Pt(13)
p_d.font.color.rgb = C_TEXT_MAIN

c12_3 = add_card(s12, Inches(8.8), Inches(1.85), Inches(3.7), Inches(4.9), C_CARD_RED, C_RED)
tf = c12_3.text_frame
tf.word_wrap = True
p = tf.paragraphs[0]
p.text = "ROI = 0%\nCAC TĂNG VỌT"
p.font.size = Pt(20)
p.font.bold = True
p.font.color.rgb = C_RED
p.space_after = Pt(10)
p_d = tf.add_paragraph()
p_d.text = "Minh chi tiền giáo dục nhận thức nhưng đối thủ mới là người chốt đơn! CVR = 0 tròn trĩnh."
p_d.font.size = Pt(13)
p_d.font.color.rgb = C_TEXT_MAIN

# ==================== SLIDE 13: INBOUND GIẢI CỨU MINH ====================
s13 = prs.slides.add_slide(BLANK_LAYOUT)
set_slide_bg(s13)
add_header(s13, "SỰ CỨU RỖI INBOUND", "INBOUND GIẢI CỨU MINH: TRỞ THÀNH \"CHUYÊN GIA\" ĐÚNG LÚC HÀ CẦN 🛠️", "Trao đi giải pháp tháo gỡ nỗi đau để nhận lại tình yêu tự nguyện")

add_visual_split(s13, "minh_inbound.jpg", [
    ("SỰ THỨC TỈNH", "Vứt loa phóng thanh vào sọt rác ➔ Chuyển sang nghiên cứu nỗi đau của Hà."),
    ("GIẢI CỨU ĐÚNG LÚC", "Khi laptop của Hà bị lỗi sập nguồn, Minh gửi cẩm nang tự sửa máy tính chi tiết."),
    ("VỊ THẾ CHUYÊN GIA", "Trao giải pháp miễn phí ➔ Tạo dựng Niềm tin (Trust) và sự biết ơn sâu sắc."),
    ("CHỐT ĐƠN TỰ NGUYỆN", "Khi niềm tin chạm đỉnh, Hà tự nguyện mở lòng hẹn hò cùng Minh!")
], C_CARD_GREEN, C_GREEN, C_GREEN)

# ==================== SLIDE 14: BÀI HỌC XƯƠNG MÁU ====================
s14 = prs.slides.add_slide(BLANK_LAYOUT)
set_slide_bg(s14, C_WHITE)
add_header(s14, "ĐÚC KẾT TRIẾT LÝ", "BÀI HỌC XƯƠNG MÁU: ĐỪNG BÁN CÁI MÌNH CÓ, HÃY TRAO THỨ KHÁCH TÌM 💡", "Cán cân thăng bằng hoàn hảo giữa Sinh tồn và Phát triển bền vững")

add_visual_split(s14, "imc_infinity.jpg", [
    ("TRIẾT LÝ CỐT LÕI", "Đừng tiếp cận như một kẻ quấy rối · Hãy đồng hành như một người bạn tri kỷ."),
    ("OUTBOUND = SINH TỒN", "Mua ánh nhìn đầu tiên giữa thị trường ồn ào · Kéo khách đến trước cửa."),
    ("INBOUND = PHÁT TRIỂN", "Chiếm trọn niềm tin & ví tiền bằng giá trị thực · Mời khách vào nhà & gắn kết trọn đời."),
    ("CÔNG THỨC TỐI THƯỢNG", "Sự tích hợp nhuần nhuyễn IMC chính là DNA của mọi chiến dịch Marketing thành công!")
], C_CARD_BLUE, C_DMX_BLUE, C_DMX_BLUE)

# ==================== SLIDE 15: Q&A ====================
s15 = prs.slides.add_slide(BLANK_LAYOUT)
set_slide_bg(s15, C_WHITE)

tb15 = s15.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.8), Inches(4.5), Inches(0.45))
tb15.fill.solid()
tb15.fill.fore_color.rgb = C_CARD_YELLOW
tb15.line.color.rgb = C_DMX_YELLOW
p = tb15.text_frame.paragraphs[0]
p.text = "🌟 PHIÊN THẢO LUẬN & PHẢN BIỆN"
p.font.size = Pt(12)
p.font.bold = True
p.font.color.rgb = RGBColor(180, 100, 0)
p.alignment = PP_ALIGN.CENTER

tb_qa = s15.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(11.7), Inches(1.6))
tf_qa = tb_qa.text_frame
p_qa = tf_qa.paragraphs[0]
p_qa.text = "HỎI ĐI NGẠI CHI! (Q & A)"
p_qa.font.size = Pt(38)
p_qa.font.bold = True
p_qa.font.color.rgb = C_DMX_BLUE

p_qa_sub = tf_qa.add_paragraph()
p_qa_sub.text = "Xin chân thành cảm ơn Thầy Cô và các bạn học viên đã chú ý theo dõi bài thuyết trình của TEAM TCCM!"
p_qa_sub.font.size = Pt(15)
p_qa_sub.font.color.rgb = C_TEXT_MUTED

c15 = add_card(s15, Inches(0.8), Inches(3.4), Inches(11.7), Inches(3.4), C_CARD_BLUE, C_DMX_BLUE)
tf15 = c15.text_frame
tf15.word_wrap = True

p_r = tf15.paragraphs[0]
p_r.text = "📚 TÀI LIỆU THAM KHẢO CHÍNH THỐNG (ACADEMIC REFERENCES)"
p_r.font.size = Pt(14)
p_r.font.bold = True
p_r.font.color.rgb = C_DMX_BLUE
p_r.space_after = Pt(8)

refs_15 = [
    "1. Philip Kotler & Kevin Lane Keller (2022) — Marketing Management (16th Global Edition), Pearson Education.",
    "2. Seth Godin (1999) — Permission Marketing: Turning Strangers into Friends and Friends into Customers, Simon & Schuster.",
    "3. HubSpot Research (2024) — The State of Inbound Marketing & Lead Generation Annual Report.",
    "4. SimilarWeb & MWG Investor Relations (2023 - 2024) — Báo cáo phân tích lưu lượng trực tuyến chuỗi Điện Máy Xanh."
]
for r in refs_15:
    pb = tf15.add_paragraph()
    pb.text = r
    pb.font.size = Pt(12)
    pb.font.color.rgb = C_TEXT_MAIN
    pb.space_after = Pt(4)

out_file = "/Users/phuongpham/Downloads/BTVN_TEAM_TCCM.pptx"
prs.save(out_file)
print(f"Saved punchy visual 15-slide presentation to: {out_file}")
