let tone = document.querySelector("#tone");
let title = document.querySelector("title");
let count = 1;
socket.on("new text", (text) => {
  console.log(text);
  let acd = document.querySelector(".acd");
  let prev = acd.innerHTML;
  acd.innerHTML = ``;
  let txt = JSON.parse(text);
  let sec = localStorage.getItem("secret");
  if (txt.secret == sec) {
    title.innerHTML = `(${count}) message received!`;
    count++;
    acd.innerHTML =
      `
    <div class="accordion-item rem_${txt.id}">
          <h2 class="accordion-header" id="heading${txt.id}">
            <button
              class="accordion-button collapsed"
              type="button"
              data-mdb-toggle="collapse"
              data-mdb-target="#basicAccordionCollapse${txt.id}"
              aria-expanded="false"
              aria-controls="collapse${txt.id}"
            >
            ${new Date(txt.time).toLocaleString()}
            </button>
          </h2>
          <div
            id="basicAccordionCollapse${txt.id}"
            class="accordion-collapse collapse"
            aria-labelledby="heading${txt.id}"
            data-mdb-parent="#basicAccordion"
            style=""
          >
            <div class="accordion-body">
            <div class="d-flex justify-content-around">
            <textarea id="id_${txt.id}" style="display:none;">${(() => {
        if (txt.type == "file") {
          return "";
        } else {
          txt.data;
        }
      })()}</textarea>
           ${(() => {
             if (txt.type == "file") {
               return "";
             } else {
               return `
                 <button class="btn btn-info" onclick="copy('#id_${txt.id}',this)">Copy</button>
            <button class="btn btn-info" onclick="sendUi('#id_${txt.id}','${txt.type}','${txt.filename}',this)">Send To Editor</button>
                `;
             }
           })()}
              <button class="btn btn-danger" onclick="del(${txt.id},'.rem_${
        txt.id
      }',this)">Delete</button>
            </div><hr>
             ${(() => {
               if (txt.type == "text") {
                 return txt.data;
               } else if (txt.type == "code") {
                 return `
                    <pre>
                    <code>
                    ${txt.data}
                    </code>
                    </pre>
                    `;
               } else if (txt.type == "file") {
                 return `<a href='${txt.data}' class='btn btn-success' download='${txt.filename}'>Download</a>`;
               }
             })()}
            </div>
          </div>
        </div>
    ` + prev;
    if (txt.type == "code") {
      hljs.highlightAll();
    }
    tone.play();
    $.notify(`New ${txt.type} Received!`, "info");
  }
});
