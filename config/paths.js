"use strict";

const path = require("path");
const fs = require("fs");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(relativePath, needsSlash) {
  const hasSlash = relativePath.endsWith("");
  if (hasSlash && !needsSlash) {
    return relativePath.substr(relativePath, relativePath.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${relativePath}/`;
  } else {
    return relativePath;
  }
}

const getPublicUrl = (appPackageJson) =>
  envPublicUrl || require(appPackageJson).homepage;

// config after eject: we're in ./config/
module.exports = {
  appBuild: resolveApp("dist/"),
  dotenv: resolveApp(".env"),
  appSrc: resolveApp("src"),
  publicUrl: getPublicUrl(resolveApp("package.json")),
  appNodeModules: resolveApp("node_modules"),
  appBackGroundJs: resolveApp("src/js/background-script/background.ts"),
  appContentJs: resolveApp("src/js/content-script/content.ts"),
  appPopupJs: resolveApp("src/js/popup-script/popup.tsx"),
  injectIhrJS: resolveApp("src/js/content-script/inject/injectIhr.ts"),
  recruitJs: resolveApp("src/js/content-script/recruitScript/recruit.ts"),
  autoFillAccountJs: resolveApp(
    "src/js/content-script/recruitScript/autoFillAccount"
  ),
  appPublic: [resolveApp("public"), resolveApp("src")],
};
