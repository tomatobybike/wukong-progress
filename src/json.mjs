export function renderJSON(stream, bars) {
  const payload = {
    type: 'progress',
    bars: bars.map(b => ({
      name: b.state.prefix,
      current: b.state.current,
      total: b.state.total,
      percent: Math.round(
        (b.state.current / b.state.total) * 100
      ),
      complete: b.state.complete,
    })),
  }

  stream.write(`${JSON.stringify(payload)  }\n`)
}
