import { useState, useContext, createContext, useId } from 'react';
import { Tooltip } from '../components/global/';

const TooltipContext = createContext();

export default function TooltipProvider({ children }){
    
    const [tooltipDetails, setTooltipDetails] = useState([]);
    const generatedId = useId();
    function handleTooltips(details){ // 
        const tooltipId = details.id ?? generatedId;
        const formattedType = details.type.toLowerCase().trim();
        const formattedContent = details.content.trim()[0].toUpperCase();
        const tooltipContainer = details.element?.closest('[data-tooltip-container]');
        setTooltipDetails((prev) => [...prev, { id: tooltipId, type: formattedType, container: tooltipContainer, content: formattedContent}]);
    }

    return(
        <TooltipContext.Provider value={[ tooltipDetails, handleTooltips ]}>
            { children }
            {tooltipDetails?.map((tooltip, index) => (
                <Tooltip 
                key={index}
                id={tooltip?.id}
                container={tooltip?.container} 
                content={tooltip?.content}
                remove={() => setTooltipDetails((t) => [...t].filter(tooltips => tooltips !== tooltip?.id))}/> 
            ))}
        </TooltipContext.Provider>
    )
}

export function useTooltip(){
    return useContext(TooltipContext);
}