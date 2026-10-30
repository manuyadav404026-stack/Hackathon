import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.js';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  async function submit(event) {
    event.preventDefault(); setError(''); setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch (err) {
      setError(err.code === 'auth/invalid-credential' ? 'Email or password is incorrect.' : err.message);
    } finally { setBusy(false); }
  }
  return <div className="auth-page"><div className="auth-art"><div className="brand-mark large">F</div><span className="eyebrow light">YOUR CAMPUS, IMPROVED</span><h1>Small fixes.<br />Better campus life.</h1><p>Report campus issues, follow progress, and help your campus team get things fixed.</p><div className="art-stat"><strong>One portal.</strong><span>Clear updates from report to resolution.</span></div></div><div className="auth-form-wrap"><form className="panel auth-form" onSubmit={submit}><span className="eyebrow">WELCOME BACK</span><h2>Sign in to FixMyCampus</h2><p className="muted">Use your campus account to continue.</p>{error && <div className="alert error">{error}</div>}<label>Email address<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required placeholder="you@college.edu" /></label><label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required minLength={6} placeholder="Your password" /></label><button className="button full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button><p className="auth-switch">New here? <Link to="/register">Create an account</Link></p></form></div></div>;
}