const jwt = require('jsonwebtoken')

const JWT_SECRET = 'iotdemo1234@2022'
const JWT_EXP = 1* 60 * 60

module.exports = {
  sign: (payload, notExpire) => {
    if (notExpire) {
      return jwt.sign(payload, JWT_SECRET)
    }
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXP })
  },
  verify: token => {
    return jwt.verify(token, JWT_SECRET)
  }
}