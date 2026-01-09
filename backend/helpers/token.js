const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../constants/jwt_secret')
const sign = JWT_SECRET

module.exports = {
  generate(data) {
    return jwt.sign(data, sign, { expiresIn: '30d' })
  },
  verify(token) {
    return jwt.verify(token, sign)
  },
}
