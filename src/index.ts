import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import orderRoutes from './Routes/orderRoutes';
import inventoryRoutes  from './Routes/inventoryRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/orders', orderRoutes);
app.use('/inventory', inventoryRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
