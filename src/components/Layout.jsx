import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Activity, ClipboardList, LayoutDashboard, LogOut, PlusCircle, ShieldCheck } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Layout() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  async function logout() {
    await signOut(auth);
    navigate('/login');
  }
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink to="/" className="brand"><span className="brand-mark"><Activity size={21} /></span><span>FixMyCampus<small>Campus care, connected</small></span></NavLink>
        <div className="nav-label">WORKSPACE</div>
        <nav className="nav-list">
          <NavLink to="/" end><LayoutDashboard size={18} /> Overview</NavLink>
          <NavLink to="/complaints"><ClipboardList size={18} /> My complaints</NavLink>
          <NavLink to="/new"><PlusCircle size={18} /> Submit a complaint</NavLink>
          {profile?.role === 'admin' && <NavLink to="/admin"><ShieldCheck size={18} /> Admin dashboard</NavLink>}
        </nav>
        <div className="sidebar-bottom"><div className="avatar">{(profile?.displayName || user?.email || 'U').slice(0, 1).toUpperCase()}</div><div className="user-meta"><strong>{profile?.displayName || 'Campus member'}</strong><span>{user?.email}</span><span className="role-pill">{profile?.role || 'student'}</span></div><button className="icon-button" onClick={logout} aria-label="Sign out" title="Sign out"><LogOut size={18} /></button></div>
      </aside>
      <main className="main-area">
        <header className="topbar"><div><span className="eyebrow">CAMPUS OPERATIONS</span><strong>Smart Complaint Portal</strong></div><div className="topbar-right"><span className="online-dot" /> Service portal</div></header>
        <div className="page-content"><Outlet /></div>
        <footer className="footer">FixMyCampus · Built for a better campus experience</footer>
      </main>
    </div>
  );
}