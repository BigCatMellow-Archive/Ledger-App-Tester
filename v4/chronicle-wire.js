'use strict';
function downloadRecovery(){const blob=new Blob([corruptRaw],{type:'text/plain'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`ledger-recovery-${new Date().toISOString().slice(0,10)}.txt`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function resetRecovery(){if(!confirm('Reset the unreadable local Ledger data? Download a backup first if you may need it.'))return;localStorage.removeItem(STORAGE_KEY);state=loadState();render()}

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
