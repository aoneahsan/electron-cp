// const { remote, ipcMain } = require("electron");

// const addItemModel = () => {
//   ipcMain.send("test", "ok");
// }

// const menuTemplate = [
//   {
//     label: "Items",
//     submenu: [
//       {
//         label: "Add Item",
//         click: addItemModel,
//         accelerator: "CmdOrCtrl+O",
//       },
//       {
//         label: "Read Item",
//         // click: openItemInAPP,
//         accelerator: "CmdOrCtrl+Enter",
//       },
//       {
//         label: "Delete Item",
//         // click: deleteItemFromApp,
//         accelerator: "CmdOrCtrl+Backspace",
//       },
//       {
//         label: "Open In Browser",
//         // click: openItemInShell,
//         accelerator: "CmdOrCtrl+Shift+Enter",
//       },
//       {
//         label: "Search Item",
//         // click: searchItem,
//         accelerator: "CmdOrCtrl+S",
//       },
//     ],
//   },
//   {
//     role: "editMenu",
//   },
//   {
//     role: "windowMenu",
//   },
//   {
//     role: "help",
//     submenu: [
//       {
//         label: "Learn More",
//         click: () => shell.openExternal("http://zaions.com"),
//       },
//     ],
//   },
// ];

// // Adding first menu item with label of app name (only for mac it is required in mac)
// if (process.platform === "darwin") {
//   menuTemplate.unshift({
//     label: remote.app.getName(),
//     submenu: [
//       { role: "about" },
//       { type: "separator" },
//       { role: "services" },
//       { type: "separator" },
//       { role: "hide" },
//       { role: "hideothers" },
//       { role: "unhide" },
//       { type: "separator" },
//       { role: "quit" },
//     ],
//   });
// }

// module.exports = menuTemplate;
