Title: **TODO app** 

Timeline: **SEPT 2026 - NOW (ONGOING)**

Stack: **HTML, CSS, JS, React, Vite**

**Project Here:** https://tcurry-git.github.io/to-do-list/

WHAT IT DOES:
------------------------------------------------------------------------------------------------------------------------------------------------------------------
This project allows to add tasks and then create your own task with a desired deadline. You can do basic things like favourite the task, mark the task as completed, delete the task but the more useful features give you the ability to edit a task you've already created and set reminders for specific tasks. There's also a search bar for finding tasks which is good if you have a lot of ongoing tasks you need to manage, there's also sorting and global task management where you can sort by deadline, unfavourite all tasks and delete all tasks. The reminders are just browser notifications not system push notifications so its practical use is limited, but this is fine because that wasn't the aim, the aim was just to learn JS and have a basic project to show at the end of it, and I've succeeded in that sense. Finally, I implemented error messages in the form of tooltips for the input fields, and a site wide announcer that announces actions that have been completed to screen readers.

WHY I CREATED IT:
------------------------------------------------------------------------------------------------------------------------------------------------------------------
This project was created because I wanted to learn more about JavaScript so I'd be able to implement more functionality within my projects and also just to widen my stack, I also wanted to dip my toes into the React library as it seems to be the single most widely used tool for front-end development. So, I delved right into to some React tutorials and starting learning things like how to map JavaScript arrays into HTML elements and how to make components. This opened my eyes massively as I could already imagine the possibilities with this and how easy it would be to create bigger websites and apps if you had components that you could just stick in anywhere and customize their functionality and how they look with props. I played around for a bit with this and then I did some research on what the best way to learn JS is, and found making a To Do List is widely regarded as the best beginner project out there. I then searched up some examples of what a To Do List should look like, what features it should have etc and stumbled upon a tutorial which I followed in order to make an extremely basic one and learn some basic JS in the process. This was ok, I understood everything, but I knew that the skills I learnt from that project were far too basic and I'd have to learn some more advanced JS so I could actually take what I've learnt and use it in industry inside real-world projects. This is I where I took it upon myself to just create my own To Do List and learn along the way in the midst of actually creating something, as that is how I learn best after all. To help guide myself through the creation of the project, as I am only a junior dev, I used YouTube and AI (Gemini / Copilot), however, I tried to stray away from vibe-coding as much as possible and I did want to actually understand what every piece of code was doing and why it worked. Throughout the project I focused a lot on implementing front-end and React best practices such as ensuring the codebase is organised and broken up into intuitive folders and file names, as well as using barrel files with named exports in order to efficiently group exports and imports, how to properly break up every inch of the site in to components, implementing portals for the overlays and tooltips, creating context for site wide features such as the tooltips and the announcer, and then accessibility, so using the correct ARIA attributes / roles where necessary, ensured of a solid contrast between any backgrounds and text, and made sure the text on both phones and desktops are of a readable size.

BIGGEST STRUGGLE(S):
------------------------------------------------------------------------------------------------------------------------------------------------------------------
The reminders feature was the biggest struggle I encountered by far because at first I tried using the Notification API to generate browser notifications which worked on desktop, but then when I tested on mobile it crashed the whole app / website when a notification would try to send. I found out the reason for this was because mobile browsers require you to register a 'Service Worker' before sending notifications as they have tighter restrictions on how notifications must be shown compared to desktop browsers.

WHAT I LEARNT:
------------------------------------------------------------------------------------------------------------------------------------------------------------------
• **React** - State management, component life-cycle, dynamic rendering, barrel files to group exports, portals, hooks such as: useState, useRef, useId, useContext as well as custom hooks and advanced codebase architecture.

• **JavaScript** - Using regex to dynamically inject symbols or whatever you want inside input boxes, classes such as Date, String, Boolean, RegExp, Notification, array and object destructuring, immutable array and object management using spread a functions that return new arrays (map, filter etc), how to properly validate using slice function, dynamic object property creation, native array and object methods such as Array.from(), Object.values() etc and helper functions

PLANS FOR FUTURE FEATURES / UPDATES (CURRENTLY WORKING ON AN UPDATE):
------------------------------------------------------------------------------------------------------------------------------------------------------------------
• **General refactoring of the codebase** - Making code more maintainable by reducing complexity of adding new features and making code more efficient by using useReducer hook more efficient methods overall 

• **UI updates** - Improve how the slide-in toolbar looks on mobile, improve how the buttons look

• **Cross-browser optimization and dark-theme implementation** - Was made crystal clear to me during testing (showing the project to friends and family) that it completely broke on the Samsung Browser and I'm sure also breaks on other browser too. It's also strictly built in light-mode regardless of the users browser settings.

• **Settings** - Menu that allows users to personalize the app as they please. For example, currently the reminders are hard-coded to only show 30min before the deadline, would be nice if the user could say they wanted a reminder say 6 hours before if its quite an important and involved thing they have to complete like a school essay.

• **Bug Report / Feature suggestions section** - Would exist inside a menu where users can enter the title of their bug/feature and then explain more about in a text box below. Unsure how I could implement this just yet however I assume I'd need some kind of 'inbox' which would need to be handled via my own API and back-end. Requests are sent through my back-end and then planted inside some 'inbox'. Plus, I need to thinking about rate limiting and profanity filtering.

WHAT IM GOING TO LEARN NEXT (WHEN PROJECT IS FULLY FINISHED):
------------------------------------------------------------------------------------------------------------------------------------------------------------------
• **Service workers + push notifications API** - Learn more in-depth about how service workers work and how to send push notifications to make the site more usable. Glossed over service workers when I was implementing the browser notification that acted as reminders feature.

• **Shadcn UI library + tailwind** - I personally like using regular old CSS files which is why I use CSS modules in this project, however, these tools seem to used a lot in real-world projects so I will broaden my horizon of knowledge even further by learning these.

• **Typescript** - Apparently no one uses Vanilla JS anymore! Once I spent some more time getting comfortable with Vanilla JS, I'll look into this and probably slowly refactor my entire codebase.
 
**How to use:** if you want to try it out, ensure you are using either the Chrome, Edge or Safari browser, and if you use Safari you must add it to your phone screen so it becomes a little app icon on your phone so the browser notifications actually work.
