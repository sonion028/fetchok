const path = require("node:path");
const TerserPlugin = require("terser-webpack-plugin");
const nodeExternals = require("webpack-node-externals")
const { deepClone, deleteFolder, copyFile } = require('./util');
const RemoveEsModuleFlag = require('webpack-remove-esm-flag'); // 移除esm Module标记
const DeleteConsole = require('webpack-delete-console'); // 移除console


const globalConfig = {
  mode: "production",
  target: 'web',
  output: {
    path: path.resolve(__dirname, "dist"),
    library: {
      type: "module", // 打包成 ES Module
    },
    clean: false, // 不清除之前的
  },
  stats: "error-only",
  devtool: false,
  experiments: {
    outputModule: true, // 打包成 ES Module
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  // plugins: [new DeleteConsole()], // 传输就保存warn、error
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: { loader: "ts-loader" },
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        use: { loader: "babel-loader" },
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    usedExports: true, // tree-shaking相关
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false, //不将注释提取到单独的文件中
        terserOptions: {
          output: {
            comments: /@/, // 只保留函数注释
            // comments: false, // 删除所有注释
          },
          compress: { 
            // drop_console: true, // 删除所有 console
            pure_funcs: [
              'console.log', // 移除console.log
              'console.info', // 移除console.info
              'console.debug', // 移除console.debug
              'console.time', // 移除console.time
              'console.timeEnd', // 移除console.timeEnd
              'console.dir', // 移除console.dir
              'console.table', // 移除console.table
            ] // 只保留console.warn、console.error
          }, 
        },
      }),
    ],
  },
};


// 创建 ESM 配置
const createESMConfig = (entry, outPutFileName)=>{
  const config = deepClone(globalConfig);
  config.entry = entry;
  config.output.filename = outPutFileName
  return config;
}

// 增加 CommonJS 特殊配置
const addCJSConfig = (config) => {
  config.output.library.type = "commonjs2";
  config.experiments.outputModule = false; // 不打包成 ES Module
  return config;
}

// 增加 node 环境特殊配置
const addNodeConfig = (config, chunkFormat)=>{
  config.target = 'node'; // 指定目标环境为node
  config.externals = [nodeExternals()]; // 防止打包包含node包
  config.output.chunkFormat = chunkFormat; // 明确指定chunk格式为'ES Module'还是'commonjs'
  return config;
}

// 小程序导出中不能有__esModule标识。假如去除的plugin
const addAutoRemoveESMFlagConfig = (config)=>{
  config.plugins = config.plugins || [];
  config.plugins.push(new RemoveEsModuleFlag());
  return config
}

// 小程序Mac缺少TextDecoder，自动注入 // 自定义了 MyTextDecoder，暂时不用注入了
const addAutoInjectDecoderConfig = (config)=>{
  // config.plugins = config.plugins || [];
  // const webpack = require('webpack');
  // config.plugins.push(new webpack.ProvidePlugin({
  //   TextDecoder: ['text-decoding', 'TextDecoder'],
  // }));
  return config
}


// 浏览器环境配置 - ES Module
const createBrowserESMConfig = () => createESMConfig("./src/browser.ts", "index.browser.js");
// 浏览器环境配置 - CommonJS
const createBrowserCJSConfig = () => addCJSConfig(createESMConfig("./src/browser.ts", "index.browser.cjs"));


// Node.js环境配置 - ES Module
const createNodeESMConfig = () => addNodeConfig(createESMConfig("./src/node.ts", "index.node.js"), 'module');
// Node.js环境配置 - CommonJS
const createNodeCJSConfig = () => addNodeConfig(addCJSConfig(createESMConfig("./src/node.ts", "index.node.cjs")), 'commonjs');


// 微信小程序环境配置 - ES Module
const createWxAppletESMConfig = () => addAutoInjectDecoderConfig(addAutoRemoveESMFlagConfig(createESMConfig("./src/wxApplet.ts", "index.wxApplet.js")));
// 微信小程序环境配置 - CommonJS
const createWxAppletCJSConfig = () => addAutoInjectDecoderConfig(addCJSConfig(createESMConfig("./src/wxApplet.ts", "index.wxApplet.cjs.js")));



// 导出所有配置
module.exports =()=>{
  deleteFolder(path.resolve(__dirname, 'dist')); // 删除dist目录
  copyFile(path.resolve(__dirname, 'src/types.d.ts'), path.resolve(__dirname, 'dist/types.d.ts')); // 拷贝公共类型声明文件
  return [
    createBrowserESMConfig(),
    createBrowserCJSConfig(),
    createNodeESMConfig(),
    createNodeCJSConfig(),
    createWxAppletESMConfig(),
    createWxAppletCJSConfig(),
  ];
}