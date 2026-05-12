import type { ErrorRequestHandler } from "express";
import ApiError from "../utils/api-error.utils";
import { ZodError } from "zod";

const globalErrorHandler:ErrorRequestHandler = (err, req, res, next)=>{
  // own apiError
  if(err instanceof ApiError){
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    })
  }

  // zod error
  if(err instanceof ZodError){
    return res.status(400).json({
      success: false,
      message: err.message || "validation error",
      errors: err.issues
    })
  }

  // unexpected error
  console.error(err)
  return res.status(500).json({
    success: false,
    message: "internal server error"
  })
}


export default globalErrorHandler;
