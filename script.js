document.getElementById("year").textContent = new Date().getFullYear();

const form = document.getElementById("serviceForm");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const service = document.getElementById("service").value;
  const description = document.getElementById("description").value.trim();
  const location = document.getElementById("location").value.trim();
  const preferredDate = document.getElementById("date").value;
  const preferredTime = document.getElementById("time").value;

  const bookingData = {
    name: name,
    service: service,
    description: description,
    location: location,
    preferred_date: preferredDate,
    preferred_time: preferredTime
  };

  try {

    // Save booking to Flask + SQLite
    const response = await fetch("/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bookingData)
    });

    const result = await response.json();

    if (!result.success) {
      alert("Booking failed: " + result.message);
      return;
    }

    // WhatsApp message
    const whatsappMessage =
      `Hello Bhubaneswar Home Services,\n\n` +
      `I want to book a service.\n\n` +
      `Name: ${name}\n` +
      `Service Type: ${service}\n` +
      `Description: ${description}\n` +
      `Location: ${location}\n` +
      `Preferred Date: ${preferredDate}\n` +
      `Preferred Time: ${preferredTime}`;

    const whatsappURL =
      `https://wa.me/919937867737?text=${encodeURIComponent(whatsappMessage)}`;

    // Open WhatsApp
    window.location.href = whatsappURL;

    // Clear form
    form.reset();

  } catch (error) {

    console.error("Booking error:", error);

    alert(
      "Unable to save booking. Please check that the Flask server is running."
    );
  }
});