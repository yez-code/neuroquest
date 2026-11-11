/*
 * 題庫與測驗邏輯測試（不需要瀏覽器）。
 * 用法（專案根目錄）：node tests/quiz_logic_test.js
 */
const assert = require("assert");
const path = require("path");

global.window = {};
const root = path.join(__dirname, "..");
require(path.join(root, "data/notes/synapses.js"));
require(path.join(root, "data/quizzes/synapses.js"));
require(path.join(root, "js/quiz.js"));

const { NQQuiz, NQ } = window;
const quiz = NQ.quizzes.synapses;
const refs = NQ.notes.synapses.sections.map((s) => s.id);

let passed = 0;
let failed = 0;
function test(name, fn) {
  try {
    fn();
    passed++;
    console.log("PASS " + name);
  } catch (e) {
    failed++;
    console.log("FAIL " + name + "\n     " + e.message);
  }
}
const clone = (o) => JSON.parse(JSON.stringify(o));

/* ---------- 題庫驗證（CLAUDE.md 第 15 節 Quiz Validation） ---------- */

test("正式題庫通過驗證（含 sourceRef 對得到筆記）", () => {
  assert.deepStrictEqual(NQQuiz.validateQuiz(quiz, refs), []);
});
test("恰好 10 題", () => assert.strictEqual(quiz.questions.length, 10));
test("4 題是非 + 6 題四選一", () => {
  const tf = quiz.questions.filter((q) => q.type === "true_false").length;
  const mc = quiz.questions.filter((q) => q.type === "multiple_choice").length;
  assert.deepStrictEqual([tf, mc], [4, 6]);
});
test("5 題基礎 + 5 題應用", () => {
  const b = quiz.questions.filter((q) => q.level === "basic").length;
  const a = quiz.questions.filter((q) => q.level === "application").length;
  assert.deepStrictEqual([b, a], [5, 5]);
});
test("每題 id 唯一、選項數正確、詳解非空", () => {
  const ids = new Set(quiz.questions.map((q) => q.id));
  assert.strictEqual(ids.size, 10);
  quiz.questions.forEach((q) => {
    assert.strictEqual(q.options.length, q.type === "true_false" ? 2 : 4, q.id);
    assert.ok(q.explanation.trim().length > 0, q.id);
    assert.ok(Number.isInteger(q.correctAnswer) && q.correctAnswer >= 0 && q.correctAnswer < q.options.length, q.id);
  });
});
test("正解位置分佈不會全部相同（避免永遠選同一個）", () => {
  const mc = quiz.questions.filter((q) => q.type === "multiple_choice").map((q) => q.correctAnswer);
  assert.ok(new Set(mc).size >= 2);
});

test("驗證器能抓出各種錯誤（負面測試）", () => {
  const mutate = (fn) => { const c = clone(quiz); fn(c); return NQQuiz.validateQuiz(c, refs); };
  assert.ok(mutate((c) => c.questions.pop()).length > 0, "少一題");
  assert.ok(mutate((c) => { c.questions[1].id = c.questions[0].id; }).length > 0, "id 重複");
  assert.ok(mutate((c) => { c.questions[0].correctAnswer = 5; }).length > 0, "正解索引超出");
  assert.ok(mutate((c) => { c.questions[0].explanation = "  "; }).length > 0, "詳解空白");
  assert.ok(mutate((c) => { c.questions[0].sourceRef = "no-such-section"; }).length > 0, "sourceRef 不存在");
  assert.ok(mutate((c) => { c.questions[0].sourceRef = ""; }).length > 0, "缺 sourceRef");
  assert.ok(mutate((c) => { c.questions[0].type = "multiple_choice"; }).length > 0, "題型數量/選項數不符");
  assert.ok(mutate((c) => { c.questions[0].level = "application"; }).length > 0, "層次數量不符");
  assert.ok(mutate((c) => { c.questions[4].options[1] = c.questions[4].options[0]; }).length > 0, "選項重複");
  assert.ok(NQQuiz.validateQuiz(null, refs).length > 0, "null 題庫");
});

/* ---------- 隨機排列 ---------- */

