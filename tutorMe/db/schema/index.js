var fs = require('fs');
module.exports = [];
var files = fs.readDirSync('/');
for(var x = 0; x < files.length; x++){
  if(files[x].substr(files[x].length-3, files[x].length) == '.js'){
    exports.push(require('./' + files[x]));
  }
}
