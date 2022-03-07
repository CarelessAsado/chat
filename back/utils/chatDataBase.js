const userDb = [];
const chatRooms = ["Rodri", "Erotica"];

function chatRoomStats() {
  const stats = chatRooms.reduce((final, chatRoom) => {
    final[chatRoom] = 0;
    userDb.forEach((u) => {
      if (u.chatRoom === chatRoom) {
        final[chatRoom] += 1;
      }
    });
    return final;
  }, {});

  return stats;
}
function saveNewUser(user) {
  userDb.push(user);
}
//hubo un crash de un user q no estaba en la db cuando recien ingresó, será xq envie muy rapido el msje?
function findUser({ id }) {
  return userDb.find((user) => user.id === id);
}
function removeFromChat(socket) {
  const removedUser = userDb.find((i) => i.id === socket.id);

  const usersUpdated = userDb.filter((user) => user.id !== socket.id);
  userDb.splice(0);

  userDb.push(...usersUpdated);

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
