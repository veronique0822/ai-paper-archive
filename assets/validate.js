// 数据契约校验：node assets/validate.js  —— 推送前必跑
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const src = fs.readFileSync(path.join(root, "data.js"), "utf8");
const window = {};
const data = new Function("window", src + "; return window.ARCHIVE_DATA;")(window);
let errs = [];
const reqItem = ["id","title","url","date","kind","summary","reason","tags","companies","difficulty","firstSeen","weekly","learn"];
const reqIssue = ["type","date","title","url","count"];
const KINDS = ["论文","资讯","科普"], DIFFS = ["入门","进阶","前沿"];
if (!data || !Array.isArray(data.items) || !Array.isArray(data.issues))
  errs.push("顶层必须含 items[] 与 issues[]");
(data.items || []).forEach((e, i) => {
  reqItem.forEach(k => { if (!(k in e)) errs.push(`items[${i}] 缺字段 ${k}`); });
  if (e.kind && !KINDS.includes(e.kind)) errs.push(`items[${i}].kind 非法: ${e.kind}`);
  if (e.difficulty && !DIFFS.includes(e.difficulty)) errs.push(`items[${i}].difficulty 非法: ${e.difficulty}`);
  if (e.date && !/^\d{4}-\d{2}-\d{2}$/.test(e.date)) errs.push(`items[${i}].date 格式错: ${e.date}`);
  if (e.firstSeen && !/^\d{4}-\d{2}-\d{2}$/.test(e.firstSeen)) errs.push(`items[${i}].firstSeen 格式错: ${e.firstSeen}`);
  if (e.weekly && !/^\d{4}-W\d{2}$/.test(e.weekly)) errs.push(`items[${i}].weekly 格式错: ${e.weekly}`);
  if (!Array.isArray(e.tags) || !Array.isArray(e.companies)) errs.push(`items[${i}].tags/companies 必须是数组`);
});
const ids = new Set();
(data.items || []).forEach((e, i) => { if (ids.has(e.id)) errs.push(`items[${i}].id 重复: ${e.id}`); ids.add(e.id); });
(data.issues || []).forEach((e, i) => {
  reqIssue.forEach(k => { if (!(k in e)) errs.push(`issues[${i}] 缺字段 ${k}`); });
  if (e.type && !["day","week"].includes(e.type)) errs.push(`issues[${i}].type 非法: ${e.type}`);
});
if (errs.length) { console.error("✗ 数据校验失败:\n" + errs.join("\n")); process.exit(1); }
console.log(`✓ data.js 校验通过：${data.items.length} 条目 / ${data.issues.length} 期次`);
