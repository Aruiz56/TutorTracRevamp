var fs = require('fs');
var init = function(cas, db) {
  var routeFlags;
  try {
    routeFlags = JSON.parse(fs.readFileSync(__dirname + '/routeFlagsConf.json'));
  } catch (e) {
    console.error(e);
    console.error("Security Init Failed. Terminating...");
    process.exit(-1);
  }
  return function(req, res, next) {
    if (req.session.cas_user === undefined)
      return next();
    var error = function(res, err) {
      return res.end(JSON.stringify({
        success: false,
        error: err,
      }));
    };
    var toEmail = function(name) {
      var concat = "@((?:[a-z][a-z\\.\\d\\-]+)\\.(?:[a-z][a-z\\-]+))(?![\\w\\.])";
      return new RegExp(name + concat);
    };
    var StudentModel = db.model('StudentModel');
    var TutorModel = db.model('TutorModel');
    var AdministratorModel = db.model('AdministratorModel');
    return StudentModel.findOne({
      Email: toEmail(req.session.cas_user)
    }, function(err, studentResult) {
      //console.log(studentResult);
      if (err) return error(res, err);
      if (studentResult !== undefined && studentResult !== null) {
        if (req.session.userPermissions === undefined) {
          req.session.userPermissions = "s";
        } else {
          req.session.userPermissions += "s";
        }
      }
      return TutorModel.findOne({
        Email: toEmail(req.session.cas_user)
      }, function(err, tutorResult) {
        //console.log(tutorResult);
        if (err) return error(res, err);
        if (tutorResult !== undefined && tutorResult !== null) {
          if (req.session.userPermissions === undefined) {
            req.session.userPermissions = "t";
          } else {
            req.session.userPermissions += "t";
          }
        }
        return AdministratorModel.findOne({
          Email: toEmail(req.session.cas_user)
        }, function(err, administratorResult) {
          //console.log(administratorResult);
          if (err) return error(res, err);
          if (administratorResult !== undefined && administratorResult !== null) {
            if (req.session.userPermissions === undefined) {
              req.session.userPermissions = "a";
            } else {
              req.session.userPermissions += "a";
            }
          }
          return next();
        });
      });
    });
  };
};
exports.init = init;

var authorized = function(req) {
  var isStudent = req.session.userPermissions.indexOf("s");
  var isTutor = req.session.userPermissions.indexOf("t");
  var isAdministrator = req.session.userPermissions.indexOf("a");
  if (routeFlags[req.baseUrl] !== undefined) {
    if (routeFlags[req.baseUrl].indexOf("s") && isStudent) {
      return true;
    }
    if (routeFlags[req.baseUrl].indexOf("t") && isTutor) {
      return true;
    }
    if (routeFlags[req.baseUrl].indexOf("a") && isAdministrator) {
      return true;
    }
  }
  return false;
};

exports.authorized = authorized;
