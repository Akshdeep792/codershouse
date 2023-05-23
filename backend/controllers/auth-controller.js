const OtpService = require('../services/opt-service')
const hashService = require("../services/hash-service")
const userService = require("../services/user-service")
const tokenService = require("../services/token-service")
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
                phone
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
                await userService.createUser({ phone })
            }
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: "Database Error." })
        }

        const { accessToken, refreshToken } = tokenService.generateToken({ _id: user._id, activated: false })

        res.cookie('refreshtoken', refreshToken, {
            masAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,

        })
        res.json({ accessToken })

    }
}

module.exports = new AuthController()