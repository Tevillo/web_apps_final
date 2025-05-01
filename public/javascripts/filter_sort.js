window.addEventListener("load", loadHandler);
const sb = document.getElementById("sortBy");
const order = document.getElementById("order");
const limit = document.getElementById("limit");
const search = document.getElementById("search");
const trainer = document.getElementById("trainerpage");
const typeList = [];
const info = document.getElementById("container");
let teambuilder = 0;
let teams = [];
let data = null;

if (window.location.href.includes("teambuilder")) {
    teambuilder = 1;
}

async function loadHandler(event) {
    const response = await getStatus();
    if (response.ok) {
        data = await response.json();
        document.getElementById("form").style.visibility = 'hidden';
        trainer.style.visibility = 'visible';
        trainer.addEventListener("click", function() {window.location.href = "/trainer";});
    } else {
        trainer.style.visibility = 'hidden';
    }
    sb.addEventListener("change", reOrder);
    order.addEventListener("change", reOrder);
    limit.addEventListener("change", reOrder);
    document.getElementById("popupbutton").addEventListener("click", popup);
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

    xhr.responseType ="";
    xhr.open("POST", "/search");
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded" );
    xhr.send(`sort=${sortBy}&limit=${lim}&order=${ord}&search=${sea}&filter=${filter}&teambuilder=${teambuilder}`);


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
        popwindow.style.display = "flex";
    } else {
        popwindow.style.display = "none";
    }
};

function postTeam() {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", responseReceivedHandler);
    xhr.responseType = "";
    xhr.open("POST", "/addToTeam");
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded" );
    xhr.send(`teamname="blank"&pid1=${teams[0]}&pid2=${teams[1]}&pid3=${teams[2]}&pid4=${teams[3]}&pid5=${teams[4]}&pid6=${teams[5]}&user=${data.user.username}`);
    
    sleep(100).then(() => { window.location.href = "/trainer"; });
}

function addToTeams(pid) {
    teams.push(pid);
    if (teams.length > 5) {
        console.log("Team is full, sending to server...");
        postTeam();
    }
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
