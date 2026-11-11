/*
 * 第一章題庫：突觸與神經傳遞（Synapses）
 * 結構：4 題是非 + 6 題四選一；5 題基礎 + 5 題應用（兩個維度各自符合數量）。
 * 分配：是非 基礎 2 / 應用 2；選擇 基礎 3 / 應用 3。
 * sourceRef 對應 data/notes/synapses.js 的 section id，方便核對。
 * 注意：題目與詳解尚待人工核對，核對前不應視為正式內容。
 */
window.NQ = window.NQ || { notes: {}, quizzes: {} };

window.NQ.quizzes.synapses = {
  chapterId: "synapses",
  questions: [
    {
      id: "syn-001",
      type: "true_false",
      level: "basic",
      question: "Sherrington 發現反射弧的衝動傳導速度比沿單一軸突傳導的速度慢，因此推論突觸處存在突觸延遲。",
      options: ["正確", "錯誤"],
      correctAnswer: 0,
      explanation: "反射弧的傳導速度（約 15 m/s 或更低）遠慢於沿單一軸突傳導的速度（約 40 m/s）。Sherrington 因此推論神經元交界處存在減緩傳導的過程，即突觸延遲（synaptic delay）。",
      sourceRef: "synapses-section-02"
    },
    {
      id: "syn-002",
      type: "true_false",
      level: "basic",
      question: "興奮性後突觸電位（EPSP）是氯離子（Cl⁻）進入細胞所造成的過極化。",
      options: ["正確", "錯誤"],
      correctAnswer: 1,
      explanation: "EPSP 是鈉離子（Na⁺）進入細胞導致的局部去極化。氯離子（Cl⁻）進入細胞造成過極化的，是抑制性後突觸電位（IPSP）。",
      sourceRef: "synapses-section-03"
    },
    {
      id: "syn-003",
      type: "true_false",
      level: "application",
      question: "某神經元完全沒有接收到任何突觸輸入，因此一定不會產生動作電位。",
      options: ["正確", "錯誤"],
      correctAnswer: 1,
      explanation: "多數神經元在沒有突觸輸入時，仍會週期性地產生動作電位（自發衝動率）。EPSP 會提高發射頻率，IPSP 則降低發射頻率。",
      sourceRef: "synapses-section-05"
    },
    {
      id: "syn-004",
      type: "true_false",
      level: "application",
      question: "實驗者在狗的皮膚兩個不同位置，同時給予兩個單獨都不足以引發反射的微弱刺激，結果出現了反射。這個現象可以用空間累加解釋。",
      options: ["正確", "錯誤"],
      correctAnswer: 0,
      explanation: "來自不同位置的多個前突觸軸突把訊號匯聚到同一個後突觸細胞，各自產生的 EPSP 在空間上疊加後達到閾值，就能引發反應，這就是空間累加。",
      sourceRef: "synapses-section-04"
    },
    {
      id: "syn-005",
      type: "multiple_choice",
      level: "basic",
      question: "下列何者是腦中最主要的抑制性神經傳遞物質？",
      options: ["麩胺酸（glutamate）", "γ-胺基丁酸（GABA）", "乙醯膽鹼（ACh）", "多巴胺（dopamine）"],
      correctAnswer: 1,
      explanation: "GABA 是腦中最主要的抑制性傳遞物質；麩胺酸則是腦中最主要的興奮性傳遞物質。",
      sourceRef: "synapses-section-09"
    },
    {
      id: "syn-006",
      type: "multiple_choice",
      level: "basic",
      question: "在突觸化學事件中，下列哪一個步驟直接引發神經傳遞物質的外排作用（exocytosis）？",
      options: [
        "鈉離子經離子通道進入後突觸細胞",
        "鈣離子經電壓門控鈣離子通道進入軸突末梢",
        "轉運蛋白將傳遞物質搬回前突觸神經元",
        "自我受器感應到傳遞物質"
      ],
      correctAnswer: 1,
      explanation: "動作電位傳至軸突末梢，去極化使電壓門控鈣離子通道開啟，鈣離子（Ca²⁺）進入末梢，引發外排作用，把傳遞物質釋放到突觸間隙。",
      sourceRef: "synapses-section-08"
    },
    {
      id: "syn-007",
      type: "multiple_choice",
      level: "basic",
      question: "下列何者負責分解乙醯膽鹼（ACh）？",
      options: ["單胺氧化酶（MAO）", "乙醯膽鹼酯酶（AChE）", "G 蛋白", "轉運蛋白"],
      correctAnswer: 1,
      explanation: "乙醯膽鹼被乙醯膽鹼酯酶（AChE）分解為乙酸鹽（acetate）與膽鹼（choline），膽鹼再被前突觸神經元回收。單胺氧化酶（MAO）分解的是單胺類。",
      sourceRef: "synapses-section-15"
    },
    {
      id: "syn-008",
      type: "multiple_choice",
      level: "application",
      question: "某藥物能阻斷多巴胺的轉運蛋白。服用後，突觸間隙中的多巴胺最可能出現什麼變化？",
      options: [
        "被回收的速度變慢，作用時間延長",
        "被回收的速度變快，作用時間縮短",
        "被乙醯膽鹼酯酶迅速分解",
        "合成立即停止，濃度降為零"
      ],
      correctAnswer: 0,
      explanation: "再攝取是由轉運蛋白把傳遞物質搬回前突觸細胞。安非他命與可卡因就是阻斷轉運蛋白、抑制再攝取，使傳遞物質作用時間延長。",
      sourceRef: "synapses-section-15"
    },
    {
      id: "syn-009",
      type: "multiple_choice",
      level: "application",
      question: "若要傳遞視覺這類需要精確且快速的時間訊息，下列哪一種後突觸作用方式最適合？",
      options: [
        "離子型效應：配體直接開啟離子通道，作用極快、持續短",
        "代謝型效應：經 G 蛋白啟動第二信使，作用慢而持久",
        "神經調控物質擴散到廣大區域，漸進地作用",
        "荷爾蒙經血液運送到全身，影響遠端目標"
      ],
      correctAnswer: 0,
      explanation: "離子型效應極快（< 1 ms）、持續時間短、作用範圍侷限，適合視覺、聽覺等需要精確且快速時間訊息的感官。代謝型效應較慢而久，適合味覺、嗅覺、痛覺、情緒等長時效功能。",
      sourceRef: "synapses-section-12"
    },
    {
      id: "syn-010",
      type: "multiple_choice",
      level: "application",
      question: "一個後突觸神經元同時接收到來自多個軸突的興奮性與抑制性輸入。決定它是否發射動作電位的關鍵是什麼？",
      options: [
        "只看其中最大的一個 EPSP",
        "EPSP 與 IPSP 的代數和是否超過閾值",
        "只要出現任何一個 IPSP，就一定不會發射",
        "只看輸入軸突的總數量"
      ],
      correctAnswer: 1,
      explanation: "後突觸神經元像決策者，在任何時刻都在整合競爭中的 EPSP 與 IPSP，其代數和（combined effect）決定是否發射動作電位。",
      sourceRef: "synapses-section-06"
    }
  ]
};
