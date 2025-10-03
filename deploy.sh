#!/bin/bash

# Flutter Web Deployment Script for Firebase Hosting
# This script builds and deploys your Flutter web app to Firebase Hosting

set -e  # Exit on error

echo "🚀 Starting deployment process..."
echo ""

# Step 1: Clean previous build
echo "🧹 Cleaning previous build..."
flutter clean
echo "✅ Clean complete"
echo ""

# Step 2: Get dependencies
echo "📦 Getting dependencies..."
flutter pub get
echo "✅ Dependencies installed"
echo ""

# Step 3: Build for web (production)
echo "🔨 Building Flutter web app for production..."
flutter build web --release
echo "✅ Build complete"
echo ""

# Step 4: Deploy to Firebase Hosting
echo "🌐 Deploying to Firebase Hosting..."
firebase deploy --only hosting
echo ""

# Success message
echo "✅ Deployment complete!"
echo ""
echo "🎉 Your app is now live at:"
echo "   https://lane-choice-mvp-backend.web.app"
echo "   https://lane-choice-mvp-backend.firebaseapp.com"
echo ""
