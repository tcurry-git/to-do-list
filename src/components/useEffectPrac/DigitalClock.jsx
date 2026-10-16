import {useState, useEffect} from 'react';

export default function DigitalClock(){
    // useEffect(function, [dependencies])

    // useEffect(() => {})                  //runs on every re-render include first mount
    // useEffect(() => {}, [])              //runs only on mount
    // useEffect(() => {}, [value])         //runs on mount + when value change
    const [time, setTime] = useState(new Date()); // whatever the date and time currently is

    // when we mount, create an interval that updates the current date and time every 1s
    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date()); // every second we set our time to the new date and time
        }, 1000);

        //when this component um-mount, we stop the time state variable 'time' from getting the new Date() every 1s
        return () => {
            clearInterval(intervalId);
        }

    });
        function formatTime(){
            // these are all functions that exist within the Date object
            let hours = time.getHours(); // value is assignedlater, let is for temporary assignment
            const minutes = time.getMinutes();
            const seconds = time.getSeconds();
            const meridiem = hours >= 12 ? "PM" : "AM";

            hours = hours % 12 || 12; // if hours is 12 it will go to 0 which is actually false but then the || assigns 12 to it

            return `${padZero(hours)}: ${padZero(minutes)}: ${padZero(seconds)} ${meridiem}`; // ${something} to tells JS to evaluate 'something' as JS
        }
        function padZero(number){
            return (number < 10 ? "0" : "") + number;
        }
    return(
        <>
            <div class="clock-container">
                <div class="clock">
                    <span>{formatTime()}</span>
                </div>
            </div>
        </>
    );
}

