(() => {
  'use strict';

  const STORAGE_KEY='ledger-notes-roadmaps-v2';
  const SYNC_STATUS_KEY='ledger-github-sync-status-v1';
  const REMEMBERED_CONNECTION_KEY='ledger-github-sync-remember-v1';
  const enc=new TextEncoder();
  let refreshToken=0;
  let mismatchSince=0;
  let storageCorrupt=false;
  let corruptRaw='';
  let activeDialog=null;
  let lastFocusedElement=null;
  let lastNonDialogFocus=null;
  let enhanceQueued=false;
  const dialogOpeners=new WeakMap();
  const managedInert=new Set();

  function readJson(key){
    try{return JSON.parse(localStorage.getItem(key)||'null')}
    catch(e){return null}
  }

  function readLedger(){
    const raw=localStorage.getItem(STORAGE_KEY);
    if(!raw)return {raw:'',state:null,error:null};
    try{return {raw,state:JSON.parse(raw),error:null}}
    catch(error){return {raw,state:null,error}}
  }

  function b64(bytes){
    let s='';
    const a=bytes instanceof Uint8Array?bytes:new Uint8Array(bytes);
    for(let i=0;i<a.length;i+=0x8000)s+=String.fromCharCode(...a.subarray(i,i+0x8000));
    return btoa(s);
  }

  async function sha256Text(text){
    const d=await crypto.subtle.digest('SHA-256',enc.encode(text));
    return b64(d);
  }

  function stableValue(value,key=''){
    if(key==='activeProject'||key==='syncedAt')return undefined;
    if(Array.isArray(value))return value.map(item=>stableValue(item)).filter(item=>item!==undefined);
    if(value&&typeof value==='object'){
      const out={};
      Object.keys(value).sort().forEach(k=>{
        const next=stableValue(value[k],k);
        if(next!==undefined)out[k]=next;
      });
      return out;
    }
    return value;
  }

  async function contentHash(plain){
    const state=JSON.parse(plain);
    return sha256Text(JSON.stringify(stableValue(state)));
  }

  async function matchesLegacySnapshot(plain,savedHash){
    if(!savedHash)return false;
    const currentHash=await sha256Text(plain);
    if(currentHash===savedHash)return true;

    let state;
    try{state=JSON.parse(plain)}catch(e){return false}
    if(!state||typeof state!=='object'||Array.isArray(state))return false;
    const original=state.activeProject;
    const ids=Array.isArray(state.projects)?state.projects.map(p=>p?.id).filter(Boolean):[];
    for(const id of [...new Set(['',original,...ids])]){
      if(id===original)continue;
      state.activeProject=id;
      if(await sha256Text(JSON.stringify(state))===savedHash)return true;
    }
    return false;
  }

  function injectHardeningStyles(){
    if(document.getElementById('ledgerInteractionHardening'))return;
    const style=document.createElement('style');
    style.id='ledgerInteractionHardening';
    style.textContent=`
      .entry-chevron[data-task-collapse]{
        appearance:none;-webkit-appearance:none;border:0;background:transparent;padding:0;margin:0;
        width:24px;min-width:24px;min-height:32px;color:var(--rule-dark);font:inherit;font-size:18px;
        line-height:1;display:inline-grid;place-items:start center;cursor:pointer;border-radius:6px;
      }
      .entry-chevron[data-task-collapse]:focus-visible,
      .memo-card[role="button"]:focus-visible{
        outline:2px solid var(--verm);outline-offset:3px;
      }
      .storage-recovery-state{
        margin:28px 0 0 28px;max-width:720px;border:1px solid var(--verm-dark);border-left:5px solid var(--verm);
        background:rgba(255,255,255,.4);padding:18px 18px 20px;
      }
      .storage-recovery-state h2{margin:0 0 8px;font-size:24px;line-height:1.15}
      .storage-recovery-state p{margin:8px 0;color:var(--ink-soft);max-width:62ch}
      .storage-recovery-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}
      .storage-recovery-detail{font-size:12px;overflow-wrap:anywhere}
      @media(max-width:600px){.storage-recovery-state{margin:18px 0 0;padding:16px}}
    `;
    document.head.appendChild(style);
  }

  function show(message){
    if(storageCorrupt)return;
    const box=document.getElementById('syncNudge');
    const text=document.getElementById('syncNudgeText');
    if(!box||!text)return;
    text.innerHTML=message;
    box.hidden=false;
  }

  function hide(){
    const box=document.getElementById('syncNudge');
    if(box)box.hidden=true;
  }

  function downloadCorruptBackup(){
    if(!corruptRaw)return;
    const blob=new Blob([corruptRaw],{type:'text/plain;charset=utf-8'});
    const link=document.createElement('a');
    link.href=URL.createObjectURL(blob);
    link.download=`ledger-recovery-${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(()=>URL.revokeObjectURL(link.href),1000);
  }

  function resetCorruptLedger(){
    const ok=window.confirm('Reset the unreadable Ledger data in this browser? Download the raw recovery backup first if you may need the existing data. This reset cannot be undone.');
    if(!ok)return;
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  }

  function showStorageRecovery(error){
    storageCorrupt=true;
    hide();
    const app=document.getElementById('app');
    if(!app)return;
    document.documentElement.dataset.ledgerStorage='corrupt';

    const existing=document.getElementById('storageRecoveryState');
    if(existing)return;

    const empty=document.getElementById('emptyState');
    const project=document.getElementById('projectView');
    const strip=document.querySelector('.project-strip-wrap');
    const nav=document.querySelector('.bottom-ruler');
    if(empty)empty.hidden=true;
    if(project)project.hidden=true;
    if(strip)strip.hidden=true;
    if(nav)nav.hidden=true;

    const panel=document.createElement('section');
    panel.id='storageRecoveryState';
    panel.className='storage-recovery-state';
    panel.setAttribute('role','alert');
    panel.setAttribute('aria-labelledby','storageRecoveryTitle');
    panel.innerHTML=`
      <h2 id="storageRecoveryTitle">Ledger could not read the saved notebook</h2>
      <p>The browser still contains the original stored data. Ledger has stopped normal editing so it does not overwrite that data with an empty notebook.</p>
      <p>Download the raw recovery copy before resetting. The raw file may be repairable even though Ledger cannot parse it.</p>
      <p class="storage-recovery-detail">${error?.message?`Read error: ${String(error.message).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}`:'The stored data is not valid JSON.'}</p>
      <div class="storage-recovery-actions">
        <button class="paper-button primary" type="button" data-ledger-download-recovery>Download raw backup</button>
        <button class="paper-button" type="button" data-ledger-reset-corrupt>Reset Ledger data</button>
      </div>`;
    app.prepend(panel);
    panel.querySelector('[data-ledger-download-recovery]')?.addEventListener('click',downloadCorruptBackup);
    panel.querySelector('[data-ledger-reset-corrupt]')?.addEventListener('click',resetCorruptLedger);
    panel.querySelector('[data-ledger-download-recovery]')?.focus({preventScroll:true});
  }

  function checkStorageIntegrity(){
    const ledger=readLedger();
    if(ledger.error){
      corruptRaw=ledger.raw;
      showStorageRecovery(ledger.error);
      return false;
    }
    return true;
  }

  function isVisibleDialog(dialog){
    return !!dialog&&!dialog.hidden&&getComputedStyle(dialog).display!=='none'&&getComputedStyle(dialog).visibility!=='hidden';
  }

  function visibleDialogs(){
    return [...document.querySelectorAll('[role="dialog"][aria-modal="true"]')].filter(isVisibleDialog);
  }

  function restoreManagedInert(){
    managedInert.forEach(node=>{
      if(node?.isConnected)node.inert=false;
    });
    managedInert.clear();
  }

  function isBackdrop(node){
    return node instanceof HTMLElement&&!node.hidden&&(node.id==='sheetBackdrop'||node.id==='taskLinkBackdrop'||node.id==='roadmapHelpBackdrop'||node.id==='mobileTaskBackdrop'||node.classList.contains('sheet-backdrop')||node.className?.toString().includes('backdrop'));
  }

  function applyModalIsolation(dialog){
    restoreManagedInert();
    [...document.body.children].forEach(node=>{
      if(!(node instanceof HTMLElement))return;
      if(node===dialog||node.contains(dialog)||isBackdrop(node))return;
      if(['SCRIPT','STYLE','LINK'].includes(node.tagName))return;
      if(node.inert)return;
      node.inert=true;
      managedInert.add(node);
    });
  }

  function focusables(dialog){
    return [...dialog.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])')]
      .filter(node=>!node.hidden&&getComputedStyle(node).display!=='none'&&getComputedStyle(node).visibility!=='hidden');
  }

  function activateDialog(dialog){
    if(!dialog||dialog===activeDialog)return;
    if(!dialogOpeners.has(dialog)){
      const current=document.activeElement;
      const opener=current instanceof HTMLElement&&current!==document.body&&!dialog.contains(current)&&current.isConnected
        ? current
        : (lastFocusedElement instanceof HTMLElement&&!dialog.contains(lastFocusedElement)&&lastFocusedElement.isConnected
          ? lastFocusedElement
          : (lastNonDialogFocus&&lastNonDialogFocus.isConnected?lastNonDialogFocus:null));
      dialogOpeners.set(dialog,opener);
    }
    activeDialog=dialog;
    applyModalIsolation(dialog);
    setTimeout(()=>{
      if(activeDialog!==dialog||!isVisibleDialog(dialog))return;
      if(dialog.contains(document.activeElement))return;
      const first=focusables(dialog)[0];
      if(first)first.focus({preventScroll:true});
      else{
        if(!dialog.hasAttribute('tabindex'))dialog.setAttribute('tabindex','-1');
        dialog.focus({preventScroll:true});
      }
    },40);
  }

  function reconcileDialogs(){
    const dialogs=visibleDialogs();
    const next=dialogs.at(-1)||null;
    if(next){
      const closed=activeDialog&&activeDialog!==next&&!isVisibleDialog(activeDialog)?activeDialog:null;
      const opener=closed?dialogOpeners.get(closed):null;
      if(closed)activeDialog=null;
      activateDialog(next);
      if(opener&&opener.isConnected&&!opener.inert&&next.contains(opener)){
        requestAnimationFrame(()=>opener.focus({preventScroll:true}));
      }
      return;
    }
    if(!activeDialog)return;
    const closed=activeDialog;
    activeDialog=null;
    restoreManagedInert();
    const opener=dialogOpeners.get(closed);
    if(opener&&opener.isConnected&&!opener.inert){
      requestAnimationFrame(()=>opener.focus({preventScroll:true}));
    }
  }

  function syncDescribedError(inputId,errorId){
    const input=document.getElementById(inputId);
    const error=document.getElementById(errorId);
    if(!input||!error)return;
    const active=!error.hidden&&!!error.textContent.trim();
    const ids=new Set((input.getAttribute('aria-describedby')||'').split(/\s+/).filter(Boolean));
    if(active){
      ids.add(errorId);
      input.setAttribute('aria-invalid','true');
    }else{
      ids.delete(errorId);
      input.removeAttribute('aria-invalid');
    }
    if(ids.size)input.setAttribute('aria-describedby',[...ids].join(' '));
    else input.removeAttribute('aria-describedby');
  }

  function replaceCollapseControl(node){
    if(!node||node.tagName==='BUTTON')return node;
    const button=document.createElement('button');
    [...node.attributes].forEach(attribute=>button.setAttribute(attribute.name,attribute.value));
    button.type='button';
    button.innerHTML=node.innerHTML;
    node.replaceWith(button);
    return button;
  }

  function enhanceInteractionContracts(){
    document.getElementById('app')?.removeAttribute('aria-live');
    const nudge=document.getElementById('syncNudge');
    if(nudge)nudge.setAttribute('aria-atomic','true');

    document.querySelectorAll('.entry[data-item]').forEach(entry=>{
      entry.removeAttribute('tabindex');
    });

    document.querySelectorAll('.memo-card[data-item]').forEach(memo=>{
      memo.setAttribute('role','button');
      memo.setAttribute('tabindex','0');
      if(!memo.hasAttribute('aria-label')){
        const title=String(memo.textContent||'').trim();
        memo.setAttribute('aria-label',title?`Open note: ${title}`:'Open note');
      }
    });

    document.querySelectorAll('.entry-chevron[data-task-collapse]').forEach(replaceCollapseControl);

    const undo=document.getElementById('ledgerUndoBar');
    if(undo){
      undo.setAttribute('role','status');
      undo.setAttribute('aria-live','polite');
      undo.setAttribute('aria-atomic','true');
    }

    syncDescribedError('taskLinkUrl','taskLinkError');
    syncDescribedError('itemLinkInput','itemLinkError');
  }

  function queueEnhance(){
    if(enhanceQueued)return;
    enhanceQueued=true;
    queueMicrotask(()=>{
      enhanceQueued=false;
      enhanceInteractionContracts();
      reconcileDialogs();
    });
  }

  async function refresh(){
    const token=++refreshToken;
    if(!checkStorageIntegrity())return;
    const plain=localStorage.getItem(STORAGE_KEY);
    if(!plain){mismatchSince=0;hide();return;}

    const status=readJson(SYNC_STATUS_KEY);
    if(!status?.hash&&!status?.contentHash){
      mismatchSince=0;
      show('<strong>Not synced yet.</strong> Back up Ledger to your private Notes repository.');
      return;
    }

    try{
      const meaningfulHash=await contentHash(plain);
      if(token!==refreshToken)return;

      let matches=status?.contentHash===meaningfulHash;
      if(!matches&&!status?.contentHash)matches=await matchesLegacySnapshot(plain,status?.hash);
      if(token!==refreshToken)return;

      if(matches){
        mismatchSince=0;
        hide();
        return;
      }

      const remembered=readJson(REMEMBERED_CONNECTION_KEY);
      if(remembered?.repo&&remembered?.token){
        if(!mismatchSince)mismatchSince=Date.now();
        // Automatic sync normally resolves this within 30 seconds. Keep normal
        // background work quiet and only surface it when it stays stale.
        if(Date.now()-mismatchSince<120000){hide();return;}
        show('<strong>Sync needs attention.</strong> Automatic sync has not completed yet.');
        return;
      }

      mismatchSince=0;
      show('<strong>Changes not synced.</strong> Your browser has newer Ledger data than the last GitHub snapshot.');
    }catch(e){
      mismatchSince=0;
      hide();
    }
  }

  injectHardeningStyles();

  document.addEventListener('focusin',event=>{
    lastFocusedElement=event.target;
    if(!event.target?.closest?.('[role="dialog"][aria-modal="true"]'))lastNonDialogFocus=event.target;
  },true);

  document.addEventListener('keydown',event=>{
    const memo=event.target?.closest?.('.memo-card[role="button"][data-item]');
    if(memo&&(event.key==='Enter'||event.key===' ')){
      event.preventDefault();
      memo.click();
      return;
    }

    if(event.key!=='Tab'||!activeDialog||!isVisibleDialog(activeDialog))return;
    const nodes=focusables(activeDialog);
    if(!nodes.length){
      event.preventDefault();
      activeDialog.focus({preventScroll:true});
      return;
    }
    const first=nodes[0];
    const last=nodes[nodes.length-1];
    const current=document.activeElement;
    if(event.shiftKey&&(current===first||!activeDialog.contains(current))){
      event.preventDefault();
      last.focus();
    }else if(!event.shiftKey&&(current===last||!activeDialog.contains(current))){
      event.preventDefault();
      first.focus();
    }
  },true);

  new MutationObserver(queueEnhance).observe(document.body,{
    childList:true,
    subtree:true,
    attributes:true,
    attributeFilter:['hidden','aria-expanded']
  });

  window.addEventListener('storage',event=>{
    if(event.key===STORAGE_KEY||event.key===SYNC_STATUS_KEY||event.key===REMEMBERED_CONNECTION_KEY){
      queueEnhance();
      refresh();
    }
  });
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh()});
  setInterval(refresh,5000);
  enhanceInteractionContracts();
  reconcileDialogs();
  refresh();
})();