# mongopubsub
Program Flow:

1.Run mongodb by using command-
  mongod --master --dbpath "local"
  
2.A collection called "oplog.$main" is generated
  in the "local" database. 
  
3.Using this collection we can tail any database
  except "local" and any collections in that 
  database.
  
4.Pass the information of the database and collection
  you want to tail, now as any changes are made
  in those collections you will get an oplog.



  
How user subscribes or unsubscribe?

1. Create a separate collection named as hashmap,
   this hashmap will contain "Data ID" as key
   and list of "User IDs" as values.

2. DataId consist of at most three components:
   collectionName.documentId.fieldName

3. If a user wants a new subscription it only needs
   to provide the corresponding "Data Id":

   for ex-
      Collection Level = coll1
      Document   Level = coll1.doc
      Filed 	   Level = coll1.doc.field
	
4. Similarly for unsubscribe.We will removed the 
   user id from the list corresponding to that
   particular data id.



   
Extra Features:

1. A user should not get notification twice for
   the same thing, so it is subscribed to a whole
   collection, then do not subscribe him to 
   documents separately.
   
2. Notification for every subscriber should be 
   different, a field level subscriber should
   get the notification only about that particular
   field and not other fields.
   
3. Memory Clean Up: 
   When a document is deleted or removed, then
   its subscriber should be removed from the hashmap,
   a background thread can help in it, but its 
   implementation depends on the use case.
   
4. Show My Subscriptions:
   An additional hashmap containing userid as key
   and list of subscribed dataids can come handy
   for various other functionalities.

5.When a user passes a new collectionName,which
  was not previously tailed, tailing automatically
  restarts and the information remains persistent.
   

