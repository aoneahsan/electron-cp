const { app, BrowserWindow, ipcMain, Menu, shell } = require("electron");
const electronWindowState = require("electron-window-state");

// cusotm fiels
const renderItem = require("./renderItem.js");
const autoUpdater = require("./auto-updater.js");

let mainWindow;

const createMainWindow = () => {
  // Checking for updates after 3second of app lunch (from Github Releases)
  setTimeout(autoUpdater, 3000);

  // this is to save the last state of app (like what was the location of app when it closed)
  let mainWindowState = electronWindowState({
    defaultWidth: 600,
    defaultHeight: 700,
  });

  // creating a new browser window object for app
  mainWindow = new BrowserWindow({
    width: mainWindowState.width,
    height: mainWindowState.height,
    x: mainWindowState.x,
    y: mainWindowState.y,
    minWidth: 600,
    minHeight: 500,
    maxHeight: 900,
    maxWidth: 800,
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

// CUSTOM CODE

// listening for events from renderer
ipcMain.on("new-item", (e, url) => {
  renderItem(url, (pageData) => {
    e.sender.send("new-item-success", pageData);
  });
});

// menu

const addItemModel = () => {
  mainWindow.webContents.send("openAddItemModal", true);
};

const openItemInAPP = () => {
  mainWindow.webContents.send("openItemInAPP", true);
};

const deleteItemFromApp = () => {
  mainWindow.webContents.send("deleteItemFromApp", true);
};

const openItemInShell = () => {
  mainWindow.webContents.send("openItemInShell", true);
};

const searchItem = () => {
  mainWindow.webContents.send("searchItem", true);
};

const menuTemplate = [
  {
    label: "Items",
    submenu: [
      {
        label: "Add Item",
        click: addItemModel,
        accelerator: "CmdOrCtrl+O",
      },
      {
        label: "Read Item",
        click: openItemInAPP,
        accelerator: "CmdOrCtrl+Enter",
      },
      {
        label: "Delete Item",
        click: deleteItemFromApp,
        accelerator: "CmdOrCtrl+Backspace",
      },
      {
        label: "Open In Browser",
        click: openItemInShell,
        accelerator: "CmdOrCtrl+Shift+Enter",
      },
      {
        label: "Search Item",
        click: searchItem,
        accelerator: "CmdOrCtrl+S",
      },
    ],
  },
  {
    role: "editMenu",
  },
  {
    role: "windowMenu",
  },
  {
    role: "help",
    submenu: [
      {
        label: "Learn More",
        click: () => shell.openExternal("http://zaions.com"),
      },
    ],
  },
];

// Adding first menu item with label of app name (only for mac it is required in mac)
if (process.platform === "darwin") {
  menuTemplate.unshift({
    label: remote.app.getName(),
    submenu: [
      { role: "about" },
      { type: "separator" },
      { role: "services" },
      { type: "separator" },
      { role: "hide" },
      { role: "hideothers" },
      { role: "unhide" },
      { type: "separator" },
      { role: "quit" },
    ],
  });
}

const appMenu = Menu.buildFromTemplate(menuTemplate);

Menu.setApplicationMenu(appMenu);
