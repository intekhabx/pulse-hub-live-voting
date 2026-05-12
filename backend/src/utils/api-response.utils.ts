import { type Response } from "express";

class ApiResponse {
  public static created<Tdata>(res:Response, message:string, data:Tdata | null = null){
    res.status(201).json({
      success: true,
      message,
      data,
    })
  }

  public static ok<Tdata>(res: Response, message:string, data:Tdata | null = null){
    res.status(200).json({
      success: true,
      message,
      data
    })
  }
}

export default ApiResponse;
