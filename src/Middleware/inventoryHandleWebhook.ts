import { Request, Response,NextFunction } from 'express';
import backmarketService from '../Services/backMarketService';

//     export const handleShopifyFulfillment = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {

//     try {
//         console.log("🚀 Shopify Fulfillment Webhook Received:", req.body);

//         const { order_id, fulfillment_status, tracking_number } = req.body;

//         if (!order_id ||  !tracking_number?.length) {
//              res.status(400).json({ success: false, message: "Invalid fulfillment data" });
//         }

//         // Update BackMarket with tracking info
//         await backmarketService.updateOrderTracking(order_id, tracking_number[0]);

//         console.log(`✅ Order ${order_id} updated in BackMarket with tracking ${tracking_number[0]}`);

//        return res.status(200).json({ success: true, message: "Fulfillment processed" });
//     } catch (error) {
//         console.error("❌ Error processing Shopify fulfillment:", error);
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// };


// export const handleShopifyFulfillment = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     console.log("📦 Shopify fulfillment webhook received:", req.body);

//     // Extract necessary data from Shopify webhook payload
//     const { order_id, tracking_number } = req.body;

//     if (!order_id ||!tracking_number) {
//       res.status(400).json({
//         success: false,
//         message: "Invalid webhook payload. Missing required fields.",
//       });

//       // return;
//     }
//     await backmarketService.updateOrderTracking(order_id, tracking_number);
//     res.status(200).json({
//       success: true,
//       message: "✅ Order fulfillment processed successfully.",
//     });
//   } catch (error) {
//     console.error("❌ Error processing fulfillment webhook:", error);
//     next(error);
//   }
// };

// export const handleShopifyOrderFulfilled = async (req: Request, res: Response) => {
//   try {

//       const { id, fulfillment_status, fulfillments } = req.body;

//       if (fulfillment_status === 'fulfilled' && fulfillments.length > 0) {
//           const trackingNumber = fulfillments[0]?.tracking_number;
//           const trackingUrl = fulfillments[0]?.tracking_url;

//           if (!trackingNumber || !trackingUrl) {
//                res.status(400).json({ error: "Missing tracking details in fulfillment." });
//           }

//           // Update order status in BackMarket
//           await backmarketService.updateOrderTracking(id, trackingNumber, trackingUrl);

//            res.status(200).json({ message: "✅ Order marked as shipped in BackMarket" });
//       }

//       res.status(200).json({ message: "No action required." });
//   } catch (error) {
//       console.error("❌ Error processing Shopify fulfillment webhook:", error);
//       res.status(500).json({ error: "Failed to process fulfillment webhook." });
//   }
// };
