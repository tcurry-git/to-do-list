import { TbPlus } from 'react-icons/tb';
import { CustomBaseIcon } from "./../../ui";

export function PlusIcon({
    size = 'var(--icon-lg)',
    color = 'black',
    ...props
}){
    return (
        <CustomBaseIcon icon={TbPlus} size={size} color={color} {...props}/>
    );
}