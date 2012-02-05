var data1 = { data: 'one', key: 'mykey' };
var data2 = { data: 'two', key: 'mykey' };
var data3 = { data: 'three', key: 'anotherkey' };

//remove all objects in b1-c1
db["c1_vdb_b1"].remove({});
//remove all objects in b2-c1
db["c1_vdb_b2"].remove({});
//remove all objects in b1-c2
db["c2_vdb_b1"].remove({});

//verify everything is empty
assert.eq(db["c1_vdb_b1"].find().count(), 0, 'Test Collection and branch could not be emptied');
assert.eq(db["c1_vdb_b2"].find().count(), 0, 'Test Collection and branch could not be emptied');
assert.eq(db["c2_vdb_b1"].find().count(), 0, 'Test Collection and branch could not be emptied');

//register primary key 'key' for tests
db.eval("vdbRegisterPrimaryKey('b1','c1','key')");

//insert data1 into b1-c1 on k1
db.eval("vdbInsert('b1','c1',"+tojson(data1)+")");

//insert data2 into b1-c1 on k1
db.eval("vdbInsert('b1','c1',"+tojson(data2)+")");

//verify that b1-c1 has two documents at k1 queryable by date order ("__vdbtimestamp") and the data matches d1 & d2 respectively
var result = db["c1_vdb_b1"].find({key: 'mykey'}).sort({"__vdbtimestamp": -1}).limit(2);
assert.eq(result.count(), 2, "Multiple updates did not yield the correct count of objects in the history.");
delete result[0]['_id'];
delete result[0]['__vdbtimestamp'];
delete result[1]['_id'];
delete result[1]['__vdbtimestamp'];
assert.eq(result[0], data2);
assert.eq(result[1], data1);
result = null;

//verify that data2 is queryied out as head on key 'mykey' (since data2 was the most recent insert on that key)
result = db.eval("vdbHeadDocForKey('b1','c1','mykey')");
delete result['_id'];
delete result['__vdbtimestamp'];
assert.eq(result, data2, "Most recent data not queriable as head");

//verify that a fake key will return null
assert.eq(db.eval("vdbHeadDocForKey('b1','c1','afakekey')"), null, "non-existent key not returning head doc has null.");

//insert data3 into b1-c1 on k2
db.eval("vdbInsert('b1','c1',"+tojson(data3)+")");

//query head from b1-c1-k1 and verify that it matches data2
result = db.eval("vdbHeadDocForKey('b1','c1','mykey')");
delete result['_id'];
delete result['__vdbtimestamp'];
assert.eq(result, data2, "Most recent data not queriable after unrelated insert");

//query head from b1-c1-k2 and verify that it matches data1
result = db.eval("vdbHeadDocForKey('b1','c1','anotherkey')");
delete result['_id'];
delete result['__vdbtimestamp'];
assert.eq(result, data3, "Most recent data not queriable after unrelated insert");
