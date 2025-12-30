let chalk = null

try {
  const mod = await import('chalk')
  chalk = mod.default
} catch { /* empty */ }

export const color = {
  bar: s => (chalk ? chalk.cyan(s) : s),
  dim: s => (chalk ? chalk.dim(s) : s),
  percent: s => (chalk ? chalk.green(s) : s),
}
