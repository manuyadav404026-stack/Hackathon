import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase.js';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  async function submit(event) {
    event.preventDefault(); setError(''); setBusy(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(credential.user, { displayName: name.trim() });
      navigate('/');
    } catch (err) {
      setError(err.code === 'auth/email-already-in-use' ? 'This email already has an account.' : err.message);
    } finally { setBusy(false); }
  }
  return <div className="auth-page"><div className="auth-art"><div className="brand-mark large">F</div><span className="eyebrow light">JOIN YOUR CAMPUS COMMUNITY</span><h1>Make your campus<br />work better.</h1><p>Register to submit issues and track each update in one place.</p></div><div className="auth-form-wrap"><form className="panel auth-form" onSubmit={submit}><span className="eyebrow">GET STARTED</span><h2>Create your account</h2><p className="muted">Your account starts with student access.</p>{error && <div className="alert error">{error}</div>}<label>Full name<input value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} autoComplete="name" placeholder="Your name" /></label><label>Email address<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="you@college.edu" /></label><label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" placeholder="At least 8 characters" /></label><button className="button full" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button><p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p></form></div></div>;
}