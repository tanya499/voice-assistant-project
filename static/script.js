const btn = document.getElementById("mic-btn");
const sendBtn = document.getElementById("send-btn");
const textInput = document.getElementById("command-input");
const output = document.getElementById("response");

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

        let data = await response.json();

        output.innerHTML += "<br><br>🤖 " + data.response;

        let historyList = document.getElementById("history-list");

        let item = document.createElement("div");
        item.innerHTML = "🔍 " + command;

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
        speech.lang = "en-US";
        speechSynthesis.speak(speech);

    }catch(error){
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

    recognition.lang = "en-US";

    output.innerHTML = "🎤 Listening...";

    recognition.start();

    recognition.onresult = function(event){

    let command =
    event.results[0][0].transcript.toLowerCase();

    if(command.includes("hey syra")){

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