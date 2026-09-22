'use strict';
const assert=require('node:assert/strict');
const R=require('./reliability-core');
const valid={schemaVersion:1,commitments:[{id:'a',title:'A',workState:'OPEN',attentionState:'WAITING',waitingOn:[]}],focusId:'',localSave:'saved',externalSave:'not configured'};
let n=0;
function test(name,fn){fn();console.log('PASS',name);n++}
test('valid state passes',()=>assert.equal(R.validateState(valid).ok,true));
test('malformed JSON rejected',()=>assert.equal(R.parseStateText('{oops').ok,false));
test('wrong commitments shape rejected',()=>assert.equal(R.parseStateText(JSON.stringify({commitments:{}})).ok,false));
test('duplicate commitment ids rejected',()=>assert.equal(R.validateState({...valid,commitments:[valid.commitments[0],{...valid.commitments[0]}]}).ok,false));
test('unsupported schema rejected',()=>assert.equal(R.validateState({...valid,schemaVersion:99}).ok,false));
test('backup envelope round trip',()=>{const env=R.makeBackupEnvelope(valid,'2026-09-22T14:00:00Z');const parsed=R.parseBackupText(JSON.stringify(env));assert.equal(parsed.ok,true);assert.equal(parsed.envelope,true);assert.deepEqual(parsed.state,valid)});
test('raw-state restore remains accepted',()=>{const parsed=R.parseBackupText(JSON.stringify(valid));assert.equal(parsed.ok,true);assert.equal(parsed.envelope,false);assert.deepEqual(parsed.state,valid)});
console.log(`\n${n}/${n} tests passed`);
