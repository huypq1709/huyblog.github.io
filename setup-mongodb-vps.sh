#!/bin/bash
# Script to setup MongoDB on VPS

echo "🔧 Setting up MongoDB..."

# Step 1: Fix MongoDB config
echo "📝 Fixing MongoDB config..."
sudo cp /etc/mongod.conf /etc/mongod.conf.backup 2>/dev/null || true

sudo tee /etc/mongod.conf > /dev/null <<'EOF'
# Network
net:
  port: 27017
  bindIp: 127.0.0.1

# Storage
storage:
  dbPath: /var/lib/mongodb
  journal:
    enabled: true
  wiredTiger:
    engineConfig:
      cacheSizeGB: 0.5

# Process Management
processManagement:
  fork: true
  pidFilePath: /var/run/mongodb/mongod.pid

# Logging
systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log

# Operation Profiling
operationProfiling:
  mode: slowOp
  slowOpThresholdMs: 100
EOF

echo "✅ Config file updated"

# Step 2: Create directories and set permissions
echo "📁 Creating directories..."
sudo mkdir -p /var/lib/mongodb /var/log/mongodb /var/run/mongodb
sudo chown -R mongodb:mongodb /var/lib/mongodb /var/log/mongodb /var/run/mongodb

# Step 3: Start MongoDB
echo "🚀 Starting MongoDB..."
sudo systemctl restart mongod

# Wait a bit for MongoDB to start
sleep 3

# Step 4: Check status
echo "📊 Checking MongoDB status..."
sudo systemctl status mongod --no-pager -l | head -20

# Step 5: Test connection
echo "🔍 Testing MongoDB connection..."
if mongosh --eval "db.version()" --quiet > /dev/null 2>&1; then
    echo "✅ MongoDB is running and accessible!"
    echo ""
    echo "📝 To create users, run:"
    echo "   mongosh"
    echo ""
    echo "   Then in MongoDB shell:"
    echo "   use admin"
    echo "   db.createUser({ user: \"admin\", pwd: \"your_password\", roles: [ { role: \"userAdminAnyDatabase\", db: \"admin\" } ] })"
    echo ""
    echo "   use blog_huy"
    echo "   db.createUser({ user: \"blog_user\", pwd: \"your_password\", roles: [ { role: \"readWrite\", db: \"blog_huy\" } ] })"
else
    echo "❌ MongoDB connection failed. Check logs:"
    echo "   sudo tail -f /var/log/mongodb/mongod.log"
fi
