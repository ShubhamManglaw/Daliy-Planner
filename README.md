# Daily Planner

## Vercel Deployment Guide

This project is ready to be deployed to Vercel.

### 1. Firebase Setup (Required for Login & Cloud Sync)

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Create a new project.
3.  **Authentication**: Enable **Google** provider in the "Sign-in method" tab.
4.  **Firestore Database**: Create a database (start in "Test mode" or "Production mode" allowing reads/writes).
    - If in production mode, use these rules to start:
      ```
      rules_version = '2';
      service cloud.firestore {
        match /databases/{database}/documents {
          match /users/{userId} {
            allow read, write: if request.auth != null && request.auth.uid == userId;
          }
        }
      }
      ```
5.  **Project Settings**: Go to General > Your apps > (Web) > SDK setup and configuration.
6.  Copy the `firebaseConfig` object.
7.  Open `src/firebase.js` in your project and replace the placeholder keys with yours.

### 2. Deployment

1.  Push this code to your GitHub repository.
2.  Go to [Vercel](https://vercel.com/) and "Import Project" from GitHub.
3.  Select this repository.
4.  Keep all default build settings (Framework Preset: Vite).
5.  Click **Deploy**.

That's it! Your planner will be live.
