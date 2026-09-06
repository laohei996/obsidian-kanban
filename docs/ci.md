# CI 与回归测试

## 检查如何运行

`.github/workflows/ci.yml` 在面向 `main` 的 PR 创建、更新、重新打开时运行，也检查 main push，并支持手动触发。使用 Node 24.x、Yarn 1.22.22 和冻结的 `yarn.lock`。

| 检查 | 内容 |
| --- | --- |
| Quality | TypeScript、递归 ESLint、本地化词典校验 |
| Regression | `yarn test`，真实产品行为与构建元数据回归 |
| Build | 生产构建、元数据/产物验证、测试安装包 |
| CI / Required | 前三项全部成功才通过；失败、取消、跳过均不放行 |

工作流不写仓库、不自动修复代码、不合并 PR、不创建版本标签或 Release。发布仍使用独立的 tag 工作流。

**检查存在不等于强制门禁。** 管理员需在工作流实际运行后，将 `CI / Required` 设为 main 的必需检查，保留人工审阅，并按团队要求禁止绕过。此变更不自行设置这些仓库规则。

新 CI 合入 main 不会自动补跑所有已开放 PR。经授权更新旧 PR 分支并触发新的 PR 运行后，应核对检查对应的源提交和合并结果。对 main 手动运行 CI 不能替代另一个 PR 的检查。

## 本地运行：不要覆盖正式插件

源码目录如果位于 Vault 的 `.obsidian/plugins/obsidian-kanban`，产品构建会直接覆盖其中的 `main.js` 和 `styles.css`。**不要在正式安装目录运行 build/dev、安装依赖或写入式 lint。**

先准备 Node 24.x、Yarn 1.22.22，以及打包使用的 `zip`。下面从仓库目录创建独立副本，所有生成文件留在临时目录：

```sh
source_dir="$PWD"
scratch="$(mktemp -d)"
rsync -a \
  --exclude=.git --exclude=node_modules \
  --exclude=main.js --exclude=styles.css \
  "$source_dir/" "$scratch/project/"

cd "$scratch/project"
node --version
yarn --version
yarn install --frozen-lockfile --non-interactive
yarn typecheck
yarn lint
yarn i18n:check
yarn test
yarn build
node scripts/package-ci.mjs "$scratch/package"
```

ESLint 使用独立的 `tsconfig.eslint.json` 递归纳入全部 `src/**/*.ts` 与 `src/**/*.tsx`，包括未被入口导入的文件；生产 `tsconfig.json` 和原有 Lint 规则不变。

`package-ci.mjs` 要求一个尚不存在的输出目录，不覆盖旧包。上述复制不包含 `.git`，因此本地包的 `checkoutSha`/`dirty` 为 null，不能冒充某个干净提交的精确构建。Actions 中必须来自干净的 `GITHUB_SHA` checkout。

测试运行器独立使用 esbuild 将测试与生产 TS 编译到系统临时目录，不调用插件构建配置；结束后清理 bundle。每个测试文件隔离运行，单测试超时 30 秒，设置 120 秒整体超时；超时或收到 SIGINT/SIGTERM 时，终止 esbuild 服务并中断测试。缺少测试文件、仅有空文件、全部跳过、编译错误、断言失败和异常中断均不能报告成功。

## 当前覆盖

当前 99 个用例直接导入实际实现，不复制业务算法或词典：64 个产品行为用例，以及 35 个构建元数据用例。

- **Markdown 基础行为**：真实 task-list 扩展，保留空格、x、X、斜杠和减号状态字符，嵌套与非任务内容；换行、缩进、首行 block ID 和列表上限解析。
- **内联元数据**：Dataview/Tasks 插件开关、嵌套、转义、未闭合字段、字段位置/顺序、Tasks 日期提取门槛。日期提取不等于日期合法性或格式化校验。
- **本地化运行时**：语言别名/区域回退、未知语言、真实空 Hindi 词典的英文 fallback、同模块语言切换、特殊字符与数字插值，以及复制正文菜单/提示的英文、简中和缺译回退。与静态词典检查互补。
- **复制卡片正文**：实际 helper 选择 `titleRaw` 而非显示标题，保留多行、Markdown、日期/标签及首尾空白，不附加外层任务标记或卡片 block ID，不修改输入对象；验证即时单次调用、方法 receiver、API 不可用、同步异常、异步拒绝和完成时序。
- **构建元数据**：插件版本与最低 Obsidian 版本必须是规范的 SemVer，允许合法预发布和构建标识，但拒绝前导 `v`、空白、前导零和非法标识；即使各文件填写一致，也不能放行无效版本。继续检查 package/manifest 版本及兼容性记录的一致性。

