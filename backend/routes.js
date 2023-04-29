const router = require('express').Router()

router.post('/api/send-otp', (req, res) => {
    res.send("Hello from Send OTP")
})



module.exports = router