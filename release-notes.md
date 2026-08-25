# 🧩 Kanban 2.0.52-beta.4

## 🇨🇳 中文

### 🛠️ 修复内容

- 修复编辑卡片后离开看板时内部编辑器控制器未释放的问题；“跟随光标下的链接”、移动行等全局编辑器命令会正确作用于当前 Markdown 笔记（[Issue #1132](https://github.com/community-archive/obsidian-kanban/issues/1132)）。
- 从卡片新建笔记时，日期和时间触发器不再进入文件名或生成的链接；触发器会保留在链接外，普通日期、链接到日记的日期及多行卡片均可继续正确解析（[Issue #1137](https://github.com/community-archive/obsidian-kanban/issues/1137)）。
- 卡片圆角改用内容容器变量，不再继承移动端输入框的大圆角，修复 iOS／iPadOS 26 上卡片呈药丸形或内容被裁切的问题（[Issue #1183](https://github.com/community-archive/obsidian-kanban/issues/1183)、[Issue #1215](https://github.com/community-archive/obsidian-kanban/issues/1215)）。

### ⚠️ Beta 注意事项

此 Fork 保留 `obsidian-kanban` 插件 ID，以便后续继续向上游贡献。它会原位替换社区版 Kanban，不能在同一 Vault 中同时安装。建议先在测试 Vault 中验证，并通过 BRAT 从 `laohei996/obsidian-kanban` 安装。

## 🇬🇧 English

### 🛠️ Fixed

- Release stale card-editor controllers when leaving a board, so global editor commands such as Follow link under cursor and move-line commands target the active Markdown note again ([Issue #1132](https://github.com/community-archive/obsidian-kanban/issues/1132)).
- Strip date and time triggers from note filenames and generated links when creating a note from a card. Triggers remain outside the link, preserving parsing for plain dates, daily-note links, and multiline cards ([Issue #1137](https://github.com/community-archive/obsidian-kanban/issues/1137)).
- Use the content-container radius for cards instead of the mobile input radius, preventing pill-shaped cards and clipped content on iOS and iPadOS 26 ([Issue #1183](https://github.com/community-archive/obsidian-kanban/issues/1183), [Issue #1215](https://github.com/community-archive/obsidian-kanban/issues/1215)).

### ⚠️ Beta notice

This fork retains the `obsidian-kanban` plugin ID so the fixes can continue to be proposed upstream. It replaces the community Kanban plugin in place and cannot be installed beside it in the same vault. Test this release in a disposable vault first, then install it through BRAT from `laohei996/obsidian-kanban`.
