// ========================================
// BHUBANESWAR HOME SERVICES
// Website + WhatsApp + Free Chatbot
// ========================================

// Current year
const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


// ========================================
// EXISTING BOOKING FORM → WHATSAPP
// ========================================

const form = document.getElementById("serviceForm");

if (form) {
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const service = document.getElementById("service").value;
        const description = document.getElementById("description").value.trim();
        const location = document.getElementById("location").value.trim();
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;

        const message =
            `Hello Bhubaneswar Home Services,\n\n` +
            `Name: ${name}\n` +
            `Service: ${service}\n` +
            `Description: ${description}\n` +
            `Location: ${location}\n` +
            `Preferred Date: ${date}\n` +
            `Preferred Time: ${time}`;

        const whatsappURL =
            `https://wa.me/919937867737?text=${encodeURIComponent(message)}`;

        window.open(whatsappURL, "_blank");

        form.reset();
    });
}


// ========================================
// FREE WEBSITE CHATBOT
// ========================================

const chatbotToggle = document.getElementById("chatbotToggle");
const chatbotWindow = document.getElementById("chatbotWindow");
const chatbotClose = document.getElementById("chatbotClose");
const chatbotMessages = document.getElementById("chatbotMessages");
const chatbotInput = document.getElementById("chatbotInput");
const chatbotSend = document.getElementById("chatbotSend");


