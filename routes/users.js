var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {

  var mongodb = require('mongodb');

  //We need to work with "MongoClient" interface in order to connect to a mongodb server.
  var MongoClient = mongodb.MongoClient;

  // Connection URL. This is where your mongodb server is running.
  var url = 'mongodb://localhost:27017/led';

  // Use connect method to connect to the Server
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      //HURRAY!! We are connected. :)
      console.log('Connection established to', url);

      // Get the documents collection
      var collection = db.collection('clients');

      // Fetch and show the data, the result is the data fetched from the database
      var cursor = collection.find({}).toArray(function (err, clients) {
        if (err) {
          console.log(err);
        } else if (clients.length) {

          console.log('Found:', clients);
          
          res.format({
            html: function(){
              res.render('clients/index', {
                title: 'Clients',
                "clients": clients
              });
            }, 
            json: function(){
              res.json(clients)    
            }
          });


        } else {
          console.log('No document(s) found with defined "find" criteria!');
        }
        //Close connection
        db.close();
      });
    }
  });

});

module.exports = router;
