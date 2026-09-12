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
// 1. Save booking to Flask + SQLite
const response = await fetch("http://192.168.52.137:5000/book", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify(bookingData)
});

```
const result = await response.json();

if (!result.success) {
  alert("Booking could not be saved: " + result.message);
  return;
}

// 2. Open WhatsApp with booking details
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

window.open(whatsappURL, "_blank");

// Clear form after successful submission
form.reset();
```

} catch (error) {
console.error("Booking error:", error);

```
alert(
  "Unable to connect to the booking server. " +
  "Please try again."
);
```

}
});
