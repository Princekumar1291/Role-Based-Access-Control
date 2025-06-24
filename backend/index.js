const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const authRouters=require("./routes/authRoutes")
const blogRouters=require("./routes/blogRoutes")
const profileRoutes=require("./routes/profileRoutes")

dotenv.config();
connectDB();


const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.use('/api/profile', profileRoutes);
app.use('/api/auth',authRouters);
app.use('/api/blogs', blogRouters);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
