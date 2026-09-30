/**
 * ================================================================================
 * GOOGLE APPS SCRIPT - HỆ THỐNG QUẢN LÝ THU QUỸ LỚP & THÔNG BÁO TELEGRAM
 * ================================================================================
 *
 * HƯỚNG DẪN CÀI ĐẶT NHANH:
 *
 * 1. Mở https://sheets.new → Tạo Google Sheet mới, đặt tên: "QUY_LOP_DATABASE".
 * 2. Vào menu "Tiện ích mở rộng" (Extensions) → "Apps Script".
 * 3. Xóa code cũ → Dán toàn bộ file này vào → Nhấn Ctrl+S (Cmd+S) lưu lại.
 * 4. Điền Token Bot Telegram, Chat ID, Tên ngân hàng và Email alert vào PHẦN CẤU HÌNH.
 * 5. Chọn hàm "setupDatabase" → Bấm "▷ Chạy" (Run) → Cấp quyền khi hệ thống yêu cầu.
 * 6. Bấm "Triển khai" (Deploy) → "Triển khai mới" (New Deployment):
 *      - Loại: Ứng dụng web (Web App)
 *      - Thực thi dưới dạng: Tôi (Me)
 *      - Ai có quyền truy cập: Bất kỳ ai (Anyone)
 *      → Bấm "Triển khai" → Sao chép URL Web App dán vào js/data.js trên website.
 * 7. Cài 2 Trigger theo hướng dẫn cuối file:
 *      - scanBienDongSoDu: Mỗi 1 phút
 *      - guiBaoCaoTongHop: Hàng ngày lúc 20h
 *
 * ================================================================================
 * LUỒNG VẬN HÀNH:
 *
 *   [Sinh viên quét QR chuyển khoản]
 *          │
 *          ▼
 *   [Ngân hàng gửi email biến động số dư về Gmail của bạn]
 *          │
 *          ▼
 *   [Trigger "scanBienDongSoDu" chạy mỗi 1 phút]
 *          │ Quét inbox tìm email từ ngân hàng
 *          │ Trích nội dung chuyển khoản (VD: "NGUYEN HOANG AN 240101 QL1")
 *          │ Đối soát: tìm đơn PENDING có nội dung CK khớp
 *          ▼
 *   [Nếu khớp → Cập nhật trạng thái "ĐÃ XÁC MINH" + Tô xanh trong Sheet]
 *          │
 *          ▼
 *   [Bắn Telegram thông báo xác nhận tiền đã vào tài khoản thực sự]
 *
 * ================================================================================
 */

// ═══════════════════════════════════════════════════════════════════════════════
// PHẦN 1: CẤU HÌNH (BẠN CẦN ĐIỀN THÔNG TIN CỦA BẠN VÀO ĐÂY)
// ═══════════════════════════════════════════════════════════════════════════════

const CFG = {
  // Telegram Bot nhận thông báo
  TELEGRAM_BOT_TOKEN: "8783402263:AAHBLBGamMK4IRaYpW3tRrc719T4FREMRYg",  // ← Token bot
  TELEGRAM_CHAT_ID: "-5515040883",                                       // ← Chat ID nhóm

  // Email cảnh báo biến động số dư từ ngân hàng
  // Mỗi ngân hàng gửi email từ 1 địa chỉ khác nhau:
  //   ACB:  mailalert@acb.com.vn
  //   MB:   biendongsodu@mbbank.com.vn
  //   VCB:  alert@vietcombank.com.vn
  //   TPB:  ib@tpb.com.vn
  //   BIDV: smartbanking@bidv.com.vn
  //   VPB:  alerts@vpbank.com.vn
  BANK_ALERT_EMAIL: "biendongsodu@mbbank.com.vn",  // ← Email alert ngân hàng của bạn
  BANK_NAME: "MBBank",                             // ← Tên ngân hàng (hiển thị)

  // Danh sách Mã Quỹ hợp lệ (phải khớp với js/data.js trên Website)
  FUND_CODES: ["QL1", "AOLOP", "DANGOAI"],

  // Tên lớp (để hiển thị trong Telegram)
  CLASS_NAME: "Lớp K24 - Đại Học Hải Phòng"
};


