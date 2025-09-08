#!/bin/bash

echo "🚀 Starting optimized build process..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next out node_modules/.cache

# Install dependencies with cache optimization
echo "📦 Installing dependencies..."
npm ci --prefer-offline --no-audit

# Check for TypeScript errors
echo "🔍 Checking TypeScript..."
npx tsc --noEmit

# Lint code
echo "✅ Linting code..."
npm run lint

# Build with optimizations
echo "🏗️ Building with optimizations..."
NODE_ENV=production npm run build

# Analyze bundle size
echo "📊 Analyzing bundle size..."
if [ -d ".next" ]; then
  echo "Build completed successfully!"
  echo "Checking bundle size..."
  du -sh .next/static/chunks/*.js | head -10
else
  echo "❌ Build failed!"
  exit 1
fi

echo "✨ Build optimization completed!"
