const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  getMyBlogs
} = require('../controllers/blogController');

router.get('/my-blogs', authMiddleware,roleMiddleware('admin'), getMyBlogs);
router.get('/', authMiddleware, getAllBlogs);
router.get('/:id', authMiddleware, getBlogById);

router.post('/', authMiddleware, roleMiddleware('admin'), createBlog);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateBlog);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteBlog);

module.exports = router;
