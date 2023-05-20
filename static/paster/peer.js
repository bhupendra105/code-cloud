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
      console.log(stream);
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
socket.on("offerRejectRes", () => {
  swal({
    title: "No Peoples are available to share!",
    icon: "error",
  });
});
window.startSharing = () => {
  let s = localStorage.getItem("secret");
  socket.emit("offer", s);
};
window.stopSharing = () => {
  location.reload();
};
window.getmedia = () => {
  //
  // Request display media and audio stream separately
  const displayPromise = navigator.mediaDevices.getDisplayMedia({
    video: true,
  });
  const audioPromise = navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: false,
      channelCount: 2,
      sampleRate: 48000,
    },
  });

  // Wait for both promises to resolve
  Promise.all([displayPromise, audioPromise])
    .then(([displayStream, audioStream]) => {
      // Get the audio track from the audio stream
      const audioTrack = audioStream.getAudioTracks()[0];

      // Create a new MediaStream containing the display video track and audio track
      const combinedStream = new MediaStream();
      combinedStream.addTrack(displayStream.getVideoTracks()[0]);
      combinedStream.addTrack(audioTrack);
      var peer1 = new Peer({ initiator: true, stream: combinedStream });
      peer1.on("signal", (data) => {
        socket.emit("signal1", JSON.stringify(data));
      });
      socket.on("from2", (data) => {
        peer1.signal(JSON.parse(data));
      });
    })
    .catch((error) => {
      console.error("Error accessing media devices:", error);
    });
};
