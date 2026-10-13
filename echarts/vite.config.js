import { defineConfig } from 'vite';
import path from 'node:path';
import fs from 'node:fs';
import zipPack from 'vite-plugin-zip-pack';

//要添加至图表插件zip包的文件列表
const pluginZipFiles = ['plugin.json', 'renderer.js'];

//对src/index.js进行构建打包时外部化的依赖库
const buildExternal = [];
//上述外部化的依赖库在产物中映射到的全局变量名
const buildExternalGlobalVars = {};

const distDirName = "dist";
const distFileName = "internal-renderer.js";

const pluginJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'plugin.json'), 'utf-8')
);
const internalRendererVar = pluginJson.additions.internalRendererVar;

const distDir = path.resolve(__dirname, distDirName);
// 临时打包目录：项目内的 .temp 目录
const tempDir = path.resolve(__dirname, '.temp');

function inflateBuildExternal(depend) {
  if(depend == null)
    return;

  depend = (Array.isArray(depend) ? depend : [ depend ]);
  for(let i=0; i<depend.length; i++) {
    let item = depend[i];
    let importName = (item.importName != null ? item.importName : item.name);
    if(!buildExternal.includes(importName))
    {
      buildExternal.push(importName);
      buildExternalGlobalVars[importName] = item.name;
    }
    inflateBuildExternal(item.depend);
   }
}

inflateBuildExternal(pluginJson.additions.externalDepend);

// 在产物写入 dist 之后（writeBundle），将 plugin.json、renderer.js 及
// dist 文件夹复制到临时目录，供 vite-plugin-zip-pack 压缩。
// writeBundle 早于所有 closeBundle 钩子执行，因此临时目录一定先于压缩准备好。
function prepareZipTemp() {
  return {
    name: 'prepare-zip-temp',
    apply: 'build',
    writeBundle() {
      // 确保临时目录存在，并清空其中的历史内容（保留目录本身，
      // 避免删除被外部进程占用的空目录时报错）。
      fs.mkdirSync(tempDir, { recursive: true });
      for (const entry of fs.readdirSync(tempDir)) {
        fs.rmSync(path.join(tempDir, entry), {
          recursive: true,
          force: true,
          maxRetries: 5,
          retryDelay: 100
        });
      }

      // 复制 plugin.json、renderer.js 到临时目录根部
      for (const file of pluginZipFiles) {
        const src = path.resolve(__dirname, file);
        const dest = path.resolve(tempDir, file);
        if (fs.statSync(src).isDirectory()) {
          fs.cpSync(src, dest, { recursive: true });
        } else {
          fs.copyFileSync(src, dest);
        }
      }

      // 将 dist 文件夹整体复制到临时目录，保留 dist 子目录结构
      fs.cpSync(distDir, path.resolve(tempDir, distDirName), { recursive: true });
    }
  };
}

// 压缩完成后清理项目内的 .temp 临时目录。
function cleanupZipTemp() {
  return {
    name: 'cleanup-zip-temp',
    apply: 'build',
    enforce: 'post',
    closeBundle: {
      sequential: true,
      handler() {
        try {
          fs.rmSync(tempDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
        } catch (err) {
          // 尽力删除目录内文件，忽略仍被占用的目录本身
          try {
            for (const entry of fs.readdirSync(tempDir)) {
              fs.rmSync(path.join(tempDir, entry), {
                recursive: true,
                force: true,
                maxRetries: 5,
                retryDelay: 100
              });
            }
          } catch {
            // ignore
          }
        }
      }
    }
  };
}

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  build: {
    outDir: distDirName,
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: internalRendererVar,
      formats: ['iife'],
      fileName: () => distFileName
    },
    rollupOptions: {
      external: buildExternal,
      output: {
        // 关闭内联动态导入警告并确保单文件产物
        inlineDynamicImports: true,
        globals: buildExternalGlobalVars
      }
    }
  },
  plugins: [
    prepareZipTemp(),
    // 将临时目录压缩为以 plugin.json 中 id 命名的 zip 文件，输出到 dist
    zipPack({
      inDir: tempDir,
      outDir: distDirName,
      outFileName: `${pluginJson.id}.zip`
    }),
    cleanupZipTemp()
  ]
});
