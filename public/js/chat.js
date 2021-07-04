
let user = null;
let socket = null;


const txtUid = document.querySelector('#txtUid');
const txtMsg = document.querySelector('#txtMsg');
const ulUsers = document.querySelector('#ulUsers');
const ulMessages = document.querySelector('#ulMessages');
const btnLogout = document.querySelector('#btnLogout');
const ulPrivateMsg = document.querySelector('#ulPrivateMsg');

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

txtMsg.addEventListener('keyup', ({ keyCode }) => {
    const message = txtMsg.value;
    const uid = txtUid.value;
    if (keyCode !== 13) {
        return;
    } else if (message.length === 0) {
        return
    };

    socket.emit('send-msg', { message, uid });
    txtMsg.value = '';
})

const drawUsers = (users = []) => {

    let usersHtml = '';
    users.forEach(({ name, uid }) => {

        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success">${name}</h5>
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>
        `
    })

    ulUsers.innerHTML = usersHtml;
}

const drawMessages = (messages = []) => {

    let messagesHtml = '';

    messages.forEach(({ name, msg }) => {

        messagesHtml += `
            <li>
                <p>
                    <span class="text-primary">${name}: </span>
                    <span>${msg}</span>
                </p>
            </li>
        `
    })

    ulMessages.innerHTML = messagesHtml;
}

const drawPrivate = (msgInfo = {}) => {

    let messagesHtml = `
            <li>
                <p>
                    <span class="text-danger">De: ${msgInfo.from}: </span>
                    <span>${msgInfo.message}</span>
                </p>
            </li>`


    ulPrivateMsg.innerHTML = messagesHtml;
}

const connectSocket = async () => {

    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => { console.log('socket online'); })

    socket.on('disconnect', () => {
        console.log('disconnect');
    })

    socket.on('recive-msg', (payload) => {
        drawMessages(payload)
    })

    socket.on('active-users', drawUsers)

    socket.on('private-msg', (payload) => {
        drawPrivate(payload);
    })


}

main();
