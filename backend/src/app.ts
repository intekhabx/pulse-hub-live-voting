import express from 'express';
import { type Application, type Request, type Response } from "express";
import helmet from 'helmet';


export function createApplication() {
  const app: Application = express();

  // middlewares
  app.use(helmet()); //set safty header for http request
  app.use(express.json({limit: '16kb'}));


  // routes
  app.get('/health', (req: Request, res: Response)=>{
    res.status(200).json({healthy: true});
  })

  
  return app;
}