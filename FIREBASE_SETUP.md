# Firebase Setup Instructions

This document provides step-by-step instructions to set up Firebase for the Lane Choice MVP app.

## Prerequisites

1. A Google account
2. Flutter development environment set up
3. Android Studio (for Android development)
4. Xcode (for iOS development, macOS only)

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `lane-choice-mvp`
4. Choose whether to enable Google Analytics (recommended)
5. Select or create a Google Analytics account if enabled
6. Click "Create project"

## Step 2: Enable Authentication

1. In the Firebase Console, navigate to **Authentication** > **Sign-in method**
2. Enable the following sign-in providers:
   - **Email/Password**: Click on it and toggle "Enable"
   - **Google**: Click on it, toggle "Enable", and configure:
     - Project support email: Your email address
     - Click "Save"

## Step 3: Configure Android App

1. In Firebase Console, click "Add app" and select Android
2. Fill in the details:
   - **Android package name**: `com.example.lane_choice_mvp`
   - **App nickname**: `Lane Choice MVP Android`
   - **Debug signing certificate SHA-1**: (Optional for now)
3. Click "Register app"
4. Download the `google-services.json` file
5. Place the file in `android/app/` directory
6. The Firebase SDK dependencies are already added in `pubspec.yaml`

### Android Configuration Files

The following files need to be updated (already configured in this project):

**android/build.gradle.kts**:
```kotlin
dependencies {
    classpath("com.google.gms:google-services:4.4.0")
}
```

**android/app/build.gradle.kts**:
```kotlin
plugins {
    id("com.google.gms.google-services")
}
```

## Step 4: Configure iOS App

1. In Firebase Console, click "Add app" and select iOS
2. Fill in the details:
   - **iOS bundle ID**: `com.example.laneChoiceMvp`
   - **App nickname**: `Lane Choice MVP iOS`
3. Click "Register app"
4. Download the `GoogleService-Info.plist` file
5. Open `ios/Runner.xcworkspace` in Xcode
6. Right-click on `Runner` in the project navigator
7. Select "Add Files to Runner"
8. Select the downloaded `GoogleService-Info.plist` file
9. Make sure "Copy items if needed" is checked
10. Make sure the `Runner` target is selected
11. Click "Add"

## Step 5: Configure Web App (Optional)

1. In Firebase Console, click "Add app" and select Web
2. Fill in the details:
   - **App nickname**: `Lane Choice MVP Web`
3. Click "Register app"
4. Copy the Firebase configuration object
5. Create `web/firebase-config.js` with the configuration

## Step 6: Set up Firestore Database (Optional)

1. In Firebase Console, navigate to **Firestore Database**
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select a location for your database
5. Click "Done"

## Step 7: Configure Firebase Security Rules

### Firestore Rules (if using Firestore):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read public data
    match /public/{document=**} {
      allow read: if request.auth != null;
    }
  }
}
```

## Step 8: Test the Setup

1. Run `flutter clean`
2. Run `flutter pub get`
3. For Android: `flutter run`
4. For iOS: `flutter run`
5. Try creating an account and signing in

## Troubleshooting

### Common Issues:

1. **Google Sign-In not working on Android**:
   - Make sure `google-services.json` is in the correct location
   - Add SHA-1 fingerprint to Firebase project settings
   - Get SHA-1 with: `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android`

2. **iOS build errors**:
   - Make sure `GoogleService-Info.plist` is added to the Xcode project
   - Clean and rebuild the project

3. **Firebase not initialized**:
   - Make sure `Firebase.initializeApp()` is called in `main()`
   - Check that configuration files are properly placed

4. **Authentication errors**:
   - Verify that Email/Password and Google sign-in are enabled in Firebase Console
   - Check that the package name/bundle ID matches exactly

## Environment Variables

For production deployment, consider using environment variables for sensitive configuration:

1. Create `.env` files for different environments
2. Use `flutter_dotenv` package to load environment variables
3. Never commit sensitive keys to version control

## Next Steps

1. Set up Firebase Analytics (optional)
2. Configure Firebase Crashlytics for error reporting
3. Set up Firebase Performance Monitoring
4. Configure Firebase Remote Config for feature flags
5. Set up Firebase Cloud Messaging for push notifications

## Support

For additional help:
- [Firebase Documentation](https://firebase.google.com/docs)
- [FlutterFire Documentation](https://firebase.flutter.dev/)
- [Firebase Console](https://console.firebase.google.com/)