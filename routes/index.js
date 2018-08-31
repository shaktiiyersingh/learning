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
router.get('/viewimage', function(req, res) {
  res.sendfile('itinerarymap.png');
});

router.get('/drawsignature', function(req, res) {
// console.log(req.query.userId);
  var userId = req.query.userId;
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://monuser:monpass999@ds245150.mlab.com:45150/mondb';
  MongoClient.connect(url,function(err,client){
    if(err){console.log('connection not happening');}
    else{
    var db = client.db('mondb');
   var collection = db.collection('dots');
   collection.find({},{ userId: userId }).toArray(function(err,result){
     if(err){}
     else {
      return res.send(result);
      //res.render('studentlist',{"studentlist":result});
    }
   })
   
  }

  });
});

function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}

router.post('/checklogin', function(req, res) {

 
if(req.body.uname === "yo" && req.body.password === "yo"  ){res.redirect('/viewsignature');}
else{res.redirect('/');}
  
});

router.post('/addSignatureImage', function(req, res) {
var userId = req.body.userId;
  
  /*
  var decodedImg = decodeBase64Image(req.body.image);
 var imageBuffer = decodedImg.data;
 var type = decodedImg.type;
 var extension = mime.extension(type);
 var fileName =  "mytravelsignature." + extension;
 try{
       fs.writeFileSync("../sampsite/data/images/" + fileName, imageBuffer, 'utf8');
    }
 catch(err){
    console.error(err)
 }
 */
  //var Buffer = new Buffer(data, 'base64'); 
  
 var image = decodeBase64Image(req.body.image);
 
  fs.writeFile("./data/images/mytravelsignature.png", image.data, function(err) {
    console.log(err);
  });
  
  
  console.log(image);
  return res.send({"userId":userId,"image":image});
});

router.post('/addDot', function(req, res) {

  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://monuser:monpass999@ds245150.mlab.com:45150/mondb';
  MongoClient.connect(url,function(err,client){
    if(err){console.log('connection not happening');}
    else{
    var db = client.db('mondb');
    var dot = {lat:req.body.lat, lng:req.body.lng,name:req.body.name};
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
