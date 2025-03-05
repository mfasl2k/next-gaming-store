#!/bin/bash
set -e

echo "===== Environment Information ====="
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Working directory: $(pwd)"
echo "Directory contents: $(ls -la)"

# Install certificates if needed
if [ ! -f /etc/ssl/certs/ca-certificates.crt ]; then
  echo "Installing CA certificates..."
  apt-get update && apt-get install -y ca-certificates
else
  echo "CA certificates already installed"
fi

# Check if server.js exists
if [ ! -f server.js ]; then
  echo "ERROR: server.js not found!"
  exit 1
fi

# Check Next.js installation
if [ ! -d node_modules/next ]; then
  echo "WARNING: Next.js not found in node_modules, running npm install..."
  npm install
fi

# Start the server
echo "Starting Next.js application..."
node --trace-warnings server.js