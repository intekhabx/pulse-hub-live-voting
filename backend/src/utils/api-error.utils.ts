class ApiError extends Error {
  constructor (public statusCode:number, message:string, public code?: string){
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  public static unAuthorized( message="UNAUTHORIZED", code?: string){
    return new ApiError(401, message, code);
  }

  public static notFound( message="NOT-FOUND", code?: string){
    return new ApiError(404, message, code);
  }
  
  public static forbidden( message="FORBIDDEN", code?: string){
    return new ApiError(403, message, code);
  }

  public static badRequest( message="BADREQUEST", code?: string){
    return new ApiError(400, message, code);
  }
  
  public static conflict( message="CONFLICT", code?: string){
    return new ApiError(409, message, code);
  }

  public static tooManyRequests( message = "Too many requests", code?: string){
    return new ApiError(429, message, code);
  }
  
}

export default ApiError;
