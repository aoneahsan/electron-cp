const { app, BrowserWindow, ipcMain } = require("electron");
const electronWindowState = require("electron-window-state");

// cusotm fiels
const renderItem = require("./renderItem.js");

let mainWindow;

const createMainWindow = () => {
  // this is to save the last state of app (like what was the location of app when it closed)
  let mainWindowState = electronWindowState({
    defaultWidth: 1500,
    defaultHeight: 1600,
  });

  // creating a new browser window object for app
  mainWindow = new BrowserWindow({
    width: mainWindowState.width,
    height: mainWindowState.height,
    x: mainWindowState.x,
    y: mainWindowState.y,
    minWidth: 1200,
    minHeight: 600,
    maxWidth: 1650,
    webPreferences: {
      // devTools: true, // see in docs what is it for
      nodeIntegration: true,
    },
  });

  // telling electron-window-state veriable to manage mainWindow
  mainWindowState.manage(mainWindow);

  // loading our html in that browser window
  mainWindow.loadFile("./renderer/main.html");

  // opening devtools for inspect/debugingpurposes
  mainWindow.webContents.openDevTools();

  // on main browser window close clearing mainwindow object
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};

// on browser window ready starting loading our content
app.on("ready", createMainWindow);

// Quiting app when all windows are closed
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// when app icon is clicked and app is runing recreate the app window (mac-ox)
app.on("activate", () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});

// CUSTOM CODE

// listening for events from renderer
ipcMain.on("new-item", (e, url) => {
  console.log("url from ipcrenderer = ", url);
  renderItem(url, (pageData) => {
    e.sender.send("new-item-success", pageData);
  });
});
