import Axios from "./Axios"
import SummaryApi from "../common/SummaryApi"

const fetchUserDetails = async () => {
    try {
        const response = await Axios({
            ...SummaryApi.userDetails
        })
        return response.data
    } catch (error) {
        // If the user is not authenticated (401), handle gracefully and
        // return null so callers can check and treat as 'not logged in'.
        if (error && error.response && error.response.status === 401) {
            console.info('fetchUserDetails: user not authenticated (401)')
            return null
        }

        // Network / CORS errors may not have a response
        if (error && !error.response) {
            console.error('fetchUserDetails: network or CORS error', error.message)
            return null
        }

        // Other errors: log and rethrow so callers that expect failures can handle them
        console.error('fetchUserDetails: unexpected error', error)
        return null
    }
}

export default fetchUserDetails