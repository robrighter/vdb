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
		var mongocollection = collection+"_vdb_"+branch;
		var toinsert = { __vdbtimestamp : new Timestamp(), _id: new ObjectId() };
		for(key in data){
			toinsert[key] = data[key];
		}  
		var result = db[mongocollection].insert(toinsert);
		return toinsert._id;
	}
});

//Used for Querying one item from a collection
s.save( { 
	_id : "vdbHeadDocForKey",
	value : function(branch, collection, key){
		var primarykey = db.eval("vdbLookupPrimaryKey('"+branch+"','"+collection+"')");
		if(primarykey == null){
			return null;
		}
		var query = {};
		query[primarykey] = key;
		return db[collection+"_vdb_"+branch].find(query).sort({"__vdbtimestamp": -1}).limit(1)[0];
	}
});