// ═══════════════════════════════════════════════════════════════════════════════
// PHẦN 2: KHỞI TẠO DATABASE TRÊN GOOGLE SHEET (CHẠY 1 LẦN ĐẦU TIÊN)
// ═══════════════════════════════════════════════════════════════════════════════

function setupDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // --- Sheet 1: DanhSachLop ---
  let sheetStudents = ss.getSheetByName("DanhSachLop");
  if (!sheetStudents) sheetStudents = ss.insertSheet("DanhSachLop");
  sheetStudents.clear();

  const studentHeaders = ["STT", "Mã SV", "Họ Và Tên", "Giới Tính"];
  CFG.FUND_CODES.forEach(code => studentHeaders.push(code));
  sheetStudents.getRange(1, 1, 1, studentHeaders.length).setValues([studentHeaders]);
  sheetStudents.getRange(1, 1, 1, studentHeaders.length)
    .setBackground("#1e293b").setFontColor("#ffffff").setFontWeight("bold").setHorizontalAlignment("center");

  // Dữ liệu mẫu 5 bạn đầu
  const sampleRow = (stt, id, name, gender) => {
    const row = [stt, id, name, gender];
    CFG.FUND_CODES.forEach(() => row.push("CHƯA ĐÓNG"));
    return row;
  };
  const sampleData = [
    sampleRow(1, "240101", "Nguyễn Hoàng An", "Nam"),
    sampleRow(2, "240102", "Trần Tuấn Anh", "Nam"),
    sampleRow(3, "240103", "Lê Ngọc Ánh", "Nữ"),
    sampleRow(4, "240104", "Phạm Gia Bảo", "Nam"),
    sampleRow(5, "240105", "Vũ Thị Kim Chi", "Nữ")
  ];
  sheetStudents.getRange(2, 1, sampleData.length, studentHeaders.length).setValues(sampleData);
  sheetStudents.autoResizeColumns(1, studentHeaders.length);

  // --- Sheet 2: LichSuNop ---
  let sheetHistory = ss.getSheetByName("LichSuNop");
  if (!sheetHistory) sheetHistory = ss.insertSheet("LichSuNop");
  sheetHistory.clear();
  const histHeaders = ["Thời Gian Đặt", "Mã SV", "Họ Tên", "Khoản Thu", "Số Tiền",
                        "Nội Dung CK Chuẩn", "Trạng Thái", "Thời Gian Xác Minh", "Ghi Chú"];
  sheetHistory.getRange(1, 1, 1, histHeaders.length).setValues([histHeaders]);
  sheetHistory.getRange(1, 1, 1, histHeaders.length)
    .setBackground("#0f766e").setFontColor("#ffffff").setFontWeight("bold").setHorizontalAlignment("center");
  sheetHistory.autoResizeColumns(1, histHeaders.length);

  Logger.log("✅ Đã khởi tạo xong Database Quỹ Lớp! Gồm 2 Sheet: DanhSachLop, LichSuNop.");
}


// ═══════════════════════════════════════════════════════════════════════════════
// PHẦN 3: WEB API — WEBSITE GỌI VÀO ĐÂY ĐỂ LẤY TRẠNG THÁI & GHI NHẬN NỘP QUỸ
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * doGet: Website gọi để lấy danh sách sinh viên + trạng thái đóng quỹ
 */
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("DanhSachLop");
    if (!sheet) {
      return _jsonResponse({ success: false, error: "Sheet DanhSachLop chưa tồn tại." });
    }

    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const fundCols = {};
    for (let c = 4; c < headers.length; c++) {
      fundCols[headers[c]] = c;
    }

    const students = [];
    for (let r = 1; r < data.length; r++) {
      const row = data[r];
      if (!row[1]) continue;

      const paidFunds = [];
      for (const [fundCode, colIdx] of Object.entries(fundCols)) {
        if (row[colIdx] === "ĐÃ ĐÓNG" || row[colIdx] === "ĐÃ XÁC MINH") {
          paidFunds.push(fundCode);
        }
      }

      students.push({
        studentId: String(row[1]),
        name: String(row[2]),
        gender: String(row[3]),
        paidFunds: paidFunds
      });
    }

    return _jsonResponse({ success: true, students: students });
  } catch (err) {
    return _jsonResponse({ success: false, error: err.toString() });
  }
}

