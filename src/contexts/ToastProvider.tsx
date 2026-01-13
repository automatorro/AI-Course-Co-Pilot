import React from 'react';
import { ToastContext } from './ToastContext';
import ToastContainer, { InternalToastContext } from '../components/ToastContainer';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = React.useState<any[]>([]);
    const timeoutIds = React.useRef<Set<number>>(new Set());

    const removeToast = React.useCallback((id: string) => {
        setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
    }, []);

    const showToast = React.useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
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
                {children}
                <ToastContainer />
            </InternalToastContext.Provider>
        </ToastContext.Provider>
    );
};
