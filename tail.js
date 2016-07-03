const mongodb = require('mongodb');
const tail = require('mongodb-tail');
const notify = require('./notifyActions');
const database ='mydb.';

var localdb=null;
var myarr=[];

/*this collection contains an array of all 
the collections to tail for mydb database*/
var tailCollectionName="totailarray";
var tailCollectionDocId=1;


function initializeCollectionsToTailAndStartTailing(db){
  localdb=db;
  localdb.collection(tailCollectionName).find({"_id":tailCollectionDocId}).toArray(
    function(err,res){
     if(err){
      console.log("err initializing collection");
    }
    else{
      if(res[0]!=null && res[0].array!=null)
        for(i=0;i<res[0].array.length;i++){
          myarr[i]=database+res[0].array[i];
        }
        startTailingOplog(localdb,myarr);
      }
    });
}


function pushCollectionForTailing(collectionName){
  if(myarr.indexOf(database+collectionName)!=-1 || collectionName==null)
    return;

  updateDataBase(collectionName); 
  myarr.push(database+collectionName);
  if(localdb!=null){
    startTailingOplog(localdb);
    console.log("collection added for tailing successfull");
  }
  else{
    console.log("db ref is null while restarting tail");
  }
}

function updateDataBase(collectionName){
  if(localdb==null){
    console.log("db ref null cant update database");
    return;
  }
  else{
   localdb.collection(tailCollectionName).update({
    "_id":tailCollectionDocId
  },{$push:{array:collectionName}},{upsert:true},function(err,res){
   if(err)
    console.log("error= " + err)
  else
    console.log("success updating tail collection")
    });
 }
}

function startTailingOplog(db,arr){
  localdb=db;
  tail(
    db.collection('oplog.$main'),
    (latest) => ({ 
      ts: { $gt: latest.ts }, 
      fromMigrate: { $exists: false }, 
      ns: {
        $in: arr
      } ,
      op: { 
        $in: ['i', 'd','u'] 
      }}))
  .on('error', (err) => console.error(err))
  .on('next', (item) => {console.log(JSON.stringify(item)+"coool");
   notify.notifyUsers(item,db);});
  console.log("tailing started");
}


exports.pushCollectionForTailing=pushCollectionForTailing;
exports.initializeCollectionsToTailAndStartTailing=
initializeCollectionsToTailAndStartTailing;