import axios from "axios";
import SummaryApi , { baseURL } from "../common/SummaryApi";

const Axios = axios.create({
    baseURL : baseURL,
    withCredentials : true
})

//sending access token in the header
Axios.interceptors.request.use(
    async(config)=>{
        const accessToken = localStorage.getItem('accesstoken')

        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`
        }

        return config
    },
    (error)=>{
        return Promise.reject(error)
    }
)

//extend the life span of access token with 
// the help refresh
Axios.interceptors.response.use(
    (response)=>{
        return response
    },
    async(error)=>{
        let originRequest = error.config 

        // error.response may be undefined (for network errors / CORS failures)
        // If the request itself was the refresh token call, don't try to refresh again
        if (originRequest && originRequest.url && originRequest.url.includes('/refresh-token')) {
            return Promise.reject(error)
        }

        if(error.response && error.response.status === 401 && !originRequest.retry){
            originRequest.retry = true

            const refreshToken = localStorage.getItem("refreshToken")

            if(refreshToken){
                const newAccessToken = await refreshAccessToken(refreshToken)

                if(newAccessToken){
                    originRequest.headers.Authorization = `Bearer ${newAccessToken}`
                    return Axios(originRequest)
                }
            }
        }
        
        return Promise.reject(error)
    }
)


const refreshAccessToken = async(refreshToken)=>{
    try {
        // Use the raw axios instance (not the intercepted Axios) to avoid triggering
        // the response interceptor and causing a refresh loop if the refresh call fails.
        const response = await axios.request({
            url: `${baseURL}${SummaryApi.refreshToken.url}`,
            method: SummaryApi.refreshToken.method,
            headers: {
                Authorization: `Bearer ${refreshToken}`
            },
            withCredentials: true
        })

        const accessToken = response.data.data.accessToken
        localStorage.setItem('accesstoken',accessToken)
        return accessToken
    } catch (error) {
        console.log(error)
        return null
    }
}

export default Axios