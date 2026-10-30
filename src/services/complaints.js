import { collection, addDoc, doc, getDoc, query, where, orderBy, onSnapshot, serverTimestamp, updateDoc, arrayUnion, limit } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

export const categories=['Electricity','Water Supply','Cleanliness','Washroom','Classroom','Laboratory','Infrastructure','Internet and Wi-Fi','Furniture','Security','Other'];
export const priorities=['Low','Medium','High','Urgent'];
export const statuses=['Pending','Under Review','In Progress','Resolved','Rejected'];
export const departments=['Electrical','Maintenance','Housekeeping','IT Support','Security','Academic','Administration'];

const valid=(v,a)=>a.includes(v);
export async function createComplaint(data,file,user){
  if(!data.title?.trim()||!data.description?.trim()||!data.category||!data.location?.trim()) throw Error('Please complete all required fields.');
  if(!valid(data.category,categories)||!valid(data.priority,priorities)) throw Error('Invalid category or priority.');
  let imageUrl='',imagePath='';
  if(file){ if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5*1024*1024) throw Error('Image must be JPG, PNG or WEBP and under 5MB.'); const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,'_'); imagePath=`complaints/${user.uid}/${crypto.randomUUID()}-${safe}`; const r=ref(storage,imagePath); await uploadBytes(r,file,{contentType:file.type}); imageUrl=await getDownloadURL(r); }
  const complaintId=`FMC-${Date.now().toString(36).toUpperCase()}`;
  const payload={complaintId,studentUid:user.uid,studentInfo:{name:user.name,email:user.email,studentId:user.studentId||''},title:data.title.trim(),description:data.description.trim(),category:data.category,location:data.location.trim(),priority:data.priority,imageUrl,imagePath,status:'Pending',assignedDepartment:'Unassigned',adminRemarks:'',rejectionReason:'',createdAt:serverTimestamp(),updatedAt:serverTimestamp(),resolutionTimestamp:null,feedback:null,reopened:false,activity:[{status:'Pending',remark:'Complaint submitted',department:'Unassigned',at:new Date().toISOString()}]};
  const d=await addDoc(collection(db,'complaints'),payload); return {id:d.id,complaintId};
}
export const listenMyComplaints=(uid,cb)=>onSnapshot(query(collection(db,'complaints'),where('studentUid','==',uid),orderBy('createdAt','desc')),s=>cb(s.docs.map(d=>({id:d.id,...d.data()}))),e=>console.error('listenMyComplaints:',e));
export const listenAllComplaints=cb=>onSnapshot(query(collection(db,'complaints'),orderBy('createdAt','desc')),s=>cb(s.docs.map(d=>({id:d.id,...d.data()}))),e=>console.error('listenAllComplaints:',e));
export async function getComplaint(id){const s=await getDoc(doc(db,'complaints',id));return s.exists()?{id:s.id,...s.data()}:null}
export const listenComplaint=(id,cb)=>onSnapshot(doc(db,'complaints',id),s=>cb(s.exists()?{id:s.id,...s.data()}:null),e=>{console.error('listenComplaint:',e);cb(null)});
export async function updateComplaintStatus(id,status,remark='',department='Unassigned',rejectionReason=''){
  if(!valid(status,statuses)) throw Error('Invalid status.');
  if(status==='Rejected'&&!rejectionReason.trim()) throw Error('A rejection reason is required.');
  if(!valid(department,departments)&&department!=='Unassigned') throw Error('Invalid department.');
  await updateDoc(doc(db,'complaints',id),{status,adminRemarks:remark.trim(),assignedDepartment:department,rejectionReason:status==='Rejected'?rejectionReason.trim():'',updatedAt:serverTimestamp(),resolutionTimestamp:status==='Resolved'?serverTimestamp():null,activity:arrayUnion({status,remark:remark.trim(),department,rejectionReason:status==='Rejected'?rejectionReason.trim():'',at:new Date().toISOString()})});
}
export async function addFeedback(id,rating,comment){if(!Number.isInteger(rating)||rating<1||rating>5)throw Error('Rating must be between 1 and 5.');await updateDoc(doc(db,'complaints',id),{feedback:{rating,comment:comment?.trim()||'',submittedAt:new Date().toISOString()},updatedAt:serverTimestamp()});}
export async function reopenComplaint(id,reason){if(!reason?.trim())throw Error('Please provide a reopening reason.');await updateDoc(doc(db,'complaints',id),{status:'Pending',reopened:true,resolutionTimestamp:null,updatedAt:serverTimestamp(),activity:arrayUnion({status:'Pending',remark:`Reopened by student: ${reason.trim()}`,at:new Date().toISOString()})});}
