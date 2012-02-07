var data1 = { data: 'one', key: 'mykey' };
var data2 = { data: 'two', key: 'mykey' };
var data3 = { data: 'three', key: 'anotherkey' };

//remove all objects in b1-c1
db["c1_vdb_b1"].remove({});

//register primary key 'key' for tests
db.eval("vdbRegisterPrimaryKey('b1','c1','key')");

//insert data1 into b1-c1
db.eval("vdbInsert('b1','c1',"+tojson(data1)+")");
//insert data3 into b1-c1
db.eval("vdbInsert('b1','c1',"+tojson(data3)+")");

//verify that data1 and data3 exist
var result = db.eval("vdbHeadDocForKey('b1','c1','mykey')");
delete result['_id'];
delete result['__vdbtimestamp'];
assert.eq(result, data1, "Most recent data not queriable as head");
result = db.eval("vdbHeadDocForKey('b1','c1','anotherkey')");
delete result['_id'];
delete result['__vdbtimestamp'];
assert.eq(result, data3, "Most recent data not queriable as head");

//delete 'mykey' (data1)
db.eval("vdbDelete('b1','c1','mykey')");

//verify that 'mykey' (data1) head now queries as null
result = db.eval("vdbHeadDocForKey('b1','c1','mykey')");
assert.eq(result, null, "Deleted value did not return as null@@@@@@@@@");

//verify that 'anotherkey' (data3) still is querieable
result = db.eval("vdbHeadDocForKey('b1','c1','anotherkey')");
delete result['_id'];
delete result['__vdbtimestamp'];
assert.eq(result, data3, "Data not queriable after unrelated delete");

//delete 'anotherkey' (data3)
db.eval("vdbDelete('b1','c1','anotherkey')");

//verify that 'anotherkey' (data3) head now queries as null
result = db.eval("vdbHeadDocForKey('b1','c1','anotherkey')");
assert.eq(result, null, "Deleted value did not return as null");