const Chat = require('../models/chat')
module.exports = io => {

    let users = {};

    io.on('connection', async (socket) => {

        console.log('a user connected ' + socket.id);

        setTimeout(() => {
            updateMensages()
        },5000)

        async function updateMensages() {
            let messages = await Chat.find({}).limit(8).sort('-created');
            io.sockets.emit('load old msgs', messages);
        }

        socket.on('new user', (data) => {
            if (data in users) {
                socket.emit('response NewUser', false)
            }
            else {
                socket.nickname = data;
                users[socket.nickname] = socket;
                socket.emit('response NewUser', true)
                updateNicknames();
            }
        });

        socket.on('send message', async (data, cb) => {

            var msg = data.trim();
            if (msg.substr(0, 3) === '/w ') {
                msg = msg.substr(3);
                var index = msg.indexOf(' ');
                if (index !== -1) {
                    var name = msg.substring(0, index);
                    var msg = msg.substring(index + 1);
                    if (name in users) {
                        users[name].emit('whisper', {
                            msg,
                            nick: socket.nickname
                        });
                    } else {
                        cb('Error! Enter a valid User');
                    }
                } else {
                    cb('Error! Please enter your message');
                }
            } else {
                updateMensages()
                var newMsg = new Chat({
                    msg,
                    nick: socket.nickname
                });
                await newMsg.save();

                io.sockets.emit('new message', {
                    msg,
                    nick: socket.nickname
                });
            }
        });


        function updateNicknames() {
            io.sockets.emit('usernames', Object.keys(users));
        }

        socket.on('disconnect', () => {
            console.log('user disconnected');
            if (!socket.nickname) return;
            delete users[socket.nickname];
            updateNicknames();

        });
    });
}