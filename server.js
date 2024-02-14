const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

const clients = new Set();

server.on('connection', (socket) => {
    let userName;
    let userColor;

    socket.on('message', (message) => {
        const data = JSON.parse(message);
        const clientMessage = data.message;

        if (!userName) {
            userName = clientMessage;
            userColor = data.userColor;
            clients.add({ socket, userName, userColor });

            const welcomeMessage = {
                message: `Добро пожаловать, ${userName}! В чате уже присутствуют: ${Array.from(clients).map(c => c.userName).join(', ') || 'Вы первый в чате'}.`,
                userName: 'Система'
            };

            socket.send(JSON.stringify(welcomeMessage));

            const newUserMessage = {
                message: `${userName} присоединился к нам.`,
                userName: 'Система'
            };

            clients.forEach(client => {
                if (client !== socket) {
                    client.socket.send(JSON.stringify(newUserMessage));
                }
            });

        } else {
            clients.forEach((client) => {
                if (client.socket.readyState === WebSocket.OPEN) {
                    client.socket.send(JSON.stringify({ message: `${userName}: ${clientMessage}`, userName, userColor }));
                }
            });
        }
    });

    socket.on('close', () => {
        if (userName) {
            clients.delete({ socket, userName, userColor });

            const leaveMessage = {
                message: `${userName} нас покинул.`,
                userName: 'Система'
            };

            clients.forEach(client => {
                client.socket.send(JSON.stringify(leaveMessage));
            });
        }
    });
});
