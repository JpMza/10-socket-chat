const myForm = document.querySelector('form');

const url = window.location.hostname.includes('localhost')
    ? 'http://localhost:8080/api/auth/'
    : 'https://jp-nodejs-rest-server.herokuapp.com/api/auth/';


myForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = {};
    for (const el of myForm.elements) {
        if (el.namespaceURI.length > 0) {
            formData[el.name] = el.value
        }
    }
    fetch(url + 'login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(resp => resp.json())
        .then(({ msg, token }) => {
            if (msg) {
                return console.error(msg);
            }
            localStorage.setItem('token', token);
            window.location = 'chat.html';
        }).catch(e => console.log(e))
})

function onSignIn(googleUser) {
    //var profile = googleUser.getBasicProfile();

    var id_token = googleUser.getAuthResponse().id_token;
    const data = { id_token }

    fetch(url + 'google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(resp => resp.json())
        .then(({ token }) => {
            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })
        .catch(console.log)
}
