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

        const SECRET = process.env.SECRET_KEY_ACCESS_TOKEN;
        if (!SECRET) {
            return response.status(500).json({
                message: "Server misconfiguration: SECRET_KEY_ACCESS_TOKEN environment variable is not set.",
                error: true,
                success: false
            });
        }

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