测试只模拟所需的 `app` 配置/插件启用状态、`window.localStorage.getItem` 和窄 `clipboard.writeText` 边界；不引入完整 Obsidian 或 DOM 替身。复制 helper 测试不证明实际菜单接线、系统剪贴板权限、成功/失败提示或真机粘贴正常，这些仍需真实宿主验收。

**暂不覆盖**完整 Markdown↔Board 读写、卡片编辑/拖动后的数据保留、Moment 日期逻辑、真实 Vault 写回、CodeMirror 焦点、日期弹窗和原生软键盘。这些检查不能被宣传为全部功能回归，也不能证明某一 CSS/移动交互修复已经通过真机验收。

## 添加回归用例

在 `tests/` 新增 `*.test.mjs`，使用 `node:test`、`node:assert/strict`，直接导入生产 `.ts` 或被测试的构建辅助 `.mjs`。运行 `yarn test` 会自动发现。

- 固定并明确写出输入与期望；不要复制生产算法生成期望，也不要只靠两个可能同时出错的生产函数往返。
- 对可自动化的 Bug，确认修复前用例失败、修复后通过。
- 只替换真实宿主边界，不能 mock 掉被验证的业务逻辑。
- 修改 globals 的用例使用串行 suite，通过 after/afterEach 恢复原 descriptor；原属性不存在时删除。
- 不依赖网络、固定 sleep 或隐式时区；需要时间或随机输入时明确固定。
- 不靠重试或 skip 隐藏失败。不稳定用例应有跟踪记录，不能静默当作正常覆盖。

## 下载和核对测试安装包

在对应 Actions 运行的 Artifacts 中下载 `kanban-test-...` 附件。Build 与其他检查并行，因此**有附件不代表完整 CI 已通过**；安装前先查看 `CI / Required` 和人工审阅状态。

附件包含：

- `kanban-plugin.zip`：根目录仅 main.js、manifest.json、styles.css；
- `build-info.json`：插件版本、实际 checkout SHA、PR head SHA、事件、运行编号、Node/Yarn 版本及各文件哈希；
- `SHA256SUMS.txt`：三个插件文件和安装 ZIP 的 SHA-256。

PR 默认验证 GitHub 生成的 **merge ref**。`checkoutSha` 是实际被构建的合并结果，`prHeadSha` 才是 PR 源提交，两者通常不同。main 的构建没有 PR head。不要仅凭 manifest 中的版本号识别测试包；非发布包不会为每次 PR 构建修改版本号。

先解开 Actions 附件，再将内部安装 ZIP 解压至同一个校验目录：

```sh
unzip kanban-plugin.zip
# macOS
shasum -a 256 -c SHA256SUMS.txt
# Linux 也可使用：sha256sum -c SHA256SUMS.txt
```

只在一次性测试 Vault 中安装三个插件文件，再加载插件。不要把 CI 包直接覆盖生产 Vault；不通过此流水线更新 BRAT。附件保留 7 天，且这些哈希只是可追溯记录，不是签名或安全背书。

移动交互变更仍应按 PR 清单做 Android/iOS 真机验收，包括真实输入法、键盘开关、编辑/提交、触摸与滚动。

## 失败排查

- **Quality**：查看首条类型、Lint 或词典错误；不要全局禁用规则来通过检查。
- **Regression**：日志给出失败名称、断言差异和源文件位置；确认运行的是正确 Node 版本与冻结依赖。
- **Build**：区分编译失败、元数据不一致、缺失资产和打包失败；不复用旧构建输出。
- **CI / Required**：检查上游三项；取消或跳过也会阻止通过。
- **安装包**：核对运行编号、两个 SHA、完整 CI 状态及本机下载文件哈希。

GitHub 上的触发、Linux fresh install 和附件上传必须通过实际 Actions 运行验证。本地执行成功不能替代云端结果。

## 后续阶段

1. **真实业务与宿主**：完整数据读写/编辑保留测试；真实 Obsidian 启动、打开、编辑、移动、视图切换、保存重载冒烟；失败截图和日志。不能用 jsdom 冒充真实宿主。
2. **长期兼容**：定时扩展 Obsidian 版本与桌面平台矩阵、大看板性能基线、依赖/工作流安全检查，以及发布前移动端验收。

构建 Node 版本与 Obsidian 内置 Electron 运行时是不同维度。初期不设装饰性的覆盖率门槛，优先保护数据完整性和高频用户流程，再逐步提高覆盖。
