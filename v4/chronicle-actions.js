'use strict';
function selectCaptureKind(kind){
  captureKind=kind;
  document.querySelectorAll('[data-capture-kind]').forEach(b=>b.classList.toggle('selected',b.dataset.captureKind===kind));
  $('capturePhaseField').hidden=kind==='NOTE';$('captureDetailFields').hidden=kind!=='EXECUTION';
}
function openCapture(kind='CHECKLIST'){
  if(!activeProject()){openProjectEditor();return}
  $('captureForm').reset();selectCaptureKind(kind);openDialog('captureDialog');
}
function saveCapture(event){
  event.preventDefault();const p=activeProject();if(!p)return;
  const title=$('captureTitle').value.trim();if(!title)return;
  const before=snapshot();const t=now();
  const item={id:uid('i'),p:p.id,kind:captureKind,status:'OPEN',phase:$('capturePhase').value.trim(),title,workedAt:t,createdAt:t,notes:'',notations:[],outcome:$('captureOutcome').value.trim(),inputs:$('captureInputs').value.trim(),acceptance:$('captureAcceptance').value.trim(),dependencies:$('captureDependencies').value.trim(),boundary:'',verification:'',stopCondition:'',completedAt:'',link:'',subtasks:[]};
  state.items.unshift(item);touchProject(p,t);addLog(`Captured: ${title}`,item.id,p.id);closeDialog(event.target);persist(captureKind==='NOTE'?'Note added':'Task added',before);
}

function openProjectEditor(id=''){
  const p=id?state.projects.find(x=>x.id===id):null;
  $('projectDialogTitle').textContent=p?'Edit project':'New project';$('projectId').value=p?.id||'';$('projectTitleInput').value=p?.title||'';$('projectDescriptionInput').value=p?.description||'';$('projectLinksInput').value=normalizeLinks(p?.links).map(l=>l.label?`${l.label} | ${l.url}`:l.url).join('\n');
  const mode=p?.mode==='ROADMAP'?'ROADMAP':'LIST';document.querySelectorAll('input[name="projectMode"]').forEach(r=>r.checked=r.value===mode);
  const f=p?.framing||{};$('framingCurrent').value=f.currentReality||'';$('framingDone').value=f.done||'';$('framingProof').value=f.proof||'';$('framingScope').value=f.inScope||'';$('framingNotDoing').value=f.notDoing||'';$('framingEffort').value=f.effortLimit||'';$('framingRisk').value=f.risk||'';
  openDialog('projectDialog');
}
function saveProject(event){
  event.preventDefault();const before=snapshot();let p=state.projects.find(x=>x.id===$('projectId').value);const created=!p;const t=now();
  if(!p){p={id:uid('p'),createdAt:t,workedAt:t,links:[],framing:{}};state.projects.push(p);state.activeProject=p.id}
  p.title=$('projectTitleInput').value.trim()||'Untitled project';p.description=$('projectDescriptionInput').value.trim();p.links=parseLinks($('projectLinksInput').value);p.mode=document.querySelector('input[name="projectMode"]:checked')?.value||'LIST';p.workedAt=t;p.framing={currentReality:$('framingCurrent').value.trim(),done:$('framingDone').value.trim(),proof:$('framingProof').value.trim(),inScope:$('framingScope').value.trim(),notDoing:$('framingNotDoing').value.trim(),effortLimit:$('framingEffort').value.trim(),risk:$('framingRisk').value.trim()};
  addLog(`${created?'Project created':'Project updated'}: ${p.title}`,'',p.id);closeDialog(event.target);persist(created?'Project created':'Project updated',before);
}

