# wukong-progress

<p align="center">
  <a href="https://www.npmjs.com/package/wukong-progress"><img src="https://img.shields.io/npm/v/wukong-progress.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/wukong-progress"><img src="https://img.shields.io/npm/dm/wukong-progress.svg" alt="downloads"></a>
  <a href="https://github.com/tomatobybike/wukong-progress/blob/master/LICENSE"><img src="https://img.shields.io/github/license/tomatobybike/wukong-progress.svg" alt="license"></a>
  <a href="https://github.com/tomatobybike/wukong-progress"><img src="https://img.shields.io/github/stars/tomatobybike/wukong-progress.svg?style=social" alt="GitHub stars"></a>
  <a href="https://github.com/tomatobybike/wukong-progress/issues"><img src="https://img.shields.io/github/issues/tomatobybike/wukong-progress.svg" alt="issues"></a>
</p>

🎨 A Node.js / ESM style CLI progress bar library that supports:

- Single / multiple progress bars
- Group / Stage / prefix
- Concurrent task API (wrap async functions)
- Automatic terminal width adaptation
- Optional colored output (chalk, auto fallback)
- JSON fallback (for non-TTY environments)
- Full ESM + Node.js 18+ compatible
- Works on Windows / Linux / macOS

---
## English | [简体中文](./README.zh-CN.md)
---
## 🚀 Installation

```bash
yarn add wukong-progress chalk
# or
npm install wukong-progress chalk
```

---

## ⚡️ Basic Usage

### Single Progress Bar

```js
import chalk from "chalk";
import { createMultiBar } from "wukong-progress";

const mb = createMultiBar();
const bar = mb.create(100, {
  prefix: chalk.cyan("Build"),
  format: "Build [:bar] :percent :current/:total",
});

async function run() {
  for (let i = 0; i <= 100; i++) {
    await new Promise((r) => setTimeout(r, 20));
    bar.tick();
  }
  mb.stop();
  console.log(chalk.green("\nDone!\n"));
}

run();
```

### Multiple Progress Bars

```js
import chalk from "chalk";
import { createMultiBar } from "wukong-progress";

const mb = createMultiBar();
const build = mb.create(100, {
  prefix: chalk.blue("Build"),
  format: "Build [:bar] :percent",
});
const test = mb.create(50, {
  prefix: chalk.magenta("Test"),
  format: "Test  [:bar] :percent",
});

async function run() {
  for (let i = 0; i <= 100; i++) {
    await new Promise((r) => setTimeout(r, 15));
    if (i <= 50) test.tick();
    build.tick();
  }
  mb.stop();
  console.log(chalk.green("\nAll tasks done!\n"));
}

run();
```

### Step with Payload

Update progress with a descriptive payload message.

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
    build.step(5, 'Extracting Git history...')
    build.step(5, 'Parsing commits...')
    build.step(5, 'Generating Changelog...')
    build.step(5, 'Generating Release Info...')
  }
  mb.stop()
  console.log(chalk.green('\nAll tasks done!\n'))
}

run()
```

---

### Group / Stage / prefix

```js
import chalk from "chalk";
import { createMultiBar } from "wukong-progress";

const mb = createMultiBar();
const buildGroup = mb.group("Build Group");
buildGroup.create(50, {
  prefix: chalk.blue("Compile"),
  format: "Compile [:bar] :percent",
});
buildGroup.create(30, {
  prefix: chalk.cyan("Bundle"),
  format: "Bundle  [:bar] :percent",
});

const testGroup = mb.group("Test Group");
testGroup.create(20, {
  prefix: chalk.magenta("Unit"),
  format: "Unit [:bar] :percent",
});
testGroup.create(10, {
  prefix: chalk.yellow("E2E"),
  format: "E2E  [:bar] :percent",
});

async function run() {
  const allTasks = [...buildGroup.bars, ...testGroup.bars];

  for (let i = 0; i < 50; i++) {
    await new Promise((r) => setTimeout(r, 20));
    allTasks.forEach((bar) => {
      if (!bar.state.complete) bar.tick();
    });
  }

  mb.stop();
  console.log(chalk.green("\nGroups completed!\n"));
}

run();
```

---

### JSON Fallback (non-TTY / CI)

```js
import { Writable } from "node:stream";
import { createMultiBar } from "wukong-progress";

let out = "";
const stream = new Writable({
  write(chunk, _, cb) {
    out += chunk;
    cb();
  },
});

const mb = createMultiBar({ stream, json: true });
const bar = mb.create(5, { prefix: "JSON" });

async function run() {
  for (let i = 0; i <= 5; i++) {
    await new Promise((r) => setTimeout(r, 20));
    bar.tick();
  }
  mb.stop();

  console.log("JSON fallback output:");
  console.log(out);
}

run();
```

---

## 🎨 Colored Output (optional)

- Use `chalk` to color prefixes and bar output
- Auto fallback to plain text if chalk is not installed
- Example:

```js
prefix: chalk.green('Build'),
format: chalk.green('Build [:bar] :percent')
```

---

## 📂 Examples Folder

```bash
node examples/index.mjs
```

- Interactive selection of examples:

  - Single Bar
  - Multi Bar
  - Group / Stage
  - JSON Fallback

- Fully compatible with Windows / Linux / macOS
- All examples use async/await + chalk colored output

---

## ⚡️ Testing

```bash
# Node.js native test
yarn test:node

# Vitest snapshot test
yarn test:vitest

# Run all tests
yarn test
```

- ✅ Node:test for progress logic
- ✅ Vitest snapshot for rendering stability
- ✅ Supports mock TTY / ANSI strip / JSON fallback

---

## 💻 Use Cases

- CLI tools
- Automation scripts
- GitHub Actions / CI
- Concurrent task visualization
- Progress visualization + JSON logging for analytics
