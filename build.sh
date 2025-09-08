#!/bin/bash

# Build script for Vercel deployment
echo "🚀 Starting build process for Algorithm Complexity Visualizer..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run build
echo "🏗️ Building Next.js application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📊 Build artifacts created in .next directory"
else
    echo "❌ Build failed!"
    exit 1
fi

echo "🎉 Ready for deployment!"
