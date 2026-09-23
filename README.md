# AI 论文猎手 · 个人学习档案馆

个人长期学习沉淀站点，由定时任务自动维护。Pages 地址：仓库 Settings → Pages 查看。
任务的归档契约见 **[ARCHIVE_PROTOCOL.md](./ARCHIVE_PROTOCOL.md)**（本文档面向访客）。

## 目录结构

- `index.html` — 档案馆主页（分区导航 + 统一时间线 + 搜索 + 类型/来源筛选，数据来自 `data.js`）
- `data.js` — 统一索引，每期在 `entries` **头部**插入新记录
- `days/YYYY-MM-DD/index.html` — 每日晨检日报（周一至周五 8:00 生成）
- `weeks/YYYY-Www/index.html` — 每周精选周报（周一 9:00 生成，如 weeks/2026-W38/）
- `learn/<slug>/index.html` — 零基础科普漫画文章（每周一篇，随周报发布）
- `topics/<slug>/index.html` — 主题/公司聚合页（按 tags 归档趋势）
- `assets/site.css` — 各内容页共用样式
- `assets/page-template.html` — 内容页模板与字段规范

## 浏览

主页按「日报 / 周报 / 科普 / 主题聚合」分区，顶部可按类型与来源筛选，支持关键词搜索；
每期卡片标注日期、条数与标签。

## 界面风格

「AI Paper Scout」自研编辑风格（白底 680px 单列、橘红 #ff5a1f 强调 + 琥珀 #ffb020 下划线、
粗描边卡片、深色引言块、药丸标签），样式内联于 index.html 与 assets/site.css，无外部依赖。
