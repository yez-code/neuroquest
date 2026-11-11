/*
 * 進度儲存（localStorage）。
 * 規則：每章獨立 chapterId；最佳星級只升不降；null = 尚未挑戰，0 = 已挑戰但未獲勝；
 * 版本化 key；localStorage 不可用時退回記憶體，不影響遊戲運作；不儲存任何個人資料。
 */
(function () {
  "use strict";

  var KEY = "neuroquest:v1:progress";
  var memory = {};

  function isValidStars(v) {
    return typeof v === "number" && isFinite(v) && Math.floor(v) === v && v >= 0 && v <= 3;
  }

  // localStorage 可用時以它為準；只有「讀不到」或「寫入失敗過」才改用記憶體備援
  var persistFailed = false;

  function load() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (!raw) return persistFailed ? copy(memory) : {};
      var data = JSON.parse(raw);
      return data && typeof data === "object" ? data : {};
    } catch (e) {
      return copy(memory);
    }
  }

  function copy(obj) {
    var out = {};
    Object.keys(obj).forEach(function (k) { out[k] = obj[k]; });
    return out;
  }

  function persist(data) {
    memory = copy(data);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(data));
      persistFailed = false;
      return true;
    } catch (e) {
      persistFailed = true;
      return false;
    }
  }

  /** 回傳 0~3，或 null（尚未挑戰） */
  function getBestStars(chapterId) {
    var v = load()[chapterId];
    return isValidStars(v) ? v : null;
  }

  /** 只在成績提高（或第一次挑戰）時覆寫；回傳目前最佳星級 */
  function saveResult(chapterId, stars) {
    if (!isValidStars(stars)) return getBestStars(chapterId);
    var data = load();
    var prev = isValidStars(data[chapterId]) ? data[chapterId] : null;
    if (prev === null || stars > prev) {
      data[chapterId] = stars;
      persist(data);
      return stars;
    }
    return prev;
  }

  window.NQStorage = { getBestStars: getBestStars, saveResult: saveResult };
})();
