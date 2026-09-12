# AI 论文猎手 · 个人学习档案馆

个人长期学习沉淀站点，由定时任务自动维护。Pages 地址：仓库 Settings → Pages 查看。

## 目录结构

- `index.html` — 档案馆主页（时间线 + 搜索 + 类型筛选，数据来自 `data.js`）
- `data.js` — 索引数据，每期在 `entries` **头部**插入新记录
- `days/YYYY-MM-DD/index.html` — 每日晨检日报（周二至周六生成）
- `weeks/YYYY-Www/index.html` — 每周精选周报（周一生成，如 weeks/2026-W38/）
- `learn/<slug>/index.html` — 零基础科普漫画文章（每周一篇，随周报发布）
- `topics/<slug>/index.html` — 主题聚合页（可选，按 tags 归档趋势）
- `assets/site.css` — 日报/周报/科普页共用样式
- `assets/page-template.html` — 内容页模板与字段规范

**路径约定**：站内链接一律用相对路径（如 `../../assets/site.css`、`../../index.html`），禁用 `/` 开头的绝对路径——Pages 项目站挂在 `/ai-paper-archive/` 子路径下，绝对路径会 404。

## 论文条目必填字段

标题、作者/机构、发布日期、原文链接、一句话摘要、**入选理由**（为什么值得看）、主题标签 tags、公司标签 companies、难度（入门/进阶/前沿）。

## 发布流程（每次定时任务执行）

1. 生成当期 `days|weeks|learn/.../index.html`（模板见 assets/page-template.html）
2. 更新 `data.js`：entries 头部插入 {type, date, title, url, summary, tags, companies, count}，并更新 `updated`
3. `git add -A && git commit -m "..." && git push origin main`
4. 聊天回复中必须附**可点击的网站版本卡片**；周报全文直接发聊天，日报只发简报+链接

界面为「AI Paper Scout」自研编辑风格（白底 680px 单列、橘红 #ff5a1f 强调 + 琥珀 #ffb020 下划线、粗描边卡片、深色引言块、药丸标签），样式内联于 index.html 与 assets/site.css，无外部依赖。

## 推送兜底

若执行环境的 `git push` 不可用（无网络到 github.com:443 / dubious ownership / 超时），改用 Contents API 逐文件推送（token 见记忆配置，仅需 Contents 读写权限）：

```
PUT https://api.github.com/repos/veronique0822/ai-paper-archive/contents/<path>
body: {"message": "...", "content": "<base64>", "branch": "main"}
```

注意：更新已有文件需带当前文件的 `sha`（先 GET 同一接口获取）。
