import React from 'react';

const ExportErrorModal: React.FC<{ isOpen: boolean; onClose: () => void; report: string }> = ({ isOpen, onClose, report }) => {
  if (!isOpen) return null;
  const items = (report || '').split('\n').filter(Boolean);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4" style={{ zIndex: 10000 }}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold">Export oprit — raport de erori</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Corectează secțiunile din „Slides” indicate mai jos, apoi exportă din nou.</p>
        </div>
        <div className="p-4 space-y-2">
          {items.map((line, idx) => (
            <div key={idx} className="text-sm">
              {line}
            </div>
          ))}
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl flex justify-end">
          <button onClick={onClose} className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-gold hover:bg-gold-dim">Închide</button>
        </div>
      </div>
    </div>
  );
};

export default ExportErrorModal;

