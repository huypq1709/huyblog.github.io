#!/bin/bash
# Script to fix MongoDB config duplicate key error

echo "🔧 Fixing MongoDB config..."

# Backup current config
sudo cp /etc/mongod.conf /etc/mongod.conf.backup
echo "✅ Backup created at /etc/mongod.conf.backup"

# Create correct config
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

# Validate config
echo "🔍 Validating config..."
sudo mongod --config /etc/mongod.conf --test 2>&1 | head -5

# Restart MongoDB
echo "🔄 Restarting MongoDB..."
sudo systemctl restart mongod

# Check status
echo "📊 MongoDB status:"
sudo systemctl status mongod --no-pager -l

echo ""
echo "✅ Done! If status shows 'active (running)', MongoDB is working correctly."
