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