'use strict';
function render(){
  renderTheme();
  renderSync();
  if(!state){renderCorrupt();return}
  $('corruptState').hidden=true;
  const p=activeProject();
  renderProjectIndex(p);
  $('emptyState').hidden=!!p;
  $('projectSurface').hidden=!p;
  if(!p)return;
  renderProject(p);
}
function renderCorrupt(){
  $('projectSurface').hidden=true;$('emptyState').hidden=true;$('corruptState').hidden=false;
  $('corruptState').innerHTML=`<p class="micro-label">RECOVERY REQUIRED</p><h1>Ledger cannot safely read this local record.</h1><p>The raw browser data is still present. Download a copy before resetting so nothing recoverable is silently overwritten.</p><div class="system-actions"><button type="button" data-action="download-recovery">Download raw backup</button><button class="primary-button" type="button" data-action="reset-recovery">Reset local data</button></div>`;
  $('projectIndex').innerHTML='';$('projectsDialogList').innerHTML='';$('syncStatus').innerHTML='<strong>Editing blocked</strong><span>Local data needs recovery.</span>';
}
function renderProjectIndex(p){
  const html=state.projects.map((project,index)=>{
    const tasks=state.items.filter(i=>i.p===project.id&&i.kind!=='NOTE');
    const active=tasks.filter(i=>i.status==='ACTIVE').length;
    const open=tasks.filter(i=>i.status!=='DONE'&&i.status!=='ACTIVE').length;
    return `<button type="button" class="project-tab ${p&&p.id===project.id?'active':''}" data-project="${esc(project.id)}"><span>${String(index+1).padStart(2,'0')}</span><strong>${esc(project.title||'Untitled')}</strong><small>${active?`${active} live · `:''}${open} next</small></button>`;
  }).join('');
  $('projectIndex').innerHTML=html||'<span class="project-index-empty">No projects</span>';
  $('projectsDialogList').innerHTML=state.projects.map((project,index)=>`<button type="button" class="${p&&p.id===project.id?'active':''}" data-project="${esc(project.id)}"><span><strong>${String(index+1).padStart(2,'0')} · ${esc(project.title||'Untitled')}</strong><small>${esc(project.mode==='ROADMAP'?'Roadmap':'List')} · ${relativeTime(project.workedAt||project.createdAt)}</small></span><span>${p&&p.id===project.id?'●':'○'}</span></button>`).join('')||'<div class="context-empty">No projects yet.</div>';
}
function renderProject(p){
  const links=normalizeLinks(p.links);
  $('projectTitle').textContent=p.title||'Untitled project';
  $('projectDescription').textContent=p.description||'';
  $('projectDescription').hidden=!p.description;
  $('projectMeta').textContent=`${p.mode==='ROADMAP'?'ROADMAP':'PROJECT'} · UPDATED ${relativeTime(p.workedAt||p.createdAt).toUpperCase()}`;
  $('projectLinks').innerHTML=links.map(link=>`<a href="${esc(link.url)}" target="_blank" rel="noopener noreferrer">${esc(linkLabel(link))} ↗</a>`).join('');
  $('projectLinks').hidden=!links.length;

  const mine=state.items.filter(i=>i.p===p.id);
  const tasks=mine.filter(i=>i.kind!=='NOTE');
  const active=tasks.filter(i=>i.status==='ACTIVE').sort(sortRecent);
  const open=tasks.filter(i=>i.status!=='DONE'&&i.status!=='ACTIVE').sort(sortRecent);
  const done=tasks.filter(i=>i.status==='DONE').sort(sortRecent);
  const notes=mine.filter(i=>i.kind==='NOTE'&&i.status!=='DONE').sort(sortRecent);
  const journal=state.journal.filter(j=>j.p===p.id).sort(sortRecent);
  const logs=state.worklog.filter(w=>w.p===p.id).sort((a,b)=>String(b.whenAt||'').localeCompare(String(a.whenAt||'')));

  renderCheckpoint(p,active,open);
  renderChronicle(p,{tasks,active,open,done,notes,journal,logs});
  renderNextQueue(active,open);
  renderProjectBrief(p);
}
function sortRecent(a,b){return String(b.workedAt||b.updatedAt||b.completedAt||b.createdAt||'').localeCompare(String(a.workedAt||a.updatedAt||a.completedAt||a.createdAt||''))}
function renderCheckpoint(p,active,open){
  const item=active[0]||open[0]||null;
  if(!item){
    $('checkpoint').innerHTML=`<div class="checkpoint-time">NOW</div><span class="checkpoint-dot"></span><article class="checkpoint-card empty-checkpoint"><span class="micro-label">RESUME CHECKPOINT</span><h2>No open work is waiting.</h2><p>Capture the next useful step when this project moves again.</p><div class="checkpoint-actions"><button class="primary-button" type="button" data-action="capture">Capture next step</button></div></article>`;
    return;
  }
  const preview=firstTaskNote(item);const progress=taskProgress(item);const waiting=item.dependencies?`<span><strong>Waiting:</strong> ${esc(item.dependencies)}</span>`:'';const doneWhen=item.acceptance?`<span><strong>Done when:</strong> ${esc(item.acceptance)}</span>`:'';
  const primary=item.status==='ACTIVE'?`<button class="primary-button" type="button" data-action="task-details" data-id="${esc(item.id)}">Continue this work</button>`:`<button class="primary-button" type="button" data-action="start-task" data-id="${esc(item.id)}">Start this work</button>`;
  $('checkpoint').innerHTML=`<div class="checkpoint-time">NOW</div><span class="checkpoint-dot"></span><article class="checkpoint-card"><span class="micro-label">${item.status==='ACTIVE'?'RESUME CHECKPOINT':'NEXT CHECKPOINT'}</span><h2>${esc(item.title||'Untitled task')}</h2>${preview?`<p class="checkpoint-note">${esc(preview)}</p>`:''}<div class="checkpoint-context">${waiting}${doneWhen}${progress?`<span><strong>Steps:</strong> ${progress.done}/${progress.total}</span>`:''}</div><div class="checkpoint-actions">${primary}<button type="button" data-action="task-details" data-id="${esc(item.id)}">Details</button>${item.status==='ACTIVE'?`<button type="button" data-action="done-task" data-id="${esc(item.id)}">Mark done</button>`:''}</div></article>`;
}
function materialEvents(p,data){
  const events=[];
  data.logs.forEach(log=>events.push({key:`w-${log.id}`,when:log.whenAt||'',type:'WORK',tone:'work',title:log.summary||'Work recorded',body:'',action:log.itemId?{label:'Task details',id:log.itemId}:null}));
  data.journal.forEach(j=>events.push({key:`j-${j.id}`,when:j.updatedAt||j.createdAt||'',type:'JOURNAL',tone:'journal',title:j.body||'Journal entry',body:'',action:{label:'Edit entry',kind:'edit-journal',id:j.id}}));
  data.notes.forEach(n=>events.push({key:`n-${n.id}`,when:n.workedAt||n.createdAt||'',type:'NOTE',tone:'note',title:n.title||'Project note',body:'',action:{label:'Edit note',kind:'edit-note',id:n.id}}));
  data.done.forEach(t=>events.push({key:`d-${t.id}`,when:t.completedAt||t.workedAt||'',type:'PROOF',tone:'proof',title:`Completed: ${t.title||'Untitled task'}`,body:t.verification||t.acceptance||'',action:{label:'Task details',kind:'task-details',id:t.id}}));
  const seen=new Set();
  return events.sort((a,b)=>String(b.when||'').localeCompare(String(a.when||''))).filter(e=>{const sig=`${e.when}|${e.title}`;if(seen.has(sig))return false;seen.add(sig);return true});
}
function renderChronicle(p,data){
  const allEvents=materialEvents(p,data);
  const limit=matchMedia('(max-width:800px)').matches?4:10;
  const events=allEvents.slice(0,limit);
  $('chronicleEvents').innerHTML=events.length?events.map(event=>chronicleEventHtml(event)).join(''):`<div class="chronicle-empty"><strong>No material history yet.</strong><span>Work, journal entries, notes and completed proof will build this project chronicle.</span></div>`;
  $('chronicleMore').hidden=allEvents.length<=events.length;
}
function eventDateParts(value){
  const d=new Date(value||'');if(Number.isNaN(d.getTime()))return {top:'UNDATED',bottom:''};
  const today=new Date();const same=d.toDateString()===today.toDateString();
  if(same)return {top:d.toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'}),bottom:'TODAY'};
  return {top:d.toLocaleDateString(undefined,{month:'short',day:'numeric'}).toUpperCase(),bottom:d.toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'})};
}
function chronicleEventHtml(event){
  const date=eventDateParts(event.when);const action=event.action?`<button type="button" class="event-action" data-action="${esc(event.action.kind||'task-details')}" data-id="${esc(event.action.id||'')}">${esc(event.action.label)}</button>`:'';
  return `<article class="chronicle-event tone-${esc(event.tone)}"><time><strong>${esc(date.top)}</strong><span>${esc(date.bottom)}</span></time><span class="event-dot" aria-hidden="true"></span><div class="event-copy"><span class="event-type">${esc(event.type)}</span><p>${esc(event.title)}</p>${event.body?`<small>${esc(event.body)}</small>`:''}${action}</div></article>`;
}
function renderNextQueue(active,open){
  const checkpointId=(active[0]||open[0])?.id||'';
  const queue=[...active.slice(1),...open].filter(i=>i.id!==checkpointId).slice(0,10);
  $('nextCount').textContent=`${queue.length} ${queue.length===1?'ITEM':'ITEMS'}`;
  $('nextQueue').innerHTML=queue.length?queue.map((item,index)=>queueItemHtml(item,index)).join(''):`<div class="queue-empty">Nothing else is queued.</div>`;
}
function queueItemHtml(item,index){
  const status=statusLabel(item);const primary=item.status==='ACTIVE'?'task-details':'start-task';const label=item.status==='ACTIVE'?'Resume':'Start';
  return `<article class="queue-item"><span class="queue-num">${String(index+1).padStart(2,'0')}</span><div><span class="queue-state ${statusClass(item)}">${esc(status)}</span><button class="queue-title" type="button" data-action="task-details" data-id="${esc(item.id)}">${esc(item.title||'Untitled task')}</button>${item.phase?`<small>${esc(item.phase)}</small>`:''}</div><button class="queue-go" type="button" data-action="${primary}" data-id="${esc(item.id)}">${label}</button></article>`;
}
function renderProjectBrief(p){
  const f=p.framing||{};const bits=[['NOW',f.currentReality],['DONE',f.done],['RISK',f.risk]].filter(([,v])=>String(v||'').trim());
  $('projectBrief').innerHTML=bits.length?bits.map(([k,v])=>`<div><span>${esc(k)}</span><p>${esc(v)}</p></div>`).join(''):'<p class="brief-empty">No project framing recorded.</p>';
}
function renderTheme(){
  const dark=document.documentElement.dataset.theme==='dark';const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=dark?'#171612':'#f3eee4';$('themeToggle')?.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode');
}
function toggleTheme(){const next=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=next;localStorage.setItem(THEME_KEY,next);renderTheme()}
function renderSync(){
  const status=readJson(SYNC_STATUS_KEY);const conn=readJson(SYNC_CONNECTION_KEY);
  if(conn?.repo){const repo=String(conn.repo).split('/').pop();$('syncStatus').innerHTML=`<strong>${esc(repo||'GitHub sync')}</strong><span>${status?.syncedAt?`Synced ${esc(relativeTime(status.syncedAt))}`:'Connection remembered'}</span>`}
  else $('syncStatus').innerHTML='<strong>Local-first</strong><a href="../sync.html">Set up sync →</a>';
}

function openDialog(id){
  const dialog=$(id);if(!dialog)return;
  document.querySelectorAll('dialog[open]').forEach(d=>{if(d!==dialog)d.close()});
  if(!dialog.open)dialog.showModal();
  setTimeout(()=>dialog.querySelector('input:not([type="hidden"]),textarea,button')?.focus({preventScroll:true}),20);
}
function closeDialog(target){
  const dialog=target?.closest?.('dialog')||document.querySelector('dialog[open]');if(dialog?.open)dialog.close();
}
function showToast(message,before=''){
  clearTimeout(toastTimer);undoRaw=before||'';
  $('toastText').textContent=message;$('toastUndo').hidden=!undoRaw;$('toast').hidden=false;
  toastTimer=setTimeout(()=>{$('toast').hidden=true;undoRaw=''},5000);
}
function doUndo(){if(!undoRaw)return;localStorage.setItem(STORAGE_KEY,undoRaw);state=loadState();render();$('toast').hidden=true;undoRaw=''}
