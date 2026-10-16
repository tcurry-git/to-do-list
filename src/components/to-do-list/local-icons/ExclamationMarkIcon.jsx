import { TbExclamationMark } from "react-icons/tb";
import { CustomBaseIcon } from "../../ui/icons/CustomBaseIcon";

export function ExclamationMarkIcon({
    color, 
    size,
    strokeWidth = 3,
    ...props
}){
    return <CustomBaseIcon icon={TbExclamationMark} color={color} size={size} strokeWidth={strokeWidth} {...props}/>
}