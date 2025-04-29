window.addEventListener("load", loadHandler);
const sb = document.getElementById("sortBy");
const order = document.getElementById("order");
const limit = document.getElementById("limit");
const search = document.getElementById("search");
const tb = document.getElementById("toggleButton");
const trainer = document.getElementById("trainer");
const typeList = [];
const info = document.getElementById("container");
let favorites = 0;
let data = null;

async function loadHandler(event) {
    const response = await getStatus();
    if (response.ok) {
        data = await response.json();
        document.getElementById("form").style.visibility = 'hidden';
        tb.style.visibility = 'visible';
        tb.addEventListener("click", toggleFav );
        trainer.innerHTML = `Hi, ${data.user.username}! Welcome to The world of Pokemon!`;
    } else {
        document.getElementById("form").style.visibility = 'visible';
        tb.style.visibility = 'hidden';
        document.getElementById("trainer").innerHTML = "Please log in to continue.";
    }
    sb.addEventListener("change", reOrder);
    order.addEventListener("change", reOrder);
    limit.addEventListener("change", reOrder);
    document.getElementById("popupbutton").addEventListener("mouseover", popup);
    for (let i = 0; i < 18; i++) {
        typeList.push(document.getElementById("type" + i));
    }
    // Execute a function when the user presses a key on the keyboard
    document.addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard
        if (event.key === "Enter") {
            // Cancel the default action, if needed
            event.preventDefault();
            reOrder();
        }
    });
    //inital call
    reOrder();
};

function toggleFav() {
    if (favorites == 1)  {
        tb.innerHTML = "Left Click to add Favorites";
        favorites = 0;
    } else {
        tb.innerHTML = "Left Click to show dex";
        favorites = 1;
    }
    reOrder();
}

function reOrder() {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", responseReceivedHandler);

    let filter = 0;
    for (let i = 0; i < typeList.length; i++) {
        if (typeList[i].checked) {
            filter += Math.pow(2, i);
        }
    }

    let sortBy = sb.value;
    let ord = order.value;
    let lim = limit.value;
    let sea = search.value;

    xhr.responseType = "";
    xhr.open("POST", "/search");
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded" );
    xhr.send(`sort=${sortBy}&limit=${lim}&order=${ord}&search=${sea}&filter=${filter}&fav=${favorites}`);
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

function popup() {
    var popwindow = document.getElementById("checkBundle");
    if (popwindow.style.display === "none") {
        popwindow.style.display = "block";
    } else {
        popwindow.style.display = "none";
    }
};

function addToFavorites(pid) {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", responseReceivedHandler);
    xhr.responseType = "";
    xhr.open("POST", "/addToFavorites");
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded" );
    xhr.send(`pid=${pid}&user=${data.user.username}`);
}