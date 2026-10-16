import { useId } from 'react';
import { useTooltip } from '../../../context';
import styles from './Input.module.css';
export function Input({
    type = "text",
    label, 
    onChange,
    onBlur,
    onKeyDown,
    ...props
}){
    const generatedId = useId();
    const inputId = props?.id ?? generatedId;
    const [tooltipDetails, ] = useTooltip();

    const myTooltip = tooltipDetails.find(tooltip => tooltip.id?.contains(inputId));

    return(
        <>
        <input 
        id={inputId}
        className={styles.input} 
        type={type} 
        aria-invalid={Boolean(myTooltip)} 
        aria-errormessage={myTooltip?.id} 
        onChange={(e) => onChange && onChange(e, inputId)}
        onKeyDown={(e) => onKeyDown && onKeyDown(e, inputId)}
        onBlur={(e) => onBlur && onBlur(e, inputId)}
        {...props} 
        autoComplete="off" autoCorrect="off" spellCheck="false"/>
        {label && <label htmlFor={inputId}>{label}</label>}
        </>
        
    );
}