import { Link } from 'react-router-dom';
import { firebaseSetupMessage } from '../firebase.js';

export default function SetupPage() {
  return <div className="center-page"><section className="panel narrow"><div className="brand-mark large">F</div><h1>Connect Firebase</h1><p>Before using FixMyCampus, add your Firebase web app configuration to <code>.env.local</code> in the project root.</p><pre>{firebaseSetupMessage || 'Check your Firebase environment values.'}</pre><ol><li>Open Firebase Console → Project settings → Your apps.</li><li>Copy the web app configuration values into `.env.local` using the `VITE_` names in `.env.example`.</li><li>Enable Email/Password in Authentication, create Firestore, and enable Storage.</li><li>Restart the Vite server.</li></ol><p className="muted">Never put service-account credentials in a Vite environment file.</p><Link className="button secondary" to="/">Try again</Link></section></div>;
}