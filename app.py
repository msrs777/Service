from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import re
import psycopg2

app = Flask(__name__)

CORS(app)


# ============================================================
# SERVICE DEFINITIONS
# ============================================================

SERVICES = {
    "washing_machine": [
        "washing machine"
    ],

    "refrigerator": [
        "refrigerator",
        "fridge"
    ],

    "tv": [
        "television",
        "tv"
    ],

    "ro": [
        "water purifier",
        "purifier",
        "ro"
    ],

    "geyser": [
        "geyser",
        "water heater"
    ],

    "ac": [
        "air conditioner",
        "ac service",
        "ac repair"
    ],

    "electrical": [
        "electrician",
        "electrical",
        "switch",
        "socket",
        "light",
        "fan",
        "wiring"
    ],

    "cleaning": [
        "deep cleaning",
        "cleaning",
        "cleaner"
    ],

    "plumbing": [
        "plumber",
        "plumbing",
        "tap",
        "pipe",
        "leak",
        "drain"
    ]
}


SERVICE_NAMES = {
    "plumbing": "Plumbing",
    "electrical": "Electrical",
    "ac": "AC service/repair",
    "cleaning": "Home cleaning",
    "washing_machine": "Washing machine repair",
    "refrigerator": "Refrigerator repair",
    "tv": "TV repair",
    "ro": "RO/water purifier service",
    "geyser": "Geyser repair"
}


# ============================================================
# SERVICE DETECTION
# ============================================================

def detect_service(message):

    text = message.lower().strip()

    for service, keywords in SERVICES.items():

        for keyword in keywords:

            # Match complete words/phrases.
            # This prevents "ro" from matching random words.
            pattern = r"\b" + re.escape(keyword) + r"\b"

            if re.search(pattern, text):
                return service

    return None


# ============================================================
# LOCATION EXTRACTION
# ============================================================

def extract_location(message):

    text = message.strip()

    # Example:
    # "in Patia 14th Sep 12pm"
    match = re.search(
        r"(?:in|at|near)\s+"
        r"([A-Za-z][A-Za-z ]*?)"
        r"(?=\s+\d{1,2}(?:st|nd|rd|th)?\b"
        r"|\s+\d{1,2}:\d{2}"
        r"|\s+\d{1,2}\s*(?:am|pm)\b"
        r"|$)",
        text,
        re.IGNORECASE
    )

    if match:
        return match.group(1).strip()


    # Example:
    # "Patia 14th Sep 12pm"
    match = re.match(
        r"^([A-Za-z][A-Za-z ]*?)\s+"
        r"\d{1,2}(?:st|nd|rd|th)?\s+"
        r"(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b",
        text,
        re.IGNORECASE
    )

    if match:
        return match.group(1).strip()


    return None


# ============================================================
# DATE EXTRACTION
# ============================================================

def extract_date(message):

    match = re.search(
        r"\b"
        r"(\d{1,2})(?:st|nd|rd|th)?"
        r"\s+"
        r"(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)"
        r"\b",
        message,
        re.IGNORECASE
    )

    if match:

        return (
            f"{match.group(1)} "
            f"{match.group(2)}"
        )

    return None


# ============================================================
# TIME EXTRACTION
# ============================================================

def extract_time(message):

    match = re.search(
        r"\b"
        r"(\d{1,2})"
        r"(?::(\d{2}))?"
        r"\s*(am|pm)"
        r"\b",
        message,
        re.IGNORECASE
    )

    if match:

        hour = match.group(1)

        minute = match.group(2) or "00"

        period = match.group(3).upper()

        return f"{hour}:{minute} {period}"

    return None


# ============================================================
# CHATBOT LOGIC
# ============================================================

