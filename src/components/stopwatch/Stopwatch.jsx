import { useState, useEffect, useRef } from 'react';
import styles from './Stopwatch.module.css';

// need start, stop and reset buttons

// useState() cause re-render EVERYTIME on value change
// general rule of thumb, use when data changes update what the user sees on screen

// useRef() is similar to useState but diesn't cause re-render on value change
//      1. Accessing/Interacting with DOM elements
//      2. Handling focus, animations, and transitions
//      3. Managing timers and intervals
// general rule of thumb, use when data chnanges are internal behind the scenes logic that the user doesn't ever see

// useEffect(function, [dependencies])

// useEffect(() => {})                  //runs on every re-render include first mount
// useEffect(() => {}, [])              //runs only on mount
// useEffect(() => {}, [value])         //runs on mount + when value change

export default function Stopwatch(){


    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const intervalIdRef = useRef(null);
    const startTimeRef = useRef(0);

    useEffect(() => {
       if (isRunning){
            intervalIdRef.current = setInterval(() => {
                setElapsedTime(Date.now() - startTimeRef.current);
            }, 10);
       }
       return () => {
           clearInterval(intervalIdRef.current);
       }
    }, [isRunning]);

    useEffect(() => {
        // how to do something on say spacebar + b
        const handleKeyDown = (e) => {
            if (e.key === "Enter") startTimer();
            if (e.key === " ") stopTimer();
            if (e.key === "r" || e.key === "R") resetTimer();
        }
        window.addEventListener('keydown', handleKeyDown) // handleKeyDown is a function
        return () => {
            window.removeEventListener('keydown', handleKeyDown); // remove event listener on component unmount
        }
    }, []);
   
    function startTimer(){
        setIsRunning(true) // false to true
        startTimeRef.current = Date.now() - elapsedTime;
    }
    function stopTimer(){
        setIsRunning(false) // true to false
    }
    function resetTimer(){
        setElapsedTime(0);
        setIsRunning(false); // false
    }
    function formatTime(){
        let hours = Math.floor(elapsedTime / (1000 * 60 * 60));
        let minutes = Math.floor(elapsedTime / (1000 * 60) % 60);
        let seconds = Math.floor(elapsedTime / 1000 % 60);
        let milliseconds = Math.floor((elapsedTime % 1000) / 10)

        minutes = String(minutes).padStart(2, "0");
        seconds = String(seconds).padStart(2, "0");
        milliseconds = String(milliseconds).padStart(2, "0");

        return `${minutes} : ${seconds} : ${milliseconds}`;
    }

    return(
    <>
    <div className={styles.stopwatchContainer}>
        <div className={styles.stopwatch}>
            <h1 className="text-xl">{formatTime()}</h1>
            <div className={styles.stopwatchBtnContainer}>
                <button className={styles.stopwatchBtn} onClick={startTimer}>Start</button>
                <button className={styles.stopwatchBtn} onClick={stopTimer}>Stop</button>
                <button className={styles.stopwatchBtn} onClick={resetTimer}>Reset</button>
            </div>
        </div>
    </div>
    </>
    );

}