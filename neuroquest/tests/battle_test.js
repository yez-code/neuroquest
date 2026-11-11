/*
 * 戰鬥與星級規則測試（不需要瀏覽器）。
 * 用法（專案根目錄）：node tests/battle_test.js
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

global.window = {};
const root = path.join(__dirname, "..");
require(path.join(root, "js/battle.js"));
const B = window.NQBattle;

let passed = 0;
let failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log("PASS " + name); }
  catch (e) { failed++; console.log("FAIL " + name + "\n     " + e.message); }
}

/* ---------- Score Validation：答對 0 到 10 題 ---------- */

test("答對 5 題為 0 星", () => assert.strictEqual(B.starsFor(5), 0));
test("答對 6 題為 1 星", () => assert.strictEqual(B.starsFor(6), 1));
test("答對 7 題為 1 星", () => assert.strictEqual(B.starsFor(7), 1));
test("答對 8 題為 2 星", () => assert.strictEqual(B.starsFor(8), 2));
test("答對 9 題為 2 星", () => assert.strictEqual(B.starsFor(9), 2));
test("答對 10 題為 3 星", () => assert.strictEqual(B.starsFor(10), 3));
test("0 到 10 題完整對照表", () => {
  const expected = [0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 3];
  for (let k = 0; k <= 10; k++) assert.strictEqual(B.starsFor(k), expected[k], "k=" + k);
});

test("勝負與稱號：0–5 失敗、6–7 勝利、8–9 優秀勝利、10 完美勝利", () => {
  const labels = ["失敗", "失敗", "失敗", "失敗", "失敗", "失敗", "勝利", "勝利", "優秀勝利", "優秀勝利", "完美勝利"];
  for (let k = 0; k <= 10; k++) {
    const r = B.evaluate(k);
    assert.strictEqual(r.label, labels[k], "k=" + k);
    assert.strictEqual(r.victory, k >= 6, "victory k=" + k);
    assert.strictEqual(r.stars, B.starsFor(k), "stars k=" + k);
  }
});

/* ---------- 怪獸血量 ---------- */

test("目前 HP = 10 − 答對題數", () => {
  for (let k = 0; k <= 10; k++) assert.strictEqual(B.monsterHp(k), 10 - k, "k=" + k);
});
test("初始 HP 為 10，全對時 HP 為 0", () => {
  assert.strictEqual(B.MAX_HP, 10);
  assert.strictEqual(B.monsterHp(0), 10);
  assert.strictEqual(B.monsterHp(10), 0);
});
test("HP 不會低於 0 或高於 10（異常輸入）", () => {
  assert.strictEqual(B.monsterHp(-3), 10);
  assert.strictEqual(B.monsterHp(15), 0);
  assert.strictEqual(B.monsterHp(NaN), 10);
  assert.strictEqual(B.monsterHp(1.5), 10);
  assert.strictEqual(B.monsterHp("7"), 10);
  assert.strictEqual(B.monsterHp(undefined), 10);
});
test("異常輸入的星級不會出錯（視為 0 或上限）", () => {
  assert.strictEqual(B.starsFor(-1), 0);
  assert.strictEqual(B.starsFor(NaN), 0);
  assert.strictEqual(B.starsFor("9"), 0);
  assert.strictEqual(B.starsFor(99), 3);
});
test("答對 6 題即達擊敗門檻（HP 仍為 4，依規格仍算勝利）", () => {
  const r = B.evaluate(6);
  assert.strictEqual(r.victory, true);
  assert.strictEqual(r.hp, 4);
  assert.strictEqual(B.VICTORY_THRESHOLD, 6);
});

/* ---------- 星級規則只在 battle.js 定義一次 ---------- */

test("app.js 與 quiz.js 沒有自己寫星級／勝負門檻（必須呼叫 NQBattle）", () => {
  const app = fs.readFileSync(path.join(root, "js/app.js"), "utf8");
  const quiz = fs.readFileSync(path.join(root, "js/quiz.js"), "utf8");
  assert.ok(app.includes("NQBattle.evaluate"), "app.js 應呼叫 NQBattle.evaluate");
  // \b 確保 correctAnswer（題庫索引檢查）不會被誤判；只抓 correct / correctCount / stars 與數字的比較
  const pattern = /\b(correct|correctCount|stars)\s*(>=|<=|>|<|===)\s*\d/;
  assert.ok(!pattern.test(app), "app.js 出現數字門檻判斷");
  assert.ok(!pattern.test(quiz), "quiz.js 出現數字門檻判斷");
});

console.log(`\n${passed}/${passed + failed} 項通過`);
process.exit(failed ? 1 : 0);
