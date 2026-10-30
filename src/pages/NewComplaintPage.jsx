import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, MapPin, Send } from 'lucide-react';
import { createComplaint, CATEGORIES, PRIORITIES } from '../lib/complaints.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function NewComplaintPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', category: 'Other', location: '', priority: 'Medium' });
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  function update(event) { setForm((old) => ({ ...old, [event.target.name]: event.target.value })); }
  async function submit(event) {
    event.preventDefault(); setError(''); setBusy(true);
    try {
      await createComplaint({ ...form, user, photo });
      navigate('/complaints', { state: { success: 'Complaint submitted successfully.' } });
    } catch (err) { setError(err.message || 'Could not submit complaint.'); }
    finally { setBusy(false); }
  }
  return <div className="stack-lg"><div className="page-title"><span className="eyebrow">REPORT AN ISSUE</span><h1>Submit a complaint</h1><p>Describe the issue clearly so the campus team can find and fix it.</p></div><form className="panel form-panel" onSubmit={submit}>
    {error && <div className="alert error">{error}</div>}
    <div className="form-section-title"><span className="step-number">01</span><div><h2>Issue details</h2><p>Tell us what needs attention.</p></div></div>
    <label>Complaint title <span className="required">*</span><input name="title" value={form.title} onChange={update} required maxLength={100} placeholder="e.g. Water leak near science block" /><small>Keep it short and specific.</small></label>
    <div className="two-col"><label>Category <span className="required">*</span><select name="category" value={form.category} onChange={update}>{CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></label><label>Priority <span className="required">*</span><select name="priority" value={form.priority} onChange={update}>{PRIORITIES.map((priority) => <option key={priority}>{priority}</option>)}</select><small>Use Urgent only for time-sensitive safety or service issues.</small></label></div>
    <label>Campus location <span className="required">*</span><div className="input-with-icon"><MapPin size={18} /><input name="location" value={form.location} onChange={update} required maxLength={160} placeholder="Building, floor, room, or landmark" /></div></label>
    <label>Description <span className="required">*</span><textarea name="description" value={form.description} onChange={update} required maxLength={2000} rows={5} placeholder="What happened? When did you notice it? Include useful details." /><small>{form.description.length}/2000 characters</small></label>
    <div className="form-section-title separated"><span className="step-number">02</span><div><h2>Add a photo <span className="optional">(optional)</span></h2><p>A clear photo can help the team understand the problem.</p></div></div>
    <label className="upload-box"><ImagePlus size={25} /><strong>{photo ? photo.name : 'Choose an image'}</strong><span>JPG, PNG, WebP · up to 5 MB</span><input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} /></label>
    <div className="form-actions"><button type="button" className="button secondary" onClick={() => navigate(-1)}>Cancel</button><button className="button" disabled={busy}><Send size={17} /> {busy ? 'Submitting…' : 'Submit complaint'}</button></div>
    <p className="privacy-note">Do not upload images containing private documents, faces without consent, or other sensitive information.</p>
  </form></div>;
}