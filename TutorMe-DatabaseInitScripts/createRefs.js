var mongoose = require("/app/TutorMe/TutorMe-Backend/node_modules/mongoose");
var db = require('/app/TutorMe/TutorMe-Backend/db/connect.js').applicationConnection;
var fs = require('fs');

var CourseModel = db.model('CourseModel');
var StudentModel = db.model("StudentModel");

var err_check = function(err){
  if(err) { console.log(err); process.exit(-1); }
};

StudentModel.find({}, function(err, result){
  err_check(err);
  result.forEach(function(Student){
    console.log("On Student "  + Student.ID);
    CourseModel.find({ Students : {
       $elemMatch : {
         StudentRef : {
           $exists : false
         },
         StudentID : {
           $eq : Student.ID
         }
       }
     }
   }, function(err, Courses){
     err_check(err);
     console.log('found ' + Courses.length + ' courses.');
     var CourseIds = [];
     for (var x = 0; x < Courses.length; x++) {
       CourseIds.push(Courses[x]._id);
     }
     StudentModel.update({ID : Student.ID}, {'Courses' : CourseIds}, function(err){
       err_check(err);
       console.log('updated ' + Student.ID + ' successfully');
     });
   });
  });
});
