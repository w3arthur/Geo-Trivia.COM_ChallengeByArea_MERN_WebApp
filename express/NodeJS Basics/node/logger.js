//(function (exports, require, module, __filename, __dirname) {
//console.log('file name: '+__filename)
//console.log('dir name: '+__dirname)
var url = 'http://mylogger.io/log';
function log(message) {
    console.log(message)
}

module.exports.log = log;
module.exports.urlEndPoint = url;
//module.exports = log; only one function/var will export
//})