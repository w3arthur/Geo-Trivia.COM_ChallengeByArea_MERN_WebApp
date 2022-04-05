const Person = require('./person');
class Teacher extends Person {
    constructor(name, degree){
        super(name);
        this.degree = degree;
    }

    get sertificate (){
        return degree+'!';
    }   // arthur.sertificate

    set sertificate (value){
        this.degree = value;
    } // arthur.sertificate = 'proffesor';

    teach(){
        console.log('teach ' + this.degree);
    }
}
module.exports = Teacher;