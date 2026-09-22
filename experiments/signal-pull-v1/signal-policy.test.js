'use strict';

const assert=require('node:assert/strict');
const P=require('./signal-policy');

assert.deepEqual(P.materialSignalReasons(['user pinned']),[]);
assert.deepEqual(P.materialSignalReasons(['active return point']),[]);
assert.deepEqual(P.materialSignalReasons(['untriaged']),[]);
assert.deepEqual(P.materialSignalReasons(['due within 3 days','user pinned']),['due within 3 days']);
assert.deepEqual(P.materialSignalReasons(['return point stale','active return point']),['return point stale']);
assert.equal(P.isMaterialSignal(['dependency completed']),true);
assert.equal(P.isMaterialSignal(['untriaged']),false);

console.log('7/7 signal policy tests passed');
