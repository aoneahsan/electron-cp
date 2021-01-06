const fs = require("fs");
const path = require("path");
const $ = require("jquery");
const { shell, ipcRenderer } = require("electron");

let readerJSFileContent, readerWindow;
fs.readFile(path.resolve(__dirname, "reader.js"), (err, data) => {
  if (err) {
    console.log("Error while reading reader.js content == err = ", err);
  }
  readerJSFileContent = data.toString();
});

const ITEMS_KEY = "app-items";

const itemsCon = $("#items_con");
const noItemsCon = $("#no_items_con");
const search = $("#search");
const testBtn = $("#test");

let storage = JSON.parse(localStorage.getItem(ITEMS_KEY)) || [];

let noItemFoundInStorage = true;

const makeItemTemplate = (data, isFirst = false) => {
  let newNode = $(`<div
    data-url="${data.url}"
    data-id="${data.id}"
    class="flex shadow-lg mx-auto mt-5 max-w-2xl h-44 border-l-8 item-con group ${
      isFirst ? "border-indigo-700" : ""
    }"
  >`);
  newNode.append(`<img
    class="h-full w-1/3 object-cover rounded-lg group-hover:bg-gray-300 rounded-r-none pb-5/6"
    src="${data.screenshort}"
    alt="bag"
    />
    <div class="w-2/3 px-4 py-4 bg-white rounded-lg group-hover:bg-gray-300">
    <div class="flex items-center">
      <h2 class="text-xl text-gray-800 font-medium group-hover:bg-gray-300 mr-auto item-con__title">
        ${data.title}
      </h2>
    </div>
    <p class="text-sm text-gray-700 mt-4">
      URL: ${data.url}
    </p>
  </div>`);
  return newNode;
};

const save = () => {
  localStorage.setItem(ITEMS_KEY, JSON.stringify(storage));
};

const selectItem = (e) => {
  $(".item-con.border-indigo-700").removeClass("border-indigo-700");
  e.currentTarget.classList.add("border-indigo-700");
};

const openItemURL = (itemID, itemURL) => {
  // open url in a new win
  readerWindow = window.open(
    itemURL,
    "",
    `
    maxWidth=2000,
    maxHeight=2000,
    width=200,
    height=200,
    backgroundColor=#ded,
    nodeIntegration=0,
    contentIsolation=1,
  `
  );

  readerWindow.eval(readerJSFileContent.replace("{{index}}", itemID));
};

const addItem = (item, isNew = false, isFirst = false) => {
  const itemT = makeItemTemplate(item, isFirst);
  itemsCon.append(itemT);
  itemT.on("click", selectItem);
  itemT.on("dblclick", (e) =>
    openItemURL(e.currentTarget.dataset.id, e.currentTarget.dataset.url)
  );
  if (isNew) {
    storage.push(item);
    save();
  }
  if (noItemFoundInStorage) {
    itemsCon.removeClass("hidden");
    noItemsCon.addClass("hidden");
    noItemFoundInStorage = false;
  }
};

const renderItems = () => {
  if (storage.length > 0) {
    storage.forEach((item, index) => {
      addItem(item, false, index == 0);
    });
    itemsCon.removeClass("hidden");
    // debugger;
    noItemsCon.addClass("hidden");
    noItemFoundInStorage = false;
  } else {
    noItemsCon.removeClass("hidden");
    itemsCon.addClass("hidden");
    noItemFoundInStorage = true;
  }
};

renderItems();

let hasMatch;
search.on("keyup", (e) => {
  const titles = Array.from($(".item-con__title")).forEach((el) => {
    hasMatch = $(el).text().trim().toLocaleLowerCase().includes(search.val());
    if (!hasMatch) {
      $(el).parentsUntil(".item-con").parent().addClass("hidden");
    } else {
      $(el).parentsUntil(".item-con").parent().removeClass("hidden");
    }
  });
});

// selecting item with keyboard keys
$(document).on("keyup", (e) => {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    const currentItem = $(".item-con.border-indigo-700");
    if (e.key === "ArrowUp" && currentItem.prev().length > 0) {
      currentItem.removeClass("border-indigo-700");
      currentItem.prev().addClass("border-indigo-700");
    } else if (e.key === "ArrowDown" && currentItem.next().length > 0) {
      currentItem.removeClass("border-indigo-700");
      currentItem.next().addClass("border-indigo-700");
    }
  }
});

const deleteItem = (index, itemID) => {
  // selecting another item
  if (storage.length > 0) {
    const item = $(".item-con.border-indigo-700");
    item.removeClass("border-indigo-700");
    item.prev().length > 0
      ? item.prev().addClass("border-indigo-700")
      : item.next().addClass("border-indigo-700");
  }
  // deleting item from storage
  storage.splice(index, 1);
  // saving storage
  save();
  // removing item from DOM
  $(`[data-id="${itemID}"]`).remove();
};

// Listen for Window Message Event from proxy brower
window.addEventListener("message", (e) => {
  const index = storage.findIndex((el) => el.id == e.data.itemIndex);

  deleteItem(index, e.data.itemIndex);

  e.source.close();
});

testBtn.on("click", () => {
  alert("Test any code using this");
});

const openItem = () => {
  const currentItemData = $(".item-con.border-indigo-700").data();
  openItemURL(currentItemData.id, currentItemData.url);
};

const deleteItemFromApp = () => {
  const currentItemData = $(".item-con.border-indigo-700").data();
  const index = storage.findIndex((el) => el.id == currentItemData.id);
  deleteItem(index, currentItemData.id);
};

const openItemInShell = () => {
  const currentItemData = $(".item-con.border-indigo-700").data();
  shell.openExternal(currentItemData.url);
};

// #################################################################
// ########      Listining for events from main window      ########
// #################################################################

ipcRenderer.on("openItemInAPP", (data) => {
  openItem();
});

ipcRenderer.on("deleteItemFromApp", (data) => {
  deleteItemFromApp();
});

ipcRenderer.on("openItemInShell", (data) => {
  openItemInShell();
});

ipcRenderer.on("searchItem", (data) => {
  search.focus();
});

// #################################################################
// #####################      Exports      #########################
// #################################################################

exports.addItem = addItem;
