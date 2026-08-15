# 🧩 Kanban 2.0.52-beta.3

## 🇨🇳 中文

### 🛠️ 修复内容

- 拖入外部链接创建卡片时不再同步打开网页（[Issue #1160](https://github.com/community-archive/obsidian-kanban/issues/1160)）。
- 从看板切回 Markdown 后恢复“上移／下移一行”等编辑器命令（[Issue #1167](https://github.com/community-archive/obsidian-kanban/issues/1167)）。
- 折叠列表的竖排标题不再倒置，CJK 与拉丁字符方向正确（[Issue #1204](https://github.com/community-archive/obsidian-kanban/issues/1204)）。
- “Tag sort order”设置真正生效：卡片标签显示顺序、列表“按标签排序”和表格 Tags 列排序均按配置顺序（[Issue #1159](https://github.com/community-archive/obsidian-kanban/issues/1159)）。
- 修复窗口隐藏等情况下拖放系统未初始化、列表与卡片无法拖动的问题（[Issue #1162](https://github.com/community-archive/obsidian-kanban/issues/1162)）。

### ℹ️ 元数据说明

自本版本起，插件 manifest 的 `author` 更新为 `laohei996`，`authorUrl` 指向本 Fork 仓库；插件 ID 保持不变。

### ⚠️ Beta 注意事项

此 Fork 保留 `obsidian-kanban` 插件 ID，以便后续继续向上游贡献。它会原位替换社区版 Kanban，不能在同一 Vault 中同时安装。建议先在测试 Vault 中验证，并通过 BRAT 从 `laohei996/obsidian-kanban` 安装。

## 🇬🇧 English

### 🛠️ Fixed

- Dropping an external link onto the board no longer opens the link at the same time ([Issue #1160](https://github.com/community-archive/obsidian-kanban/issues/1160)).
- Editor commands such as move-line-up/down work again after switching from a board back to Markdown ([Issue #1167](https://github.com/community-archive/obsidian-kanban/issues/1167)).
- Collapsed lane titles are no longer rendered upside down; CJK and Latin characters are oriented correctly ([Issue #1204](https://github.com/community-archive/obsidian-kanban/issues/1204)).
- The "Tag sort order" setting now takes effect: card tag display, "Sort by tags" in the lane menu, and the table Tags column all follow the configured order ([Issue #1159](https://github.com/community-archive/obsidian-kanban/issues/1159)).
- Drag and drop now initializes correctly even when the window was hidden at board mount, so lanes and cards can be dragged reliably ([Issue #1162](https://github.com/community-archive/obsidian-kanban/issues/1162)).

### ℹ️ Metadata

Starting with this release, the manifest `author` is `laohei996` and `authorUrl` points to this fork repository. The plugin ID is unchanged.

### ⚠️ Beta notice

This fork retains the `obsidian-kanban` plugin ID so the fixes can continue to be proposed upstream. It replaces the community Kanban plugin in place and cannot be installed beside it in the same vault. Test this release in a disposable vault first, then install it through BRAT from `laohei996/obsidian-kanban`.
