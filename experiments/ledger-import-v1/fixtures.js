'use strict';

const LEDGER_FIXTURE={
  activeProject:'p1',
  projects:[
    {id:'p1',title:'School operations',description:'Daily administrative work',mode:'ROADMAP',createdAt:'2026-09-01T12:00:00Z',workedAt:'2026-09-22T13:00:00Z',links:[],framing:{currentReality:'Several simultaneous obligations.',done:'Nothing important is missed.'}},
    {id:'p2',title:'Home project',description:'Personal project',mode:'LIST',createdAt:'2026-09-02T12:00:00Z',workedAt:'2026-09-20T13:00:00Z',links:[],framing:{}}
  ],
  items:[
    {id:'active1',p:'p1',kind:'EXECUTION',status:'ACTIVE',phase:'TODAY',title:'Prepare field trip coverage',createdAt:'2026-09-20T12:00:00Z',workedAt:'2026-09-22T13:15:00Z',notes:'Teacher list is confirmed; coverage grid still needs validation.',notations:[{id:'n1',text:'Finished mapping morning classes.',createdAt:'2026-09-22T13:10:00Z'}],dependencies:'',outcome:'Coverage is complete.',acceptance:'No uncovered classes.',verification:'Compare against trip roster.',subtasks:[]},
    {id:'active2',p:'p2',kind:'CHECKLIST',status:'ACTIVE',title:'Fix shelf bracket',createdAt:'2026-09-18T12:00:00Z',workedAt:'2026-09-21T12:00:00Z',notes:'Bracket removed.',notations:[],dependencies:'',subtasks:[]},
    {id:'blocked1',p:'p1',kind:'EXECUTION',status:'BLOCKED',title:'Finalize vendor order',createdAt:'2026-09-18T12:00:00Z',workedAt:'2026-09-21T15:00:00Z',dependencies:'Waiting for vendor confirmation',notes:'Do not place until confirmed.',subtasks:[]},
    {id:'free-dep',p:'p1',kind:'CHECKLIST',status:'OPEN',title:'Publish parent notice',createdAt:'2026-09-19T12:00:00Z',workedAt:'2026-09-20T15:00:00Z',dependencies:'Needs principal approval',subtasks:[]},
    {id:'open1',p:'p1',kind:'CHECKLIST',status:'OPEN',title:'Print welcome packets',createdAt:'2026-09-19T12:00:00Z',workedAt:'2026-09-20T15:00:00Z',dependencies:'',subtasks:[]},
    {id:'done1',p:'p2',kind:'CHECKLIST',status:'DONE',title:'Buy screws',createdAt:'2026-09-10T12:00:00Z',workedAt:'2026-09-12T12:00:00Z',completedAt:'2026-09-12T12:00:00Z',subtasks:[]},
    {id:'note1',p:'p1',kind:'NOTE',status:'OPEN',title:'Front office closes at 4:30 on Friday.',createdAt:'2026-09-20T12:00:00Z',workedAt:'2026-09-20T12:00:00Z'},
    {id:'orphan',p:'missing-project',kind:'CHECKLIST',status:'OPEN',title:'Orphaned imported item',createdAt:'2026-09-20T12:00:00Z',workedAt:'2026-09-20T12:00:00Z'}
  ],
  journal:[
    {id:'j1',p:'p1',body:'Field trip timing changed to 10:00.',createdAt:'2026-09-22T12:00:00Z',updatedAt:'2026-09-22T12:00:00Z'}
  ],
  worklog:[
    {id:'w1',p:'p1',itemId:'active1',whenAt:'2026-09-22T13:15:00Z',summary:'Mapped morning coverage.'}
  ]
};

const DUPLICATE_ID_FIXTURE={
  projects:[{id:'p',title:'Duplicate test'}],
  items:[
    {id:'same',p:'p',kind:'CHECKLIST',status:'OPEN',title:'First'},
    {id:'same',p:'p',kind:'CHECKLIST',status:'OPEN',title:'Second'}
  ]
};

module.exports={LEDGER_FIXTURE,DUPLICATE_ID_FIXTURE};