def chatbot_reply(
    message,
    current_service=None,
    current_location=None,
    current_date=None,
    current_time=None
):

    text = message.lower().strip()


    # Detect service from current message
    detected_service = detect_service(message)

    service = (
        detected_service
        or current_service
    )


    # Extract information from current message
    detected_location = extract_location(message)

    detected_date = extract_date(message)

    detected_time = extract_time(message)


    # Keep previously collected information
    location = (
        detected_location
        or current_location
    )

    date = (
        detected_date
        or current_date
    )

    time = (
        detected_time
        or current_time
    )


    # ========================================================
    # GREETING
    # ========================================================

    if (
        not service
        and any(
            word in text
            for word in [
                "hello",
                "hi",
                "hey"
            ]
        )
    ):

        return {
            "reply": (
                "Hello! 👋\n\n"
                "Welcome to Bhubaneswar Home Services. "
                "How can I help you today?"
            ),

            "service": None,
            "location": None,
            "date": None,
            "time": None,
            "completed": False
        }


    # ========================================================
    # SERVICE NOT FOUND
    # ========================================================

    if not service:

        return {
            "reply": (
                "Sure 👍 Please tell me which home service "
                "you need, such as plumbing, electrical, AC, "
                "cleaning, washing machine, refrigerator, "
                "TV, RO or geyser."
            ),

            "service": None,
            "location": location,
            "date": date,
            "time": time,
            "completed": False
        }


    service_name = SERVICE_NAMES.get(
        service,
        service
    )


    # ========================================================
    # ALL INFORMATION AVAILABLE
    # ========================================================

    if location and date and time:

        return {
            "reply": (
                "Thank you for contacting "
                "Bhubaneswar Home Services! 🙏\n\n"

                f"We have received your request for "
                f"{service_name} in {location} "
                f"for {date} at {time}.\n\n"

                "Our team will contact you shortly. 😊"
            ),

            "service": service,
            "location": location,
            "date": date,
            "time": time,
            "completed": True
        }


    # ========================================================
    # INFORMATION STILL MISSING
    # ========================================================

    missing = []

    if not location:
        missing.append("location")

    if not date:
        missing.append("date")

    if not time:
        missing.append("time")


    if len(missing) == 3:

        reply = (
            f"Sure 👍 We can help with {service_name}.\n\n"
            "Please share your location and preferred "
            "date/time."
        )

    elif not location:

        reply = (
            f"Sure 👍 We can help with {service_name}.\n\n"
            "Please share your location."
        )

    elif not date and not time:

        reply = (
            f"Thanks 👍 I have your location as "
            f"{location}.\n\n"
            "Please share your preferred date and time."
        )

    elif not date:

        reply = (
            f"Thanks 👍 I have your location as "
            f"{location} and time as {time}.\n\n"
            "Please share your preferred date."
        )

    elif not time:

        reply = (
            f"Thanks 👍 I have your location as "
            f"{location} and date as {date}.\n\n"
            "Please share your preferred time."
        )

    else:

        reply = (
            f"Thanks 👍 I have your request for "
            f"{service_name}."
        )


    return {
        "reply": reply,

        "service": service,

        "location": location,

        "date": date,

        "time": time,

        "completed": False
    }


# ============================================================
# CHAT API
# ============================================================

@app.route("/api/chat", methods=["POST"])
def chat():

    data = request.get_json() or {}


    message = data.get(
        "message",
        ""
    ).strip()


    if not message:

        return jsonify({
            "error": "Message cannot be empty."
        }), 400


    result = chatbot_reply(

        message,

        current_service=data.get(
            "service"
        ),

        current_location=data.get(
            "location"
        ),

        current_date=data.get(
            "date"
        ),

        current_time=data.get(
            "time"
        )
    )


    return jsonify(result)


# ============================================================
# BOOKING API
# ============================================================

@app.route(
    "/api/bookings",
    methods=["POST"]
)
def create_booking():

    data = request.get_json() or {}


    name = data.get(
        "name",
        ""
    ).strip()


    service = data.get(
        "service",
        ""
    ).strip()


    description = data.get(
        "description",
        ""
    ).strip()


    location = data.get(
        "location",
        ""
    ).strip()


    preferred_date = data.get(
        "preferred_date",
        ""
    ).strip()


    preferred_time = data.get(
        "preferred_time",
        ""
    ).strip()


    if (
        not name
        or not service
        or not description
        or not location
    ):

        return jsonify({
            "error": (
                "Required booking information "
                "is missing."
            )
        }), 400


    database_url = os.environ.get(
        "DATABASE_URL"
    )


    if not database_url:

        return jsonify({
            "error": (
                "DATABASE_URL is not configured."
            )
        }), 500


    connection = None

    cursor = None


    try:

        connection = psycopg2.connect(
            database_url
        )

        cursor = connection.cursor()


        cursor.execute(
            """
            INSERT INTO bookings
            (
                name,
                phone,
                service,
                location,
                preferred_date,
                preferred_time,
                message
            )
            VALUES
            (
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s
            )
            RETURNING id
            """,

            (
                name,

                "WhatsApp",

                service,

                location,

                preferred_date or None,

                preferred_time or None,

                description
            )
        )


        booking_id = cursor.fetchone()[0]


        connection.commit()


        return jsonify({

            "success": True,

            "booking_id": booking_id

        }), 201


    except Exception as error:

        if connection:
            connection.rollback()


        print(
            "Database error:",
            error
        )


        return jsonify({

            "error":
                "Could not save booking."

        }), 500


    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# ============================================================
# HEALTH CHECK
# ============================================================

@app.route("/api/health")
def health():

    return jsonify({
        "status": "ok"
    })


# ============================================================
# RUN APPLICATION
# ============================================================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )