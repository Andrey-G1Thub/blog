module.exports = function (user) {
  const role =
    user.role !== undefined ? user.role : user._doc ? user._doc.role : undefined

  return {
    id: user.id || user._id,
    login: user.login,
    roleId: role,
    registeredAt: user.createdAt,
  }
}
