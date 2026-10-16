import styles from './StackingCards.module.css';
import bird from '../../assets/bird.jpg';

export default function StackingCards(){
    function appendText(txt) {
        const newEl = document.createElement('p');
        newEl.textContent = txt;

    }
    appendText('hello world')
    return(
        <>
        {/* <code className={`text-sm ${styles.codeText}`}>These are some stacked cards</code> */}
        <div className={styles.stackingCardsContainer}>
            <div>
                <img src={bird} alt="bird flying"/>
            </div>
            <div>
                <img src={bird} alt="bird flying"/>
            </div>
            <div>
                <img src={bird} alt="bird flying"/>
            </div>
        </div>
        </>
    );
}