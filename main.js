const { app, BrowserWindow } = require("electron");
const electronWindowState = require("electron-window-state");

let mainWindow;

const createMainWindow = () => {
  // this is to save the last state of app (like what was the location of app when it closed)
  let mainWindowState = electronWindowState({
    defaultWidth: 500,
    defaultHeight: 600,
  });

  // creating a new browser window object for app
  mainWindow = new BrowserWindow({
    width: mainWindowState.width,
    height: mainWindowState.height,
    x: mainWindowState.x,
    y: mainWindowState.y,
    minWidth: 400,
    minHeight: 500,
    maxWidth: 650,
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
  // mainWindow.webContents.openDevTools();

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
