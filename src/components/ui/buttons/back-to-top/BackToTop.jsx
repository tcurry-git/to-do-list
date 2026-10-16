import { useState, useEffect } from 'react';
import styles from './BackToTop.module.css'
import { TbArrowUp } from "react-icons/tb";

export function BackToTop(){
    const [showBtn, setShowBtn] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowBtn(window.scrollY >= 200); // true/false
        }
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [])
    
    if (!showBtn) return null;

    return (
        <button type='button' className={styles.backToTop} aria-label='Back to top' onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <TbArrowUp size='var(--icon-lg)' aria-hidden={true}/>
        </button>
    );
} 
 