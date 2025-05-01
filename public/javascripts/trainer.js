window.addEventListener("load", loadHandler);
let trainer = document.getElementById("trainerName");
const info = document.getElementById("info");  
const logout = document.getElementById("logout");
const teams = document.getElementById("team");
var data = null; 

async function loadHandler(event) {
    trainer.innerHTML = "Loading...";
    logout.addEventListener("click", logoutHandler);
    teams.addEventListener("click", teamCreate);
    const response = await getStatus();
    if (response.ok) {
        data = await response.json();
        console.log(data);
        trainer.innerHTML = `Hi, ${data.user.username}! Welcome to The world of Pokemon!`;
    }
    addTeam();
}

function teamCreate() {
    window.location.href = "/teambuilder";
}

function logoutHandler(event) {
    event.preventDefault();
    localStorage.removeItem('token');
    window.location.href = "/";
}

function addTeam() {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", responseReceivedHandler);
    console.log("Adding teams...");
    
    xhr.responseType = "";
    xhr.open("POST", "/getTeams");
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded" );
    xhr.send(`user=${data.user.username}`);
}