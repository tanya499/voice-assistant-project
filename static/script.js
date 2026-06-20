const btn = document.getElementById("listen-btn");
const output = document.getElementById("response");

btn.addEventListener("click", () => {

    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        output.innerHTML = "❌ Speech Recognition is not supported in this browser.";
        return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    output.innerHTML = "🎤 Listening...";

    recognition.start();

    recognition.onresult = async (event) => {

        let command = event.results[0][0].transcript;

        output.innerHTML = "You said: " + command;

        try {
            let response = await fetch("/command", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    command: command
                })
            });

            let data = await response.json();

            output.innerHTML += "<br><br>🤖 " + data.response;

            // Open websites
            if (data.response === "Opening Google") {
                window.open("https://www.google.com", "_blank");
            }

            if (data.response === "Opening YouTube") {
                window.open("https://www.youtube.com", "_blank");
            }

            // Voice reply
            let speech = new SpeechSynthesisUtterance(data.response);
            speech.lang = "en-US";
            speechSynthesis.speak(speech);

        } catch (error) {
            output.innerHTML += "<br><br>❌ Server Error";
        }
    };

    recognition.onerror = function(event) {
        output.innerHTML = "❌ Error: " + event.error;
    };

});