const { BrowserWindow } = require("electron");

let websiteWindow;

const createWindow = (url, callbacks) => {
  websiteWindow = new BrowserWindow({
    width: 500,
    height: 500,
    show: false,
    webPreferences: {
      offscreen: true,
      nodeIntegration: false,
    },
  });

  websiteWindow.loadURL(url);

  console.log("renderItem.js == working...");
  websiteWindow.webContents.on("did-finish-load", (e) => {
    let title = websiteWindow.getTitle();

    console.log("renderItem.js == title = ", title);

    websiteWindow.webContents.capturePage().then((image) => {
      let screenshort = image.toDataURL();
      console.log("renderItem.js == screenshort done.");

      callbacks({ id: Math.random().toString(), title, screenshort, url });

      websiteWindow.close();
      websiteWindow = null;
    });
  });
};

module.exports = createWindow;
