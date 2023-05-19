import { secretSwal } from "../js/secretswal.js";
export function sendtodbcode() {
  function filename() {
    let x;
    let path = document.querySelector("#filepath");
    if (path.value.trim() == "") {
      return "file.html";
    } else {
      return path.value;
    }
  }
  let sCode = localStorage.getItem("secret");
  if (!sCode) {
    secretSwal();
  } else if (editor.getSession().getValue().trim() == "") {
    swal({
      title: "Text Field Is Empty!",
      icon: "error",
    });
  } else {
    socket.emit(
      "text",
      JSON.stringify({
        secret: localStorage.getItem("secret"),
        data: he.encode(editor.getSession().getValue()),
        time: new Date().toLocaleString(),
        type: "code",
        filename: filename(),
      })
    );
    $.notify("Code Sent succesfully!", "success");
  }
}
