// Documents:
// http://javascript.ruanyifeng.com/bom/indexeddb.html
// https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
// https://github.com/dfahlander/Dexie.js

angular.module('indexed', [])
.factory('indexed', function($q){

  var db = new Dexie("Dbmy");
  db.version(1).stores({etc: 'id, version'});
  db.version(1).stores({title: 'id, title'});
  db.version(1).stores({section: 'id, section'});
  db.version(1).stores({set: 'id, set'});
  db.version(1).stores({setEnc: 'id, set'});
  db.open();

  // var request = indexedDB.open("Dbmy");
  // var db;

  return {
    get: function(k, store){
      var deferred = $q.defer();
      db[store].get(k, function(res){
        deferred.resolve(res);
      });

      // request.onsuccess = function(e) {
      //   console.log("Success!");
      //   db = e.target.result;
      //   if(!db.objectStoreNames.contains(store)) {
      //     db.createObjectStore(store);
      //   }
      //
      //   db.transaction([store], "readonly")
      //     .objectStore(store)
      //     .get(k)
      //     .onsuccess = function(e){
      //       deferred.resolve(e.target.result);
      //     };
      // };
      return deferred.promise;
    },
    put: function(v, store){
      db[store].put(v);
    }
  };
});
