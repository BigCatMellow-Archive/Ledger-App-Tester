'use strict';

const STORAGE_KEY = 'signal-pull-v1-state';
const DAY = 86400000;
const ANCHOR = new Date('2026-09-22T13:30:00.000Z');
const $ = id => document.getElementById(id);
const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const atDays = n => new Date(ANCHOR.getTime() + n * DAY).toISOString();
const uid = prefix => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
const toTime = v => { const n = new Date(v || '').getTime(); return Number.isFinite(n) ? n : null; };

function seedCommitment(id, overrides={}) {
  return {id,title:`Commitment ${id}`,scope:'General',workState:'OPEN',attentionState:'NEXT',createdAt:atDays(-30),updatedAt:atDays(-1),lastSeenAt:atDays(-1),materialChangedAt:atDays(-1),nextAction:'Continue',waitingOn:[],disposition:'',reviewAt:null,parkedUntil:null,dueAt:null,userPinned:false,returnPoint:null,...overrides};
}
function seedState() {
  const commitments=[
    seedCommitment('dep-done',{title:'Dependency that completed',workState:'DONE',attentionState:'QUIET',scope:'Systems'}),
    seedCommitment('due-soon',{title:'Prepare time-sensitive packet',scope:'Finance',dueAt:atDays(1),nextAction:'Assemble the final source list.'}),
    seedCommitment('newly-unblocked',{title:'Resume work after dependency',scope:'Systems',attentionState:'WAITING',waitingOn:['dep-done'],disposition:'Wake when dependency completes',nextAction:'Open the completed input and continue.'}),
    seedCommitment('waiting-review-expired',{title:'Follow up on unanswered request',scope:'School',attentionState:'WAITING',reviewAt:atDays(-1),disposition:'Review if no response',nextAction:'Send a follow-up.'}),
    seedCommitment('active-return-point',{title:'Current deep work',scope:'Organization research',workState:'ACTIVE',attentionState:'NOW',userPinned:true,nextAction:'Run the edge-case fixture.',returnPoint:{summary:'Validated the first two cases.',nextAction:'Run the edge-case fixture.',unresolved:'Need to verify stale dependency behavior.',updatedAt:atDays(-.2)}}),
    seedCommitment('material-change',{title:'Policy changed while away',scope:'School',lastSeenAt:atDays(-3),materialChangedAt:atDays(-.5),nextAction:'Review the changed policy before continuing.'}),
  ];
  for(let i=1;i<=15;i++) commitments.push(seedCommitment(`waiting-${i}`,{title:`Waiting commitment ${i}`,scope:i%2?'School':'Home',attentionState:'WAITING',reviewAt:atDays(5+i),disposition:`Review ${new Date(toTime(atDays(5+i))).toLocaleDateString()}`}));
  for(let i=1;i<=15;i++) commitments.push(seedCommitment(`parked-${i}`,{title:`Parked commitment ${i}`,scope:i%2?'Projects':'Personal',attentionState:'PARKED',parkedUntil:atDays(10+i),disposition:`Wake ${new Date(toTime(atDays(10+i))).toLocaleDateString()}`}));
  while(commitments.length<100){const i=commitments.length+1;commitments.push(seedCommitment(`routine-${i}`,{title:`Routine commitment ${i}`,scope:['School','Home','Projects','Personal'][i%4],updatedAt:atDays(-.5),lastSeenAt:atDays(-.5),materialChangedAt:atDays(-.5)}));}
  return {commitments,focusId:'active-return-point',createdAt:ANCHOR.toISOString(),localSave:'saved',externalSave:'not configured'};
}
let corruptRaw='';
let loadError='';
function loadState(){
  corruptRaw='';loadError='';
  let raw='';
  try{raw=localStorage.getItem(STORAGE_KEY)||''}
  catch(error){
    const fallback=SignalStateIO.normalizeState(seedState());
    fallback.localSave='memory only';
    loadError='Browser storage could not be read: '+error.message;
    return fallback;
  }
  if(!raw)return SignalStateIO.normalizeState(seedState());
  const parsed=SignalStateIO.parseSnapshot(raw);
  if(!parsed.ok){
    corruptRaw=raw;
    loadError=(parsed.error+' '+(parsed.details||'')).trim();
    return null;
  }
  parsed.state.localSave='saved';
  return parsed.state;
}
let state=loadState();
function persist(message=''){
  if(!state)return;
  state.localSave='saved';
  try{localStorage.setItem(STORAGE_KEY,SignalStateIO.serializeSnapshot(state))}
  catch(error){state.localSave='memory only';loadError='Browser storage write failed: '+error.message}
  renderAll();
  if(message)toast(message);
}
function byId(id){return state.commitments.find(c=>c.id===id)}
function dependencyState(c){if(!c.waitingOn?.length)return {waiting:false,released:false};const deps=c.waitingOn.map(byId);return {waiting:deps.some(d=>!d||d.workState!=='DONE'),released:deps.length>0&&deps.every(d=>d?.workState==='DONE')}}
function returnStale(c){return !!(c.returnPoint?.updatedAt&&c.materialChangedAt&&toTime(c.materialChangedAt)>toTime(c.returnPoint.updatedAt))}
function reasons(c){
  if(c.workState==='DONE')return [];
  const out=[]; const now=ANCHOR.getTime(); const dep=dependencyState(c);
  if(c.dueAt){const d=toTime(c.dueAt);if(d<=now)out.push('due now or overdue');else if(d-now<=3*DAY)out.push('due within 3 days')}
  if(c.reviewAt&&toTime(c.reviewAt)<=now)out.push('waiting review due');
  if(dep.released&&c.attentionState==='WAITING')out.push('dependency completed');
  if(c.materialChangedAt&&c.lastSeenAt&&toTime(c.materialChangedAt)>toTime(c.lastSeenAt))out.push('material change since last seen');
  if(returnStale(c))out.push('return point stale');
  if(c.userPinned)out.push('user pinned');
  if(c.workState==='ACTIVE'&&c.returnPoint&&!out.length)out.push('active return point');
  if(c.attentionState==='INBOX')out.push('untriaged');
  return out;
}
function signalKind(reason){if(reason.includes('due'))return ['TIME','1d','attention'];if(reason.includes('review'))return ['REVIEW','−1d','attention'];if(reason.includes('dependency'))return ['DEPENDENCY','✓',''];if(reason.includes('material'))return ['CHANGE','!',''];if(reason.includes('return')||reason.includes('pinned'))return ['RESUME','→','resume'];if(reason.includes('untriaged'))return ['INBOX','+',''];return ['SIGNAL','!','']}
function signals(){return state.commitments.filter(c=>reasons(c).length).map(c=>({c,reasons:reasons(c)})).sort((a,b)=>weight(b.reasons[0])-weight(a.reasons[0]))}
function weight(r){if(r.includes('overdue'))return 100;if(r.includes('due within'))return 95;if(r.includes('return point stale'))return 92;if(r.includes('review'))return 88;if(r.includes('dependency'))return 82;if(r.includes('material'))return 78;if(r.includes('pinned'))return 70;if(r.includes('return point'))return 65;if(r.includes('untriaged'))return 50;return 1}
function quietCommitments(){return state.commitments.filter(c=>c.workState!=='DONE'&&!reasons(c).length&&['WAITING','PARKED','QUIET'].includes(c.attentionState))}
function missingDisposition(){return quietCommitments().filter(c=>!c.reviewAt&&!c.parkedUntil&&!(c.waitingOn||[]).length&&!c.disposition)}
function activeCount(){return state.commitments.filter(c=>c.workState==='ACTIVE'||c.attentionState==='NOW').length}
function wakeText(c){if(c.workState==='ACTIVE'||c.attentionState==='NOW')return 'Active — no wake rule required';if(c.reviewAt)return `Review ${new Date(c.reviewAt).toLocaleDateString()}`;if(c.parkedUntil)return `Wake ${new Date(c.parkedUntil).toLocaleDateString()}`;if(c.waitingOn?.length)return `Dependency: ${c.waitingOn.join(', ')}`;return c.disposition||'No wake path';}
function renderSummary(){const sig=signals();$('systemSummary').textContent=`${sig.length} signals · active ${activeCount()}/3 · ${state.commitments.length} holdings · local ${state.localSave} · external ${state.externalSave}`}
function actionLabel(c,reason){if(reason.includes('review'))return 'Decide';if(reason.includes('material')||reason.includes('stale'))return 'Inspect';if(c.workState==='ACTIVE'||reason.includes('pinned'))return 'Resume';return 'Pull'}
function renderSignals(){const sig=signals();$('signalCount').textContent=`${sig.length} SIGNALS`;$('signalsList').innerHTML=sig.length?sig.map(({c,reasons})=>{const [label,mark,tone]=signalKind(reasons[0]);return `<article class="signal-row ${tone}"><div class="signal-type">${esc(label)}<strong>${esc(mark)}</strong></div><div class="signal-copy"><h3>${esc(c.title)}</h3><p>${esc(signalDescription(c,reasons))}</p><small>Why now: ${esc(reasons.join(' · '))}</small></div><button class="signal-action" type="button" data-pull="${esc(c.id)}">${esc(actionLabel(c,reasons[0]))}</button></article>`}).join(''):`<div class="empty-state"><strong>Nothing needs attention.</strong><br>Stable holdings remain quiet. You can inspect them at any time.</div>`;
  const decisions=sig.filter(x=>x.reasons.some(r=>r.includes('review')||r.includes('stale')));$('decisionCount').textContent=`${decisions.length} OPEN`;$('decisionList').innerHTML=decisions.length?decisions.map(({c,reasons})=>decisionHtml(c,reasons)).join(''):`<div class="empty-state">No decisions are waiting.</div>`;
  $('quietSummary').textContent=`${quietCommitments().length} unfinished commitments are intentionally quiet. ${missingDisposition().length?'Some are missing a wake/disposition path.':'Every quiet item has an inspectable wake/disposition path.'}`;
}
function signalDescription(c,reasons){const r=reasons[0]||'';if(r.includes('review'))return `The waiting review condition fired. ${c.nextAction}`;if(r.includes('due'))return `Due ${new Date(c.dueAt).toLocaleDateString()}. ${c.nextAction}`;if(r.includes('dependency'))return `A required dependency completed. ${c.nextAction}`;if(r.includes('material'))return `Material state changed after you last saw this commitment.`;if(r.includes('stale'))return `The saved return point predates a material change.`;if(r.includes('pinned')||r.includes('return'))return `Return point available. ${c.returnPoint?.summary||''}`;if(r.includes('untriaged'))return `Captured but not yet triaged.`;return c.nextAction||'Inspect current state.'}
function decisionHtml(c,reasons){if(reasons.some(r=>r.includes('review')))return `<article class="decision"><small>WAITING STATE EXPIRED</small><h3>${esc(c.title)}</h3><p>The review condition fired. Choose what happens next.</p><div class="decision-actions"><button class="primary" type="button" data-pull="${esc(c.id)}">Follow up now</button><button type="button" data-wait="${esc(c.id)}">Wait 2 days</button><button type="button" data-park="${esc(c.id)}">Park 7 days</button></div></article>`;return `<article class="decision"><small>STALE CONTEXT</small><h3>${esc(c.title)}</h3><p>A material change occurred after the saved return point.</p><div class="decision-actions"><button class="primary" type="button" data-pull="${esc(c.id)}">Review change</button><button type="button" data-clear="${esc(c.id)}">Mark seen</button></div></article>`}
function renderFocus(){const c=byId(state.focusId);if(!c||c.workState==='DONE'){$('focusContent').innerHTML=`<div class="focus-shell"><div class="focus-status"><span>FOCUS</span><span>NO CURRENT PULL</span></div><h1 id="focusTitle" class="focus-title" tabindex="-1">Nothing is in focus.</h1><p>Select Pull or Resume from a signal, or return to Signals.</p><div class="focus-actions"><button class="primary" type="button" data-view="signals">Open signals</button></div></div>`;return}
 const why=reasons(c);$('focusContent').innerHTML=`<div class="focus-shell"><div class="focus-status"><span>FOCUS · ACTIVE</span><span>${esc(c.scope||'Unscoped')}</span></div><h1 id="focusTitle" class="focus-title" tabindex="-1">${esc(c.title)}</h1><div class="focus-reason">Why this is here: ${esc((why.length?why:['explicit pull']).join(' · '))}</div><div class="return-point"><label for="returnSummary">Where you stopped</label><textarea id="returnSummary" rows="3">${esc(c.returnPoint?.summary||'')}</textarea><label for="returnNext">Next move</label><input id="returnNext" value="${esc(c.returnPoint?.nextAction||c.nextAction||'')}"><label for="returnUnresolved">Unresolved / watch for</label><input id="returnUnresolved" value="${esc(c.returnPoint?.unresolved||'')}"><button type="button" data-save-return="${esc(c.id)}">Save return point</button></div><div class="focus-next">${esc(c.returnPoint?.nextAction||c.nextAction||'Define the next concrete move.')}</div><div class="focus-actions"><button class="primary" type="button" data-done="${esc(c.id)}">Complete</button><button type="button" data-wait="${esc(c.id)}">Pause 2 days</button><button type="button" data-park="${esc(c.id)}">Park 7 days</button><button type="button" data-view="signals">Back to signals</button></div><div class="focus-meta"><div><span>Work state</span><p>${esc(c.workState)}</p></div><div><span>Attention state</span><p>${esc(c.attentionState)}</p></div><div><span>Wake / disposition</span><p>${esc(wakeText(c))}</p></div></div><details><summary>Context and provenance</summary><p>Created ${new Date(c.createdAt).toLocaleDateString()} · last material change ${new Date(c.materialChangedAt).toLocaleDateString()}.</p><p>This experiment keeps exhaustive history behind the working surface rather than treating it as the working surface.</p></details></div>`}
