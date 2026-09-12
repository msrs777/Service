document.getElementById("year").textContent = new Date().getFullYear();

const form = document.getElementById("serviceForm");
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const service = document.getElementById("service").value;
  const message = document.getElementById("message").value.trim();

  const text =
    `Hello Bhubaneswar Home Services,%0A%0A` +
    `Name: ${encodeURIComponent(name)}%0A` +
    `Service: ${encodeURIComponent(service)}%0A` +
    `Requirement: ${encodeURIComponent(message)}`;

  window.open(`https://wa.me/919937867737?text=${text}`, "_blank");
});
