import toast from "react-hot-toast"

const AxiosToastError = (error)=>{
    const msg = error?.response?.data?.message || error?.message || 'Something went wrong'
    toast.error(msg)
}

export default AxiosToastError