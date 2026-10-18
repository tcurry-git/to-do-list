import { CustomBaseIcon } from './../../ui';
import { TbXFilled } from 'react-icons/tb';

export function ExpiredTaskIcon({
    color = 'var(--clr-red)'
}){
    return <CustomBaseIcon icon={TbXFilled} color={color}/>
}