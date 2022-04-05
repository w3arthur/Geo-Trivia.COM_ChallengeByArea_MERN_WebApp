        let obj = {
            name: 'a',
            age: 30,
            foo: (x) => {return x;},
        }
        obj.name = 'John';
        obj['name'] = 'Merry';

        let arr = ['red', 'blue', ];
        arr[0];
        arr[2] = 'green';
        arr.length;
        
        function foo1(x){return x;}
        foo1(); //x is undefind

        //class, Factory Function
        function createCircle(x, y){
            return {
                x,
                y,
                z : () => {return x+y;},
            };
        }
        const circle1 = createCircle(1, 2);
        circle1.z();

        //class, Constructor Function
        function Circle(x, y){
            this.x = x;
            this.y = y;
            let _privateFunction = () => {};
            let _privateObj = {'aaa': 'bbbb',};
            let foo = 0; //defult value
            Object.defineProperty(this, 'foo',{ // לחזור!
                    get: () => {return foo;},
                    set: (value) => {
                        //if(...) throw new Error('...');
                         foo = value ;}
            })
            this.z = () => {return x+y;};
        }
        const circle2 = new Circle(1, 2);   //will return this for function
        circle2.z();
        //circle2.constractor;
        const circle3 = Circle.call({}, 1, 2);
        const circle4 = Circle.apply({}, [1, 2, ]);
        circle2.location = {x:1, y:2, };
        delete circle2.location;


        class Circle2a{
            constructor(x){
                this.x = x;
            }    
        }

        class Circle2b extends Circle2a{
            constructor(x, y){
                super(x);
                this.y = y;
            }    
            walk(){
                console.log(x + y);
            }
        }



        const circle5 = new Circle2b(1);

        for (let key in circle2){
            if (typeof  circle2[key] !== 'function')
                console.log(key, circle2[key]);
        }

        const keys = Object.keys(circle2);
        console.log(keys);

        if('x' in circle2) console.log('ok');

