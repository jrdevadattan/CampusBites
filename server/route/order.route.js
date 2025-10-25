import { Router } from 'express'
import auth from '../middleware/auth.js'
import { CashOnDeliveryOrderController, getOrderDetailsController, getAllOrdersController } from '../controllers/order.controller.js'
import { admin } from '../middleware/Admin.js'

const orderRouter = Router()

orderRouter.post("/cash-on-delivery",auth,CashOnDeliveryOrderController)
// Online payment and webhook endpoints removed — using Cash on Delivery only
orderRouter.get("/order-list",auth,getOrderDetailsController)
orderRouter.get("/admin/all",auth,admin,getAllOrdersController)

export default orderRouter