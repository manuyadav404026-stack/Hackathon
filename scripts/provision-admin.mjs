// Run only on a trusted machine. Never ship this service-account JSON to the frontend.
// 1) Download a Firebase Admin SDK service-account key from Firebase Console.
// 2) Set GOOGLE_APPLICATION_CREDENTIALS to its local path.
// 3) Set ADMIN_UID to the Firebase Auth UID you want to promote.
import admin from 'firebase-admin';
const uid=process.env.ADMIN_UID;
if(!uid) throw new Error('ADMIN_UID is required');
admin.initializeApp();
const user=await admin.auth().getUser(uid);
await admin.auth().setCustomUserClaims(uid,{...(user.customClaims||{}),role:'admin'});
await admin.firestore().doc(`users/${uid}`).set({role:'admin',active:true,uid,email:user.email||'',name:user.displayName||'Administrator',updatedAt:admin.firestore.FieldValue.serverTimestamp()},{merge:true});
console.log(`Admin provisioned: ${uid}`);
await admin.app().delete();
