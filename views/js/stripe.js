const stripe = Stripe(
  "pk_test_51GyZzwCImzVyA7IpnkHgNLFQcmo5epSQx2zqpmAb3kJEuxt1gbiCuUqEXOBfRh0NuW1hTCL9vmZyswwAZEKiF1QC00D5TRpCaJ"
);

const bookCar = async (carId) => {
  // Get Stripe Session
  try {
    const session = await axios({
      method: "GET",
      url: `/api/v1/ExploreDreamDiscover/booking/checkout-car/${carId}`,
    });

    stripe
      .redirectToCheckout({
        sessionId: session.data.stripeSession.id,
      })
      .then((res) => {})
      .catch((err) => {});

    // Once Booking Is Done Make Car Not-Available.
  } catch (err) {}
};

// Prevent Page Going To Our API's Route
document.querySelector("#book-btn").addEventListener("click", (ev) => {
  ev.preventDefault();

  const carId = document
    .getElementById("book-btn")
    .attributes.href.nodeValue.split("/checkout-car/")[1];

  ev.target.textContent = "Processing...";
  bookCar(carId);
});
