import ReactDOM from 'react-dom';
import styles from './Tooltip.module.css';
import { useEffect } from 'react';
export function Tooltip({
    container,
    id,
    type,
    content,
    remove,
    ...props
}){
    // when the popup is active and user begins typing again input, the keydown removes the popup but input value doesn't change (takes two keypresses to start typing)
    useEffect(() => { // for timeouts and other way of removing such as pressing anywhere on screen
        if (!container || !remove) return

        const removeTooltipKeyDown = () => {
            remove();
        }
        const removeTooltipLoseFocus = (e) => {
            if (!(container.contains(e.relatedTarget))) remove();
        }
        container.addEventListener('keydown', removeTooltipKeyDown) // CANNOT USE INPUT EVENT LISTENER AS THAT FIRES DURING CHARACTER TYPING
        container.addEventListener('focusout', removeTooltipLoseFocus);

        return () => {
            container.removeEventListener('keydown', removeTooltipKeyDown);
            container.removeEventListener('focusout', removeTooltipLoseFocus); // when element or child inside it loses focus. Could use blur if we attached event listeners directly to input
        }

    }, [container])

    if (!container || !id || !type || !content) return;

    const isErrorTooltip = type.contains('error');
    const fontColor = isErrorTooltip ? 'var(--clr-red)' : 'black';
 
    return !isErrorTooltip && ReactDOM.createPortal(
        <div data-tooltip id={id} styles={styles.tooltip} aria-live={isErrorTooltip ? 'assertive' : 'polite'} aria-atomic='true' aria-relevant='all' style={{color: `${fontColor}`}} {...props}>{content}</div>,
        container
    )
}