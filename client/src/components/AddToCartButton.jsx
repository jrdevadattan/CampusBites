import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from './Loading'
import { useSelector } from 'react-redux'
import { FaMinus, FaPlus } from "react-icons/fa6";

const AddToCartButton = ({ data, size = "default" }) => {
    const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext()
    const [loading, setLoading] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    const [isAvailableCart, setIsAvailableCart] = useState(false)
    const [qty, setQty] = useState(0)
    const [cartItemDetails,setCartItemsDetails] = useState()

    const handleADDTocart = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        try {
            setLoading(true)

            const response = await Axios({
                ...SummaryApi.addTocart,
                data: {
                    productId: data?._id
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                if (fetchCartItem) {
                    fetchCartItem()
                }
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }

    }

    //checking this item in cart or not
    useEffect(() => {
        const checkingitem = cartItem.some(item => item.productId._id === data._id)
        setIsAvailableCart(checkingitem)

        const product = cartItem.find(item => item.productId._id === data._id)
        setQty(product?.quantity)
        setCartItemsDetails(product)
    }, [data, cartItem])


    const increaseQty = async(e) => {
        e.preventDefault()
        e.stopPropagation()
    
       const response = await  updateCartItem(cartItemDetails?._id,qty+1)
        
       if(response.success){
        toast.success("Item added")
       }
    }

    const decreaseQty = async(e) => {
        e.preventDefault()
        e.stopPropagation()
        if(qty === 1){
            deleteCartItem(cartItemDetails?._id)
        }else{
            const response = await updateCartItem(cartItemDetails?._id,qty-1)

            if(response.success){
                toast.success("Item remove")
            }
        }
    }
    return (
        <div className={`w-full ${size === 'large' ? 'max-w-none' : 'max-w-[60px] lg:max-w-[150px]'}`}>
            {
                isAvailableCart ? (
                    <div className={`flex w-full h-full ${size === 'large' ? 'gap-2' : ''}`}>
                        <button onClick={decreaseQty} className={`bg-green-600 hover:bg-green-700 text-white flex-1 w-full ${size === 'large' ? 'p-3 text-lg' : 'p-1 text-xs lg:text-sm'} rounded-l flex items-center justify-center`}><FaMinus /></button>

                        <p className={`flex-1 w-full font-semibold ${size === 'large' ? 'px-4 text-lg' : 'px-1 text-xs lg:text-sm'} flex items-center justify-center bg-gray-100 dark:bg-gray-700`}>{qty}</p>

                        <button onClick={increaseQty} className={`bg-green-600 hover:bg-green-700 text-white flex-1 w-full ${size === 'large' ? 'p-3 text-lg' : 'p-1 text-xs lg:text-sm'} rounded-r flex items-center justify-center`}><FaPlus /></button>
                    </div>
                ) : (
                    <button onClick={handleADDTocart} className={`bg-green-600 hover:bg-green-700 text-white ${size === 'large' ? 'px-8 py-3 text-lg font-semibold' : 'px-1 lg:px-4 py-1 text-xs lg:text-sm'} rounded w-full transition-colors duration-200`}>
                        {loading ? <Loading /> : (size === 'large' ? "Add to Cart" : "Add")}
                    </button>
                )
            }

        </div>
    )
}

export default AddToCartButton
