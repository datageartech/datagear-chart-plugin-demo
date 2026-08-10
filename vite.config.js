import { defineConfig } from 'vite';
import path from 'node:path';
import fs from 'node:fs';

const pluginJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'plugin.json'), 'utf-8')
);
const internalRendererVar = pluginJson.additions.internalRendererVar;

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: internalRendererVar,
      formats: ['iife'],
      fileName: () => 'internal-renderer.js'
    },
    rollupOptions: {
      // 将 echarts 外部化，不打包进产物；由页面通过 <script> 提供全局 echarts
      external: ['echarts'],
      output: {
        // 关闭内联动态导入警告并确保单文件产物
        inlineDynamicImports: true,
        // IIFE 产物中，import 的 'echarts' 映射到全局变量 echarts
        globals: {
          echarts: 'echarts'
        }
      }
    }
  }
});
