module.exports = {
  transpileDependencies: ["vuetify"],
  pwa: {
    name: "HouseholdApp",
    themeColor: "#1976d2",
    msTileColor: "#1976d2",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "blue",

    // configure the manifest options
    manifestOptions: {
      display: "minimal-ui",
      background_color: "#1976d2"
      // ...other Manifest options...
    }

    // configure the workbox plugin
    /* workboxPluginMode: "InjectManifest",
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      //swSrc: "dev/sw.js"
      // ...other Workbox options...
    } */
  }
};
