const passport = require('passport')
require('../config/passport')

const { HTTP_CODE } = require('./constants')

const guard = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    let token = null
    if (req.get('Authorization')) {
      token = req.get('Authorization').split(' ')[1]
    }
    if (!user || err || token !== user.token) {
      return res.status(HTTP_CODE.UNAUTHORIZED).json({
        status: 'error',
        code: HTTP_CODE.UNAUTHORIZED,
        message: 'Not authorized'
      })
    }
    req.user = user
    return next()
  })(req, res, next)
}

module.exports = guard
