import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './Routes'
import {notFoundErrorHandle} from './Middleware/'

dotenv.config();

const app: Application = express();
app.use(cors());
app.use(bodyParser.json());



  app.use('/BM', routes)
  app.get("/", (req: any, res: any) => res.send("API is running..."));
  
  app.use('*', notFoundErrorHandle);

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