function setTaskStatus(id,status){
  const item=state.items.find(i=>i.id===id&&i.kind!=='NOTE');if(!item||item.status===status)return;
  const before=snapshot();const prior=item.status;const t=now();item.status=status;item.workedAt=t;item.completedAt=status==='DONE'?t:'';touchProject(state.projects.find(p=>p.id===item.p),t);
  const verbs={ACTIVE:'Started',DONE:'Completed',OPEN:prior==='DONE'?'Reopened':'Moved to open',BLOCKED:'Blocked'};addLog(`${verbs[status]||'Updated'}: ${item.title}`,item.id,item.p);persist(`${status==='DONE'?'Completed':status==='ACTIVE'?'Started':'Updated'} task`,before);
}
function openTaskEditor(id,focusNotation=false){
  const item=state.items.find(i=>i.id===id&&i.kind!=='NOTE');if(!item)return;
  $('taskId').value=item.id;$('taskKindLabel').textContent=item.kind==='EXECUTION'?'DETAILED TASK':'TASK';$('taskTitleInput').value=item.title||'';$('taskStatusInput').value=item.status||'OPEN';$('taskPhaseInput').value=item.phase||'';$('taskNotesInput').value=item.notes||'';$('taskLinkInput').value=item.link||'';$('taskOutcomeInput').value=item.outcome||'';$('taskInputsInput').value=item.inputs||'';$('taskDependenciesInput').value=item.dependencies||'';$('taskBoundaryInput').value=item.boundary||'';$('taskAcceptanceInput').value=item.acceptance||'';$('taskVerificationInput').value=item.verification||'';$('taskStopInput').value=item.stopCondition||'';$('taskNewNotation').value='';
  renderSubtaskEditor(item.subtasks);renderNotationEditor(item);openDialog('taskDialog');
  if(focusNotation)setTimeout(()=>$('taskNewNotation').focus({preventScroll:true}),40);
}
function renderSubtaskEditor(subtasks){$('subtaskEditor').innerHTML=normalizeSubtasks({subtasks}).map(sub=>subtaskRowHtml(sub)).join('')}
function subtaskRowHtml(sub={id:uid('s'),text:'',done:false}){return `<div class="subtask-row" data-subtask-id="${esc(sub.id||uid('s'))}"><input type="checkbox" ${sub.done?'checked':''} aria-label="Step complete"><input type="text" value="${esc(sub.text||'')}" aria-label="Checklist step"><button type="button" data-action="remove-subtask">Remove</button></div>`}
function addSubtask(){ $('subtaskEditor').insertAdjacentHTML('beforeend',subtaskRowHtml());$('subtaskEditor').lastElementChild?.querySelector('input[type="text"]')?.focus() }
function collectSubtasks(){return [...$('subtaskEditor').querySelectorAll('.subtask-row')].map(row=>({id:row.dataset.subtaskId||uid('s'),text:row.querySelector('input[type="text"]')?.value.trim()||'',done:!!row.querySelector('input[type="checkbox"]')?.checked})).filter(s=>s.text)}
function renderNotationEditor(item){
  const notes=normalizeNotations(item).sort((a,b)=>String(b.updatedAt||b.createdAt).localeCompare(String(a.updatedAt||a.createdAt)));
  $('taskNotationList').innerHTML=notes.length?notes.map(note=>`<div class="notation-row" data-notation-id="${esc(note.id)}"><div><small>${esc(dateTimeLabel(note.updatedAt||note.createdAt))}${note.updatedAt?' · edited':''}</small><p>${esc(note.text)}</p></div><button type="button" data-action="delete-notation">Delete</button></div>`).join(''):'<div class="context-empty">No timestamped task notes yet.</div>';
}
function saveTask(event){
  event.preventDefault();const item=state.items.find(i=>i.id===$('taskId').value);if(!item)return;const before=snapshot();const prior=item.status;const t=now();
  item.title=$('taskTitleInput').value.trim()||'Untitled task';item.status=$('taskStatusInput').value;item.phase=$('taskPhaseInput').value.trim();item.notes=$('taskNotesInput').value.trim();item.link=safeHttpUrl($('taskLinkInput').value);item.outcome=$('taskOutcomeInput').value.trim();item.inputs=$('taskInputsInput').value.trim();item.dependencies=$('taskDependenciesInput').value.trim();item.boundary=$('taskBoundaryInput').value.trim();item.acceptance=$('taskAcceptanceInput').value.trim();item.verification=$('taskVerificationInput').value.trim();item.stopCondition=$('taskStopInput').value.trim();item.subtasks=collectSubtasks();item.workedAt=t;item.completedAt=item.status==='DONE'?(item.completedAt||t):'';
  const newNote=$('taskNewNotation').value.trim();if(newNote){item.notations=normalizeNotations(item);item.notations.push({id:uid('n'),text:newNote,createdAt:t,updatedAt:''})}
  touchProject(state.projects.find(p=>p.id===item.p),t);if(prior!==item.status)addLog(`${item.status==='DONE'?'Completed':item.status==='ACTIVE'?'Started':item.status==='BLOCKED'?'Blocked':'Reopened'}: ${item.title}`,item.id,item.p);else addLog(`Task updated: ${item.title}`,item.id,item.p);
  closeDialog(event.target);persist('Task saved',before);
}
function deleteTask(){
  const id=$('taskId').value;const item=state.items.find(i=>i.id===id);if(!item||!confirm(`Delete “${item.title}”?`))return;const before=snapshot();state.items=state.items.filter(i=>i.id!==id);touchProject(state.projects.find(p=>p.id===item.p));addLog(`Deleted task: ${item.title}`,'',item.p);closeDialog($('taskDialog'));persist('Task deleted',before);
}
function deleteNotation(button){
  const id=$('taskId').value;const noteId=button.closest('[data-notation-id]')?.dataset.notationId;const item=state.items.find(i=>i.id===id);if(!item||!noteId)return;const before=snapshot();item.notations=normalizeNotations(item).filter(n=>n.id!==noteId);touchProject(state.projects.find(p=>p.id===item.p));persist('Task note deleted',before);openTaskEditor(id);
}

