ace.require("ace/ext/emmet");
ace.require("ace/ext/language_tools");
var beautify = ace.require("ace/ext/beautify");
var editor;
editor = ace.edit("editor");
editor.setKeyboardHandler("ace/keyboard/sublime");
editor.setTheme("ace/theme/monokai");
editor.setOption("enableEmmet", true);
editor.getSession().setMode("ace/mode/html");
editor.setBehavioursEnabled(true);
editor.getSession().setTabSize(4);
editor.setOptions({
  enableBasicAutocompletion: true,
  enableSnippets: true,
  enableLiveAutocompletion: true,
});
beautify.beautify(editor.session);
// function to change mode
let pathbtn = document.querySelector("#filepathbtn");
function changemode() {
  let pathname = document.querySelector("#filepath");
  var modelist = ace.require("ace/ext/modelist");
  var filePath = pathname.value;
  var mode = modelist.getModeForPath(filePath).mode;
  editor.session.setMode(mode);
  Toastify({
    text: "File name set succesfully!",
    duration: 3000,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "left", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
    onClick: function () {}, // Callback after click
  }).showToast();
}
pathbtn.addEventListener("click", changemode);
