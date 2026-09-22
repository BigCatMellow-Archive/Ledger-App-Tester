'use strict';

const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const SignalStateIO=require('./state-io');

const app=fs.readFileSync(path.join(__dirname,'app.js'),'utf8');
const tests=[];
async function test(name,fn){
  try{await fn();tests.push([name,true]);console.log('PASS',name)}
  catch(error){tests.push([name,false]);console.error('FAIL',name);console.error(error.stack||error)}
}
function storageWith(raw,throwRead=false){
  const calls=[];
  return {
    calls,
    getItem(){if(throwRead)throw new Error('read blocked');return raw},
    setItem(k,v){calls.push([k,v])},
  };
}
function startup(storage){
  const cutoff=app.indexOf('function byId');
  assert.ok(cutoff>0,'startup cutoff missing');
  const prefix=app.slice(0,cutoff);
  const dummyDocument={getElementById(){return null}};
  return new Function('localStorage','SignalStateIO','document',prefix+'; return {state,corruptRaw,loadError};')(storage,SignalStateIO,dummyDocument);
}
async function importCase(fileText){
  const start=app.indexOf('async function importSnapshot');
  const end=app.indexOf('function resetFixture');
  assert.ok(start>0&&end>start,'importSnapshot block missing');
  const snippet=app.slice(start,end);
  const sets=[];const notices=[];const views=[];
  const initial={commitments:[{id:'old',title:'Old'}],focusId:'',localSave:'saved',externalSave:'not configured'};
  const harness=[
    "let state=initialState;let corruptRaw='broken';let loadError='';",
    "const localStorage={setItem:(k,v)=>sets.push([k,v])};",
    "function renderAll(){}",
    "function renderReliability(){}",
    "function renderRecovery(){}",
    "function showView(v){views.push(v)}",
    "function toast(v){notices.push(v)}",
    snippet,
    "return {importSnapshot,get:()=>({state,corruptRaw,loadError})};"
  ].join('\n');
  const api=new Function('initialState','sets','notices','views','SignalStateIO','STORAGE_KEY',harness)(initial,sets,notices,views,SignalStateIO,'signal-pull-v1-state');
  await api.importSnapshot({text:async()=>fileText});
  return {...api.get(),sets,notices,views};
}

(async()=>{
  await test('empty storage seeds without writing over anything',async()=>{
    const s=storageWith(null);const r=startup(s);
    assert.equal(r.state.commitments.length,100);
    assert.equal(r.corruptRaw,'');
    assert.equal(s.calls.length,0);
  });
  await test('valid snapshot loads',async()=>{
    const raw=JSON.stringify({commitments:[{id:'x',title:'X',workState:'OPEN',attentionState:'NEXT'}],focusId:'',localSave:'saved',externalSave:'not configured'});
    const r=startup(storageWith(raw));
    assert.equal(r.state.commitments[0].id,'x');
  });
  await test('corrupt snapshot blocks and preserves raw bytes',async()=>{
    const raw='{definitely broken';const s=storageWith(raw);const r=startup(s);
    assert.equal(r.state,null);
    assert.equal(r.corruptRaw,raw);
    assert.equal(s.calls.length,0);
    assert.match(r.loadError,/valid JSON/);
  });
  await test('storage read failure degrades visibly to memory only',async()=>{
    const r=startup(storageWith(null,true));
    assert.equal(r.state.localSave,'memory only');
    assert.match(r.loadError,/could not be read/);
  });
  await test('valid import replaces state only after validation and persists it',async()=>{
    const raw=JSON.stringify({commitments:[{id:'new',title:'New',workState:'OPEN',attentionState:'NEXT'}],focusId:'',localSave:'saved',externalSave:'not configured'});
    const r=await importCase(raw);
    assert.equal(r.state.commitments[0].id,'new');
    assert.equal(r.corruptRaw,'');
    assert.equal(r.sets.length,1);
    assert.ok(r.views.includes('reliability'));
  });
  await test('invalid import leaves current state untouched',async()=>{
    const r=await importCase('{broken');
    assert.equal(r.state.commitments[0].id,'old');
    assert.equal(r.sets.length,0);
    assert.match(r.loadError,/valid JSON/);
  });
  await test('export and persistence use validated serializer',async()=>{
    assert.match(app,/SignalStateIO\.serializeSnapshot\(state\)/);
    assert.match(app,/function exportSnapshot/);
  });
  await test('corrupt startup never opens normal signal view',async()=>{
    assert.match(app,/renderAll\(\);if\(state\)showView\('signals'\)/);
    assert.match(app,/downloadCorruptBackup/);
  });

  const failed=tests.filter(([,pass])=>!pass);
  console.log('');
  console.log(`${tests.length-failed.length}/${tests.length} tests passed`);
  if(failed.length)process.exit(1);
})();
