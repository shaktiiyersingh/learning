var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var passport = require('passport');
var find = require('find');
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

router.post('/deletesignature', function(req, res) {
  var userId = req.query.userId;
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://monuser:monpass999@ds245150.mlab.com:45150/mondb';
  MongoClient.connect(url,function(err,client){
    if(err){console.log('connection not happening');}
    else{
    var db = client.db('mondb');
    var myquery = { userId:userId };
    db.collection("dots").deleteMany(myquery, function(err, delOK) {
      if (err) 
      {
      console.log("no collection found to delete");
      return res.send("no collection found to delete")
      }
      if (delOK) 
      {
        console.log(delOK.result.n + "records deleted");
        return res.send("deleted");
      }
      
    });
    //db.listCollections().toArray(function(err, names) {});
      //console.log(names);

      /*
      if(names.includes("dots"))
      {
        db.collection("dots").drop(function(err, delOK) {
          if (err) console.log(err);
          if (delOK) 
          {
            console.log("Collection deleted");
            return res.send("deleted");
          }
          
        });
      }
      else
      {
   console.log("collection doesnt exist");
   return res.send("collection doesnt exist");
      }
  */
     
 
  

   
  }

  });
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
   var query = {userId: userId};
   collection.find(query).toArray(function(err, result){
     if(err){console.log(err);}
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
var image = decodeBase64Image(req.body.image);
var x = 0;
var imgname;
imgname = "./data/images/" + x.toString() +"mytravelsignature" + userId + ".png"
fs.readdir("./data/images/", function(err, items) {
  console.log(items.length);
  if (items.length === 1)
  {
   
    console.log(imgname);
    fs.writeFile(imgname , image.data, function(err) {
      console.log(err);
    });
    return res.send({"userId":userId,"image":image, "imgname":x.toString() +"mytravelsignature" + userId + ".png"});
  }
  for (var i=0; i<items.length; i++) {
   
      if (items[i].indexOf(userId)!= -1) 
      {
        x = parseInt(items[i].substring(0,items[i].indexOf("m")));
        imgname = "./data/images/" + x.toString() +"mytravelsignature" + userId + ".png";
        console.log(imgname);
        fs.unlink(imgname, function (err) {
          if (err) throw err;
          // if no error, file has been deleted successfully
          console.log('File deleted!');
      });  
        x = x + 1;
        
        imgname = "./data/images/" + x.toString() +"mytravelsignature" + userId + ".png";
        
        console.log(imgname);
        fs.writeFile(imgname , image.data, function(err) {
          console.log(err);
        });
        return res.send({"userId":userId,"image":image, "imgname":x.toString() +"mytravelsignature" + userId + ".png"});
        
      }
    
     
      
   
  }

});


/*
fs.stat("./data/images/mytravelsignature.png", function(err, stat) {
  if(err == null) {
      console.log('File exists');
  } else if(err.code == 'ENOENT') {
      // file does not exist
      console.log('file doesnt exist');
  } else {
      console.log('Some other error: ', err.code);
  }
});
*/
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
  

 //console.log(imgname); 
 
 
  
  
  
 // console.log(image);
  
});

router.post('/addDot', function(req, res) {

  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://monuser:monpass999@ds245150.mlab.com:45150/mondb';
  MongoClient.connect(url,function(err,client){
    if(err){console.log('connection not happening');}
    else{
    var db = client.db('mondb');
    var dot = {lat:req.body.lat, lng:req.body.lng,name:req.body.name,userId:req.body.userId};
    /*
    db.createCollection("dots",function(err,res){if(err)console.log("collection already exists");});
        var dots = db.collection('dots');
        dots.insert([dot],function(err,result){if(err)console.log(err); else {return res.send(dot);}});
      */  
    db.listCollections().toArray(function(err, names) {
      if(names.includes("dots"))
      {
        console.log("exists");
        var dots = db.collection('dots');
        dots.insert([dot],function(err,result){if(err)console.log(err); else {return res.send(dot);}});
      }
      else
      {
        console.log("adding to collection");
        db.createCollection("dots",function(err,res){if(err)console.log(err);});
        var dots = db.collection('dots');
        dots.insert([dot],function(err,result){if(err)console.log(err); else {return res.send(dot);}});
      }
  
     
  });
  
    

    }
  });
});
module.exports = router;
