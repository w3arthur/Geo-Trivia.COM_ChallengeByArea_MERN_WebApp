class Person{
    constructor(name){
        this.name = name;
    }
    static equals(a, b){
        console.log(a===b);
    }   //Person.equals(1, 1)
    walk(){
        console.log('walk ' + this.name);
    }
}

module.exports = Person;
