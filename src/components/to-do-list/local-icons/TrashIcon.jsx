import { TbTrash } from "react-icons/tb";
import { CustomBaseIcon } from "./../../ui";

export function TrashIcon(
    {
        color = 'var(--clr-red)',
        ...props
    }
){
    return <CustomBaseIcon icon={TbTrash} color={color} {...props}/>;
}