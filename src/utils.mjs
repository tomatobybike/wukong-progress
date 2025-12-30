export const clamp = (n, min, max) =>
  Math.min(Math.max(n, min), max)

export const formatTime = sec => {
  // eslint-disable-next-line no-restricted-globals
  if (!isFinite(sec)) return '--'
  if (sec < 60) return `${sec.toFixed(1)}s`
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}m${s}s`
}

export const termWidth = stream =>
  stream.columns || 80
