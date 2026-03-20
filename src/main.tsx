import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Safety check for global
if (typeof (window as any).global === 'undefined') {
  // We avoid mapping global to window directly to prevent libraries from 
  // trying to overwrite read-only window properties like 'fetch'.
  (window as any).global = {}; 
} else if ((window as any).global === window) {
  // If some library already mapped global to window, we reset it to an empty object
  // to prevent the "Cannot set property fetch of #<Window> which has only a getter" error.
  (window as any).global = {};
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
