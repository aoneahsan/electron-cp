const $ = require("jquery");

const ITEMS_KEY = "app-items";

const itemsCon = $("#items_con");
const noItemsCon = $("#no_items_con");

const storage = JSON.parse(localStorage.getItem(ITEMS_KEY)) || [];

let noItemFoundInStorage = true;

const makeItemTemplate = (data, isFirst = false) => {
  return `<div
  class="sm:flex shadow-lg mx-6 sm:mx-auto mt-5 max-w-lg sm:max-w-2xl sm:h-44 border-l-8 ${
    isFirst ? "border-indigo-700" : ""
  }"
>
  <img
    class="h-full w-full sm:w-1/3 object-cover rounded-lg rounded-r-none pb-5/6"
    src="${data.screenshort}"
    alt="bag"
  />
  <div class="w-full sm:w-2/3 px-4 py-4 bg-white rounded-lg">
    <div class="flex items-center">
      <h2 class="text-xl text-gray-800 font-medium mr-auto">
        ${data.title}
      </h2>
    </div>
    <p class="text-sm text-gray-700 mt-4">
      URL: ${data.url}
    </p>
    <!-- <div class="flex items-center justify-end mt-4 top-auto">
      <button
        class="bg-white text-red-500 px-4 py-2 rounded ml-auto hover:underline"
        data-id="${data.id}"
      >
        Delete
      </button>
    </div> -->
  </div>
</div>`;
};

const save = () => {
  localStorage.setItem(ITEMS_KEY, JSON.stringify(storage));
};

const addItem = (item, isNew = false, isFirst = false) => {
  const itemT = makeItemTemplate(item, isFirst);
  itemsCon.append(itemT);
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

exports.addItem = addItem;
