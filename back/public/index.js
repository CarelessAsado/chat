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

/*---------INITIALIZE SOCKET.IO---------------------------*/
const msjesAdmin = "msgAdmin";
const socket = io();

/*------------IF NO USER, REDIRECT TO RECEPTION ROOM------------------*/
window.addEventListener("load", () => {
  if (!userName || !chatRoom) {
    window.location.replace("/chat");
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
  }
  msjesDOM.appendChild(msje);
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
  //scrolleo automatico CORREGIR
  msjesDOM.scrollTop = msjesDOM.scrollHeight;
}
function renderChatRoomStats(data) {
  console.log(data, "ver si es un objeto con length");
  let roomLinks = "";
  for (const key in data) {
    const url = "/?userName=" + userName + "&chatRoom=" + key;

    roomLinks +=
      '<li class="roomChat"><a href=' +
      url +
      ">" +
      key +
      "<i class='fas fa-users'><span>" +
      data[key] +
      "</span></i></a> </li>";
  }
  return (chatRoomsContainer.innerHTML = roomLinks);
}
