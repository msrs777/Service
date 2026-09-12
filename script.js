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

    const message =
        `Hello Bhubaneswar Home Services,%0A%0A` +
        `Name: ${encodeURIComponent(name)}%0A` +
        `Service: ${encodeURIComponent(service)}%0A` +
        `Description: ${encodeURIComponent(description)}%0A` +
        `Location: ${encodeURIComponent(location)}%0A` +
        `Preferred Date: ${encodeURIComponent(date)}%0A` +
        `Preferred Time: ${encodeURIComponent(time)}`;

    // Replace 919000000000 with your actual WhatsApp number
    const whatsappURL =
        `https://wa.me/919000000000?text=${message}`;

    window.open(whatsappURL, "_blank");

    form.reset();
});
