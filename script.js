document.getElementById("year").textContent = new Date().getFullYear();

const form = document.getElementById("serviceForm");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const service = document.getElementById("service").value;
  const message = document.getElementById("message").value.trim();
  const address = document.getElementById("address").value.trim();
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  const whatsappMessage =
`Hello Bhubaneswar Home Services,

📋 NEW SERVICE REQUEST

👤 Name: ${name}
📞 Phone: ${phone}
🔧 Service: ${service}

📝 Problem:
${message}

📍 Address:
${address}

📅 Preferred Date: ${date}
⏰ Preferred Time: ${time}

Please confirm my service request.`;

  const whatsappURL =
    "https://wa.me/919937867737?text=" +
    encodeURIComponent(whatsappMessage);

  window.open(whatsappURL, "_blank");
});
