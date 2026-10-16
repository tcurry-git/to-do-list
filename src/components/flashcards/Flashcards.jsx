import styles from './Flashcards.module.css';
import { useState, useEffect, useRef, createContext, useContext } from 'react';
export default function Flashcards(){
    // switch between flashcards, if get it right, score++ and mark it correct, if get it wrong, score = score and mark it incorrect
    // grid layout of flashcards, score TL, light/dark toggle top right, add and remove flashcards, categorize them as well

    //on refresh a popup could say 'WELCOME TO FLASHCARD GAME' with a start button which just closes the popup
    const [flashcards, setFlashcards] = useState([]); 
    const [flashcardQuestion, setFlashcardQuestion] = useState("");
    const [flashcardAnswer, setFlashcardAnswer] = useState("");
    const [enteredFlashcardAnswer, setEnteredFlashcardAnswer] = useState("");
    const [score, setScore] = useState(0);
    const [questionCount, setQuestionCount] = useState(0);
    const [selectedTag, setSelectedTag] = useState("");
    const [correctAnswerCount, setCorrectAnswerCount] = useState(0);
    const [incorrectAnswerCount, setIncorrectAnswerCount] = useState(0);


    const ghostPopoverRef = useRef(null); // why assign null everytime?

    const tags = [ {name: "Maths", className: styles.mathsTag}, 
                   {name: "English", className: styles.englishTag}, 
                   {name: "Science", className: styles.scienceTag}, 
                   {name: "Geography", className: styles.geographyTag}, 
                   {name: "Music", className: styles.musicTag},
                   {name: "Comp Sci", className: styles.csTag},
                   {name: "Engineering", className: styles.engineeringTag},
                   {name: "Business", className: styles.businessTag} ];

    
    function addFlashcard(){
        ghostPopoverRef.current?.hidePopover(); // if it exists hide it
        // guards
        if (tags.map((tag) => tag.name !== selectedTag)) return //  must have selected a tag
        if ( flashcardQuestion.trim() === "" ||
             flashcardAnswer.trim() === "" ) return 
        
        // need to set some default flashcards
        const newFlashcard = {
            id: crypto.randomUUID(),
            question: flashcardQuestion.trim(),
            answer: flashcardAnswer.trim(),
            enteredAnswer: "",
            correctAnswer: false,
            tag: selectedTag,
            date: Date.now(),
            correctAnswerCount: correctAnswerCount,
            incorrectAnswerCount: incorrectAnswerCount  
        };
        
        setFlashcards(f => [...f, newFlashcard]);
        setQuestionCount((c) => c + 1); // this isnt working
        setFlashcardQuestion("");
        setFlashcardAnswer("");
    }
    function handleAddTags(id, tagName){ // we don't need id we need the tagname? like maths
        const hasTag = false;
        setFlashcards(f => f.map(card => card.id === id && card.tag === tagName ? hasTag = true : hasTag));
        if (hasTag) return // if the flashcard already has that tag name, return

        const targetFlashcard = flashcards.find(card => card.id === id);
        targetFlashcard.tag === tagName;
    }
    //make this work, remember this is an object array
    function removeFlashcard(id){
        setFlashcards(f => f.filter((card) => card.id === id)); // map the array
    }
    function handleAnswerChange(id, value){
        // find card with matching id, forget all the other props inside the card object, and just switch the value of 'enteredAnswer' to user typed answer
        setFlashcards(f => f.map(card => card.id === id ? {...card, enteredAnswer: value} : card));
    }
    // once correct we lock it from user focus and keep it highlight green. Need a button to reset game that resets score to 0 and clears all green highlights
    function checkFlashcardAnswer(id){
        const targetFlashcard = flashcards.find(card => card.id === id);
        if (!targetFlashcard) return
        if (targetFlashcard.correctAnswer) return // if always checks for truthiness, so chek value of answeredCorrecly for true
        if (targetFlashcard.enteredAnswer.trim() === "") return
        const doAnswerMatch = targetFlashcard.enteredAnswer.trim().toLowerCase() === 
                                targetFlashcard.answer.trim().toLowerCase();
        if (doAnswerMatch) {
            setScore((s) => s + 1); // standardized thing, always use brackets because you can have more than one parameter
            setFlashcards(f => f.map(card => card.id === id ? {...card, correctAnswer: true} : card))
        }
    }
    
            
    return (
    <>
    <article>
        <div className="content-container"> {/* How could I use a flex-container here? */}
            <header className={styles.topBar}>
                <span>Score: {score}</span>
                <button className={styles.toggleThemeBtn}>Dark / light</button>
            </header> 
            <main>
                <section className={styles.flashcardContainer}>
                    <div ref={ghostPopoverRef} id="ghostFlashcard" popover="auto" className={styles.ghostFlashcard} onKeyDown={(e) => (e.key === "s" || e.key === "S") && addFlashcard()}>
                        <h2>Make Your Flashcard</h2>
                        <input type="text" placeholder='Enter flashcard question' value={flashcardQuestion} onChange={(e) => setFlashcardQuestion(e.target.value)}/>
                        <input type="text" placeholder='Enter flashcard answer' value={flashcardAnswer} onChange={(e) => setFlashcardAnswer(e.target.value)}/>
                        {/* each tagName has its own button */}
                        <h3>Choose your tag:</h3>
                        <div className={styles.tagsContainer}>
                            {tags.map((tag) => (
                                <button 
                                key={tag.name}
                                type="button"
                                className={`${styles.tagBtn} ${tag.className} ${styles.button}`}
                                onClick={() => setSelectedTag(tag.name)}>
                                {tag.name}
                                </button>
                            ))}
                        </div>
                        <button className={styles.submitFlashcard} onClick={addFlashcard}>Submit Flashcard</button>
                    </div>
                    <h1>Flashcard Game</h1>
                    <div className={styles.addDelFlashcardContainer}>
                        {/* <input data-flashcard-question-input type="text" value={flashcardQuestion} onChange={(e) => setFlashcardQuestion(e.target.value)}/> */}
                        <button popoverTarget="ghostFlashcard" className={styles.addFlashcardBtn}>Add Flashcard +</button>
                        <button className={styles.delAllFlashcardsBtn} onClick={() => setFlashcards([])}>Delete All -</button>
                    </div>
                    <div className={styles.flashcardGrid}>
                        {/* creates unique variable scope for each flashcard */}
                        {flashcards.map((flashcard) => ( 
                        <div key={flashcard.id} className={`${styles.flashcard} ${flashcard.correctAnswer ? styles.correctAnswer : ""}`}>
                            <div className={styles.topOfFlashcard}>
                                <span className={tags.map((tag) => tag.name === flashcard.tag ? styles.tag.className : tag)}>{flashcard.tag}</span>
                                <button className={styles.removeFlashcard} onClick={() => removeFlashcard(flashcard.id)}>X</button>
                            </div>
                            <div>
                                <span>Question: {questionCount}</span>
                                <p>{flashcard.question}</p>
                            </div>
                            <input type="text" value={flashcard.enteredAnswer} 
                                onChange={(e) => handleAnswerChange(flashcard.id, e.target.value)} 
                                onKeyDown={(e) => e.key === "Enter" && checkFlashcardAnswer(flashcard.id)}/>
                        </div>))}
                    </div>
                </section>
            </main>
        </div>
    </article>
    </>
    );
}

