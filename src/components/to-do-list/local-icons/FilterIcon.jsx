import { TbFilter2 } from "react-icons/tb";
import { CustomBaseIcon } from './../../ui';

export function FilterIcon(
    {
        color = 'var(--clr-green)',
        ...props
    }
){
    return <CustomBaseIcon icon={TbFilter2} color={color} {...props}/>;
}