function openNoteEditor(id=''){
  const p=activeProject();if(!p)return;const note=id?state.items.find(i=>i.id===id&&i.kind==='NOTE'):null;
  $('noteId').value=note?.id||'';$('noteBody').value=note?.title||'';$('noteDialogTitle').textContent=note?'Edit note':'New note';$('noteDelete').hidden=!note;openDialog('noteDialog');
}
function saveNote(event){
  event.preventDefault();const body=$('noteBody').value.trim();if(!body)return;const p=activeProject();if(!p)return;const before=snapshot();const t=now();let note=state.items.find(i=>i.id===$('noteId').value&&i.kind==='NOTE');
  if(note){note.title=body;note.workedAt=t}else{note={id:uid('i'),p:p.id,kind:'NOTE',status:'OPEN',phase:'',title:body,workedAt:t,createdAt:t,notes:'',notations:[],outcome:'',inputs:'',acceptance:'',dependencies:'',boundary:'',verification:'',stopCondition:'',completedAt:'',link:'',subtasks:[]};state.items.push(note)}
  touchProject(p,t);addLog(`${$('noteId').value?'Note updated':'Note added'}: ${body.slice(0,60)}`,note.id,p.id);closeDialog(event.target);persist('Note saved',before);
}
function deleteNote(){
  const id=$('noteId').value;const note=state.items.find(i=>i.id===id&&i.kind==='NOTE');if(!note)return;const before=snapshot();state.items=state.items.filter(i=>i.id!==id);touchProject(state.projects.find(p=>p.id===note.p));closeDialog($('noteDialog'));persist('Note deleted',before);
}

function openJournalEditor(id=''){
  const p=activeProject();if(!p)return;const entry=id?state.journal.find(j=>j.id===id&&j.p===p.id):null;
  $('journalId').value=entry?.id||'';$('journalBody').value=entry?.body||'';$('journalDialogTitle').textContent=entry?'Edit entry':'New entry';$('journalDelete').hidden=!entry;openDialog('journalDialog');
}
function saveJournal(event){
  event.preventDefault();const body=$('journalBody').value.trim();if(!body)return;const p=activeProject();if(!p)return;const before=snapshot();const t=now();let entry=state.journal.find(j=>j.id===$('journalId').value&&j.p===p.id);
  if(entry){entry.body=body;entry.updatedAt=t}else{entry={id:uid('j'),p:p.id,body,createdAt:t,updatedAt:t};state.journal.push(entry)}
  touchProject(p,t);addLog(`${$('journalId').value?'Journal updated':'Journal entry'}: ${body.slice(0,60)}`,'',p.id);closeDialog(event.target);persist('Journal saved',before);
}
function deleteJournal(){
  const id=$('journalId').value;const entry=state.journal.find(j=>j.id===id);if(!entry)return;const before=snapshot();state.journal=state.journal.filter(j=>j.id!==id);touchProject(state.projects.find(p=>p.id===entry.p));closeDialog($('journalDialog'));persist('Journal entry deleted',before);
}

