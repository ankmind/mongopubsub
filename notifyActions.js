var dataidmap="hashmap_dataid_key";


function notifyUsers(oplog,db){
  var dataids=getDataIds(oplog);
  var notifyInfo =getNotificationInfo(oplog);
  makeRecursiveCalls(0,dataids,notifyInfo,db);
}


function makeRecursiveCalls(index,dataids,notifyInfo,db){
  if(index==dataids.length){
    return;
  }
  else{
    db.collection(dataidmap).find({"_id":dataids[index]}).toArray(function(err,res){
      if(err || !res || !res[0] || !res[0].array){
        console.log("nothing to notify that "+notifyInfo[index]+" for "+ dataids[index]);
      }
      else{
        for(i=0;i<res[0].array.length;i++){
          notifyUserGivenUserId(res[0].array[i],notifyInfo[index]);
        }
      }
      makeRecursiveCalls(index+1,dataids,notifyInfo,db);
    });
  }
}


function getNotificationInfo(oplog){
  var info=[];
  if(oplog.op!="u"){
   var message=null;
   if(oplog.op=="d") 
    message="following document is removed";
   else 
    message="following document is added";
   var notifyString=message+JSON.stringify(oplog.o); 
   //for collections subscribers         
   info.push(notifyString);
   //for subscribers of that particular document
   info.push(notifyString);
   }
 else{

    info.push("doc with id= "+oplog.o2._id +" has updated with "+JSON.stringify
      (oplog.o.$set));
    var keys=Object.keys(oplog.o.$set);
    for(i=0;i<keys.length;i++){
      info.push("new value for " + keys[i]+" : "+oplog.o.$set[keys[i]]);
      //note: old value can be stored at client side.
    }
  }
  return info;
}



function getDataIds(oplog){
  var arr=[];
  var collection=oplog.ns;

  if(oplog.op=="i" || oplog.op=="d"){
    var doc=collection+"."+oplog.o._id;
    arr.push(doc);
  }

  else{ 
    var doc=collection+"."+oplog.o2._id;
    arr.push(doc);

    var keys=Object.keys(oplog.o.$set);
    for(i=0;i<keys.length;i++){
      var field= doc+"."+keys[i];
      arr.push(field);
    }
  }

  return arr;
}




function notifyUserGivenUserId(userid,notifyInfo){
     /*
     use your own implementation depending upon client.
     */
}



exports.notifyUsers=notifyUsers;