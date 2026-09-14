(() => {
  'use strict';

  const THEME_KEY = 'ledger-stationery-theme-v1';
  const STORAGE_KEY = 'ledger-notes-roadmaps-v2';
  const root = document.documentElement;
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  let queued = false;

  const DISABLED_CORE_STYLES = new Set([
    'stationery.css',
    'clean-paper.css',
    'theme.css',
    'typography.css',
    'project-links.css',
    'sync-status.css'
  ]);

  function fileName(href){
    try{return new URL(href,location.href).pathname.split('/').pop().split('?')[0]}
    catch(e){return ''}
  }

  function disableLegacyPageStyles(){
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link=>{
      if(DISABLED_CORE_STYLES.has(fileName(link.href))) link.disabled=true;
    });
  }

  function appendLink(href, marker){
    if(document.querySelector(`link[${marker}]`))return;
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href=href;
    link.setAttribute(marker,'true');
    document.head.appendChild(link);
  }

  function loadCleanSheetSystem(){
    disableLegacyPageStyles();
    appendLink('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600;8..60,700&display=swap','data-ledger-clean-fonts');
    appendLink('./ledger-ui.css?v=20260914-1','data-ledger-clean-ui');
    appendLink('./ledger-ui-a11y.css?v=20260914-2','data-ledger-clean-a11y');
    document.body?.classList.add('clean-sheet-ui');
  }

  function savedTheme(){
    return localStorage.getItem(THEME_KEY)==='dark'?'dark':'light';
  }

  function applyTheme(theme){
    const next=theme==='dark'?'dark':'light';
    root.dataset.theme=next;
    localStorage.setItem(THEME_KEY,next);
    if(metaTheme)metaTheme.setAttribute('content',next==='dark'?'#171c20':'#f5f0e6');
    const button=document.getElementById('themeToggle');
    if(button){
      button.setAttribute('aria-pressed',String(next==='dark'));
      button.setAttribute('aria-label',next==='dark'?'Switch to light mode':'Switch to dark mode');
      button.title=next==='dark'?'Light mode':'Dark mode';
    }
  }

  function readState(){
    try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'null')}
    catch(e){return null}
  }

  function setText(node,value){
    if(node&&node.textContent!==value)node.textContent=value;
  }

  function ensureRecordColumn(){
    const view=document.getElementById('projectView');
    if(!view)return;

    let record=view.querySelector(':scope > .record-column');
    if(!record){
      record=document.createElement('aside');
      record.className='record-column';
      record.setAttribute('aria-label','Project reference and record');

      const done=document.getElementById('doneSection');
      if(done&&done.parentElement===view)view.insertBefore(record,done);
      else view.appendChild(record);
    }

    ['roadmapSummary','notesSection','journalSection'].forEach(id=>{
      const section=document.getElementById(id);
      if(section&&section.parentElement!==record)record.appendChild(section);
    });
  }

  function ensureProjectChrome(){
    const heading=document.querySelector('#projectView .project-heading');
    if(!heading)return;

    ensureRecordColumn();

    const main=heading.querySelector(':scope > div:first-child');
    const menu=heading.querySelector(':scope > .quiet-button, .project-heading-actions > .quiet-button');

    if(main&&!main.querySelector('.project-meta-line')){
      const meta=document.createElement('div');
      meta.className='project-meta-line';
      meta.innerHTML='<span id="cleanProjectPosition">PROJECT 01 / 01</span><span id="cleanProjectUpdated">LOCAL RECORD</span>';
      const kicker=main.querySelector('.project-kicker');
      if(kicker)kicker.insertAdjacentElement('afterend',meta); else main.prepend(meta);
    }

    if(!heading.querySelector('.project-heading-actions')){
      const wrap=document.createElement('div');
      wrap.className='project-heading-actions';
      const actions=document.createElement('div');
      actions.className='project-quick-actions';
      actions.innerHTML=`
        <button type="button" class="primary-action" data-action="capture">＋ Capture</button>
        <button type="button" data-action="log-work">Log work</button>
        <button type="button" data-action="edit-current-project">Edit</button>`;
      wrap.appendChild(actions);
      if(menu)wrap.appendChild(menu);
      heading.appendChild(wrap);
    }

    const eyebrow=document.querySelector('.eyebrow');
    setText(eyebrow,'PROJECT OPERATIONS / LOCAL-FIRST');
    syncProjectMeta();
  }

  function syncProjectMeta(){
    const state=readState();
    const projects=Array.isArray(state?.projects)?state.projects:[];
    const activeId=state?.activeProject;
    let index=projects.findIndex(project=>project?.id===activeId);
    if(index<0)index=0;
    const project=projects[index]||null;
    const position=document.getElementById('cleanProjectPosition');
    const updated=document.getElementById('cleanProjectUpdated');
    setText(position,`PROJECT ${String(index+1).padStart(2,'0')} / ${String(Math.max(projects.length,1)).padStart(2,'0')}`);
    const date=project?.workedAt?new Date(project.workedAt):null;
    const label=date&&!Number.isNaN(date.getTime())
      ? `UPDATED ${date.toLocaleDateString(undefined,{month:'short',day:'2-digit'}).toUpperCase()}`
      : 'LOCAL RECORD';
    setText(updated,label);
  }

  function queueSync(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{
      queued=false;
      ensureProjectChrome();
      syncProjectMeta();
    });
  }

  loadCleanSheetSystem();
  applyTheme(savedTheme());

  document.addEventListener('DOMContentLoaded',()=>{
    loadCleanSheetSystem();
    applyTheme(savedTheme());
    ensureProjectChrome();

    const button=document.getElementById('themeToggle');
    if(button)button.addEventListener('click',()=>applyTheme(root.dataset.theme==='dark'?'light':'dark'));

    const app=document.getElementById('app');
    if(app)new MutationObserver(queueSync).observe(app,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['hidden','class']});
    const tabs=document.getElementById('projectTabs');
    if(tabs)new MutationObserver(queueSync).observe(tabs,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
  });

  window.addEventListener('storage',event=>{if(event.key===STORAGE_KEY)queueSync();});
})();
