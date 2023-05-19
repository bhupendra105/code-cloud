export function DomParser(str) {
  let dv = document.createElement("div");
  dv.innerHTML = str;
  return dv.firstElementChild;
}
