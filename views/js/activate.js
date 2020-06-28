const activate = async (id) => {
  // Make Http requests
  try {
    const result = await axios({
      method: "POST",
      url: `/api/v1/ExploreDreamDiscover/user/activate/${id}`,
    });

    if (result.data) {
      window.setTimeout(() => {
        location.assign("/v1/ExploreDreamDiscover");
      }, 2000);
    }
  } catch (err) {
    document.getElementById("err").innerText = "😒";
    alert("Account is Already Verified");
    window.setTimeout(() => {
      location.assign("/v1/ExploreDreamDiscover");
    }, 2000);
  }
};

//Activate and redirect to login.
const url = window.location.href;
const id = url.split("activate/")[1];
activate(id);
