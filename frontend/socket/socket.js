import { io } from "socket.io-client";

const IP_EDUROAM = "149.43.107.35";
const IP = "192.168.1.233";
const PORT = "4000";
const LOCAL_ADDRESS = `http://${IP_EDUROAM}:${PORT}`;

const AWS_ADRESS =
  "http://7-chat-env2-env.eba-zpjcegve.us-east-2.elasticbeanstalk.com";

const setConnection = () => {
  const socket = io(`${LOCAL_ADDRESS}`);
  return socket;
};

export default setConnection;
