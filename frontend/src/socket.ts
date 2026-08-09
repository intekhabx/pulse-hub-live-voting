import { io } from "socket.io-client";
import tokenStore from "./services/tokenStoreService";

const connectWS = ()=>{
  const socket = io( import.meta.env.VITE_API_URL || "http://localhost:5000", {
    autoConnect: false, //here we off the auto connect so we have to connect manually with socket.connect() or socketRef.current.connect() in my codebase

    auth: (cb) => ( //auth method give callback
      cb({token: tokenStore.getAccessToken()})
    )

  });

  return socket;
}

export default connectWS;
