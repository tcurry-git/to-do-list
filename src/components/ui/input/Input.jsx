import { useId } from 'react';
import { useTooltip } from '../../../context';

export function Input({
    type = "text",
    label, 
    className,
    onChange,
    onBlur,
    onKeyDown,
    ...props
}){
    const generatedId = useId();
    const inputId = props?.id ?? generatedId;
    const [tooltipDetails, ] = useTooltip();

    const myTooltip = tooltipDetails.find(tooltip => tooltip.id?.includes(inputId));

    return(
        <>
        <input 
        id={inputId}
        className={className} 
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