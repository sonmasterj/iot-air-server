// const ForbiddenError = require('../errors/ForbiddenError')
// const UnauthorizedError = require('../errors/UnauthorizedError')
const jwtService = require('../services/jwtService')

module.exports = () => function(req, res, next) {
  try {
    let bearerToken = req.headers.authorization
    let token = bearerToken.split(' ')[1]
    let payload = jwtService.verify(token)
    req.authUser = payload
    next()
  } catch(err) {
    next(new Error(err.message))
  }
}