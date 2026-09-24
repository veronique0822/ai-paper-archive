# 档案馆归档协议（ARCHIVE_PROTOCOL）

> 本文档是**所有定时任务执行时的归档契约**。任务 content 中统一写"按 ARCHIVE_PROTOCOL.md 归档"，
> 细节以本文档为准，避免规则在多处漂移。访客向说明见 README.md。

## 定位

本仓库是唯一长期留痕站点（GitHub Pages），所有定时任务产出的可留痕内容必须归档至此，
不允许只留在聊天或云端临时目录。

## 信息架构（两层模型）

- **条目（items）= 最小颗粒度**：一篇论文、一条资讯、一篇科普文章，是查询的基本单位；
- **期次（issues）= 容器目录**：日报/周报是按时间切片的汇编视图，主页内联渲染，独立页保留作永久链接。

主页三个视图：**条目**（五维筛选 + 搜索）/ **日报**（侧栏切期次，主区内联正文，默认最新）/ **周报**（同左，含本期主题与科普）。科普是 `kind=科普` 的条目，不单独设顶级视图。

## 目录与分类

| 目录 | 内容 | 维护任务 |
|---|---|---|
| `days/YYYY-MM-DD/` | 日报独立页（永久链接） | 论文猎手·日报 |
| `weeks/YYYY-Www/` | 周报独立页（永久链接） | 论文猎手·周报 |
| `learn/<slug>/` | 科普漫画完整页 | 论文猎手·周报（随刊发布） |
| `topics/<slug>/` | 主题/公司聚合页（暂缓，由主页筛选覆盖） | 待定 |
| `<新分类>/` | 未来任务的新分类 | 必须先在本表登记，再创建任务 |

## 统一数据 `data.js`

双数组结构，`updated` 为最近更新日期：

- `items[]` 条目库（**按 url 去重追加，不修改已存在条目**，周报只补标记）：
  `{id, title, url, date, kind(论文|资讯|科普), summary(一句话), reason(入选理由),
    tags[], companies[], difficulty(入门|进阶|前沿),
    firstSeen(收录日报 YYYY-MM-DD), weekly(入选周报 YYYY-Www 或 null), learn(科普页路径或 null)}`
- `issues[]` 期次索引（新期次在**头部**插入）：
  - 日报：`{type:"day", date, title, url, count, summary}`
  - 周报：`{type:"week", date(YYYY-Www), title, url, count, theme(本期主题), learn(本期科普标题)}`

## 各任务登记（唯一数据流）

| 任务 | 归档动作 | 素材池 | 聊天输出 |
|---|---|---|---|
| 日报（周一至周五 8:00） | 条目去重追加进 `items[]`（`firstSeen`=当日）；生成 `days/` 独立页；登记 day 期次 | 任务 `state/` 存当日原始条目，供周报读取 | 简报 + GitHub Pages 永久链接 + 对话内预览版本卡片（点开即读，不发全文） |
| 周报（周一 9:00） | 从素材池选 8-15 条，把入选条目的 `weekly` 字段标为当期周号（不重写条目）；生成 `weeks/` 与 `learn/` 独立页；登记 week 期次（含 theme、learn） | 读日报素材池，不回写 | 全文 + GitHub Pages 永久链接 + 对话内预览版本卡片（点开即读） |

## 页面规范

- 一律基于 `assets/page-template.html` 生成独立页；主页三视图样式见 `index.html` + `assets/app.css` + `assets/app.js`（骨架/样式/逻辑已分离）
- 站内链接全部用相对路径（Pages 挂在 `/ai-paper-archive/` 子路径，绝对路径会 404）
- 论文条目必填：标题、作者/机构、发布日期、原文链接、一句话摘要、入选理由、主题标签、公司标签、难度
- 视觉：白底 680px 单列、橘红 `#ff5a1f` 强调 + 琥珀 `#ffb020` 下划线、深色引言块、药丸标签，共用 `assets/site.css`

## 发布与兜底

1. 更新 `data.js`（追加条目 / 插期次 / 改 `updated`）
2. 生成当期独立页（days/ 或 weeks/ + learn/）
3. `git add -A && git commit && git push origin main`（remote 与 token 见记忆配置）
4. 聊天回复必须同时附两种入口：**①对话内预览版本卡片**（将当期站点镜像至交付工作目录、以当期独立页为入口保存 html 版本，卡片点开即读）；**②GitHub Pages 永久链接**
5. push 失败改用 Contents API 逐文件推送（需先 GET 取文件 `sha`）；再失败保存到工作目录并提醒用户手动备份

## 新任务接入流程

登记分类与目录 → 在任务 content 中写"按 ARCHIVE_PROTOCOL.md 归档" → 创建任务。
协议未登记的分类不得写入。

## 工程纪律（防改崩）

1. **任务永远只写 `data.js` 和期次独立页，永远不碰 `index.html` / `assets/app.js` / `assets/app.css`**；页面改动只发生在人工 UI 迭代；
2. **数据契约以本文档的字段表为准**；修改 schema 必须同步完成三件事：更新协议、更新 `assets/validate.js`、迁移存量 data.js；
3. **渲染层对白名单字段容错**：data.js 新增字段不得导致主页报错，取不到的字段降级显示；
4. **人工改完页面或数据后，推送前必跑 `node assets/validate.js`**，通过才能 push；
5. 条目 `url` 必须是真实原文链接；确实没有链接时用 `"#"`，渲染层会显示为纯文本标题而非链接。
