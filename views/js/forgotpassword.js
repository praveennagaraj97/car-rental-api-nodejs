// Take Data From Login Form

const resetPassword = async (password, confirmPassword, token) => {
  // Make Http requests
  try {
    const result = await axios({
      method: "PATCH",
      url: `/api/v1/ExploreDreamDiscover/user/resetPassword/${token}`,
      data: {
        password,
        confirmPassword,
      },
    });
    if (result.data) {
      document.getElementById("loggedStatus").innerText =
        "Password Changed SuccessFully";
      window.setTimeout(() => {
        location.assign("/v1/ExploreDreamDiscover");
      }, 2000);
    }
  } catch (err) {
    if (err.response.data.message === "jwt malformed") {
      document.getElementById("errlog").innerText = `Reset Token Expired`;
    } else {
      document.getElementById(
        "errlog"
      ).innerText = `${err.response.data.message}`;
    }
    setTimeout(() => {
      document.getElementById("errlog").innerText = ``;
    }, 2000);
  }
};

// Prevent Page Going To Our API's Route
document.querySelector("form").addEventListener("submit", (ev) => {
  ev.preventDefault();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmpassword").value;
  const token = window.location.href.split("resetPassword/")[1];
  resetPassword(password, confirmPassword, token);
});
