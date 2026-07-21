import express from 'express';
import { type Application, type Response } from "express";
import helmet from 'helmet';
import ApiResponse from './utils/api-response.utils';
import authRoute from  './modules/auth/auth.route'
import cookieParser from 'cookie-parser';
import {rateLimit} from 'express-rate-limit';
import cors from 'cors';
import globalErrorHandler from './middleware/global-error.middleware';
import pollsRoute from './modules/polls/polls.route';
import responseRoute from './modules/response/response.route';

export function createApplication() {
  const app: Application = express();


  const limiter = rateLimit({
    windowMs: 1000 * 60 * 15, //15min
    limit: 100,
    message: "too many request from your IP, please retry after sometime"
  })

  // middlewares
  app.use(helmet()); //set safty header for http request
  app.use(limiter);
  app.use(express.json({limit: '16kb'}));
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.use(cors({
    origin: [
      "http://localhost:5173",
    ],
    credentials: true
  }))
  // app.options("*", cors());


  // routes
  app.use('/api/auth', authRoute);
  app.use('/api/polls', pollsRoute);
  app.use('/api/response', responseRoute);


  app.get('/health', (_, res: Response)=>{
    ApiResponse.ok(res, "server is healthy", {healthy: true})
  })

  
  app.use(globalErrorHandler);
  
  return app;
}