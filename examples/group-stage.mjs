import chalk from 'chalk'
import { createMultiBar } from '../src/index.mjs'

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
