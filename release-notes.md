# 🧩 Kanban 2.0.52-beta.2

## 🇨🇳 中文

### 🛠️ 修复内容

- 在 Kanban 与 Markdown 视图之间切换时，保留并恢复原来的阅读／源码模式（[Issue #666](https://github.com/community-archive/obsidian-kanban/issues/666)）。
- 从卡片新建笔记前验证配置目录；局部配置无效时回退到有效的全局目录，均无效时使用 Obsidian 默认位置（[Issue #996](https://github.com/community-archive/obsidian-kanban/issues/996)）。
- 阻止通过新增表单创建仅包含空白字符的卡片或列表标题（[Issue #1203](https://github.com/community-archive/obsidian-kanban/issues/1203)）。

### ⚠️ Beta 注意事项

此 Fork 保留 `obsidian-kanban` 插件 ID，以便后续继续向上游贡献。它会原位替换社区版 Kanban，不能在同一 Vault 中同时安装。建议先在测试 Vault 中验证，并通过 BRAT 从 `laohei996/obsidian-kanban` 安装。

## 🇬🇧 English

### 🛠️ Fixed

- Preserve and restore the previous Reading or Source mode when switching between Kanban and Markdown views ([Issue #666](https://github.com/community-archive/obsidian-kanban/issues/666)).
- Validate the configured note folder before creating a note from a card; fall back to a valid global folder, then Obsidian's default location when needed ([Issue #996](https://github.com/community-archive/obsidian-kanban/issues/996)).
- Prevent the add forms from creating cards or lists whose titles contain only whitespace ([Issue #1203](https://github.com/community-archive/obsidian-kanban/issues/1203)).

### ⚠️ Beta notice

This fork retains the `obsidian-kanban` plugin ID so the fixes can continue to be proposed upstream. It replaces the community Kanban plugin in place and cannot be installed beside it in the same vault. Test this release in a disposable vault first, then install it through BRAT from `laohei996/obsidian-kanban`.
