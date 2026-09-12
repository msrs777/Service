document.getElementById("year").textContent = new Date().getFullYear();

const form = document.getElementById("serviceForm");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const service = document.getElementById("service").value;
  const description = document.getElementById("description").value.trim();
  const location = document.getElementById("location").value.trim();
  const preferred_date = document.getElementById("date").value;
  const preferred_time = document.getElementById("time").value;

  const bookingData = {
    name: name,
    service: service,
    description: description,
    location: location,
    preferred_date: preferred_date,
    preferred_time: preferred_time
  };

  try {
    const response = await fetch("http://192.168.52.137:5000/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bookingData)
    });

    const result = await response.json();

    if (result.success) {
      alert("Your service request has been submitted successfully!");

      form.reset();
    } else {
      alert("Error: " + result.message);
    }

  } catch (error) {
    console.error(error);
    alert("Unable to connect to the server. Please try again.");
  }
});
