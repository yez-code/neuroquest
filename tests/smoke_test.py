"""
NeuroQuest 煙霧測試（Phase 1+2）：以真實瀏覽器載入網站並檢查主要行為。
用法（在專案根目錄）：python3 tests/smoke_test.py
需要：playwright 與 Chrome／Chromium。
"""
import http.server
import json
import os
import socketserver
import sys
import threading

from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = 8765
results = []


def check(name, ok, detail=""):
    results.append((name, bool(ok), detail))
    print(("PASS " if ok else "FAIL ") + name + (f"  [{detail}]" if detail else ""))


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def log_message(self, *a):
        pass


def main():
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    socketserver.ThreadingTCPServer.daemon_threads = True
    httpd = socketserver.ThreadingTCPServer(("127.0.0.1", PORT), Handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{PORT}/index.html"

    with sync_playwright() as p:
        exe = "/usr/bin/google-chrome" if os.path.exists("/usr/bin/google-chrome") else None
        browser = p.chromium.launch(executable_path=exe, args=["--no-sandbox"]) if exe else p.chromium.launch()

        # ---- 桌面版 ----
        page = browser.new_page(viewport={"width": 1100, "height": 900})
        errors, failed = [], []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        page.on("requestfailed", lambda r: failed.append(r.url))
        page.goto(base)
        page.wait_for_selector(".map")

        check("首頁載入無 JS 錯誤", not errors, "; ".join(errors))
        check("所有資源載入成功", not failed, "; ".join(failed))
        check("首頁有 4 個關卡", page.locator(".stage-item").count() == 4)
        check("只有 1 個關卡可進入", page.locator("a.stage.open").count() == 1)
        check("3 個 Coming Soon 不是連結", page.locator("div.stage.locked").count() == 3
              and page.locator("a.stage.locked").count() == 0)
        check("未挑戰時顯示『尚未挑戰』且無假星級", "尚未挑戰" in page.locator("a.stage.open").inner_text()
              and page.locator("a.stage.open .stars").count() == 0)
        page.screenshot(path=os.path.join(ROOT, "tests", "shot_home_desktop.png"))

        # ---- 章節頁 ----
        page.click("a.stage.open")
        page.wait_for_selector(".note-section")
        n_sections = page.locator("details[data-section]").count()
        check("筆記有 18 個章節區塊", n_sections == 18, str(n_sections))
        check("有 6 組易混淆比較", page.locator("section[aria-label='易混淆概念比較'] details").count() == 6)
        check("有示意圖", page.locator(".diagram svg").count() == 1)
        check("第一個區塊預設展開", page.locator("details[data-section]").first.evaluate("d => d.open"))
        check("挑戰按鈕可點擊並連到測驗", page.locator("a.btn.primary[href='#/quiz/synapses']").count() == 1)
        check("沒有出現 '**' 殘留", "**" not in page.locator("#app").inner_text())

        page.click("button:has-text('全部展開')")
        check("全部展開生效", page.locator("details:not([open])").count() == 0)
        page.click("button:has-text('全部收合')")
        check("全部收合生效", page.locator("details[open]").count() == 0)
        page.locator(".toc-link").nth(7).click()
        check("目錄按鈕會展開對應區塊", page.locator("details[data-section='synapses-section-08']").evaluate("d => d.open"))
        page.screenshot(path=os.path.join(ROOT, "tests", "shot_chapter_desktop.png"), full_page=False)

        # ---- 測驗與戰鬥流程（Phase 3 + 4） ----
        def answer_current(pg, correct):
            """依資料找出目前題目，選正確（或刻意選錯）的選項並提交；回傳 (題目資料, 選的索引)"""
            text = pg.locator(".question-text").inner_text()
            q = pg.evaluate("t => window.NQ.quizzes.synapses.questions.find(q => q.question === t)", text)
            assert q is not None, "畫面題目對不到題庫：" + text
            idx = q["correctAnswer"] if correct else (q["correctAnswer"] + 1) % len(q["options"])
            pg.locator(f"#opt-{idx}").check()
            pg.click("button:has-text('確認答案')")
            return q, idx

        def run_quiz(pg, flags, check_hp=False):
            """從第 1 題起作答 10 題；flags[i] 為 True 代表該題答對。結束後停在結算畫面，回傳作答紀錄。"""
            log = []
            got = 0
            for i, ok in enumerate(flags, start=1):
                q, picked = answer_current(pg, ok)
                got += 1 if ok else 0
                log.append((q, picked, ok))
                fb = pg.locator(".feedback").inner_text()
                if ("答對了" in fb) != ok:
                    check(f"第 {i} 題回饋與實際作答不符", False, fb)
                if check_hp:
                    expected = f"HP {10 - got} / 10"
                    shown = pg.locator(".hp-text").inner_text()
                    if expected not in shown:
                        check(f"第 {i} 題後 HP 應為 {expected}", False, shown)
                    if ok and got == 6:
                        check("答對第 6 題顯示『已達擊敗門檻』，但仍須完成剩餘題目",
                              "已達擊敗門檻" in pg.locator(".battle-note").inner_text()
                              and pg.locator(".question-card").count() == 1)
                pg.click("button:has-text('完成挑戰')" if i == 10 else "button:has-text('下一題')")
            pg.wait_for_selector(".result")
            return log

        def info(pg):
            return {
                "label": pg.locator(".result-label").inner_text(),
                "score": " ".join(pg.locator(".result-score").inner_text().split()),
                "this": pg.locator(".result-this").inner_text(),
                "best": pg.locator(".result-best").inner_text(),
                "wrong": pg.locator(".wrong-item").count(),
                "new": pg.locator(".new-record").count(),
                "monster": pg.locator(".monster-wrap").get_attribute("class"),
                "hp": pg.locator(".hp-text").inner_text(),
                "msg": pg.locator(".result-message").inner_text(),
                "review": pg.locator(".review").inner_text(),
            }

        def again(pg):
            pg.click("button:has-text('再挑戰一次')")
            pg.wait_for_selector(".question-card")

        page.evaluate("localStorage.clear()")
        page.click("a.btn.primary[href='#/quiz/synapses']")
        page.wait_for_selector(".question-card")
        check("測驗顯示『第 1 / 10 題』", "第 1 / 10 題" in page.locator(".quiz-progress").inner_text())
        check("未選擇時『確認答案』為停用", page.locator("button:has-text('確認答案')").is_disabled())
        check("開始時怪獸 HP 為 10 / 10", "HP 10 / 10" in page.locator(".hp-text").inner_text())

        # 第 1 題的細節（刻意答錯）：鎖定、標記、詳解
        q1, picked1 = answer_current(page, False)
        fb = page.locator(".feedback")
        check("答錯會顯示『答錯了』與正確答案、詳解",
              "答錯了" in fb.inner_text() and "詳解" in fb.inner_text() and q1["options"][q1["correctAnswer"]] in fb.inner_text())
        check("答錯時 HP 不變（仍為 10 / 10）", "HP 10 / 10" in page.locator(".hp-text").inner_text())
        check("提交後選項全部鎖定", page.locator("input[name='answer']:not([disabled])").count() == 0)
        check("提交後『確認答案』消失（不能重複提交）", page.locator("button:has-text('確認答案')").count() == 0)
        check("正確與錯誤選項有文字標記（不只靠顏色）",
              "✔" in page.locator(".option.is-correct").inner_text() and "✘" in page.locator(".option.is-wrong").inner_text())
        check("顯示對應筆記段落", "對應筆記：" in fb.inner_text())
        page.click("button:has-text('下一題')")
        check("按下一題後進到第 2 題", "第 2 / 10 題" in page.locator(".quiz-progress").inner_text())
        # 答對一題：HP 扣 1、怪獸出現受擊動畫 class
        answer_current(page, True)
        check("答對一題 HP 變 9 / 10（答錯那題不算）", "HP 9 / 10" in page.locator(".hp-text").inner_text())
        check("答對時怪獸有受擊（hit）狀態", "hit" in page.locator(".monster-wrap").get_attribute("class"))

        # ---- 完整 5 輪：各種星級與邊界；第 1 輪用整輪重跑以檢查每題 HP ----
        page.goto(base + "#/chapter/synapses")
        page.wait_for_selector(".note-section")
        page.goto(base + "#/quiz/synapses")
        page.wait_for_selector(".question-card")
        page.evaluate("localStorage.clear()")

        log = run_quiz(page, [False] + [True] * 9, check_hp=True)
        r = info(page)
        check("第 1 輪：答對 9 題 → 優秀勝利、2 星", r["label"] == "優秀勝利" and r["score"] == "答對 9 / 10 題" and "2 / 3" in r["this"], str(r))
        check("第 1 輪：首次成績顯示歷史最佳 2 / 3 與新紀錄", "2 / 3" in r["best"] and r["new"] == 1, str(r))
        check("第 1 輪：勝利時怪獸倒下（defeated），HP 9→1", "defeated" in r["monster"] and "HP 1 / 10（已擊敗）" in r["hp"], str(r))
        check("第 1 輪：錯題回顧恰好 1 題", r["wrong"] == 1)
        wrong_text = page.locator(".wrong-item").inner_text()
        q_wrong, picked_wrong, _ = log[0]
        check("錯題回顧含題幹、你的答案、正確答案、詳解、對應筆記",
              q_wrong["question"] in wrong_text
              and q_wrong["options"][picked_wrong] in wrong_text
              and q_wrong["options"][q_wrong["correctAnswer"]] in wrong_text
              and q_wrong["explanation"] in wrong_text
              and "對應筆記：" in wrong_text, wrong_text[:80])
        check("最佳星級已儲存為 2", page.evaluate("window.NQStorage.getBestStars('synapses')") == 2)

        again(page)
        check("再挑戰一次會重置到第 1 題且 HP 回到 10", "第 1 / 10 題" in page.locator(".quiz-progress").inner_text()
              and "HP 10 / 10" in page.locator(".hp-text").inner_text())
        run_quiz(page, [False] * 10)
        r = info(page)
        check("第 2 輪：答對 0 題 → 挑戰失敗、0 星", r["label"] == "挑戰失敗" and "0 / 3" in r["this"], str(r))
        check("第 2 輪：怪獸仍站著（standing）、HP 10", "standing" in r["monster"] and "HP 10 / 10" in r["hp"] and "已擊敗" not in r["hp"], str(r))
        check("第 2 輪：較低成績不覆蓋，歷史最佳仍是 2 / 3，且無新紀錄", "2 / 3" in r["best"] and r["new"] == 0, str(r))
        check("第 2 輪：10 題全錯，錯題回顧 10 題", r["wrong"] == 10)
        check("第 2 輪：失敗訊息為鼓勵語氣（無責備字眼）",
              "沒關係" in r["msg"] and not any(w in (r["msg"] + r["review"]) for w in ["笨", "糟糕", "差勁", "廢"]), r["msg"])
        check("第 2 輪：localStorage 最佳星級仍為 2", page.evaluate("window.NQStorage.getBestStars('synapses')") == 2)

        again(page)
        run_quiz(page, [True] * 10)
        r = info(page)
        check("第 3 輪：全對 → 完美勝利、3 星", r["label"] == "完美勝利" and r["score"] == "答對 10 / 10 題" and "3 / 3" in r["this"], str(r))
        check("第 3 輪：歷史最佳更新為 3 / 3 並顯示新紀錄", "3 / 3" in r["best"] and r["new"] == 1, str(r))
        check("第 3 輪：HP 0 且已擊敗；沒有錯題時顯示明確完成結果",
              "HP 0 / 10（已擊敗）" in r["hp"] and r["wrong"] == 0 and "沒有錯題" in r["review"], str(r))
        check("第 3 輪：全對時仍顯示明確結算（星星、分數）", page.locator(".star.on").count() == 3)

        again(page)
        run_quiz(page, [True] * 6 + [False] * 4)
        r = info(page)
        check("第 4 輪（邊界）：答對 6 題 → 勝利、1 星，HP 仍為 4",
              r["label"] == "勝利" and "1 / 3" in r["this"] and "HP 4 / 10（已擊敗）" in r["hp"] and r["wrong"] == 4, str(r))
        check("第 4 輪：最佳星級仍為 3（不被 1 星覆蓋）", "3 / 3" in r["best"] and page.evaluate("window.NQStorage.getBestStars('synapses')") == 3, str(r))

        again(page)
        run_quiz(page, [True] * 5 + [False] * 5)
        r = info(page)
        check("第 5 輪（邊界）：答對 5 題 → 失敗、0 星、未擊敗", r["label"] == "挑戰失敗" and "0 / 3" in r["this"]
              and "已擊敗" not in r["hp"] and r["wrong"] == 5, str(r))
        check("結算流程全程無 JS 錯誤", not errors, "; ".join(errors))

        # 回首頁：顯示最佳星級；0 星可與未挑戰區分
        page.click("a:has-text('回到首頁')")
        page.wait_for_selector(".map")
        check("首頁顯示最佳星級 3/3", "3/3" in page.locator("a.stage.open").inner_text())
        page.evaluate("localStorage.clear()")
        page.evaluate("window.NQStorage.saveResult('synapses', 0)")
        page.reload()  # 同網址只差 hash 時 goto 不一定重載，明確重新整理才會重新讀取儲存的星級
        page.wait_for_selector(".map")
        home_txt = page.locator("a.stage.open").inner_text()
        check("0 星在首頁顯示『已挑戰』而非『尚未挑戰』", "已挑戰" in home_txt and "尚未挑戰" not in home_txt, home_txt)
        page.evaluate("localStorage.clear()")

        # 減少動態：關閉動畫後，結算仍呈現最終狀態（怪獸倒下、星星可見）
        rm = browser.new_page(viewport={"width": 900, "height": 800}, reduced_motion="reduce")
        rm.goto(base + "#/quiz/synapses")
        rm.wait_for_selector(".question-card")
        run_quiz(rm, [True] * 10)
        mon = rm.evaluate("""() => {
          const m = document.querySelector('.monster-wrap.defeated .monster');
          const s = getComputedStyle(m);
          return [parseFloat(s.opacity), s.animationName, document.querySelectorAll('.star.on').length,
                  getComputedStyle(document.querySelector('.star.on')).opacity];
        }""")
        check("減少動態：無動畫但怪獸仍呈現倒下狀態、3 顆星皆可見",
              mon[0] < 0.5 and mon[1] == "none" and mon[2] == 3 and float(mon[3]) == 1.0, str(mon))
        rm.close()

        # ---- Coming Soon 不可誤入 ----
        page.goto(base + "#/chapter/locked-1")
        page.wait_for_selector(".panel")
        check("Coming Soon 章節顯示提示頁", "Coming Soon" in page.locator("#app").inner_text())
        page.goto(base + "#/chapter/not-exist")
        page.wait_for_selector(".panel")
        check("不存在的章節顯示提示頁", "找不到" in page.locator("#app").inner_text())

        # ---- 儲存模組 ----
        res = page.evaluate("""() => {
          const S = window.NQStorage; localStorage.clear();
          const a = S.getBestStars('synapses');
          const b = S.saveResult('synapses', 0);
          const c = S.getBestStars('synapses');
          S.saveResult('synapses', 2);
          const d = S.saveResult('synapses', 1);
          const e = S.saveResult('synapses', 7);
          return [a, b, c, d, e, S.getBestStars('synapses')];
        }""")
        check("未挑戰=null、0 星可與未挑戰區分", res[0] is None and res[1] == 0 and res[2] == 0, json.dumps(res))
        check("較低成績不覆蓋、無效值被忽略", res[3] == 2 and res[4] == 2 and res[5] == 2, json.dumps(res))
        page.goto(base)
        page.wait_for_selector(".map")
        check("首頁顯示已儲存的最佳星級", "2/3" in page.locator("a.stage.open").inner_text())

        # localStorage 不可用時仍能運作
        page2 = browser.new_page(viewport={"width": 1100, "height": 900})
        page2.add_init_script("Object.defineProperty(window, 'localStorage', {get(){ throw new Error('blocked'); }});")
        err2 = []
        page2.on("pageerror", lambda e: err2.append(str(e)))
        page2.goto(base)
        page2.wait_for_selector(".map")
        r2 = page2.evaluate("() => [window.NQStorage.getBestStars('synapses'), window.NQStorage.saveResult('synapses', 3), window.NQStorage.getBestStars('synapses')]")
        check("localStorage 被封鎖時不會出錯", not err2 and r2 == [None, 3, 3], json.dumps(r2) + " " + "; ".join(err2))
        page2.close()

        # ---- 手機版 ----
        m = browser.new_page(viewport={"width": 375, "height": 740})
        merr = []
        m.on("pageerror", lambda e: merr.append(str(e)))
        m.goto(base)
        m.wait_for_selector(".map")
        ov_home = m.evaluate("() => document.documentElement.scrollWidth - document.documentElement.clientWidth")
        check("手機首頁無水平溢出", ov_home <= 0, str(ov_home))
        m.screenshot(path=os.path.join(ROOT, "tests", "shot_home_mobile.png"))
        m.goto(base + "#/chapter/synapses")
        m.wait_for_selector(".note-section")
        m.click("button:has-text('全部展開')")
        ov_ch = m.evaluate("() => document.documentElement.scrollWidth - document.documentElement.clientWidth")
        check("手機章節頁（全展開）無水平溢出", ov_ch <= 0, str(ov_ch))
        m.screenshot(path=os.path.join(ROOT, "tests", "shot_chapter_mobile.png"))
        m.goto(base + "#/quiz/synapses")
        m.wait_for_selector(".question-card")
        ov_q = m.evaluate("() => document.documentElement.scrollWidth - document.documentElement.clientWidth")
        check("手機測驗頁無水平溢出", ov_q <= 0, str(ov_q))
        m.screenshot(path=os.path.join(ROOT, "tests", "shot_quiz_mobile.png"))
        m.locator("#opt-0").check()
        m.click("button:has-text('確認答案')")
        ov_q2 = m.evaluate("() => document.documentElement.scrollWidth - document.documentElement.clientWidth")
        check("手機測驗頁（提交後）無水平溢出", ov_q2 <= 0, str(ov_q2))
        m.screenshot(path=os.path.join(ROOT, "tests", "shot_quiz_feedback_mobile.png"))
        # 手機：完整做完一輪（全錯 → 結算畫面有 10 題錯題回顧），不可水平溢出
        m.goto(base + "#/chapter/synapses")
        m.wait_for_selector(".note-section")
        m.goto(base + "#/quiz/synapses")
        m.wait_for_selector(".question-card")
        run_quiz(m, [False] * 10)
        ov_r = m.evaluate("() => document.documentElement.scrollWidth - document.documentElement.clientWidth")
        check("手機結算畫面（含 10 題錯題回顧）無水平溢出", ov_r <= 0, str(ov_r))
        check("手機結算畫面顯示 10 題錯題", m.locator(".wrong-item").count() == 10)
        m.screenshot(path=os.path.join(ROOT, "tests", "shot_result_mobile.png"))
        m.goto(base + "#/chapter/synapses")
        m.wait_for_selector(".note-section")
        m.goto(base + "#/quiz/synapses")
        m.wait_for_selector(".question-card")
        run_quiz(m, [True] * 10)
        ov_r2 = m.evaluate("() => document.documentElement.scrollWidth - document.documentElement.clientWidth")
        check("手機完美勝利結算畫面無水平溢出", ov_r2 <= 0, str(ov_r2))
        m.screenshot(path=os.path.join(ROOT, "tests", "shot_result_perfect_mobile.png"))
        check("手機版無 JS 錯誤", not merr, "; ".join(merr))

        browser.close()

    httpd.shutdown()
    failed_n = [r for r in results if not r[1]]
    print(f"\n{len(results) - len(failed_n)}/{len(results)} 項通過")
    sys.exit(1 if failed_n else 0)


if __name__ == "__main__":
    main()
