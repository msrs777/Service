from flask import Flask, request, jsonify, render_template
import sqlite3

app = Flask(__name__)

DATABASE = "bookings.db"


def init_db():
    conn = sqlite3.connect(DATABASE)

    conn.execute("""
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            service TEXT NOT NULL,
            address TEXT NOT NULL,
            preferred_date TEXT NOT NULL,
            preferred_time TEXT NOT NULL,
            message TEXT NOT NULL,
            status TEXT DEFAULT 'Pending'
        )
    """)

    conn.commit()
    conn.close()


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/book", methods=["POST"])
def book_service():

    data = request.get_json()

    name = data.get("name")
    phone = data.get("phone")
    service = data.get("service")
    address = data.get("address")
    preferred_date = data.get("preferred_date")
    preferred_time = data.get("preferred_time")
    message = data.get("message")

    if not all([
        name,
        phone,
        service,
        address,
        preferred_date,
        preferred_time,
        message
    ]):
        return jsonify({
            "error": "All fields are required"
        }), 400

    conn = sqlite3.connect(DATABASE)

    conn.execute("""
        INSERT INTO bookings
        (
            name,
            phone,
            service,
            address,
            preferred_date,
            preferred_time,
            message
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        name,
        phone,
        service,
        address,
        preferred_date,
        preferred_time,
        message
    ))

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Booking saved successfully"
    })


@app.route("/admin")
def admin():
    return render_template("admin.html")


@app.route("/api/bookings")
def get_bookings():

    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row

    bookings = conn.execute("""
        SELECT *
        FROM bookings
        ORDER BY id DESC
    """).fetchall()

    conn.close()

    return jsonify([
        dict(booking)
        for booking in bookings
    ])

if __name__ == "__main__":
    init_db()

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
