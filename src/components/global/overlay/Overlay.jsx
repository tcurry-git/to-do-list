import ReactDOM from 'react-dom';
import styles from './Overlay.module.css';

export function Overlay({
    container,
    color = 'grey',
    ...props
}){
    if (!container) return;
    return ReactDOM.createPortal(
        <div className={styles.overlay} inert tabIndex={-1} style={{background: color}} {...props}></div>,
        container
    );
}