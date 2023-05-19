const text = document.querySelector("#text");
import { secretSwal } from "../js/secretswal.js";
export function sendtodbtext() {
  let sCode = localStorage.getItem("secret");
  if (!sCode) {
    secretSwal();
  } else if (text.value.trim() == "") {
    swal({
      title: "Text Field Is Empty!",
      icon: "error",
    });
  } else {
    socket.emit(
      "text",
      JSON.stringify({
        secret: localStorage.getItem("secret"),
        data: he.encode(text.value),
        time: new Date().toLocaleString(),
        type: "text",
        filename: "",
      })
    );
    $.notify("Text Sent succesfully!", "success");
  }
}
