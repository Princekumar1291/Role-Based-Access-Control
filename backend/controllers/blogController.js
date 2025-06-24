const BlogPost = require('../models/BlogPost');

// CREATE BLOG (Admin only)
exports.createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    const blog = new BlogPost({
      title,
      content,
      author: req.user.id
    });

    await blog.save();

    res.status(201).json({ message: 'Blog created', blog });
  } catch (error) {
    console.error('Create Blog Error:', error);
    res.status(500).json({ message: 'Server error while creating blog' });
  }
};

// UPDATE BLOG (Admin only)
exports.updateBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId=req.user.id;
    const blog = await BlogPost.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    // Only the author can update the blog
    if (blog.author.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied: Only the created author can update this blog' });
    }
    
    blog.title = title || blog.title;
    blog.content = content || blog.content;

    await blog.save();

    res.status(200).json({ message: 'Blog updated', blog });
  } catch (error) {
    console.error('Update Blog Error:', error);
    res.status(500).json({ message: 'Server error while updating blog' });
  }
};

// DELETE BLOG (Only the author can delete it)
exports.deleteBlog = async (req, res) => {
  try {
    const userId = req.user.id;

    const blog = await BlogPost.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied: Only the created author can delete this blog' });
    }

    await blog.deleteOne();

    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Delete Blog Error:', error);
    res.status(500).json({ message: 'Server error while deleting blog' });
  }
};


// GET ALL BLOGS (Any logged-in user)
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await BlogPost.find().populate('author', 'name email role');
    res.status(200).json(blogs);
  } catch (error) {
    console.error('Get All Blogs Error:', error);
    res.status(500).json({ message: 'Server error while fetching blogs' });
  }
};

// GET BLOG BY ID (Any logged-in user)
exports.getBlogById = async (req, res) => {
  try {
    const blog = await BlogPost.findById(req.params.id).populate('author', 'name email role');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error('Get Blog By ID Error:', error);
    res.status(500).json({ message: 'Server error while fetching blog' });
  }
};

// GET BLOGS OF CURRENT LOGGED-IN USER
exports.getMyBlogs = async (req, res) => {
  try {
    const userId = req.user.id; // From JWT via authMiddleware

    const blogs = await BlogPost.find({ author: userId }).sort({ createdAt: -1 });

    res.status(200).json({ count: blogs.length, blogs });
  } catch (error) {
    console.error('Get My Blogs Error:', error);
    res.status(500).json({ message: 'Server error while fetching your blogs' });
  }
};
