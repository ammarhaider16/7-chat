import { io } from "socket.io-client";

const IP_EDUROAM = "149.43.107.35";
const IP = "192.168.1.233"

const PORT = "4000";

const setConnection = () => {
    const socket = io(`http://${IP_EDUROAM}:${PORT}`);
    return socket;
}

export default setConnection;
