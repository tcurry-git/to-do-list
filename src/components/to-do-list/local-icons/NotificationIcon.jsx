import { TbBellOff, TbBellRingingFilled } from "react-icons/tb";
import { CustomBaseIcon } from "./../../ui";

export function NotificationIcon(
    {
        remindersOn,
        color = "black",
        ...props
    }
) {
    return ( // return based on the value of remindersO
        <CustomBaseIcon icon={remindersOn ? TbBellRingingFilled : TbBellOff} {...props}/>
    );
}
