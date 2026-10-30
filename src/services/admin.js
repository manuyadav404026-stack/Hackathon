import {getFunctions,httpsCallable} from 'firebase/functions';import {app} from '../firebase';
const functions=getFunctions(app);
export const setUserActive=async(uid,active)=>httpsCallable(functions,'setUserActive')({uid,active});
export const provisionAdmin=async(uid)=>httpsCallable(functions,'provisionAdmin')({uid});