function openWorklog(){if(!activeProject())return;$('worklogForm').reset();openDialog('worklogDialog')}
function saveWorklog(event){event.preventDefault();const summary=$('worklogSummary').value.trim();const p=activeProject();if(!summary||!p)return;const before=snapshot();touchProject(p);addLog(summary,'',p.id);closeDialog(event.target);persist('Work logged',before)}
function renderHistoryDialog(){
  const logs=[...state.worklog].sort((a,b)=>String(b.whenAt||'').localeCompare(String(a.whenAt||''))).slice(0,120);
  $('historyList').innerHTML=logs.length?logs.map(log=>{const p=state.projects.find(x=>x.id===log.p);return `<div class="history-item"><time>${esc(dateTimeLabel(log.whenAt))}</time><div><p>${esc(log.summary||'Work recorded')}</p><small>${esc(p?.title||'Ledger')}</small></div></div>`}).join(''):'<div class="context-empty">No work history yet.</div>';
  openDialog('historyDialog');
}
function renderProjectsDialog(){renderProjectIndex(activeProject());openDialog('projectsDialog')}

function exportMarkdown(){
  const p=activeProject();if(!p)return;const mine=state.items.filter(i=>i.p===p.id);const tasks=mine.filter(i=>i.kind!=='NOTE');const notes=mine.filter(i=>i.kind==='NOTE');const journal=state.journal.filter(j=>j.p===p.id);const f=p.framing||{};
  const lines=[`# ${p.title||'Untitled project'}`,p.description?`\n${p.description}\n`:'',`\n## Project brief`,...Object.entries({"Current reality":f.currentReality,"Definition of done":f.done,"Final proof":f.proof,"In scope":f.inScope,"Not doing":f.notDoing,"Effort limit":f.effortLimit,"Highest-risk unknown":f.risk}).filter(([,v])=>v).map(([k,v])=>`- **${k}:** ${v}`),`\n## Tasks`,...tasks.map(item=>`- [${item.status==='DONE'?'x':' '}] ${item.title}${item.status!=='OPEN'&&item.status!=='DONE'?` _(${item.status})_`:''}`),`\n## Notes`,...notes.map(n=>`- ${n.title}`),`\n## Journal`,...journal.sort((a,b)=>String(a.createdAt).localeCompare(String(b.createdAt))).map(j=>`- ${dateTimeLabel(j.createdAt)} — ${j.body}`),''];
  const blob=new Blob([lines.join('\n')],{type:'text/markdown'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`${(p.title||'ledger-project').replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'').toLowerCase()||'ledger-project'}.md`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);closeDialog($('toolsDialog'));
}
async function importMarkdown(file){
  const text=await file.text();const before=snapshot();const t=now();const title=(text.match(/^#\s+(.+)$/m)?.[1]||file.name.replace(/\.[^.]+$/,'')||'Imported project').trim();const p={id:uid('p'),title,description:'Imported from Markdown',mode:'LIST',createdAt:t,workedAt:t,links:[],framing:{}};state.projects.push(p);state.activeProject=p.id;
  const taskLines=text.split('\n').map(line=>line.match(/^\s*-\s*\[([ xX])\]\s+(.+)$/)).filter(Boolean);taskLines.forEach(m=>state.items.push({id:uid('i'),p:p.id,kind:'CHECKLIST',status:m[1].toLowerCase()==='x'?'DONE':'OPEN',phase:'',title:m[2].trim(),createdAt:t,workedAt:t,notes:'',notations:[],outcome:'',inputs:'',acceptance:'',dependencies:'',boundary:'',verification:'',stopCondition:'',completedAt:m[1].toLowerCase()==='x'?t:'',link:'',subtasks:[]}));
  const remainder=text.split('\n').filter(line=>!/^\s*-\s*\[[ xX]\]/.test(line)&&!/^#/.test(line)).join('\n').trim();if(remainder)state.items.push({id:uid('i'),p:p.id,kind:'NOTE',status:'OPEN',phase:'',title:remainder,createdAt:t,workedAt:t,notes:'',notations:[],subtasks:[]});addLog(`Imported project: ${title}`,'',p.id);persist('Markdown imported',before);
}
