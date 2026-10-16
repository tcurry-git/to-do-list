import { 
    TbPizza, 
    TbNotebook, 
    TbPencil, 
    TbShirt, 
    TbBabyBottle, 
    TbDogBowl,
    TbBath,
    TbVacuumCleaner,
    TbWashMachine,
    TbCar
} from 'react-icons/tb';

const bgIconStyle = {fill: 'var(--clr-lightblue)', width: 'var(--icon-lg)'};

export default function BackgroundIcons() {
    return (
        <>
            <TbPizza style={bgIconStyle} />
            <TbNotebook style={bgIconStyle} />
            <TbPencil style={bgIconStyle} />
            <TbShirt style={bgIconStyle} />
            <TbBabyBottle style={bgIconStyle} />
            <TbDogBowl style={bgIconStyle} />
            <TbBath style={bgIconStyle} />
            <TbVacuumCleaner style={bgIconStyle} />
            <TbWashMachine style={bgIconStyle} />
            <TbCar style={bgIconStyle} />
        </>
    );

}