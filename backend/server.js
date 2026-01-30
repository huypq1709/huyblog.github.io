import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'blog_huy';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
let db;
let client;

async function connectDB() {
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('✅ Connected to MongoDB');
    
    // Create indexes for better performance
    await db.collection('posts').createIndex({ date: -1 });
    await db.collection('posts').createIndex({ category: 1 });
    
    console.log('✅ Database indexes created');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
}

// Initialize database connection
connectDB();

// Routes
// Posts Routes
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await db.collection('posts')
      .find({})
      .sort({ date: -1 })
      .toArray();
    
    // Convert _id to id for consistency with frontend
    const formattedPosts = posts.map(post => ({
      id: post._id.toString(),
      ...post,
      _id: undefined
    }));
    
    res.json(formattedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    
    const post = await db.collection('posts').findOne({ _id: new ObjectId(id) });
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const { _id, ...postData } = post;
    res.json({ id: _id.toString(), ...postData });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const postData = req.body;
    
    // Remove id if present (MongoDB will generate _id)
    const { id, ...cleanPostData } = postData;
    
    const result = await db.collection('posts').insertOne(cleanPostData);
    const createdPost = { id: result.insertedId.toString(), ...cleanPostData };
    
    console.log('✅ Post created successfully with ID:', result.insertedId);
    res.status(201).json(createdPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

app.put('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const postData = req.body;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    
    // Remove id from update data
    const { id: _, ...updateData } = postData;
    
    const result = await db.collection('posts').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    if (!result.value) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const { _id, ...updatedPost } = result.value;
    res.json({ id: _id.toString(), ...updatedPost });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    
    const result = await db.collection('posts').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Social Links Routes
app.get('/api/social-links', async (req, res) => {
  try {
    const links = await db.collection('socialLinks').find({}).toArray();
    
    // Convert _id to id for consistency with frontend
    const formattedLinks = links.map(link => ({
      id: link._id.toString(),
      ...link,
      _id: undefined
    }));
    
    res.json(formattedLinks);
  } catch (error) {
    console.error('Error fetching social links:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

app.get('/api/social-links/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid social link ID' });
    }
    
    const link = await db.collection('socialLinks').findOne({ _id: new ObjectId(id) });
    
    if (!link) {
      return res.status(404).json({ error: 'Social link not found' });
    }
    
    const { _id, ...linkData } = link;
    res.json({ id: _id.toString(), ...linkData });
  } catch (error) {
    console.error('Error fetching social link:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/social-links', async (req, res) => {
  try {
    const linkData = req.body;
    
    // Validate required fields
    if (!linkData.platform || !linkData.username || !linkData.url) {
      return res.status(400).json({ 
        error: 'Missing required fields: platform, username, and url are required' 
      });
    }
    
    // Remove id if present (MongoDB will generate _id)
    const { id, ...cleanLinkData } = linkData;
    
    const result = await db.collection('socialLinks').insertOne(cleanLinkData);
    const createdLink = { id: result.insertedId.toString(), ...cleanLinkData };
    
    console.log('✅ Social link created successfully with ID:', result.insertedId);
    res.status(201).json(createdLink);
  } catch (error) {
    console.error('Error creating social link:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error while creating social link' 
    });
  }
});

app.put('/api/social-links/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const linkData = req.body;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid social link ID' });
    }
    
    // Remove id from update data
    const { id: _, ...updateData } = linkData;
    
    const result = await db.collection('socialLinks').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    if (!result.value) {
      return res.status(404).json({ error: 'Social link not found' });
    }
    
    const { _id, ...updatedLink } = result.value;
    res.json({ id: _id.toString(), ...updatedLink });
  } catch (error) {
    console.error('Error updating social link:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

app.delete('/api/social-links/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid social link ID' });
    }
    
    const result = await db.collection('socialLinks').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Social link not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting social link:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Bio (homepage intro) – single document in collection "bio"
const BIO_DOC_ID = 'main';

app.get('/api/bio', async (req, res) => {
  try {
    const doc = await db.collection('bio').findOne({ _id: BIO_DOC_ID });
    const translations = doc && doc.translations ? doc.translations : {};
    res.json({ translations });
  } catch (error) {
    console.error('Error fetching bio:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

app.put('/api/bio', async (req, res) => {
  try {
    const { translations } = req.body;
    if (typeof translations !== 'object' || translations === null) {
      return res.status(400).json({ error: 'Body must include translations object' });
    }
    await db.collection('bio').updateOne(
      { _id: BIO_DOC_ID },
      { $set: { translations, updatedAt: new Date() } },
      { upsert: true }
    );
    res.json({ translations });
  } catch (error) {
    console.error('Error updating bio:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  const dbStatus = db ? 'connected' : 'disconnected';
  res.json({ 
    status: 'ok', 
    database: dbStatus,
    timestamp: new Date().toISOString() 
  });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});

// Handle server errors gracefully
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please:`);
    console.error(`   1. Kill the process using port ${PORT}, or`);
    console.error(`   2. Change the PORT in .env file`);
    console.error(`\nTo find and kill the process:`);
    console.error(`   Windows: netstat -ano | findstr :${PORT}`);
    console.error(`   Then: taskkill /PID <PID> /F`);
  } else {
    console.error('❌ Server error:', err.message);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  if (client) {
    await client.close();
    console.log('✅ MongoDB connection closed');
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down server...');
  if (client) {
    await client.close();
    console.log('✅ MongoDB connection closed');
  }
  process.exit(0);
});