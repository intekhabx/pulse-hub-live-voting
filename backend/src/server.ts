import 'dotenv/config';
import http from 'node:http';
import {Server} from 'socket.io';
import { createApplication } from './app';
import dbConnection from './config/db.config';
import { initializeSocket } from './socket/socket';
import "./workers/pollExpiry.worker";
import "./workers/unverifiedUserCleanUp.worker";
import { setupUnverifiedUserCleanupScheduler } from './schedulers/unverifiedUserCleanUp.scheduler';


export const io = new Server();

async function main(){
  try {
    await dbConnection();

    await setupUnverifiedUserCleanupScheduler(); //scheduler that runs everyday to delete unverified user in mongodb

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