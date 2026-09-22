'use strict';

(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  root.SignalStateIO=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const SNAPSHOT_VERSION=1;
  const ATTENTION_STATES=new Set(['INBOX','NOW','NEXT','WAITING','PARKED','QUIET','REVIEW','']);
  const WORK_STATES=new Set(['OPEN','ACTIVE','BLOCKED','DONE']);

  function stringOr(value,fallback=''){return typeof value==='string'?value:fallback}
  function nullableString(value){return value==null?null:String(value)}
  function validIsoOrNull(value){
    if(value==null||value==='')return null;
    const t=new Date(value).getTime();
    return Number.isFinite(t)?new Date(t).toISOString():null;
  }
  function normalizeCommitment(raw){
    const c=raw&&typeof raw==='object'?raw:{};
    const work=String(c.workState||'OPEN').toUpperCase();
    const attention=String(c.attentionState||'NEXT').toUpperCase();
    return {
      ...c,
      id:stringOr(c.id),
      title:stringOr(c.title),
      scope:stringOr(c.scope),
      workState:WORK_STATES.has(work)?work:'OPEN',
      attentionState:ATTENTION_STATES.has(attention)?attention:'NEXT',
      createdAt:validIsoOrNull(c.createdAt),
      updatedAt:validIsoOrNull(c.updatedAt),
      lastSeenAt:validIsoOrNull(c.lastSeenAt),
      materialChangedAt:validIsoOrNull(c.materialChangedAt),
      reviewAt:validIsoOrNull(c.reviewAt),
      parkedUntil:validIsoOrNull(c.parkedUntil),
      dueAt:validIsoOrNull(c.dueAt),
      userPinned:!!c.userPinned,
      waitingOn:Array.isArray(c.waitingOn)?c.waitingOn.map(String):[],
      disposition:stringOr(c.disposition),
      nextAction:stringOr(c.nextAction),
      returnPoint:c.returnPoint&&typeof c.returnPoint==='object'?{
        summary:stringOr(c.returnPoint.summary),
        nextAction:stringOr(c.returnPoint.nextAction),
        unresolved:stringOr(c.returnPoint.unresolved),
        updatedAt:validIsoOrNull(c.returnPoint.updatedAt),
      }:null,
    };
  }
  function validateState(value){
    const errors=[];
    if(!value||typeof value!=='object'||Array.isArray(value))return {ok:false,errors:['Snapshot root must be an object.']};
    if(!Array.isArray(value.commitments))errors.push('Snapshot must contain a commitments array.');
    const ids=new Set();
    if(Array.isArray(value.commitments)){
      value.commitments.forEach((c,index)=>{
        if(!c||typeof c!=='object'||Array.isArray(c)){errors.push(`Commitment ${index+1} is not an object.`);return}
        if(typeof c.id!=='string'||!c.id.trim())errors.push(`Commitment ${index+1} is missing an id.`);
        else if(ids.has(c.id))errors.push(`Duplicate commitment id: ${c.id}.`);
        else ids.add(c.id);
        if(typeof c.title!=='string'||!c.title.trim())errors.push(`Commitment ${c.id||index+1} is missing a title.`);
      });
    }
    if(value.focusId!=null&&typeof value.focusId!=='string')errors.push('focusId must be a string.');
    return {ok:errors.length===0,errors};
  }
  function normalizeState(value){
    const check=validateState(value);
    if(!check.ok)throw new Error(check.errors.join(' '));
    return {
      ...value,
      snapshotVersion:SNAPSHOT_VERSION,
      commitments:value.commitments.map(normalizeCommitment),
      focusId:stringOr(value.focusId),
      createdAt:validIsoOrNull(value.createdAt),
      localSave:stringOr(value.localSave,'saved'),
      externalSave:stringOr(value.externalSave,'not configured'),
    };
  }
  function parseSnapshot(raw){
    let value;
    try{value=JSON.parse(String(raw))}
    catch(error){return {ok:false,error:'Snapshot is not valid JSON.',details:error.message}}
    const check=validateState(value);
    if(!check.ok)return {ok:false,error:'Snapshot structure is invalid.',details:check.errors.join(' ')};
    try{return {ok:true,state:normalizeState(value)}}
    catch(error){return {ok:false,error:'Snapshot could not be normalized.',details:error.message}}
  }
  function serializeSnapshot(state){
    const normalized=normalizeState(state);
    return JSON.stringify(normalized,null,2);
  }
  return {SNAPSHOT_VERSION,validateState,normalizeState,parseSnapshot,serializeSnapshot};
});
