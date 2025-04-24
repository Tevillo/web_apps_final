window.addEventListener("load", loadHandler);
const sb = document.getElementById("sortBy");
const order = document.getElementById("order");
let info = document.getElementById("container");

function loadHandler(event) {
    console.log("Load handling...");
    sb.addEventListener("change", reOrder);
    order.addEventListener("change", reOrder);
    reOrder();
}


function reOrder() {
    event.preventDefault();
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", responseReceivedHandler);

    let sortBy = sb.value;
    let ord = order.value;
    
    xhr.responseType = "";
    xhr.open("POST", "/search");
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded" );
    xhr.send(`sort=${sortBy}&limit=10&order=${ord}`);
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