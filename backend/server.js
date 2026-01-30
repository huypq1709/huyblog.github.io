import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { MongoClient, ObjectId } from 'mongodb';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'blog_huy';
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || '';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

// Middleware – webhook needs raw body for signature verification, so register before json()
app.use(cors());

// GitHub deploy webhook: only POST is accepted (GitHub sends POST). GET returns a short info message.
app.get('/api/deploy-webhook', (req, res) => {
  res.status(200).json({
    message: 'Deploy webhook endpoint. GitHub sends POST on push; this URL does not support GET.',
    usage: 'Configure this URL as Webhook URL in GitHub repo Settings → Webhooks. Method: POST.',
  });
});

app.post('/api/deploy-webhook', express.raw({ type: 'application/json' }), (req, res) => {
  if (!WEBHOOK_SECRET) {
    return res.status(503).json({ error: 'Webhook not configured (WEBHOOK_SECRET missing)' });
  }
  const sig = req.headers['x-hub-signature-256'];
  if (!sig) {
    return res.status(401).json({ error: 'Missing X-Hub-Signature-256' });
  }
  const raw = req.body;
  if (!raw || !(raw instanceof Buffer)) {
    return res.status(400).json({ error: 'Invalid body' });
  }
  const expected = 'sha256=' + crypto.createHmac('sha256', WEBHOOK_SECRET).update(raw).digest('hex');
  if (sig !== expected) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  let payload;
  try {
    payload = JSON.parse(raw.toString('utf8'));
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  if (req.headers['x-github-event'] === 'ping') {
    return res.json({ ok: true, message: 'pong' });
  }
  if (req.headers['x-github-event'] !== 'push') {
    return res.json({ ok: true, ignored: true });
  }
  const ref = payload.ref || '';
  if (ref !== 'refs/heads/main') {
    return res.json({ ok: true, ignored: true, reason: 'not main branch' });
  }
  const projectRoot = path.join(__dirname, '..');
  const deployScript = path.join(projectRoot, 'deploy.sh');
  exec(`bash deploy.sh`, { cwd: projectRoot }, (err, stdout, stderr) => {
    if (err) {
      console.error('Deploy failed:', err);
      console.error(stderr);
      return res.status(500).json({ error: 'Deploy failed', stderr: stderr || err.message });
    }
    console.log('Deploy completed:', stdout);
    res.json({ ok: true, message: 'Deploy started', stdout: stdout || undefined });
  });
});

app.use(express.json());

// Translate Vietnamese -> English (Gemini API, free tier)
app.post('/api/translate', async (req, res) => {
  if (!GEMINI_API_KEY) {
    return res.status(503).json({
      error: 'Translation not configured. Set GEMINI_API_KEY in backend .env (get key at https://aistudio.google.com/apikey)',
    });
  }
  const { text, type = 'text', title: titleVi, excerpt: excerptVi, content: contentVi } = req.body || {};
  let prompt;
  if (type === 'post') {
    const t = (typeof titleVi === 'string' ? titleVi : '').trim();
    const e = (typeof excerptVi === 'string' ? excerptVi : '').trim();
    const c = (typeof contentVi === 'string' ? contentVi : '').trim();
    if (!t && !e && !c) {
      return res.status(400).json({ error: 'Post translation requires at least one of title, excerpt, content' });
    }
    prompt = `Translate the following Vietnamese blog post to English. Return ONLY a valid JSON object with exactly these keys: "title", "excerpt", "content". No markdown, no extra text. Use empty string for missing fields.\n\nTitle: ${t}\n\nExcerpt: ${e}\n\nContent: ${c}`;
  } else {
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Body must include text (string)' });
    }
    const trimmed = text.trim();
    if (!trimmed) {
      return res.status(400).json({ error: 'Text cannot be empty' });
    }
    prompt = `Translate the following Vietnamese text to English. Preserve paragraph breaks (double newlines). Output only the English translation, nothing else.\n\n${trimmed}`;
  }
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 8192 },
      }),
    });
    if (!response.ok) {
      const errBody = await response.text();
      console.error('Gemini API error:', response.status, errBody);
      const isRateLimit = response.status === 429;
      let message = isRateLimit ? 'Quota/rate limit exceeded. Try again in 1–2 minutes.' : 'Translation service error.';
      if (response.status === 401 || response.status === 403) {
        message = 'Invalid or missing GEMINI_API_KEY. Check backend .env and https://aistudio.google.com/apikey';
      } else if (response.status >= 500) {
        message = 'Gemini API is temporarily unavailable. Try again later.';
      } else if (isRateLimit) {
        try {
          const errJson = JSON.parse(errBody);
          const retryMatch = errJson?.error?.message?.match(/retry in ([\d.]+)s/i) || errJson?.error?.details?.find((d) => d.retryDelay)?.retryDelay?.match(/(\d+)/);
          const sec = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : 60;
          message = `Đã hết quota/giới hạn dịch (Gemini free tier). Thử lại sau ${sec} giây hoặc vài phút.`;
        } catch (_) {}
      }
      return res.status(response.status === 429 ? 429 : 502).json({ error: message });
    }
    const data = await response.json();
    const part = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!part) {
      return res.status(502).json({ error: 'No translation in response' });
    }
    const translated = part.trim();
    if (type === 'post') {
      try {
        const parsed = JSON.parse(translated.replace(/^```json?\s*|\s*```$/g, '').trim());
        const title = typeof parsed.title === 'string' ? parsed.title : '';
        const excerpt = typeof parsed.excerpt === 'string' ? parsed.excerpt : '';
        const content = typeof parsed.content === 'string' ? parsed.content : '';
        return res.json({ translated: { title, excerpt, content } });
      } catch (_) {}
      return res.json({ translated: { title: translated, excerpt: '', content: '' } });
    }
    res.json({ translated });
  } catch (err) {
    console.error('Translate error:', err);
    res.status(500).json({ error: err.message || 'Translation failed' });
  }
});

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