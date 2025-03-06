import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './Routes'
// import { notFoundHandler } from './Middleware'


dotenv.config();

const app: Application = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/BM', routes)
// app.use(notFoundHandler);


// app.use('/orders', orderRoutes);
// app.use('/inventory', inventoryRoutes);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
