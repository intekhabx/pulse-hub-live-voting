import ApiError from "../../utils/api-error.utils";
import ApiResponse from "../../utils/api-response.utils";
import asyncHandler from "../../utils/async-handler.middleware";
import type {Request, Response} from "express";
import type { IContact } from "./contact.model";
import contactModel from "./contact.model";



export const createMessage = asyncHandler( async(req: Request, res: Response) => {
  // step:1 - extract the data from body
  const {name, email, subject, message}: IContact = req.body;

  // step:2 - create a message in the db
  const createdMessage = await contactModel.create({
    name,
    email,
    subject,
    message,
  });

  if(!createdMessage){
    throw ApiError.internalServerError("Internal Server Error, Retry after sometime");
  }

  ApiResponse.created(res, "Message sent successfully");
})
