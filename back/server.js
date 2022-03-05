const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { formatMyMessage } = require("./utils/formatMessages");
const {
  findUser,
  saveNewUser,
  removeFromChat,
} = require("./utils/chatDataBase");
const port = process.env.PORT || 3000;
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/*--------------------------------------------------*/
app.get("/chat", (req, res) => {
  res.sendFile(__dirname + "/public/chat.html");
});
app.post("/chat", (req, res) => {
  console.log(req.body, "username");
  res.redirect("/");
});

io.on("connection", (socket) => {
  const admin = "Admin";
  const msjesAdmin = "msgAdmin";
  socket.on("joinRoom", function ({ userName: username, chatRoom }) {
    socket.username = username;
    console.log(username, 000, "has connected");
    /*------save user that joined in Db---------------*/
    saveNewUser({ username, id: socket.id, chatRoom });
    socket.join(chatRoom);
    /*---------------------------------MSJES ADMIN DE RECIBIDA AL USER Y A LOS DEMAS----------------*/
    //socket.emit al individual user
    socket.emit(
      msjesAdmin,
      formatMyMessage(admin, `Bienvenido ${socket.username}!`)
    );

    //to everybody but the user
    socket.broadcast
      .to(chatRoom)
      .emit(
        msjesAdmin,
        formatMyMessage(admin, `${socket.username} se conectó!`)
      );
  });
  //io.emit TO EVERYBODY

  socket.on("disconnect", () => {
    const userRemoved = removeFromChat(socket);
    if (userRemoved) {
      return socket.broadcast
        .to(userRemoved.chatRoom)
        .emit(
          msjesAdmin,
          formatMyMessage(admin, `${userRemoved.username}se fue del chat.`)
        );
    } else {
      socket.broadcast.emit(
        msjesAdmin,
        formatMyMessage(
          admin,
          `Socket id ${socket.id} se fue del chat, pero no estaba en la base de datos, ver dsp si`
        )
      );
    }
  });
  //LISTEN FOR CHAT INPUT
  socket.on("chatMsg", (msg) => {
    //creo q el agregarle properties al socket sirve solo para ese msje, no es q queda fijo p/c/msje posterior. Lo ideal entonces, seria guardar el msje en la db con el socket id dsp en cada msje busco la id y encuentro el username
    console.log(msg, socket.id);
    const user = findUser(socket);
    //ver porque ACA EL USER SALE NULL, creo q tiene q ver con usar la memoria de la app
    if (user) {
      socket.broadcast
        .to(user.chatRoom)
        .emit("chatMsg", formatMyMessage(user.username, msg));
    }
  });
});

server.listen(port, () => {
  console.log("listening on http://localhost:" + port);
});
