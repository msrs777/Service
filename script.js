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


// ========================================
// AI CHATBOT
// ========================================

const chatbotToggle =
    document.getElementById("chatbotToggle");

const chatbotWindow =
    document.getElementById("chatbotWindow");

const chatbotClose =
    document.getElementById("chatbotClose");

const chatbotMessages =
    document.getElementById("chatbotMessages");

const chatbotInput =
    document.getElementById("chatbotInput");

const chatbotSend =
    document.getElementById("chatbotSend");


// ========================================
// BACKEND URL
// ========================================

// Local development
const CHATBOT_API =
https://bloggers-toner-heroes-roots.trycloudflare.com/api/chat

// ========================================
// CHAT HISTORY
// ========================================

let chatHistory = [];


// ========================================
// CUSTOMER INFORMATION
// ========================================

let customerData = {

    name: "",
    service: "",
    description: "",
    location: "",
    date: "",
    time: ""

};


// ========================================
// OPEN CHAT
// ========================================

if (chatbotToggle) {

    chatbotToggle.addEventListener(
        "click",
        function () {

            chatbotWindow.classList.add(
                "active"
            );


            if (
                chatbotMessages.children.length === 0
            ) {

                startAIChat();

            }


            chatbotInput.focus();

        }
    );

}


// ========================================
// CLOSE CHAT
// ========================================

if (chatbotClose) {

    chatbotClose.addEventListener(
        "click",
        function () {

            chatbotWindow.classList.remove(
                "active"
            );

        }
    );

}


// ========================================
// START AI CHAT
// ========================================

function startAIChat() {

    const message =
        "👋 Hi! I'm the Bhubaneswar Home Services assistant. How can I help you today?";


    addBotMessage(message);


    chatHistory.push({

        role: "assistant",

        content: message

    });

}


// ========================================
// SEND MESSAGE
// ========================================

if (chatbotSend) {

    chatbotSend.addEventListener(
        "click",
        sendChatMessage
    );

}


if (chatbotInput) {

    chatbotInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                sendChatMessage();

            }

        }
    );

}


// ========================================
// SEND CHAT TO BACKEND
// ========================================

async function sendChatMessage() {

    const message =
        chatbotInput.value.trim();


    if (!message) {
        return;
    }


    // Display user message
    addUserMessage(message);


    // Clear input
    chatbotInput.value = "";


    // Save user message
    chatHistory.push({

        role: "user",

        content: message

    });


    // Show typing
    const typing =
        addTypingIndicator();


    chatbotSend.disabled = true;


    try {

        const response =
            await fetch(
                CHATBOT_API,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        message: message,

                        history:
                            chatHistory

                    })

                }
            );


        const data =
            await response.json();


        typing.remove();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Server error"
            );

        }


        const reply =
            data.reply;


        // Display AI reply
        addBotMessage(reply);


        // Save AI response
        chatHistory.push({

            role: "assistant",

            content: reply

        });


        // Detect booking completion
        checkForBookingIntent(
            message,
            reply
        );


    }

    catch (error) {

        console.error(
            "Chatbot error:",
            error
        );


        typing.remove();


        addBotMessage(
            "Sorry, I'm having trouble connecting right now. You can contact us directly on WhatsApp. 💬"
        );


        showWhatsAppButton();

    }

    finally {

        chatbotSend.disabled = false;

        chatbotInput.focus();

    }

}


// ========================================
// TYPING INDICATOR
// ========================================

function addTypingIndicator() {

    const element =
        document.createElement("div");

    element.className =
        "chatbot-message bot";

    element.textContent =
        "Typing...";


    chatbotMessages.appendChild(
        element
    );


    scrollChat();


    return element;

}


// ========================================
// BOT MESSAGE
// ========================================

function addBotMessage(message) {

    const element =
        document.createElement("div");


    element.className =
        "chatbot-message bot";


    element.textContent =
        message;


    chatbotMessages.appendChild(
        element
    );


    scrollChat();

}


// ========================================
// USER MESSAGE
// ========================================

function addUserMessage(message) {

    const element =
        document.createElement("div");


    element.className =
        "chatbot-message user";


    element.textContent =
        message;


    chatbotMessages.appendChild(
        element
    );


    scrollChat();

}


// ========================================
// BOOKING DETECTION
// ========================================

function checkForBookingIntent(
    userMessage,
    botReply
) {

    const text =
        (
            userMessage +
            " " +
            botReply
        ).toLowerCase();


    if (
        text.includes("send this request") ||
        text.includes("send request") ||
        text.includes("booking is ready") ||
        text.includes("request is ready") ||
        text.includes("whatsapp")
    ) {

        showWhatsAppButton();

    }

}


// ========================================
// WHATSAPP BUTTON
// ========================================

function showWhatsAppButton() {

    if (
        document.querySelector(
            ".chatbot-whatsapp"
        )
    ) {

        return;

    }


    const button =
        document.createElement("button");


    button.type =
        "button";


    button.className =
        "chatbot-whatsapp";


    button.textContent =
        "💬 Send Request on WhatsApp";


    button.addEventListener(
        "click",
        function () {

            sendChatToWhatsApp();

        }
    );


    chatbotMessages.appendChild(
        button
    );


    scrollChat();

}


// ========================================
// SEND CHAT TO WHATSAPP
// ========================================

function sendChatToWhatsApp() {

    let conversation = "";


    chatHistory.forEach(
        function (message) {

            if (
                message.role === "user"
            ) {

                conversation +=
                    `Customer: ${message.content}\n`;

            }

        }
    );


    const whatsappMessage =
        `Hello Bhubaneswar Home Services,\n\n` +
        `I contacted your website AI assistant.\n\n` +
        `Conversation:\n` +
        `${conversation}`;


    const whatsappURL =
        `https://wa.me/919937867737?text=` +
        `${encodeURIComponent(
            whatsappMessage
        )}`;


    window.open(
        whatsappURL,
        "_blank"
    );

}


// ========================================
// SCROLL CHAT
// ========================================

function scrollChat() {

    chatbotMessages.scrollTop =
        chatbotMessages.scrollHeight;

}
