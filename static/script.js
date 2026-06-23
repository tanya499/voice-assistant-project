const btn = document.getElementById("mic-btn");
const sendBtn = document.getElementById("send-btn");
const textInput = document.getElementById("command-input");
const output = document.getElementById("response");
const orb = document.querySelector(".syra-orb");

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

    speech.onend = function(){
        orb.className = "syra-orb idle";
    };

    speechSynthesis.speak(speech);
    return;
}

    processCommand(command);
};

async function processCommand(command){

    orb.className = "syra-orb thinking";

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

        orb.className = "syra-orb speaking";

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

            orb.className = "syra-orb idle";

        };

        speechSynthesis.speak(speech);

    }catch(error){

        orb.className = "syra-orb idle";

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

    orb.className = "syra-orb listening";

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

        orb.className = "syra-orb idle";

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

const canvas = document.getElementById("siriCanvas");

if(canvas){
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        75,
        1,
        0.1,
        1000
    );

    const renderer = new THREE.WebGLRenderer({
        canvas:canvas,
        alpha:true,
        antialias:true
    });

    renderer.setSize(260,260);

    const geometry = new THREE.IcosahedronGeometry(2,20);

    const material = new THREE.MeshStandardMaterial({
        color:0x66ccff,
        emissive:0xaa00ff,
        roughness:0.2,
        metalness:0.8
    });

    const orbMesh = new THREE.Mesh(
        geometry,
        material
    );

    scene.add(orbMesh);

    const light1 = new THREE.PointLight(
        0x00ffff,
        3
    );

    light1.position.set(5,5,5);
    scene.add(light1);

    const light2 = new THREE.PointLight(
        0xff00ff,
        3
    );

    light2.position.set(-5,-5,5);
    scene.add(light2);

    camera.position.z = 5;

    function animate(){
        requestAnimationFrame(animate);

        orbMesh.rotation.x += 0.003;
        orbMesh.rotation.y += 0.005;

        renderer.render(scene,camera);
    }

    animate();
}