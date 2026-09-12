// ========================================
// BHUBANESWAR HOME SERVICES
// AI SERVICE AGENT
// ========================================


// ========================================
// CURRENT YEAR
// ========================================

const yearElement =
    document.getElementById("year");

if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}


// ========================================
// EXISTING BOOKING FORM → WHATSAPP
// ========================================

const form =
    document.getElementById("serviceForm");

if (form) {

    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const name =
                document.getElementById("name")
                .value.trim();

            const service =
                document.getElementById("service")
                .value;

            const description =
                document.getElementById("description")
                .value.trim();

            const location =
                document.getElementById("location")
                .value.trim();

            const date =
                document.getElementById("date")
                .value;

            const time =
                document.getElementById("time")
                .value;


            const message =
                `Hello Bhubaneswar Home Services,\n\n` +
                `Name: ${name}\n` +
                `Service: ${service}\n` +
                `Description: ${description}\n` +
                `Location: ${location}\n` +
                `Preferred Date: ${date}\n` +
                `Preferred Time: ${time}`;


            const whatsappURL =
                `https://wa.me/919937867737?text=` +
                `${encodeURIComponent(message)}`;


            window.open(
                whatsappURL,
                "_blank"
            );


            form.reset();

        }
    );

}

