import { createBar } from './bar.mjs'
import { createGroup } from './group.mjs'
import { renderJSON } from './json.mjs'
import { termWidth } from './utils.mjs'

export function createMultiBar({
  stream = process.stderr,
  clearOnComplete = false,
  json = false
} = {}) {
  const bars = []
  let lines = 0
  let active = true

  const isJSON = json || !stream.isTTY

  let ctx = null
  function group(name) {
    return createGroup(ctx, name)
  }

  function render() {
    if (!active) return

    if (isJSON) {
      renderJSON(stream, bars)
      return
    }

    if (lines > 0) {
      stream.write(`\x1b[${lines}A`)
    }

    const width = termWidth(stream)
    const visible = bars.filter(
      (b) => !(b.state.complete && b.state.hideOnComplete)
    )

    const output = visible.map((b) => b.render(width))

    stream.write(`${output.join('\n')}\n`)
    lines = output.length
  }

  function stop() {
    active = false
    if (!isJSON && clearOnComplete) {
      stream.write(`\x1b[${lines}A\x1b[J`)
    }
  }

  function _createBar(opts) {
    const bar = createBar(ctx, opts)
    bars.push(bar)
    render()
    return bar
  }

  ctx = {
    render,
    _createBar
  }

  return {
    create: (total, opts = {}) => _createBar({ ...opts, total }),
    group,
    stop
  }
}
