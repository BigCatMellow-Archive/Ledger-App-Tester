'use strict';

const STORAGE_KEY='ledger-notes-roadmaps-v2';
const THEME_KEY='ledger-stationery-theme-v1';
const SYNC_STATUS_KEY='ledger-github-sync-status-v1';
const SYNC_CONNECTION_KEY='ledger-github-sync-remember-v1';
const $=id=>document.getElementById(id);
let state=null;
let corruptRaw='';
let captureKind='CHECKLIST';
let undoRaw='';
let toastTimer=0;

function uid(prefix='x'){
  if(globalThis.crypto?.randomUUID)return `${prefix}-${globalThis.crypto.randomUUID()}`;
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}
function now(){return new Date().toISOString()}
function esc(value){return String(value??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function readJson(key){try{return JSON.parse(localStorage.getItem(key)||'null')}catch(e){return null}}
function safeHttpUrl(value){
  const raw=String(value||'').trim();
  if(!raw)return '';
  const candidate=/^https?:\/\//i.test(raw)?raw:`https://${raw}`;
  try{const u=new URL(candidate);return /^(https?):$/.test(u.protocol)?u.href:''}catch(e){return ''}
}
function normalizeLinks(links){
  if(!Array.isArray(links))return [];
  const seen=new Set();
  return links.map(link=>typeof link==='string'?{label:'',url:link}:link||{}).map(link=>({label:String(link.label||'').trim(),url:safeHttpUrl(link.url)})).filter(link=>link.url&&!seen.has(link.url)&&seen.add(link.url));
}
function parseLinks(text){
  const seen=new Set();
  return String(text||'').split('\n').map(line=>line.trim()).filter(Boolean).map(line=>{
    const i=line.indexOf('|');
    const label=i>=0?line.slice(0,i).trim():'';
    const url=safeHttpUrl(i>=0?line.slice(i+1).trim():line);
    return {label,url};
  }).filter(link=>link.url&&!seen.has(link.url)&&seen.add(link.url));
}
function linkLabel(link){
  if(link.label)return link.label;
  try{const u=new URL(link.url);const parts=u.pathname.split('/').filter(Boolean);if(u.hostname==='github.com'&&parts.length>=2)return `${parts[0]}/${parts[1]}`;return u.hostname.replace(/^www\./,'')}catch(e){return link.url}
}
function normalizeSubtasks(item){
  if(!Array.isArray(item?.subtasks))return [];
  return item.subtasks.map(sub=>typeof sub==='string'?{id:uid('s'),text:sub,done:false}:sub||{}).map(sub=>({id:String(sub.id||uid('s')),text:String(sub.text||'').trim(),done:!!sub.done})).filter(sub=>sub.text);
}
function normalizeNotations(item){
  const out=[];
  if(Array.isArray(item?.notations)){
    item.notations.forEach(note=>{
      const text=String(typeof note==='string'?note:note?.text||'').trim();
      if(!text)return;
      out.push({id:String(typeof note==='string'?uid('n'):note.id||uid('n')),text,createdAt:String(typeof note==='string'?(item.createdAt||''):note.createdAt||item.createdAt||''),updatedAt:String(typeof note==='string'?'':note.updatedAt||'')});
    });
  }
  return out;
}
function normalizeState(value){
  const next=value&&typeof value==='object'?value:{};
  next.activeProject=String(next.activeProject||'');
  next.projects=Array.isArray(next.projects)?next.projects:[];
  next.items=Array.isArray(next.items)?next.items:[];
  next.worklog=Array.isArray(next.worklog)?next.worklog:[];
  next.journal=Array.isArray(next.journal)?next.journal:[];
  next.projects.forEach(p=>{p.links=normalizeLinks(p.links);p.framing=p.framing&&typeof p.framing==='object'?p.framing:{}});
  next.items.forEach(item=>{item.subtasks=normalizeSubtasks(item);item.notations=normalizeNotations(item);item.link=safeHttpUrl(item.link||'')});
  return next;
}
function demoState(){
  const t=new Date();
  const h=n=>new Date(t.getTime()-n*3600000).toISOString();
  return normalizeState({
    activeProject:'p-demo',
    projects:[
      {id:'p-demo',title:'Launch the new Ledger',description:'Shape the project memory tool into something that makes returning to work feel effortless.',mode:'ROADMAP',createdAt:h(100),workedAt:h(1),links:[{label:'Repository',url:'https://github.com/BigCatMellow-Archive/Ledger-App-Tester'}],framing:{currentReality:'The product works, but visual iterations have not yet made re-entry the organizing principle.',done:'A returning user can understand state and resume useful work in seconds.',proof:'Desktop and mobile test flows survive real project content without hidden context.',risk:'Adding design expression without improving continuity.'}},
      {id:'p-two',title:'Reading system',description:'Keep the weekly reading pipeline useful and varied.',mode:'LIST',createdAt:h(220),workedAt:h(28),links:[],framing:{}}
    ],
    items:[
      {id:'i1',p:'p-demo',kind:'EXECUTION',status:'ACTIVE',phase:'V3 / BUILD',title:'Build the from-scratch return-point interface',createdAt:h(10),workedAt:h(1),notes:'Keep the existing data model, but do not inherit the old layout.',notations:[{id:'n1',text:'Mobile dock needs to remain readable under thumb use.',createdAt:h(2),updatedAt:''}],outcome:'A coherent desktop/mobile UI that can replace the current tester.',inputs:'MAPS_L bootstrap + AIDB design council',dependencies:'Preserve current localStorage schema',boundary:'Tester repo only',acceptance:'Core project, task, notes and history flows work.',verification:'Rendered desktop + phone fixture',stopCondition:'Do not widen into production repo',completedAt:'',link:'',subtasks:[{id:'s1',text:'Bootstrap product goal',done:true},{id:'s2',text:'Build visual system',done:true},{id:'s3',text:'Wire interactions',done:false}]},
      {id:'i2',p:'p-demo',kind:'CHECKLIST',status:'OPEN',phase:'VERIFY',title:'Render a real mobile fixture and correct collisions',createdAt:h(8),workedAt:h(8),notes:'',notations:[],outcome:'',inputs:'',dependencies:'',boundary:'',acceptance:'',verification:'',stopCondition:'',completedAt:'',link:'',subtasks:[]},
      {id:'i3',p:'p-demo',kind:'CHECKLIST',status:'BLOCKED',phase:'AFTER LIVE',title:'Compare the new direction against the previous clean-sheet pass',createdAt:h(7),workedAt:h(6),notes:'Use actual screenshots, not the design rationale.',notations:[],outcome:'',inputs:'',dependencies:'Needs live V3',boundary:'',acceptance:'',verification:'',stopCondition:'',completedAt:'',link:'',subtasks:[]},
      {id:'i4',p:'p-demo',kind:'NOTE',status:'OPEN',title:'The interface should feel like a continuity instrument, not a decorated task manager.',createdAt:h(5),workedAt:h(5)},
      {id:'i5',p:'p-demo',kind:'NOTE',status:'OPEN',title:'Current work must outrank branding, and notes should live close to the work they explain.',createdAt:h(4),workedAt:h(4)},
      {id:'i6',p:'p-demo',kind:'CHECKLIST',status:'DONE',phase:'BOOTSTRAP',title:'Define DONE and work backward',createdAt:h(20),workedAt:h(12),completedAt:h(12),subtasks:[]}
    ],
    journal:[{id:'j1',p:'p-demo',body:'The useful design move is to treat returning after interruption as the primary state, not an edge case.',createdAt:h(3),updatedAt:h(3)},{id:'j2',p:'p-demo',body:'Avoid another layer of CSS over legacy structure. Build the page semantics around the actual job.',createdAt:h(9),updatedAt:h(9)}],
    worklog:[{id:'w1',p:'p-demo',itemId:'i1',whenAt:h(1),summary:'Selected RETURN POINT and began the V3 implementation.'},{id:'w2',p:'p-demo',itemId:'i6',whenAt:h(12),summary:'Completed the MAPS_L backward plan.'}]
  });
}
function loadState(){
  corruptRaw='';
  const raw=localStorage.getItem(STORAGE_KEY);
  if(!raw){
    if(new URLSearchParams(location.search).get('demo')==='1'){
      const sample=demoState();
      localStorage.setItem(STORAGE_KEY,JSON.stringify(sample));
      return sample;
    }
    return normalizeState({activeProject:'',projects:[],items:[],worklog:[],journal:[]});
  }
  try{return normalizeState(JSON.parse(raw))}
  catch(e){corruptRaw=raw;return null}
}
function persist(message='',beforeRaw=''){
  if(!state)return;
  const value=JSON.stringify(state);
  localStorage.setItem(STORAGE_KEY,value);
  window.dispatchEvent(new StorageEvent('storage',{key:STORAGE_KEY,newValue:value,storageArea:localStorage,url:location.href}));
  render();
  if(message)showToast(message,beforeRaw);
}
function activeProject(){
  if(!state)return null;
  let p=state.projects.find(p=>p.id===state.activeProject);
  if(!p&&state.projects.length){p=state.projects[0];state.activeProject=p.id;localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}
  return p||null;
}
function touchProject(project,t=now()){if(project)project.workedAt=t}
function addLog(summary,itemId='',projectId=''){
  const p=projectId||activeProject()?.id||'';
  state.worklog.unshift({id:uid('w'),p,itemId,whenAt:now(),summary});
}
function snapshot(){return localStorage.getItem(STORAGE_KEY)||''}

function relativeTime(value){
  const d=new Date(value||'');if(Number.isNaN(d.getTime()))return 'No recorded activity';
  const diff=Date.now()-d.getTime();
  const mins=Math.max(0,Math.floor(diff/60000));
  if(mins<1)return 'Just now';if(mins<60)return `${mins}m ago`;
  const hrs=Math.floor(mins/60);if(hrs<24)return `${hrs}h ago`;
  const days=Math.floor(hrs/24);if(days<7)return `${days}d ago`;
  return d.toLocaleDateString(undefined,{month:'short',day:'numeric'});
}
function dateLabel(value){
  const d=new Date(value||'');if(Number.isNaN(d.getTime()))return '';
  return d.toLocaleDateString(undefined,{month:'short',day:'numeric',year:d.getFullYear()===new Date().getFullYear()?undefined:'numeric'});
}
function dateTimeLabel(value){
  const d=new Date(value||'');if(Number.isNaN(d.getTime()))return '';
  return `${dateLabel(value)} · ${d.toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'})}`;
}
function statusLabel(item){
  if(item.status==='DONE')return 'DONE';
  if(item.status==='BLOCKED'||String(item.dependencies||'').trim())return 'WAIT';
  if(item.status==='ACTIVE')return 'ACTIVE';
  return 'OPEN';
}
function statusClass(item){const s=statusLabel(item);return s==='WAIT'?'blocked':s.toLowerCase()}
function taskMeta(item){
  const bits=[];
  if(item.phase)bits.push(item.phase);
  if(item.workedAt)bits.push(`touched ${relativeTime(item.workedAt)}`);
  if(item.link)bits.push('linked');
  return bits;
}
function taskProgress(item){
  const subs=normalizeSubtasks(item);if(!subs.length)return null;
  const done=subs.filter(s=>s.done).length;return {done,total:subs.length,pct:Math.round(done/subs.length*100)};
}
function firstTaskNote(item){
  const notes=normalizeNotations(item).sort((a,b)=>String(b.updatedAt||b.createdAt).localeCompare(String(a.updatedAt||a.createdAt)));
  return notes[0]?.text||String(item.notes||'').trim()||'';
}
