const logger = require('./logger')
//console.log(logger) //return the functions and vars
var a = logger.urlEndPoint;
logger.log("message logger hi!!!")


// Build in modules https://nodejs.org/dist/latest-v17.x/docs/api/
// path
const path = require('path');
var pathObj = path.parse(__filename);
const os = require('os');
var totalMemory = os.totalmem();
var freeMemory = os.freemem();

const fs = require('fs');
//const files = fs.readdirSync('./'); // all files here 
//console.log(files)
fs.readdir('./', function(err, files){ // Preffer Async !
    if(err) console.log('Error', err)
    else console.log('Result', files)
    })


//https://nodejs.org/dist/latest-v17.x/docs/api/events.html
const EventEmitter = require('events'); //events is a class
const emitter = new EventEmitter()
emitter.on('messageLogged', (arg) => { // e / eventArg
    console.log('listener called', arg)
    })
emitter.emit('messageLogged', {id: 1, url: 'http:// ...'}) //arg


const Logg = require('./logg')
const logg = new Logg();
logg.on('messageLogged', (arg) => { // e / eventArg
    console.log('listener called from Required Class', arg)
    })
logg.log("message2 to class")


const http = require('http');
const server = http.createServer( (req, res) => {
    if(req.url === '/'){ // http://localhost:3000/
        res.write('Hello World')
        res.end()
    }
    else if(req.url === '/api/courses'){ // http://localhost:3000/api/courses
        res.write(JSON.stringify([1, 2, 3])) //JSON to string
        res.end()
    }

    });
//server.on('connection', (socket)=> { console.log('new connection') })
server.listen(3000) // Port 3000
server.emit() // server.on('connection', socket => ...)
console.log('Waiting on Port 3000, http://localhost:3000/ ')
console.log('Waiting on Port 3000, http://localhost:3000/api/courses ')
console.log('Close the procces wit CTRL C')

/* */
//window.console.log("Main Module:")
global.console.log("Main Module:"); // not work on browser console
//for (var i = 0; i < module.children.length; i++) console.log(module.children[i].id); //global
//(module.children).forEach(x => console.log(x.id) );
//(module.children).map(x => console.log(x.id));
for(let x of module.children) console.log(x.id);
/* */

/* *
function Element(str){document.getElementById(str)}
function El(str){Element(str)}
/* */
//window / document on browser
//on network
//operating system
//events
//function FS(){fs.readFile()}
//function HTTP(){http.createServer()}

/* *
setTimeout()
clearTimeout()
setInterval()  //?
clearInterval()
/* */