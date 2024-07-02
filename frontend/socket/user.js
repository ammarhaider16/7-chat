import setConnection from "./socket.js";
export const sendUserID = (userID) => {
    const socket = setConnection()
    socket.emit('New User', userID)
    return socket
}

