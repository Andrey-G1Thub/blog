const express = require('express')
const {
  getPosts,
  addPost,
  editPost,
  deletePost,
  getPost,
} = require('../controlles/post')
const { addComment, deleteComment } = require('../controlles/comments')
const authenticated = require('../middlewares/authenticated')
const hasRole = require('../middlewares/hasRole')
const mapPost = require('../helpers/mapPost')
const mapComment = require('../helpers/mapComment')
const ROLES = require('../constants/roles')
const multer = require('multer') //npm install multer
const path = require('path')

//   для сохранения картинок в папку
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`)
  },
})

const upload = multer({ storage })

const router = express.Router({ mergeParams: true })

router.get('/', async (req, res) => {
  const { posts, lastPage } = await getPosts(
    req.query.search,
    req.query.limit,
    req.query.page
  )
  res.send({ data: { lastPage, posts: posts.map(mapPost) } })
})

router.get('/:id', async (req, res) => {
  const post = await getPost(req.params.id)

  res.send({ data: mapPost(post) })
})

// router.use(authenticated)

router.post('/:id/comments', authenticated, async (req, res) => {
  const newComment = await addComment(req.params.id, {
    content: req.body.content,
    author: req.user.id,
  })
  res.send({ data: mapComment(newComment) })
})

router.delete(
  '/:postId/comments/:commentId',
  authenticated,
  hasRole([ROLES.ADMIN, ROLES.MODERATOR]),
  async (req, res) => {
    await deleteComment(req.params.postId, req.params.commentId)

    res.send({ error: null })
  }
)

router.post(
  '/',
  authenticated,
  hasRole([ROLES.ADMIN]),
  upload.single('image'),
  async (req, res) => {
    try {
      let finalImage

      if (req.file) {
        finalImage = `/uploads/${req.file.filename}` //файл в приаритете
      } else if (req.body.imageUrl && req.body.imageUrl.trim() !== '') {
        finalImage = req.body.imageUrl
      }

      const newPost = await addPost({
        title: req.body.title,
        content: req.body.content,
        image: finalImage,
      })

      res.send({ data: mapPost(newPost) })
    } catch (e) {
      res.send({ error: e.message || 'Ошибка сервера' })
    }
  }
)

router.patch(
  '/:id',
  authenticated,
  hasRole([ROLES.ADMIN]),
  upload.single('image'),
  async (req, res) => {
    try {
      const updateData = {
        title: req.body.title,
        content: req.body.content,
      }

      if (req.file) {
        updateData.image = `/uploads/${req.file.filename}`
      } else if (req.body.imageUrl) {
        updateData.image = req.body.imageUrl
      }

      const updatedPost = await editPost(req.params.id, updateData)
      res.send({ data: mapPost(updatedPost) })
    } catch (e) {
      res.send({ error: 'Error editing post' })
    }
  }
)

router.delete(
  '/:id',
  authenticated,
  hasRole([ROLES.ADMIN]),
  async (req, res) => {
    await deletePost(req.params.id)

    res.send({ error: null })
  }
)

module.exports = router
