export function createGroup(ctx, name) {
  const bars = []

  function create(total, opts = {}) {
    const bar = ctx._createBar({
      ...opts,
      prefix: opts.prefix ?? name,
      total,
    })
    bars.push(bar)
    return bar
  }

  return { create, bars }
}
