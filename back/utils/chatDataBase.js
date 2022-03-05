const userDb = [];

function saveNewUser(user) {
  userDb.push(user);
}
//hubo un crash de un user q no estaba en la db cuando recien ingresó, será xq envie muy rapido el msje?
function findUser({ id }) {
  console.log(id, "adentro de find users", userDb);
  return userDb.find((user) => user.id === id);
}
function removeFromChat(socket) {
  const index = userDb.findIndex((user) => user.id === socket.id);
  if (index !== -1) {
    console.log(index), "ver indexxxxxxxxxxxxxxxxxx";
    return userDb.slice(index, 1)[0];
  } else {
    return false;
  }
}
module.exports = { findUser, saveNewUser, removeFromChat };
