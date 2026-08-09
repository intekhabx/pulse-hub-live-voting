import { Socket } from "socket.io";
import { verifyAccessToken } from "../utils/jwt-token.utils";

export function socketAuthMiddleware(socket: Socket, next: (err?: Error) => void) {
  try {
    // step:1 - the token is coming from the frontend
    const token = socket.handshake.auth?.token; //auth.token we send from frontend socket file

    if (!token) {
      return next(new Error("Authentication required"));
    }

    //step:2 - verify that accesstoken comes from frontend
    const decoded = verifyAccessToken(token);

    // step:3 - add some user details in the socket
    socket.data.user = decoded;

    next();
  } 
  catch (error) {
    next(new Error("Invalid or expired token"));
  }
}