import { object } from "prop-types";

// ARRAY DESTRUCURING
export default function LearningJs(){
    const [one, two, three] = [1, 2, 3];
    console.log(one, two, three); // return 1, 2, 3
     
    const [,, six] = [4, 5, 6];
    console.log(six) // return just 6. 4 and 5 are omitted because of the commas
    
    const [seven, eight, ...rest] = [7, 8, 9, 10];
    console.log(seven, eight); // return 7, 8. 9 and 10 then goes into its own array
    console.log(...rest) // return 9, 10
    
    const [eleven = "11", twelve] = [undefined, 12];
    console.log(eleven, twelve); // return 11, 12. We have provided a fallback value to the variable 'eleven' because its undefined
    // OBJECT DESTRUCTURING
    const { shroom  = '🍄', banana, pepper } = { shroom: undefined, banana: '🍌' , pepper: '🌶️' }
    console.log(shroom, banana, pepper); // return 🍄, 🍌, 🌶️
    
    const { parent: { child }} = { parent: { child: '👶'}};
    console.log(child) // return 👶 as child is a variable
    
    const users = [{id: 1}, {id: 2,}, {id: 3}]
    for (const { id } of users){
        console.log(id) // return 1, 2, 3
    }
    
    const userObj = {id: 0, username: "Jeff"};
    function user({id, username}){
        return id, username;
    }
    
    let a = "foo";
    let b = "bar";
    [b, a] = [a, b];
    console.log(a, b) // return a="bar", b="foo". No need for temporary variable
    
    var re = /\w+\s/g; // regex
    var str = "fee fi fo fum"
    const [fee, fi, fo] = str.match(re); // assigns variables to each element of a string if they match the regex pattern
    
    // COMPUTED PROPERTIES - used when a property is undefined until runtime
    const rando = randomKey();
    const { [rando]: myKey } = { [rando]: 23 } // [rando] is a computed property with name such as "abc123" and value 23
    // return myKey = 23
    function randomKey(){

    }
    // you can dynamically create object key and property values doing this
    const userObjDemo = {};
    userObjDemo["name"] = "Alex"; // obj[] literal key name as a string
    console.log(userObjDemo) // output { name: "Alex" }

    const userObjDemo2 = {};
    userObjDemo2.name = "Alex"; // obj.property literal key name
    userObjDemo2.age = undefined;
    console.log(userObjDemo2) // output { name: "Alex", age: undefined }


    // reduce function
    const numbers = [10, 20, 30];
    const total = numbers.reduce((acc, num) => { // num is a parameter that represent each index position
        return acc + num;
    }, 0) // default value
    console.log(total) // should be 60

    const fruits = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
    const count = fruits.reduce((acc, fruit) => {
    // [fruit] is the obj key
    // acc[fruit] either creates new key if fruit doesn't exist in object yet or increases its count by 1
    // acc[fruit] on right side returns count of how many of that current fruit is currently in object
    acc[fruit] = (acc[fruit] || 0) + 1; 
    return acc;
    }, {}); // default value
    console.log(count); // Output: { apple: 3, banana: 2, orange: 1 }

    const cart = [
    { item: "Shirt", price: 20 },
    { item: "Pants", price: 50 },
    ];
    const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);
    // Output: 70

    const nested = [[1, 2], [3, 4], [5]];
    const flat = nested.reduce((acc, curr) => acc.concat(curr), []);
    // Output: [1, 2, 3, 4, 5]


    // OBJECT FUNCTIONS
    const objA = {
        name: "thing",
        age: 5,
        isLoggedIn: true
    }
    const objAKeys = Object.keys(objA); // return ["name", "age", "isLoggedIn"]
    const objAValues = Object.values(objA); // return ["thing", 5, true]
    const objAEntries = Object.entries(objA); // return [["name, "thing], ["age", 5], ["isLoggedIn", true]]
    

    // SPREAD AND REST
    // SPREAD - putting new things into existing things are existing things into new things (can go anywhere)
    const things = ["thing1", "thing2", "thing3"];
    const moreThings = [...things, "thing4", "thing5"];
    // REST - can get some of an array or object but them puts the REST into a new array/object (must go last)
    const thingsAgain = ["thing1", "thing2", "thing3"];
    const [firstItem, ...restOfThings] = thingsAgain // rest of things is now a new array of ["thing2", "thing3"]


    // SETS - 
    // no duplicate entries - can remove duplcates from arrays
    // can easily check if entries exist using .has()
    // can add and delete entries using .add() and .delete()
    const mySet = new Set([1, 2, 3])
    mySet.add(2) // no, 2 already exists
    mySet.add(4) // yes

    mySet.has(1) // true
    mySet.has(99) // false

    mySet.delete(3) // deletes 3

    mySet.size // returns number of entries so 3

    mySet.clear(); // clears set so mySet = new Set([])

    const dupes = [1, 2, 2, 3, 5, 6, 6, 7, 9, 9, 10];
    const noDupes = [...new Set(dupes)] // noDupes = [1, 2, 3, 5, 6, 7, 9, 10]

    const mySet2 = new Set([1, 3, 4, 6, 8]); 
    const mySet3 =  new Set([2, 3, 4, 5, 8]);

    // CAN LOOP OVER SET AS WELL
    for (const num of mySet){
        mySet.delete(num) // deletes everything!
    }
    mySet.forEach(num => {
        mySet.delete(num); // deletes everything
    })
    const union = mySet2.union(mySet3); // output (7) {1, 3, 4, 6, 8, 2, 5} // takes all values from both but removed duplicates
    const sortedUnionSet = [...mySet2.union(mySet3)].sort((a, b) => a - b)// output (7) {1, 2, 3, 4, 5, 6, 8}  
    const intersect = mySet2.intersection(mySet3) // output (3) {3, 4, 8} // what values are the same from both sets
    const differenceA = mySet2.difference(mySet3)// output (2) {1, 2} // whats values are in mySet2 but NOT mySet3
    const differenceB = mySet3.difference(mySet2)// output (2) {2, 5} // whats values are in mySet2 but NOT mySet3


    // MAPS
    // good for looking up specific values with .get() instead of looping over entire array
    // objects can be keys
    // objects can be values
    // retain order
    const userRoles =  new Map();
    userRoles.set("Taylor", "Developer"); // Taylor: "Developer"
    userRoles.set("Sam", "Aerospace Engineer"); 
    console.log(userRoles);

    userRoles.get("Taylor") //Developer
    userRoles.has("Sam") //true
    userRoles.size // 3
    // userRoles.delete("Taylor");

    const products = new Map([["Phone", 100], // has to be nested array
                             ["Laptop", 300],
                             ["PC", 800]]);
    // objects as values
    products.set("user_101", { name: "Alex", role: "Admin" }); 
    
    //OR
    // objects as keys
    products.set([...userRoles.keys()][0], "Very smart individual"); // convert all keys in map to array and get first index all in one line
    console.log(products);

    for (const [name, price] of products){
        console.log(`${name} : ${price}`);
    };
    //OR
    products.forEach((price, name) => { // foreach loops passes parameters as (value, key) not (key, value)
        console.log(`${name} : ${price}`);
    });

    // CAN ALSO USE OBJECT LIKE FUNCTION WITH MAPS BUT THEY PRODUCE ITERATERS (OBJECT LIST) NOT ARRAY
    // can convert to array using slack operator: mapArray = [...myMap.keys()] / [...myMap.values()] / [...myMap.entries()]
    const mapKeys = products.keys();
    console.log(mapKeys);
    const mapValues = products.values()
    console.log(mapValues);
    const mapEntries = products.entries()
    console.log(mapEntries);
    console.log([...products.entries()]);

    // PRO TO MAPS OVER REG OBJECTS
    // reg objects
    const objKey1 = { id: 1 };
    const objKey2 = { id: 2 };

    const myObject = {};

    myObject[objKey1] = "Data for Key 1";
    myObject[objKey2] = "Data for Key 2"; // Overwrites Key 1!

    console.log(myObject);
    // Output: { "[object Object]": "Data for Key 2" }
    // maps
    const myMap = new Map();

    myMap.set(objKey1, "Data for Key 1");
    myMap.set(objKey2, "Data for Key 2");

    console.log(myMap.get(objKey1)); // "Data for Key 1"
    console.log(myMap.get(objKey2)); // "Data for Key 2"
    console.log(myMap); // objects can be keys! output: {Object => "Data for key 1/2"}

    //CONVERTING MAP TO OBJECTS, ARRAYS OR OBJECTS TO MAPS
    const mapToArray = [...products];
    console.log(mapToArray);
    const mapToObject = Object.fromEntries(products);
    console.log(mapToObject);
    const obj = {};
    const objectToMap = new Map(Object.entries(obj));


}