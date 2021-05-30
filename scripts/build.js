"use strict";

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";
process.env.REACT_APP_FETCH_BASE_URL = "http://192.168.1.2";
process.env.REACT_APP_NOAUTH_BASE_URL = "/gateway/roster/api";
process.env.REACT_APP_GATEWAY_PAYROLL_URL = "/gateway/payroll/api";
process.env.REACT_APP_SERVER_BASE_URL =
  "/gateway/attendance/api/attendanceTeamApp";
process.env.REACT_APP_SENTRY = process.env.NODE_ENV_SENTRY;
process.env.REACT_APP_LANGUAGE_ENV = process.env.NODE_ENV_LAN || "zh_CN";

const fs = require("fs");
const glob = require("glob");

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", (err) => {
  console.log(err);
  throw err;
});

// Ensure environment variables are read.
require("../config/env");
const path = require("path");
const chalk = require("chalk");
const fs1 = require("fs-extra");
const webpack = require("webpack");
const config = require("../config/webpack.config");
const paths = require("../config/paths");
const checkRequiredFiles = require("react-dev-utils/checkRequiredFiles");
const formatWebpackMessages = require("react-dev-utils/formatWebpackMessages");
const printHostingInstructions = require("react-dev-utils/printHostingInstructions");
const FileSizeReporter = require("react-dev-utils/FileSizeReporter");
const printBuildError = require("react-dev-utils/printBuildError");
const measureFileSizesBeforeBuild =
  FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;
const useYarn = fs1.existsSync(paths.yarnLockFile);

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

// Warn and crash if required files are missing
// if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
//     process.exit(1);
// }

// First, read the current file sizes in build directory.
// This lets us display how much they changed later.
measureFileSizesBeforeBuild(paths.appBuild)
  .then((previousFileSizes) => {
    // Remove all content but keep the directory so that
    // if you're in it, you don't end up in Trash
    fs1.emptyDirSync(paths.appBuild);
    // Merge with the public folder
    copyPublicFolder();
    // Start the webpack build
    return build(previousFileSizes);
  })
  .then(
    ({ stats, previousFileSizes, warnings }) => {
      if (warnings.length) {
        console.log(chalk.yellow("Compiled with warnings.\n"));
        console.log(warnings.join("\n\n"));
        console.log(
          "\nSearch for the " +
            chalk.underline(chalk.yellow("keywords")) +
            " to learn more about each warning."
        );
        console.log(
          "To ignore, add " +
            chalk.cyan("// eslint-disable-next-line") +
            " to the line before.\n"
        );
      } else {
        console.log(chalk.green("Compiled successfully.\n"));
      }

      console.log("File sizes after gzip:\n");
      printFileSizesAfterBuild(
        stats,
        previousFileSizes,
        paths.appBuild,
        WARN_AFTER_BUNDLE_GZIP_SIZE,
        WARN_AFTER_CHUNK_GZIP_SIZE
      );
      console.log("startTime--", stats.startTime);
      console.log("endTime--", stats.endTime);
      console.log("Timer--", stats.endTime - stats.startTime);

      // const appPackage = require(paths.appPackageJson);
      // const publicUrl = paths.publicUrl;
      // const publicPath = config.output.publicPath;
      // const buildFolder = path.relative(process.cwd(), paths.appBuild);
      // printHostingInstructions(
      //     appPackage,
      //     publicUrl,
      //     publicPath,
      //     buildFolder,
      //     useYarn
      // );
    },
    (err) => {
      console.log(chalk.red("Failed to compile.\n"));
      printBuildError(err);
      process.exit(1);
    }
  );

// Create the production build and print the deployment instructions.
function build(previousFileSizes) {
  console.log("Creating an optimized production build...");

  let compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err);
      }
      const rawMessages = stats.toJson({ moduleTrace: false }, true);
      // const messages = formatWebpackMessages(stats.toJson({}, true));
      const messages = formatWebpackMessages({
        errors: rawMessages.errors.map((e) => e.message),
        warnings: rawMessages.warnings.map((e) => e.message),
      });
      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        return reject(new Error(messages.errors.join("\n\n")));
      }
      if (
        process.env.CI &&
        (typeof process.env.CI !== "string" ||
          process.env.CI.toLowerCase() !== "false") &&
        messages.warnings.length
      ) {
        console.log(
          chalk.yellow(
            "\nTreating warnings as errors because process.env.CI = true.\n" +
              "Most CI servers set it automatically.\n"
          )
        );
        return reject(new Error(messages.warnings.join("\n\n")));
      }
      return resolve({
        stats,
        previousFileSizes,
        warnings: messages.warnings,
      });
    });
  });
}

function copyPublicFolder() {
  paths.appPublic.forEach((publicPath) => {
    fs1.copySync(publicPath, paths.appBuild, {
      dereference: true,
      filter: (file) => {
        return !(
          file.includes("/src/js") > 0 ||
          file.includes("\\src\\js") > 0 ||
          file.includes(".less") > 0
        );
      },
    });
  });
}
