import { useId } from 'react';
import styles from './Button.module.css';
export function Button({
    type = 'button',
    className,
    children,
    ...props
}){
    const generatedId = useId();
    const btnId = props.id ?? generatedId;

    return <button type={type} id={btnId} className={className} {...props}>{children}</button>
}