import {
  addDoc, collection, doc, getDocs, limit, orderBy, query, serverTimestamp,
  updateDoc, where,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../firebase.js';

export const CATEGORIES = [
  'Electrical', 'Plumbing / Water', 'Furniture', 'Cleanliness',
  'Internet / IT', 'Classroom', 'Hostel', 'Safety', 'Other',
];
export const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];
export const STATUSES = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

export async function createComplaint({ user, title, description, category, location, priority, photo }) {
  if (!user) throw new Error('Please sign in before submitting a complaint.');
  if (!title.trim() || !description.trim() || !location.trim()) {
    throw new Error('Title, description, and location are required.');
  }
  if (title.trim().length > 100 || description.trim().length > 2000) {
    throw new Error('Title must be under 100 characters and description under 2,000 characters.');
  }

  let photoURL = '';
  let photoPath = '';
  if (photo) {
    if (!photo.type.startsWith('image/')) throw new Error('Please select an image file.');
    if (photo.size > 5 * 1024 * 1024) throw new Error('Image must be 5 MB or smaller.');
    photoPath = `complaint-photos/${user.uid}/${crypto.randomUUID()}-${photo.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const imageRef = ref(storage, photoPath);
    await uploadBytes(imageRef, photo, { contentType: photo.type });
    photoURL = await getDownloadURL(imageRef);
  }

  const docRef = await addDoc(collection(db, 'complaints'), {
    title: title.trim(),
    description: description.trim(),
    category,
    location: location.trim(),
    priority,
    status: 'Pending',
    createdBy: user.uid,
    reporterEmail: user.email || '',
    photoURL,
    photoPath,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    statusHistory: [{ status: 'Pending', note: 'Complaint submitted', at: new Date().toISOString() }],
  });
  return docRef.id;
}

export async function getMyComplaints(uid) {
  const q = query(
    collection(db, 'complaints'),
    where('createdBy', '==', uid),
    orderBy('createdAt', 'desc'),
    limit(100),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function getAllComplaints() {
  const q = query(collection(db, 'complaints'), orderBy('createdAt', 'desc'), limit(500));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function changeComplaintStatus(complaint, status, note = '') {
  const history = Array.isArray(complaint.statusHistory) ? complaint.statusHistory : [];
  await updateDoc(doc(db, 'complaints', complaint.id), {
    status,
    adminNote: note.trim(),
    updatedAt: serverTimestamp(),
    statusHistory: [...history, { status, note: note.trim(), at: new Date().toISOString() }],
  });
}