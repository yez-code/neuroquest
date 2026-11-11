/*
 * 章節清單。
 * 每章欄位：chapterId, title, englishTitle, status('open' | 'coming-soon'),
 *           noteData, quizData, monsterConfig
 * 新增章節：1) 建立 data/notes/xxx.js 並註冊到 window.NQ.notes
 *           2) 在下方加入一筆資料 3) 在 index.html 加入對應 <script>
 */
window.NQ = window.NQ || { notes: {}, quizzes: {} };

window.NQ.chapters = [
  {
    chapterId: "synapses",
    title: "突觸與神經傳遞",
    englishTitle: "Synapses",
    status: "open",
    noteData: "synapses",   // 對應 NQ.notes["synapses"]
    quizData: "synapses",    // 對應 NQ.quizzes["synapses"]
    monsterConfig: { name: "突觸史萊姆", hp: 10, color: "#7bc9a6" }
  },
  {
    chapterId: "locked-1",
    title: "未知區域 I",
    englishTitle: "???",
    status: "coming-soon",
    noteData: null,
    quizData: null,
    monsterConfig: null
  },
  {
    chapterId: "locked-2",
    title: "未知區域 II",
    englishTitle: "???",
    status: "coming-soon",
    noteData: null,
    quizData: null,
    monsterConfig: null
  },
  {
    chapterId: "locked-3",
    title: "未知區域 III",
    englishTitle: "???",
    status: "coming-soon",
    noteData: null,
    quizData: null,
    monsterConfig: null
  }
];
