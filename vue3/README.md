# DataGear图表插件示例项目 - 常规用途

提供DataGear自6.0.0版本起、基于看板API-2.0的图表插件开发前端项目示例。

DataGear是一款开源免费的数据可视化分析平台，支持自由制作任何数据看板。

官网：

[http://datagear.tech](http://datagear.tech)

图表插件开发文档：

[http://www.datagear.tech/docs/current/custom-chart-plugin.html](http://www.datagear.tech/docs/current/custom-chart-plugin.html)

## 技术栈

- Vue3
- Vite

## 初始化

### 1. plugin.json

根据插件功能，定义`plugin.json`文件的内容，具体参考上述图表插件开发文档中的`plugin.json`文件规范。

其中：

- `id`值必须修改，且要确保全局唯一。
- `additions.internalRendererVar`用于定义`src/index.js`打包后的全局JS变量名，其值必须修改，且要确保全局唯一。
- `additions.externalDepend`用于定义`src/index.js`打包后的外部依赖库，应根据其`import`内容同步修改。

### 2. src/index.js

根据插件功能，定义`internalRenderer`逻辑。

### 3. manual.md

补充插件使用手册。

### 4. index.html

此文件仅用于调试项目，通常仅需要修改如下内容：

- `dashboardFetcher()`函数的`data`数据。

- `chartRoot`中的`dataSetBinds`数据。

## 调试

```bash
npm install
npm run dev
```

在浏览器中打开调试地址（比如`http://localhost:5173`）即可查看和调试。

## 打包

```bash
npm run build
```

执行后，会在产物目录（默认为`dist`）内生成图表插件的zip包，按照上述图表插件开发文档中的步骤安装至DataGear系统后即可使用。

## 分享

1、 发布插件：

[http://datagear.tech/plugin/release](http://datagear.tech/plugin/release)

2、 浏览插件：

[http://datagear.tech/plugin/](http://datagear.tech/plugin/)
