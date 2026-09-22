'use strict';

(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.LedgerImportV1=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  function text(v){return typeof v==='string'?v.trim():''}
  function arr(v){return Array.isArray(v)?v:[]}
  function isoOrNull(v){
    if(!v)return null;
    const t=new Date(v).getTime();
    return Number.isFinite(t)?new Date(t).toISOString():null;
  }
  function recentNotation(item){
    const notes=arr(item?.notations).map(n=>typeof n==='string'?{text:n,createdAt:item?.createdAt||''}:n||{}).filter(n=>text(n.text));
    notes.sort((a,b)=>String(b.updatedAt||b.createdAt||'').localeCompare(String(a.updatedAt||a.createdAt||'')));
    return text(notes[0]?.text);
  }
  function projectMap(source){return new Map(arr(source.projects).map(p=>[String(p.id||''),p]))}
  function sourceProjectTitle(item,projects){
    const p=projects.get(String(item.p||''));
    return text(p?.title)||'Unscoped';
  }
  function uniqueCommitmentId(sourceId,used){
    const base='ledger:'+String(sourceId||'item').replace(/\s+/g,'-');
    let id=base,n=2;
    while(used.has(id)){id=base+'-'+n;n++}
    used.add(id);return id;
  }
  function validateLedgerSnapshot(source){
    const errors=[];
    if(!source||typeof source!=='object'||Array.isArray(source))return {ok:false,errors:['Ledger snapshot root must be an object.']};
    if(!Array.isArray(source.items))errors.push('Ledger snapshot must contain an items array.');
    if(source.projects!=null&&!Array.isArray(source.projects))errors.push('projects must be an array when present.');
    if(source.journal!=null&&!Array.isArray(source.journal))errors.push('journal must be an array when present.');
    if(source.worklog!=null&&!Array.isArray(source.worklog))errors.push('worklog must be an array when present.');
    return {ok:errors.length===0,errors};
  }
  function convertItem(item,projects,used,report,convertedAt){
    const sourceId=String(item.id||'');
    const id=uniqueCommitmentId(sourceId,used);
    const title=text(item.title)||'Untitled imported Ledger item';
    const status=String(item.status||'OPEN').toUpperCase();
    const deps=text(item.dependencies);
    const project=projects.get(String(item.p||''));
    if(!project)report.warnings.push({sourceId,kind:'missing-project',message:'Source item references a missing/unknown project.'});

    let workState='OPEN',attentionState='NEXT',disposition='',manualOnly=false,returnPoint=null;
    if(status==='DONE'){
      workState='DONE';attentionState='QUIET';disposition='Completed in source Ledger.';
    }else if(status==='ACTIVE'){
      workState='ACTIVE';attentionState='NOW';
      const summary=recentNotation(item)||text(item.notes)||'Imported as ACTIVE from Ledger; no explicit return-point summary existed.';
      returnPoint={
        summary,
        nextAction:'Review imported task context and define the next concrete move.',
        unresolved:deps||'',
        updatedAt:isoOrNull(item.workedAt||item.updatedAt||item.createdAt)||convertedAt,
      };
      report.generatedReturnPoints++;
      report.warnings.push({sourceId,kind:'generated-return-point',message:'ACTIVE source item had no native Ledger return-point field; conservative continuation text was generated.'});
    }else if(status==='BLOCKED'||deps){
      workState=status==='BLOCKED'?'BLOCKED':'OPEN';
      attentionState='WAITING';
      manualOnly=true;
      disposition=deps
        ? 'Manual review required — imported Ledger dependency is free text and is not machine-observable.'
        : 'Manual review required — item was BLOCKED in source Ledger without a structured wake condition.';
      report.manualReviewRequired++;
      report.warnings.push({sourceId,kind:'manual-wake',message:'No review date or automatic dependency trigger was invented.'});
    }

    return {
      id,
      title,
      scope:sourceProjectTitle(item,projects),
      workState,
      attentionState,
      createdAt:isoOrNull(item.createdAt)||convertedAt,
      updatedAt:isoOrNull(item.workedAt||item.updatedAt||item.createdAt)||convertedAt,
      lastSeenAt:convertedAt,
      materialChangedAt:isoOrNull(item.workedAt||item.updatedAt||item.createdAt)||convertedAt,
      dueAt:null,
      reviewAt:null,
      parkedUntil:null,
      userPinned:status==='ACTIVE',
      waitingOn:[],
      nextAction:status==='ACTIVE'
        ? 'Review imported task context and define the next concrete move.'
        : '',
      returnPoint,
      disposition,
      manualOnly,
      source:{
        system:'Ledger',
        sourceId,
        projectId:String(item.p||''),
        kind:String(item.kind||'CHECKLIST'),
        status,
        phase:text(item.phase),
      },
      sourceContext:{
        notes:text(item.notes),
        notations:arr(item.notations),
        outcome:text(item.outcome),
        inputs:text(item.inputs),
        dependencies:deps,
        boundary:text(item.boundary),
        acceptance:text(item.acceptance),
        verification:text(item.verification),
        stopCondition:text(item.stopCondition),
        link:text(item.link),
        subtasks:arr(item.subtasks),
        completedAt:isoOrNull(item.completedAt),
      },
    };
  }
  function convertLedgerSnapshot(source,options={}){
    const check=validateLedgerSnapshot(source);
    if(!check.ok)throw new Error(check.errors.join(' '));
    const convertedAt=isoOrNull(options.convertedAt)||new Date().toISOString();
    const projects=projectMap(source);
    const used=new Set();
    const report={
      sourceItems:arr(source.items).length,
      convertedCommitments:0,
      excludedNotes:0,
      done:0,
      active:0,
      waitingManual:0,
      generatedReturnPoints:0,
      manualReviewRequired:0,
      warnings:[],
    };
    const commitments=[];
    for(const item of arr(source.items)){
      if(String(item?.kind||'').toUpperCase()==='NOTE'){
        report.excludedNotes++;
        continue;
      }
      const c=convertItem(item||{},projects,used,report,convertedAt);
      commitments.push(c);
      if(c.workState==='DONE')report.done++;
      if(c.workState==='ACTIVE')report.active++;
      if(c.attentionState==='WAITING')report.waitingManual++;
    }
    report.convertedCommitments=commitments.length;
    const active=[...commitments].filter(c=>c.workState==='ACTIVE').sort((a,b)=>String(b.updatedAt||'').localeCompare(String(a.updatedAt||'')));
    report.sourceActiveItems=active.length;
    if(active.length>1){
      active.slice(1).forEach(c=>{
        c.workState='OPEN';
        c.attentionState='INBOX';
        c.userPinned=false;
        c.disposition='Imported as ACTIVE from Ledger; requires explicit triage before entering Focus.';
      });
      report.warnings.push({kind:'multiple-active',message:`${active.length} source items were ACTIVE; the most recently touched one is selected as Focus and ${active.length-1} additional active item(s) are placed in Inbox for explicit triage.`});
    }

    const supportingRecords={
      projects:arr(source.projects).map(p=>({
        id:String(p.id||''),title:text(p.title),description:text(p.description),mode:String(p.mode||''),framing:p.framing&&typeof p.framing==='object'?p.framing:{},links:arr(p.links)
      })),
      notes:arr(source.items).filter(i=>String(i?.kind||'').toUpperCase()==='NOTE').map(n=>({
        id:String(n.id||''),projectId:String(n.p||''),body:text(n.title),createdAt:isoOrNull(n.createdAt),updatedAt:isoOrNull(n.workedAt||n.updatedAt)
      })),
      journal:arr(source.journal).map(j=>({
        id:String(j.id||''),projectId:String(j.p||''),body:text(j.body),createdAt:isoOrNull(j.createdAt),updatedAt:isoOrNull(j.updatedAt)
      })),
      worklog:arr(source.worklog).map(w=>({
        id:String(w.id||''),projectId:String(w.p||''),itemId:String(w.itemId||''),whenAt:isoOrNull(w.whenAt),summary:text(w.summary)
      })),
    };

    return {
      state:{
        snapshotVersion:1,
        commitments,
        focusId:active[0]?.id||'',
        createdAt:convertedAt,
        localSave:'import preview',
        externalSave:'not configured',
        importProvenance:{
          sourceSystem:'Ledger',
          convertedAt,
          sourceActiveProject:String(source.activeProject||''),
          report,
        },
        supportingRecords,
      },
      report,
    };
  }

  return {validateLedgerSnapshot,convertLedgerSnapshot};
});
