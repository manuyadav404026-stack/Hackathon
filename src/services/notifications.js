import {collection,query,where,orderBy,onSnapshot,addDoc,serverTimestamp,updateDoc,doc,writeBatch} from 'firebase/firestore';import {db} from '../firebase';
export function listenNotifications(uid,cb){return onSnapshot(query(collection(db,'notifications'),where('userId','==',uid),orderBy('createdAt','desc')),s=>cb(s.docs.map(d=>({id:d.id,...d.data()}))),e=>console.error('listenNotifications:',e));}
export const addNotification=n=>addDoc(collection(db,'notifications'),{...n,read:false,createdAt:serverTimestamp()});
export const markRead=id=>updateDoc(doc(db,'notifications',id),{read:true});
export async function markAllRead(rows){const b=writeBatch(db);rows.filter(x=>!x.read).forEach(x=>b.update(doc(db,'notifications',x.id),{read:true}));await b.commit();}
