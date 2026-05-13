import 'dotenv/config';
import http from 'node:http';
import {Server} from 'socket.io';
import { createApplication } from './app';
import dbConnection from './config/db.config';


async function main(){
  try {
    await dbConnection();

    const PORT:number = Number(process.env.PORT) || 3000;
    const app = createApplication();

    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: "*"
      }
    });

    io.on("connection", (socket)=>{
      console.log("a socket is connected", socket.id);

      socket.on("disconnect", ()=>{
        console.log("disconnected one socket", socket.id)
      })
    })

    server.listen(PORT, ()=>{
      console.log(`Server is listening on http://localhost:${PORT}`);
    })
  } 
  catch (err:any) {
    console.error(err.message)
    process.exit(1);
  }
}

main();