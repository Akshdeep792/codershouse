const OtpService = require('../services/opt-service')
const hashService = require("../services/hash-service")
const userService = require("../services/user-service")
const tokenService = require("../services/token-service")
const UserDto = require("../dtos/user-dtos")
class AuthController {
    async sendOtp(req, res) {
        const { phone } = req.body

        if (!phone) {
            res.status(400).json({ message: 'Phone field required!' })
        }
        const otp = await OtpService.generateOtp()
        //hashing otp
        const ttl = 1000 * 60 * 2
        const expires = Date.now() + ttl
        const data = `${phone}.${otp}.${expires}`
        const hash = hashService.hashOtp(data)

        try {

            await OtpService.sendBySms(phone, otp)
            res.json({
                hash: `${hash}.${expires}`,
                phone,
                // otp
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'message sending failed' })
        }
        // res.json({ "opt": otp, "hash": hash })
    }

    async verifyOtp(req, res) {
        const { otp, hash, phone } = req.body
        if (!otp || !hash || !phone) {
            res.status(400).json({ message: "All fields are required" })
        }
        const [hashOtp, expires] = hash.split('.');
        if (Date.now() > +expires) {
            res.status(400).json({ message: "OTP expired" })
        }

        const data = `${phone}.${otp}.${expires}`
        const isValid = OtpService.verifyOtp(hashOtp, data)
        if (!isValid) {
            res.send(400).json({ message: "Invalid OTP" })
        }

        let user;


        try {
            user = await userService.findUser({ phone })
            if (!user) {
                console.log("Running")
                user = await userService.createUser({ phone })
            }
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: "Database Error." })
        }

        const { accessToken, refreshToken } = tokenService.generateToken({ _id: user._id, activated: false })
        tokenService.storeRefreshToken(refreshToken, user._id)
        res.cookie('refreshtoken', refreshToken, {
            masAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,

        })
        res.cookie('accesstoken', accessToken, {
            masAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,

        })

        const userDto = new UserDto(user)
        // console.log(userDto)
        res.json({ userDto, auth: true })

    }
    async refresh(req, res) {
        //get refresh token from cookie
        const { refreshtoken: refFromCookie } = req.cookies
        //check if refresh token in valid
        let userData;
        try {
            userData = await tokenService.verifyRefreshToken(refFromCookie)
        } catch (error) {
            return res.status(401).json({ message: 'Invalid Token' })
        }
        //check if token is in database
        try {

            const token = await tokenService.findRefreshToken(userData._id, refFromCookie)
            if (!token) {
                return res.status(401).json({ message: 'Invalid Token' })
            }
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' })
        }
        //check if valid token
        const user = await userService.findUser({ _id: userData._id })
        if (!user) {
            return res.status(404).json({ message: 'No User' })
        }
        //generate new tokens
        const { refreshToken, accessToken } = tokenService.generateToken({ _id: userData._id })

        //update refreshtoken
        try {
            await tokenService.updateRefreshToken(userData._id, refreshToken)
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' })

        }
        //put in cokkie
        res.cookie('refreshtoken', refreshToken, {
            masAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,

        })
        res.cookie('accesstoken', accessToken, {
            masAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,

        })
        //response
        const userDto = new UserDto(user)
        // console.log(userDto)
        res.json({ userDto, auth: true })

    }
    async logout(req, res) {
        //delete refresh token from db
        const { refreshtoken } = req.cookies
        await tokenService.removeToken(refreshtoken)
        //remove from cookir
        res.clearCookie('refreshtoken');
        res.clearCookie('accesstoken')
        res.json({ userDto: null, auth: false })
    }
}

module.exports = new AuthController()