function renderHoldings(filter=''){const q=filter.trim().toLowerCase();const list=state.commitments.filter(c=>!q||[c.title,c.scope,c.workState,c.attentionState,wakeText(c)].join(' ').toLowerCase().includes(q));const missing=missingDisposition();$('holdingsWarning').hidden=!missing.length;$('holdingsWarning').textContent=missing.length?`${missing.length} unfinished quiet commitments have no wake/disposition path.`:'';$('holdingsList').innerHTML=list.map(c=>`<article class="holding-row"><div><strong>${esc(c.title)}</strong><small>${esc(c.scope||'Unscoped')}</small></div><span class="state-label">${esc(c.workState)} · ${esc(c.attentionState||'AUTO')}</span><div class="wake-rule">${esc(wakeText(c))}</div><div class="holding-actions"><button type="button" data-pull="${esc(c.id)}">Open</button></div></article>`).join('')}
function renderReliability(){
  const missing=missingDisposition();
  const external=state.externalSave||'not configured';
  const local=state.localSave||'unknown';
  const externalRecovery=/not configured/i.test(external)?'No cross-device restore path':'External state recorded';
  $('reliabilityContent').innerHTML=[
    '<div class="reliability-grid">',
    '<section class="reliability-item"><h2>Local browser state</h2><strong>'+esc(local)+'</strong><p>Material changes are written to this browser. A write failure changes this status to memory only.</p></section>',
    '<section class="reliability-item"><h2>External recovery</h2><strong>'+esc(externalRecovery)+'</strong><p>Current external state: '+esc(external)+'. This prototype does not claim cloud recovery when none is configured.</p></section>',
    '<section class="reliability-item"><h2>Quiet-work integrity</h2><strong>'+(missing.length?esc(String(missing.length))+' defects':'PASS')+'</strong><p>'+(missing.length?'Unfinished quiet commitments lack a wake/disposition path.':'Every unfinished quiet commitment currently has an inspectable return path.')+'</p></section>',
    '<section class="reliability-item"><h2>Snapshot format</h2><strong>v'+esc(SignalStateIO.SNAPSHOT_VERSION)+'</strong><p>'+state.commitments.length+' commitments. Import validates structure and duplicate IDs before replacing current state.</p></section>',
    '</div>',
    '<div class="reliability-actions"><button class="primary" type="button" data-export-snapshot>Export JSON snapshot</button><button type="button" data-import-snapshot>Import JSON snapshot</button><button type="button" data-reset-fixture>Reset synthetic fixture</button></div>',
    '<p class="reliability-note">Recovery rule: unreadable local state is preserved and blocks normal operation until the user exports the raw record, imports a known-good snapshot, or explicitly resets the fixture. The system must never silently replace corrupt durable state with a fresh empty/default state.</p>',
    loadError?'<div class="system-warning">'+esc(loadError)+'</div>':''
  ].join('');
}
function renderRecovery(){
  document.querySelectorAll('.view').forEach(v=>v.hidden=true);
  $('recoveryView').hidden=false;
  $('recoveryError').textContent=loadError||'The local snapshot could not be read safely.';
  $('systemSummary').textContent='local data needs recovery · normal editing blocked';
  document.querySelectorAll('.nav button').forEach(b=>b.disabled=true);
  setTimeout(()=>$('recoveryTitle')?.focus({preventScroll:true}),0);
}
function renderAll(){
  if(!state){renderRecovery();return}
  document.querySelectorAll('.nav button').forEach(b=>b.disabled=false);
  renderSummary();renderSignals();renderFocus();renderHoldings($('holdingsSearch')?.value||'');renderReliability();
}
function showView(name){
  if(!state&&name!=='recovery'){renderRecovery();return}
  document.querySelectorAll('.view').forEach(v=>v.hidden=true);
  const el=$(name+'View')||$('signalsView');
  el.hidden=false;window.scrollTo(0,0);
  const h=el.querySelector('h1');setTimeout(()=>h?.focus({preventScroll:true}),0);
}
function pull(id){const c=byId(id);if(!c)return;if(activeCount()>=3&&c.workState!=='ACTIVE'){toast('Active capacity is full. Resolve or pause current work first.');return}if(dependencyState(c).released)c.waitingOn=[];c.reviewAt=null;c.parkedUntil=null;c.disposition='';c.workState='ACTIVE';c.attentionState='NOW';c.userPinned=true;c.updatedAt=ANCHOR.toISOString();state.focusId=id;persist(`Pulled “${c.title}” into focus.`);showView('focus')}
function waitTwoDays(id){const c=byId(id);if(!c)return;c.workState='OPEN';c.attentionState='WAITING';c.reviewAt=atDays(2);c.parkedUntil=null;c.userPinned=false;c.disposition='Review in 2 days';c.waitingOn=[];c.updatedAt=ANCHOR.toISOString();if(state.focusId===id)state.focusId='';persist(`Waiting until ${new Date(c.reviewAt).toLocaleDateString()}.`);showView('signals')}
function parkSevenDays(id){const c=byId(id);if(!c)return;c.workState='OPEN';c.attentionState='PARKED';c.parkedUntil=atDays(7);c.reviewAt=null;c.userPinned=false;c.disposition='Wake in 7 days';c.waitingOn=[];c.updatedAt=ANCHOR.toISOString();if(state.focusId===id)state.focusId='';persist(`Parked until ${new Date(c.parkedUntil).toLocaleDateString()}.`);showView('signals')}
function complete(id){const c=byId(id);if(!c)return;c.workState='DONE';c.attentionState='QUIET';c.userPinned=false;c.disposition='Completed';c.updatedAt=ANCHOR.toISOString();if(state.focusId===id)state.focusId='';persist(`Completed “${c.title}”.`);showView('signals')}
function clearSeen(id){const c=byId(id);if(!c)return;c.lastSeenAt=c.materialChangedAt;c.returnPoint=null;c.userPinned=false;c.updatedAt=ANCHOR.toISOString();persist('Marked material change as seen.');showView('signals')}
function saveReturn(id){const c=byId(id);if(!c)return;c.returnPoint={summary:$('returnSummary').value.trim(),nextAction:$('returnNext').value.trim(),unresolved:$('returnUnresolved').value.trim(),updatedAt:ANCHOR.toISOString()};c.nextAction=c.returnPoint.nextAction;c.updatedAt=ANCHOR.toISOString();persist('Return point saved.');showView('focus')}
function toast(message){const t=$('toast');t.textContent=message;t.hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.hidden=true,3200)}

document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.view)return showView(b.dataset.view);if(b.dataset.pull)return pull(b.dataset.pull);if(b.dataset.wait)return waitTwoDays(b.dataset.wait);if(b.dataset.park)return parkSevenDays(b.dataset.park);if(b.dataset.done)return complete(b.dataset.done);if(b.dataset.clear)return clearSeen(b.dataset.clear);if(b.dataset.saveReturn)return saveReturn(b.dataset.saveReturn)});
$('holdingsSearch').addEventListener('input',e=>renderHoldings(e.target.value));
$('captureForm').addEventListener('submit',e=>{e.preventDefault();const title=$('captureTitleInput').value.trim();if(!title)return;const c=seedCommitment(uid('capture'),{title,scope:$('captureScopeInput').value.trim()||'Inbox',attentionState:'INBOX',nextAction:$('captureNextInput').value.trim(),createdAt:ANCHOR.toISOString(),updatedAt:ANCHOR.toISOString(),lastSeenAt:ANCHOR.toISOString(),materialChangedAt:ANCHOR.toISOString()});state.commitments.unshift(c);e.target.reset();persist(`Captured “${title}” to Inbox.`);showView('signals')});

renderAll();showView('signals');
