// alert("ok");
const $ = require("jquery");
const { remote, ipcRenderer, TouchBarOtherItemsProxy } = require("electron");
// const {  } = remote;
// const icon = require("boxicons");
const items = require("./items");

const modal_con = $("#modal-con");
const close_modal = $(".close-modal");
const showModal = $("#showModal");
const item_title = $("#title");
const add_item = $(".add-item");
let processingNewItemRequest = false;
// const close_modal = $(".close-modal");

const disableAddBtn = () => {
  add_item.addClass("disable");
  add_item.attr("disabled", true);
  add_item.text("Adding...");
  close_modal.addClass("hidden");
  processingNewItemRequest = true;
};

const enableAddBtn = () => {
  add_item.removeClass("disable");
  add_item.attr("disabled", false);
  add_item.text("Add Item");
  close_modal.removeClass("hidden");
  processingNewItemRequest = false;
};

add_item.on("click", function () {
  if (item_title.val() && !processingNewItemRequest) {
    // console.log("item_title = ", item_title.val());
    ipcRenderer.send("new-item", item_title.val());

    disableAddBtn();
  }
});

showModal.on("click", function () {
  modal_con.removeClass("hidden");
  item_title.focus();
});

close_modal.on("click", function () {
  modal_con.addClass("hidden");
});

item_title.on("keyup", function (e) {
  if (e.key === "Enter" && !processingNewItemRequest) {
    add_item.click();
  }
});

// Event - new item success event
ipcRenderer.on("new-item-success", (e, data) => {
  items.addItem(data, true);
  enableAddBtn();
  close_modal.click();
  item_title.val("");
});
