import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { getMyComplaints } from '../lib/complaints.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Status } from './DashboardPage.jsx';

function formatDate(value) {
  const date = value?.toDate ? value.toDate() : value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date.toLocaleString() : 'Recently';
}
export default function ComplaintsPage() {
  const { user } = useAuth();
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getMyComplaints(user.uid).then(setItems).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, [user.uid]);
  const filtered = items.filter((item) => (status === 'All' || item.status === status) && `${item.title} ${item.location} ${item.category}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="stack-lg"><div className="page-title page-title-row"><div><span className="eyebrow">TRACK PROGRESS</span><h1>My complaints</h1><p>Follow the status of every issue you've reported.</p></div><Link className="button" to="/new"><Plus size={18} /> New complaint</Link></div>
    {location.state?.success && <div className="alert success">{location.state.success}</div>}
    {error && <div className="alert error">{error}</div>}
    <section className="panel">
      <div className="filters"><div className="search-field"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search complaints..." /></div><select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status"><option>All</option><option>Pending</option><option>In Progress</option><option>Resolved</option><option>Rejected</option></select></div>
      {loading ? <div className="loading-line">Loading your complaints…</div> : filtered.length === 0 ? <div className="empty-state"><h3>No matching complaints</h3><p>Try another filter or submit a new complaint.</p><Link className="button" to="/new">Submit a complaint</Link></div> : <div className="complaint-list">{filtered.map((item) => <article className="complaint-card" key={item.id}><div className="complaint-main"><div className="complaint-icon">FC</div><div className="complaint-info"><div className="complaint-title-row"><h3>{item.title}</h3><Status status={item.status} /></div><p>{item.description}</p><div className="complaint-meta"><span>{item.category}</span><span>•</span><span>{item.location}</span><span>•</span><span>{formatDate(item.createdAt)}</span></div>{item.adminNote && <div className="admin-note"><strong>Team update:</strong> {item.adminNote}</div>}{Array.isArray(item.statusHistory) && item.statusHistory.length > 0 && <details className="history"><summary>Status history</summary><ol>{item.statusHistory.map((event, index) => <li key={`${event.status}-${index}`}><strong>{event.status}</strong>{event.note && ` — ${event.note}`}<small>{event.at ? new Date(event.at).toLocaleString() : ''}</small></li>)}</ol></details>}</div></div>{item.photoURL && <a className="photo-link" href={item.photoURL} target="_blank" rel="noreferrer">View attached photo</a>}</article>)}</div>}
    </section></div>;
}