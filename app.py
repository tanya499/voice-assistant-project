from flask import Flask, render_template, request, jsonify
from datetime import datetime
import sqlite3
import os
import google.generativeai as genai

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-1.5-flash")

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

    elif "hey syra" in text:
        reply = "Hi! How can I help you?"


    elif "who are you" in text:
        reply = "I am Syra, your personal voice assistant."

    elif "what is your name" in text:
        reply = "My name is Syra."

    elif "how are you" in text:
        reply = "I am fine. Thank you for asking."

    elif "good morning" in text:
        reply = "Good Morning! Have a great day."

    elif "good afternoon" in text:
        reply = "Good Afternoon! How can I help you?"

    elif "good evening" in text:
        reply = "Good Evening! Hope you are doing well."

    elif "thank you" in text:
        reply = "You are welcome. Anything else?"

    elif "bye" in text:
        reply = "Goodbye. Have a nice day."

    elif "i love you" in text:
        reply = "Thank you. That's very kind of you."

    elif "who made you" in text:
        reply = "I was created by Tanya."

    elif "tell me a joke" in text:
        reply = "Why do programmers prefer dark mode? Because light attracts bugs."

    elif "what can you do" in text:
        reply = "I can answer questions, tell time and date, and respond to voice commands."

    elif "hello" in text:
        reply = "Hello! How can I help you today?"

    elif "gmail" in text:
        reply = "Opening Gmail"

    elif "chatgpt" in text:
        reply = "Opening ChatGPT"

    elif "linkedin" in text:
        reply = "Opening LinkedIn"

    elif "weather" in text:
        reply = "Opening weather"

    else:
        try:
            response = model.generate_content(text)
            reply = response.text
        except Exception as e:
            reply = "Error: " + str(e)


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

@app.route('/history')
def history():

    conn = sqlite3.connect("commands.db")
    cursor = conn.cursor()

    cursor.execute("""
        SELECT command, response, timestamp
        FROM commands
        ORDER BY id DESC
        LIMIT 20
    """)

    data = cursor.fetchall()
    conn.close()

    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)