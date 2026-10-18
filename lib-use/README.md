# DataGear图表插件示例项目 - 依赖库用途

提供DataGear自6.0.0版本起、基于看板API-2.0的图表插件开发前端项目示例。

DataGear是一款开源免费的数据可视化分析平台，支持自由制作任何数据看板。

官网：

[http://datagear.tech](http://datagear.tech)

图表插件开发文档：

[http://www.datagear.tech/docs/current/custom-chart-plugin.html](http://www.datagear.tech/docs/current/custom-chart-plugin.html)

## 技术栈

- Vite

## 初始化

### 1. plugin.json

根据插件功能，定义`plugin.json`文件的内容，具体参考上述图表插件开发文档中的`plugin.json`文件规范。

其中：

- `id`值必须修改，且要确保全局唯一。
- `additions.libDepend`定义插件可提供的依赖库，其中的`source`值应是插件提供的依赖库路径`"lib/***"`。

### 2. lib/

在此文件夹中存放此插件提供的依赖库文件。

### 3. manual.md

补充插件使用手册。

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