/**
 * doPost: Website gửi lên khi sinh viên bấm "Tôi đã chuyển khoản"
 * → Ghi vào LichSuNop với trạng thái "CHỜ XÁC MINH"
 * → Khóa tên trong DanhSachLop (đổi thành "ĐÃ ĐÓNG")
 * → Bắn Telegram thông báo "CHỜ XÁC MINH NGÂN HÀNG"
 */
function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const { studentId, studentName, fundId, fundTitle, fundCode, amount, transferContent } = postData;

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetStudents = ss.getSheetByName("DanhSachLop");
    const sheetHistory = ss.getSheetByName("LichSuNop");

    // 1. Tìm sinh viên & Kiểm tra đã đóng chưa
    const studentData = sheetStudents.getDataRange().getValues();
    const headers = studentData[0];
    const fundColIdx = headers.indexOf(fundCode || fundId);

    if (fundColIdx === -1) {
      return _jsonResponse({ success: false, message: "Mã quỹ không tồn tại trong Sheet!" });
    }

    let foundRow = -1;
    for (let r = 1; r < studentData.length; r++) {
      if (String(studentData[r][1]) === String(studentId)) {
        foundRow = r + 1;
        if (studentData[r][fundColIdx] === "ĐÃ ĐÓNG" || studentData[r][fundColIdx] === "ĐÃ XÁC MINH") {
          return _jsonResponse({ success: false, alreadyPaid: true, message: "Sinh viên đã đóng khoản này rồi!" });
        }
        break;
      }
    }

    if (foundRow === -1) {
      return _jsonResponse({ success: false, message: "Mã SV không có trong danh sách lớp!" });
    }

    // 2. Khóa tên ngay trên DanhSachLop → ĐÃ ĐÓNG (chờ xác minh ngân hàng)
    sheetStudents.getRange(foundRow, fundColIdx + 1)
      .setValue("ĐÃ ĐÓNG")
      .setBackground("#fef9c3")    // Vàng nhạt = đang chờ xác minh
      .setFontColor("#92400e");

    // 3. Ghi lịch sử với trạng thái "CHỜ XÁC MINH"
    const nowStr = Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");
    sheetHistory.appendRow([
      nowStr,                      // Thời gian đặt
      studentId,                   // Mã SV
      studentName,                 // Họ tên
      fundTitle,                   // Tên khoản thu
      amount,                      // Số tiền
      transferContent,             // Nội dung CK chuẩn (để đối soát)
      "CHỜ XÁC MINH",             // Trạng thái (sẽ đổi khi quét được email banking)
      "",                          // Thời gian xác minh (sẽ điền khi quét email)
      "Bấm xác nhận trên Web"     // Ghi chú
    ]);

    // Tô màu vàng dòng mới (CHỜ XÁC MINH)
    const lastRow = sheetHistory.getLastRow();
    sheetHistory.getRange(lastRow, 7).setBackground("#fef9c3").setFontColor("#92400e").setFontWeight("bold");

    // 4. Bắn Telegram báo "CHỜ XÁC MINH"
    _sendTelegram(
      `📋 <b>SINH VIÊN BẤM XÁC NHẬN — CHỜ XÁC MINH NGÂN HÀNG</b>\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `👤 <b>Họ tên:</b> ${studentName}\n` +
      `🆔 <b>Mã SV:</b> <code>${studentId}</code>\n` +
      `📂 <b>Quỹ:</b> ${fundTitle}\n` +
      `💰 <b>Số tiền:</b> ${_formatMoney(amount)}\n` +
      `📝 <b>Nội dung CK:</b> <code>${transferContent}</code>\n` +
      `⏰ <b>Thời gian:</b> ${nowStr}\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `⏳ <i>Tên đã KHÓA trên web. Đang chờ tiền vào tài khoản...</i>`
    );

    return _jsonResponse({ success: true, message: "Ghi nhận thành công! Đang chờ xác minh ngân hàng." });

  } catch (err) {
    return _jsonResponse({ success: false, error: err.toString() });
  }
}


