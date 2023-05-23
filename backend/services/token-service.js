const jwt = require('jsonwebtoken')
class TokenService {
    generateToken(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, {
            expiresIn: '1h'
        })
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, {
            expiresIn: '1y'
        })
        return {
            accessToken, refreshToken
        }
    }
}

module.exports = new TokenService()