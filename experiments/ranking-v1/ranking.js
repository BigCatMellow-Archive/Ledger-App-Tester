'use strict';

const REASON_WEIGHT = new Map([
  ['integrity defect', 120],
  ['due now or overdue', 110],
  ['return point stale', 100],
  ['dependency reference missing', 95],
  ['due within 3 days', 90],
  ['waiting review due', 85],
  ['dependency completed', 80],
  ['material change since last seen', 75],
  ['user pinned', 70],
  ['active return point', 65],
  ['untriaged', 50],
  ['eligible', 10],
]);

const HARD_GUARD_REASONS = new Set([
  'integrity defect',
  'due now or overdue',
  'dependency reference missing',
]);

function weight(reason) {
  return REASON_WEIGHT.get(reason) || 0;
}

function normalize(item) {
  const reasons = Array.isArray(item.reasons) && item.reasons.length ? item.reasons.map(String) : ['eligible'];
  return {
    id: String(item.id),
    title: String(item.title || item.id),
    reasons,
    userOrder: Number.isFinite(item.userOrder) ? item.userOrder : null,
    eligible: item.eligible !== false,
    updatedAt: item.updatedAt || '',
  };
}

function strongestReason(item) {
  return [...item.reasons].sort((a,b)=>weight(b)-weight(a))[0] || 'eligible';
}

function deterministicSort(a,b) {
  const aw=Math.max(...a.reasons.map(weight),0);
  const bw=Math.max(...b.reasons.map(weight),0);
  if(aw!==bw)return bw-aw;
  const au=Date.parse(a.updatedAt)||0;
  const bu=Date.parse(b.updatedAt)||0;
  if(au!==bu)return bu-au;
  return a.id.localeCompare(b.id);
}

function manualSort(a,b) {
  const ao=a.userOrder===null?Number.POSITIVE_INFINITY:a.userOrder;
  const bo=b.userOrder===null?Number.POSITIVE_INFINITY:b.userOrder;
  if(ao!==bo)return ao-bo;
  return deterministicSort(a,b);
}

function isHardGuard(item) {
  return item.reasons.some(r=>HARD_GUARD_REASONS.has(r));
}

function hybridSort(a,b) {
  const ag=isHardGuard(a), bg=isHardGuard(b);
  if(ag!==bg)return ag?-1:1;
  if(ag&&bg)return deterministicSort(a,b);
  return manualSort(a,b);
}

function explanation(item,method) {
  const factors=[];
  if(method==='hybrid'&&isHardGuard(item))factors.push('hard guard');
  if((method==='manual'||method==='hybrid')&&item.userOrder!==null)factors.push(`user order ${item.userOrder}`);
  factors.push(`reason: ${strongestReason(item)}`);
  return factors;
}

function rank(rawItems, method='deterministic') {
  const items=rawItems.map(normalize).filter(x=>x.eligible);
  const sorter=method==='manual'?manualSort:method==='hybrid'?hybridSort:deterministicSort;
  return [...items].sort(sorter).map((item,index)=>({
    ...item,
    rank:index+1,
    explanation:explanation(item,method),
    hardGuard:isHardGuard(item),
  }));
}

function pairwiseDisagreements(ranked, expectedOrder) {
  const pos=new Map(ranked.map((x,i)=>[x.id,i]));
  let disagreements=0, pairs=0;
  for(let i=0;i<expectedOrder.length;i++){
    for(let j=i+1;j<expectedOrder.length;j++){
      const a=expectedOrder[i], b=expectedOrder[j];
      if(!pos.has(a)||!pos.has(b))continue;
      pairs++;
      if(pos.get(a)>pos.get(b))disagreements++;
    }
  }
  return {disagreements,pairs};
}

function guardViolations(ranked, guards=[]) {
  const pos=new Map(ranked.map((x,i)=>[x.id,i]));
  return guards.filter(([before,after])=>pos.has(before)&&pos.has(after)&&pos.get(before)>pos.get(after));
}

function evaluateScenario(scenario,method) {
  const ranked=rank(scenario.items,method);
  const pairwise=pairwiseDisagreements(ranked,scenario.expectedOrder||[]);
  const violations=guardViolations(ranked,scenario.guards||[]);
  const topExpected=(scenario.expectedOrder||[])[0]||null;
  const userMetadataCount=scenario.items.filter(x=>Number.isFinite(x.userOrder)).length;
  return {
    scenario:scenario.id,
    method,
    order:ranked.map(x=>x.id),
    topMatch:topExpected?ranked[0]?.id===topExpected:true,
    disagreements:pairwise.disagreements,
    comparedPairs:pairwise.pairs,
    guardViolations:violations,
    userMetadataCount:method==='deterministic'?0:userMetadataCount,
    explanationsComplete:ranked.every(x=>x.explanation.length>0),
  };
}

function summarize(results) {
  return results.reduce((acc,r)=>{
    acc.scenarios++;
    if(r.topMatch)acc.topMatches++;
    acc.disagreements+=r.disagreements;
    acc.comparedPairs+=r.comparedPairs;
    acc.guardViolations+=r.guardViolations.length;
    acc.userMetadataCount+=r.userMetadataCount;
    if(!r.explanationsComplete)acc.incompleteExplanations++;
    return acc;
  },{scenarios:0,topMatches:0,disagreements:0,comparedPairs:0,guardViolations:0,userMetadataCount:0,incompleteExplanations:0});
}

module.exports={rank,evaluateScenario,summarize,isHardGuard,weight};
