#!/usr/bin/env node
import esbuild from 'esbuild'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// 源码入口
const entry = join(__dirname, '..', 'src', 'index.mjs')

// 输出目录
const outDir = join(__dirname, '..', 'dist')

await esbuild.build({
  entryPoints: [entry],
  bundle: true,               // 打包依赖
  platform: 'node',           // Node.js 平台
  target: ['node18'],         // Node 18+
  format: 'esm',              // 输出 ESM
  outfile: join(outDir, 'index.mjs'),
  sourcemap: true,
  minify: false,
  external: ['chalk'],        // chalk 保留外部依赖，可选
})

// 同时生成 CJS 版本
/*
await esbuild.build({
  entryPoints: [entry],
  bundle: true,
  platform: 'node',
  target: ['node14'],
  format: 'cjs',
  outfile: join(outDir, 'index.cjs'),
  sourcemap: true,
  minify: false,
  external: ['chalk'],
}) */

console.log('✅ Build completed: dist/index.mjs + dist/index.cjs')
