import {doc,getDoc,updateDoc,collection,query,where,onSnapshot,serverTimestamp} from 'firebase/firestore';
import {db} from '../firebase';
export async function getUser(uid){const s=await getDoc(doc(db,'users',uid));return s.exists()?{uid:s.id,...s.data()}:null}
export const updateUser=(uid,data)=>updateDoc(doc(db,'users',uid),{...data,updatedAt:serverTimestamp()});
export function listenStudents(cb){return onSnapshot(query(collection(db,'users'),where('role','==','student')),s=>cb(s.docs.map(d=>({id:d.id,...d.data()}))));}
