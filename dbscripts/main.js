var s = db.system.js;
s.remove({});


///////////////////////////////////////////////////
//                  PRIMARY KEYS                 //
///////////////////////////////////////////////////
//Used for registering primary key per collection
s.save( { 
	_id : "vdbRegisterPrimaryKey",
	value : function(branch, collection, key){ 
		return db["vdbPrimaryKeys"].update( { collectionIdentifier: collection+"_vdb_"+branch },
			{
				collectionIdentifier: collection+"_vdb_"+branch,
				primaryKey: key
			}, true ); //true for upsert
	}
});

//Used for looking up the primary key per collection
s.save( { 
	_id : "vdbLookupPrimaryKey",
	value : function(branch, collection){ 
		var result = db["vdbPrimaryKeys"].findOne({collectionIdentifier: collection+"_vdb_"+branch});
		return result ? result.primaryKey : null;
	}
});


//Used for clearing all primary keys
s.save( { 
	_id : "vdbClearAllPrimaryKeys",
	value : function(){
		return db.vdbPrimaryKeys.remove({});
	}
});


///////////////////////////////////////////////////
//                     INSERTS                   //
///////////////////////////////////////////////////
//Used for Inserting a document into a versioned collection
s.save( { 
	_id : "vdbInsert",
	value : function(branch, collection, data){ 
		data["__vdbtimestamp"] = new Date();
		db[collection+"_vdb_"+branch].insert(data);
		return data;
	}
});

//Used for Querying one item from a collection
s.save( { 
	_id : "vdbFindOneFromHead",
	value : function(branch, collection, value){
		var primarykey = db.vdbPrimaryKeys.findOne({collectionIdentifier: collection+"_vdb_"+branch}).key;
		var query = {};
		query[primarykey] = value;
		//TODO MAKE THIS WORK => query['orderby'] = 
		return db[collection+"_vdb_"+branch].findOne(query);
	}
});
