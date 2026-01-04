import { color } from './color.mjs'
import { clamp, formatTime } from './utils.mjs'

export function createBar(ctx, opts) {
  const state = {
    total: opts.total,
    current: 0,
    start: Date.now(),
    format: opts.format,
    minWidth: opts.minWidth ?? 10,
    prefix: opts.prefix ?? '',
    payload: opts.payload ?? '',
    hideOnComplete: opts.hideOnComplete ?? false,
    complete: false
  }
  function update(n) {
    state.current = clamp(n, 0, state.total)
    if (state.current >= state.total) {
      state.complete = true
    }
    ctx.render()
  }
  function tick(n = 1) {
    update(state.current + n)
  }

  function step(n = 1, payload) {
    state.payload = payload
    tick(n)
  }

  function render(width) {
    const elapsed = (Date.now() - state.start) / 1000
    const percent = state.current / state.total

    const staticLen = state.format
      .replace(':bar', '')
      .replace(':percent', '100%')
      .replace(':current', state.total)
      .replace(':total', state.total)
      .replace(':payload', state.payload)
      .replace(':eta', '00s').length

    const barWidth = Math.max(
      state.minWidth,
      width - staticLen - state.prefix.length - 4
    )

    const filled = Math.round(barWidth * percent)
    const bar =
      color.bar('█'.repeat(filled)) + color.dim('░'.repeat(barWidth - filled))

    const rate = state.current / elapsed
    const eta = rate ? (state.total - state.current) / rate : Infinity

    return (
      (state.prefix ? `${state.prefix} ` : '') +
      state.format
        .replace(':bar', bar)
        .replace(':percent', color.percent(`${Math.round(percent * 100)}%`))
        .replace(':current', state.current)
        .replace(':total', state.total)
        .replace(':payload', state.payload)
        .replace(':elapsed', formatTime(elapsed))
        .replace(':eta', formatTime(eta))
    )
  }

  return {
    state,
    tick,
    step,
    update,
    render
  }
}
