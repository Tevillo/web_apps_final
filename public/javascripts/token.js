async function getStatus() {
    console.log("Getting status...");
    const token = localStorage.getItem('token');
    const response = await fetch('/status', {
        method: 'GET',
        headers: {
            'x-auth': token
        }
    });
    return response;
}

async function login() {
    const response = await fetch('/login', {
        method: 'POST',
        body: new URLSearchParams({
            username: username.value,
            password: password.value
        }),
    });

    if (response.ok) {
        const token = await response.json();
        localStorage.setItem('token', token.token);
        return true;
    }
    return false;
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