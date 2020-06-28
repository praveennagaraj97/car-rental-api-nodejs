// Take Data From Login Form

const login = async (email, password) => {
  // Make Http requests
  try {
    const result = await axios({
      method: "POST",
      url: `/api/v1/ExploreDreamDiscover/user/login`,
      data: {
        email,
        password,
      },
    });
    if (result.data) {
      document.getElementById("loggedStatus").innerText =
        "Successfully Logged In ,Don't Refresh";
      window.setTimeout(() => {
        location.assign("/v1/ExploreDreamDiscover");
      }, 1000);
    }
  } catch (err) {
    document.getElementById(
      "errlog"
    ).innerText = `${err.response.data.message}`;
    setTimeout(() => {
      document.getElementById("errlog").innerText = ``;
    }, 2000);
  }
};

// Prevent Page Going To Our API's Route
document.querySelector("form").addEventListener("submit", (ev) => {
  ev.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  login(email, password);
});
