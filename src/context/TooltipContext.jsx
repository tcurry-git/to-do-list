import { useState, useContext, createContext, useId } from 'react';
import { Tooltip } from '../components/global/';

const TooltipContext = createContext();

export default function TooltipProvider({ children }){
    
    const [tooltipDetails, setTooltipDetails] = useState([]);
    const generatedId = useId();
    function setTooltip(details){ // 
        const tooltipId = details.id ?? generatedId;
        const formattedType = details.type.toLowerCase().trim();
        const formattedContent = details.content.trim().charAt(0).toUpperCase() + details.content.slice(1).trim().toLowerCase();
        const tooltipContainer = details.element?.closest('[data-tooltip-container]');
        setTooltipDetails((prev) => [...prev, { id: tooltipId, type: formattedType, container: tooltipContainer, content: formattedContent}]);
    }

    return(
        <TooltipContext.Provider value={[ tooltipDetails, setTooltip ]}>
            { children }
            {tooltipDetails?.map((tooltip) => (
                <Tooltip 
                key={tooltip?.id}
                id={tooltip?.id}
                type={tooltip?.type}
                container={tooltip?.container} 
                content={tooltip?.content}
                remove={() => setTooltipDetails((t) => [...t].filter(prevTooltips => prevTooltips.id !== tooltip?.id))}/> 
            ))}
        </TooltipContext.Provider>
    )
}

export function useTooltip(){
    return useContext(TooltipContext);
}