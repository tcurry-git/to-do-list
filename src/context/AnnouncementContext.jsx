import { useState, useContext, createContext } from 'react';
import { Announcer } from '../components/global/';

const AnnouncementContext = createContext();

export default function AnnouncementProvider({ children }){
    const [announcerText, setAnnouncerText] = useState('');

    return (
        <AnnouncementContext.Provider value={setAnnouncerText}>
            { children }
            <Announcer text={announcerText}/>
        </AnnouncementContext.Provider>
    );
}

export function useAnnounce(){
    return useContext(AnnouncementContext);
}