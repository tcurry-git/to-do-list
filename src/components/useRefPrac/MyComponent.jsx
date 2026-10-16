import { useState, useEffect, useRef } from 'react';

export default function MyComponent(){
    // useState() cause re-render EVERYTIME on value change

    // useRef is similar to useState but diesn't cause re-render on value change
    //      1. Accessing/Interacting with DOM elements
    //      2. Handling focus, animations, and transitions
    //      3. Managing timers and intervals

    const inputRef = useRef(null); // inputRef is an object with only a prop of 'current' which can have a value of an HTML element, array, object etc

    function handleClick(){
        inputRef.current.style.border = "2px solid"; // everytime we click the button we put focus on the input
        inputRef.current.style.backgroundColor = "yellow";
    };

    return(
    <>
    <button onClick={handleClick}>Click Me!</button>
    <input ref={inputRef} type="text"/> {/* inputRef.current is the input HTML element*/}
    </>
    );
}