document.getElementById("year").textContent = new Date().getFullYear();

const form = document.getElementById("serviceForm");

form.addEventListener("submit", function (event) {
event.preventDefault();

const name = document.getElementById("name").value.trim();
const service = document.getElementById("service").value;
const description = document.getElementById("description").value.trim();
const location = document.getElementById("location").value.trim();
const date = document.getElementById("date").value;
const time = document.getElementById("time").value;

const formattedDate = date
? new Date(date + "T00:00:00").toLocaleDateString("en-IN")
: "";

const formattedTime = time
? new Date("1970-01-01T" + time).toLocaleTimeString("en-IN", {
hour: "2-digit",
minute: "2-digit"
})
: "";

const message =
`Hello Bhubaneswar Home Services,\n\n` +
`I want to book a service.\n\n` +
`Name: ${name}\n` +
`Service Type: ${service}\n` +
`Description: ${description}\n` +
`Location: ${location}\n` +
`Preferred Date: ${formattedDate}\n` +
`Preferred Time: ${formattedTime}`;

const whatsappURL =
`https://wa.me/919937867737?text=${encodeURIComponent(message)}`;

window.open(whatsappURL, "_blank");
});
