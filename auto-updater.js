const { autoUpdater } = require("electron-updater");
const log = require("electron-log");
const { dialog } = require("electron");

// Log errors in default log file in system (see electron log git repo for location of log file)
log.transports.file.level = "debug"; // define level of log "info" | "debug" | "silly" (and check above repo for details)

// turn off auto updates
autoUpdater.autoDownload = false;

module.exports = () => {
  autoUpdater.logger = log;
  autoUpdater.checkForUpdates();

  autoUpdater.on("update-available", () => {
    dialog.showMessageBox(
      {
        type: "info",
        title: "Update Available",
        message:
          "a new version of readit is available, do you want to download now?",
        buttons: ["Update", "No"],
      },
      (btnIndex) => {
        if (btnIndex === 0) {
          autoUpdater.downloadUpdate();
        }
      }
    );
  });

  autoUpdater.on("update-downloaded", () => {
    dialog.showMessageBox(
      {
        type: "info",
        title: "Update Ready",
        message: "close app and install update now?",
        buttons: ["Yes", "Later"],
      },
      (btnIndex) => {
        if (btnIndex === 0) {
          autoUpdater.quitAndInstall(false, true);
        }
      }
    );
  });
};
