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
user = document.getElementById("user").href.split("Discover/")[1];
friend = document.getElementById("friend").value;
// Btn Disable if empty

message.addEventListener("change", () => {
  success();
});

const friendstatus = async (userId, friendId) => {
  // Make Http requests
  try {
    const result = await axios({
      method: "POST",
      url: `/api/v1/ExploreDreamDiscover/socialmedia/getfriendStatus`,
      data: {
        profileId: userId,
        friend: friendId,
      },
    });
    if (result) {
      if (result.data.status == "Friends") {
        socket.emit("chat", {
          message: message.value,
          profileId: result.data.data.friends[0],
          friendId: result.data.data.friends[1],
        });
        document.querySelector("#message").value = "";
      } else {
        document.getElementById("handle").innerHTML =
          "Message Will Not be sent to Non Friends";
      }
    }
  } catch (err) {
    document.getElementById("err").innerHTML =
      "Message Will Not be sent to Non Friends";
    setTimeout(() => {
      document.getElementById("err").innerHTML = "";
    }, 5000);
  }
};

//Events Emit

btn.addEventListener("click", () => {
  const userId = user;
  const friendId = friend;
  friendstatus(userId, friendId);
});

//Listen For Events
socket.on("chat", function (data) {
  document.getElementById(
    "output"
  ).innerHTML += `<p><strong> ${data.profileId}</strong> : ${data.message} </p>`;
});
