#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TỰ ĐỘNG MỞ GOOGLE MEET CHO TIẾT HỌC ĐẦU TIÊN — DÙNG CHROME THẬT, TÀI KHOẢN tanbanhda@gmail.com
- Đọc lịch học từ web "Công Việc Hằng Ngày" (js/data.js -> CLASS_SCHEDULE).
- Chọn tiết đầu tiên của ngày học kế tiếp, chờ đến giờ.
- Mở link Meet trong Chrome (Profile 7 = tanbanhda@gmail.com, đã đăng nhập sẵn),
  tắt micrô + camera rồi bấm tham gia.

Điều kiện: Chrome > View > Developer > Allow JavaScript from Apple Events (bật 1 lần).

Cách chạy:
  python3 tu_dong_tiet_dau.py            -> chờ đến giờ rồi mở Meet
  python3 tu_dong_tiet_dau.py --ngay     -> mở Meet ngay (test)
  python3 tu_dong_tiet_dau.py --xem      -> chỉ in tiết sẽ vào
  python3 tu_dong_tiet_dau.py --link URL -> mở một link Meet bất kỳ ngay (test)
"""
import json
import os
import re
import subprocess
import sys
import time
from datetime import datetime, timedelta

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_JS = os.path.join(os.path.dirname(BASE_DIR), "js", "data.js")
if not os.path.exists(DATA_JS):
    DATA_JS = "/Users/phuongpham/Downloads/Web/Công Việc Hằng Ngày/js/data.js"
CFG_PATH = os.path.join(BASE_DIR, "config.json")

JS_ACTIONS = r"""
(function () {
  const click = (re) => {
    const els = [...document.querySelectorAll('[aria-label], button')];
    for (const el of els) {
      const label = (el.getAttribute('aria-label') || '') + ' ' + (el.innerText || '');
      if (re.test(label)) { el.click(); return label.trim().slice(0, 50); }
    }
    return null;
  };
  const r = [];
  r.push('mic:' + click(/turn off microphone|tắt micrô|tắt micro/i));
  r.push('cam:' + click(/turn off camera|tắt máy ảnh|tắt camera/i));
  r.push('join:' + click(/^\s*(join now|ask to join|tham gia ngay|yêu cầu tham gia)/i));
  const inRoom = !!document.querySelector('[aria-label*="Leave call" i], [aria-label*="Rời khỏi cuộc gọi" i]');
  r.push('inroom:' + inRoom);
  return r.join(' | ');
})()
"""


def log(msg):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}", flush=True)


def notify(title, text):
    safe = text.replace('"', "'")
    subprocess.run(["osascript", "-e", f'display notification "{safe}" with title "{title}" sound name "Glass"'])


def run_js_in_meet_tab(meet_code):
    """Chạy JS trong tab Meet của Chrome. Trả về chuỗi kết quả hoặc 'ERR:...'."""
    js = JS_ACTIONS.replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ")
    script = f'''
    tell application "Google Chrome"
      try
        set wc to count of windows
        repeat with i from 1 to wc
          set tc to count of tabs of window i
          repeat with j from 1 to tc
            set u to ""
            try
              set u to URL of tab j of window i
            end try
            if u contains "{meet_code}" and u contains "meet.google.com" then
              try
                return execute tab j of window i javascript "{js}"
              on error e
                return "ERR:" & e
              end try
            end if
          end repeat
        end repeat
      on error e2
        return "NO_TAB (" & e2 & ")"
      end try
      return "NO_TAB"
    end tell
    '''
    res = subprocess.run(["osascript", "-e", script], capture_output=True, text=True)
    return (res.stdout or res.stderr).strip()


def open_meet(link, cfg):
    code = link.rstrip("/").split("/")[-1].split("?")[0]
    if code == "new":                 # /new tự chuyển sang mã phòng ngẫu nhiên
        code = "meet.google.com/"
    url = f"{link}?authuser={cfg['email_google']}"
    log(f"Mở Chrome (profile {cfg['chrome_profile']} - {cfg['email_google']}): {url}")
    subprocess.run(["open", "-na", "Google Chrome", "--args",
                    f"--profile-directory={cfg['chrome_profile']}", url])
    time.sleep(7)

    joined = False
    for attempt in range(40):
        out = run_js_in_meet_tab(code)
        if out.startswith("ERR:") and "turned off" in out:
            log("⚠️ Chrome chưa bật 'Allow JavaScript from Apple Events'.")
            log("   Vào Chrome: View > Developer > Allow JavaScript from Apple Events (bật 1 lần).")
            notify("Google Meet", "Chưa bật Allow JavaScript from Apple Events trong Chrome")
            return False
        log(f"   {out}")
        if "inroom:true" in out:
            joined = True
            break
        time.sleep(3)

    if joined:
        log("✅ Đã vào phòng họp (mic & camera đã tắt).")
        notify("Google Meet", "Đã vào lớp, mic và camera đã tắt")
    else:
        log("⚠️ Chưa xác nhận được đã vào phòng — kiểm tra cửa sổ Chrome (có thể phòng chờ giáo viên duyệt).")
    return joined


# ----------------------------- LỊCH HỌC -----------------------------
def load_schedule():
    src = None
    for path in (DATA_JS, os.path.join(BASE_DIR, "data.js")):
        try:
            with open(path, "r", encoding="utf-8") as f:
                src = f.read()
            if path == DATA_JS:
                try:  # cập nhật bản sao để dùng khi không đọc được Downloads
                    with open(os.path.join(BASE_DIR, "data.js"), "w", encoding="utf-8") as g:
                        g.write(src)
                except OSError:
                    pass
            break
        except OSError:
            continue
    if src is None:
        raise RuntimeError("Không đọc được lịch học (data.js)")
    block = re.search(r"const CLASS_SCHEDULE\s*=\s*\[(.*?)\];", src, re.S).group(1)
    items = []
    for m in re.finditer(
        r"day:\s*(\d+),\s*subject:\s*'([^']*)',\s*teacher:\s*'([^']*)',\s*period:\s*'(\d+)-(\d+)',\s*link:\s*'([^']*)'",
        block,
    ):
        d, subject, teacher, p1, p2, link = m.groups()
        items.append({"day": int(d), "subject": subject, "teacher": teacher,
                      "p1": int(p1), "p2": int(p2), "link": link})
    return items


def period_start(day_date, period, cfg):
    h, m = map(int, cfg["gio_tiet_1"].split(":"))
    base = day_date.replace(hour=h, minute=m, second=0, microsecond=0)
    return base + timedelta(minutes=(period - 1) * cfg["phut_moi_tiet"])


def next_first_class(cfg, now=None):
    now = now or datetime.now()
    sched = load_schedule()
    for offset in range(0, 8):
        d = now + timedelta(days=offset)
        day_no = d.weekday() + 2  # Thứ 2 = 2 ... Thứ 7 = 7, CN = 8
        todays = sorted([c for c in sched if c["day"] == day_no], key=lambda c: c["p1"])
        if not todays:
            continue
        first = todays[0]
        start = period_start(d, first["p1"], cfg)
        end = period_start(d, first["p2"] + 1, cfg)
        if end > now:
            return first, start, end
    return None, None, None


def main():
    import fcntl
    with open(CFG_PATH, "r", encoding="utf-8") as f:
        cfg = json.load(f)

    if "--link" in sys.argv:
        open_meet(sys.argv[sys.argv.index("--link") + 1], cfg)
        return

    # Chỉ cho chạy 1 bản duy nhất (tránh mở Meet 2 lần khi có nhiều trigger tự khởi động)
    lock_f = open(os.path.join(BASE_DIR, ".lock"), "w")
    try:
        fcntl.flock(lock_f, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except OSError:
        print("Đã có một bản tool đang chạy, thoát.")
        return

    cls, start, end = next_first_class(cfg)
    if not cls:
        print("Không tìm thấy tiết học nào trong lịch.")
        return

    print("=" * 60)
    print(f"📚 Tiết đầu kế tiếp: {cls['subject']} ({cls['teacher']})")
    print(f"🕒 Tiết {cls['p1']}-{cls['p2']} | Bắt đầu: {start.strftime('%A %d/%m %H:%M')} | Kết thúc ~ {end.strftime('%H:%M')}")
    print(f"🔗 {cls['link']}")
    print("=" * 60)

    if "--xem" in sys.argv:
        return

    state_path = os.path.join(BASE_DIR, "da_vao.json")
    key = f"{start.strftime('%Y-%m-%d')}|{cls['link']}"
    try:
        done = json.load(open(state_path, encoding="utf-8"))
    except Exception:
        done = []
    if key in done and "--ngay" not in sys.argv:
        print("Tiết này đã được vào rồi, không mở lại.")
        return

    if "--ngay" not in sys.argv:
        join_at = start - timedelta(minutes=cfg.get("vao_truoc_phut", 0))
        print(f"⏳ Chờ đến {join_at.strftime('%H:%M %d/%m')} để tự vào phòng (giữ cửa sổ này mở, máy không ngủ)...")
        while datetime.now() < join_at:
            time.sleep(15)
        notify("Google Meet", f"Đến giờ: {cls['subject']}")

    ok = open_meet(cls["link"], cfg)
    if ok:
        done.append(key)
        json.dump(done[-30:], open(state_path, "w", encoding="utf-8"))


if __name__ == "__main__":
    main()
