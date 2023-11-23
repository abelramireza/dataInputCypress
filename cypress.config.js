const { defineConfig } = require("cypress");
const getCompareSnapshotsPlugin = require("cypress-visual-regression/dist/plugin");
const { tagify } = require("cypress-tags");

const xlsx = require("node-xlsx").default;
const fs = require("fs"); // for file
const path = require("path"); // for file path

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://stage-service-management.coderfull.com/",
    excelPath: "cypressData.xlsx",
    defaultCommandTimeout: 25000,
    pageLoadTimeout: 60000,
    retries: 0,
    viewportWidth: 1280,
    viewportHeight: 720,
    screenshotOnRunFailure: true,
    video: false,
    trashAssetsBeforeRuns: true,
    chromeWebSecurity: false,
    screenshotsFolder: "cypress/snapshots/actual",
    hideXHRInCommandLog: true,

    setupNodeEvents(on, config) {
      on("file:preprocessor", tagify(config));
      // implement node event listeners here
      getCompareSnapshotsPlugin(on, config);

	  
  // `on` is used to hook into various events Cypress emits
  on("task", {
    parseXlsx({ filePath }) {
      return new Promise((resolve, reject) => {
        try {
          const jsonData = xlsx.parse(fs.readFileSync(filePath));
          resolve(jsonData);
        } catch (e) {
          reject(e);
        }
      });
    }
  });
      

      // These dimensions are NOT automatically inherited from viewportWidth and viewportHeight
      on("before:browser:launch", (browser = {}, launchOptions) => {
        console.log(
          "launching browser %s is headless? %s",
          browser.name,
          browser.isHeadless
        );

        // the browser width and height we want to get
        // our screenshots and videos will be of that resolution
        const width = 1280;
        const height = 720;

        console.log(
          "setting the browser window size to %d x %d",
          width,
          height
        );

        if (browser.name === "chrome" && browser.isHeadless) {
          launchOptions.args.push(`--window-size=${width},${height}`);

          // force screen to be non-retina and just use our given resolution
          launchOptions.args.push("--high-dpi-support=1");
          launchOptions.args.push("--force-device-scale-factor=0.5");
          launchOptions.args.push("--disable-gpu");

          // Force the colour profile - should reduce colour differences in diffs between MacOS and Linux (CI)
          launchOptions.args.push("--force-color-profile=srgb");

          // Force font rendering - should reduce differences in diffs between MacOS and Linux (CI)
          launchOptions.args.push("--font-render-hinting=none");
          launchOptions.args.push("--hide-scrollbars");
          launchOptions.args.push("--disable-renderer-backgrounding");
          launchOptions.args.push("--disable-backgrounding-occluded-windows");
          launchOptions.args.push("--disable-low-res-tiling");
          launchOptions.args.push("--disable-smooth-scrolling");
          launchOptions.args.push("--disable-background-networking");
          launchOptions.args.push("--disable-dev-shm-usage");
          launchOptions.args.push("--disable-hang-monitor");
          launchOptions.args.push("--ignore-gpu-blocklist");
          launchOptions.args.push("--disable-infobars");
        }

        if (browser.name === "electron" && browser.isHeadless) {
          // might not work on CI for some reason
          launchOptions.preferences.width = width;
          launchOptions.preferences.height = height;
          launchOptions.preferences.resizable = false;
        }

        if (browser.name === "firefox" && browser.isHeadless) {
          launchOptions.args.push(`--width=${width}`);
          launchOptions.args.push(`--height=${height}`);
        }

        // IMPORTANT: return the updated browser launch options
        console.log(launchOptions);
        return launchOptions;
      });

      const environmentName = config.env.environmentName || "stage";
      const environmentFilename = `./${environmentName}.settings.json`;
      console.log("loading %s", environmentFilename);
      const settings = require(environmentFilename);
      if (settings.baseUrl) {
        config.baseUrl = settings.baseUrl;
      }
      if (settings.env) {
        config.env = {
          ...config.env,
          ...settings.env,
        };
      }
      console.log("loaded settings for environment %s", environmentName);

      // IMPORTANT: return the updated config object
      // for Cypress to use it
      return config;
    },
    reporter: "cypress-multi-reporters",
    reporterOptions: {
      configFile: "reporter-config.json",
    },
  },
  env: {
    //for getCompareSnapshotsPlugin
    type: "base",
    failSilently: false,
    ALWAYS_GENERATE_DIFF: false,
    ALLOW_VISUAL_REGRESSION_TO_FAIL: false, //if true avoid comparison image failures
    EXCEL_FILE_PATH: "cypressData.xlsx"
  },
});
