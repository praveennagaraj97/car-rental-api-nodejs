// Avoid Empty Inputs
function success() {
  if (document.getElementById("message").value === "") {
    document.getElementById("send").disabled = true;
  } else {
    document.getElementById("send").disabled = false;
  }
}

// Connection SetUp
const socket = io.connect("http://localhost:3000/");

// Query DOM
let message, handle, btn, output, feedback;

message = document.getElementById("message");
handle = document.getElementById("handle");
btn = document.getElementById("send");

// Btn Disable if empty

message.addEventListener("change", () => {
  success();
});

//Events Emit

btn.addEventListener("click", () => {
  socket.emit("chat", {
    message: message.value,
  });
  document.querySelector("#message").value = "";
});

//Listen For Events
socket.on("chat", (data) => {
  let currentmsgCount = data[0].message.length;
  const lastmsg = document.getElementById(currentmsgCount - 2);

  const newMsg = `<div id="outgoing">
                      <li class="sent" id=${currentmsgCount - 1}>
                      <img src="http://emilcarlsson.se/assets/mikeross.png" alt="">
                      <p id="last-sent">${
                        data[0].message[currentmsgCount - 1]
                      }</p>
                    </li></div>`;

  const m = `<li id=${currentmsgCount - 1}>${
    data[0].message[currentmsgCount - 1]
  }</li>`;
  document.querySelector("#incoming-msg").innerHTML += newMsg;
});
