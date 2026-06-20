from flask import Flask, render_template, request, jsonify
from datetime import datetime
import sqlite3

app = Flask(__name__)

# Database Create
def init_db():
    conn = sqlite3.connect("commands.db")
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS commands (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        command TEXT,
        response TEXT,
        timestamp TEXT
    )
    """)

    conn.commit()
    conn.close()

init_db()


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/command', methods=['POST'])
def command():

    data = request.get_json()
    text = data['command'].lower()

    if "time" in text:
        reply = "Current time is " + datetime.now().strftime("%I:%M %p")

    elif "date" in text:
        reply = "Today's date is " + datetime.now().strftime("%d %B %Y")

    elif "google" in text:
        reply = "Opening Google"

    elif "youtube" in text:
        reply = "Opening YouTube"

    elif "date" in command:
        reply = datetime.now().strftime("%d-%m-%Y")

    elif "gmail" in command:
        reply = "Opening Gmail"

    elif "chatgpt" in command:
        reply = "Opening ChatGPT"

    elif "linkedin" in command:
        reply = "Opening LinkedIn"

    elif "weather" in command:
        reply = "Opening weather"

    else:
        reply = "Sorry, I didn't understand that command."


    # Save to Database
    conn = sqlite3.connect("commands.db")
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO commands (command, response, timestamp) VALUES (?, ?, ?)",
        (
            text,
            reply,
            datetime.now().strftime("%d-%m-%Y %H:%M:%S")
        )
    )

    conn.commit()
    conn.close()

    return jsonify({"response": reply})


if __name__ == "__main__":
    app.run(debug=True)