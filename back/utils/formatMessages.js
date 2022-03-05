const moment = require("moment");

function formatMyMessage(username, text) {
  return {
    username,
    text,
    time: moment().format("h:mm a"),
  };
}

module.exports = { formatMyMessage };
