'use strict';

const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const SignalStateIO=require('./state-io');
const SignalPolicy=require('./signal-policy');

const app=fs.readFileSync(path.join(__dirname,'app.js'),'utf8');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const cutoff=app.indexOf('function renderSummary');
assert.ok(cutoff>0,'renderSummary cutoff missing');
const prefix=app.slice(0,cutoff);
const localStorage={getItem(){return null},setItem(){}};
const document={getElementById(){return null}};
const api=new Function('localStorage','document','SignalStateIO','SignalPolicy',prefix+'; return {state,signals,inboxCommitments};')(localStorage,document,SignalStateIO,SignalPolicy);

const initial=api.signals();
assert.equal(initial.length,4,'seed fixture should have four material signals after separating Focus');
assert.equal(initial.some(x=>x.c.id==='active-return-point'),false,'unchanged current Focus must not be a material signal');
assert.equal(api.inboxCommitments().length,0);

api.state.commitments.push({
  id:'captured',
  title:'Captured obligation',
  scope:'Inbox',
  workState:'OPEN',
  attentionState:'INBOX',
  createdAt:'2026-09-22T13:30:00.000Z',
  updatedAt:'2026-09-22T13:30:00.000Z',
  lastSeenAt:'2026-09-22T13:30:00.000Z',
  materialChangedAt:'2026-09-22T13:30:00.000Z',
  nextAction:'',
  waitingOn:[],
  disposition:'',
  reviewAt:null,
  parkedUntil:null,
  dueAt:null,
  userPinned:false,
  returnPoint:null,
});
assert.equal(api.inboxCommitments().length,1);
assert.equal(api.signals().some(x=>x.c.id==='captured'),false,'capture alone must not create a material signal');

api.state.commitments.find(x=>x.id==='captured').dueAt='2026-09-23T13:30:00.000Z';
assert.equal(api.signals().some(x=>x.c.id==='captured'),true,'Inbox work may still signal when a material due condition exists');

assert.match(html,/id="currentFocusStrip"/);
assert.match(html,/data-inbox-view/);
assert.ok(html.indexOf('signal-policy.js')<html.indexOf('app.js'),'signal policy must load before app');

console.log('9/9 signal desk separation checks passed');
