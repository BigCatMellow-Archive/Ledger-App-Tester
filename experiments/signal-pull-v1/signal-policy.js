'use strict';

(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.SignalPolicy=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const NON_MATERIAL_REASONS=new Set([
    'user pinned',
    'active return point',
    'untriaged',
  ]);

  function materialSignalReasons(reasons){
    return (Array.isArray(reasons)?reasons:[]).map(String).filter(r=>!NON_MATERIAL_REASONS.has(r));
  }

  function isMaterialSignal(reasons){
    return materialSignalReasons(reasons).length>0;
  }

  return {NON_MATERIAL_REASONS,materialSignalReasons,isMaterialSignal};
});
