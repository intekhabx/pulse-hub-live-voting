class ApiError extends Error {
  constructor (public statusCode:number, message:string){
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  public static unAuthorized( message="UNAUTHORIZED"){
    return new ApiError(401, message);
  }

  public static notFound( message="NOT-FOUND"){
    return new ApiError(404, message);
  }
  
  public static forbidden( message="FORBIDDEN"){
    return new ApiError(403, message);
  }

  public static badRequest( message="BADREQUEST"){
    return new ApiError(400, message);
  }
  
  public static conflict( message="CONFLICT"){
    return new ApiError(409, message);
  }
}

export default ApiError;
