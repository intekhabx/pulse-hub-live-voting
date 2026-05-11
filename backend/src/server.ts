import 'dotenv/config';
import { createApplication } from './app';
import dbConnection from './config/db.config';


async function main(){
  try {
    await dbConnection();

    const PORT:number = Number(process.env.PORT) || 3000;
    const app = createApplication();

    app.listen(PORT, ()=>{
      console.log(`Server is listening on http://localhost:${PORT}`);
    })
  } 
  catch (err:any) {
    console.error(err.message)
    process.exit(1);
  }
}

main();