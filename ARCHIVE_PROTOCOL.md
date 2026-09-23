# 档案馆归档协议（ARCHIVE_PROTOCOL）

> 本文档是**所有定时任务执行时的归档契约**。任务 content 中统一写"按 ARCHIVE_PROTOCOL.md 归档"，
> 细节以本文档为准，避免规则在多处漂移。访客向说明见 README.md。

## 定位

本仓库是唯一长期留痕站点（GitHub Pages），所有定时任务产出的可留痕内容必须归档至此，
不允许只留在聊天或云端临时目录。

## 目录与分类

| 目录 | 内容 | 维护任务 |
|---|---|---|
| `days/YYYY-MM-DD/` | 每日晨检日报 | 论文猎手·日报 |
| `weeks/YYYY-Www/` | 每周精选周报 | 论文猎手·周报 |
| `learn/<slug>/` | 零基础科普漫画 | 论文猎手·周报（随刊发布） |
| `topics/<slug>/` | 主题/公司聚合页 | 各任务在归档日报/周报时按 tags/companies 增量更新 |
| `<新分类>/` | 未来任务的新分类 | 必须先在本表登记，再创建任务 |

## 统一索引 `data.js`

每期在 `entries` **头部**插入一条记录，字段：

```
{type, date, title, url, summary, tags[], companies[], count, source, updated}
```

- `source`：产出任务标识（`daily` / `weekly` / `learn` / 未来任务自定），供总站按来源筛选
- 同步更新文件顶部的 `updated` 时间戳
- `type` 取值：`day` | `week` | `learn` | `topic`

## 各任务登记（唯一数据流）

| 任务 | 归档目录 | 素材池 | 聊天输出 |
|---|---|---|---|
| 日报（周一至周五 8:00） | `days/` | 写入任务 `state/`，供周报读取 | 简报 + 链接 + 网站卡片（不发全文） |
| 周报（周一 9:00） | `weeks/` + `learn/` | 读取日报素材池，不回写 | 全文 + 网站卡片 |

## 页面规范

- 一律基于 `assets/page-template.html` 生成
- 站内链接全部用相对路径（Pages 挂在 `/ai-paper-archive/` 子路径，绝对路径会 404）
- 论文条目必填：标题、作者/机构、发布日期、原文链接、一句话摘要、入选理由、主题标签、公司标签、难度（入门/进阶/前沿）
- 视觉：白底 680px 单列、橘红 `#ff5a1f` 强调，共用 `assets/site.css`

## 发布与兜底

1. 生成当期页面
2. 更新 `data.js`（头部插入 + `updated`）
3. `git add -A && git commit && git push origin main`（remote 与 token 见记忆配置）
4. 聊天回复必须附**可点击的网站版本卡片**
5. push 失败改用 Contents API 逐文件推送（需先 GET 取文件 `sha`）；再失败保存到工作目录并提醒用户手动备份

## 新任务接入流程

登记分类与目录 → 在任务 content 中写"按 ARCHIVE_PROTOCOL.md 归档" → 创建任务。
协议未登记的分类不得写入。
