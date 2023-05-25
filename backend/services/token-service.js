const jwt = require('jsonwebtoken')
const refreshModel = require('../models/refresh-model')
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
    async storeRefreshToken(token, userId) {
        try {
            await refreshModel.create({ token, userId })
        } catch (error) {
            console.log(error.message)
        }
    }
    async verifyAccessToken(token) {
        return jwt.verify(token, process.env.JWT_ACCESS_TOKEN)
    }
}

module.exports = new TokenService()