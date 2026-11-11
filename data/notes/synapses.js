/*
 * 第一章筆記資料：突觸與神經傳遞（Synapses）
 * 來源：個人課堂筆記《生心第二章：突觸（Synapses）筆記》（Kalat, Biological Psychology 14th）
 * 注意：內容整理自使用者提供的筆記，尚待人工逐段核對。
 * 區塊類型：p / ul / ol / table / flow / diagram / callout
 * 行內 **文字** 會顯示為粗體。
 * sectionId（synapses-section-NN）為穩定識別值，題庫的 sourceRef 會對應到這裡。
 */
window.NQ = window.NQ || { notes: {}, quizzes: {} };

window.NQ.notes.synapses = {
  chapterId: "synapses",
  title: "突觸與神經傳遞",
  englishTitle: "Synapses",
  sourceNote: "整理自課堂筆記「生心第二章：突觸（Synapses）」。",

  objectives: [
    "說明突觸概念的發現過程，以及 Sherrington 推論出的突觸特性。",
    "區分 EPSP 與 IPSP、時間累加與空間累加，並理解神經元如何整合訊號。",
    "依序描述突觸化學事件的完整步驟。",
    "辨識神經傳遞物質的類別、合成前驅物與藥物對合成的影響。",
    "比較離子型與代謝型效應、神經傳遞物質與神經調控物質。",
    "說明再攝取、酶分解、負回饋與常見藥物的作用方式。",
    "比較電學突觸與化學突觸，並說明荷爾蒙與下視丘—腦下腺的關係。"
  ],

  sections: [
    /* ===================== 2.1 突觸的概念 ===================== */
    {
      id: "synapses-section-01",
      group: "2.1 突觸的概念（The Concept of the Synapse）",
      no: "01",
      title: "突觸的發現與反射弧",
      blocks: [
        { t: "ul", items: [
          "**細胞獨立性：** Santiago Ramón y Cajal 在解剖學上證實神經元之間存在微小的間隙（gap）。",
          "**突觸一詞：** Charles Scott Sherrington（1906）從生理學角度證明神經元在稱為**突觸（synapse）**的接合處進行溝通，並提出「突觸」一詞。"
        ]},
        { t: "ul", items: [
          "**反射（reflexes）：** 對刺激產生的自動化肌肉反應。",
          "**反射弧（reflex arc）：** 感覺神經元（sensory neuron）→ 中間神經元（intrinsic neuron / interneuron）→ 運動神經元（motor neuron）→ 肌肉（muscle）的反應線路。"
        ]},
        { t: "callout", title: "Sherrington 的脊髓反射實驗",
          text: "將狗固定於背帶，夾其足部引發抬腿（屈曲反射，leg flexion reflex）及其他腿伸展。將脊髓與大腦切斷後，反射依然存在且更一致，說明大腦傳下的訊息會修飾、增強或減弱反射。" }
      ]
    },
    {
      id: "synapses-section-02",
      group: "2.1 突觸的概念（The Concept of the Synapse）",
      no: "02",
      title: "突觸傳導延遲",
      en: "Delayed Transmission at the Synapse",
      blocks: [
        { t: "ul", items: [
          "**現象：** 反射弧的衝動傳導速度（約 15 m/s 或更低）遠慢於單一沿著神經纖維（軸突，axon）傳導的速度（約 40 m/s）。",
          "**推論：** 神經元與神經元交界處（突觸）存在某種減緩傳導速度的過程，即**突觸延遲（synaptic delay）**。"
        ]}
      ]
    },
    {
      id: "synapses-section-03",
      group: "2.1 突觸的概念（The Concept of the Synapse）",
      no: "03",
      title: "時間累加與 Eccles 的證實",
      en: "Temporal Summation",
      blocks: [
        { t: "ul", items: [
          "**現象：** 單一微弱刺激（次閾值刺激，subthreshold stimulus）無法引發反射，但在短時間內連續多次給予相同微弱刺激即可引發反應。"
        ]},
        { t: "p", text: "**機制：**" },
        { t: "ul", items: [
          "**前突觸神經元（presynaptic neuron）**傳送訊號，**後突觸神經元（postsynaptic neuron）**接收訊號。",
          "單一次閾值激發會隨時間衰減，但若第二次激發緊接而來，其效果會與前次殘留效果相加，超過閾值（threshold）即產生動作電位（action potential）。"
        ]},
        { t: "p", text: "**John Eccles 的生理學證實（1964）：**" },
        { t: "ul", items: [
          "Eccles 為 Sherrington 的學生，使用微電極（microelectrode）記錄後突觸細胞，發現後突觸膜產生的電位屬於**階梯電位（graded potential）**。",
          "**興奮性後突觸電位（EPSP, Excitatory Postsynaptic Potential）：** 鈉離子（sodium ions, Na⁺）進入細胞導致的局部去極化（depolarization）。",
          "**抑制性後突觸電位（IPSP, Inhibitory Postsynaptic Potential）：** 負電荷氯離子（chloride ions, Cl⁻）進入細胞導致的過極化（hyperpolarization）。",
          "時間累加即為多個 EPSP 在短時間內連續累積達到閾值的過程。"
        ]}
      ]
    },
    {
      id: "synapses-section-04",
      group: "2.1 突觸的概念（The Concept of the Synapse）",
      no: "04",
      title: "空間累加",
      en: "Spatial Summation",
      blocks: [
        { t: "ul", items: [
          "**現象：** 在不同位置同時給予兩個單獨均不足以引發反射的微弱刺激，兩者同時作用可引發反射。",
          "**機制：** 來自不同空間位置的多個前突觸軸突將訊號匯聚（converge）至同一個後突觸細胞，各軸突產生的 EPSP 在空間上疊加後達到閾值。",
          "時間累加與空間累加通常在神經元接收連續且多來源的輸入時同時發生。"
        ]}
      ]
    },
    {
      id: "synapses-section-05",
      group: "2.1 突觸的概念（The Concept of the Synapse）",
      no: "05",
      title: "抑制性突觸與抑制功能",
      en: "Inhibitory Synapses & Inhibition",
      blocks: [
        { t: "ul", items: [
          "**反射肌肉協調：** 當肢體受到刺激抬起時，**屈肌（flexor muscles）收縮，同側伸肌（extensor muscles）放鬆**；同時，其他三隻腿的伸肌收縮、屈肌放鬆以維持平衡。",
          "**神經迴路推論：** 感覺神經元興奮脊髓的中間神經元，該中間神經元一方面興奮屈肌的運動神經元，另一方面透過**抑制性突觸（inhibitory synapse）**抑制伸肌的運動神經元。",
          "**抑制的生理本質：** 過極化（hyperpolarization, IPSP），使膜電位遠離閾值，降低產生動作電位的機率。",
          "**自發衝動率（Spontaneous Firing Rate）：** 多數神經元在沒有突觸輸入時仍會週期性產生動作電位。EPSP 會提高發射頻率，IPSP 則降低發射頻率。",
          "**重要性：** 抑制作用並非僅是「缺乏興奮」，而是神經系統中的主動煞車（active brake）。"
        ]}
      ]
    },
    {
      id: "synapses-section-06",
      group: "2.1 突觸的概念（The Concept of the Synapse）",
      no: "06",
      title: "EPSP、IPSP 與動作電位的整合",
      blocks: [
        { t: "ul", items: [
          "**神經元作為決策者（The Neuron as Decision Maker）：** 後突觸神經元在任何時刻皆在整合競爭中的 EPSP 與 IPSP，其代數和（combined effect）決定是否發射動作電位。",
          "**神經線路（Wiring Diagram）運算：** 興奮與抑制傳播的時間差（如透過一個突觸 vs 兩個突觸）可調節反應時間與爆發性刺激（burst of excitation）。",
          "簡單線路可實現邏輯閘功能：閾值為 1 時代表「A 或 B」；閾值為 2 時代表「A 及 B」。",
          "真實突觸更為複雜：效應時間長短不同、突觸大小與強度不同、非線性累加、受情境改變等。"
        ]}
      ]
    },

    /* ===================== 2.2 突觸的化學事件 ===================== */
    {
      id: "synapses-section-07",
      group: "2.2 突觸的化學事件（Chemical Events at the Synapse）",
      no: "07",
      title: "化學傳導的發現歷程",
      blocks: [
        { t: "ul", items: [
          "**T. R. Elliott（1905）：** 發現將腎上腺素（adrenaline）直接施加於心臟、胃部或瞳孔，其效果與**交感神經系統（sympathetic nervous system）**刺激相同，推測交感神經透過釋放腎上腺素類化學物質傳遞訊息。",
          "**Otto Loewi（1920）蛙心實驗：** 刺激青蛙的迷走神經（vagus nerve），使心跳減慢；將其心臟周圍液體轉移至第二顆青蛙心臟，第二顆心跳亦減慢。刺激第一顆心的加速神經（accelerator nerve），使心跳加快；轉移液體後，第二顆心跳亦加快。證實神經透過釋放化學物質（chemical transmission）傳遞訊息。",
          "**1950 年代：** 研究證實化學傳導為神經系統中最主要的傳遞方式，為精神藥物學（psychiatric drugs）奠定基礎。"
        ]}
      ]
    },
    {
      id: "synapses-section-08",
      group: "2.2 突觸的化學事件（Chemical Events at the Synapse）",
      no: "08",
      title: "突觸化學事件的完整步驟",
      blocks: [
        { t: "ol", items: [
          "**合成（Synthesis）：** 神經元在細胞體（cell body / soma）或軸突末梢（presynaptic terminal）合成神經傳遞物質。",
          "**釋放（Release / Exocytosis）：** 動作電位傳至軸突末梢，去極化使電壓門控鈣離子通道（voltage-dependent calcium channels）開啟，鈣離子（Ca²⁺）進入末梢，引發外排作用（exocytosis），將神經傳遞物質釋放至突觸間隙（synaptic cleft）（寬度約 20~30 nm，擴散時間少於 0.01 ms）。",
          "**受器結合（Binding to Receptors）：** 傳遞物質擴散跨越間隙，結合至**後突觸受器（postsynaptic receptors）**並改變後突觸神經元活性。",
          "**分離（Separation）：** 傳遞物質與受器分離。",
          "**不活化與再攝取（Inactivation & Reuptake）：** 傳遞物質透過**轉運蛋白（transporter proteins）**被回收（再攝取）至前突觸神經元重新利用，或被酵素分解、擴散離開。",
          "**負回饋調節（Negative Feedback）：** 後突觸細胞釋放倒退傳遞物質（retrograde transmitters），或透過前突觸的**自我受器（autoreceptors）**調控後續釋放量。"
        ]},
        { t: "diagram", id: "chemical-synapse" },
        { t: "callout", title: "筆記圖示補充：傳遞物質在突觸間隙之後的 4 個結果",
          text: "① 再攝取（Reuptake）　② 酶分解（Enzymatic destruction）　③ 擴散（Diffusion）　④ 脫敏作用（Desensitization）。（整理自筆記旁的手寫與圖示，請對照原筆記確認。）" }
      ]
    },
    {
      id: "synapses-section-09",
      group: "2.2 突觸的化學事件（Chemical Events at the Synapse）",
      no: "09",
      title: "神經傳遞物質與神經調控物質的分類",
      en: "Types of Neurotransmitters & Neuromodulators（Table 2.1）",
      blocks: [
        { t: "table",
          head: ["類別", "代表物質", "補充"],
          rows: [
            ["**胺基酸類**（Amino Acids）", "**麩胺酸（glutamate）**、**γ-胺基丁酸（GABA）**、**甘胺酸（glycine）**、天門冬胺酸（aspartate）", "麩胺酸：腦中最主要的興奮性傳遞物質。GABA：腦中最主要的抑制性傳遞物質。甘胺酸：主要存在於脊髓的抑制性傳遞物質。"],
            ["**修飾型胺基酸**（A Modified Amino Acid）", "**乙醯膽鹼（acetylcholine, ACh）**", "筆記手寫補充：交感神經的節前纖維（preganglionic fiber of sympathetic）釋放 ACh。"],
            ["**單胺類**（Monoamines，由胺基酸修飾而來）", "吲哚胺類（Indoleamines）：**血清素（serotonin / 5-HT）**。兒茶酚胺類（Catecholamines）：**多巴胺（dopamine）**、**去甲腎上腺素（norepinephrine）**、**腎上腺素（epinephrine）**", "三種兒茶酚胺皆含有兒茶酚基與胺基。"],
            ["**神經肽類**（Neuropeptides）", "內啡肽（endorphins）、P 物質（substance P）、神經肽 Y（neuropeptide Y）等", "胺基酸鏈。"],
            ["**嘌呤類**（Purines）", "三磷酸腺苷（ATP）、腺苷（adenosine）", ""],
            ["**氣體類**（Gases）", "**一氧化氮（nitric oxide, NO）**", "由許多小型區域神經元（local neurons）在需要時立即合成並釋放（不儲存於囊泡中），能使附近血管舒張以增加局部血流量。"]
          ]
        },
        { t: "callout", title: "演化註記",
          text: "櫛水母（ctenophores）僅具備麩胺酸一種神經傳遞物質。" },
        { t: "callout", title: "筆記手寫補充：區域神經元（local neurons）的特性",
          text: "1. 體積微小、無軸突（axon），僅與直接相鄰的神經元通訊。2. 不產生動作電位，不遵循全有全無律（all-or-none law）。3. 產生階梯電位（graded potential）。" }
      ]
    },
    {
      id: "synapses-section-10",
      group: "2.2 突觸的化學事件（Chemical Events at the Synapse）",
      no: "10",
      title: "神經傳遞物質的合成與飲食前驅物",
      en: "Synthesis of Transmitters",
      blocks: [
        { t: "ul", items: [
          "**乙醯膽鹼（ACh）：** 由**膽鹼（choline，存在於牛奶、蛋、花生）**合成（投影片：乙醯輔酶 A + 膽鹼 → 乙醯膽鹼）。",
          "**兒茶酚胺類（Catecholamines）：** 苯丙胺酸（phenylalanine）→ 酪胺酸（tyrosine，存在於蛋白質）→ 多巴（Dopa）→ 多巴胺 → 去甲腎上腺素 → 腎上腺素。",
          "**血清素（Serotonin）：** 由色胺酸（tryptophan，存在於黃豆等）合成。色胺酸透過特殊運送系統跨越血腦障壁（blood-brain barrier），但需與苯丙胺酸等競爭。食用碳水化合物會促進**胰島素（insulin）**釋放，將其他競爭性胺基酸抽離血液進入細胞，從而增加色胺酸進入腦部的比例。"
        ]},
        { t: "flow", rows: [
          { label: "乙醯膽鹼", steps: ["乙醯輔酶 A + 膽鹼", "乙醯膽鹼（ACh）"] },
          { label: "兒茶酚胺類", steps: ["苯丙胺酸", "酪胺酸", "多巴（Dopa）", "多巴胺", "去甲腎上腺素", "腎上腺素"] },
          { label: "血清素", steps: ["色胺酸", "5-羥色胺酸（5-hydroxytryptophan）", "血清素（5-HT）"] }
        ]},
        { t: "p", text: "**藥物對合成的影響：**" },
        { t: "ul", items: [
          "**L-dopa：** 多巴胺的前驅物，可增加多巴胺供給，用於治療帕金森氏症（Parkinson's disease）。",
          "**AMPT（alpha-methyl-para-tyrosine）：** 阻斷多巴胺合成（研究工具）。"
        ]}
      ]
    },
    {
      id: "synapses-section-11",
      group: "2.2 突觸的化學事件（Chemical Events at the Synapse）",
      no: "11",
      title: "儲存與釋放",
      en: "Storage and Release",
      blocks: [
        { t: "ol", items: [
          "**囊泡（Vesicles）：** 軸突末梢將高濃度的神經傳遞物質儲存於微小的球狀囊泡中（一氧化氮除外，合成後即釋放）。",
          "**鈣離子觸發：** 動作電位到達末梢使電壓門控鈣離子通道開啟，Ca²⁺ 進入細胞引發外排作用（exocytosis）。",
          "**共釋放（Co-release）：** 多數神經元會同時釋放兩種或以上的傳遞物質（例如同時釋放興奮性與抑制性傳遞物質）。"
        ]}
      ]
    },
    {
      id: "synapses-section-12",
      group: "2.2 突觸的化學事件（Chemical Events at the Synapse）",
      no: "12",
      title: "後突觸效應：離子型受器 vs. 代謝型受器",
      en: "Ionotropic vs. Metabotropic Effects",
      blocks: [
        { t: "p", text: "**離子型效應（Ionotropic Effects）：**" },
        { t: "ul", items: [
          "**配體門控通道（transmitter-gated / ligand-gated channels）：** 神經傳遞物質（配體）結合後，受器扭轉並開啟中央離子通道。（筆記手寫補充：transmitter/ligand-gated channel 的開啟取決於神經傳導物質的激發；voltage-gated channel 取決於膜電位變化。）",
          "**特徵：** 作用極快（< 1 ms）、持續時間短（半衰期約 5 ms）、作用範圍侷限。",
          "**興奮性：** 麩胺酸（glutamate）開啟鈉離子（Na⁺）通道。",
          "**抑制性：** GABA 開啟氯離子（Cl⁻）通道；甘胺酸（glycine）存在於脊髓。",
          "**乙醯膽鹼受器：** 結合後構型改變展開，擴大鈉離子通道。",
          "**功能：** 適用於視覺、聽覺等需要精確且快速時間訊息的感官。"
        ]},
        { t: "p", text: "**代謝型效應與第二信使系統（Metabotropic Effects & Second Messenger Systems）：**" },
        { t: "ul", items: [
          "**機制：** 傳遞物質結合至受器導致受器蛋白彎曲，釋放細胞膜內側連結的 **G 蛋白（G protein，偶聯 GTP 的蛋白質）**。G 蛋白游離後活化細胞內的**第二信使（second messenger）**（如環腺苷單磷酸，cyclic AMP / cAMP）。",
          "**第二信使功能：** 開啟或關閉離子通道、改變細胞代謝路徑、活化或不活化染色體基因。",
          "**特徵：** 反應較慢（≥ 100 ms）、持續時間長（數秒至數分鐘，神經肽可達 20 分鐘以上）、作用範圍遍及全細胞。",
          "**常見傳遞物質：** 多巴胺、去甲腎上腺素、血清素、神經肽，有時亦包含麩胺酸與 GABA。",
          "**功能：** 適用於味覺、嗅覺、痛覺、警覺（arousal）、注意力、飢餓、渴覺及情緒等長時效功能。"
        ]}
      ]
    },
    {
      id: "synapses-section-13",
      group: "2.2 突觸的化學事件（Chemical Events at the Synapse）",
      no: "13",
      title: "神經傳遞物質 vs. 神經調控物質／神經肽",
      en: "Neurotransmitters vs. Neuromodulators / Neuropeptides（Table 2.2）",
      blocks: [
        { t: "table",
          head: ["項目", "神經傳遞物質（Neurotransmitters）", "神經調控物質／神經肽（Neuromodulators / Neuropeptides）"],
          rows: [
            ["釋放位置", "軸突末梢", "細胞體、樹突（dendrites）及軸突（axon）側邊"],
            ["受器分佈", "緊鄰釋放點", "擴散至較廣區域"],
            ["作用發作", "突然（Sudden）", "漸進（Gradual）"],
            ["作用時間", "數毫秒（Milliseconds）", "數秒至數分鐘（Seconds to minutes）"]
          ]
        }
      ]
    },
    {
      id: "synapses-section-14",
      group: "2.2 突觸的化學事件（Chemical Events at the Synapse）",
      no: "14",
      title: "受器變異性與藥物作用",
      en: "Variation in Receptors & Drugs",
      blocks: [
        { t: "p", text: "**受器亞型（Receptor Subtypes）：** 同一傳遞物質可結合多種受器（例如血清素有 7 種受器型態，多數為代謝型，僅 5-HT_3 為離子型）。" },
        { t: "ul", items: [
          "**ondansetron：** 阻斷 5-HT_3 受器以止吐（nausea）。",
          "**抗憂鬱藥：** 刺激 5-HT_2A 受器產生療效。"
        ]},
        { t: "p", text: "**作用於受器的藥物：**" },
        { t: "ul", items: [
          "**迷幻藥（Hallucinogenic drugs，如 LSD）：** 結構似血清素，結合並長時間刺激 5-HT_2A 受器，增強平常不常溝通的腦區間的連結。",
          "**鴉片類藥物（Opiates，如 morphine, heroin, methadone）：** 結合至腦部與皮膚的**內啡肽（endorphins）**受器以止痛並調節情緒。"
        ]}
      ]
    },
    {
      id: "synapses-section-15",
      group: "2.2 突觸的化學事件（Chemical Events at the Synapse）",
      no: "15",
      title: "神經傳遞物質的不活化與再攝取",
      en: "Inactivation and Reuptake",
      blocks: [
        { t: "p", text: "**再攝取（Reuptake）：** 由專門的**轉運蛋白（transporter proteins）**將傳遞物質（如麩胺酸、GABA、血清素、兒茶酚胺）搬回前突觸細胞回收利用，並終止對後突觸細胞的作用。" },
        { t: "p", text: "**酶分解（Enzymatic Breakdown）：**" },
        { t: "ul", items: [
          "**乙醯膽鹼（ACh）：** 被**乙醯膽鹼酯酶（acetylcholinesterase, AChE）**分解為乙酸鹽（acetate）與膽鹼（choline），膽鹼再被前突觸神經元回收。",
          "未被再攝取的單胺類由酵素（如**單胺氧化酶，MAO**）分解為不活化產物（如 DOPAC）並隨尿液排出。神經肽則直接擴散離開。"
        ]},
        { t: "p", text: "**興奮劑（Stimulant Drugs）作用：**" },
        { t: "ul", items: [
          "**安非他命（Amphetamine）與可卡因（Cocaine）：** 阻斷多巴胺、血清素與去甲腎上腺素的轉運蛋白，抑制再攝取，延長傳遞物質作用時間。",
          "**戒斷狀態（Withdrawal state）：** 因再攝取被阻斷，過多多巴胺被酵素分解，導致前突觸細胞多巴胺耗竭，數小時後出現缺乏能量、缺乏動機與輕度憂鬱。",
          "**甲基苯丙胺／利他能（Methylphenidate / Ritalin）：** 治療 ADHD，與古柯鹼（cocaine）作用於相同多巴胺受器並阻斷再攝取，但因口服吸收緩慢，其影響較平緩漸進。"
        ]}
      ]
    },
    {
      id: "synapses-section-16",
      group: "2.2 突觸的化學事件（Chemical Events at the Synapse）",
      no: "16",
      title: "後突觸細胞的負回饋機制",
      en: "Negative Feedback",
      blocks: [
        { t: "ul", items: [
          "**自我受器（Autoreceptors）：** 位於前突觸末梢，對自身釋放的傳遞物質敏感，結合後抑制進一步的合成與釋放（負回饋）。",
          "**倒退傳遞物質（Retrograde Transmitters）：** 後突觸細胞受刺激後釋放化學物質（如 anandamide［極樂醯胺］與 2-AG），逆向傳至前突觸末梢，發出「已收到訊息，停止釋放」的訊號。",
          "**大麻素（Cannabinoids，大麻活性成分）：** 模擬倒退傳遞物質（anandamide / 2-AG），結合至前突觸受器，減少麩胺酸與 GABA 的釋放，通常可降低焦慮感。"
        ]}
      ]
    },
    {
      id: "synapses-section-17",
      group: "2.2 突觸的化學事件（Chemical Events at the Synapse）",
      no: "17",
      title: "電學突觸",
      en: "Electrical Synapses",
      blocks: [
        { t: "ul", items: [
          "**功能：** 傳導速度比化學突觸更快，用於需要極高度同步（exact synchrony）的細胞（如控制呼吸的神經元、快速逃逸反應）。",
          "**結構——間隙接合（Gap Junction）：** 兩神經元細胞膜直接接觸，兩側的大型膜孔精確對齊，離子（如 Na⁺）可自由雙向通行，使兩神經元作用如同單一神經元。"
        ]}
      ]
    },
    {
      id: "synapses-section-18",
      group: "2.2 突觸的化學事件（Chemical Events at the Synapse）",
      no: "18",
      title: "荷爾蒙",
      en: "Hormones",
      blocks: [
        { t: "p", text: "**定義與對比：** 由內分泌腺（endocrine glands）分泌至血液，輸送到全身影響遠端目標細胞（神經傳遞物質如同電話訊號；荷爾蒙如同電波廣播）。" },
        { t: "p", text: "**腦下腺（Pituitary Gland）與下視丘（Hypothalamus）：**" },
        { t: "ul", items: [
          "**腦下腺後葉（Posterior Pituitary）：** 屬於神經組織（下視丘的延伸）。下視丘神經元合成**催產素（oxytocin）**與**抗利尿激素／壓素（vasopressin / antidiuretic hormone, ADH）**，沿軸突運至後葉釋放。",
          "**腦下腺前葉（Anterior Pituitary）：** 屬於腺體組織。下視丘合成**釋放激素（releasing hormones）**與**抑制激素（inhibiting hormones）**，經血管調控前葉釋放各種激素：甲狀腺刺激素（TSH）、促黃體生成素（LH）、促濾泡成熟素（FSH）、促腎上腺皮質素（ACTH）、催乳素（Prolactin）、生長激素（Growth hormone, GH）。"
        ]},
        { t: "p", text: "**負回饋控制（Negative Feedback System）：** 例如下視丘分泌 TSH 釋放激素 → 刺激前葉釋放 TSH → 刺激甲狀腺分泌甲狀腺素（thyroxine & triiodothyronine）→ 甲狀腺素濃度上升反過來抑制下視丘分泌釋放激素，維持體內濃度恆定。" },
        { t: "flow", rows: [
          { label: "甲狀腺軸", steps: ["下視丘：TSH 釋放激素", "腦下腺前葉：TSH", "甲狀腺：甲狀腺素", "抑制下視丘（負回饋）"] },
          { label: "壓力反應", steps: ["下視丘：CRH（促腎上腺皮質激素釋放激素）", "腦下腺前葉：ACTH（促腎上腺皮質素，又稱 corticotropin）", "腎上腺皮質：cortisol（糖皮質激素，主要是皮質醇）"] }
        ]},
        { t: "callout", title: "壓力反應（Stress Response）",
          text: "下視丘（H）分泌 CRH 進入門脈循環，刺激腦下腺（P）釋放 ACTH 進入血液循環，ACTH 再刺激腎上腺（A）皮質釋放 cortisol。（整理自課堂投影片照片，請對照原筆記確認。）" }
      ]
    }
  ],

  comparisons: [
    {
      title: "EPSP vs. IPSP",
      head: ["項目", "EPSP（興奮性後突觸電位）", "IPSP（抑制性後突觸電位）"],
      rows: [
        ["進入的離子", "鈉離子（Na⁺）", "氯離子（Cl⁻）"],
        ["膜電位變化", "局部去極化（depolarization）", "過極化（hyperpolarization）"],
        ["對動作電位", "提高產生機率", "降低產生機率"],
        ["對自發衝動率", "提高發射頻率", "降低發射頻率"]
      ]
    },
    {
      title: "時間累加 vs. 空間累加",
      head: ["項目", "時間累加（Temporal）", "空間累加（Spatial）"],
      rows: [
        ["情境", "同一位置短時間內連續多次微弱刺激", "不同位置同時給予多個微弱刺激"],
        ["機制", "第二次激發與前次殘留效果相加", "多個前突觸軸突匯聚至同一後突觸細胞，EPSP 空間疊加"],
        ["共同點", "皆是多個 EPSP 累積，超過閾值才產生動作電位", "皆是多個 EPSP 累積，超過閾值才產生動作電位"]
      ]
    },
    {
      title: "離子型 vs. 代謝型效應",
      head: ["項目", "離子型（Ionotropic）", "代謝型（Metabotropic）"],
      rows: [
        ["機制", "配體結合後直接開啟中央離子通道", "經 G 蛋白活化第二信使（如 cAMP）"],
        ["反應速度", "極快（< 1 ms）", "較慢（≥ 100 ms）"],
        ["持續時間", "短（半衰期約 5 ms）", "長（數秒至數分鐘，神經肽可達 20 分鐘以上）"],
        ["作用範圍", "侷限", "遍及全細胞"],
        ["常見物質", "麩胺酸、GABA、甘胺酸、乙醯膽鹼受器", "多巴胺、去甲腎上腺素、血清素、神經肽"],
        ["適用功能", "視覺、聽覺等精確快速訊息", "味覺、嗅覺、痛覺、警覺、注意力、飢餓、渴覺、情緒"]
      ]
    },
    {
      title: "神經傳遞物質 vs. 神經調控物質",
      head: ["項目", "神經傳遞物質", "神經調控物質／神經肽"],
      rows: [
        ["釋放位置", "軸突末梢", "細胞體、樹突及軸突側邊"],
        ["受器分佈", "緊鄰釋放點", "擴散至較廣區域"],
        ["作用發作", "突然", "漸進"],
        ["作用時間", "數毫秒", "數秒至數分鐘"]
      ]
    },
    {
      title: "電學突觸 vs. 化學突觸",
      head: ["項目", "電學突觸", "化學突觸"],
      rows: [
        ["傳導媒介", "間隙接合（Gap Junction）膜孔，離子直接雙向通行", "神經傳遞物質擴散跨越突觸間隙（約 20~30 nm）"],
        ["速度", "比化學突觸更快", "較電學突觸慢（突觸延遲）"],
        ["適用細胞", "需要極高度同步者（如控制呼吸的神經元、快速逃逸反應）", "神經系統中最主要的傳遞方式"]
      ]
    },
    {
      title: "腦下腺後葉 vs. 前葉",
      head: ["項目", "後葉（Posterior）", "前葉（Anterior）"],
      rows: [
        ["組織類型", "神經組織（下視丘的延伸）", "腺體組織"],
        ["與下視丘的關係", "下視丘神經元合成激素，沿軸突運至後葉釋放", "下視丘分泌釋放激素與抑制激素，經血管調控前葉"],
        ["代表激素", "催產素（oxytocin）、抗利尿激素／壓素（ADH）", "TSH、LH、FSH、ACTH、催乳素、生長激素（GH）"]
      ]
    }
  ],

  takeaways: [
    "突觸的特性來自 Sherrington 的反射研究：突觸延遲、時間累加、空間累加與抑制。",
    "EPSP（Na⁺ 內流、去極化）與 IPSP（Cl⁻ 內流、過極化）的代數和，決定後突觸神經元是否發射動作電位。",
    "抑制是主動煞車，不只是缺乏興奮。",
    "Loewi 蛙心實驗證實神經透過釋放化學物質傳遞訊息。",
    "化學突觸事件：合成 → 釋放（Ca²⁺ 觸發外排）→ 受器結合 → 分離 → 不活化／再攝取 → 負回饋。",
    "胺基酸類、乙醯膽鹼、單胺類、神經肽、嘌呤類、氣體類是主要的傳遞物質類別；麩胺酸為主要興奮性、GABA 為主要抑制性。",
    "離子型效應快而短、範圍侷限；代謝型效應慢而長、範圍廣，經 G 蛋白與第二信使作用。",
    "傳遞物質可被再攝取、酶分解、擴散或脫敏；興奮劑、迷幻藥、鴉片類與大麻素等藥物分別作用在這些環節或受器上。",
    "電學突觸以間隙接合傳導，速度快且高度同步；荷爾蒙經血液作用於遠端目標，下視丘透過後葉與前葉調控腦下腺。"
  ]
};
