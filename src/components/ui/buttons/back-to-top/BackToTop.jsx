import { useState, useEffect } from 'react';
import styles from './BackToTop.module.css';
import { TbArrowUp } from "react-icons/tb";
import { Button } from '../button/Button';

export function BackToTop({container, ...props}){
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
        <Button className={styles.backToTop} aria-label='Back to top' onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} {...props}>
            <TbArrowUp size='var(--icon-md)' aria-hidden={true}/>
        </Button>
    );
} 
 