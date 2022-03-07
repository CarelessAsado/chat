const userDb = [];
const chatRooms = ["Rodri", "Erotica"];

function chatRoomStats() {
  console.log(userDb, "CHATROOMSTATS INICIO");

  const stats = chatRooms.reduce((final, chatRoom) => {
    final[chatRoom] = 0;
    userDb.forEach((u) => {
      if (u.chatRoom === chatRoom) {
        final[chatRoom] += 1;
      }
    });
    return final;
  }, {});
  console.log(stats, "CHATROOMSTATS FIN");
  return stats;
}
function saveNewUser(user) {
  userDb.push(user);
}
//hubo un crash de un user q no estaba en la db cuando recien ingresó, será xq envie muy rapido el msje?
function findUser({ id }) {
  console.log(id, "adentro de find users", userDb);
  return userDb.find((user) => user.id === id);
}
function removeFromChat(socket) {
  const removedUser = userDb.find((i) => i.id === socket.id);
  console.log(userDb, "REMOVEFROMCHAT INICIO");
  const usersUpdated = userDb.filter((user) => user.id !== socket.id);
  userDb.splice(0);
  console.log(userDb, "REMOVEFROMCHAT INTERMEDIO");
  userDb.push(...usersUpdated);
  console.log(userDb, "REMOVEFROMCHAT FIN");
  return removedUser;
}
function findAllUsersOfARoom(chatRoom) {
  return userDb.map((user) => {
    if (user.chatRoom === chatRoom) {
      return user;
    }
  });
}
module.exports = {
  findUser,
  saveNewUser,
  removeFromChat,
  findAllUsersOfARoom,
  userDb,
  chatRoomStats,
};