function seeded(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

test("shuffle 不改動原陣列，且保留所有元素", () => {
  const src = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const copy = src.slice();
  const out = NQQuiz.shuffle(src, seeded(1));
  assert.deepStrictEqual(src, copy);
  assert.deepStrictEqual(out.slice().sort((a, b) => a - b), copy);
});
test("shuffle 在極端亂數（0 與接近 1）下不出錯", () => {
  assert.strictEqual(NQQuiz.shuffle([1, 2, 3, 4], () => 0).length, 4);
  assert.strictEqual(NQQuiz.shuffle([1, 2, 3, 4], () => 0.9999999999).length, 4);
  assert.strictEqual(NQQuiz.shuffle([1, 2, 3, 4], () => 1).length, 4);
});
test("每輪 10 題不重複、與題庫相同", () => {
  for (let k = 0; k < 100; k++) {
    const s = NQQuiz.createSession(quiz.questions);
    const ids = [];
    while (!s.isFinished()) { ids.push(s.current().id); s.select(0); s.submit(); s.next(); }
    assert.strictEqual(ids.length, 10);
    assert.strictEqual(new Set(ids).size, 10);
    assert.deepStrictEqual(ids.slice().sort(), quiz.questions.map((q) => q.id).sort());
  }
});
test("多輪之間題序確實會變（隨機）", () => {
  const orders = new Set();
  for (let k = 0; k < 50; k++) {
    const s = NQQuiz.createSession(quiz.questions);
    const ids = [];
    while (!s.isFinished()) { ids.push(s.current().id); s.select(0); s.submit(); s.next(); }
    orders.add(ids.join(","));
  }
  assert.ok(orders.size > 10, "不同題序數：" + orders.size);
});
test("隨機題序不會造成答案錯位（以 id 對回原題）", () => {
  const byId = {};
  quiz.questions.forEach((q) => { byId[q.id] = q; });
  for (let k = 0; k < 50; k++) {
    const s = NQQuiz.createSession(quiz.questions);
    while (!s.isFinished()) {
      const q = s.current();
      const orig = byId[q.id];
      assert.strictEqual(q.correctAnswer, orig.correctAnswer);
      assert.strictEqual(q.options[q.correctAnswer], orig.options[orig.correctAnswer]);
      s.select(orig.correctAnswer);
      const r = s.submit();
      assert.strictEqual(r.correct, true);
      assert.strictEqual(r.explanation, orig.explanation);
      s.next();
    }
  }
});

/* ---------- 答題規則（Interaction Validation） ---------- */

test("未選擇不能提交；提交後不能重複提交（不重複得分）", () => {
  const s = NQQuiz.createSession(quiz.questions);
  assert.strictEqual(s.submit(), null, "未選擇");
  const q = s.current();
  s.select(q.correctAnswer);
  assert.ok(s.submit());
  assert.strictEqual(s.submit(), null, "重複提交");
  assert.strictEqual(s.submit(), null, "重複提交 2");
  assert.strictEqual(s.correctCount(), 1);
});
test("提交後答案鎖定，不能更改", () => {
  const s = NQQuiz.createSession(quiz.questions);
  const q = s.current();
  const wrong = (q.correctAnswer + 1) % q.options.length;
  s.select(wrong);
  const r = s.submit();
  assert.strictEqual(r.correct, false);
  assert.strictEqual(s.select(q.correctAnswer), false, "鎖定後不可再選");
  assert.strictEqual(s.selected(), wrong);
  assert.strictEqual(s.correctCount(), 0);
});
test("必須先提交才能下一題；無效選項被拒絕", () => {
  const s = NQQuiz.createSession(quiz.questions);
  assert.strictEqual(s.next(), false);
  assert.strictEqual(s.select(-1), false);
  assert.strictEqual(s.select(99), false);
  assert.strictEqual(s.select(1.5), false);
  assert.strictEqual(s.select("0"), false);
  assert.strictEqual(s.position(), 0);
});
test("十題全部完成才結束；結束後無法再提交", () => {
  const s = NQQuiz.createSession(quiz.questions);
  for (let i = 0; i < 10; i++) {
    assert.strictEqual(s.isFinished(), false);
    s.select(0); s.submit(); assert.ok(s.next());
  }
  assert.strictEqual(s.isFinished(), true);
  assert.strictEqual(s.current(), null);
  assert.strictEqual(s.submit(), null);
  assert.strictEqual(s.next(), false);
  assert.strictEqual(s.records().length, 10);
});
test("答對 0~10 題，correctCount 都精確", () => {
  for (let k = 0; k <= 10; k++) {
    const s = NQQuiz.createSession(quiz.questions);
    let i = 0;
    while (!s.isFinished()) {
      const q = s.current();
      s.select(i < k ? q.correctAnswer : (q.correctAnswer + 1) % q.options.length);
      s.submit(); s.next(); i++;
    }
    assert.strictEqual(s.correctCount(), k, "k=" + k);
  }
});
test("兩輪之間互不影響（重新挑戰會重置）", () => {
  const a = NQQuiz.createSession(quiz.questions);
  a.select(a.current().correctAnswer); a.submit();
  const b = NQQuiz.createSession(quiz.questions);
  assert.strictEqual(b.position(), 0);
  assert.strictEqual(b.correctCount(), 0);
  assert.strictEqual(b.records().length, 0);
});

console.log(`\n${passed}/${passed + failed} 項通過`);
process.exit(failed ? 1 : 0);
