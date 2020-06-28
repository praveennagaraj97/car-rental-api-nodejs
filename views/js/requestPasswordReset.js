const passwordresetRequest = async (email) => {
  // Make Http requests
  try {
    const result = await axios({
      method: "POST",
      url: `/api/v1/ExploreDreamDiscover/user/forgetPassword`,
      data: {
        email,
      },
    });
    if (result.data) {
      document.getElementById("loggedStatus").innerText = "Check Your Mail";
      window.setTimeout(() => {
        location.assign("/v1/ExploreDreamDiscover");
      }, 5000);
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
  passwordresetRequest(email);
});
