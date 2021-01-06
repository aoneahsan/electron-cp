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

  websiteWindow.webContents.on("did-finish-load", (e) => {
    let title = websiteWindow.getTitle();

    websiteWindow.webContents.capturePage().then((image) => {
      let screenshort = image.toDataURL();
      
      callbacks({ id: Math.random().toString(), title, screenshort, url });

      websiteWindow.close();
      websiteWindow = null;
    });
  });
};

module.exports = createWindow;
