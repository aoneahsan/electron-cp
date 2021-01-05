const doneBtn = document.createElement("button");
doneBtn.style.position = "fixed";
doneBtn.style.bottom = "15px";
doneBtn.style.right = "15px";
doneBtn.style.padding = "10px 16px";
doneBtn.style.background = "rgba(10,100,150,.84)";
doneBtn.style.color = "white";
doneBtn.style.border = "none";
doneBtn.style.borderRadius = "4px";
doneBtn.style.fontSize = "20px";
doneBtn.style.fontWeight = "bold";
doneBtn.style.cursor = "pointer";
doneBtn.style.boxShadow = "2px 2px 2px rgba(0, 0, 0, .3)";

doneBtn.innerText = "DONE";

doneBtn.addEventListener("click", () => {
  window.opener.postMessage(
    {
      action: "delete-item",
      itemIndex: "{{index}}",
    },
    "*"
  );
});

document.querySelector("body").appendChild(doneBtn);
