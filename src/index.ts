import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import Shopify from 'shopify-api-node';
import dotenv from 'dotenv';
import routes from './Routes'
import fulfillmentRoutes from './Routes/';

// import { notFoundHandler } from './Middleware'


dotenv.config();

const app: Application = express();
app.use(cors());
app.use(bodyParser.json());
// app.use(fulfillmentRoutes);


export const shopify = new Shopify({
    shopName: process.env.SHOPIFY_STORE_NAME as string,
    apiKey:  process.env.SHOPIFY_API_KEY as string,
    password: process.env.SHOPIFY_PASSWORD as string
  });

app.use('/BM', routes)
// app.use(notFoundHandler);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
