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
    if(!p){$('mobileProjectName').textContent='Projects';return}
    renderProject(p);
  }
  function renderCorrupt(){
    $('projectSurface').hidden=true;$('emptyState').hidden=true;$('corruptState').hidden=false;
    $('corruptState').innerHTML=`<p class="micro-label">RECOVERY REQUIRED</p><h1>Ledger cannot safely read this local record.</h1><p>The raw browser data is still present. Download a copy before resetting so nothing recoverable is silently overwritten.</p><div class="project-header-actions" style="display:inline-flex;margin-top:14px"><button type="button" data-action="download-recovery">Download raw backup</button><button class="primary-button" type="button" data-action="reset-recovery">Reset local data</button></div>`;
    $('projectIndex').innerHTML='';$('projectsDialogList').innerHTML='';$('syncStatus').innerHTML='<strong>Editing blocked</strong>Local data needs recovery.';
  }
  function renderProjectIndex(p){
    const html=state.projects.map((project,index)=>{
      const tasks=state.items.filter(i=>i.p===project.id&&i.kind!=='NOTE');
      const active=tasks.filter(i=>i.status==='ACTIVE').length;
      const open=tasks.filter(i=>i.status!=='DONE'&&i.status!=='ACTIVE').length;
      return `<button type="button" class="project-index-item ${p&&p.id===project.id?'active':''}" data-project="${esc(project.id)}"><span class="project-number">${String(index+1).padStart(2,'0')}</span><span class="project-index-copy"><strong>${esc(project.title||'Untitled')}</strong><small>${active?`${active} active · `:''}${open} open</small></span></button>`;
    }).join('');
    $('projectIndex').innerHTML=html||'<div class="context-empty" style="padding:12px 18px;color:#a9bac4">No projects yet.</div>';
    $('projectsDialogList').innerHTML=state.projects.map((project,index)=>`<button type="button" class="${p&&p.id===project.id?'active':''}" data-project="${esc(project.id)}"><span><strong>${String(index+1).padStart(2,'0')} · ${esc(project.title||'Untitled')}</strong><small>${esc(project.mode==='ROADMAP'?'Roadmap':'List')} · ${relativeTime(project.workedAt||project.createdAt)}</small></span><span>${p&&p.id===project.id?'●':'○'}</span></button>`).join('')||'<div class="context-empty">No projects yet.</div>';
  }
  function renderProject(p){
    const index=Math.max(0,state.projects.findIndex(x=>x.id===p.id));
    $('mobileProjectName').textContent=p.title||'Untitled';
    $('projectPosition').textContent=`PROJECT ${String(index+1).padStart(2,'0')} / ${String(state.projects.length).padStart(2,'0')}`;
    $('projectMode').textContent=p.mode==='ROADMAP'?'ROADMAP':'WORK REGISTER';
    $('projectUpdated').textContent=`UPDATED ${relativeTime(p.workedAt||p.createdAt).toUpperCase()}`;
    $('projectTitle').textContent=p.title||'Untitled project';
    $('projectDescription').textContent=p.description||'';
    $('projectDescription').hidden=!p.description;
    const links=normalizeLinks(p.links);
    $('projectLinks').innerHTML=links.map(link=>`<a href="${esc(link.url)}" target="_blank" rel="noopener noreferrer">${esc(linkLabel(link))}<span aria-hidden="true">↗</span></a>`).join('');
    $('projectLinks').hidden=!links.length;

    const mine=state.items.filter(i=>i.p===p.id);
    const tasks=mine.filter(i=>i.kind!=='NOTE');
    const active=tasks.filter(i=>i.status==='ACTIVE');
    const open=tasks.filter(i=>i.status!=='DONE'&&i.status!=='ACTIVE');
    const done=tasks.filter(i=>i.status==='DONE').sort((a,b)=>String(b.completedAt||b.workedAt||'').localeCompare(String(a.completedAt||a.workedAt||'')));
    const notes=mine.filter(i=>i.kind==='NOTE'&&i.status!=='DONE');
    const journal=state.journal.filter(j=>j.p===p.id).sort((a,b)=>String(b.updatedAt||b.createdAt||'').localeCompare(String(a.updatedAt||a.createdAt||'')));
    const logs=state.worklog.filter(w=>w.p===p.id).sort((a,b)=>String(b.whenAt||'').localeCompare(String(a.whenAt||'')));

    renderReturnPoint(p,active,open,notes,logs);
    $('activeCount').textContent=active.length?`${active.length} LIVE`:'';
    $('openCount').textContent=`${open.length} OPEN`;
    $('doneCount').textContent=`${done.length}`;
    $('activeTasks').innerHTML=active.length?active.map((item,i)=>taskHtml(item,i,'active')).join(''):`<div class="empty-row">Nothing active. ${open.length?'Start something from Next when you are ready.':'Capture the next useful step.'}</div>`;
    $('openTasks').innerHTML=open.length?open.map((item,i)=>taskHtml(item,i,'open')).join(''):'<div class="empty-row">No open tasks.</div>';
    $('doneTasks').innerHTML=done.length?done.map((item,i)=>taskHtml(item,i,'done')).join(''):'<div class="empty-row">Nothing archived.</div>';
    $('archiveSection').hidden=!done.length;
    renderBrief(p);
    renderNotes(notes);
    renderJournal(journal);
  }
  function renderReturnPoint(p,active,open,notes,logs){
    const last=logs[0];
    $('returnTime').textContent=relativeTime(last?.whenAt||p.workedAt||p.createdAt);
    $('returnChange').textContent=last?.summary||'No work change has been recorded yet.';
    $('returnPrompt').textContent=active.length?`${active.length} active · ${open.length} in Next · ${notes.length} project note${notes.length===1?'':'s'}`:open.length?`No active task. ${open.length} item${open.length===1?'':'s'} are ready in Next.`:'No open work. Capture the next step when the project moves again.';
    if(active[0])$('returnAction').innerHTML=`<button class="resume-button" type="button" data-action="task-details" data-id="${esc(active[0].id)}">Resume →</button>`;
    else if(open[0])$('returnAction').innerHTML=`<button class="resume-button" type="button" data-action="start-task" data-id="${esc(open[0].id)}">Start next →</button>`;
    else $('returnAction').innerHTML='<button type="button" data-action="capture">Capture next step</button>';
  }
  function taskHtml(item,index,mode){
    const meta=taskMeta(item);
    const preview=firstTaskNote(item);
    const progress=taskProgress(item);
    const context=[];
    if(item.dependencies)context.push(`<span><strong>Waiting:</strong> ${esc(item.dependencies)}</span>`);
    if(item.acceptance)context.push(`<span><strong>Done when:</strong> ${esc(item.acceptance)}</span>`);
    const status=statusLabel(item);
    let actions='';
    if(mode==='active')actions=`<button type="button" data-action="task-note" data-id="${esc(item.id)}">+ Note</button><button type="button" data-action="task-details" data-id="${esc(item.id)}">Details</button>${item.link?`<a href="${esc(item.link)}" target="_blank" rel="noopener noreferrer">Open ↗</a>`:''}<button class="done-action" type="button" data-action="done-task" data-id="${esc(item.id)}">Done</button>`;
    else if(mode==='open')actions=`<button class="work-action" type="button" data-action="start-task" data-id="${esc(item.id)}">Start</button><button type="button" data-action="task-details" data-id="${esc(item.id)}">Details</button>${item.link?`<a href="${esc(item.link)}" target="_blank" rel="noopener noreferrer">↗</a>`:''}`;
    else actions=`<button type="button" data-action="reopen-task" data-id="${esc(item.id)}">Reopen</button><button type="button" data-action="task-details" data-id="${esc(item.id)}">Details</button>`;
    return `<article class="task-ticket" data-item="${esc(item.id)}"><div class="task-rank">${String(index+1).padStart(2,'0')}</div><div class="task-core"><div class="task-topline"><span class="state-word ${statusClass(item)}">${status}</span><button class="task-title" type="button" data-action="task-details" data-id="${esc(item.id)}">${esc(item.title||'Untitled task')}</button></div>${meta.length?`<div class="task-meta">${meta.map(esc).join('<span>·</span>')}</div>`:''}${mode==='active'&&preview?`<p class="task-note-preview">${esc(preview)}</p>`:''}${mode==='active'&&context.length?`<div class="task-context-line">${context.join('')}</div>`:''}${progress?`<div class="subtask-meter"><span>${progress.done}/${progress.total} steps</span><span class="subtask-meter-bar"><span style="width:${progress.pct}%"></span></span></div>`:''}</div><div class="task-quick">${actions}</div></article>`;
  }
  function renderBrief(p){
    const f=p.framing||{};
    const rows=[['Current reality',f.currentReality],['Definition of done',f.done],['Final proof',f.proof],['Highest-risk unknown',f.risk],['In scope',f.inScope],['Not doing',f.notDoing],['Effort limit',f.effortLimit]].filter(([,v])=>String(v||'').trim());
    $('briefContent').innerHTML=rows.length?`<dl class="brief-grid">${rows.map(([k,v])=>`<div class="brief-row"><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`:'<div class="context-empty">No project brief yet. Add framing when the project needs a destination or boundary.</div>';
  }
  function renderNotes(notes){
    $('notesList').innerHTML=notes.length?notes.map(note=>`<button class="note-entry" type="button" data-action="edit-note" data-id="${esc(note.id)}">${esc(note.title||'Untitled note')}</button>`).join(''):'<div class="context-empty">No project notes yet.</div>';
  }
  function renderJournal(entries){
    const shown=entries.slice(0,5);
    $('journalList').innerHTML=shown.length?shown.map(entry=>`<button class="journal-entry" type="button" data-action="edit-journal" data-id="${esc(entry.id)}"><span class="journal-date">${esc(dateLabel(entry.createdAt))}</span><span class="journal-body">${esc(entry.body||'')}</span></button>`).join(''):'<div class="context-empty">No journal entries yet.</div>';
    $('journalMore').hidden=state.worklog.length===0;
  }

  function renderTheme(){
    const dark=document.documentElement.dataset.theme==='dark';
    const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=dark?'#181d21':'#efe7d8';
    $('themeToggle')?.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode');
  }
  function toggleTheme(){
    const next=document.documentElement.dataset.theme==='dark'?'light':'dark';
    document.documentElement.dataset.theme=next;localStorage.setItem(THEME_KEY,next);renderTheme();
  }
  function renderSync(){
    const status=readJson(SYNC_STATUS_KEY);const conn=readJson(SYNC_CONNECTION_KEY);
    if(conn?.repo){
      const repo=String(conn.repo).split('/').pop();
      $('syncStatus').innerHTML=`<strong>${esc(repo||'GitHub sync')}</strong>${status?.syncedAt?`Synced ${esc(relativeTime(status.syncedAt))}`:'Connection remembered'}`;
    }else $('syncStatus').innerHTML='<strong>Local-first</strong><a href="sync.html" style="color:inherit">Set up GitHub sync →</a>';
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
