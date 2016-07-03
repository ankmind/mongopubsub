var db;
var tail= require('./tail');
var actions = require('./subscribeUnsubscribeActions');

waitForDb();

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

function afterDbInitialized(db){
  //play with the single db instance
  tail.initializeCollectionsToTailAndStartTailing(db);
  //actions.validateAndSubscribe("userid","aqnk2.cool",db);
  //actions.unsubscribe("userid","ank2.cool".db);

}

