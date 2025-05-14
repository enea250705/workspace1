#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting build process..."

# Install server dependencies
echo "📦 Installing server dependencies..."
npm install

# Build and install client
echo "📦 Installing client dependencies..."
cd client
npm install

echo "🏗️ Building client..."
npm run build
cd ..

# Build the server
echo "🏗️ Building server..."
esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# Copy client build to dist/public
echo "📋 Copying client build to dist/public..."
mkdir -p dist/public
cp -r client/dist/* dist/public/

echo "✅ Build completed successfully!" 