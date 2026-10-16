import { useEffect } from 'react';
import { AnnouncementProvider, TooltipProvider } from './context';
import ToDoList from './components/to-do-list/ToDoList.jsx';

export default function App(){

  
  useEffect(() => {
      const handleTabbing = (e) => {
        if (e.key === "Tab") {
            document.body.classList.add('user-is-tabbing');
          }
        }
      const handleMouseDown = () => {
        document.body.classList.remove('user-is-tabbing');
      }
      
      window.addEventListener('keydown', handleTabbing);
      window.addEventListener('mousedown', handleMouseDown);

      return () => {
        window.removeEventListener('keydown', handleTabbing);
        window.removeEventListener('mousedown', handleMouseDown);
      };
  }, [])

  return( 
    <>
    <AnnouncementProvider>
      <TooltipProvider>
        <ToDoList/>
      </TooltipProvider>
    </AnnouncementProvider>
    </>
  );

}
