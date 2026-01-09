module.exports = function (comment) {
  return {
    content: comment.content,
    author: comment.author.login,
    id: comment._id.toString(),
    publishedAt: comment.createdAt,
  }
}
