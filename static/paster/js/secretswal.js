export function secretSwal() {
  swal("Set Your Secret Key", {
    content: "input",
  }).then((secret) => {
    if (secret.length < 1) {
      swal({
        title: "Secret Must not Be Blank.",
        icon: "error",
      }).then(() => {
        secretSwal();
      });
    } else if (secret.length > 50) {
      swal({
        title: "Secret Must Be less than 50 characters",
        icon: "error",
      }).then(() => {
        secretSwal();
      });
    } else {
      localStorage.setItem("secret", secret);
    }
  });
}
