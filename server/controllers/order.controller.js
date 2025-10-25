import CartProductModel from "../models/cartproduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import AddressModel from "../models/address.model.js";
import sendEmail from "../config/sendEmail.js";
import mongoose from "mongoose";

 export async function CashOnDeliveryOrderController(request,response){
    try {
        const userId = request.userId // auth middleware 
        const { list_items, totalAmt, addressId,subTotalAmt } = request.body 

        const payload = list_items.map(el => {
            return({
                userId : userId,
                orderId : `ORD-${new mongoose.Types.ObjectId()}`,
                productId : el.productId._id, 
                product_details : {
                    name : el.productId.name,
                    image : el.productId.image
                } ,
                quantity : Number(el.quantity || 1),
                paymentId : "",
                payment_status : "CASH ON DELIVERY",
                delivery_address : addressId ,
                subTotalAmt  : subTotalAmt,
                totalAmt  :  totalAmt,
            })
        })

    const generatedOrder = await OrderModel.insertMany(payload)

        ///remove from the cart
                const removeCartItems = await CartProductModel.deleteMany({ userId : userId })
                const updateInUser = await UserModel.updateOne({ _id : userId }, { shopping_cart : []})

                // Notify admin via email (non-blocking)
                try {
                        const user = await UserModel.findById(userId).select('name email mobile').lean()
                        const address = await AddressModel.findById(addressId).lean()

                        const adminEmail = process.env.ADMIN_EMAIL || process.env.ALLOWED_TEST_EMAIL
                        if (adminEmail) {
                                const itemsHtml = (list_items || []).map((it, idx) => {
                                        const name = it?.productId?.name || it?.product_details?.name || 'Item'
                                        const qty = it?.quantity || 1
                                        return `<tr>
                                                <td style="padding:6px 8px; border:1px solid #eee;">${idx + 1}</td>
                                                <td style="padding:6px 8px; border:1px solid #eee;">${name}</td>
                                                <td style="padding:6px 8px; border:1px solid #eee; text-align:center;">${qty}</td>
                                        </tr>`
                                }).join('')

                                const html = `
                                <div style="font-family:Arial,Helvetica,sans-serif; color:#111;">
                                    <h2 style="margin:0 0 12px;">New COD Order Placed</h2>
                                    <p>A new Cash on Delivery order has been placed on CampusBites.</p>

                                    <h3 style="margin:16px 0 8px;">Customer</h3>
                                    <ul style="margin:0 0 12px; padding-left:18px;">
                                        <li><strong>Name:</strong> ${user?.name || ''}</li>
                                        <li><strong>Email:</strong> ${user?.email || ''}</li>
                                        <li><strong>Mobile:</strong> ${user?.mobile || address?.mobile || ''}</li>
                                    </ul>

                                    <h3 style="margin:16px 0 8px;">Delivery Address</h3>
                                    <ul style="margin:0 0 12px; padding-left:18px;">
                                        <li><strong>Hostel:</strong> ${address?.hostelName || ''}</li>
                                        <li><strong>Room:</strong> ${address?.roomNumber || ''}</li>
                                        <li><strong>Mobile:</strong> ${address?.mobile || ''}</li>
                                    </ul>

                                    <h3 style="margin:16px 0 8px;">Items</h3>
                                    <table style="border-collapse:collapse; border:1px solid #eee;">
                                        <thead>
                                            <tr>
                                                <th style="padding:6px 8px; border:1px solid #eee;">#</th>
                                                <th style="padding:6px 8px; border:1px solid #eee;">Product</th>
                                                <th style="padding:6px 8px; border:1px solid #eee;">Qty</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${itemsHtml}
                                        </tbody>
                                    </table>

                                    <h3 style="margin:16px 0 8px;">Totals</h3>
                                    <ul style="margin:0; padding-left:18px;">
                                        <li><strong>Subtotal:</strong> ₹${Number(subTotalAmt || 0).toFixed(2)}</li>
                                        <li><strong>Grand Total:</strong> ₹${Number(totalAmt || 0).toFixed(2)}</li>
                                        <li><strong>Payment:</strong> CASH ON DELIVERY</li>
                                    </ul>
                                </div>`

                                await sendEmail({
                                        sendTo: adminEmail,
                                        subject: 'New COD Order Placed - CampusBites',
                                        html
                                })
                        }
                } catch (mailErr) {
                        console.warn('[order] Admin email not sent:', mailErr?.message || mailErr)
                }

        return response.json({
            message : "Order successfully",
            error : false,
            success : true,
            data : generatedOrder
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error ,
            error : true,
            success : false
        })
    }
}

export const pricewithDiscount = (price,dis = 1)=>{
    const discountAmout = Math.ceil((Number(price) * Number(dis)) / 100)
    const actualPrice = Number(price) - Number(discountAmout)
    return actualPrice
}


export async function getOrderDetailsController(request,response){
    try {
        const userId = request.userId // order id

        const orderlist = await OrderModel.find({ userId : userId }).sort({ createdAt : -1 }).populate('delivery_address')

        return response.json({
            message : "order list",
            data : orderlist,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

// Admin: Get all orders (latest first)
export async function getAllOrdersController(request, response){
    try {
        const orders = await OrderModel.find({})
            .sort({ createdAt: -1 })
            .populate('delivery_address')
            .populate({ path: 'userId', select: 'name email mobile role' })
            .lean()

        return response.json({
            message: 'all orders',
            data: orders,
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
