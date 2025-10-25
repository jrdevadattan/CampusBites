import { Router } from 'express'
import auth from '../middleware/auth.js'
import { CashOnDeliveryOrderController, getOrderDetailsController } from '../controllers/order.controller.js'

const orderRouter = Router()

orderRouter.post("/cash-on-delivery",auth,CashOnDeliveryOrderController)
// Online payment and webhook endpoints removed — using Cash on Delivery only
orderRouter.get("/order-list",auth,getOrderDetailsController)

export default orderRouter