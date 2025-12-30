import chalk from 'chalk'
import { createMultiBar } from '../src/index.mjs'

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
