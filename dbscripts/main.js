
//Used for registering primary key per collection
db.system.js.save( { 
	_id : "vdbRegisterPrimaryKey",
	value : function(branch, collection, key){ 
		return db["vdbPrimaryKeys"].insert({
			collectionIdentifier: collection+"_vdb_"+branch,
			primaryKey: key
		});
	}
});

//Used for Inserting a document into a versioned collection
db.system.js.save( { 
	_id : "vdbInsert",
	value : function(branch, collection, data){ 
		data["__vdbtimestamp"] = new Date();
		db[collection+"_vdb_"+branch].insert(data);
		return data;
	}
});

//Used for Querying one item from a collection
db.system.js.save( { 
	_id : "vdbFindOneFromHead",
	value : function(branch, collection, value){
		var primarykey = db.vdbPrimaryKeys.findOne({collectionIdentifier: collection+"_vdb_"+branch}).key;
		var query = {};
		query[primarykey] = value;
		//TODO MAKE THIS WORK => query['orderby'] = 
		return db[collection+"_vdb_"+branch].findOne(query);
	}
});