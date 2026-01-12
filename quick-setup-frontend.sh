#!/bin/bash
# Quick setup script for frontend on VPS

echo "🚀 Setting up Frontend..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat > .env <<EOF
VITE_API_BASE_URL=http://localhost:3001/api
EOF
    echo "✅ .env file created"
else
    echo "ℹ️  .env file already exists"
fi

# Build frontend
echo "🔨 Building frontend..."
npm run build

if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed. dist directory not found."
    exit 1
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    sudo npm install -g pm2
fi

# Check if serve is installed
if ! command -v serve &> /dev/null; then
    echo "📦 Installing serve..."
    sudo npm install -g serve
fi

# Start frontend with PM2
echo "🚀 Starting frontend with PM2..."
pm2 serve dist 5173 --name blog-frontend --spa

# Save PM2 process list
pm2 save

echo ""
echo "✅ Frontend setup complete!"
echo ""
echo "📊 Check status:"
echo "   pm2 status"
echo ""
echo "📋 View logs:"
echo "   pm2 logs blog-frontend"
echo ""
echo "🔍 Test frontend:"
echo "   curl http://localhost:5173"
