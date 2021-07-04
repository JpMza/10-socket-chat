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
    io.emit('recive-msg', chat.last10)
    io.emit('active-users', chat.usersArr);

    //Connect to a special room
    socket.join(user.id); //connected to global, socket.id, user.id

    socket.on('disconnect', () => {
        chat.disconnectUser(user.id)
        io.emit('active-users', chat.usersArr);
    });

    socket.on('send-msg', ({ message, uid }) => {

        if (uid) {
            socket.to(uid).emit('private-msg', { from: user.name, message })
        } else {
            chat.sendMessage(user.uid, user.name, message);
            io.emit('recive-msg', chat.last10);
        }
    })
}

module.exports = socketController;