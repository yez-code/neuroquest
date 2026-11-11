/*
 * 測驗邏輯（不碰 DOM，方便獨立測試）。
 * - validateQuiz：檢查題庫是否符合 CLAUDE.md 第 8 節規格
 * - shuffle：Fisher-Yates，回傳新陣列，不修改原資料
 * - createSession：一輪挑戰（10 題隨機排列、選擇、單次提交、計分）
 * 題目以固定 id 對應答案與詳解，選項不隨機排列，因此不會答案錯位。
 */
(function () {
  "use strict";

  var REQUIRED = { total: 10, true_false: 4, multiple_choice: 6, basic: 5, application: 5 };
  var OPTION_COUNT = { true_false: 2, multiple_choice: 4 };

  function isInt(n) {
    return typeof n === "number" && isFinite(n) && Math.floor(n) === n;
  }

  function nonEmpty(s) {
    return typeof s === "string" && s.replace(/\s/g, "").length > 0;
  }

  /** 回傳錯誤訊息陣列；空陣列代表通過。validSourceRefs 可省略。 */
  function validateQuiz(quiz, validSourceRefs) {
    var errors = [];
    if (!quiz || !Array.isArray(quiz.questions)) return ["題庫格式錯誤：缺少 questions 陣列"];
    var qs = quiz.questions;
    var seen = {};
    var count = { true_false: 0, multiple_choice: 0, basic: 0, application: 0 };

    if (qs.length !== REQUIRED.total) errors.push("題數應為 " + REQUIRED.total + "，目前為 " + qs.length);

    qs.forEach(function (q, idx) {
      var tag = "第 " + (idx + 1) + " 題" + (q && q.id ? "（" + q.id + "）" : "");
      if (!q || typeof q !== "object") { errors.push(tag + "：格式錯誤"); return; }

      if (!nonEmpty(q.id)) errors.push(tag + "：缺少 id");
      else if (seen[q.id]) errors.push(tag + "：id 重複");
      else seen[q.id] = true;

      if (q.type === "true_false" || q.type === "multiple_choice") count[q.type]++;
      else errors.push(tag + "：type 必須是 true_false 或 multiple_choice");

      if (q.level === "basic" || q.level === "application") count[q.level]++;
      else errors.push(tag + "：level 必須是 basic 或 application");

      if (!nonEmpty(q.question)) errors.push(tag + "：題幹為空");

      if (!Array.isArray(q.options)) {
        errors.push(tag + "：options 必須是陣列");
      } else {
        var expected = OPTION_COUNT[q.type];
        if (expected && q.options.length !== expected) errors.push(tag + "：選項數應為 " + expected);
        var distinct = {};
        q.options.forEach(function (o) {
          if (!nonEmpty(o)) errors.push(tag + "：有空白選項");
          else if (distinct[o]) errors.push(tag + "：選項文字重複「" + o + "」");
          distinct[o] = true;
        });
        if (!isInt(q.correctAnswer) || q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
          errors.push(tag + "：correctAnswer 必須是有效的選項索引");
        }
      }

      if (!nonEmpty(q.explanation)) errors.push(tag + "：缺少詳解");

      if (!nonEmpty(q.sourceRef)) errors.push(tag + "：缺少 sourceRef");
      else if (validSourceRefs && validSourceRefs.indexOf(q.sourceRef) === -1) {
        errors.push(tag + "：sourceRef「" + q.sourceRef + "」在筆記中找不到");
      }
    });

    if (count.true_false !== REQUIRED.true_false) errors.push("是非題應為 " + REQUIRED.true_false + " 題，目前 " + count.true_false);
    if (count.multiple_choice !== REQUIRED.multiple_choice) errors.push("選擇題應為 " + REQUIRED.multiple_choice + " 題，目前 " + count.multiple_choice);
    if (count.basic !== REQUIRED.basic) errors.push("基礎題應為 " + REQUIRED.basic + " 題，目前 " + count.basic);
    if (count.application !== REQUIRED.application) errors.push("應用題應為 " + REQUIRED.application + " 題，目前 " + count.application);

    return errors;
  }

  /** Fisher-Yates 洗牌；rng 預設 Math.random，需回傳 [0, 1) */
  function shuffle(list, rng) {
    var random = typeof rng === "function" ? rng : Math.random;
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(random() * (i + 1));
      if (j > i) j = i;
      if (j < 0) j = 0;
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /**
   * 一輪挑戰。流程：select(i) → submit() → next()，每題只能提交一次。
   * 所有方法都用閉包變數，不依賴 this。
   */
  function createSession(questions, rng) {
    var order = shuffle(questions, rng);
    var pos = 0;
    var selected = null;
    var records = [];

    function current() { return pos < order.length ? order[pos] : null; }
    function hasSubmitted() { return records.length > pos; }

    var api = {
      total: order.length,
      position: function () { return pos; },
      current: current,
      isFinished: function () { return pos >= order.length; },
      hasSubmitted: hasSubmitted,
      selected: function () { return selected; },

      select: function (i) {
        var q = current();
        if (!q || hasSubmitted()) return false;
        if (!isInt(i) || i < 0 || i >= q.options.length) return false;
        selected = i;
        return true;
      },

      /** 提交目前題目；已提交、未選擇或已結束時回傳 null（不會重複計分） */
      submit: function () {
        var q = current();
        if (!q || hasSubmitted() || selected === null) return null;
        var correct = selected === q.correctAnswer;
        records.push({ id: q.id, selected: selected, correct: correct });
        return {
          id: q.id,
          correct: correct,
          selected: selected,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation
        };
      },

      /** 必須先提交才能前進 */
      next: function () {
        if (pos >= order.length || !hasSubmitted()) return false;
        pos++;
        selected = null;
        return true;
      },

      correctCount: function () {
        return records.filter(function (r) { return r.correct; }).length;
      },
      records: function () { return records.slice(); }
    };
    return api;
  }

  window.NQQuiz = {
    REQUIRED: REQUIRED,
    validateQuiz: validateQuiz,
    shuffle: shuffle,
    createSession: createSession
  };
})();
