const { Socket } = require('socket.io');
const { checkJWT } = require('../helpers/jwt-generator');
const { ChatMessages } = require('../models');

const chat = new ChatMessages()

const socketController = async (socket = new Socket(), io) => {
    const user = await checkJWT(socket.handshake.headers['x-token']);
    if (!user) {
        return socket.disconnect();
    }

    chat.connectUser(user);
    io.emit('active-users', chat.usersArr);


    socket.on('disconnect', () => {
        chat.disconnectUser(user.id)
        io.emit('active-users', chat.usersArr);
    });

    socket.on('send-msg', ({ message, uid }) => {
        chat.sendMessage(user.uid, user.name, message);
        io.emit('recive-msg', chat.last10);
    })
}

module.exports = socketController;