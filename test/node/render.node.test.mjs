import test from 'node:test'
import assert from 'node:assert'
import { Writable } from 'node:stream'
import { createMultiBar } from '../../src/index.mjs'

// ✅ 创建可 mock TTY 的 stream
function createMockStream() {
  let out = ''
  return {
    write(chunk) {
      out += chunk
    },
    get output() {
      return out.replace(/\x1b\[[0-9;]*m/g, '') // 去掉 ANSI
    },
    isTTY: true,   // ✅ 关键：force TTY
    columns: 40
  }
}

test('progress render stable with TTY', async () => {
  const stream = createMockStream()
  const mb = createMultiBar({ stream })

  // 创建一个进度条
  const bar = mb.create(10, {
    prefix: 'Test',
    format: 'Test [:bar] :percent'
  })

  // 更新进度
  bar.update(5)

  // 输出里应该包含 "Test"
  assert.match(stream.output, /Test/)
  assert.match(stream.output, /50%/)

  // 更新到完成
  bar.update(10)
  assert.equal(bar.state.complete, true)
})

test('JSON fallback output when non-TTY', async () => {
  let out = ''
  const stream = new Writable({
    write(chunk, _, cb) {
      out += chunk
      cb()
    }
  })

  const mb = createMultiBar({ stream, json: true })
  const bar = mb.create(5, { prefix: 'JSON' })

  bar.update(3)

  const lines = out
    .split('\n')
    .filter(Boolean)
    .map(l => JSON.parse(l))

  assert.equal(lines[1].bars[0].current, 3)
  assert.equal(lines[1].bars[0].total, 5)
})
