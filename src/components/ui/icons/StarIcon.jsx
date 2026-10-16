import { TbStarFilled } from "react-icons/tb";
import { CustomBaseIcon } from "./CustomBaseIcon";

export function StarIcon(
    {
        isFavorited = false,
        fill,
        stroke = "var(--clr-gold)",
        strokeWidth = 2,
        ...props
    }
){
    const defaultFill = fill ?? (isFavorited ? "var(--clr-gold)" : "none"); // if fill is null use default style
    return (
        <CustomBaseIcon 
        icon={TbStarFilled} 
        fill={defaultFill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        {...props}/>
    );
}