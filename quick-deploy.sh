#!/bin/bash

# Quick Deploy Script (no clean)
# Use this for faster deployments when you haven't changed dependencies

set -e  # Exit on error

echo "🚀 Quick deploy starting..."
echo ""

# Build for web (production)
echo "🔨 Building Flutter web app..."
flutter build web --release
echo "✅ Build complete"
echo ""

# Deploy to Firebase Hosting
echo "🌐 Deploying to Firebase Hosting..."
firebase deploy --only hosting
echo ""

# Success message
echo "✅ Deployment complete!"
echo ""
echo "🎉 Your app is live at:"
echo "   https://lane-choice-mvp-backend.web.app"
echo ""
