import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock3, Plus, ShieldAlert, TrendingUp } from 'lucide-react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase.js';
import { useAuth } from '../context/AuthContext.jsx';

function dateLabel(value) {
  if (!value) return 'Just now';
  const date = value?.toDate ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? 'Recently' : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!user) return undefined;
    return onSnapshot(query(collection(db, 'complaints'), where('createdBy', '==', user.uid)), (snapshot) => {
      setComplaints(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })).sort((a, b) => {
        const av = a.createdAt?.toMillis?.() || 0; const bv = b.createdAt?.toMillis?.() || 0; return bv - av;
      }));
      setError('');
    }, (err) => setError(err.message));
  }, [user]);
  const pending = complaints.filter((item) => item.status === 'Pending').length;
  const progress = complaints.filter((item) => item.status === 'In Progress').length;
  const resolved = complaints.filter((item) => item.status === 'Resolved').length;
  const recent = complaints.slice(0, 5);
  return <div className="stack-lg">
    <section className="welcome-banner"><div><span className="eyebrow light">CAMPUS CARE CENTER</span><h1>Hello, {(profile?.displayName || user?.email?.split('@')[0] || 'there').split(' ')[0]} 👋</h1><p>See something that needs attention? Tell us about it and follow every update.</p><Link className="button white-button" to="/new"><Plus size={18} /> Submit a complaint</Link></div><div className="banner-orb"><ShieldAlert size={70} strokeWidth={1.2} /></div></section>
    {error && <div className="alert error">Could not load all complaint data: {error}. If this is a Firestore index error, follow the link in the browser console.</div>}
    <section className="stats-grid">
      <Stat icon={<ClipboardIcon />} label="Total submitted" value={complaints.length} tone="blue" />
      <Stat icon={<Clock3 />} label="Pending review" value={pending} tone="amber" />
      <Stat icon={<TrendingUp />} label="In progress" value={progress} tone="purple" />
      <Stat icon={<CheckCircle2 />} label="Resolved" value={resolved} tone="green" />
    </section>
    <section className="panel">
      <div className="section-heading"><div><span className="eyebrow">YOUR ACTIVITY</span><h2>Recent complaints</h2></div><Link className="text-link" to="/complaints">View all <ArrowRight size={16} /></Link></div>
      {recent.length === 0 ? <div className="empty-state"><div className="empty-icon"><ShieldAlert size={25} /></div><h3>No complaints yet</h3><p>Submit your first report and help improve your campus.</p><Link className="button" to="/new">Create a complaint</Link></div> : <div className="table-wrap"><table><thead><tr><th>Issue</th><th>Category</th><th>Submitted</th><th>Status</th></tr></thead><tbody>{recent.map((item) => <tr key={item.id}><td><strong>{item.title}</strong><small>{item.location}</small></td><td>{item.category}</td><td>{dateLabel(item.createdAt)}</td><td><Status status={item.status} /></td></tr>)}</tbody></table></div>}
    </section>
    <p className="privacy-note">Only your own reports are shown here. Please avoid including sensitive personal information in complaint descriptions.</p>
  </div>;
}
function ClipboardIcon() { return <ShieldAlert size={20} />; }
function Stat({ icon, label, value, tone }) { return <div className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div><span>{label}</span><strong>{value}</strong></div></div>; }
export function Status({ status = 'Pending' }) { const className = status.toLowerCase().replace(/\s+/g, '-'); return <span className={`status status-${className}`}>{status}</span>; }