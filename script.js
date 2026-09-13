// ============================================================
// CURRENT YEAR
// ============================================================

const currentYearElement =
    document.getElementById("currentYear");

if (currentYearElement) {

    currentYearElement.textContent =
        new Date().getFullYear();
}


// ============================================================
// BOOKING FORM
// ============================================================

const form =
    document.getElementById("serviceForm");

if (form) {

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();


            const service =
                document
                    .getElementById("service")
                    .value;


            const description =
                document
                    .getElementById("description")
                    .value
                    .trim();


            const location =
                document
                    .getElementById("location")
                    .value
                    .trim();


            const date =
                document
                    .getElementById("date")
                    .value;


            const time =
                document
                    .getElementById("time")
                    .value;


            if (
                !name ||
                !service ||
                !description ||
                !location
            ) {

                alert(
                    "Please fill in all required fields."
                );

                return;
            }


            try {

                const response =
                    await fetch(
                        "http://127.0.0.1:5000/api/bookings",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                name: name,

                                service: service,

                                description: description,

                                location: location,

                                preferred_date: date,

                                preferred_time: time
                            })
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    alert(
                        result.error ||
                        "Could not save your booking."
                    );

                    return;
                }


                console.log(
                    "Booking saved successfully:",
                    result.booking_id
                );


                const message =
                    `Hello Bhubaneswar Home Services,\n\n` +

                    `Booking ID: ${result.booking_id}\n` +

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


                alert(
                    `Booking saved successfully!\n\n` +
                    `Booking ID: ${result.booking_id}`
                );


            } catch (error) {

                console.error(
                    "Booking error:",
                    error
                );


                alert(
                    "Unable to connect to the booking server."
                );
            }
        }
    );
}


// ============================================================
// CHATBOT
// ============================================================

// These variables remember the conversation.
// NO UI changes are made.

let chatbotService = null;

let chatbotLocation = null;

let chatbotDate = null;

let chatbotTime = null;


const chatbotToggle =
    document.getElementById(
        "chatbotToggle"
    );


const chatbotWindow =
    document.getElementById(
        "chatbotWindow"
    );


const chatbotClose =
    document.getElementById(
        "chatbotClose"
    );


const chatbotForm =
    document.getElementById(
        "chatbotForm"
    );


const chatbotInput =
    document.getElementById(
        "chatbotInput"
    );


const chatbotMessages =
    document.getElementById(
        "chatbotMessages"
    );


// ============================================================
// OPEN CHATBOT
// ============================================================

if (chatbotToggle) {

    chatbotToggle.addEventListener(
        "click",
        function () {

            chatbotWindow.style.display =
                "flex";

            chatbotInput.focus();
        }
    );
}


// ============================================================
// CLOSE CHATBOT
// ============================================================

if (chatbotClose) {

    chatbotClose.addEventListener(
        "click",
        function () {

            chatbotWindow.style.display =
                "none";
        }
    );
}


// ============================================================
// ADD CHAT MESSAGE
// ============================================================

function addChatMessage(
    message,
    sender
) {

    const messageElement =
        document.createElement(
            "div"
        );


    messageElement.className =
        `chatbot-message ${sender}`;


    messageElement.innerHTML =
        message.replace(
            /\n/g,
            "<br>"
        );


    chatbotMessages.appendChild(
        messageElement
    );


    chatbotMessages.scrollTop =
        chatbotMessages.scrollHeight;
}


// ============================================================
// CHATBOT FORM
// ============================================================

if (chatbotForm) {

    chatbotForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const message =
                chatbotInput.value.trim();


            if (!message) {
                return;
            }


            // Show customer's message
            addChatMessage(
                message,
                "user"
            );


            chatbotInput.value = "";

            chatbotInput.disabled = true;


            try {

                const response =
                    await fetch(
                        "http://127.0.0.1:5000/api/chat",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                message:
                                    message,

                                service:
                                    chatbotService,

                                location:
                                    chatbotLocation,

                                date:
                                    chatbotDate,

                                time:
                                    chatbotTime
                            })
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    addChatMessage(
                        result.error ||
                        "Sorry, something went wrong.",
                        "bot"
                    );

                    return;
                }


                // Remember collected information

                chatbotService =
                    result.service ||
                    chatbotService;


                chatbotLocation =
                    result.location ||
                    chatbotLocation;


                chatbotDate =
                    result.date ||
                    chatbotDate;


                chatbotTime =
                    result.time ||
                    chatbotTime;


                // Display bot response

                addChatMessage(
                    result.reply,
                    "bot"
                );


                // Request completed
                // Reset conversation state.

                if (result.completed) {

                    chatbotService = null;

                    chatbotLocation = null;

                    chatbotDate = null;

                    chatbotTime = null;
                }


            } catch (error) {

                console.error(
                    "Chatbot error:",
                    error
                );


                addChatMessage(
                    "Sorry, I cannot connect to the service right now.",
                    "bot"
                );


            } finally {

                chatbotInput.disabled =
                    false;

                chatbotInput.focus();
            }
        }
    );
}