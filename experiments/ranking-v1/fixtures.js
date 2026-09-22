'use strict';

const T='2026-09-22T14:30:00.000Z';

module.exports=[
  {
    id:'stale-manual-priority',
    intent:'A previously preferred routine item must not outrank a newly overdue obligation.',
    items:[
      {id:'overdue',title:'Overdue required response',reasons:['due now or overdue'],updatedAt:T},
      {id:'preferred',title:'Preferred routine work',reasons:['eligible'],userOrder:1,updatedAt:T},
      {id:'other',title:'Other routine work',reasons:['eligible'],userOrder:2,updatedAt:T},
    ],
    expectedOrder:['overdue','preferred','other'],
    guards:[['overdue','preferred'],['overdue','other']],
  },
  {
    id:'equal-risk-personal-preference',
    intent:'When two ordinary eligible items are otherwise equivalent, the operator wants School before Home.',
    items:[
      {id:'home',title:'Home admin',reasons:['eligible'],updatedAt:'2026-09-22T14:29:00Z',userOrder:2},
      {id:'school',title:'School admin',reasons:['eligible'],updatedAt:'2026-09-22T14:28:00Z',userOrder:1},
      {id:'later',title:'Another ordinary item',reasons:['eligible'],updatedAt:'2026-09-22T14:27:00Z',userOrder:3},
    ],
    expectedOrder:['school','home','later'],
    guards:[],
  },
  {
    id:'continue-focus-before-low-consequence-change',
    intent:'The operator wants to finish a valid active return point before inspecting a low-consequence material change.',
    items:[
      {id:'change',title:'Low-consequence changed context',reasons:['material change since last seen'],updatedAt:T,userOrder:2},
      {id:'focus',title:'Current deep work',reasons:['active return point','user pinned'],updatedAt:'2026-09-22T14:20:00Z',userOrder:1},
    ],
    expectedOrder:['focus','change'],
    guards:[],
  },
  {
    id:'integrity-defect-beats-preference',
    intent:'A system integrity defect must remain above personally preferred routine work.',
    items:[
      {id:'creative',title:'Preferred creative work',reasons:['eligible'],userOrder:1,updatedAt:T},
      {id:'integrity',title:'Quiet work has no wake path',reasons:['integrity defect'],userOrder:9,updatedAt:T},
    ],
    expectedOrder:['integrity','creative'],
    guards:[['integrity','creative']],
  },
  {
    id:'due-soon-versus-review',
    intent:'The operator wants the due-soon item first, then an expired waiting review.',
    items:[
      {id:'review',title:'Waiting review expired',reasons:['waiting review due'],updatedAt:T,userOrder:2},
      {id:'due',title:'Packet due soon',reasons:['due within 3 days'],updatedAt:T,userOrder:1},
      {id:'routine',title:'Routine item',reasons:['eligible'],updatedAt:T,userOrder:3},
    ],
    expectedOrder:['due','review','routine'],
    guards:[],
  },
  {
    id:'user-choice-among-material-signals',
    intent:'Both signals matter, but the operator explicitly wants to handle the newly unblocked item before the material-change review.',
    items:[
      {id:'changed',title:'Policy changed',reasons:['material change since last seen'],updatedAt:T,userOrder:2},
      {id:'unblocked',title:'Dependency released',reasons:['dependency completed'],updatedAt:'2026-09-22T14:20:00Z',userOrder:1},
    ],
    expectedOrder:['unblocked','changed'],
    guards:[],
  },
  {
    id:'eligibility-precedes-ranking',
    intent:'An ineligible item must not be ranked merely because it is preferred.',
    items:[
      {id:'blocked-favorite',title:'Preferred but unavailable',reasons:['eligible'],userOrder:1,eligible:false,updatedAt:T},
      {id:'available',title:'Available work',reasons:['eligible'],userOrder:2,updatedAt:T},
    ],
    expectedOrder:['available'],
    guards:[],
  },
  {
    id:'partial-preference',
    intent:'One explicit preference should be enough to move a chosen routine item ahead without requiring full manual ordering.',
    items:[
      {id:'routine-a',title:'Routine A',reasons:['eligible'],updatedAt:'2026-09-22T14:29:00Z'},
      {id:'chosen',title:'Chosen next item',reasons:['eligible'],updatedAt:'2026-09-22T14:25:00Z',userOrder:1},
      {id:'routine-b',title:'Routine B',reasons:['eligible'],updatedAt:'2026-09-22T14:27:00Z'},
    ],
    expectedOrder:['chosen','routine-a','routine-b'],
    guards:[],
  },
];
