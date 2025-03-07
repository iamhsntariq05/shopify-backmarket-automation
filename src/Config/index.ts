
import dotenv from 'dotenv';
dotenv.config();

export const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY || '';
export const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET || '';
export const SHOPIFY_API_TOKEN = process.env.SHOPIFY_API_TOKEN || '';
export const SHOPIFY_SHOP_NAME = process.env.SHOPIFY_SHOP_NAME || '';
export const BACKMARKET_API_KEY = process.env.BACKMARKET_API_KEY || '';
export const BACKMARKET_CREDENTIAL = Buffer.from(`${process.env.BACKMARKET_EMAIL}:${process.env.BACKMARKET_PASSWORD}`).toString('base64');
export const BACKMARKET_API_URL = process.env.BACKMARKET_API_URL ||'';
export const SHOPIFY_API_URL = process.env.SHOPIFY_API_URL || '';

export const BACKMARKET_HEADERS = {
    Authorization: `Basic ${BACKMARKET_CREDENTIAL}`,
    Accept: 'application/json',
    'Accept-Language': 'fr-fr',
    'Content-Type': 'application/json',
  };
  export const SHOPIFY_HEADERS = {
    "X-Shopify-Access-Token":  SHOPIFY_API_TOKEN,
    "Content-Type": "application/json",
  };



