const tokenService = require("../services/token-service");

module.exports = async function (req, res, next) {

    try {
        //getting cookies from request header
        const { accesstoken } = req.cookies;
        // console.log(accesstoken)
        if (!accesstoken) {
            throw new Error();
        }
        const userData = await tokenService.verifyAccessToken(accesstoken)

        if (!userData) {
            throw new Error()
        }
        req.user = userData
        next()
    } catch (error) {
        res.status(401).json({ message: 'Invalid Token' })
        // console.log(`Error in auth middleware:-> ${error.messsage}`)
    }
}