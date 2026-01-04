import chalk from 'chalk'

import { createMultiBar } from '../src/index.mjs'
import { wait } from '../src/utils/wait.mjs'

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
  build.step(5, '正在提取 Git 提交记录...')
  build.step(15, '正在解析提交记录...')
  await wait(1500)
  build.step(25, '正在生成 Changelog...')
  await wait(1500)
  build.step(65, '正在生成 Release 信息...')
  test.tick(99)
  await wait(1500)

  mb.stop()
  console.log(chalk.green('\nAll tasks done!\n'))
}

run()
