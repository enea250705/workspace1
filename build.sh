#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the client
echo "🏗️ Building client..."
npm run build

# Build the server
echo "🏗️ Building server..."
esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "✅ Build completed successfully!" 