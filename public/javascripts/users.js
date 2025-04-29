window.addEventListener("load", loadHandler);
let submit = document.getElementById("sub");
let username = document.getElementById("username");
let password = document.getElementById("password");

function loadHandler(event) {
    submit.addEventListener("click", async function (event) {
        event.preventDefault();
        const response = await login();
        if (response) {
            window.location.href= "/trainer";
        } else {
            console.error('Login failed:');
        }
    });
}

function addFavorites() {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", responseReceivedHandler);
    xhr.responseType = "";
    xhr.open("POST", "/favs");
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded" );
    xhr.send(`user=${user}`);
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