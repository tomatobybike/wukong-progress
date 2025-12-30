import chalk from 'chalk'
import { createMultiBar } from '../src/index.mjs'

const mb = createMultiBar()

const bar = mb.create(100, {
  prefix: chalk.cyan('Build'),
  format: chalk.cyan('Build [:bar] :percent :current/:total')
})

async function run() {
  for (let i = 0; i <= 100; i++) {
    await new Promise(r => setTimeout(r, 20))
    bar.tick()
  }
  mb.stop()
  console.log(chalk.green('\nDone!\n'))
}

run()
