const signUp = async (username, email, phone, password, confirmPassword) => {
  // Make Http requests
  try {
    const result = await axios({
      method: "POST",
      url: `/api/v1/ExploreDreamDiscover/user/signUp`,
      data: {
        username,
        email,
        phone,
        password,
        confirmPassword,
      },
    });

    if (result.data) {
      document.getElementById("loggedStatus").innerText =
        "Thank You For Joining Us please Check Your Mail And Activate";
      window.setTimeout(() => {
        location.assign("/v1/ExploreDreamDiscover");
      }, 3000);
    }
  } catch (err) {
    document.getElementById(
      "errlog"
    ).innerText = `${err.response.data.message}`;
    setTimeout(() => {
      document.getElementById("errlog").innerText = ``;
    }, 10000);
  }
};

document.querySelector("form").addEventListener("submit", (ev) => {
  ev.preventDefault();
  const username = document.getElementById("name").value;
  const email = document.getElementById("mail").value;
  const phone = document.getElementById("phone").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmpassword").value;

  signUp(username, email, phone, password, confirmPassword);
});
