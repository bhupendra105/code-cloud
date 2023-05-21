let api =
  "https://script.google.com/macros/s/AKfycbweN5vvRJJfIjDy_5czNK7JVKNmQ07AuLbieH2p0ysg861QR_KQeNrJQMV3x3LXqJMm/exec";
let txtarea = document.querySelector("#text");
function chmode(elm) {
  let atr = elm.getAttribute("data-theme");
  let dark = "./mdb.dark.min.css";
  let light =
    "https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/6.3.0/mdb.min.css";
  let theme = document.querySelector("#theme");
  if (atr == "light") {
    theme.href = dark;
    elm.setAttribute("data-theme", "dark");
    elm.textContent = "Light Mode";
  } else if (atr == "dark") {
    theme.href = light;
    elm.setAttribute("data-theme", "light");
    elm.textContent = "Dark Mode";
  }
}
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
let dlink = document.querySelector("#download_link");
function download(type) {
  if (type == "text") {
    dlink.href =
      "data:text/plain;charset=utf-8," + encodeURIComponent(txtarea.value);
    dlink.download = new Date().toLocaleString() + ".txt";
    dlink.click();
  } else if (type == "code") {
    let pth = document.querySelector("#filepath");
    dlink.href =
      "data:text/plain;charset=utf-8," +
      encodeURIComponent(editor.session.getValue());
    dlink.download =
      pth.value.trim() != ""
        ? pth.value
        : new Date().toLocaleString() + ".html";
    dlink.click();
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
          let ddt = cur.data;
          if (cur.type == "file") {
            fetch(ddt)
              .then((rs) => rs.blob())
              .then((b) => {
                let ul = URL.createObjectURL(b);
                ddt = ul;
              });
          }
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
            <textarea id="id_${cur.id}" style="display:none;">${(() => {
              if (cur.type == "file") {
                return "";
              } else {
                return ddt;
              }
            })()}</textarea>
            ${(() => {
              if (cur.type == "file") {
                return "";
              } else {
                return `<button class="btn btn-info rounded-pill" onclick="copy('#id_${cur.id}',this)">Copy</button>
            <button class="btn btn-info rounded-pill" onclick="sendUi('#id_${cur.id}','${cur.type}','${cur.filename}',this)">Send To Editor</button>`;
              }
            })()}
              <button class="btn btn-danger rounded-pill" onclick="del(${
                cur.id
              },'.rem_${cur.id}',this)">Delete</button>
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
               } else if (cur.type == "file") {
                 return `<a href='${ddt}' class='btn btn-success rounded-pill' download='${cur.filename}'>Download</a>`;
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
