// const bpmr = require("babel-plugin-module-resolver");

// function resolvePath(sourcePath, currentFile, opts) {
//   if (sourcePath === "markdown") {
//     const base = currentFile.substring(__dirname.length).slice(0, -3);
//     return `${__dirname}/${base}/`;
//   }

//   return bpmr.resolvePath(sourcePath, currentFile, opts);
// }

const alias = {
  common: "./common",
  layout: "./components/layout",
  contexts: "./lib/contexts",
  models: "./lib/models",
  appRedux: "./lib/redux",
  services: "./lib/services",
  stores: "./lib/base/pref",
  utils: "./lib/utils",
  lib: "./lib",
  pages: "./pages"
};

module.exports = {
  presets: [
    "next/babel",
    "@zeit/next-typescript/babel",
    [
      "@babel/preset-env",
      {
        targets: {
          browsers: ["last 2 versions", "safari >= 7"]
        }
      }
    ]
  ],
  plugins: [
    // "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-proposal-class-properties",
    // "transform-class-constructor-call",
    // "@babel/plugin-transform-block-scoping",
    // // for IE 11 support
    // "@babel/plugin-transform-object-assign",
    // [
    //   "@babel/plugin-transform-runtime",
    //   {
    //     useESModules: false
    //   }
    // ],
    [
      "module-resolver",
      {
        alias,
        // transformFunctions: ['require', 'require.context'],
        // resolvePath
      }
    ]
  ],
  ignore: [/@babel[\/\\]runtime/], // Fix a Windows issue.
  env: {
    production: {
      plugins: [
        "@babel/plugin-proposal-class-properties",
        ["babel-plugin-transform-react-remove-prop-types", { mode: "remove" }]
      ]
    }
  }
};
