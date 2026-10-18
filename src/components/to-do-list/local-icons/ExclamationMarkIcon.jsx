import { TbExclamationMark } from "react-icons/tb";
import { CustomBaseIcon } from './../../ui';

export function ExclamationMarkIcon({
    color = 'orangered', 
    size,
    strokeWidth = 3,
    ...props
}){
    return <CustomBaseIcon icon={TbExclamationMark} color={color} size={size} strokeWidth={strokeWidth} {...props}/>
}