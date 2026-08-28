# 🧩 Kanban 2.0.52-beta.5

## 🇨🇳 中文

### 🛠️ 修复内容

- Android 端新建和编辑卡片时，输入框现在会根据内容保持紧凑，不再被 Obsidian 的移动端 Markdown 顶部间距异常撑高；在长列表底部打开软键盘时，编辑器和提交按钮会一起滚动到键盘及移动工具栏上方（[Fork Issue #1](https://github.com/laohei996/obsidian-kanban/issues/1)）。
- 在新版 Obsidian 中恢复 Kanban 的 Ribbon、View 及菜单图标，优先使用 `lucide-square-kanban`，并保留旧版兼容回退；桌面端和移动端的“View as board”菜单也会统一使用可用的 Kanban 图标（[Issue #1231](https://github.com/community-archive/obsidian-kanban/issues/1231)）。

### ⚠️ Beta 注意事项

此 Fork 保留 `obsidian-kanban` 插件 ID，以便后续继续向上游贡献。它会原位替换社区版 Kanban，不能在同一 Vault 中同时安装。建议先在测试 Vault 中验证，并通过 BRAT 从 `laohei996/obsidian-kanban` 安装。

## 🇬🇧 English

### 🛠️ Fixed

- Keep Android card editors compact instead of inheriting Obsidian's oversized mobile Markdown top spacing. On long lists, opening the software keyboard now scrolls the editor and Submit button together above the keyboard and mobile toolbar ([Fork Issue #1](https://github.com/laohei996/obsidian-kanban/issues/1)).
- Restore Kanban Ribbon, View, and menu icons in current Obsidian versions by preferring `lucide-square-kanban` while retaining a compatibility fallback for older versions. Desktop and mobile “View as board” menus now reuse the same available Kanban icon ([Issue #1231](https://github.com/community-archive/obsidian-kanban/issues/1231)).

### ⚠️ Beta notice

This fork retains the `obsidian-kanban` plugin ID so the fixes can continue to be proposed upstream. It replaces the community Kanban plugin in place and cannot be installed beside it in the same vault. Test this release in a disposable vault first, then install it through BRAT from `laohei996/obsidian-kanban`.
