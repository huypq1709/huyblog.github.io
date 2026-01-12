#!/bin/bash
# Quick setup script for backend on VPS

echo "🚀 Setting up Backend..."

# Check if we're in the right directory
if [ ! -f "server.js" ]; then
    echo "❌ Error: server.js not found. Please run this script from backend directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat > .env <<EOF
PORT=3001
MONGODB_URI=mongodb://localhost:27017
DB_NAME=blog_huy
NODE_ENV=production
EOF
    echo "✅ .env file created"
else
    echo "ℹ️  .env file already exists"
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    sudo npm install -g pm2
fi

# Start backend with PM2
echo "🚀 Starting backend with PM2..."
pm2 start server.js --name blog-backend

# Save PM2 process list
pm2 save

echo ""
echo "✅ Backend setup complete!"
echo ""
echo "📊 Check status:"
echo "   pm2 status"
echo ""
echo "📋 View logs:"
echo "   pm2 logs blog-backend"
echo ""
echo "🔍 Test API:"
echo "   curl http://localhost:3001/health"