// ═══════════════════════════════════════════════════════════════════════════════
// PHẦN 4: QUÉT EMAIL BIẾN ĐỘNG SỐ DƯ NGÂN HÀNG & ĐỐI SOÁT TỰ ĐỘNG
// ═══════════════════════════════════════════════════════════════════════════════
// CÀI TRIGGER: Chạy mỗi 1 phút. Vào menu "Bộ kích hoạt" (Triggers) →
//   Thêm bộ kích hoạt mới → Hàm: scanBienDongSoDu → Theo thời gian → Phút → Mỗi 1 phút

/**
 * Quét email ngân hàng trong 2 phút gần nhất → Tìm nội dung CK khớp đơn → Xác minh
 */
function scanBienDongSoDu() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetHistory = ss.getSheetByName("LichSuNop");
  const sheetStudents = ss.getSheetByName("DanhSachLop");
  if (!sheetHistory || !sheetStudents) return;

  // Lấy tất cả đơn "CHỜ XÁC MINH" đang pending
  const historyData = sheetHistory.getDataRange().getValues();
  const pendingOrders = [];
  for (let r = 1; r < historyData.length; r++) {
    if (historyData[r][6] === "CHỜ XÁC MINH") {
      pendingOrders.push({
        row: r + 1,                           // 1-indexed
        studentId: String(historyData[r][1]),
        studentName: String(historyData[r][2]),
        fundTitle: String(historyData[r][3]),
        amount: Number(historyData[r][4]),
        transferContent: String(historyData[r][5]).toUpperCase().trim()
      });
    }
  }

  // Không có đơn nào đang chờ → Thoát ngay
  if (pendingOrders.length === 0) return;

  // Quét inbox email từ ngân hàng trong vòng 5 phút gần nhất (an toàn hơn 2 phút)
  const searchQuery = `from:${CFG.BANK_ALERT_EMAIL} newer_than:5m`;
  let threads;
  try {
    threads = GmailApp.search(searchQuery, 0, 20);
  } catch (e) {
    Logger.log("Lỗi quét Gmail: " + e.toString());
    return;
  }

  if (threads.length === 0) return;

  // Duyệt từng email tìm nội dung chuyển khoản
  for (const thread of threads) {
    const messages = thread.getMessages();
    for (const msg of messages) {
      // Lấy nội dung plaintext + HTML của email
      const body = (msg.getPlainBody() || "") + " " + (msg.getBody() || "");
      const bodyUpper = body.toUpperCase();

      // Kiểm tra đây có phải là email thông báo NHẬN TIỀN (credit) không
      // Các ngân hàng thường ghi: "Số tiền ghi có", "Credit", "+", "cộng", "nhận được"
      const isCreditEmail = bodyUpper.includes("GHI CÓ") ||
                            bodyUpper.includes("GHI CO") ||
                            bodyUpper.includes("CREDIT") ||
                            bodyUpper.includes("NHẬN ĐƯỢC") ||
                            bodyUpper.includes("NHAN DUOC") ||
                            bodyUpper.includes("TIỀN VÀO") ||
                            bodyUpper.includes("TIEN VAO") ||
                            bodyUpper.includes("CỘNG") ||
                            bodyUpper.includes("+");

      if (!isCreditEmail) continue;

      // Đối soát từng đơn pending: nội dung CK có nằm trong body email không?
      for (const order of pendingOrders) {
        // Nội dung CK đã được chuẩn hóa trên web: "NGUYEN HOANG AN 240101 QL1"
        // Email ngân hàng thường chứa trọn vẹn chuỗi này (hoặc bỏ dấu cách thừa)
        const contentToFind = order.transferContent;

        // Tìm kiếm linh hoạt: thử chính xác trước, sau đó thử bỏ dấu cách kép
        const found = bodyUpper.includes(contentToFind) ||
                      bodyUpper.includes(contentToFind.replace(/\s+/g, " "));

        if (found) {
          // ✅ KHỚP! Xác minh đơn này
          const verifyTime = Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");

          // Cập nhật LichSuNop: CHỜ XÁC MINH → ĐÃ XÁC MINH
          sheetHistory.getRange(order.row, 7).setValue("ĐÃ XÁC MINH")
            .setBackground("#dcfce7").setFontColor("#15803d").setFontWeight("bold");
          sheetHistory.getRange(order.row, 8).setValue(verifyTime);
          sheetHistory.getRange(order.row, 9).setValue("Ngân hàng đã xác nhận tiền vào TK");

          // Cập nhật DanhSachLop: ĐÃ ĐÓNG (vàng) → ĐÃ XÁC MINH (xanh lá)
          _updateStudentStatus(sheetStudents, order.studentId, order.transferContent);

          // Bắn Telegram xác nhận tiền thật sự đã vào
          _sendTelegram(
            `✅ <b>TIỀN ĐÃ VÀO TÀI KHOẢN — XÁC MINH THÀNH CÔNG!</b>\n` +
            `━━━━━━━━━━━━━━━━━━━\n` +
            `👤 <b>Họ tên:</b> ${order.studentName}\n` +
            `🆔 <b>Mã SV:</b> <code>${order.studentId}</code>\n` +
            `📂 <b>Quỹ:</b> ${order.fundTitle}\n` +
            `💰 <b>Số tiền:</b> ${_formatMoney(order.amount)}\n` +
            `📝 <b>Nội dung CK:</b> <code>${order.transferContent}</code>\n` +
            `🏦 <b>Ngân hàng:</b> ${CFG.BANK_NAME}\n` +
            `⏰ <b>Xác minh lúc:</b> ${verifyTime}\n` +
            `━━━━━━━━━━━━━━━━━━━\n` +
            `🎉 <i>Giao dịch đã được đối soát tự động từ email ${CFG.BANK_NAME}!</i>`
          );

          Logger.log("✅ Xác minh thành công: " + order.transferContent);
        }
      }
    }
  }
}

