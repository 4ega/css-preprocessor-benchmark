var fs = require('fs');
var args = process.argv.slice(2)
var caseNum = args[0] || 'case1';
var classCount = 1000;
var filesCount = 3;
var extension = args[1] || 'less';
var dest = args[2] || 'less/';
var text = "";
var main = "";
var block = fs.readFileSync('./source/' + caseNum + '/index.' + extension).toString();

for(i = 0; i < classCount; i+=1) {
  text += block.replace(/#/g,i);
}

for(i = 1; i <= filesCount; i+=1) {
  fs.writeFileSync(dest + "style" + i + "." + extension, text, 'utf8');
}

for(i = 1; i <= filesCount; i+=1) {
  main += "@import 'style" + i + "." + extension + "';\r\n";
}

fs.writeFileSync(dest + "main." + extension, main, 'utf8');
