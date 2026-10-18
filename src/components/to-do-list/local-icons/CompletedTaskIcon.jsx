import { TbChecklist } from "react-icons/tb";
import { CustomBaseIcon } from './../../ui';

export function CompletedTaskIcon(
    // these are props, they dont need to be svg attributes
    { 
        isCompleted = false,
        size,
        fill,
        stroke = "var(--clr-green)",
        strokeWidth = 2,
        ...props
    }) {
        const defaultFill = fill ?? (isCompleted ? "var(--clr-green)" : "none")
    return (
        <CustomBaseIcon
        icon={TbChecklist}
        size={size} 
        fill={defaultFill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        {...props}
        />
    );
}