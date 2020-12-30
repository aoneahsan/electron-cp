const {BrowserWindow} = require("electron");

let websiteWindow;

const createWindow = (url, callbacks) => {
    console.log("renderItem.js == working...");
    websiteWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        show: false,
        webPreferences: {
            offscreen: true,
            nodeIntegration: false
        }
    });

    websiteWindow.loadURL(url);

    websiteWindow.webContents.on("did-finish-load", (e) => {
        let title = websiteWindow.getTitle();
        console.log("renderItem.js == title = ", title);

        websiteWindow.webContents.capturePage(image => {
            let screenshort = image.toDataURL();
            console.log("renderItem.js == screenshort = ", screenshort);

            callbacks({title, screenshort, url});

            websiteWindow.close();
            websiteWindow = null;
        })
    })
}

module.exports = createWindow;