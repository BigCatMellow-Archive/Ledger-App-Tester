'use strict';

const assert=require('node:assert/strict');
const {convertLedgerSnapshot,validateLedgerSnapshot}=require('./ledger-import');
const {LEDGER_FIXTURE,DUPLICATE_ID_FIXTURE}=require('./fixtures');
const CONVERTED_AT='2026-09-22T15:00:00.000Z';

const tests=[];
function test(name,fn){
  try{fn();tests.push([name,true]);console.log('PASS',name)}
  catch(error){tests.push([name,false]);console.error('FAIL',name);console.error(error.stack||error)}
}

test('rejects non-Ledger-shaped source without items array',()=>{
  assert.equal(validateLedgerSnapshot({projects:[]}).ok,false);
});

const converted=convertLedgerSnapshot(LEDGER_FIXTURE,{convertedAt:CONVERTED_AT});
const bySource=id=>converted.state.commitments.find(c=>c.source?.sourceId===id);

test('converts actionable Ledger items but excludes NOTE items from commitments',()=>{
  assert.equal(converted.report.sourceItems,8);
  assert.equal(converted.report.convertedCommitments,7);
  assert.equal(converted.report.excludedNotes,1);
  assert.equal(bySource('note1'),undefined);
  assert.equal(converted.state.supportingRecords.notes.length,1);
});

test('preserves project title as optional scope instead of project-first hierarchy',()=>{
  assert.equal(bySource('open1').scope,'School operations');
  assert.equal(bySource('done1').scope,'Home project');
});

test('preserves source traceability on every converted commitment',()=>{
  for(const c of converted.state.commitments){
    assert.equal(c.source.system,'Ledger');
    assert.ok(c.source.sourceId);
  }
});

test('DONE maps to quiet completed work',()=>{
  const c=bySource('done1');
  assert.equal(c.workState,'DONE');
  assert.equal(c.attentionState,'QUIET');
  assert.match(c.disposition,/Completed in source Ledger/);
});

test('ACTIVE maps to NOW and gets a conservative generated return point',()=>{
  const c=bySource('active1');
  assert.equal(c.workState,'ACTIVE');
  assert.equal(c.attentionState,'NOW');
  assert.equal(c.returnPoint.summary,'Finished mapping morning classes.');
  assert.match(c.returnPoint.nextAction,/Review imported task context/);
  assert.equal(c.userPinned,true);
});

test('most recently touched ACTIVE item becomes Focus while multiple-active warning remains',()=>{
  assert.equal(converted.state.focusId,bySource('active1').id);
  assert.ok(converted.report.warnings.some(w=>w.kind==='multiple-active'));
});

test('free-text dependency never becomes a fabricated structured dependency or review date',()=>{
  const c=bySource('blocked1');
  assert.equal(c.attentionState,'WAITING');
  assert.deepEqual(c.waitingOn,[]);
  assert.equal(c.reviewAt,null);
  assert.equal(c.manualOnly,true);
  assert.match(c.disposition,/Manual review required/);
  assert.equal(c.sourceContext.dependencies,'Waiting for vendor confirmation');
});

test('OPEN item with dependency text is conservatively held for manual review',()=>{
  const c=bySource('free-dep');
  assert.equal(c.workState,'OPEN');
  assert.equal(c.attentionState,'WAITING');
  assert.equal(c.manualOnly,true);
  assert.equal(c.reviewAt,null);
});

test('ordinary OPEN work remains eligible NEXT without invented urgency',()=>{
  const c=bySource('open1');
  assert.equal(c.workState,'OPEN');
  assert.equal(c.attentionState,'NEXT');
  assert.equal(c.dueAt,null);
  assert.equal(c.reviewAt,null);
  assert.equal(c.userPinned,false);
});

test('orphaned project reference is retained as Unscoped and reported',()=>{
  const c=bySource('orphan');
  assert.equal(c.scope,'Unscoped');
  assert.ok(converted.report.warnings.some(w=>w.kind==='missing-project'&&w.sourceId==='orphan'));
});

test('project notes, journal, worklog, and framing survive as supporting provenance',()=>{
  assert.equal(converted.state.supportingRecords.notes[0].body,'Front office closes at 4:30 on Friday.');
  assert.equal(converted.state.supportingRecords.journal[0].body,'Field trip timing changed to 10:00.');
  assert.equal(converted.state.supportingRecords.worklog[0].summary,'Mapped morning coverage.');
  assert.equal(converted.state.supportingRecords.projects[0].framing.done,'Nothing important is missed.');
});

test('duplicate source IDs produce unique commitment IDs without losing source IDs',()=>{
  const r=convertLedgerSnapshot(DUPLICATE_ID_FIXTURE,{convertedAt:CONVERTED_AT});
  assert.equal(new Set(r.state.commitments.map(c=>c.id)).size,2);
  assert.deepEqual(r.state.commitments.map(c=>c.source.sourceId),['same','same']);
});

const failed=tests.filter(([,pass])=>!pass);
console.log('');
console.log(String(tests.length-failed.length)+'/'+String(tests.length)+' tests passed');
if(failed.length)process.exit(1);
