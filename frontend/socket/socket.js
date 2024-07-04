import { io } from "socket.io-client";

const IP_EDUROAM = "149.43.107.35";
const IP = "192.168.1.233";
const AWS_ADRESS = "http://ec2-3-19-221-76.us-east-2.compute.amazonaws.com";
const PORT = "4000";

const setConnection = () => {
  const socket = io(`${AWS_ADRESS}:${PORT}`);
  return socket;
};

export default setConnection;
