export function removeSecret() {
  let sCode = localStorage.getItem("secret");
  if (!sCode) {
    secretSwal();
  } else {
    localStorage.removeItem("secret");
    swal({
      title: "Secret Deleted Succesfully",
      icon: "success",
    });
  }
}
