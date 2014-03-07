var child_process = require('child_process');
var async = require('async');
var caseNum = process.argv[2] || 'case1';

async.series([
  function (cb) {
    executeCommandsSilent([
      'node generator.js ' + caseNum + ' less less/',
      'node generator.js ' + caseNum + ' scss sass/',
      'node generator.js ' + caseNum + ' styl stylus/'
    ], cb)
  },
  function(cb) {
    executeCommand('less', 'time lessc ./less/main.less ./less/main.css', cb);
  },
  function(cb) {
    executeCommand('sass cold', 'time sass ./sass/main.scss ./sass/main.css', cb);
  },
  function(cb) {
    executeCommand('sass --no-cache', 'time sass --no-cache ./sass/main.scss ./sass/main.css', cb);
  },
  function(cb) {
    executeCommand('sass warm', 'time sass ./sass/main.scss ./sass/main.css', cb);
  },
  function(cb) {
    executeCommand('stylus', 'time stylus ./stylus/main.styl', cb);
  },
  function(cb) {
    executeCommand('sassc', 'time sassc -o ./sass/main.css ./sass/main.scss', cb);
  },
  function (cb) {
    executeCommandsSilent(['rm -r .sass-cache', 'rm sass/*', 'rm less/*', 'rm stylus/*'], cb)
  }
], function() {
  console.log('all done');
});

function executeCommand(name, command, cb) {
  var child = child_process.exec( command, function (error, stdout, stderr) {
      console.log(name + ': ' + parseOut(stderr));
      if (error !== null) {
        console.log('exec error: ' + error);
      }
      cb();
  });
}

function executeCommandsSilent(arr, cb) {
  async.each(arr, iterator, cb);

  function iterator(command, cb) {
    var child = child_process.exec(command, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error);
        }
        cb();
    });
  }
}

function parseOut(stderr) {
  stderr = stderr.replace(/(\r|\n)/g,"")
    .split('s')[0]
    .slice(stderr.indexOf('m') - 1)
    .split('m')
  stderr = (stderr[0] * 1000) + (stderr[1] * 1000)
  return stderr;
}
