import { Writable } from 'node:stream'
import chalk from 'chalk'
import { createMultiBar } from '../src/index.mjs'

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

  console.log(chalk.green('JSON fallback output:'))
  console.log(out)
}

run()
