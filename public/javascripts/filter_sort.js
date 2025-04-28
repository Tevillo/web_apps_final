window.addEventListener("load", loadHandler);
const sb = document.getElementById("sortBy");
const order = document.getElementById("order");
const limit = document.getElementById("limit");
const search = document.getElementById("search");
const typeList = [];
let info = document.getElementById("container");

function loadHandler(event) {
    console.log("Load handling...");
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


function reOrder() {
    event.preventDefault();
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", responseReceivedHandler);

    console.log("Reordering...");
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

    console.log(sea);

    xhr.responseType = "";
    xhr.open("POST", "/search");
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded" );
    xhr.send(`sort=${sortBy}&limit=${lim}&order=${ord}&search=${sea}&filter=${filter}`);
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
