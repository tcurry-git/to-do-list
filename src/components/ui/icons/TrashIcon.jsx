import { TbTrash } from "react-icons/tb";
import { CustomBaseIcon } from "./CustomBaseIcon";

export function TrashIcon(
    {
        color = 'var(--clr-red)',
        ...props
    }
){
    return <CustomBaseIcon icon={TbTrash} color={color} {...props}/>;
}