'use strict';
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.SignalPullReliability=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const BACKUP_KIND='signal-pull-v1-backup';
  const SCHEMA_VERSION=1;
  function validateState(value){
    const errors=[];
    if(!value||typeof value!=='object'||Array.isArray(value))return {ok:false,errors:['state must be an object']};
    if(!Array.isArray(value.commitments))errors.push('commitments must be an array');
    if(value.focusId!=null&&typeof value.focusId!=='string')errors.push('focusId must be a string');
    if(value.schemaVersion!=null&&value.schemaVersion!==SCHEMA_VERSION)errors.push(`unsupported schemaVersion ${value.schemaVersion}`);
    if(Array.isArray(value.commitments)){
      const ids=new Set();
      value.commitments.forEach((c,index)=>{
        if(!c||typeof c!=='object'||Array.isArray(c)){errors.push(`commitments[${index}] must be an object`);return;}
        if(typeof c.id!=='string'||!c.id.trim())errors.push(`commitments[${index}].id is required`);
        else if(ids.has(c.id))errors.push(`duplicate commitment id ${c.id}`); else ids.add(c.id);
        if(typeof c.title!=='string')errors.push(`commitments[${index}].title must be a string`);
        if(c.workState!=null&&typeof c.workState!=='string')errors.push(`commitments[${index}].workState must be a string`);
        if(c.attentionState!=null&&typeof c.attentionState!=='string')errors.push(`commitments[${index}].attentionState must be a string`);
        if(c.waitingOn!=null&&!Array.isArray(c.waitingOn))errors.push(`commitments[${index}].waitingOn must be an array`);
      });
    }
    return {ok:errors.length===0,errors};
  }
  function parseStateText(text){
    let value;
    try{value=JSON.parse(String(text));}catch(error){return {ok:false,error:'invalid JSON',detail:error.message};}
    const checked=validateState(value);
    return checked.ok?{ok:true,state:value}:{ok:false,error:'invalid state shape',detail:checked.errors.join('; ')};
  }
  function makeBackupEnvelope(state,exportedAt){
    const checked=validateState(state);
    if(!checked.ok)throw new Error(`Cannot back up invalid state: ${checked.errors.join('; ')}`);
    return {kind:BACKUP_KIND,schemaVersion:SCHEMA_VERSION,exportedAt:exportedAt||new Date().toISOString(),payload:state};
  }
  function parseBackupText(text){
    let value;
    try{value=JSON.parse(String(text));}catch(error){return {ok:false,error:'invalid JSON',detail:error.message};}
    const candidate=value&&value.kind===BACKUP_KIND?value.payload:value;
    const checked=validateState(candidate);
    return checked.ok?{ok:true,state:candidate,envelope:value&&value.kind===BACKUP_KIND}:{ok:false,error:'invalid backup state',detail:checked.errors.join('; ')};
  }
  return {BACKUP_KIND,SCHEMA_VERSION,validateState,parseStateText,makeBackupEnvelope,parseBackupText};
});
