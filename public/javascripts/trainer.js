window.addEventListener("load", loadHandler);
let trainer = document.getElementById("trainerName");
const info = document.getElementById("info");  
const logout = document.getElementById("logout");
var data = null; 

async function loadHandler(event) {
    trainer.innerHTML = "Loading...";
    logout.addEventListener("click", logoutHandler);
    const response = await getStatus();
    if (response.ok) {
        data = await response.json();
        console.log(data);
        trainer.innerHTML = `Hi, ${data.user.username}! Welcome to The world of Pokemon!`;
    }
    addFavorites();
}

function logoutHandler(event) {
    event.preventDefault();
    localStorage.removeItem('token');
    window.location.href = "/";
}

function addFavorites() {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", responseReceivedHandler);
    console.log("Adding to favorites...");
    
    xhr.responseType = "";
    xhr.open("POST", "/favs");
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded" );
    xhr.send(`user=${data.user.username}`);
}

//stolen valor
function responseReceivedHandler() {
    //We received something that is healthy
    if (this.status === 200) {
        //Creating a new, empty div
        //Adding the response to this new div
        info.innerHTML = this.response;
        //Appending the div to the subInfo tag
    } else {
        //Handling an unsuccessful database lookup
        info.innerHTML = "Query error";
    }
}