// Only activate chatbot if its HTML exists
if (
    chatbotToggle &&
    chatbotWindow &&
    chatbotMessages &&
    chatbotInput &&
    chatbotSend
) {

    let chatbotState = {
        step: "service",
        service: "",
        name: "",
        description: "",
        location: "",
        date: "",
        time: ""
    };


    // ----------------------------------------
    // OPEN CHATBOT
    // ----------------------------------------

    chatbotToggle.addEventListener("click", function () {
        chatbotWindow.classList.add("active");

        if (chatbotMessages.children.length === 0) {
            startChatbot();
        }
    });


    // ----------------------------------------
    // CLOSE CHATBOT
    // ----------------------------------------

    if (chatbotClose) {
        chatbotClose.addEventListener("click", function () {
            chatbotWindow.classList.remove("active");
        });
    }


    // ----------------------------------------
    // START CHAT
    // ----------------------------------------

    function startChatbot() {

        addBotMessage(
            "Hello! 👋 Welcome to Bhubaneswar Home Services."
        );

        setTimeout(function () {
            addBotMessage(
                "How can we help you today?"
            );

            showServiceButtons();
        }, 500);
    }


    // ----------------------------------------
    // SERVICE BUTTONS
    // ----------------------------------------

    function showServiceButtons() {

        const services = [
            "Plumbing",
            "Electrical",
            "AC Service",
            "Cleaning",
            "Appliance Repair",
            "Other"
        ];

        const container = document.createElement("div");

        container.className = "chatbot-options";

        services.forEach(function (service) {

            const button = document.createElement("button");

            button.type = "button";
            button.textContent = service;
            button.className = "chatbot-option";

            button.addEventListener("click", function () {

                addUserMessage(service);

                chatbotState.service = service;

                container.remove();

                setTimeout(function () {

                    addBotMessage(
                        `Great! You selected ${service}.`
                    );

                    setTimeout(function () {

                        addBotMessage(
                            "Please describe the problem or service you need."
                        );

                        chatbotState.step = "description";

                        chatbotInput.focus();

                    }, 400);

                }, 300);

            });

            container.appendChild(button);
        });

        chatbotMessages.appendChild(container);

        scrollChat();
    }


    // ----------------------------------------
    // SEND MESSAGE
    // ----------------------------------------

    chatbotSend.addEventListener("click", processChatInput);

    chatbotInput.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {
            event.preventDefault();
            processChatInput();
        }

    });


    function processChatInput() {

        const value = chatbotInput.value.trim();

        if (!value) {
            return;
        }

        addUserMessage(value);

        chatbotInput.value = "";

        handleChatStep(value);
    }


    // ----------------------------------------
    // HANDLE CHAT STEPS
    // ----------------------------------------

    function handleChatStep(value) {

        // Step 1: Service description
        if (chatbotState.step === "description") {

            chatbotState.description = value;

            chatbotState.step = "name";

            setTimeout(function () {

                addBotMessage(
                    "Thank you. May I know your name?"
                );

                chatbotInput.focus();

            }, 400);

            return;
        }


        // Step 2: Name
        if (chatbotState.step === "name") {

            chatbotState.name = value;

            chatbotState.step = "location";

            setTimeout(function () {

                addBotMessage(
                    "Thanks! Please enter your service location or area."
                );

                chatbotInput.focus();

            }, 400);

            return;
        }


        // Step 3: Location
        if (chatbotState.step === "location") {

            chatbotState.location = value;

            chatbotState.step = "date";

            setTimeout(function () {

                addBotMessage(
                    "What date would you prefer? Please use YYYY-MM-DD format."
                );

                chatbotInput.focus();

            }, 400);

            return;
        }


        // Step 4: Date
        if (chatbotState.step === "date") {

            chatbotState.date = value;

            chatbotState.step = "time";

            setTimeout(function () {

                addBotMessage(
                    "What time would you prefer? Example: 10:30 AM"
                );

                chatbotInput.focus();

            }, 400);

            return;
        }


        // Step 5: Time
        if (chatbotState.step === "time") {

            chatbotState.time = value;

            chatbotState.step = "complete";

            setTimeout(function () {

                showBookingSummary();

            }, 400);

            return;
        }
    }


    // ----------------------------------------
    // BOOKING SUMMARY
    // ----------------------------------------

    function showBookingSummary() {

        addBotMessage(
            "Perfect! Your service request is ready. ✅"
        );

        setTimeout(function () {

            addBotMessage(
                `Service: ${chatbotState.service}\n` +
                `Name: ${chatbotState.name}\n` +
                `Problem: ${chatbotState.description}\n` +
                `Location: ${chatbotState.location}\n` +
                `Date: ${chatbotState.date}\n` +
                `Time: ${chatbotState.time}`
            );

            setTimeout(function () {

                addBotMessage(
                    "Click the button below to send this request to us on WhatsApp."
                );

                showWhatsAppButton();

            }, 500);

        }, 500);
    }


    // ----------------------------------------
    // WHATSAPP BUTTON
    // ----------------------------------------

    function showWhatsAppButton() {

        const button = document.createElement("button");

        button.type = "button";
        button.className = "chatbot-whatsapp";

        button.innerHTML = "💬 Send Request on WhatsApp";

        button.addEventListener("click", function () {

            const message =
                `Hello Bhubaneswar Home Services,\n\n` +
                `Name: ${chatbotState.name}\n` +
                `Service: ${chatbotState.service}\n` +
                `Description: ${chatbotState.description}\n` +
                `Location: ${chatbotState.location}\n` +
                `Preferred Date: ${chatbotState.date}\n` +
                `Preferred Time: ${chatbotState.time}`;

            const whatsappURL =
                `https://wa.me/919937867737?text=${encodeURIComponent(message)}`;

            window.open(whatsappURL, "_blank");

        });

        chatbotMessages.appendChild(button);

        scrollChat();
    }


    // ----------------------------------------
    // ADD BOT MESSAGE
    // ----------------------------------------

    function addBotMessage(message) {

        const messageElement = document.createElement("div");

        messageElement.className = "chatbot-message bot";

        messageElement.textContent = message;

        chatbotMessages.appendChild(messageElement);

        scrollChat();
    }


    // ----------------------------------------
    // ADD USER MESSAGE
    // ----------------------------------------

    function addUserMessage(message) {

        const messageElement = document.createElement("div");

        messageElement.className = "chatbot-message user";

        messageElement.textContent = message;

        chatbotMessages.appendChild(messageElement);

        scrollChat();
    }


    // ----------------------------------------
    // SCROLL CHAT
    // ----------------------------------------

    function scrollChat() {

        chatbotMessages.scrollTop =
            chatbotMessages.scrollHeight;

    }
}
