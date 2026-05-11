import mongoose from "mongoose";

const dbConnection = async()=>{
  try {
    const databaseUri = process.env.MONGODB_URI;
    if(!databaseUri){
      console.error("Error: mongoDb uri is not defined in env variable")
      process.exit(1);
    }

    const conn = await mongoose.connect(databaseUri);
    console.log(`DATABASE CONNECTED: ${conn.connection.host}`);
  } 
  catch (err: any) {
    console.error("DATABASE CONNECTION failed", err.message)
    process.exit(1)
  }
}

export default dbConnection;