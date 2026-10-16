import styles from './ToDoList.module.css';
import { useState, useEffect } from 'react';

export default function ToDoListOld(){
    const [tasks, setTasks] = useState([]);
    const [taskContent, setTaskContent] = useState("");

    function addTask(e){
        if (e) e.preventDefault();
        if (taskContent.trim() === "") return;
        setTasks(t => [...t, taskContent]);
        setTaskContent("");
    }
    function deleteTask(index){
        setTasks(t => t.filter((_, i) => i !== index)) // filter loops through each index position and says keep each index where the index 
        // doesn't equal the index of task we are trying to delete
    }

    function switchTaskUp(index){
        if (index === 0) return;
        setTasks(t => {
            const tasksCopy = [...t];
            [tasksCopy[index], tasksCopy[index - 1]] = [tasksCopy[index - 1], tasksCopy[index]]; // currently the index is after the the adjacent item, we need it before
            return tasksCopy;
        });
    }
    function switchTaskDown(index){
        setTasks(t => {
            if (index === t.length - 1) return; //not working
            const tasksCopy = [...t];
            //right side is what we currently have
            [tasksCopy[index], tasksCopy[index + 1]] = [tasksCopy[index + 1], tasksCopy[index]];
            return tasksCopy;
        });
    }
    function switchTaskFirst(index){
        if (index === 0) return;
        setTasks(t => {
            const tasksCopy = [...t];
            [tasksCopy[index], tasksCopy[0]] = [tasksCopy[0], tasksCopy[index]];
            return tasksCopy;
        });
    }
    function switchTaskLast(index){
        setTasks(t => {
            if (index === t.length - 1) return; //not working
            const tasksCopy = [...t];
            [tasksCopy[index], tasksCopy[t.length - 1]] = [tasksCopy[t.length - 1], tasksCopy[index]];
            return tasksCopy;
        });
    }
    function deleteAllTasks(){
        setTasks([]);
    }
    // styles this to look better
    return(
        <>
        <div style={{width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "5rem"}}>
            <h1>To Do List</h1><br/>
            <div style={{display: "flex"}}>
                <form onSubmit={addTask}>
                    <input type="text" value={taskContent} placeholder='Enter task name' onChange={(e) => setTaskContent(e.target.value)}/>
                    <button className={styles.addTaskBtn} onClick={addTask}>Add Task</button>
                </form>
            </div>
        </div>
        <button className={styles.deleteBtn} style={{width: "max-content", display: "flex", justifyContent: "center", alignItems: "center", margin: "1rem auto"}}
        onClick={deleteAllTasks}>Delete All Tasks</button>
        <div style={{maxWidth: "800px", display: "flex", flexDirection: "column", justifyContent: "center", margin: "1.1rem auto"}}>
            {tasks.map((task, index) =>
            <div style={{display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", border: "2px solid var(--clr-default-border)", padding: "var(--space-md)"}} key={index}>
                <p style={{flex: 2, justifySelf: "center"}} className={styles.taskText}>{task}</p>
                <button className={styles.deleteBtn} onClick={() => deleteTask(index)}>Delete Task</button>
                <button className={styles.switchTaskBtn} onClick={() => switchTaskUp(index)}>⬆️ +1</button>
                <button className={styles.switchTaskBtn} onClick={() => switchTaskDown(index)}>⬇️ -1</button>
                <button className={styles.switchTaskBtn} onClick={() => switchTaskFirst(index)}>⬆️</button>
                <button className={styles.switchTaskBtn} onClick={() => switchTaskLast(index)}>⬇️</button>
            </div>)}
        </div>
        
        </>
    );
}

