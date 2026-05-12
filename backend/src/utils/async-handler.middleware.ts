import type { NextFunction, Request, Response } from "express";

function asyncHandler(fn: Function){
  return (req: Request, res: Response, next: NextFunction)=>{
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

export default asyncHandler;
