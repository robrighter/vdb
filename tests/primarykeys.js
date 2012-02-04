
//insert primary key k1 for branch b1 in collection c1
db.eval("vdbRegisterPrimaryKey('b1','c1','k1')");

//verify that the key is retrieveable correctly
assert.eq( 'k1',
	db.eval("vdbLookupPrimaryKey('b1','c1')"),
	'Primary key test 1 failed. Simple insert and retrieve');


//insert primary key k2 for b2 in collection c1
db.eval("vdbRegisterPrimaryKey('b2','c1','k2')");

//verify that the key is retrievable
assert.eq( 'k2',
	db.eval("vdbLookupPrimaryKey('b2','c1')"),
	'Primary key test 2 failed. Separate branch insert and retrieve');


//insert primary key1 for b2 in collection c1
db.eval("vdbRegisterPrimaryKey('b2','c1','k1')");
//verify that the key did indeed change for b2-c1
assert.eq( 'k1',
	db.eval("vdbLookupPrimaryKey('b2','c1')"),
	'Primary key test 3 failed. Overwrite key failed');


//insert primary key1 for b1 in collection c2
db.eval("vdbRegisterPrimaryKey('b1','c2','k1')");

//verify that the key did indeed change for b1-c2
assert.eq( 'k1',
	db.eval("vdbLookupPrimaryKey('b1','c2')"),
	'Primary key test 4 failed. Second collection insert failed.');
	

//verify that k1 is still the assigned key for b1-c1 (proving that the other shuffling did not effect it)
assert.eq( 'k1',
	db.eval("vdbLookupPrimaryKey('b1','c1')"),
	'Primary key test 5 failed. Other inserts polluted original.');

//insert k2 for b1 in c1
db.eval("vdbRegisterPrimaryKey('b1','c1','k2')");

//verify that the upsert was successful (meaning that the previous k1 version no longer exists in c1)
assert.eq( 1,
	db["vdbPrimaryKeys"].find( { collectionIdentifier: "c1"+"_vdb_"+"b1" } ).count(),
	'Primary key test 6 failed. Upsert resulted in a new document instead of overwriting the previous');


//Clear out all keys
db.eval("vdbClearAllPrimaryKeys()");

//verify that no keys exists
assert.eq( 0,
	db["vdbPrimaryKeys"].find().count(),
	'Primary key test 7 failed. vdbClearAllPrimaryKeys failed to clear out all keys');
	
//verify that key returns null for b1 c1
assert.eq( null,
	db.eval("vdbLookupPrimaryKey('b1','c1')"),
	'Primary key test 8 failed. Empty key should return null.');

