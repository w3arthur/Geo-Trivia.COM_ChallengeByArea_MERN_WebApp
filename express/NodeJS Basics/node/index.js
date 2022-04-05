const Person = require('./person');
const Teacher = require('./teacher');
const logger = require('./logger')
const Logg = require('./logg');

//const teacher = new Teacher('hgjgh', 'ghfg');
//teacher.teach();
//foo1();

/* */
const person = new Person('aaaa');
console.log(person.name);
person.walk();
/* */

/* *
const teacher = new Teacher('arthur', 'profesor');
console.log(teacher.name, teacher.degree);
teacher.walk();
teacher.teach()
/* */


/* */
//window.console.log("Main Module:")
global.console.log("Main Module:"); // not work on browser console
//for (var i = 0; i < module.children.length; i++) console.log(module.children[i].id); //global
//(module.children).forEach(x => console.log(x.id) );
//(module.children).map(x => console.log(x.id));
for(let x of module.children) console.log(x.id);
/* */