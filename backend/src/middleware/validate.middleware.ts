import type { Request, Response, NextFunction } from "express";
import { z } from 'zod'

function validate(dtoSchema: z.ZodType){
  return (req:Request, res:Response, next:NextFunction)=>{
    const result = dtoSchema.safeParse(req.body);

    if(!result.success){
      res.status(400).json({
        success: false,
        error: result.error.issues
      })
    }

    req.body = result.data; //sanitized data
    next();
  }
}

export default validate;
