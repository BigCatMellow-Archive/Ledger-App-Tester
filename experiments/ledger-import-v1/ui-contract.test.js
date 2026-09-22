'use strict';

const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const LedgerImportV1=require('./ledger-import');
const {LEDGER_FIXTURE}=require('./fixtures');
const SignalStateIO=require('../signal-pull-v1/state-io');

const app=fs.readFileSync(path.join(__dirname,'../signal-pull-v1/app.js'),'utf8');
const html=fs.readFileSync(path.join(__dirname,'../signal-pull-v1/index.html'),'utf8');

assert.ok(html.indexOf('../ledger-import-v1/ledger-import.js')>0,'Ledger converter script missing');
assert.ok(html.indexOf('../ledger-import-v1/ledger-import.js')<html.indexOf('app.js'),'Ledger converter must load before app.js');
assert.match(html,/id="ledgerImport"/);
assert.match(html,/id="ledgerImportPreview"/);

const start=app.indexOf('function openLedgerImport');
const end=app.indexOf('async function importSnapshot');
assert.ok(start>0&&end>start,'Ledger import function block missing');
const snippet=app.slice(start,end);

function harness(){
  const sets=[];
  const notices=[];
  const views=[];
  const initialState=SignalStateIO.normalizeState({
    commitments:[{id:'old',title:'Existing tester work',workState:'OPEN',attentionState:'NEXT'}],
    focusId:'',
    localSave:'saved',
    externalSave:'not configured'
  });
  const localStorage={setItem:(k,v)=>sets.push([k,v])};
  const code=[
    "let state=initialState;",
    "let pendingLedgerImport=null;",
    "let corruptRaw='';",
    "let loadError='';",
    "const ANCHOR=new Date('2026-09-22T13:30:00.000Z');",
    "const STORAGE_KEY='signal-pull-v1-state';",
    "const PRE_LEDGER_IMPORT_BACKUP_KEY='signal-pull-v1-pre-ledger-import-backup';",
    "const $=()=>null;",
    "function renderLedgerImportPreview(){}",
    "function renderAll(){}",
    "function showView(v){views.push(v)}",
    "function toast(v){notices.push(v)}",
    snippet,
    "return {previewLedgerImport,applyLedgerImport,cancelLedgerImport,get:()=>({state,pendingLedgerImport,corruptRaw,loadError})};"
  ].join('\n');
  const api=new Function('initialState','localStorage','views','notices','SignalStateIO','LedgerImportV1',code)(
    initialState,localStorage,views,notices,SignalStateIO,LedgerImportV1
  );
  return {api,sets,notices,views,initialState};
}

(async()=>{
  {
    const {api,sets,initialState}=harness();
    await api.previewLedgerImport({text:async()=>JSON.stringify(LEDGER_FIXTURE)});
    const beforeApply=api.get();
    assert.equal(beforeApply.state,initialState,'preview must not replace current Signal + Pull state');
    assert.equal(beforeApply.pendingLedgerImport.report.convertedCommitments,7);
    assert.equal(sets.length,0,'preview must not write local storage');

    api.applyLedgerImport();
    const after=api.get();
    assert.equal(after.pendingLedgerImport,null);
    assert.equal(after.state.importProvenance.sourceSystem,'Ledger');
    assert.equal(after.state.commitments.length,7);
    assert.equal(sets[0][0],'signal-pull-v1-pre-ledger-import-backup','existing tester state must be backed up first');
    assert.equal(sets[1][0],'signal-pull-v1-state','converted state must be persisted only after backup');
  }

  {
    const {api,sets,initialState}=harness();
    await api.previewLedgerImport({text:async()=>JSON.stringify({projects:[]})});
    const r=api.get();
    assert.equal(r.state,initialState,'invalid Ledger preview must not replace state');
    assert.equal(r.pendingLedgerImport,null);
    assert.equal(sets.length,0);
  }

  {
    const {api,sets,initialState}=harness();
    await api.previewLedgerImport({text:async()=>'{broken'});
    const r=api.get();
    assert.equal(r.state,initialState,'invalid JSON preview must not replace state');
    assert.equal(r.pendingLedgerImport,null);
    assert.equal(sets.length,0);
  }

  console.log('12/12 Ledger import UI contract checks passed');
})().catch(error=>{console.error(error.stack||error);process.exit(1)});
