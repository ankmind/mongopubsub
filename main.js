var db;
var tail= require('./tail');
var actions = require('./subscribeUnsubscribeActions');

waitForDb();

//wait for db to be connected
function waitForDb(){
 if(db!=null){
   afterDbInitialized(db);
   return;
 }	
 else{
 	db=require('./localdatabase').db;
    setTimeout(function(){
	waitForDb();
  },1000);
 }
}


//here we can subscribe or unsubscribe
function afterDbInitialized(db){
  tail.initializeCollectionsToTailAndStartTailing(db);

  //to subscribe a user
  actions.validateAndSubscribe("userid","myCollection.myDocument.myField",db);
  actions.validateAndSubscribe("user1","collection1.document1.field1",db);
  actions.validateAndSubscribe("user2","collection1",db);

  //to unsubscribe a user
  actions.unsubscribe("user2","coll.document",db);
  actions.unsubscribe("user3","coll.document.field1",db)

}

