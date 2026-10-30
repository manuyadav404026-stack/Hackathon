import { Navigate, Route, Routes } from 'react-router-dom';
import { firebaseConfigured } from './firebase.js';
import { useAuth } from './context/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import SetupPage from './pages/SetupPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import NewComplaintPage from './pages/NewComplaintPage.jsx';
import ComplaintsPage from './pages/ComplaintsPage.jsx';
import AdminPage from './pages/AdminPage.jsx';

export default function App() {
  const { user } = useAuth();
  if (!firebaseConfigured) return <Routes><Route path="*" element={<SetupPage />} /></Routes>;
  return <Routes>
    <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
    <Route path="/register" element={user ? <Navigate to="/" replace /> : <RegisterPage />} />
    <Route element={<ProtectedRoute />}><Route element={<Layout />}>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/complaints" element={<ComplaintsPage />} />
      <Route path="/new" element={<NewComplaintPage />} />
    </Route></Route>
    <Route element={<ProtectedRoute adminOnly />}><Route element={<Layout />}><Route path="/admin" element={<AdminPage />} /></Route></Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}