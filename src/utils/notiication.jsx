// src/utils/notifications.js
export async function sendNotification(title, options) {
    if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        if (registration && registration.showNotification) {
            registration.showNotification(title, options);
            return;
        }
    }
    if (Notification.permission === 'granted') {
        const newNotif = new Notification(title, options);
        if (newNotif){
            newNotif.onclick = () => {
                window?.focus();
                newNotif?.close()
            }  
        }
    }
}