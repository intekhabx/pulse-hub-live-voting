import { io } from "socket.io-client";

const connectWS = ()=>{
  const socket = io("http://localhost:5000");
  return socket;
}

export default connectWS;