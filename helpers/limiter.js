const rateLimit = require('express-rate-limit')
const { HTTP_CODE } = require('./constants')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  handler: (req, res) => {
    return res.status(HTTP_CODE.BAD_REQUEST).json({
      status: 'error',
      code: HTTP_CODE.BAD_REQUEST,
      message: 'Too many requests, please try again later.',
    })
  },
})

module.exports = limiter
