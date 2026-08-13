## Kanban 2.0.52-beta.1

This beta fixes a blank-board issue triggered by selecting a Kanban lane heading in Obsidian's Outline pane.

### Fixed

- Keep the current Kanban view mounted when Outline navigation targets the open board.
- Resolve Outline line-number navigation through Obsidian's heading metadata.
- Match encoded and unescaped lane headings with normalized Unicode and whitespace.
- Scroll the matching lane into view instead of replacing the active Kanban view.

### Beta notice

This fork retains the `obsidian-kanban` plugin ID so the change can be proposed upstream later. It is an in-place replacement for the community Kanban plugin and cannot be installed beside it in the same vault. Test this release in a disposable vault and install it through BRAT from `laohei996/obsidian-kanban`.
