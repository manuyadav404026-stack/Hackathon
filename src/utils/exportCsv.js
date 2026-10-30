export function exportComplaintsCsv(rows){
 const cols=['complaintId','title','student','category','location','priority','status','department','createdAt','updatedAt'];
 const esc=v=>`"${String(v??'').replaceAll('"','""')}"`;
 const data=rows.map(r=>[r.complaintId,r.title,r.studentInfo?.name,r.category,r.location,r.priority,r.status,r.assignedDepartment,r.createdAt?.toDate?.()?.toISOString?.()||'',r.updatedAt?.toDate?.()?.toISOString?.()||'']);
 const csv=[cols.map(esc).join(','),...data.map(x=>x.map(esc).join(','))].join('\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`fixmycampus-complaints-${new Date().toISOString().slice(0,10)}.csv`;a.click();URL.revokeObjectURL(url);
}
