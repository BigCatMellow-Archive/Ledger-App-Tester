(async()=>{
  const files=['v3-core.js','v3-render.js','v3-actions.js','v3-wire.js'];
  for(const file of files){
    await new Promise((resolve,reject)=>{
      const script=document.createElement('script');
      script.src=`stationery/${file}?v=1`;
      script.onload=resolve;
      script.onerror=()=>reject(new Error(`Failed to load ${file}`));
      document.head.appendChild(script);
    });
  }
})().catch(error=>console.error('Ledger V3 failed to load',error));
