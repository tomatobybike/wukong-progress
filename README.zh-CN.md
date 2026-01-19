
# wukong-progress

<p align="center">
  <a href="https://www.npmjs.com/package/wukong-progress"><img src="https://img.shields.io/npm/v/wukong-progress.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/wukong-progress"><img src="https://img.shields.io/npm/dm/wukong-progress.svg" alt="downloads"></a>
  <a href="https://github.com/tomatobybike/wukong-progress/blob/master/LICENSE"><img src="https://img.shields.io/github/license/tomatobybike/wukong-progress.svg" alt="license"></a>
  <a href="https://github.com/tomatobybike/wukong-progress"><img src="https://img.shields.io/github/stars/tomatobybike/wukong-progress.svg?style=social" alt="GitHub stars"></a>
  <a href="https://github.com/tomatobybike/wukong-progress/issues"><img src="https://img.shields.io/github/issues/tomatobybike/wukong-progress.svg" alt="issues"></a>
</p>

🎨 Node.js / ESM 风格的 CLI 进度条库，支持：

- 单条 / 多条进度条
- Group / Stage / prefix
- 并发任务 API（wrap async fn）
- 自动适配终端宽度
- 彩色渲染（chalk，可选，自动降级）
- JSON fallback（非 TTY）
- 完全 ESM + Node.js 18+ 兼容
- 可在 Windows / Linux / macOS 使用

---
## 中文 | [English](./README.md)
---

## 🚀 安装

```bash
yarn add wukong-progress chalk
# or
npm install wukong-progress chalk
```

---

## ⚡️ 基本用法

### 单条进度条

```js
import chalk from 'chalk'
import { createMultiBar } from 'wukong-progress'

const mb = createMultiBar()
const bar = mb.create(100, { prefix: chalk.cyan('Build'), format: 'Build [:bar] :percent :current/:total' })

async function run() {
  for (let i = 0; i <= 100; i++) {
    await new Promise(r => setTimeout(r, 20))
    bar.tick()
  }
  mb.stop()
  console.log(chalk.green('\nDone!\n'))
}

run()
```

### 多条进度条

```js
import chalk from 'chalk'
import { createMultiBar } from 'wukong-progress'

const mb = createMultiBar()
const build = mb.create(100, { prefix: chalk.blue('Build'), format: 'Build [:bar] :percent' })
const test  = mb.create(50,  { prefix: chalk.magenta('Test'), format: 'Test  [:bar] :percent' })

async function run() {
  for (let i = 0; i <= 100; i++) {
    await new Promise(r => setTimeout(r, 15))
    if (i <= 50) test.tick()
    build.tick()
  }
  mb.stop()
  console.log(chalk.green('\nAll tasks done!\n'))
}

run()
```

### 带文字提示的步骤更新

使用 `step` 方法可以在更新进度的同时附加描述性文字。

```js
import chalk from 'chalk'
import { createMultiBar } from '../src/index.mjs'

const mb = createMultiBar()

const build = mb.create(100, {
  prefix: chalk.blue('Build'),
  format: 'Build [:bar] :percent :payload'
})
const test = mb.create(50, {
  prefix: chalk.magenta('Test'),
  format: 'Test  [:bar] :percent'
})

async function run() {
  for (let i = 0; i <= 100; i++) {
    await new Promise((r) => setTimeout(r, 15))
    if (i <= 50) test.tick()
    build.step(5, '正在提取 Git 提交记录...')
    build.step(5, '正在解析提交记录...')
    build.step(5, '正在生成 Changelog...')
    build.step(5, '正在生成 Release 信息...')
  }
  mb.stop()
  console.log(chalk.green('\nAll tasks done!\n'))
}

run()
```

---

### Group / Stage / prefix

```js
import chalk from 'chalk'
import { createMultiBar } from 'wukong-progress'

const mb = createMultiBar()
const buildGroup = mb.group('Build Group')
buildGroup.create(50, { prefix: chalk.blue('Compile'), format: 'Compile [:bar] :percent' })
buildGroup.create(30, { prefix: chalk.cyan('Bundle'),  format: 'Bundle  [:bar] :percent' })

const testGroup = mb.group('Test Group')
testGroup.create(20, { prefix: chalk.magenta('Unit'), format: 'Unit [:bar] :percent' })
testGroup.create(10, { prefix: chalk.yellow('E2E'),  format: 'E2E  [:bar] :percent' })

async function run() {
  const allTasks = [...buildGroup.bars, ...testGroup.bars]

  for (let i = 0; i < 50; i++) {
    await new Promise(r => setTimeout(r, 20))
    allTasks.forEach(bar => {
      if (!bar.state.complete) bar.tick()
    })
  }

  mb.stop()
  console.log(chalk.green('\nGroups completed!\n'))
}

run()
```

---

### JSON fallback（非 TTY 或 CI）

```js
import { Writable } from 'node:stream'
import { createMultiBar } from 'wukong-progress'

let out = ''
const stream = new Writable({
  write(chunk, _, cb) {
    out += chunk
    cb()
  }
})

const mb = createMultiBar({ stream, json: true })
const bar = mb.create(5, { prefix: 'JSON' })

async function run() {
  for (let i = 0; i <= 5; i++) {
    await new Promise(r => setTimeout(r, 20))
    bar.tick()
  }
  mb.stop()

  console.log('JSON fallback output:')
  console.log(out)
}

run()
```

---

## 🎨 彩色渲染（可选）

-   使用 `chalk` 可以给 prefix、bar 和提示上色

-   不依赖彩色也能降级到普通文本

-   示例：


```js
prefix: chalk.green('Build'),
format: chalk.green('Build [:bar] :percent')
```

---

## 📂 Examples 文件夹

```bash
node examples/index.mjs
```

-   交互式选择运行示例：

    -   Single Bar

    -   Multi Bar

    -   Group / Stage

    -   JSON Fallback

-   Windows / Linux / macOS 全平台兼容

-   所有示例都用 async/await + chalk 彩色渲染


---

## ⚡️ 测试

```bash
# Node.js 原生测试
yarn test:node

# Vitest snapshot 测试
yarn test:vitest

# 全部测试
yarn test
```

-   ✅ Node:test 测试进度条逻辑

-   ✅ Vitest snapshot 测试渲染稳定性

-   ✅ 支持 mock TTY / ANSI strip / JSON fallback


---

## 💻 适用场景

-   CLI 工具

-   自动化脚本

-   GitHub Actions / CI

-   多任务并发显示

-   可视化进度 / JSON 输出结合日志分析


