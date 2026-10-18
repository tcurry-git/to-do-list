import { CustomBaseIcon } from './../../../ui';
import { TbSearch } from 'react-icons/tb';

export function SearchIcon(
    {
        color = 'var(--clr-grey-muted)', 
        ...props
    }
){
    return <CustomBaseIcon icon={TbSearch} color={color} {...props} /> ;
}