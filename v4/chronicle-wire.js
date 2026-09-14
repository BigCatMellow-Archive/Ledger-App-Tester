'use strict';
function downloadRecovery(){const blob=new Blob([corruptRaw],{type:'text/plain'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`ledger-recovery-${new Date().toISOString().slice(0,10)}.txt`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function resetRecovery(){if(!confirm('Reset the unreadable local Ledger data? Download a backup first if you may need it.'))return;localStorage.removeItem(STORAGE_KEY);state=loadState();render()}

/*
  Chronicle is a re-entry surface, not the audit log.
  Keep exhaustive mutation history in Work history, but only surface deliberate
  context in the Chronicle. New logs carry an explicit source; legacy rows fall
  back to a conservative system-prefix filter so old data does not need migration.
*/
const CHRONICLE_SYSTEM_PREFIX=/^(Captured|Project created|Project updated|Task updated|Started|Completed|Reopened|Moved to open|Blocked|Note updated|Note added|Journal updated|Journal entry|Deleted task|Imported project):/i;
function isChronicleWorkLog(log){
  if(log?.source==='manual')return true;
  if(log?.source)return false;
  return !CHRONICLE_SYSTEM_PREFIX.test(String(log?.summary||'').trim());
}
addLog=function(summary,itemId='',projectId='',source='system'){
  const p=projectId||activeProject()?.id||'';
  state.worklog.unshift({id:uid('w'),p,itemId,whenAt:now(),summary,source});
};
saveWorklog=function(event){
  event.preventDefault();const summary=$('worklogSummary').value.trim();const p=activeProject();if(!summary||!p)return;
  const before=snapshot();touchProject(p);addLog(summary,'',p.id,'manual');closeDialog(event.target);persist('Work logged',before);
};
materialEvents=function(p,data){
  const events=[];
  data.logs.filter(isChronicleWorkLog).forEach(log=>events.push({key:`w-${log.id}`,when:log.whenAt||'',type:'WORK',tone:'work',title:log.summary||'Work recorded',body:'',action:log.itemId?{label:'Task details',id:log.itemId}:null}));
  data.journal.forEach(j=>events.push({key:`j-${j.id}`,when:j.updatedAt||j.createdAt||'',type:'JOURNAL',tone:'journal',title:j.body||'Journal entry',body:'',action:{label:'Edit entry',kind:'edit-journal',id:j.id}}));
  data.notes.forEach(n=>events.push({key:`n-${n.id}`,when:n.workedAt||n.createdAt||'',type:'NOTE',tone:'note',title:n.title||'Project note',body:'',action:{label:'Edit note',kind:'edit-note',id:n.id}}));
  data.done.forEach(t=>events.push({key:`d-${t.id}`,when:t.completedAt||t.workedAt||'',type:'PROOF',tone:'proof',title:`Completed: ${t.title||'Untitled task'}`,body:t.verification||t.acceptance||'',action:{label:'Task details',kind:'task-details',id:t.id}}));
  const seen=new Set();
  return events.sort((a,b)=>String(b.when||'').localeCompare(String(a.when||''))).filter(e=>{const sig=`${e.when}|${e.title}`;if(seen.has(sig))return false;seen.add(sig);return true});
};

document.addEventListener('click',event=>{
  const project=event.target.closest('[data-project]');if(project){state.activeProject=project.dataset.project;localStorage.setItem(STORAGE_KEY,JSON.stringify(state));document.querySelectorAll('dialog[open]').forEach(d=>d.close());render();return}
  const kind=event.target.closest('[data-capture-kind]');if(kind){selectCaptureKind(kind.dataset.captureKind);return}
  const action=event.target.closest('[data-action]')?.dataset.action;if(!action)return;
  const id=event.target.closest('[data-id]')?.dataset.id||event.target.dataset.id||'';
  if(action==='home'){document.querySelector('.main-content')?.scrollTo?.({top:0,behavior:'smooth'})}
  if(action==='projects')renderProjectsDialog();
  if(action==='new-project')openProjectEditor();
  if(action==='edit-project')openProjectEditor(activeProject()?.id||'');
  if(action==='capture')openCapture('CHECKLIST');
  if(action==='quick-task')openCapture('CHECKLIST');
  if(action==='new-note')openNoteEditor();
  if(action==='edit-note')openNoteEditor(id);
  if(action==='new-journal')openJournalEditor();
  if(action==='edit-journal')openJournalEditor(id);
  if(action==='log-work')openWorklog();
  if(action==='history')renderHistoryDialog();
  if(action==='tools')openDialog('toolsDialog');
  if(action==='theme')toggleTheme();
  if(action==='task-details')openTaskEditor(id);
  if(action==='task-note')openTaskEditor(id,true);
  if(action==='start-task')setTaskStatus(id,'ACTIVE');
  if(action==='done-task')setTaskStatus(id,'DONE');
  if(action==='reopen-task')setTaskStatus(id,'OPEN');
  if(action==='close-dialog')closeDialog(event.target);
  if(action==='add-subtask')addSubtask();
  if(action==='remove-subtask')event.target.closest('.subtask-row')?.remove();
  if(action==='delete-task')deleteTask();
  if(action==='delete-notation')deleteNotation(event.target);
  if(action==='delete-note')deleteNote();
  if(action==='delete-journal')deleteJournal();
  if(action==='export')exportMarkdown();
  if(action==='import')$('importFile').click();
  if(action==='download-recovery')downloadRecovery();
  if(action==='reset-recovery')resetRecovery();
});

$('captureForm').addEventListener('submit',saveCapture);
$('projectForm').addEventListener('submit',saveProject);
$('taskForm').addEventListener('submit',saveTask);
$('noteForm').addEventListener('submit',saveNote);
$('journalForm').addEventListener('submit',saveJournal);
$('worklogForm').addEventListener('submit',saveWorklog);
$('toastUndo').addEventListener('click',doUndo);
$('importFile').addEventListener('change',async event=>{const file=event.target.files?.[0];if(file)await importMarkdown(file);event.target.value='';closeDialog($('toolsDialog'))});
window.addEventListener('storage',event=>{if(event.key===STORAGE_KEY){state=loadState();render()}if(event.key===SYNC_STATUS_KEY||event.key===SYNC_CONNECTION_KEY)renderSync()});
document.addEventListener('keydown',event=>{
  if(event.key.toLowerCase()==='c'&&!event.ctrlKey&&!event.metaKey&&!event.altKey&&!event.target.closest('input,textarea,select,dialog')){event.preventDefault();openCapture('CHECKLIST')}
});

try{document.documentElement.dataset.theme=localStorage.getItem(THEME_KEY)==='dark'?'dark':'light'}catch(e){}
state=loadState();render();setInterval(renderSync,30000);
