/*
 * 怪獸戰鬥規則（不碰 DOM，方便獨立測試）。
 * 星級判定只能在這裡定義一次（CLAUDE.md 第 9 節）；其他檔案一律呼叫 NQBattle.starsFor / evaluate。
 *
 * 規則：
 *  - 怪獸初始 HP = 10；目前 HP = 10 − 本輪答對題數（不低於 0、不高於 10）
 *  - 答對 ≥ 6 題視為擊敗怪獸；必須作答完 10 題才結算
 *  - 0–5 題 → 失敗、0 星；6–7 → 勝利、1 星；8–9 → 優秀勝利、2 星；10 → 完美勝利、3 星
 */
(function () {
  "use strict";

  var MAX_HP = 10;
  var TOTAL_QUESTIONS = 10;
  var VICTORY_THRESHOLD = 6;
  var LABELS = ["失敗", "勝利", "優秀勝利", "完美勝利"]; // 以星級為索引

  function isInt(n) {
    return typeof n === "number" && isFinite(n) && Math.floor(n) === n;
  }

  /** 非整數或無效值視為 0；限制在 0 ~ 10 */
  function clampCorrect(n) {
    if (!isInt(n)) return 0;
    return Math.max(0, Math.min(TOTAL_QUESTIONS, n));
  }

  function monsterHp(correct) {
    return MAX_HP - clampCorrect(correct);
  }

  /** 唯一的星級判定函式 */
  function starsFor(correct) {
    var c = clampCorrect(correct);
    if (c <= 5) return 0;
    if (c <= 7) return 1;
    if (c <= 9) return 2;
    return 3;
  }

  function evaluate(correct) {
    var c = clampCorrect(correct);
    var stars = starsFor(c);
    return {
      correct: c,
      stars: stars,
      victory: c >= VICTORY_THRESHOLD,
      label: LABELS[stars],
      hp: monsterHp(c)
    };
  }

  window.NQBattle = {
    MAX_HP: MAX_HP,
    TOTAL_QUESTIONS: TOTAL_QUESTIONS,
    VICTORY_THRESHOLD: VICTORY_THRESHOLD,
    LABELS: LABELS.slice(),
    monsterHp: monsterHp,
    starsFor: starsFor,
    evaluate: evaluate
  };
})();
