const btn = document.getElementById("mic-btn");
const sendBtn = document.getElementById("send-btn");
const textInput = document.getElementById("command-input");
const output = document.getElementById("response");
// const orb = document.querySelector(".syra-orb");
const voiceOrb=document.getElementById("voiceOrb");
voiceOrb.className="voice-orb idle";

output.innerHTML = `
<h3><i class="fas fa-robot"></i> Response</h3>

<div class="welcome-card">
    <h2>👋 Welcome to SYRA</h2>
    <p>Your Smart Voice Assistant</p>
</div>
`;

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

recognition.onresult = function(event) {

    let command = event.results[0][0].transcript.toLowerCase();

    if(command.includes("hey syra")) {

        output.innerHTML = "👋 Hi! How can I help you?";

        let speech = new SpeechSynthesisUtterance(
            "Hi! How can I help you?"
        );

        speechSynthesis.speak(speech);
        return;
    }

    processCommand(command);
};

async function processCommand(command){

    voiceOrb.className = "voice-orb thinking";

    output.innerHTML = "You said: " + command;

    try{

        let response = await fetch("/command",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                command:command
            })
        });

        output.innerHTML = `
        <h3><i class="fas fa-robot"></i> Response</h3>
        🤖 SYRA is typing...
        `;

        let data = await response.json();

        voiceOrb.className = "voice-orb speaking";

        output.innerHTML = `
        <h3><i class="fas fa-robot"></i> Response</h3>
        ${data.response}
        `;


        let historyList = document.getElementById("history-list");

        let item = document.createElement("div");
        let time = new Date().toLocaleTimeString([], {
            hour:'2-digit',
            minute:'2-digit'
        });

        item.innerHTML = `
        <i class="fas fa-clock" style="color:#38bdf8;"></i>
        ${command}
        <br>
        <span style="color:#94a3b8;font-size:12px;">
        ${time}
        </span>
        `;

        historyList.prepend(item);

        if(data.response === "Opening Google"){
            window.open("https://www.google.com","_blank");
        }

        if(data.response === "Opening YouTube"){
            window.open("https://www.youtube.com","_blank");
        }

        if(data.response === "Opening Gmail"){
            window.open("https://mail.google.com","_blank");
        }

        if(data.response === "Opening ChatGPT"){
            window.open("https://chatgpt.com","_blank");
        }

        if(data.response === "Opening LinkedIn"){
            window.open("https://www.linkedin.com","_blank");
        }

        if(data.response === "Opening Weather"){
            window.open("https://www.google.com/search?q=weather","_blank");
        }

        let speech = new SpeechSynthesisUtterance(data.response);

        speech.lang = "en-IN";

        speech.onend = function(){

            voiceOrb.className = "voice-orb idle";

        };

        speechSynthesis.speak(speech);

    }catch(error){

        voiceOrb.className = "voice-orb idle";

        output.innerHTML += "<br><br>❌ Server Error";
    }
}

sendBtn.addEventListener("click",()=>{

    let command = textInput.value.trim();

    if(command !== ""){
        processCommand(command);
        textInput.value = "";
    }

});

btn.addEventListener("click",()=>{

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if(!SpeechRecognition){
        output.innerHTML =
        "❌ Speech Recognition not supported";
        return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";

    output.innerHTML = "🎤 Listening...";

    recognition.start();

    voiceOrb.className = "voice-orb listening";

    recognition.onresult = function(event){

    let command =
    event.results[0][0].transcript.toLowerCase();

    if(
        command.includes("hey syra") ||
        command.includes("hey sira") ||
        command.includes("hey syria") ||
        command.includes("hey saira") ||
        command.includes("hey sara") ||
        command.includes("hey sai ram") 
    ){

        output.innerHTML = "👋 Hi! How can I help you?";

        let speech = new SpeechSynthesisUtterance(
            "Hi! How can I help you?"
        );

        speechSynthesis.speak(speech);
        return;
    }

    processCommand(command);
};

    recognition.onerror = function(event){

        output.innerHTML =
        "❌ Error: " + event.error;
    };
});

document.getElementById("clear-history")
.addEventListener("click", function(){

    document.getElementById("history-list")
    .innerHTML = "";

});

function updateTime() {
    const now = new Date();
    document.getElementById("datetime").innerHTML =
        "📅 " + now.toLocaleDateString() +
        " | 🕒 " + now.toLocaleTimeString();
}

setInterval(updateTime, 1000);
updateTime();