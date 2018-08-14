var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var passport = require('passport');
var fs = require('fs');
/* GET home page. */
router.get('/', function(req, res, next) {
  
 res.sendfile('login.html');
        
 //res.render('checklogin');
 
 //res.sendfile('signature.html');
});
router.get('/thelist',function(req,res){
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://monuser:monpass999@ds245150.mlab.com:45150/mondb';
  MongoClient.connect(url,function(err,client){
    if(err){console.log('connection not happening');}
    else{
    var db = client.db('mondb');
   var collection = db.collection('students');
   collection.find({}).toArray(function(err,result){
     if(err){}
     else {
      return res.send(result);
      //res.render('studentlist',{"studentlist":result});
    }
   })
   
  }

  });

});



router.get('/newstudent', function(req, res) {
  res.render('newstudent', { title: 'Add a Student' });
});

router.get('/viewsignature', function(req, res) {
  res.sendfile('signature.html');
});

router.get('/drawsignature', function(req, res) {
 console.log(req.query.userid);
  var userid = req.query.userid;
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://monuser:monpass999@ds245150.mlab.com:45150/mondb';
  MongoClient.connect(url,function(err,client){
    if(err){console.log('connection not happening');}
    else{
    var db = client.db('mondb');
   var collection = db.collection('dots');
   collection.find({},{ userID: userid }).toArray(function(err,result){
     if(err){}
     else {
      return res.send(result);
      //res.render('studentlist',{"studentlist":result});
    }
   })
   
  }

  });
});

router.post('/checklogin', function(req, res) {

 
if(req.body.uname === "yo" && req.body.password === "yo"  ){res.redirect('/viewsignature');}
else{res.redirect('/');}
  
});

router.post('/addDot', function(req, res) {

  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://monuser:monpass999@ds245150.mlab.com:45150/mondb';
  MongoClient.connect(url,function(err,client){
    if(err){console.log('connection not happening');}
    else{
    var db = client.db('mondb');
    var dot = {lat:req.body.lat, lng:req.body.lng};
    db.listCollections().toArray(function(err, names) {
      if(names.includes("dots"))
      {
        var dots = db.collection('dots');
        dots.insert([dot],function(err,result){if(err)console.log(err); else {return res.send(dot);}});
      }
      else
      {
        db.createCollection("dots",function(err,res){if(err)console.log(err);});
        var dots = db.collection('dots');
        dots.insert([dot],function(err,result){if(err)console.log(err); else {return res.send(dot);}});
      }
  
     
  });
    

    }
  });
});
module.exports = router;
