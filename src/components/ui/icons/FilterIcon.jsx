import { TbFilter2 } from "react-icons/tb";
import { CustomBaseIcon } from "./CustomBaseIcon";

export function FilterIcon(
    {
        color = 'var(--clr-green)',
        ...props
    }
){
    return <CustomBaseIcon icon={TbFilter2} color={color} {...props}/>;
}