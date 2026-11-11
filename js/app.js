/*
 * NeuroQuest 主程式：首頁、章節筆記頁、簡單 hash 路由。
 * 路由：#/ 首頁　#/chapter/<chapterId> 章節筆記
 * 資料與邏輯分離：章節資料來自 NQ.chapters / NQ.notes。
 */
(function () {
  "use strict";

  var app = document.getElementById("app");
  var NQ = window.NQ || {};
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 小工具 ---------- */

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === "class") node.className = v;
        else if (k === "text") node.textContent = v;
        else if (k.indexOf("on") === 0 && typeof v === "function") node.addEventListener(k.slice(2), v);
        else node.setAttribute(k, v === true ? "" : v);
      });
    }
    (children || []).forEach(function (c) {
      if (c === null || c === undefined) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  /** 把 **粗體** 轉成安全的 DOM（不使用 innerHTML） */
  function inline(text) {
    var frag = document.createDocumentFragment();
    String(text).split("**").forEach(function (part, i) {
      if (!part) return;
      frag.appendChild(i % 2 === 1 ? el("strong", { text: part }) : document.createTextNode(part));
    });
    return frag;
  }

  function withInline(tag, text, attrs) {
    var node = el(tag, attrs);
    node.appendChild(inline(text));
    return node;
  }

  function findChapter(id) {
    var list = NQ.chapters || [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].chapterId === id) return list[i];
    }
    return null;
  }

  function starsText(n) {
    var s = "";
    for (var i = 0; i < 3; i++) s += i < n ? "★" : "☆";
    return s;
  }

  function show(nodes) {
    app.innerHTML = "";
    nodes.forEach(function (n) { app.appendChild(n); });
  }

  /* ---------- 像素怪獸（簡單 SVG，自行繪製的原創造型） ---------- */

  var SLIME = [
    "....XXXX....",
    "..XXXXXXXX..",
    ".XXXXXXXXXX.",
    ".XXEEXXEEXX.",
    ".XXEKXXEKXX.",
    "XXXXXKKXXXXX",
    "XXXXXXXXXXXX",
    ".XXXXXXXXXX.",
    "..XX....XX.."
  ];

  function monsterSVG(color) {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 12 9");
    svg.setAttribute("class", "monster");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("shape-rendering", "crispEdges");
    var fills = { X: color || "#7bc9a6", E: "#ffffff", K: "#2b2250" };
    SLIME.forEach(function (row, y) {
      for (var x = 0; x < row.length; x++) {
        var c = row.charAt(x);
        if (c === ".") continue;
        var r = document.createElementNS(ns, "rect");
        r.setAttribute("x", x);
        r.setAttribute("y", y);
        r.setAttribute("width", 1);
        r.setAttribute("height", 1);
        r.setAttribute("fill", fills[c]);
        svg.appendChild(r);
      }
    });
    return svg;
  }

  /* ---------- 示意圖：化學突觸 ---------- */

  var DIAGRAMS = {
    "chemical-synapse": {
      label: "化學突觸示意圖：前突觸末梢內有囊泡，鈣離子通道開啟後釋放傳遞物質至突觸間隙，與後突觸受器結合，再被轉運蛋白回收或酵素分解。",
      caption: "圖：化學突觸事件示意（①合成 ②釋放 ③受器結合 ⑤再攝取／酶分解）。為簡化示意，並非真實比例。",
      svg:
        '<svg viewBox="0 0 640 320" role="img" aria-label="化學突觸示意圖" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
        '<path d="M0 0L10 5L0 10z" class="dg-arrow-head"/></marker></defs>' +
        '<rect x="40" y="14" width="560" height="120" rx="18" class="dg-pre"/>' +
        '<text x="60" y="38" class="dg-title">前突觸末梢（presynaptic terminal）</text>' +
        '<circle cx="150" cy="84" r="17" class="dg-vesicle"/><circle cx="150" cy="84" r="4" class="dg-dot"/>' +
        '<circle cx="204" cy="100" r="17" class="dg-vesicle"/><circle cx="204" cy="100" r="4" class="dg-dot"/>' +
        '<circle cx="258" cy="80" r="17" class="dg-vesicle"/><circle cx="258" cy="80" r="4" class="dg-dot"/>' +
        '<text x="110" y="124" class="dg-label">① 合成與儲存（囊泡）</text>' +
        '<rect x="360" y="126" width="30" height="14" rx="3" class="dg-channel"/>' +
        '<text x="332" y="112" class="dg-label">Ca²⁺ 通道</text>' +
        '<rect x="500" y="126" width="30" height="14" rx="3" class="dg-transporter"/>' +
        '<text x="470" y="112" class="dg-label">轉運蛋白</text>' +
        '<text x="40" y="164" class="dg-gap">突觸間隙（synaptic cleft，約 20~30 nm）</text>' +
        '<path d="M258 98 L258 172" class="dg-line" marker-end="url(#arr)"/>' +
        '<text x="268" y="150" class="dg-step">② 釋放（外排作用）</text>' +
        '<path d="M300 150 L300 176" class="dg-line" marker-end="url(#arr)"/>' +
        '<path d="M515 176 L515 146" class="dg-line" marker-end="url(#arr)"/>' +
        '<text x="436" y="168" class="dg-step">⑤ 再攝取</text>' +
        '<rect x="40" y="186" width="560" height="120" rx="18" class="dg-post"/>' +
        '<rect x="240" y="180" width="30" height="12" rx="3" class="dg-receptor"/>' +
        '<rect x="300" y="180" width="30" height="12" rx="3" class="dg-receptor"/>' +
        '<rect x="360" y="180" width="30" height="12" rx="3" class="dg-receptor"/>' +
        '<text x="300" y="214" class="dg-step">③ 結合後突觸受器</text>' +
        '<text x="60" y="290" class="dg-title">後突觸神經元（postsynaptic neuron）</text>' +
        '<text x="60" y="236" class="dg-label">④ 分離　⑥ 負回饋（自我受器／倒退傳遞物質）</text>' +
        '</svg>'
    }
  };

  /* ---------- 區塊渲染 ---------- */

  function renderTable(head, rows) {
    var thead = el("thead", null, [el("tr", null, head.map(function (h) {
      return el("th", { scope: "col", text: h });
    }))]);
    var tbody = el("tbody", null, rows.map(function (r) {
      return el("tr", null, r.map(function (cell, i) {
        var td = i === 0 ? el("th", { scope: "row" }) : el("td");
        td.appendChild(inline(cell));
        return td;
      }));
    }));
    return el("div", { class: "table-wrap", tabindex: "0", role: "region", "aria-label": "可左右捲動的表格" },
      [el("table", null, [thead, tbody])]);
  }

  function renderFlow(rows) {
    return el("div", { class: "flow" }, rows.map(function (row) {
      var chips = [];
      row.steps.forEach(function (s, i) {
        if (i > 0) chips.push(el("span", { class: "flow-arrow", "aria-hidden": "true", text: "→" }));
        chips.push(el("span", { class: "flow-chip", text: s }));
      });
      return el("div", { class: "flow-row" }, [
        el("strong", { class: "flow-label", text: row.label }),
        el("div", { class: "flow-steps" }, chips)
      ]);
    }));
  }

  function renderDiagram(id) {
    var d = DIAGRAMS[id];
    if (!d) return null;
    var fig = el("figure", { class: "diagram" });
    var box = el("div", { class: "diagram-box" });
    box.innerHTML = d.svg; // 內容為本檔固定的靜態 SVG，非使用者輸入
    fig.appendChild(box);
    fig.appendChild(el("figcaption", { text: d.caption }));
    return fig;
  }

  function renderBlock(b) {
    switch (b.t) {
      case "p": return withInline("p", b.text);
      case "ul": return el("ul", null, b.items.map(function (t) { return withInline("li", t); }));
      case "ol": return el("ol", null, b.items.map(function (t) { return withInline("li", t); }));
      case "table": return renderTable(b.head, b.rows);
      case "flow": return renderFlow(b.rows);
      case "diagram": return renderDiagram(b.id);
      case "callout":
        return el("aside", { class: "callout" }, [
          el("strong", { class: "callout-title", text: b.title }),
          withInline("p", b.text)
        ]);
      default: return null;
    }
  }

  /* ---------- 首頁 ---------- */

  function renderHome() {
    document.title = "NeuroQuest｜生理心理學冒險筆記";
    var chapters = NQ.chapters;
    if (!chapters || !chapters.length) return renderError("找不到章節資料。");

    var hero = el("section", { class: "hero" }, [
      el("h1", { class: "pixel-title", text: "NeuroQuest" }),
      el("p", { class: "lead", text: "把生理心理學筆記變成一場冒險：先讀懂每一章，再挑戰怪獸，累積你的星星。" })
    ]);

    var map = el("ol", { class: "map", "aria-label": "章節關卡" });
    chapters.forEach(function (ch, idx) {
      var open = ch.status === "open" && ch.noteData && NQ.notes && NQ.notes[ch.noteData];
      var li = el("li", { class: "stage-item" });
      var body = [];

      body.push(el("span", { class: "stage-no", text: "STAGE " + (idx + 1) }));
      if (open) body.push(monsterSVG(ch.monsterConfig && ch.monsterConfig.color));
      body.push(el("span", { class: "stage-title", text: ch.title }));
      body.push(el("span", { class: "stage-en", text: ch.englishTitle }));

      if (open) {
        var best = window.NQStorage ? window.NQStorage.getBestStars(ch.chapterId) : null;
        body.push(el("span", { class: "stage-status status-open", text: "已開放" }));
        body.push(best === null
          ? el("span", { class: "stage-stars", text: "尚未挑戰" })
          : el("span", { class: "stage-stars", "aria-label": "最佳星級 " + best + " / 3" }, [
              el("span", { class: "stars", "aria-hidden": "true", text: starsText(best) }),
              best === 0 ? " 已挑戰・尚未獲勝" : " 最佳 " + best + "/3"
            ]));
        li.appendChild(el("a", { class: "stage open", href: "#/chapter/" + ch.chapterId }, body));
      } else {
        body.push(el("span", { class: "stage-status status-locked", text: "Coming Soon" }));
        li.appendChild(el("div", { class: "stage locked", "aria-disabled": "true" }, body));
      }
      map.appendChild(li);
    });

    show([hero, el("h2", { class: "section-heading", text: "冒險地圖" }), map]);
  }

  /* ---------- 章節筆記頁 ---------- */

  function renderNotAvailable(ch) {
    document.title = "Coming Soon｜NeuroQuest";
    show([el("section", { class: "panel" }, [
      el("h1", { class: "pixel-title small", text: "Coming Soon" }),
      el("p", { text: ch ? "「" + ch.title + "」還在準備中，暫時無法進入。" : "找不到這個章節。" }),
      el("a", { class: "btn", href: "#/", text: "← 回到冒險地圖" })
    ])]);
  }

  function renderChapter(id) {
    var ch = findChapter(id);
    var note = ch && ch.status === "open" && ch.noteData && NQ.notes ? NQ.notes[ch.noteData] : null;
    if (!note) return renderNotAvailable(ch);

    document.title = note.title + "｜NeuroQuest";

    var back = el("a", { class: "back-link", href: "#/", text: "← 回到冒險地圖" });
    var header = el("header", { class: "note-header" }, [
      el("h1", { class: "pixel-title small", text: note.title }),
      el("p", { class: "en-title", text: note.englishTitle }),
      el("p", { class: "source-note", text: note.sourceNote })
    ]);

    /* 學習目標 */
    var objectives = el("section", { class: "panel" }, [
      el("h2", { text: "學習目標" }),
      el("ul", null, note.objectives.map(function (t) { return el("li", { text: t }); }))
    ]);

    /* 目錄 + 展開控制 */
    var detailsList = [];
    var toc = el("nav", { class: "toc panel", "aria-label": "章節目錄" }, [el("h2", { text: "目錄" })]);
    var tocList = el("ol", { class: "toc-list" });
    toc.appendChild(tocList);

    function setAll(openState) {
      detailsList.forEach(function (d) { d.open = openState; });
    }
    var controls = el("div", { class: "controls" }, [
      el("button", { type: "button", class: "btn small", text: "全部展開", onclick: function () { setAll(true); } }),
      el("button", { type: "button", class: "btn small", text: "全部收合", onclick: function () { setAll(false); } })
    ]);

    /* 筆記區塊 */
    var notesWrap = el("section", { class: "notes", "aria-label": "章節筆記" });
    var lastGroup = null;
    note.sections.forEach(function (s, i) {
      if (s.group !== lastGroup) {
        notesWrap.appendChild(el("h2", { class: "group-heading", text: s.group }));
        lastGroup = s.group;
      }
      var summaryChildren = [
        el("span", { class: "sec-no", text: s.no }),
        el("span", { class: "sec-title" }, [s.title, s.en ? el("small", { text: " " + s.en }) : null])
      ];
      var d = el("details", { class: "note-section", id: "sec-" + s.id, "data-section": s.id }, [
        el("summary", null, summaryChildren),
        el("div", { class: "note-body" }, s.blocks.map(renderBlock).filter(Boolean))
      ]);
      if (i === 0) d.open = true;
      detailsList.push(d);
      notesWrap.appendChild(d);

      tocList.appendChild(el("li", null, [
        el("button", { type: "button", class: "toc-link", onclick: function () {
          d.open = true;
          d.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        }}, [s.no + "　" + s.title])
      ]));
    });

    /* 易混淆概念比較 */
    var compWrap = el("section", { class: "notes", "aria-label": "易混淆概念比較" }, [
      el("h2", { class: "group-heading", text: "易混淆概念比較" })
    ]);
    note.comparisons.forEach(function (c) {
      var d = el("details", { class: "note-section" }, [
        el("summary", null, [el("span", { class: "sec-no", text: "VS" }), el("span", { class: "sec-title", text: c.title })]),
        el("div", { class: "note-body" }, [renderTable(c.head, c.rows)])
      ]);
      detailsList.push(d);
      compWrap.appendChild(d);
    });

    /* 章節重點整理 */
    var takeaways = el("section", { class: "panel" }, [
      el("h2", { text: "章節重點整理" }),
      el("ul", null, note.takeaways.map(function (t) { return el("li", { text: t }); }))
    ]);

    /* 開始怪獸挑戰 */
    var quizReady = ch.quizData && NQ.quizzes && NQ.quizzes[ch.quizData];
    var challenge = el("section", { class: "panel challenge" }, [
      el("h2", { text: "準備好了嗎？" }),
      el("p", { text: "不需要讀完全部內容也可以挑戰；隨時能回來重讀筆記。" }),
      quizReady
        ? el("a", { class: "btn primary", href: "#/quiz/" + ch.chapterId, text: "⚔ 開始怪獸挑戰" })
        : el("button", { type: "button", class: "btn primary", disabled: true, text: "⚔ 開始怪獸挑戰（尚未開放）" }),
      quizReady ? null : el("p", { class: "hint", text: "怪獸挑戰與測驗將在下一階段加入。" })
    ]);

    show([back, header, objectives, toc, controls, notesWrap, compWrap, takeaways, challenge]);
  }

  /* ---------- 測驗與怪獸戰鬥頁（Phase 3 答題＋Phase 4 戰鬥、星級、結算） ---------- */

  var LETTERS = ["A", "B", "C", "D"];
  // 以星級為索引的鼓勵訊息（失敗時不使用責備語氣）
  var RESULT_MESSAGES = [
    "沒關係！先看看下面的錯題，複習後再來挑戰吧。",
    "成功擊敗怪獸！想拿更多星星，可以先複習錯題再挑戰。",
    "優秀！再多答對一些就能拿到滿星。",
    "完美！全部答對，拿到最高的 3 顆星！"
  ];

  function sourceLabel(note, ref) {
    for (var i = 0; i < note.sections.length; i++) {
      if (note.sections[i].id === ref) return note.sections[i].no + " " + note.sections[i].title;
    }
    return ref;
  }

  function optionText(q, i) {
    return (q.type === "multiple_choice" ? LETTERS[i] + "． " : "") + q.options[i];
  }

  /** 怪獸面板：怪獸圖、HP 條、HP 文字。動畫只是加分，文字永遠是完整的回饋。 */
  function buildBattlePanel(cfg) {
    var B = window.NQBattle;
    var wrap = el("div", { class: "monster-wrap", "aria-hidden": "true" }, [monsterSVG(cfg.color)]);
    wrap.addEventListener("animationend", function (e) {
      if (e.animationName === "nq-hit") wrap.classList.remove("hit");
    });

    var linePos = (B.MAX_HP - B.VICTORY_THRESHOLD) / B.MAX_HP * 100;
    var fill = el("span", { class: "hp-fill" });
    var bar = el("div", {
      class: "hp-bar", role: "progressbar", "aria-label": cfg.name + " 的 HP",
      "aria-valuemin": "0", "aria-valuemax": String(B.MAX_HP)
    }, [
      fill,
      el("span", {
        class: "hp-line", "aria-hidden": "true", style: "left:" + linePos + "%",
        title: "HP 降到這條線以下（答對 " + B.VICTORY_THRESHOLD + " 題）即可擊敗"
      })
    ]);
    var hpText = el("p", { class: "hp-text" });
    var noteText = el("p", { class: "battle-note" });
    var root = el("section", { class: "panel battle", "aria-label": "怪獸戰鬥" }, [
      wrap,
      el("div", { class: "battle-info" }, [el("strong", { class: "monster-name", text: cfg.name }), bar, hpText, noteText])
    ]);

    function setHp(correct) {
      var hp = B.monsterHp(correct);
      fill.style.width = (hp / B.MAX_HP * 100) + "%";
      bar.setAttribute("aria-valuenow", String(hp));
      hpText.textContent = "HP " + hp + " / " + B.MAX_HP;
      noteText.textContent = B.evaluate(correct).victory
        ? "已達擊敗門檻！繼續作答可獲得更多星星。"
        : "答對 " + B.VICTORY_THRESHOLD + " 題即可擊敗怪獸。";
    }

    return {
      root: root,
      setHp: setHp,
      hit: function () {
        wrap.classList.remove("hit");
        void wrap.offsetWidth; // 重新觸發動畫
        wrap.classList.add("hit");
      },
      showResult: function (res) {
        setHp(res.correct);
        wrap.classList.add(res.victory ? "defeated" : "standing");
        hpText.textContent = "HP " + res.hp + " / " + B.MAX_HP + (res.victory ? "（已擊敗）" : "");
        noteText.textContent = res.victory
          ? "答對 " + res.correct + " 題，成功擊敗怪獸！"
          : "怪獸還站著，複習錯題後再來挑戰吧！";
      }
    };
  }

  function renderQuiz(id) {
    var ch = findChapter(id);
    var note = ch && ch.status === "open" && ch.noteData && NQ.notes ? NQ.notes[ch.noteData] : null;
    if (!ch || !note) return renderNotAvailable(ch);

    var quiz = ch.quizData && NQ.quizzes ? NQ.quizzes[ch.quizData] : null;
    if (!quiz || !window.NQQuiz || !window.NQBattle) {
      return show([el("section", { class: "panel" }, [
        el("h1", { class: "pixel-title small", text: "尚未開放" }),
        el("p", { text: "這一章的測驗還在準備中。" }),
        el("a", { class: "btn", href: "#/chapter/" + id, text: "← 回到筆記" })
      ])]);
    }

    var sectionIds = note.sections.map(function (s) { return s.id; });
    var errors = window.NQQuiz.validateQuiz(quiz, sectionIds);
    if (errors.length) {
      if (window.console) console.error("題庫驗證失敗：", errors);
      return renderError("題庫資料有問題，暫時無法開始挑戰。");
    }

    document.title = "怪獸挑戰｜" + note.title + "｜NeuroQuest";
    var cfg = {
      name: (ch.monsterConfig && ch.monsterConfig.name) || "怪獸",
      color: ch.monsterConfig && ch.monsterConfig.color
    };
    var questionsById = {};
    quiz.questions.forEach(function (q) { questionsById[q.id] = q; });

    var session = window.NQQuiz.createSession(quiz.questions);
    var box = el("div", { class: "quiz" });
    show([box]);

    function draw() {
      box.innerHTML = "";
      window.scrollTo(0, 0);
      if (session.isFinished()) drawResult();
      else drawQuestion();
    }

    function drawQuestion() {
      var q = session.current();
      var total = session.total;
      var n = session.position() + 1;
      var isMC = q.type === "multiple_choice";

      var top = el("div", { class: "quiz-top" }, [
        el("a", { class: "back-link", href: "#/chapter/" + id, text: "← 離開挑戰，回到筆記" }),
        el("p", { class: "quiz-progress", text: "第 " + n + " / " + total + " 題" }),
        el("div", {
          class: "progress-bar", role: "progressbar", "aria-label": "已完成題數",
          "aria-valuemin": "0", "aria-valuemax": String(total), "aria-valuenow": String(n - 1)
        }, [el("span", { class: "progress-fill", style: "width:" + Math.round((n - 1) / total * 100) + "%" })])
      ]);

      var battle = buildBattlePanel(cfg);
      battle.setHp(session.correctCount());

      var tag = el("span", { class: "q-tag", text: isMC ? "選擇題" : "是非題" });
      var heading = el("h2", { class: "question-text", id: "question-text", tabindex: "-1", text: q.question });

      var submitBtn = el("button", { type: "button", class: "btn primary", disabled: true, text: "確認答案" });
      var actions = el("div", { class: "quiz-actions" }, [submitBtn]);
      var feedbackSlot = el("div", { class: "feedback-slot" });

      var group = el("div", { class: "options", role: "radiogroup", "aria-labelledby": "question-text" });
      var inputs = [];
      var labels = [];
      q.options.forEach(function (text, i) {
        var input = el("input", { type: "radio", name: "answer", id: "opt-" + i, value: String(i) });
        input.addEventListener("change", function () {
          if (session.select(i)) submitBtn.disabled = false;
        });
        var label = el("label", { class: "option", "for": "opt-" + i }, [
          input,
          isMC ? el("span", { class: "option-key", text: LETTERS[i] }) : null,
          el("span", { class: "option-text", text: text }),
          el("span", { class: "option-mark" })
        ]);
        inputs.push(input);
        labels.push(label);
        group.appendChild(label);
      });

      submitBtn.addEventListener("click", function () {
        var r = session.submit();
        if (!r) return;

        inputs.forEach(function (inp) { inp.disabled = true; });
        labels.forEach(function (lb, i) {
          var mark = lb.querySelector(".option-mark");
          if (i === r.correctAnswer) {
            lb.classList.add("is-correct");
            mark.textContent = i === r.selected ? "✔ 你的選擇・正確" : "✔ 正確答案";
          } else if (i === r.selected) {
            lb.classList.add("is-wrong");
            mark.textContent = "✘ 你的選擇";
          }
        });

        if (r.correct) { // 答對才扣血；答錯 HP 不變
          battle.setHp(session.correctCount());
          battle.hit();
        }

        var fb = el("div", {
          class: "feedback " + (r.correct ? "is-correct" : "is-wrong"), role: "status", tabindex: "-1"
        }, [
          el("strong", { class: "feedback-title", text: r.correct ? "✔ 答對了！怪獸受到 1 點傷害" : "✘ 答錯了，怪獸 HP 不變" }),
          el("p", null, [el("strong", { text: "正確答案：" }), optionText(q, r.correctAnswer)]),
          el("p", null, [el("strong", { text: "詳解：" }), r.explanation]),
          el("p", { class: "source-ref", text: "對應筆記：" + sourceLabel(note, q.sourceRef) })
        ]);
        feedbackSlot.appendChild(fb);

        var last = session.position() + 1 === total;
        var nextBtn = el("button", {
          type: "button", class: "btn primary", text: last ? "完成挑戰" : "下一題 →",
          onclick: function () { if (session.next()) draw(); }
        });
        actions.innerHTML = "";
        actions.appendChild(nextBtn);
        fb.focus();
      });

      box.appendChild(top);
      box.appendChild(battle.root);
      box.appendChild(el("section", { class: "panel question-card" }, [tag, heading, group, feedbackSlot, actions]));
      heading.focus();
    }

    /** 錯題項目：題幹、你的答案、正確答案、詳解、對應筆記 */
    function buildWrongItem(order, q, selected) {
      return el("li", { class: "wrong-item" }, [
        el("h3", { text: "第 " + order + " 題（" + (q.type === "multiple_choice" ? "選擇題" : "是非題") + "）" }),
        el("p", { class: "wrong-question", text: q.question }),
        el("p", null, [el("strong", { text: "你的答案：" }), optionText(q, selected)]),
        el("p", null, [el("strong", { text: "正確答案：" }), optionText(q, q.correctAnswer)]),
        el("p", null, [el("strong", { text: "詳解：" }), q.explanation]),
        el("p", { class: "source-ref", text: "對應筆記：" + sourceLabel(note, q.sourceRef) })
      ]);
    }

    function drawResult() {
      var res = window.NQBattle.evaluate(session.correctCount());

      // 先取舊紀錄再存新成績：最佳星級只升不降（由 NQStorage 保證）
      var prev = window.NQStorage ? window.NQStorage.getBestStars(id) : null;
      var best = window.NQStorage ? window.NQStorage.saveResult(id, res.stars) : res.stars;
      if (best === null || best === undefined) best = res.stars;
      var isNewRecord = res.victory && (prev === null || res.stars > prev);

      var battle = buildBattlePanel(cfg);
      battle.showResult(res);

      var title = el("h1", {
        class: "pixel-title small result-label", tabindex: "-1",
        text: res.victory ? res.label : "挑戰失敗"
      });

      var starRow = el("div", { class: "result-stars", role: "img", "aria-label": "本次獲得 " + res.stars + " 顆星，滿分 3 顆" });
      for (var s = 0; s < 3; s++) {
        var on = s < res.stars;
        starRow.appendChild(el("span", {
          class: "star " + (on ? "on" : "off"), "aria-hidden": "true", text: on ? "★" : "☆",
          style: on ? "animation-delay:" + (0.3 + s * 0.25) + "s" : null
        }));
      }

      var summary = el("section", { class: "panel result" + (res.victory ? "" : " is-fail") }, [
        title,
        starRow,
        el("p", { class: "result-message", text: RESULT_MESSAGES[res.stars] }),
        el("p", { class: "result-score" }, ["答對 ", el("strong", { text: String(res.correct) }), " / " + session.total + " 題"]),
        el("p", { class: "result-line result-this" }, ["本次星級：", el("span", { class: "stars", "aria-hidden": "true", text: starsText(res.stars) }), " " + res.stars + " / 3"]),
        el("p", { class: "result-line result-best" }, [
          "歷史最佳：", el("span", { class: "stars", "aria-hidden": "true", text: starsText(best) }), " " + best + " / 3",
          isNewRecord ? el("span", { class: "new-record", text: "新紀錄！" }) : null
        ]),
        el("div", { class: "quiz-actions" }, [
          el("button", { type: "button", class: "btn primary", text: "再挑戰一次", onclick: function () { renderQuiz(id); window.scrollTo(0, 0); } }),
          el("a", { class: "btn", href: "#/chapter/" + id, text: "回到筆記" }),
          el("a", { class: "btn", href: "#/", text: "回到首頁" })
        ])
      ]);

      var review = el("section", { class: "panel review" }, [el("h2", { text: "錯題回顧" })]);
      var wrongList = el("ol", { class: "wrong-list" });
      session.records().forEach(function (r, i) {
        if (!r.correct) wrongList.appendChild(buildWrongItem(i + 1, questionsById[r.id], r.selected));
      });
      if (wrongList.children.length) {
        review.appendChild(el("p", { class: "hint", text: "共 " + wrongList.children.length + " 題答錯，建議對照筆記複習。" }));
        review.appendChild(wrongList);
      } else {
        review.appendChild(el("p", { class: "all-correct", text: "太棒了！這一輪沒有錯題。" }));
      }

      box.appendChild(battle.root);
      box.appendChild(summary);
      box.appendChild(review);
      title.focus();
    }

    draw();
  }

  /* ---------- 錯誤與路由 ---------- */

  function renderError(msg) {
    show([el("section", { class: "panel" }, [
      el("h1", { class: "pixel-title small", text: "發生問題" }),
      el("p", { text: msg || "頁面載入時發生錯誤，請重新整理頁面。" }),
      el("a", { class: "btn", href: "#/", text: "回到首頁" })
    ])]);
  }

  function route() {
    var hash = window.location.hash || "#/";
    var m = hash.match(/^#\/chapter\/([\w-]+)$/);
    var qm = hash.match(/^#\/quiz\/([\w-]+)$/);
    try {
      if (m) renderChapter(m[1]);
      else if (qm) renderQuiz(qm[1]);
      else renderHome();
    } catch (e) {
      if (window.console) console.error(e);
      renderError();
    }
    window.scrollTo(0, 0);
    app.focus();
  }

  window.addEventListener("hashchange", route);
  route();
})();
