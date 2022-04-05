const EventEmitter2 = require('events'); //events is a class
//const emitter2 = new EventEmitter2()

class Logger extends EventEmitter2 {
    /*function*/ log(message) {
    console.log(message)
    /*emitter2*/this.emit('messageLogged', {id: 1, url: 'http://'}) //arg
    }}

module.exports = Logger;