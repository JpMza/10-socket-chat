const { Socket } = require('socket.io');
const { checkJWT } = require('../helpers/jwt-generator');

const socketController = async (socket = new Socket()) => {
    //console.log(socket);
    const user =  await checkJWT(socket.handshake.headers['x-token']);
    if(!user){
        return socket.disconnect();
    }

    console.log('Usuario conectado:' + user.name);
}

module.exports = socketController;