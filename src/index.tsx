import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/sticky-editor.css';

// Patch for non-passive event listeners violation (Chrome DevTools)
// Defaults touch/wheel events to passive:true if not specified
(function() {
  if (typeof EventTarget !== "undefined") {
    const func = EventTarget.prototype.addEventListener;
    // @ts-ignore
    EventTarget.prototype.addEventListener = function(type: string, fn: EventListenerOrEventListenerObject, capture?: boolean | AddEventListenerOptions) {
      if (['touchstart', 'touchmove', 'wheel', 'mousewheel'].includes(type)) {
        if (typeof capture !== 'object' || capture === null) {
          capture = { capture: !!capture, passive: true };
        } else if (capture.passive === undefined) {
          // Only set passive if not explicitly defined
          capture = { ...capture, passive: true };
        }
      }
      // @ts-ignore
      func.call(this, type, fn, capture);
    };
  }
})();

import { ToastContext } from './contexts/ToastContext';
import ToastContainer, { InternalToastContext } from './components/ToastContainer';
import { SpeedInsights } from '@vercel/speed-insights/react';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

const AppWrapper = () => {
    const [toasts, setToasts] = React.useState<any[]>([]);
    const timeoutIds = React.useRef<Set<number>>(new Set());

    const removeToast = React.useCallback((id: string) => {
        setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
    }, []);

    const showToast = React.useCallback((message: string, type = 'info') => {
        const id = `toast-${Date.now()}-${Math.random()}`;
        setToasts(currentToasts => [...currentToasts, { id, message, type }]);
        
        const timeoutId = window.setTimeout(() => {
            removeToast(id);
            timeoutIds.current.delete(timeoutId);
        }, 5000);
        timeoutIds.current.add(timeoutId);

    }, [removeToast]);

    React.useEffect(() => {
        return () => {
            timeoutIds.current.forEach(timeoutId => clearTimeout(timeoutId));
        };
    }, []);

    const contextValue = {
        showToast
    };
    
    const internalContextValue = {
        toasts,
        removeToast
    }

    return (
        <ToastContext.Provider value={contextValue}>
            <InternalToastContext.Provider value={internalContextValue}>
                <App />
                <SpeedInsights />
                <ToastContainer />
            </InternalToastContext.Provider>
        </ToastContext.Provider>
    );
};


root.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);