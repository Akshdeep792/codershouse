const jwt = require('jsonwebtoken')
const refreshModel = require('../models/refresh-model')
class TokenService {
    generateToken(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, {
            expiresIn: '1m'
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
    async verifyRefreshToken(token) {
        return jwt.verify(token, process.env.JWT_REFRESH_TOKEN)

    }
    async findRefreshToken(userId, refToken) {
        return await refreshModel.findOne({ userId, token: refToken })
    }
    async updateRefreshToken(userId, refToken) {
        return await refreshModel.updateOne({ userId: userId }, { token: refToken })
    }
    async removeToken(refToken) {
        await refreshModel.deleteOne({ token: refToken })
    }
}

module.exports = new TokenService()