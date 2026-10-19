import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'


if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Prepend BASE_URL so it correctly finds sw.js regardless of your base path configuration
        navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch((err) => {
            console.log('Service worker registration failed:', err);
        });
    });
}
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
