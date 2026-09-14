(() => {
  'use strict';

  const THEME_KEY = 'ledger-stationery-theme-v1';
  const STORAGE_KEY = 'ledger-notes-roadmaps-v2';
  const root = document.documentElement;
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  let refreshQueued = false;

  function loadVisualRefresh(){
    if(document.querySelector('link[data-ledger-visual-refresh]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './visual-refresh.css?v=20260914-2';
    link.dataset.ledgerVisualRefresh = 'true';
    document.head.appendChild(link);
  }

  function savedTheme(){
    const value = localStorage.getItem(THEME_KEY);
    return value === 'dark' ? 'dark' : 'light';
  }

  function applyTheme(theme){
    const next = theme === 'dark' ? 'dark' : 'light';
    root.dataset.theme = next;
    localStorage.setItem(THEME_KEY, next);
    if (metaTheme) metaTheme.setAttribute('content', next === 'dark' ? '#171613' : '#e8e4db');

    const button = document.getElementById('themeToggle');
    if (button){
      button.setAttribute('aria-pressed', String(next === 'dark'));
      button.setAttribute('aria-label', next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      button.title = next === 'dark' ? 'Light mode' : 'Dark mode';
    }
  }

  function readState(){
    try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'null')}
    catch(e){return null}
  }

  function wrapRegister(rule, list, className){
    if(!rule||!list||rule.parentElement?.classList.contains('ledger-register'))return;
    const section=document.createElement('section');
    section.className=`ledger-register ${className}`;
    rule.parentNode.insertBefore(section,rule);
    section.append(rule,list);
  }

  function enhanceStructure(){
    const view=document.getElementById('projectView');
    const heading=view?.querySelector('.project-heading');
    if(!view||!heading)return;

    const main=heading.firstElementChild;
    if(main&&!main.classList.contains('ledger-project-heading-main'))main.classList.add('ledger-project-heading-main');

    if(!heading.querySelector('.ledger-folio-block')){
      const folio=document.createElement('div');
      folio.className='ledger-folio-block';
      folio.innerHTML='<span class="ledger-folio-label">FOLIO</span><strong id="ledgerFolioNumber">01</strong><span id="ledgerFolioTotal">/01</span>';
      heading.prepend(folio);
    }

    if(!heading.querySelector('.ledger-project-actions')){
      const actions=document.createElement('div');
      actions.className='ledger-project-actions';
      actions.innerHTML=`
        <button type="button" class="ledger-action ledger-action-primary" data-action="capture">＋ Capture</button>
        <button type="button" class="ledger-action" data-action="log-work">Log work</button>
        <button type="button" class="ledger-action" data-action="edit-current-project">Edit project</button>`;
      const menu=heading.querySelector('.quiet-button');
      if(menu)heading.insertBefore(actions,menu); else heading.appendChild(actions);
    }

    if(!main?.querySelector('.ledger-project-meta')){
      const meta=document.createElement('div');
      meta.className='ledger-project-meta';
      meta.innerHTML='<span id="ledgerRegisterMode">REGISTER</span><span id="ledgerUpdatedAt">LOCAL RECORD</span>';
      const kicker=main?.querySelector('.project-kicker');
      if(kicker)kicker.insertAdjacentElement('afterend',meta); else main?.prepend(meta);
    }

    if(!document.querySelector('.ledger-register-now')){
      const active=document.getElementById('activeItems');
      const rule=active?.previousElementSibling?.classList.contains('section-rule')?active.previousElementSibling:null;
      wrapRegister(rule,active,'ledger-register-now');
    }
    if(!document.querySelector('.ledger-register-open')){
      const open=document.getElementById('openItems');
      const rule=open?.previousElementSibling?.classList.contains('section-rule')?open.previousElementSibling:null;
      wrapRegister(rule,open,'ledger-register-open');
    }

    const masthead=document.querySelector('.masthead > div:first-child');
    if(masthead&&!masthead.querySelector('.ledger-registry-line')){
      const line=document.createElement('div');
      line.className='ledger-registry-line';
      line.textContent='WORKING REGISTER / PROJECT RECORD / LOCAL-FIRST';
      masthead.appendChild(line);
    }

    syncProjectMeta();
  }

  function syncProjectMeta(){
    const state=readState();
    const projects=Array.isArray(state?.projects)?state.projects:[];
    const activeId=state?.activeProject;
    const index=Math.max(0,projects.findIndex(project=>project?.id===activeId));
    const project=projects[index]||projects[0]||null;
    const number=document.getElementById('ledgerFolioNumber');
    const total=document.getElementById('ledgerFolioTotal');
    const mode=document.getElementById('ledgerRegisterMode');
    const updated=document.getElementById('ledgerUpdatedAt');
    if(number)number.textContent=String(index+1).padStart(2,'0');
    if(total)total.textContent=`/${String(Math.max(projects.length,1)).padStart(2,'0')}`;
    if(mode)mode.textContent=project?.mode==='ROADMAP'?'ROADMAP REGISTER':'WORK REGISTER';
    if(updated){
      const date=project?.workedAt?new Date(project.workedAt):null;
      updated.textContent=date&&!Number.isNaN(date.getTime())?`UPDATED ${date.toLocaleDateString(undefined,{month:'short',day:'2-digit'}).toUpperCase()}`:'LOCAL RECORD';
    }
  }

  function queueEnhance(){
    if(refreshQueued)return;
    refreshQueued=true;
    requestAnimationFrame(()=>{
      refreshQueued=false;
      enhanceStructure();
      syncProjectMeta();
    });
  }

  loadVisualRefresh();
  applyTheme(savedTheme());

  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(savedTheme());
    enhanceStructure();

    const button = document.getElementById('themeToggle');
    if (button){
      button.addEventListener('click', () => {
        applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
      });
    }

    const app=document.getElementById('app');
    if(app){
      new MutationObserver(queueEnhance).observe(app,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['hidden','class']});
    }
    const tabs=document.getElementById('projectTabs');
    if(tabs)new MutationObserver(queueEnhance).observe(tabs,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
  });

  window.addEventListener('storage',event=>{if(event.key===STORAGE_KEY)queueEnhance();});
})();
