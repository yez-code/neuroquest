# NeuroQuest — 生理心理學冒險筆記

結合生理心理學課程筆記與像素 RPG 測驗的學習網站。讀完筆記後挑戰怪獸：每答對一題就扣怪獸一點血，答對 6 題以上獲勝，最高 3 星。

- 線上版：`https://yez-code.github.io/neuroquest/`
- 技術：純 HTML / CSS / JavaScript，無框架、無後端，所有路徑為相對路徑，可直接部署到 GitHub Pages。

## 功能

- 冒險地圖式章節選單（目前開放：第二章 突觸 Synapses；其他章節 Coming Soon）
- 可展開的章節筆記（18 個區塊、6 組易混淆比較表、示意圖、重點整理）
- 10 題測驗（4 題是非＋6 題四選一），每輪題目順序隨機，每題即時批改與詳解
- 怪獸戰鬥：HP = 10 − 答對題數
- 星級：答對 6–7 題 1 星、8–9 題 2 星、10 題 3 星；0–5 題挑戰失敗
- 結算畫面與錯題回顧（含對應筆記段落）
- 最佳星級儲存在瀏覽器 localStorage（只升不降，不收集任何個人資料）
- 支援手機版、鍵盤操作與「減少動態」設定

## 本機預覽

```bash
python3 -m http.server
# 開啟 http://localhost:8000
```

也可以直接用瀏覽器開啟 `index.html`。

## 測試

```bash
node tests/quiz_logic_test.js   # 題庫驗證與答題邏輯
node tests/battle_test.js       # HP 與星級規則
python3 tests/smoke_test.py     # 瀏覽器完整流程（需 playwright）
```

## 專案結構

```
index.html
css/style.css
js/            storage.js  quiz.js  battle.js  app.js
data/
  chapters.js          章節清單
  notes/<id>.js        章節筆記
  quizzes/<id>.js      章節題庫
tests/
CLAUDE.md              AI 開發規範
```

## 如何新增章節（給人或 AI）

1. 在 `data/notes/` 新增筆記檔、在 `data/quizzes/` 新增題庫檔（沿用既有格式）。
2. 在 `data/chapters.js` 把該章節的 `status` 改為 `open`，填入 `noteData`、`quizData`、`monsterConfig`。
3. 在 `index.html` 加入新資料檔的 `<script>`。
4. 跑測試。計分與戰鬥規則只在 `js/battle.js`，不要複製。

完整規範見 [CLAUDE.md](CLAUDE.md)。

## 內容聲明

筆記內容整理自課堂筆記，僅供學習複習，若與課本或老師講義不同，請以課本與老師為準。
