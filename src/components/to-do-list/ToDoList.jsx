import React, { useState, useEffect, useRef, useId } from 'react';
import styles from './ToDoList.module.css';
import { useAnnounce, useTooltip } from '../../context/index.js';
import { Overlay } from '../global';
import { Input, Button, BackToTop } from '../ui';
import EmbeddedLinksSearchBar from './EmbeddedLinksSearchBar/EmbeddedLinksSearchBar.jsx';


import { TbArrowBarToRight, TbEdit, TbExclamationMark, TbXFilled, TbSparkles } from 'react-icons/tb';
import { StarIcon, TrashIcon, NotificationIcon }  from '../ui/icons/index.js';
import { CompletedTaskIcon, AlarmClockIcon, PlusIcon } from './local-icons';


// if you have the same two components in an app you must useId to keep ids unique
// use custom data attributes to select elements in JS so if you want to change a CSS class you won't have to change it in your JS
// think about doing reminder and then get icons, disable setting a date before today and style!
export default function ToDoList(){
    const setAnnouncementText = useAnnounce();
    const [tooltipDetails, setTooltipDetails] = useTooltip(); 
    // helper function 
    function getRandomItemFromArr(arr){; 
        return arr[Math.floor(Math.random() * arr.length)];
    }
    const getDeadlineTimestamp = (deadline) => {
        const isoDate = deadline.date.split('-').reverse().join('-'); // date is stored as dd-mm-yyyy
        const time = deadline.time || "00:00"; // deadline.time could be null
        return new Date(`${isoDate}T${time}`).getTime(); // sorting by time but not taking in to account date
    }
    const SEC = 1000;
    const MIN = SEC * 60;
    const HOUR = MIN * 60;

    const currDateDDMMYYYYFormat = `${String(new Date().getDate()).padStart(2, '0')}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getFullYear())}`;
    const currTimeHHMMFormat = `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;
    
    // INITIAL TASKS SHOULDNT BE ABLE TO BE EDITED, NO REMINDERS SHOULD SHOW, CAN'T COMPLETE OR FAVORITE ONLY DELETE
    const generateinitialTasks = (count) => {
        const initialTasks = [];
        const initialTasksArr = [ "Walk the dog", "Have a shower", "Pick up Stanley", "Prepare chilli for dinner", "Get ready to meet Hugh", 
                                  "Write biochem essay", "Apply for job", "Write English essay", "Load dishwasher", "Clean oven", "Vacuum carpet", 
                                  "Buy t-shirt on sale" ]; // two are more tasks might pick same string

        const getRandBool = () => Math.random() > 0.5;
            for (let i = 0; initialTasks.length < count; i++) {
                const newInitialTask = {
                    id: crypto.randomUUID(),
                    task: getRandomItemFromArr(initialTasksArr),
                    deadline: { 
                        date: currDateDDMMYYYYFormat, 
                        time: currTimeHHMMFormat,
                    },
                    isEditing: false,
                    hasEdited: false,
                    remindersOn: getRandBool(),
                    hasReminded: getRandBool(),
                    isFavorited: getRandBool(),
                    isCompleted: getRandBool(),
                    isLocked: true,
                    createdAt: Date.now()
                }
                initialTasks.push(newInitialTask);
            }
        return initialTasks
    }
    const initialTasks = generateinitialTasks(4);
    const id = useId();
    const [reminderMsg, setReminderMsg] = useState(null);
    const [taskCards, setTaskCards] = useState(() => {
        const savedTasks = localStorage.getItem('taskCards');
        return savedTasks ? JSON.parse(savedTasks) : initialTasks
    }); 
    const [isOpen, setIsOpen] = useState(false);
    const [taskCardDraft, setTaskCardDraft] = useState(null); // I think we should do { task: ', date: ', time: '' } how would we easily clear this when we save changes
    const taskTimerRef = useRef({}); // USE REF SO TIMERS PERSIST ON RELOAD/ RE-RENDER
    // const taskExpiredRef = useRef({})
    const taskCardsRef = useRef([]);
    // need same amount of refs as tasks
    if (taskCardsRef.current.length !== taskCards.length) {
        taskCardsRef.current = taskCards.map(() => React.createRef());
    }
    const inputRef = useRef([]);
    const myTooltip = tooltipDetails.find(tooltip => tooltip.id = inputRef.current[tooltipDetails.id])
    
    // RESET BY DEFAULT
    // useLayoutEffect(() => { // task hasn't actually been mapped when this runs, so have to wait until DOM finishes loading 
    //     if (!isEditing) return
    //     const handleBounds = (e) => {
        //         const editingIndex = taskCards.findIndex(task => task?.isEditing)
    //         const node = taskCardsRef.current[editingIndex]?.current; // look for a ref with that index, then access the actual element
    //         if (!node) return
    //         const bounds = node.getBoundingClientRect();
    //         const outsideBounds = e.clientX < bounds.left || e.clientX > bounds.right || 
    //                               e.clientY < bounds.top || e.clientY > bounds.bottom
    //         if (outsideBounds){
    //             setTaskCards(taskCards.map(task => ({...task, isEditing: false})));
    //         } 
    //     }
    //     window.addEventListener('mousedown', handleBounds)

    //     return () => window.removeEventListener('mousedown', handleBounds)
    // }, [isEditing, taskCards]) // both change so must rely on both??
    // Inside TaskCard.jsx
    useEffect(() => {
        localStorage.setItem('taskCards', JSON.stringify(taskCards));
    }, [taskCards])

    useEffect(() => {
        //how does this work
        taskCards.forEach(card => {
            if (card.isLocked) return;
            if (card.isCompleted && !taskTimerRef.current[card.id]){
                taskTimerRef.current[card.id] = setTimeout(() => {
                    setTaskCards((prevCards) => prevCards.filter((c) => c.id !== card.id));
                    delete taskTimerRef.current[card.id]; // taskID become key, timer id is the value
                }, 8000);
            }
            if (!card.isCompleted && taskTimerRef.current[card.id]){
                clearTimeout(taskTimerRef.current[card.id]);
                delete taskTimerRef.current[card.id];
            }
        })
    }, [taskCards]);

    useEffect(() => { 
        handleReminders(); // runs instantly first
        const reminderInterval = setInterval(() => {
           handleReminders();
        }, SEC * 10) // 10sec
        return () => clearInterval(reminderInterval); // when would we ever unmount 
    }, [reminderMsg]) // need this otherwise the useEffect will always have the null state value forever

    useEffect(() => {
        if (!reminderMsg) return;
        const reminderTimer = setTimeout(() => {
            setReminderMsg(null);
        }, SEC * 10)
        return () => clearTimeout(reminderTimer); // when it unmounts you clear timeout
    }, [reminderMsg]) // code only runs if this value exists?

    function handleReminders(){
        if (reminderMsg) return;
        const HALF_HOUR = HOUR / 2;
        const dateNow = Date.now();
        let warningMsg = null;
        setTaskCards((t) => [...t].map((taskCard) => {
            if (taskCard.isCompleted || !taskCard.remindersOn || taskCard.isLocked) return taskCard;
                
                const deadlineTime = getDeadlineTimestamp(taskCard.deadline);
                const timeRemaining = deadlineTime - dateNow;
                
                if (timeRemaining <= HALF_HOUR && timeRemaining > 0 && !taskCard.hasReminded){
                    warningMsg = `⏰ pssst, you have roughly ${Math.ceil(timeRemaining / 60000)} minute(s) left to complete task: ${taskCard.task}!`;
                    return {
                        ...taskCard, 
                        hasReminded: true
                    } 
                }
                if(timeRemaining <= 0 && !taskCard.hasExpired) {
                    return {
                        ...taskCard,  
                        hasExpired: true, 
                    }
                }
                return taskCard; // default return for unhandled cases (say this condition: timeRemaining <= TEN_MINS && timeRemaining > 0 is met but this one:  !taskCard.hasReminded isnt)
            })
        );
        if (warningMsg) setReminderMsg(warningMsg);
    }

    function handleAddTask(){
        //max ten tasks
        if (taskCards.length === 10) {
            setTooltipDetails({
                type: 'error', 
                element: document.querySelector(`${styles.taskList}`),  
                content: 'Max task limit reached'
            }); 
        }
        const newID = crypto.randomUUID();
        const newTaskCard = { 
            id: newID, 
            task: "", 
            deadline: {
                date: "",
                time: "",
            } ,
            isEditing: true,
            hasEdited: false,
            remindersOn: true,
            hasReminded: false,
            hasExpired: false,
            isFavorited: false,
            isCompleted: false, 
            isDeleted: false,
            createdAt: Date.now()
        }
        setTaskCards((t) => [...t.filter((task) => !task.isLocked), newTaskCard]) // how does this work
        setTaskCardDraft({
            taskID: newID,
            task: '',
            date: '',
            time: '',
        }) // so on first edit w =e also copy over the task card
        setAnnouncementText('task added')
    }

    function handleTaskCardDraftInput(inputType, draftValue){
        if (!inputType) return;
        setTaskCardDraft((taskCardDraft) => ({...taskCardDraft, [inputType]: draftValue}));
    }
    function handleSaveChanges(id){
        if (taskCardDraft?.taskID !== id || tooltipDetails) return; 
        setTaskCards((t) => t.map(taskCard => {
            if (taskCard.id !== id) return taskCard;
            return {
                ...taskCard, 
                task: taskCardDraft?.task,
                deadline : {
                    date: taskCardDraft?.date,
                    time: taskCardDraft?.time,
                },
                isEditing: false, 
                hasEdited: true,
                }
        }));
        setTaskCardDraft(null);
        setAnnouncementText('task changes successfully saved');
    }

    function focusNext(currInput) { 
        const inputContainer = currInput.closest('[data-taskcard-inputs]');
        const inputsArray = Array.from(inputContainer.querySelectorAll('input')); // we want to type in task first
        const currentIndex = inputsArray.indexOf(currInput);
        // indexOf returns -1 if not found so checks if current input exists within array and ensures its not last one
        if (currentIndex !== -1 && currentIndex < inputsArray.length - 1) {
            inputsArray[currentIndex + 1].focus();
        } else if (currentIndex !== -1 && currentIndex === inputsArray.length - 1){ // if its the last input (so the time input)
            const saveBtn = currInput.closest('[data-save-changes]');
            if (saveBtn) saveBtn.focus();
        }
    }
    
    // function focusLast(currInput) { 
    //     const inputContainer = currInput.closest('[data-taskcard-inputs]');
    //     const inputsArray = Array.from(inputContainer.querySelectorAll('input')); // we want to type in task first
    //     const currentIndex = inputsArray.indexOf(currInput);
    //     // indexOf returns -1 if not found so checks if current input exists within array and ensures its not last one
    //     if (currentIndex !== -1 && inputsArray[currentIndex - 1].value.trim() !== '' && currentIndex <= inputsArray.length - 1) {
    //         inputsArray[currentIndex - 1].focus();
    //     } 
    // }
    function handleTaskValidation(task, inputElement, id){
        if (!task) {
            setTooltipDetails({id: id, type: 'error', element: inputElement, content: 'Task field cannot be empty'})
            return;
        }
        const trimmedTask = task.trim();
        const isLenLessThan50 = trimmedTask.length < 50;
        const isDuplicate = taskCards.some((taskCard) => (taskCard.id !== id && taskCard.task !== '') &&
                            trimmedTask.replace(/[^a-zA-Z]/g, '').toLowerCase() === taskCard.task.replace(/[^a-zA-Z]/g, '').toLowerCase()); 
        if (task.length >= 3 && task.length <= 50 && !isDuplicate) {
            focusNext(inputElement);
        }
        else { 
            setTaskCardDraft((taskCardDraft) => ({...taskCardDraft, task: isLenLessThan50 ? trimmedTask : trimmedTask.slice(0, 50)}));
            setTooltipDetails({id: id, type: 'error', element: inputElement, content: 'Warning: task is too long, too short or already exists'});
            return;
        }
    }
    function handleDateFormat(rawDate){
        const dateDigits = rawDate.replace(/\D/g, '').slice(0, 8);
        return dateDigits.replace(/(\d{2})(\d)/, '$1-$2') // if this is already whats happened it just moves on to next replace
                         .replace(/(\d{2}-\d{2})(\d)/, '$1-$2'); // capture digits and inject - between them
    }
    function handleTimeFormat(rawTime){
        const timeDigits = rawTime.replace(/\D/g, '').slice(0, 4);
        return timeDigits.replace(/(\d{2})(\d)/, '$1:$2');
    }
    function handleDateValidation(date, inputElement, id){
        const dateDigits = date.replace(/\D/g, '').slice(0, 8) // passing in formatted date
    
        const day = Number(dateDigits.slice(0, 2));
        const month = Number(dateDigits.slice(2, 4));
        const year = Number(dateDigits.slice(4, 8));
    
        if (dateDigits.length >= 2){
            if (!(day >= 1 && day <= 31)){
                setTooltipDetails({id: id, type: 'error', element: inputElement, content: 'Warning: task is too long, too short or already exists'});
                setTaskCardDraft((taskCardDraft) => ({...taskCardDraft, date: ''}));
                return;
            }
        }
    
        if (dateDigits.length >= 4){
            if (!(month >= 1 && month <= 12)){
                setTooltipDetails({id: id, type: 'error', element: inputElement, content: 'months must be in range 1-12'});
                setTaskCardDraft((taskCardDraft) => ({...taskCardDraft, date: taskCardDraft.date?.slice(0, 3) ?? ''}));
                return;
            }
        }
        if (dateDigits.length === 8){
            const currentYear = new Date().getFullYear(); 
            if (year > currentYear - 1 && year <= currentYear + 1) {
                const [day, month, year] = date.split('-').map(Number);
                const enteredDate = new Date(year, month - 1, day, 23, 59, 59).getTime(); // if you just enter year, month, day it defaults to midnight...
                if (enteredDate >= Date.now()){
                    focusNext(inputElement);
                } else {
                    setTooltipDetails({id: id, type: 'error', element: inputElement, content: 'Warning: date is in the past'});
                    setTaskCardDraft((taskCardDraft) => ({...taskCardDraft, date: ''}));
                    return;
                }
            } else { 
                setTooltipDetails({id: id, type: 'error', element: inputElement, content: `the year must be ${currentYear} or ${currentYear + 1}`});
                setTaskCardDraft((taskCardDraft) => ({...taskCardDraft, date: taskCardDraft.date?.slice(0, 6) ?? ''}));
                return;
            }
        } 
    }
    function handleDateValidationOnBlur(date, inputElement, id){
        // DATE
        if (!date) {
            setTooltipDetails({id: id, type: 'error', element: inputElement, content: 'Date field cannot be empty'});
            return;
        } else {
            handleDateValidation(date, inputElement, id);
        }
    }

    function handleTimeValidation(date, time, inputElement, id){
    //TIME
    const timeDigits = time.replace(/\D/g, '').slice(0, 4);
    
    const hrs = Number(timeDigits.slice(0, 2));
        const mins = Number(timeDigits.slice(2, 4));

        if (timeDigits.length >= 2){
            if (!(hrs >= 0 && hrs <= 23)){
                setTooltipDetails({id: id, type: 'error', element: inputElement, content: 'hours must be between 0-23'});
                setTaskCardDraft((taskCardDraft) => ({...taskCardDraft, time: ''}));
                return;
            } 
        }
        if (timeDigits.length === 4){ // **NOT WORKING**
            if (mins >= 0 && mins <= 59) {
                if (date.length !== 10) {
                    setTooltipDetails({id: id, type: 'error', element: inputElement, content: 'Warning: cannot validate time without a valid date'});
                    return;
                }
                if (date && time){
                    const [day, month, year] = date.split('-').map(Number);
                    const [hrs, mins] = time.split(':').map(Number);
                    const enteredDeadline = new Date(year, month - 1, day, hrs, mins, 0).getTime(); //if user entered "02" for month its actually indexed at 1 so we -1
                    if (enteredDeadline >= Date.now()){
                        focusNext(inputElement)
                    } else {
                        setTooltipDetails({id: id, type: 'error', element: inputElement, content: 'Warning: time is in the past'});
                        setTaskCardDraft((taskCardDraft) => ({...taskCardDraft, time: ''}));
                        return;
                    }
                }
            } else {
                setTooltipDetails({id: id, type: 'error', element: inputElement, content: 'minutes must be between 0-59'});
                setTaskCardDraft((taskCardDraft) => ({...taskCardDraft, time: taskCardDraft.time?.slice(0, 3) ?? ''}));
                return;
            }
        
        }        
    }
    function handleTimeValidationOnBlur(date, time, inputElement, id){
        if (!time){
            setTooltipDetails({id: id, type: 'error', element: inputElement, content: 'Time field cannot be empty'});
            return;
        } else {
            handleTimeValidation(date, time, inputElement, id);
        }

    }
    function sortByDeadline(){
        setTaskCards((t) => [...t].sort((a, b) => getDeadlineTimestamp(a.deadline) - getDeadlineTimestamp(b.deadline))); 
        setAnnouncementText('task sorted by deadline (with task to be completed soonest at the top)');// we have to check date first then time
    }
    function handleCancelTask(id){
        setTaskCards((t) => [...t].filter(taskCard => {
            const idMatch = taskCard.id === id;
            if (!idMatch) {
                setAnnouncementText('task cancelled and has been deleted');
                return taskCard;
            }
            return taskCard.hasEdited;
        }));
        setTaskCards((t) => [...t].map(taskCard => taskCard.id === id ? {...taskCard, isEditing: false} : taskCard));
        setTaskCardDraft(null);
        setAnnouncementText('task stopped editing')
    }
    function handleStartEditing(id){ // reset logic
        const cardBeingEdited = taskCards.find(taskCard => taskCard.id === id && !taskCard.hasReminded);
        if (!cardBeingEdited) return;
        setTaskCardDraft({
            taskID: cardBeingEdited?.id,
            task: cardBeingEdited?.task,
            date: cardBeingEdited?.deadline.date,
            time: cardBeingEdited?.deadline.time
        }); 
        setAnnouncementText('task is editing');
    }
    function handleEditing(id){
        handleStartEditing(id);
        setTaskCards((t) => [...t].map((taskCard) => taskCard.id === id ? {...taskCard, isEditing: true} : taskCard));
    }
    function handleSetReminders(id){
        if (Notification.permission !== 'granted'){
            Notification.requestPermission().then(perm => {
                if (perm === 'granted'){
                    setTaskCards((t) => [...t].map((taskCard) => taskCard.id === id ? {...taskCard, remindersOn: !taskCard.remindersOn} : taskCard));
                    setAnnouncementText('task reminders on');
                } else {
                    alert('Need permission to send browser notifications if you want to be sent reminders');
                }
            });
        } else if (Notification.permission === 'granted') {
            setTaskCards((t) => [...t].map((taskCard) => taskCard.id === id ? {...taskCard, remindersOn: !taskCard.remindersOn} : taskCard));
            setAnnouncementText('task reminders on');
        }
    }
    function handleCompletedTask(id){
        setTaskCards((t) => [...t].map((taskCard) => taskCard.id === id && !taskCard.isLocked ? {...taskCard, isCompleted: !taskCard.isCompleted} : taskCard));
        setAnnouncementText('task completed');
    }
    function handleFavoriteTask(id){
        // if the task if favorited then the green compconsted things fades away, else it just stays
        setTaskCards((t) => [...t].map((taskCard) => taskCard.id === id ? {...taskCard, isFavorited: !taskCard.isFavorited} : taskCard)); // !taskCard.isFavorited allows toggle
        setAnnouncementText('task favorited');
    }
    function handleDeletedTask(id){
        setTaskCards((t) => [...t].filter((taskCard) => taskCard.id !== id || taskCard.isFavorited)); //only returns ones where the id doesnt match or the task if favorited
        setAnnouncementText('task deleted');
    }
    function handleUnfavoriteAllTasks(){
        setTaskCards((t) => [...t].map((taskCard) => taskCard && {...taskCard, isFavorited: false}));
        setAnnouncementText('all tasks unfavorited');
    }
    function handleDeleteAllTasks(){
        setTaskCards((t) => [...t].filter((taskCard) => taskCard.isFavorited && !initialTasks));
        setAnnouncementText('all tasks deleted');
    }
    const isEditingGeneral = taskCards.some(taskCard => taskCard?.isEditing)
    const isSmallScreen = window.innerWidth <= 600;
    const isAllInputsValid = taskCardDraft?.task.length >=3 && taskCardDraft?.deadline?.date.length === 10 && taskCardDraft?.deadline?.time.length === 5;
    return(
        <>
        <article data-to-do-list-container className={styles.toDoList}>
        {isEditingGeneral && <Overlay container={document.querySelector('[data-to-do-list-container]')} color='#000000a6'/>}
        {isOpen && <Overlay container={document.querySelector('[data-to-do-list-container]')} color='transparent' />}
        {/* <BackgroundIcons/> */}
        {reminderMsg?.activeMsg && <div role='status' tabIndex={-1} className={styles.reminderTaskActive}>{reminderMsg?.activeMsg}</div>} 
        {reminderMsg?.expiredMsg && <div role='status' tabIndex={-1} className={styles.reminderTaskExpired}>{reminderMsg?.expiredMsg}</div>} 
        {/* user can click outside of the taskCard region stop editing as well - window event listener in useEffect? */}
            <div className={styles.toDoListContainer}>
                <div className='container'>
                    <main className={isSmallScreen ? 'content-container' : ''}>
                        <section inert={isEditingGeneral ? true : undefined} className={`${styles.addNewTaskContainer}`}> {/*correct use of BEM?*/}
                            <button type='button' autoFocus className={`button text-md ${styles.addTaskBtn}`} onClick={() => handleAddTask()}><PlusIcon strokeWidth={2.6}/>Add New Task</button> {/*is aria-label correct here*/}
                        </section>
                        <section>
                            <div data-task-manip-widgs inert={isEditingGeneral ? true : undefined} className={styles.taskManipulationWidgets}>
                                <div className={styles.taskSearchBar}>
                                    <EmbeddedLinksSearchBar 
                                    itemsToSearchThrough={taskCards}
                                    whatToSearch={taskCards.map(taskCard => taskCard.task)} // returns array of each task
                                    paddingNearby={`var(--space-3xs)`}
                                    listItemShadow={`0 1px 8px var(--clr-lightblue)`}
                                    className={styles.searchBar}/>
                                </div>
                                <div className={`${styles.sliderContainer} ${isOpen ? styles.sliderOpen : ''}`}>
                                    <div className={styles.actionBtnsContainer} >
                                        {isSmallScreen && (
                                        <button type='button' className={styles.actionBtnsController}
                                        aria-label='Click or drag for more options' aria-controls={`${id}-actionBtns`} aria-expanded={isOpen} 
                                        onClick={() => {isOpen ? setIsOpen(false) : setIsOpen(true)}}>
                                            <TbSparkles aria-hidden='true' color='purple' />
                                        </button>)}
                                        <ul className={styles.actionBtns} id={`${id}-actionBtns`}>
                                            <li><button type='button' className={`button ${styles.filterBtn}`} onClick={() => sortByDeadline()} aria-label='Sort tasks by deadline'><AlarmClockIcon/>sort</button></li>
                                            <li><button type='button' className={`button ${styles.unfavoriteAllBtn}`} onClick={() => handleUnfavoriteAllTasks()} aria-label='Unfavorite all tasks'><StarIcon fill="var(--clr-gold)"/><TbArrowBarToRight aria-hidden={true}/><StarIcon/></button></li>
                                            <li><button type='button' className={`button ${styles.deleteAllBtn}`} onClick={() => handleDeleteAllTasks()} aria-label='Delete all tasks'><TrashIcon/>all</button></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section>
                            {/* false means only notify the thing changed. all just means it notifies the user when text changes, and when DOM elements are added/deleted */}
                            <ul data-tooltip-container className={styles.tasksList} >
                                {taskCards.map((taskCard, index) => {
                                    const isEditingSpecificTaskCard = (taskCard.id === taskCardDraft?.taskID) && taskCard?.isEditing 
                                    return (
                                    <li key={taskCard.id} id={taskCard.id} ref={taskCardsRef.current[index]} tabIndex={0}
                                    className={[styles.taskCard, taskCard.isCompleted && !taskCard.isLocked && styles.taskCompleted, 
                                                taskCard.hasReminded && !taskCard.isLocked && styles.taskWarning,
                                                taskCard.hasExpired && !taskCard.isLocked && styles.taskExpired, 
                                                isEditingSpecificTaskCard && styles.taskCardEditing].filter(Boolean).join(' ')}>
                                        {(isEditingSpecificTaskCard) && (
                                            <div data-edit-btns className={styles.editingActionBtns} aria-live='polite'>
                                                <button data-save-changes type='button' className={`button ${styles.saveChangesBtn}`} disabled={!isAllInputsValid} tabIndex={0} onClick={() => handleSaveChanges(taskCard.id)}>Save</button>
                                                <button type='button' className={`button ${styles.cancelEditBtn}`} tabIndex={0} onClick={() => handleCancelTask(taskCard.id)}>Cancel</button>
                                                {isEditingSpecificTaskCard && taskCard.hasEdited && (<button type='button' className={`button ${styles.resetEditBtn}`} tabIndex={0} onClick={() => handleStartEditing(taskCard.id)}>Reset</button>)}
                                            </div>)}
                                        {taskCard.hasReminded && (
                                            <span className={styles.taskWarningWidget} role='alert' aria-label={`${taskCard.task} marked as expiring soon`}>
                                                <TbExclamationMark aria-hidden='true' size='var(--icon-md)' color='orangered' strokeWidth={3}/>
                                            </span>)}
                                        {taskCard.hasExpired && (
                                            <span className={styles.taskExpiredWidget} role='alert' aria-label={`${taskCard.task} marked as expiring soon`}>
                                                <TbXFilled aria-hidden='true' size='var(--icon-md)' color='var(--clr-red)'/>
                                            </span>)}
                                        <div data-taskcard-inputs className={styles.taskInputs}>
                                            <div data-tooltip-container>
                                                <Input autoFocus={isEditingSpecificTaskCard} className={`text-sm ${styles.task}`} aria-label='Enter task' readOnly={!isEditingSpecificTaskCard} 
                                                value={taskCard.isLocked ? getRandomItemFromArr(initialTasks).task : (taskCardDraft?.taskID === taskCard.id) ? taskCardDraft?.task : taskCard.task} // was taskTitle
                                                onChange={(e, inputId) => {
                                                    const taskFormatted = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                                                    handleTaskCardDraftInput('task', taskFormatted, inputId)
                                                }}
                                                onKeyDown={(e, inputId) => { if (e.key === "Enter") {
                                                    e.preventDefault(); // stops focus of next input from triggering onBlur
                                                    handleTaskValidation(e.target.value, e.target, inputId)}}}
                                                onBlur={(e, inputId) => handleTaskValidation(e.target.value, e.target, inputId)}
                                                placeholder='Start typing task...' maxLength={50}/>
                                            </div>
                                            <div className={styles.taskDeadline}>
                                                <span className={styles.deadlineTitle}><strong>Deadline: &nbsp;</strong></span>
                                                <div data-tooltip-container className={styles.deadlineDate}>
                                                    <Input tabIndex={isEditingSpecificTaskCard ? 0 : -1} readOnly={!isEditingSpecificTaskCard} aria-label="Enter date of deadline in DDMMYYYY format" 
                                                    value={taskCard.isLocked ? getRandomItemFromArr(initialTasks).deadline.date : (taskCardDraft?.taskID === taskCard.id) ? taskCardDraft?.date : taskCard.deadline.date} 
                                                    onKeyDown={(e) => (e.key === "Backspace" && e.target.value.trim() === '') && focusLast(e.target)}
                                                    onChange={(e, inputId) => {
                                                        const dateFormatted = handleDateFormat(e.target.value);
                                                        handleTaskCardDraftInput('date', dateFormatted)
                                                        handleDateValidation(e.target.value, e.target, inputId)
                                                    }}
                                                    onBlur={(e, inputId) => handleDateValidationOnBlur(e.target.value, e.target, inputId)}
                                                    placeholder={currDateDDMMYYYYFormat} maxLength={10}/>
                                                </div>
                                                <div data-tooltip-container className={styles.deadlineTime}>
                                                    <Input tabIndex={isEditingSpecificTaskCard ? 0 : -1} readOnly={!isEditingSpecificTaskCard} aria-label="Enter time of deadline in HHMM format"                                                 
                                                    value={taskCard.isLocked ? getRandomItemFromArr(initialTasks).deadline.time : (taskCardDraft?.taskID === taskCard.id) ? taskCardDraft?.time : taskCard.deadline.time} 
                                                    onKeyDown={(e) => (e.key === "Backspace" && e.target.value.trim() === '') && focusLast(e.target)}
                                                    onChange={(e, inputId) => {
                                                        const timeFormatted = handleTimeFormat(e.target.value);
                                                        const currTaskCard = taskCards.find(card => card.id === taskCard.id);
                                                        const dateToUse = (taskCardDraft.taskID === taskCard.id && taskCardDraft?.date !== null)
                                                                             ? taskCardDraft.date : currTaskCard.deadline.date;
                                                        handleTaskCardDraftInput('time', timeFormatted)
                                                        handleTimeValidation(dateToUse, e.target.value, e.target, inputId)}}                                     
                                                    onBlur={(e, inputId) => {
                                                        const currTaskCard = taskCards.find(card => card.id === taskCard.id);
                                                        const dateToUse = (taskCardDraft.taskID === taskCard.id && taskCardDraft?.date !== null)
                                                                             ? taskCardDraft.date : currTaskCard.deadline.date;
                                                        handleTimeValidationOnBlur(dateToUse, e.target.value, e.target, inputId)
                                                    }}
                                                    placeholder={currTimeHHMMFormat} maxLength={5}/>
                                                </div>
                                            </div>
                                            {/* has to be on the right of the actual task card... */}
                                        </div>
                                        <div className={styles.taskBtns}>
                                            <div className={styles.taskOperationalBtns}>
                                                <button type='button' tabIndex={isEditingSpecificTaskCard ? -1 : 0} onClick={() => !isEditingSpecificTaskCard && !taskCard.hasExpired && handleEditing(taskCard.id)} aria-label='Edit task card'><TbEdit size='var(--icon-md)' aria-hidden={true}/></button>
                                                <button type='button' tabIndex={isEditingSpecificTaskCard ? -1 : 0} onClick={() => !isEditingSpecificTaskCard && !taskCard.hasExpired && handleSetReminders(taskCard.id)} aria-label='Toggle task reminder'><NotificationIcon remindersOn={taskCard.remindersOn}/></button>
                                            </div>
                                            <div className={styles.taskActionBtns}>
                                                <ul className={styles.taskActionBtnsList}>
                                                    {/* task.isFavorited evaluates to true/false and then the star component itself handles the styling difference*/}
                                                    <li><button type='button' tabIndex={isEditingSpecificTaskCard ? -1 : 0} onClick={() => !isEditingSpecificTaskCard && !taskCard.hasExpired && handleFavoriteTask(taskCard.id)} aria-label='Toggle favorite task'><StarIcon isFavorited={taskCard.isFavorited}/></button></li>
                                                    <li><button type='button' tabIndex={isEditingSpecificTaskCard ? -1 : 0} onClick={(e) => !isEditingSpecificTaskCard && !taskCard.hasExpired && handleCompletedTask(taskCard.id)} aria-label='Toggle mark as completed'><CompletedTaskIcon isCompleted={taskCard.isCompleted}/></button></li>
                                                    <li><button type='button' tabIndex={isEditingSpecificTaskCard ? -1 : 0} onClick={() => !isEditingSpecificTaskCard && handleDeletedTask(taskCard.id)} aria-label='Delete task'><TrashIcon/></button></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                )})}
                            </ul>
                        </section>
                    </main>
                </div>
            </div>
        <BackToTop/>
        </article>
        </>
    )
}