/**
 * Cập nhật trạng thái sinh viên trong DanhSachLop khi xác minh xong
 */
function _updateStudentStatus(sheet, studentId, transferContent) {
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  // Xác định Mã Quỹ từ nội dung CK (phần cuối cùng sau dấu cách)
  const parts = transferContent.trim().split(/\s+/);
  const fundCode = parts[parts.length - 1]; // VD: "QL1", "AOLOP", "DANGOAI"
  const fundColIdx = headers.indexOf(fundCode);

  if (fundColIdx === -1) return;

  for (let r = 1; r < data.length; r++) {
    if (String(data[r][1]) === String(studentId)) {
      sheet.getRange(r + 1, fundColIdx + 1)
        .setValue("ĐÃ XÁC MINH")
        .setBackground("#dcfce7")    // Xanh lá nhạt = Tiền đã vào thật
        .setFontColor("#15803d")
        .setFontWeight("bold");
      break;
    }
  }
}


// ═══════════════════════════════════════════════════════════════════════════════
// PHẦN 5: BÁO CÁO TỔNG HỢP CUỐI NGÀY (Gửi Telegram lúc 20h mỗi tối)
// ═══════════════════════════════════════════════════════════════════════════════
// CÀI TRIGGER: Hàng ngày, 20h–21h → Hàm: guiBaoCaoTongHop

