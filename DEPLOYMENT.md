# Deployment Guide

This guide explains how to deploy your Flutter web app to Firebase Hosting.

## Prerequisites

1. **Firebase CLI installed:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Logged into Firebase:**
   ```bash
   firebase login
   ```

3. **Firebase project initialized** (already done)

## Deployment Scripts

We have two deployment scripts:

### 1. Full Deploy (`./deploy.sh`)

Use this for the first deployment or when you've made significant changes:

```bash
./deploy.sh
```

**What it does:**
- ✨ Cleans previous build
- 📦 Updates dependencies
- 🔨 Builds Flutter web app (production mode)
- 🚀 Deploys to Firebase Hosting

**Estimated time:** 2-3 minutes

---

### 2. Quick Deploy (`./quick-deploy.sh`)

Use this for quick updates when you haven't changed dependencies:

```bash
./quick-deploy.sh
```

**What it does:**
- 🔨 Builds Flutter web app (production mode)
- 🚀 Deploys to Firebase Hosting

**Estimated time:** 30-60 seconds

---

## Manual Deployment

If you prefer manual deployment:

```bash
# Build
flutter build web --release

# Deploy
firebase deploy --only hosting
```

---

## Your App URLs

After deployment, your app will be available at:

- **Primary:** https://lane-choice-mvp-backend.web.app
- **Secondary:** https://lane-choice-mvp-backend.firebaseapp.com

---

## Deploy Other Firebase Services

### Deploy Firestore Rules:
```bash
firebase deploy --only firestore:rules
```

### Deploy Cloud Functions:
```bash
firebase deploy --only functions
```

### Deploy Everything:
```bash
flutter build web --release
firebase deploy
```

---

## Troubleshooting

### Issue: "firebase: command not found"
**Solution:** Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Issue: "Not logged in"
**Solution:** Login to Firebase
```bash
firebase login
```

### Issue: Build fails
**Solution:** Clean and rebuild
```bash
flutter clean
flutter pub get
flutter build web --release
```

### Issue: Changes not appearing
**Solution:** Clear cache and hard reload in browser
- Chrome: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows/Linux)
- Or open DevTools → Network tab → Check "Disable cache"

---

## Important Notes

⚠️ **Before your first deployment:**

1. ✅ Add Google Sign-In Web Client ID to `web/index.html`
2. ✅ Enable People API in Google Cloud Console
3. ✅ Add your Firebase Hosting domain to authorized domains:
   - Go to Firebase Console → Authentication → Settings → Authorized domains
   - Your domains should already be there, but verify

---

## Monitoring

After deployment, monitor your app:

1. **Firebase Console:** https://console.firebase.google.com/
2. **Hosting Dashboard:** View deployment history and usage
3. **Analytics:** Track user engagement
4. **Crashlytics:** Monitor errors (if configured)

---

## Rolling Back

To rollback to a previous version:

```bash
firebase hosting:channel:list
firebase hosting:rollback
```

---

## Custom Domain (Optional)

To add a custom domain:

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Follow the instructions to add DNS records
4. Wait for SSL certificate provisioning (takes a few hours)

---

## Support

For more information:
- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [Flutter Web Deployment](https://docs.flutter.dev/deployment/web)
- [FlutterFire](https://firebase.flutter.dev/)
