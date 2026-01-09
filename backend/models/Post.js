const mongoose = require('mongoose')
const roles = require('../constants/roles')
const validator = require('validator')

const PostSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      //убираем для возможности сохранять в папку uploads
      // validate: {
      //   validator: validator.isURL,
      //   message: 'Image should be a valid url',
      // },
    },
    content: {
      type: String,
      required: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  { timestamps: true }
)

const Post = mongoose.model('Post', PostSchema)

module.exports = Post
