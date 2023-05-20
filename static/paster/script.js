import { secretSwal } from "./js/secretswal.js";
const dropArea = document.querySelector(".drag-area"),
  dragText = dropArea.querySelector("header"),
  button = dropArea.querySelector("button"),
  input = dropArea.querySelector("input");
let file = false;
button.onclick = () => {
  input.click();
};

input.addEventListener("change", function () {
  file = this.files[0];
  dropArea.classList.add("active");
});

//If user Drag File Over DropArea
dropArea.addEventListener("dragover", (event) => {
  event.preventDefault(); //preventing from default behaviour
  dropArea.classList.add("active");
  dragText.textContent = "Release to Upload File";
});

//If user leave dragged File from DropArea
dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("active");
  dragText.textContent = "Drag & Drop to Upload File";
});
dropArea.addEventListener("drop", (event) => {
  event.preventDefault();
  file = event.dataTransfer.files[0];
});
const showFile = () => {
  if (file) {
    let fileReader = new FileReader(); //
    fileReader.onload = () => {
      let fileURL = fileReader.result;
      console.log(fileURL);
      let sCode = localStorage.getItem("secret");
      if (!sCode) {
        secretSwal();
      } else {
        socket.emit(
          "text",
          JSON.stringify({
            secret: localStorage.getItem("secret"),
            data: fileURL,
            time: new Date().toLocaleString(),
            type: "file",
            filename: file.name,
          })
        );
        $.notify("File Sent succesfully!", "success");
      }
    };
    fileReader.readAsDataURL(file);
  } else {
    swal({
      title: "Select a File First!",
      icon: "error",
    });
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload File";
  }
};
window.showFile = showFile;
