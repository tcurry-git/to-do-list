import ReactDOM from 'react-dom';
import styles from './Overlay.module.css';

export function Overlay({
    container,
    color = 'var(--clr-overlay)',
    ...props
}){
    if (!container) return;
    return ReactDOM.createPortal(
        <div className={styles.overlay} inert style={{background: color}} {...props}></div>,
        container
    );
}