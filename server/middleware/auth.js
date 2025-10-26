import jwt from 'jsonwebtoken'

const auth = async (request, response, next) => {
    try {
        const token = request.cookies.accessToken || request?.headers?.authorization?.split(" ")[1]

        if (!token) {
            return response.status(401).json({
                message: "Provide token",
                error: true,
                success: false
            })
        }

        // FIXED: Check if environment variable exists, fallback to hardcoded
        const SECRET = process.env.SECRET_KEY_ACCESS_TOKEN || 'CampusBites_AccessToken_SecretKey_2024_Development'

        const decode = jwt.verify(token, SECRET)

        if (!decode) {
            return response.status(401).json({
                message: "unauthorized access",
                error: true,
                success: false
            })
        }

        request.userId = decode.id
        next()

    } catch (error) {
        return response.status(500).json({
            message: error.message,
            error: true,
            success: false
        })
    }
}

export default auth