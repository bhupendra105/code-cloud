window.Peer = SimplePeer;
const start = document.querySelector("#startSharing");
const video = document.querySelector("#stream");
const stop = document.querySelector("#stopSharing");
import { secretSwal } from "./js/secretswal.js";
socket.on("accept", (s) => {
  let s1 = localStorage.getItem("secret");
  if (s1 == s) {
    var peer2 = new Peer();
    socket.emit("createPeer");
    $.notify("Someone will show you screen!", "info");
    socket.on("from1", (data) => {
      peer2.signal(JSON.parse(data));
    });
    peer2.on("signal", (data) => {
      socket.emit("signal2", JSON.stringify(data));
    });
    peer2.on("stream", (stream) => {
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        video.play();
      };
    });
  } else {
    socket.emit("offerReject");
  }
});
socket.on("peerAccept", () => {
  getmedia();
});
socket.on("offerReject", () => {
  swal({
    title: "No Peoples are available to share!",
    icon: "error",
  });
});
window.startSharing = () => {
  let s = localStorage.getItem("secret");
  socket.emit("offer", s);
};

window.getmedia = () => {
  navigator.mediaDevices
    .getDisplayMedia({
      video: true,
      audio: true,
    })
    .then((stream) => {
      var peer1 = new Peer({ initiator: true, stream });
      peer1.on("signal", (data) => {
        socket.emit("signal1", JSON.stringify(data));
      });
      socket.on("from2", (data) => {
        peer1.signal(JSON.parse(data));
      });
    });
};
