
let user = null;
let socket = null;

const url = window.location.hostname.includes('localhost')
    ? 'http://localhost:8080/api/auth/'
    : 'https://jp-nodejs-rest-server.herokuapp.com/api/auth/';

const validateJwt = async () => {
    const token = localStorage.getItem('token') || '';

    if (token.length < 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor')
    }
    const resp = await fetch(url, {
        headers: { 'x-token': token }
    });
    const { user: userDb, token: tokenDB } = await resp.json();
    localStorage.setItem('token', tokenDB);
    user = userDb;
    document.title = user.name;

    await connectSocket();
}

const main = async () => {
    await validateJwt();
}

const connectSocket = async () => {

    const socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });


}

main();
