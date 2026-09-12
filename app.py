from flask import Flask, request, jsonify, send_from_directory
import sqlite3

app = Flask(__name__)

DATABASE = "bookings.db"


def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = sqlite3.connect(DATABASE)

    conn.execute("""
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            service TEXT NOT NULL,
            description TEXT NOT NULL,
            location TEXT NOT NULL,
            preferred_date TEXT NOT NULL,
            preferred_time TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()
    conn.close()


@app.route("/")
def home():
    return send_from_directory(".", "index.html")


@app.route("/<path:filename>")
def files(filename):
    return send_from_directory(".", filename)


@app.route("/health")
def health():
    return "OK"


@app.route("/book", methods=["POST"])
def book_service():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "No data received"
        }), 400

    name = data.get("name", "").strip()
    service = data.get("service", "").strip()
    description = data.get("description", "").strip()
    location = data.get("location", "").strip()
    preferred_date = data.get("preferred_date", "").strip()
    preferred_time = data.get("preferred_time", "").strip()

    if not all([
        name,
        service,
        description,
        location,
        preferred_date,
        preferred_time
    ]):
        return jsonify({
            "success": False,
            "message": "All fields are required"
        }), 400

    conn = get_db_connection()

    conn.execute("""
        INSERT INTO bookings
        (
            name,
            service,
            description,
            location,
            preferred_date,
            preferred_time
        )
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        name,
        service,
        description,
        location,
        preferred_date,
        preferred_time
    ))

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Booking saved successfully"
    })


if __name__ == "__main__":
    init_db()

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )