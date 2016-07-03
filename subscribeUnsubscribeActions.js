
var tail=require('./tail');
var useridmap="hashmap_userid_key";
var dataidmap="hashmap_dataid_key";


function validateAndSubscribe(userid,dataid,db){
	var res1=dataid.split(".");
	var collectionid=res1[0];
	var documentid =res1[1]; 
	var fieldid    =res1[2];

  db.collection(useridmap).find({"_id":userid},function(err,res2){
    res2.toArray(function(err,res3){
    if(!err && res3!=null && res3[0])
    {
     for(i=0;i<res3[0].array.length;i++){
      if(res3[0].array[i]==collectionid || res3[0].array[i]==(collectionid+"."+
       documentid) || res3[0].array[i]==dataid){
       console.log("already subscribed");
     return;
   }
  }
 } 
 tail.pushCollectionForTailing(collectionid);
 subscribe(userid,dataid,db);
 });
  });

}	


function subscribe(userid,dataid,db){
    //add in dataid key hashmap
    db.collection(dataidmap).update(
      {"_id":dataid},{$push:{array:userid}},{upsert:true},function(err,res){
        if(err)
         console.log("error= " + err)
       else{
 	 //add in userid key hashmap	
   db.collection(useridmap).update({
    "_id":userid
  },{$push:{array:dataid}},{upsert:true},function(err,res){
   if(err)
     console.log("error= " + err)
   else
     console.log(JSON.stringify(res)+"subscribe success");
 });	
 }
});
  }


  function unsubscribe(userid,dataid,db){
  //remove from dataid key hashmap	
  db.collection(dataidmap).update({"_id":dataid},
  	{$pull:{array:userid}},function(err,res){
     if(err)
       console.log("error= " + err)
     else{
     //remove from userid key hashmap
     db.collection(useridmap).update({"_id":userid},
       {$pull:{array:dataid}},function(err,res){
         if(err)
           console.log("error= " + err)
         else
           console.log(JSON.stringify(res)+"success");
       });
   }
 }); 
}

//unsubscribe the deleted documents
function memoryCleanUp(){
 /*to be implemented*/
}


exports.validateAndSubscribe=validateAndSubscribe;
exports.unsubscribe=unsubscribe;
