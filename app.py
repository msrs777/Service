from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

SERVICES = {
    "plumbing": ["plumber", "plumbing", "tap", "pipe", "leak", "drain"],
    "electrical": ["electrician", "electrical", "switch", "socket", "light", "fan", "wiring"],
    "ac": ["ac", "air conditioner", "cooling"],
    "cleaning": ["cleaning", "cleaner", "deep cleaning"],
    "washing_machine": ["washing machine"],
    "refrigerator": ["refrigerator", "fridge"],
    "tv": ["tv", "television"],
    "ro": ["ro", "water purifier", "purifier"],
    "geyser": ["geyser", "water heater"],
}

def detect_service(message):
    text = message.lower()
    for service, keywords in SERVICES.items():
        if any(keyword in text for keyword in keywords):
            return service
    return None

def chatbot_reply(message):
    text = message.lower().strip()
    service = detect_service(text)

    if any(word in text for word in ["hello", "hi", "hey"]):
        return "Hello! 👋 Welcome to Bhubaneswar Home Services. How can we help you today?"

    if service:
        names = {
            "plumbing": "plumbing",
            "electrical": "electrical work",
            "ac": "AC service/repair",
            "cleaning": "home cleaning",
            "washing_machine": "washing machine repair",
            "refrigerator": "refrigerator repair",
            "tv": "TV repair",
            "ro": "RO/water purifier service",
            "geyser": "geyser repair",
        }
        return f"Sure 👍 We can help with {names[service]}. Please share your location and preferred date/time."

    if any(word in text for word in ["price", "cost", "charge", "rate"]):
        return "The price depends on the service and problem. Please tell us what service you need and your location."

    return "Sure 👍 Please tell me what home service you need and your location."

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    message = data.get("message", "").strip()

    if not message:
        return jsonify({"error": "Message cannot be empty."}), 400

    return jsonify({"reply": chatbot_reply(message)})

@app.route("/api/health")
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
