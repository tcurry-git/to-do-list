import { TbClock } from 'react-icons/tb';
import { CustomBaseIcon } from '../../ui/icons/CustomBaseIcon';

export function AlarmClockIcon({
    size = 'var(--icon-md)',
    color = 'var(--clr-blue)',
    ...props
}){
    return (
        <CustomBaseIcon icon={TbClock} size={size} color={color} {...props}/>
    );
}