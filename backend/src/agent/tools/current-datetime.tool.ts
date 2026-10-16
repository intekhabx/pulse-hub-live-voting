import { tool } from "langchain";
import * as z from "zod";



const getCurrentDateAndTime = tool(
  () => {
    
    const obj =  {
      currentDateTime: new Date().toLocaleString("sv-SE", {timeZone: "Asia/Kolkata"}),
      timezone: "Asia/Kolkata"
    };

    console.log("Date&Time", obj);
    return obj;
  },
  {
    name: "get_current_datetime",
    description: "Returns the current date and time in ISO format, with the timezone set to Asia/Kolkata (IST).",
    schema: z.object({}),
  }
)

export default getCurrentDateAndTime;
