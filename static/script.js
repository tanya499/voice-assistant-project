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

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        75,
        1,
        0.1,
        1000
    );

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });

    renderer.setSize(180,180);

    const light1 = new THREE.PointLight(0x00ffff, 3);
    light1.position.set(5,5,5);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xff00ff, 3);
    light2.position.set(-5,-5,5);
    scene.add(light2);

    const geometry = new THREE.SphereGeometry(1.2, 128, 128);

    const material = new THREE.ShaderMaterial({

        uniforms: {
            time: { value: 0 }
        },

        vertexShader: `
            varying vec2 vUv;

            void main() {

                vUv = uv;

                vec3 pos = position;

                gl_Position =
                projectionMatrix *
                modelViewMatrix *
                vec4(pos,1.0);
            }
        `,

        fragmentShader: `
uniform float time;
varying vec2 vUv;

void main() {

    vec2 uv = vUv - 0.5;

    float r = length(uv);
    float angle = atan(uv.y, uv.x);

    float wave1 =
        sin(angle * 8.0 - time * 2.5);

    float wave2 =
        sin(r * 20.0 + time * 2.0);

    float wave3 =
        sin(angle * 12.0 + time * 1.8);

    vec3 pink =
        vec3(1.0, 0.25, 0.75);

    vec3 blue =
        vec3(0.15, 0.75, 1.0);

    vec3 purple =
        vec3(0.55, 0.25, 1.0);

    vec3 cyan =
        vec3(0.15, 1.0, 0.9);

    float mix1 =
        0.5 + 0.5 * wave1;

    float mix2 =
        0.5 + 0.5 * wave2;

    float mix3 =
        0.5 + 0.5 * wave3;

    vec3 colorA =
        mix(pink, blue, mix1);

    vec3 colorB =
        mix(purple, cyan, mix2);

    vec3 color =
        mix(colorA, colorB, mix3);

    float centerGlow =
        exp(-r * 7.0);

    color +=
        vec3(1.0, 1.0, 1.0)
        * centerGlow * 1.8;

    float outerGlow =
        exp(-r * 3.0);

    color +=
        vec3(0.2, 0.5, 1.0)
        * outerGlow * 0.8;

    color *= 1.25;

    float alpha =
        smoothstep(
            0.85,
            0.05,
            r
        );

    gl_FragColor =
        vec4(color, alpha);
}
`,
transparent: true
    });

    const orbMesh =
    new THREE.Mesh(
        geometry,
        material
    );

    scene.add(orbMesh);

    camera.position.z = 4;

    function animate(){

    requestAnimationFrame(animate);

    material.uniforms.time.value += 0.01;

    orbMesh.rotation.y += 0.0005;

    renderer.render(
        scene,
        camera
    );
}

animate();