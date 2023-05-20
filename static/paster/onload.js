let api =
  "https://script.google.com/macros/s/AKfycbweN5vvRJJfIjDy_5czNK7JVKNmQ07AuLbieH2p0ysg861QR_KQeNrJQMV3x3LXqJMm/exec";
let txtarea = document.querySelector("#text");

function cleartext() {
  txtarea.value = "";
  $.notify("Text Box Cleared!", "info");
}
function clearcode() {
  editor.setValue("");
  $.notify("Code editor Cleared!", "info");
}
function copy(id, elm) {
  let tocopy = document.querySelector(id);
  console.log(tocopy.value);
  tocopy.select();
  navigator.clipboard.writeText(tocopy.value);
  elm.textContent = "Copied!";
  let tm = setTimeout(() => {
    elm.textContent = "Copy";
    clearTimeout(tm);
  }, 3000);
}

function del(id, rem, elm) {
  let rm = document.querySelector(rem);
  elm.textContent = "Deleting..";
  fetch(api + "?del=true&id=" + id)
    .then((res) => res.text())
    .then((task) => {
      rm.remove();
      $.notify("A message has been deleted!", "danger");
    })
    .catch((err) => {
      elm.textContent = "Delete";
      $.notify("something went wrong try again", "danger");
    });
}

function sendUi(id, type, fn, elm) {
  let path = document.querySelector("#filepath");
  let pathbtn = document.querySelector("#filepathbtn");
  let val = document.querySelector(id).value;
  if (type == "text") {
    txtarea.value = val;
    $.notify("Sent to edit!", "success");
    elm.textContent = "Sent!";
    document.querySelector("#ex2-tab-1").click();
    let tm = setTimeout(() => {
      elm.textContent = "Send To Editor";
    }, 3000);
  } else if (type == "code") {
    editor.setValue(val);
    path.value = fn;
    pathbtn.click();
    document.querySelector("#ex2-tab-2").click();
    $.notify("Sent Code to edit!", "success");
    elm.textContent = "Sent!";
    let tm = setTimeout(() => {
      elm.textContent = "Send To Editor";
    }, 3000);
  }
}
let beforeload = `
  <div class="spinner-grow text-primary" role="status">
  <span class="sr-only">Loading...</span>
</div>
<div class="spinner-grow text-secondary" role="status">
  <span class="sr-only">Loading...</span>
</div>
<div class="spinner-grow text-success" role="status">
  <span class="sr-only">Loading...</span>
</div>
<div class="spinner-grow text-danger" role="status">
  <span class="sr-only">Loading...</span>
</div>
<div class="spinner-grow text-warning" role="status">
  <span class="sr-only">Loading...</span>
</div>
<div class="spinner-grow text-info" role="status">
  <span class="sr-only">Loading...</span>
</div>
<div class="spinner-grow text-light" role="status">
  <span class="sr-only">Loading...</span>
</div>
<div class="spinner-grow text-dark" role="status">
  <span class="sr-only">Loading...</span>
</div>
  `;
function bl() {
  let acd1 = document.querySelector(".acd");
  let ls = localStorage.getItem("secret");
  if (ls != null) {
    acd1.innerHTML = beforeload;
    fetch(api + "?secret=" + ls)
      .then((res) => res.json())
      .then((data1) => {
        let data = data1.data;
        let rdc = data.reduce((pre, cur, i) => {
          return (
            pre +
            `
    <div class="accordion-item rem_${cur.id}">
          <h2 class="accordion-header" id="heading${i}">
            <button
              class="accordion-button collapsed"
              type="button"
              data-mdb-toggle="collapse"
              data-mdb-target="#basicAccordionCollapse${i}"
              aria-expanded="false"
              aria-controls="collapse${i}"
            >
            ${new Date(cur.time).toLocaleString()}
            </button>
          </h2>
          <div
            id="basicAccordionCollapse${i}"
            class="accordion-collapse collapse"
            aria-labelledby="heading${i}"
            data-mdb-parent="#basicAccordion"
            style=""
          >
            <div class="accordion-body">
            <div class="d-flex justify-content-around">
            <textarea id="id_${cur.id}" style="display:none;">${
              cur.data
            }</textarea>
            <button class="btn btn-info" onclick="copy('#id_${
              cur.id
            }',this)">Copy</button>
            <button class="btn btn-info" onclick="sendUi('#id_${cur.id}','${
              cur.type
            }','${cur.filename}',this)">Send To Editor</button>
              <button class="btn btn-danger" onclick="del(${cur.id},'.rem_${
              cur.id
            }',this)">Delete</button>
            </div><hr>
             ${(() => {
               if (cur.type == "text") {
                 return cur.data;
               } else if (cur.type == "code") {
                 return `
                    <pre>
                    <code>
                    ${cur.data}
                    </code>
                    </pre>
                    `;
               }
             })()}
            </div>
          </div>
        </div>
    `
          );
        }, "");
        acd1.innerHTML = rdc;
        hljs.highlightAll();
      });
  }
}
bl();
