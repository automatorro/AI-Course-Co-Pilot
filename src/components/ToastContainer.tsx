import React, { createContext, useContext } from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

// Re-defining interfaces here to make this a self-contained component for clarity
type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
    toasts: Toast[];
    removeToast: (id: string) => void;
}

// A local context to pass toasts down to the container
export const InternalToastContext = createContext<ToastContextValue | null>(null);

const Toast: React.FC<{ toast: Toast; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  const icons = {
    success: <CheckCircle className="text-green-500" />,
    error: <AlertCircle className="text-red-500" />,
    info: <Info className="text-blue-500" />,
  };

  const colors = {
      success: 'bg-green-50 dark:bg-green-900/50 border-green-400 dark:border-green-600',
      error: 'bg-red-50 dark:bg-red-900/50 border-red-400 dark:border-red-600',
      info: 'bg-blue-50 dark:bg-blue-900/50 border-blue-400 dark:border-blue-600',
  };

  return (
    <div
      className={`max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden my-2 animate-fade-in-up border-l-4 ${colors[toast.type]}`}
      onClick={() => onDismiss(toast.id)}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">{icons[toast.type]}</div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{toast.message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// This is the container that will be rendered in the main App layout
const ToastContainer: React.FC = () => {
    const context = useContext(InternalToastContext);

    if (!context) return null;

    const { toasts, removeToast } = context;

    return (
        <div
        aria-live="assertive"
        className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-[100]"
        >
        <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
            ))}
        </div>
        </div>
    );
};

export default ToastContainer;