// 简体中文
import { Lang } from './en';

const lang: Lang = {
  // main.ts
  'Open as kanban board': '打开为看板',
  'Create new board': '创建新看板',
  'Archive completed cards in active board': '归档当前看板中已完成的卡片',
  'Error: current file is not a Kanban board': '错误：当前文件不是看板文件',
  'Convert empty note to Kanban': '将空白笔记转换为看板',
  'Error: cannot create Kanban, the current note is not empty':
    '错误：无法创建看板，当前笔记不是空白笔记',
  'New kanban board': '新建看板',
  'Untitled Kanban': '未命名看板',
  'Toggle between Kanban and markdown mode': '在看板和 Markdown 模式之间切换',

  'View as board': '以看板视图显示',
  'View as list': '以列表视图显示',
  'View as table': '以表格视图显示',
  'Board view': '看板视图',

  // KanbanView.tsx
  'Open as markdown': '以 Markdown 打开',
  'Open board settings': '打开看板设置',
  'Archive completed cards': '归档已完成的卡片',
  'Something went wrong': '出现错误',
  'Error:': '错误：',
  'You may wish to open as markdown and inspect or edit the file.':
    '可以尝试以 Markdown 打开并检查或编辑该文件。',
  'Are you sure you want to archive all completed cards on this board?':
    '确定要归档此看板中所有已完成的卡片吗？',

  // parser.ts
  Complete: '完成',
  Archive: '归档',
  'Invalid Kanban file: problems parsing frontmatter':
    '无效的看板文件：解析 frontmatter 时出现问题',
  "I don't know how to interpret this line:": '无法解析此行：',
  Untitled: '未命名',

  // settingHelpers.ts
  'Note: No template plugins are currently enabled.': '注意：当前未启用任何模板插件。',
  default: '默认',
  'Search...': '搜索……',

  // Settings.ts
  'New line trigger': '换行快捷键',
  'Select whether Enter or Shift+Enter creates a new line. The opposite of what you choose will create and complete editing of cards and lists.':
    '选择使用 Enter 还是 Shift+Enter 换行。另一个快捷键将用于创建卡片和列，或完成卡片和列的编辑。',
  'Shift + Enter': 'Shift + Enter',
  Enter: 'Enter',
  'Prepend / append new cards': '新卡片添加位置',
  'This setting controls whether new cards are added to the beginning or end of the list.':
    '控制将新卡片添加到列的开头还是末尾。',
  Prepend: '开头',
  'Prepend (compact)': '开头（按需显示输入框）',
  Append: '末尾',
  'These settings will take precedence over the default Kanban board settings.':
    '这些设置将优先于默认看板设置。',
  'Set the default Kanban board settings. Settings can be overridden on a board-by-board basis.':
    '设置默认看板选项。每个看板可以单独覆盖这些设置。',
  'Note template': '笔记模板',
  'This template will be used when creating new notes from Kanban cards.':
    '从看板卡片创建新笔记时使用此模板。',
  'No template': '无模板',
  'Note folder': '笔记文件夹',
  'Notes created from Kanban cards will be placed in this folder. If blank, they will be placed in the default location for this vault.':
    '从看板卡片创建的笔记将放入此文件夹。留空时，将使用当前仓库的默认位置。',
  'Default folder': '默认文件夹',
  'List width': '列宽',
  'Expand lists to full width in list view': '在列表视图中将列展开到全宽',
  'Enter a number to set the list width in pixels.': '输入数字，以像素为单位设置列宽。',
  'Maximum number of archived cards': '已归档卡片的最大数量',
  "Archived cards can be viewed in markdown mode. This setting will begin removing old cards once the limit is reached. Setting this value to -1 will allow a board's archive to grow infinitely.":
    '可以在 Markdown 模式中查看已归档卡片。达到此上限后，将开始移除较旧的卡片。设为 -1 可无限保留看板中的归档卡片。',
  'Display card checkbox': '显示卡片复选框',
  'When toggled, a checkbox will be displayed with each card': '启用后，每张卡片都会显示复选框',
  'Reset to default': '恢复默认值',
  'Date & Time': '日期和时间',
  'Date trigger': '日期触发符',
  'When this is typed, it will trigger the date selector': '输入此内容时将打开日期选择器',
  'Time trigger': '时间触发符',
  'When this is typed, it will trigger the time selector': '输入此内容时将打开时间选择器',
  'Date format': '日期格式',
  'This format will be used when saving dates in markdown.': '在 Markdown 中保存日期时使用此格式。',
  'For more syntax, refer to': '更多语法请参阅',
  'format reference': '格式参考',
  'Your current syntax looks like this': '当前格式示例',
  'Time format': '时间格式',
  'Date display format': '日期显示格式',
  'This format will be used when displaying dates in Kanban cards.':
    '在看板卡片中显示日期时使用此格式。',
  'Show relative date': '显示相对日期',
  "When toggled, cards will display the distance between today and the card's date. eg. 'In 3 days', 'A month ago'. Relative dates will not be shown for dates from the Tasks and Dataview plugins.":
    '启用后，卡片将显示卡片日期与今天的间隔，例如“三天后”或“一个月前”。来自 Tasks 和 Dataview 插件的日期不会显示相对日期。',

  'Move dates to card footer': '将日期移至卡片底部',
  "When toggled, dates will be displayed in the card's footer instead of the card's body.":
    '启用后，日期将显示在卡片底部，而不是卡片正文中。',
  'Move tags to card footer': '将标签移至卡片底部',
  "When toggled, tags will be displayed in the card's footer instead of the card's body.":
    '启用后，标签将显示在卡片底部，而不是卡片正文中。',
  'Move task data to card footer': '将任务数据移至卡片底部',
  "When toggled, task data (from the Tasks plugin) will be displayed in the card's footer instead of the card's body.":
    '启用后，来自 Tasks 插件的任务数据将显示在卡片底部，而不是卡片正文中。',
  'Inline metadata position': '内联元数据位置',
  'Controls where the inline metadata (from the Dataview plugin) will be displayed.':
    '控制来自 Dataview 插件的内联元数据显示位置。',
  'Card body': '卡片正文',
  'Card footer': '卡片底部',
  'Merge with linked page metadata': '与链接页面的元数据合并',

  'Hide card counts in list titles': '隐藏列标题中的卡片数量',
  'When toggled, card counts are hidden from the list title': '启用后，列标题中将隐藏卡片数量',
  'Link dates to daily notes': '将日期链接到日记',
  'When toggled, dates will link to daily notes. Eg. [[2021-04-26]]':
    '启用后，日期将链接到日记，例如 [[2021-04-26]]。',
  'Add date and time to archived cards': '为归档卡片添加日期和时间',
  'When toggled, the current date and time will be added to the card title when it is archived. Eg. - [ ] 2021-05-14 10:00am My card title':
    '启用后，归档卡片时会将当前日期和时间添加到卡片标题，例如“- [ ] 2021-05-14 10:00am 我的卡片标题”。',
  'Add archive date/time after card title': '在卡片标题后添加归档日期和时间',
  'When toggled, the archived date/time will be added after the card title, e.g.- [ ] My card title 2021-05-14 10:00am. By default, it is inserted before the title.':
    '启用后，归档日期和时间将添加在卡片标题之后，例如“- [ ] 我的卡片标题 2021-05-14 10:00am”。默认添加在标题之前。',
  'Archive date/time separator': '归档时间戳与标题的分隔符',
  'This will be used to separate the archived date/time from the title':
    '用于分隔归档时间戳和卡片标题',
  'Archive date/time format': '归档时间戳格式',
  'Kanban Plugin': '看板插件',
  'Tag click action': '点击标签时的操作',
  'Search Kanban Board': '搜索当前看板',
  'Search Obsidian Vault': '搜索 Obsidian 仓库',
  'This setting controls whether clicking the tags displayed below the card title opens the Obsidian search or the Kanban board search.':
    '控制点击卡片标题下方的标签时，打开 Obsidian 搜索还是当前看板搜索。',
  'Tag colors': '标签颜色',
  'Set colors for tags displayed in cards.': '设置卡片中标签的显示颜色。',
  'Linked Page Metadata': '链接页面元数据',
  'Inline Metadata': '内联元数据',
  'Display metadata for the first note linked within a card. Specify which metadata keys to display below. An optional label can be provided, and labels can be hidden altogether.':
    '显示卡片中第一个链接页面的元数据。请在下方指定要显示的元数据键。可以设置可选显示名称，也可以完全隐藏显示名称。',
  'Board Header Buttons': '看板顶部按钮',
  'Calendar: first day of week': '日历：一周的第一天',
  'Override which day is used as the start of the week': '设置一周从星期几开始',
  Sunday: '星期日',
  Monday: '星期一',
  Tuesday: '星期二',
  Wednesday: '星期三',
  Thursday: '星期四',
  Friday: '星期五',
  Saturday: '星期六',
  'Background color': '背景颜色',
  Tag: '标签',
  'Text color': '文字颜色',
  'Date is': '日期条件',
  Today: '今天',
  'After now': '晚于现在',
  'Before now': '早于现在',
  'Between now and': '介于现在和',
  After: '之后',
  Before: '之前',
  'Display date colors': '显示日期颜色',
  'Set colors for dates displayed in cards based on the rules below.':
    '根据以下规则设置卡片中日期的显示颜色。',
  'Add date color': '添加日期颜色规则',
  Hours: '小时',
  Days: '天',
  Weeks: '周',
  Months: '月',

  // MetadataSettings.tsx
  'Metadata key': '元数据键',
  'Display label': '显示名称',
  'Hide label': '隐藏名称',
  'Drag to rearrange': '拖动以重新排序',
  Delete: '删除',
  'Add key': '添加键',
  'Add tag': '添加标签',
  'Field contains markdown': '字段包含 Markdown',
  'Tag sort order': '标签排序顺序',
  'Set an explicit sort order for the specified tags.': '为指定标签设置明确的排序顺序。',

  // TagColorSettings.tsx
  'Add tag color': '添加标签颜色',

  // components/Table.tsx
  List: '列',
  Card: '卡片',
  Date: '日期',
  Tags: '标签',

  Priority: '优先级',
  Start: '开始日期',
  Created: '创建日期',
  Scheduled: '计划日期',
  Due: '截止日期',
  Cancelled: '已取消',
  'Done date': '完成日期',
  'Cancelled date': '取消日期',
  Recurrence: '重复规则',
  'Depends on': '依赖于',
  ID: 'ID',

  // components/Item/Item.tsx
  'More options': '更多选项',
  Cancel: '取消',
  Done: '完成',
  Save: '保存',

  // components/Item/ItemContent.tsx
  today: '今天',
  yesterday: '昨天',
  tomorrow: '明天',
  'Change date': '更改日期',
  'Change time': '更改时间',

  // components/Item/ItemForm.tsx
  'Card title...': '卡片标题……',
  'Add card': '添加卡片',
  'Add a card': '添加卡片',

  // components/Item/ItemMenu.ts
  'Edit card': '编辑卡片',
  'New note from card': '从卡片新建笔记',
  'Archive card': '归档卡片',
  'Delete card': '删除卡片',
  'Edit date': '编辑日期',
  'Add date': '添加日期',
  'Remove date': '移除日期',
  'Edit time': '编辑时间',
  'Add time': '添加时间',
  'Remove time': '移除时间',
  'Duplicate card': '复制卡片',
  'Split card': '拆分卡片',
  'Copy link to card': '复制卡片链接',
  'Insert card before': '在上方插入卡片',
  'Insert card after': '在下方插入卡片',
  'Add label': '添加标签',
  'Move to top': '移到顶部',
  'Move to bottom': '移到底部',
  'Move to list': '移动到列',

  // components/Lane/LaneForm.tsx
  'Enter list title...': '输入列标题……',
  'Mark cards in this list as complete': '将此列中的卡片标记为完成',
  'Add list': '添加列',
  'Add a list': '添加列',

  // components/Lane/LaneHeader.tsx
  'Move list': '移动列',
  Close: '关闭',

  // components/Lane/LaneMenu.tsx
  'Are you sure you want to delete this list and all its cards?':
    '确定要删除此列及其中的所有卡片吗？',
  'Yes, delete list': '是，删除此列',
  'Are you sure you want to archive this list and all its cards?':
    '确定要归档此列及其中的所有卡片吗？',
  'Yes, archive list': '是，归档此列',
  'Are you sure you want to archive all cards in this list?': '确定要归档此列中的所有卡片吗？',
  'Yes, archive cards': '是，归档所有卡片',
  'Edit list': '编辑列',
  'Archive cards': '归档卡片',
  'Archive list': '归档列',
  'Delete list': '删除列',
  'Insert list before': '在前面插入列',
  'Insert list after': '在后面插入列',
  'Sort by card text': '按卡片文本排序',
  'Sort by date': '按日期排序',
  'Sort by tags': '按标签排序',
  'Sort by': '排序方式',
  'Sort by {{field}}': '按{{field}}排序',

  // components/helpers/renderMarkdown.ts
  'Unable to find': '无法找到',
  'Open in default app': '在默认应用中打开',

  // components/Editor/MarkdownEditor.tsx
  Submit: '提交',
};

export default lang;
