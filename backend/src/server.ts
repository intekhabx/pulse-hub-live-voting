import 'dotenv/config';
import http from 'node:http';
import {Server} from 'socket.io';
import { createApplication } from './app';
import dbConnection from './config/db.config';
import "./workers/pollExpiry.worker";
import { initializeSocket } from './socket/socket';


export const io = new Server();

async function main(){
  try {
    await dbConnection();

    const PORT:number = Number(process.env.PORT) || 3000;
    const app = createApplication();

    const server = http.createServer(app);
    io.attach(server, {
      cors: {
        origin: process.env.FRONTEND_BASE_URL || "*"
      }
    });

    initializeSocket(io);

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