function guiBaoCaoTongHop() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("DanhSachLop");
  if (!sheet) return;

  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  let report = `📊 <b>BÁO CÁO THU QUỸ LỚP CUỐI NGÀY</b>\n`;
  report += `━━━━━━━━━━━━━━━━━━━\n`;
  report += `🏫 <b>${CFG.CLASS_NAME}</b>\n`;
  report += `📅 ${Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy")}\n\n`;

  const totalStudents = data.length - 1;

  for (let c = 4; c < headers.length; c++) {
    const fundCode = headers[c];
    let paidCount = 0;
    let verifiedCount = 0;
    let unpaidCount = 0;

    for (let r = 1; r < data.length; r++) {
      const val = String(data[r][c]);
      if (val === "ĐÃ XÁC MINH") {
        verifiedCount++;
        paidCount++;
      } else if (val === "ĐÃ ĐÓNG") {
        paidCount++;
      } else {
        unpaidCount++;
      }
    }

    const pct = Math.round((paidCount / totalStudents) * 100);
    const bar = "█".repeat(Math.round(pct / 10)) + "░".repeat(10 - Math.round(pct / 10));

    report += `📌 <b>${fundCode}</b>\n`;
    report += `   ${bar} ${pct}%\n`;
    report += `   ✅ Xác minh: ${verifiedCount} · ⏳ Chờ: ${paidCount - verifiedCount} · ❌ Chưa đóng: ${unpaidCount}\n\n`;
  }

  // Danh sách chưa đóng (nếu có)
  const unpaidNames = [];
  for (let r = 1; r < data.length; r++) {
    for (let c = 4; c < headers.length; c++) {
      if (data[r][c] === "CHƯA ĐÓNG") {
        unpaidNames.push(`${data[r][2]} (${headers[c]})`);
      }
    }
  }

  if (unpaidNames.length > 0 && unpaidNames.length <= 15) {
    report += `📛 <b>CHƯA ĐÓNG:</b>\n`;
    unpaidNames.forEach(n => { report += `  • ${n}\n`; });
  } else if (unpaidNames.length > 15) {
    report += `📛 <b>Còn ${unpaidNames.length} lượt chưa đóng.</b>\n`;
  }

  report += `━━━━━━━━━━━━━━━━━━━`;

  _sendTelegram(report);
}


// ═══════════════════════════════════════════════════════════════════════════════
// PHẦN 6: HÀM TIỆN ÍCH DÙNG CHUNG
// ═══════════════════════════════════════════════════════════════════════════════

function _jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function _formatMoney(amount) {
  return Number(amount).toLocaleString('vi-VN') + " đ";
}

function _sendTelegram(text) {
  if (!CFG.TELEGRAM_BOT_TOKEN || !CFG.TELEGRAM_CHAT_ID) {
    Logger.log("⚠️ Chưa cấu hình Telegram Bot Token hoặc Chat ID!");
    return;
  }

  const url = `https://api.telegram.org/bot${CFG.TELEGRAM_BOT_TOKEN}/sendMessage`;
  try {
    UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({
        chat_id: CFG.TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: "HTML"
      }),
      muteHttpExceptions: true
    });
  } catch (e) {
    Logger.log("Lỗi gửi Telegram: " + e.toString());
  }
}


// ═══════════════════════════════════════════════════════════════════════════════
// HƯỚNG DẪN CÀI 2 TRIGGER BẮT BUỘC
// ═══════════════════════════════════════════════════════════════════════════════
//
// Vào menu "Bộ kích hoạt" (Clock icon bên trái) → Thêm bộ kích hoạt mới:
//
// TRIGGER 1:
//   Hàm: scanBienDongSoDu
//   Loại sự kiện: Theo thời gian
//   Bộ hẹn giờ: Dựa trên phút → Mỗi 1 phút
//   → Tự động quét email ngân hàng và đối soát nội dung chuyển khoản
//
// TRIGGER 2:
//   Hàm: guiBaoCaoTongHop
//   Loại sự kiện: Theo thời gian
//   Bộ hẹn giờ: Dựa trên ngày → 20 giờ đến 21 giờ
//   → Tự động gửi báo cáo tổng hợp hàng ngày về nhóm Telegram
//
// ═══════════════════════════════════════════════════════════════════════════════
