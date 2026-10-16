import styles from './EmbeddedLinksSearchBar.module.css';
import { useState, useRef, useId } from 'react';
import { SearchIcon } from '../../ui/icons';
import { useAnnounce, useTooltip } from '../../../context';
import { Input } from '../../ui';
import { TbXFilled } from 'react-icons/tb';

//IMPORTANT PATTERN TO REMEMBER
// 1. pointerdown / touchstart / mousedown
// 2. Focus Shift: The <input> loses focus, triggering its **onBlur** event. // click never fires to search list closes before click registers so I never get sent to task
// 3. pointerup / touchend / mouseup
// 4. click event (fires only after both press and release complete)
export default function EmbeddedLinksSearchBar({ itemsToSearchThrough, whatToSearch, paddingNearby, listItemShadow }) { // in this case we are searching the tasks of the taskCards
    // custom hooks
    const [, setTooltipDetails] = useTooltip(null);
    const setAnnouncerText = useAnnounce();

    const [searchQuery, setSearchQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [searchQueryFromList, setSearchQueryFromList] = useState('')
    const [focusedID, setFocusedID] = useState(null);

    const searchInputRef = useRef(null);
    const searchListRef = useRef(null);

    const id = useId(); // this component might be used more than once in my app

    const tasksWithIdArr = itemsToSearchThrough.map(item => ({id: item.id, task: item.task}));
    const searchQueryErrMsg = 'Task not found. Try to be more specific with the search you typed in or select a task from the list'

    function reset(){
        setSearchQuery('');
        setSearchQueryFromList('')
        setIsOpen(false);
        setFocusedID(null); // no point having that if its closed
    }

    function handleSearchQueryOnEnter(searchInput, id){
        const canWeFindMatch = tasksWithIdArr.find(item => item.task.replace(/\s/g, '').toLowerCase().includes(searchQuery.toLowerCase().replace(/\s/g, '').trim())); // returns the specific object where this is the the case?
        if (canWeFindMatch) {
            for (const item of itemsToSearchThrough){
                if (item.id === canWeFindMatch.id){
                    const taskCardDOMNode = document.getElementById(item.id);
                    taskCardDOMNode.scrollIntoView({ behavior: 'smooth' });
                    taskCardDOMNode.focus(); // we are focusing on an object not the actual dom node...
                    setAnnouncerText('Selected task is now in view and focused')
                } 
            } 
        } else {
            setTooltipDetails({id: id, type: 'error', element: searchInput, content: searchQueryErrMsg});
        }
    }
    
    const filtered = tasksWithIdArr.filter(item => {
        if (!searchQuery) return;
        const formattedItem = item?.task?.toLowerCase();
        const formattedSearchQuery = searchQuery?.toLowerCase().trim();
        return formattedItem.includes(formattedSearchQuery);
    });

    function handleSearchItemNavigation(key){
        if (!filtered) return;
        
        const currIndex = filtered.findIndex((item) => item.id === focusedID)

        if (key === "ArrowUp"){
            if (currIndex > 0) {
               setFocusedID(filtered[currIndex - 1].id)
               setSearchQueryFromList(filtered[currIndex - 1].task)
            } else {
                setFocusedID(null)
                setSearchQueryFromList(null) // this clears selection back to input, how?
            }
        } else if (key === "ArrowDown"){
            if (currIndex === -1 || currIndex === filtered.length - 1) {
                setFocusedID(filtered[0].id)
                setSearchQueryFromList(filtered[0].task)
            } else {
                setFocusedID(filtered[currIndex + 1].id)
                setSearchQueryFromList(filtered[currIndex + 1].task)
            }
        }
    }
    return(
        <>
        {/* **IMPORTANT** LOOK AT YT SEARCH BAR WHEN YOU SCROLL VALUE GETS APPENDED TO CURRENT VALUE */}
        <div className={styles.searchBar}
        onFocus={() => setIsOpen(true)}
        onBlur={(e) => {
            const parent = e.currentTarget;
            const currElementFocused = e.relatedTarget;
            if (!(parent.contains(currElementFocused))) reset();
        }}>
            <div className={styles.searchBox}>
                <Input role='combobox' data-input-container className={styles.search} style={{padding: `${paddingNearby} var(--space-xs)`}} ref={searchInputRef} type="text" id={`${id}-searchInput`} value={searchQueryFromList || searchQuery} 
                aria-label='Search for task' aria-autocomplete='list' aria-controls={`${id}-searchItems`} aria-expanded={Boolean(filtered.length > 0)}
                aria-activedescendant={focusedID ? `${focusedID}-opt` : undefined}
                onChange={(e) => setSearchQuery(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                onKeyDown={(e, inputId) => {
                    if (e.key === "Enter") handleSearchQueryOnEnter(e.currentTarget, inputId)
                    if (e.key === "Escape") reset();
                    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                        e.preventDefault();
                        handleSearchItemNavigation(e.key);
                    }
                }}
                autoComplete='off' spellCheck='false'
                placeholder='Search for task..'/>
                {searchQuery && isOpen && filtered.length > 0 && ( 
                    <div data-embedded-links-searchbar-opt-cont id={`${id}-searchItems`} className={styles.searchItems} ref={searchListRef} style={{boxShadow: listItemShadow}} role='listbox' aria-label='Searched items' >
                        {filtered.map((filItem) => {
                            const isSelected = focusedID === filItem.id; // creates an illusion on focus navigation because its triggering a class which looks like the searchOpt is receiving focus
                            const optID = `${filItem.id}-opt`;
                            return (
                                <div key={filItem.id} id={optID} role='option' className={`${styles.searchOpt} ${isSelected && styles.searchOptSelected}`} tabIndex={-1}
                                aria-selected={isSelected}
                                onPointerDown={(e) => {
                                    e.preventDefault(); // need this because pointer down automatically triggers blur which hides search list
                                    const elementToGoTo = document.getElementById(filItem.id);
                                    elementToGoTo?.scrollIntoView();
                                    elementToGoTo?.focus();
                                    reset();
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter"){
                                        e.preventDefault();
                                        const elementToGoTo = document.getElementById(filItem.id);
                                        elementToGoTo?.scrollIntoView();
                                        elementToGoTo?.focus();
                                        reset();
                                    }
                                }}>
                                    <SearchIcon color='black' size='var(--icon-sm)'/>
                                    <p>{filItem.task}</p>
                                </div>
                            );
                        })}
                    </div>
                )}
                {searchQuery && <button type='button' className={styles.clearSearchQueryBtn} aria-label='Clear search query' onClick={() => { setSearchQuery(''), searchInputRef.current?.focus()} }><TbXFilled/></button>}
            </div>
            <button type='button' className={styles.searchBtn} aria-label='Click to search' 
            onClick={ (e) => handleSearchQueryOnEnter(e.currentTarget.closest('input')) }>
                <SearchIcon/>
            </button>
        </div>
        </>
    );
}