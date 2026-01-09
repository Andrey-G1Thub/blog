const User = require('../models/User')
const { verify } = require('../helpers/token')

module.exports = async function (req, res, next) {
  const token = req.cookies.token
  if (!token) {
    return res.send({ error: 'Authenticated user required' })
  }

  const tokenData = verify(token)
  if (!tokenData) {
    return res.send({ error: 'Invalid token' })
  }

  const user = await User.findOne({ _id: tokenData.id })

  if (!user) {
    res.send({ error: 'Authenticated user not found' })

    return
  }

  req.user = user

  next()
}
