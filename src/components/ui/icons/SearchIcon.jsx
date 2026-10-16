
import { TbSearch } from 'react-icons/tb';
import { CustomBaseIcon } from './CustomBaseIcon';

export function SearchIcon(
    {
        color = 'var(--clr-grey-muted)', 
        ...props
    }
){
    return <CustomBaseIcon icon={TbSearch} color={color} {...props} />   ;
}