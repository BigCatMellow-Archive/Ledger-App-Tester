'use strict';

const assert=require('node:assert/strict');
const S=require('./state-io');

function validState(){
  return {
    commitments:[{
      id:'a',
      title:'A',
      workState:'OPEN',
      attentionState:'WAITING',
      reviewAt:'2026-09-25T00:00:00Z',
      waitingOn:[],
    }],
    focusId:'',
    createdAt:'2026-09-22T00:00:00Z',
    localSave:'saved',
    externalSave:'not configured',
  };
}

const tests=[];
function test(name,fn){
  try{fn();tests.push([name,true]);console.log('PASS',name)}
  catch(error){tests.push([name,false]);console.error('FAIL',name);console.error(error.stack||error)}
}

test('valid snapshot parses',()=>{
  const r=S.parseSnapshot(JSON.stringify(validState()));
  assert.equal(r.ok,true);
  assert.equal(r.state.commitments.length,1);
});

test('invalid JSON is rejected',()=>{
  assert.equal(S.parseSnapshot('{broken').ok,false);
});

test('missing commitments array is rejected',()=>{
  assert.equal(S.parseSnapshot(JSON.stringify({focusId:''})).ok,false);
});

test('duplicate commitment IDs are rejected',()=>{
  const x={commitments:[{id:'x',title:'A'},{id:'x',title:'B'}]};
  assert.equal(S.parseSnapshot(JSON.stringify(x)).ok,false);
});

test('serialization round trip preserves valid structure',()=>{
  const r=S.parseSnapshot(S.serializeSnapshot(validState()));
  assert.equal(r.ok,true);
  assert.equal(r.state.snapshotVersion,1);
  assert.equal(r.state.commitments[0].id,'a');
});

test('invalid dates normalize to null',()=>{
  const x={commitments:[{id:'x',title:'A',dueAt:'nonsense'}]};
  const r=S.parseSnapshot(JSON.stringify(x));
  assert.equal(r.ok,true);
  assert.equal(r.state.commitments[0].dueAt,null);
});

const failed=tests.filter(([,pass])=>!pass);
console.log('');
console.log(`${tests.length-failed.length}/${tests.length} tests passed`);
if(failed.length)process.exit(1);
