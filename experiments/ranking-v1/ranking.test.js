'use strict';

const assert=require('node:assert/strict');
const fixtures=require('./fixtures');
const {evaluateScenario,summarize,rank}=require('./ranking');

const methods=['deterministic','manual','hybrid'];
const results=methods.flatMap(method=>fixtures.map(f=>evaluateScenario(f,method)));
for(const r of results){
  assert.equal(r.explanationsComplete,true,`${r.scenario}/${r.method} missing explanation`);
}

const byMethod=Object.fromEntries(methods.map(method=>[
  method,
  summarize(results.filter(r=>r.method===method))
]));

assert.equal(byMethod.hybrid.guardViolations,0,'hybrid must preserve hard guards');
assert.ok(byMethod.hybrid.topMatches>=byMethod.deterministic.topMatches,'hybrid should not reduce stated top-choice fit');
assert.ok(byMethod.hybrid.disagreements<=byMethod.deterministic.disagreements,'hybrid should not increase stated-order disagreements');
assert.ok(byMethod.manual.guardViolations>0,'manual-only ranking should expose stale/manual safety risk in fixture');
assert.ok(byMethod.hybrid.userMetadataCount>0,'hybrid experiment must actually use explicit user preference');
assert.ok(byMethod.hybrid.userMetadataCount<fixtures.reduce((n,f)=>n+f.items.length,0),'hybrid must not require a full manual rank for every item');

const partial=fixtures.find(f=>f.id==='partial-preference');
assert.deepEqual(rank(partial.items,'hybrid').map(x=>x.id),['chosen','routine-a','routine-b']);

console.log(JSON.stringify({byMethod,results},null,2));
