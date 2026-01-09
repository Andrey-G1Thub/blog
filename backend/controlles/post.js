const Post = require('../models/Post')

async function addPost(postData) {
  const newPost = await Post.create(postData)
  await newPost.populate({
    path: 'comments',
    populate: 'author',
  })
  return newPost
}

async function editPost(id, postData) {
  const updatedPost = await Post.findByIdAndUpdate(id, postData, {
    returnDocument: 'after',
  }).populate({
    path: 'comments',
    populate: 'author',
  })

  return updatedPost
}

//delete
function deletePost(id) {
  return Post.deleteOne({ _id: id })
}

//get list with search and pagination
async function getPosts(search = '', limit = 10, page = 1) {
  const [posts, count] = await Promise.all([
    Post.find({ title: { $regex: search, $options: 'i' } })
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 }),
    Post.countDocuments({ title: { $regex: search, $options: 'i' } }),
  ])

  return {
    posts,
    lastPage: Math.ceil(count / limit),
  }
}

//get item
function getPost(id) {
  return Post.findById(id).populate({
    path: 'comments',
    populate: 'author',
  })
}
module.exports = {
  addPost,
  editPost,
  deletePost,
  getPosts,
  getPost,
}
