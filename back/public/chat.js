/*---------GET USERNAME & CHATROOM ----------------*/
let params = new URL(document.location).searchParams;
const userName = params.get("userName");
const chatRoom = params.get("chatRoom");
console.log(userName, chatRoom, "VER SI SE MANDA BIEN");
const preloader = document.querySelector(".preloader");
let usersOnlineContainer = document.getElementById("usersOnlineContainer");
const msjesDOM = document.querySelector(".msjesEnviados");
const chatForm = document.getElementById("chatForm");
const textArea = document.getElementById("inputChat");
const chatRoomsContainer = document.getElementById("chatRoomsContainer");
const newMsgSound = document.getElementById("newmsg");

/*---------INITIALIZE SOCKET.IO---------------------------*/
const msjesAdmin = "msgAdmin";
const socket = io();

/*------------IF NO USER, REDIRECT TO RECEPTION ROOM------------------*/
window.addEventListener("load", () => {
  if (!userName || !chatRoom) {
    window.location.replace("/");
  } else {
    //sacar preloader
    preloader.classList.add("animate");
    //-------------JOIN ROOM
    socket.emit("joinRoom", { userName, chatRoom });
    socket.on(msjesAdmin, (message) => {
      renderMessage(message, true, false);
    });
    socket.on("allUsersInChat", (data) => {
      console.log(
        data,
        "ver si alguno no se borra, x ahi si salgo rapido y entro en otro chat hay delay"
      );
      return renderUsersOnline(data);
    });
    /*------------------INPUT USERS -------------*/
    socket.on("chatMsg", (message) => renderMessage(message, false, false));
    /*-----------------INPUT OWN-------------------------------*/
    socket.on("ownMsg", (ownMessage) => renderMessage(ownMessage, false, true));
    //-----------Emit my own INPUT---------------------
    //Textarea does not submit on ENTER by default
    textArea.addEventListener("keypress", (e) => {
      if (e.which === 13) {
        submitInput();
      }
    });
    chatForm.addEventListener("submit", (e) => {
      submitInput(e);
    });
    /*-----------------------CHATROOM SECTION------------------------------*/
    socket.on("chatRoomStats", (data) => renderChatRoomStats(data));
  }
});

/*---------------------------------FUNCTIONS---------------------------------*/
/*---------------------------------FUNCTIONS---------------------------------*/
/*---------------------------------FUNCTIONS---------------------------------*/
/*---------------------------------FUNCTIONS---------------------------------*/
function changeTitleIfTabNotActive(string, admin) {
  if (admin) return;

  if (document.hidden && string) {
    try {
      newMsgSound.play();
      return (document.title = string);
    } catch (error) {
      console.log(error);
    }
  }
  document.title = "Chat";
}
function renderUsersOnline(data) {
  const arrWithoutUser = data.filter((i) => i.id !== socket.id);
  if (arrWithoutUser?.length > 0) {
    const allUsers = arrWithoutUser
      .map(
        (
          i
        ) => `<div class="userOnline"><i class="fas fa-user"><span class="onlineActiveBadge"></span></i>${i.username}</div>
                  `
      )
      .join(" ");
    return (usersOnlineContainer.innerHTML = allUsers);
  } else {
    return (usersOnlineContainer.innerHTML = `
              No hay usuarios online por el momento. &#128546;
            `);
  }
}
function renderMessage({ username, text, time }, admin, own) {
  const msje = document.createElement("div");
  msje.innerHTML = `<p class="metaInfo">${username} <span>${time}</span></p><p>${text}</p>`;
  msje.classList.add("msjeIndividual");
  if (admin) {
    msje.classList.add("MENSAJEADMIN");
  }
  if (own) {
    msje.classList.add("dcha");
    msjesDOM.appendChild(msje);
    changeTitleIfTabNotActive();
    return (msjesDOM.scrollTop = msjesDOM.scrollHeight);
  }
  msjesDOM.appendChild(msje);
  changeTitleIfTabNotActive("Nuevo mensaje...", admin);
}

function submitInput(e) {
  if (e) {
    e.preventDefault();
  }
  const newInput = textArea.value;
  socket.emit("chatMsg", newInput);
  //vacío input
  textArea.value = "";
  textArea.focus();
}
function renderChatRoomStats(data) {
  console.log(data, "ver si es un objeto con length");
  let roomLinks = "";
  for (const key in data) {
    const url = "/chat?userName=" + userName + "&chatRoom=" + key;
    const currentUserRoom = chatRoom === key && "currentRoom";

    roomLinks +=
      `<li class=roomChat id=${currentUserRoom}><a href=${url}>${key}` +
      "<i class='fas fa-users'><span>" +
      data[key] +
      "</span></i></a> </li>";
  }
  return (chatRoomsContainer.innerHTML = roomLinks);
}
