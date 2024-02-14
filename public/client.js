document.addEventListener("DOMContentLoaded", function () {
  const socket = new WebSocket("ws://localhost:8080");
  const chatMessages = document.getElementById("chat-messages");
  const messageInput = document.getElementById("message-input");
  const sendButton = document.getElementById("send-button");

  let userColor;

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    const message = data.message;
    const userName = data.userName;

    const messageElement = document.createElement("div");
    messageElement.style.color = userColor;
    messageElement.textContent = `${userName}: ${message}`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  sendButton.addEventListener("click", function () {
    const message = messageInput.value.trim();
    if (message) {
      socket.send(JSON.stringify({ message, userColor }));
      messageInput.value = "";
    }
  });

  messageInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      sendButton.click();
    }
  });

  // Генерируем случайный цвет при подключении
  userColor = getRandomColor();
});
