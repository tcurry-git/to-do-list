// src/utils/notifications.js
export async function sendNotification(title, options) {
    try {
        console.log(`trying to send noti`);
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            const registration = await navigator.serviceWorker.ready;
            if (registration && registration.showNotification) {
                registration.showNotification(title, options);
                return;
            }
        }
    } catch (err) {
        console.log(`failed:`, err);
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
    console.log('notification sent')
}