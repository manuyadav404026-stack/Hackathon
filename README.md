# FixMyCampus

Full-stack campus complaint management system built with React, Vite and Firebase.

## Stack
- React + Vite
- React Router
- Lucide React
- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Firebase Cloud Functions v2
- Recharts-ready frontend architecture
- Firebase Hosting

## Features
### Student
- Secure registration/login/logout
- Password reset and password change
- Dashboard metrics
- Complaint submission with image upload
- Category/priority selection
- Real-time complaint list/detail updates
- Activity timeline
- Status tracking
- Notifications
- Profile editing
- Resolution feedback
- Complaint reopening after resolution/rejection

### Admin
- Dashboard KPIs
- Real-time complaint management
- Search/filter by status/priority
- Department assignment
- Admin remarks
- Rejection with mandatory reason
- Resolution workflow
- Student user management
- Enable/disable accounts through trusted Cloud Functions
- CSV export
- Category/status/priority analytics

### Security
- Students cannot self-register as admins.
- Firestore rules enforce ownership and role boundaries.
- Admin operations are checked server-side in Cloud Functions.
- Storage accepts only JPG/PNG/WEBP under 5 MB for complaint evidence.
- Service-account credentials are never used in React.

## Setup

1. Install Node.js 20+.
2. Create a Firebase project.
3. Enable Authentication > Email/Password.
4. Create Firestore database.
5. Enable Firebase Storage.
6. Create `.env` from `.env.example` and add the Firebase web-app config.
7. Install dependencies:

```bash
npm install
cd functions && npm install && cd ..
```

8. Start frontend:

```bash
npm run dev
```

## First administrator

Do not add an admin checkbox to registration.

Create the administrator account in Firebase Authentication, then run the trusted provisioning script from a machine holding the service-account credential:

```bash
cd scripts
npm install firebase-admin
set GOOGLE_APPLICATION_CREDENTIALS=C:\secure\service-account.json
set ADMIN_UID=THE_FIREBASE_AUTH_UID
node provision-admin.mjs
```

Linux/macOS:

```bash
GOOGLE_APPLICATION_CREDENTIALS=/secure/service-account.json ADMIN_UID=THE_FIREBASE_AUTH_UID node provision-admin.mjs
```

Never commit the service-account JSON.

## Firebase deployment

```bash
firebase login
firebase use YOUR_PROJECT_ID
firebase deploy --only firestore:rules,firestore:indexes,storage,functions,hosting
```

## Required Firebase indexes

The repository includes `firestore.indexes.json`. The complaint query requires an index on `studentUid + createdAt DESC`; the notification query requires `userId + createdAt DESC`.

## Production environment

The Firebase web configuration is not a secret. Security comes from Firebase Auth, Firestore rules, Storage rules and server-side authorization. Do not place service-account private keys or Admin SDK credentials in `.env` for the React application.

## Testing checklist

Run these locally after dependencies are available:

```bash
npm run build
npm run dev
```

Then verify:
- student registration
- login/logout
- password reset
- complaint creation
- image upload restrictions
- student-only complaint visibility
- real-time updates
- admin complaint updates
- rejection reason validation
- resolution + feedback
- reopening
- notifications
- profile updates
- user enable/disable
- CSV export
- responsive mobile layout
- Firebase rules deployment

`npm install` and `npm run build` complete successfully (verified).
