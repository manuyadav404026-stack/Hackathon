import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw, Search } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { changeComplaintStatus, getAllComplaints, STATUSES } from '../lib/complaints.js';
import { Status } from './DashboardPage.jsx';

export default function AdminPage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [busyId, setBusyId] = useState('');
  const [error, setError] = useState('');
  const [noteDrafts, setNoteDrafts] = useState({});
  const load = useCallback(async () => {
    setError('');
    try { setItems(await getAllComplaints()); } catch (err) { setError(err.message); }
  }, []);
  useEffect(() => { load(); }, [load]);
  const filtered = items.filter((item) => (statusFilter === 'All' || item.status === statusFilter) && `${item.title} ${item.location} ${item.category} ${item.reporterEmail}`.toLowerCase().includes(search.toLowerCase()));
  const chartData = useMemo(() => ['Pending', 'In Progress', 'Resolved', 'Rejected'].map((status) => ({ status, count: items.filter((item) => item.status === status).length })), [items]);
  async function updateStatus(item, nextStatus) {
    setBusyId(item.id); setError('');
    try {
      await changeComplaintStatus(item, nextStatus, noteDrafts[item.id] || '');
      await load();
    } catch (err) { setError(err.message); }
    finally { setBusyId(''); }
  }
  return <div className="stack-lg"><div className="page-title page-title-row"><div><span className="eyebrow">CAMPUS OPERATIONS</span><h1>Admin dashboard</h1><p>Review reports, prioritize work, and keep students updated.</p></div><button className="button secondary" onClick={load}><RefreshCw size={17} /> Refresh</button></div>
    {error && <div className="alert error">{error}</div>}
    <div className="stats-grid admin-stats"><div className="stat-card"><div className="stat-icon blue">#</div><div><span>Total reports</span><strong>{items.length}</strong></div></div>{chartData.slice(0, 3).map((item) => <div className="stat-card" key={item.status}><div className="stat-icon amber">●</div><div><span>{item.status}</span><strong>{item.count}</strong></div></div>)}</div>
    <section className="panel"><div className="section-heading"><div><span className="eyebrow">OVERVIEW</span><h2>Complaint status breakdown</h2></div></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="status" axisLine={false} tickLine={false} /><YAxis allowDecimals={false} axisLine={false} tickLine={false} /><Tooltip /><Bar dataKey="count" fill="#2f78d0" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></section>
    <section className="panel"><div className="section-heading"><div><span className="eyebrow">INBOX</span><h2>All complaints</h2></div><span className="muted">{filtered.length} shown</span></div><div className="filters"><div className="search-field"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title, location, reporter..." /></div><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option>All</option>{STATUSES.map((status) => <option key={status}>{status}</option>)}</select></div>
      {filtered.length === 0 ? <div className="empty-state"><h3>No complaints found</h3><p>New reports will appear here when students submit them.</p></div> : <div className="admin-list">{filtered.map((item) => <article className="admin-complaint" key={item.id}><div className="admin-complaint-head"><div><h3>{item.title}</h3><p>{item.category} · {item.location} · {item.reporterEmail}</p></div><Status status={item.status} /></div><p className="admin-description">{item.description}</p><div className="admin-controls"><label>Update status<select value={item.status} disabled={busyId === item.id} onChange={(e) => updateStatus(item, e.target.value)}>{STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label><label>Update note<input value={noteDrafts[item.id] ?? item.adminNote ?? ''} onChange={(e) => setNoteDrafts((old) => ({ ...old, [item.id]: e.target.value }))} maxLength={500} placeholder="Optional note for the student" /></label></div>{item.photoURL && <a className="text-link" href={item.photoURL} target="_blank" rel="noreferrer">View attached photo</a>}</article>)}</div>}
    </section></div>;
}