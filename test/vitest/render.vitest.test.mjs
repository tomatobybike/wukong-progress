import { describe, it, expect } from 'vitest'
import { Writable } from 'node:stream'
import { createMultiBar } from '../../src/index.mjs'
import stripAnsi from 'strip-ansi'

// ✅ 可 mock TTY 的 stream
function createMockStream(columns = 40) {
  let out = ''
  return {
    write(chunk) {
      out += chunk
    },
    get output() {
      return stripAnsi(out)
    },
    isTTY: true,
    columns
  }
}

describe('progress snapshot', () => {
  it('renders stable text output', () => {
    const stream = createMockStream()
    const mb = createMultiBar({ stream })

    const bar = mb.create(10, {
      prefix: 'Compile',
      format: 'Compile [:bar] :percent :current/:total'
    })

    bar.tick(3)

    // ✅ snapshot 输出
    expect(stream.output).toMatchSnapshot()

    bar.tick(7)
    expect(bar.state.complete).toBe(true)
  })

  it('renders multiple bars', () => {
    const stream = createMockStream()
    const mb = createMultiBar({ stream })

    const build = mb.create(10, { prefix: 'Build', format: 'Build [:bar] :percent' })
    const test  = mb.create(5,  { prefix: 'Test',  format: 'Test  [:bar] :percent' })

    build.tick(5)
    test.tick(2)

    expect(stream.output).toMatchSnapshot()

    build.tick(5)
    test.tick(3)

    expect(build.state.complete).toBe(true)
    expect(test.state.complete).toBe(true)
  })
})
