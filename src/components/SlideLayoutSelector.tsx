import React from 'react';
import { SlideArchetype } from '../types';
import { Check } from 'lucide-react';

interface SlideLayoutSelectorProps {
  currentType: SlideArchetype;
  onSelect: (type: SlideArchetype) => void;
}

interface LayoutOption {
  type: SlideArchetype;
  label: string;
  icon: React.ReactNode;
}

const LayoutIcon: React.FC<{ type: SlideArchetype }> = ({ type }) => {
  const commonClass = "w-full h-full text-gray-400 group-hover:text-primary-500 transition-colors";
  
  switch (type) {
    case SlideArchetype.Explainer: // List
      return (
        <svg viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClass}>
          <rect x="2" y="2" width="36" height="26" rx="2" stroke="currentColor" strokeWidth="2"/>
          <rect x="6" y="6" width="20" height="4" rx="1" fill="currentColor" fillOpacity="0.5"/>
          <line x1="6" y1="14" x2="34" y2="14" stroke="currentColor" strokeWidth="2"/>
          <line x1="6" y1="18" x2="34" y2="18" stroke="currentColor" strokeWidth="2"/>
          <line x1="6" y1="22" x2="24" y2="22" stroke="currentColor" strokeWidth="2"/>
        </svg>
      );
    case SlideArchetype.ImageLeft:
      return (
        <svg viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClass}>
          <rect x="2" y="2" width="36" height="26" rx="2" stroke="currentColor" strokeWidth="2"/>
          <rect x="2" y="2" width="18" height="26" rx="1" fill="currentColor" fillOpacity="0.2"/>
          <line x1="24" y1="8" x2="36" y2="8" stroke="currentColor" strokeWidth="2"/>
          <line x1="24" y1="14" x2="36" y2="14" stroke="currentColor" strokeWidth="2"/>
          <line x1="24" y1="20" x2="36" y2="20" stroke="currentColor" strokeWidth="2"/>
        </svg>
      );
    case SlideArchetype.ImageRight:
      return (
        <svg viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClass}>
          <rect x="2" y="2" width="36" height="26" rx="2" stroke="currentColor" strokeWidth="2"/>
          <rect x="20" y="2" width="18" height="26" rx="1" fill="currentColor" fillOpacity="0.2"/>
          <line x1="6" y1="8" x2="16" y2="8" stroke="currentColor" strokeWidth="2"/>
          <line x1="6" y1="14" x2="16" y2="14" stroke="currentColor" strokeWidth="2"/>
          <line x1="6" y1="20" x2="16" y2="20" stroke="currentColor" strokeWidth="2"/>
        </svg>
      );
    case SlideArchetype.FullImage:
      return (
        <svg viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClass}>
          <rect x="2" y="2" width="36" height="26" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2"/>
          <rect x="6" y="10" width="28" height="10" rx="1" fill="white" fillOpacity="0.8"/>
          <line x1="10" y1="15" x2="30" y2="15" stroke="currentColor" strokeWidth="2"/>
        </svg>
      );
    case SlideArchetype.Quote:
      return (
        <svg viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClass}>
          <rect x="2" y="2" width="36" height="26" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 10L10 14H14V18H10V14H12V10Z" fill="currentColor"/>
          <path d="M18 10L16 14H20V18H16V14H18V10Z" fill="currentColor"/>
          <line x1="10" y1="20" x2="30" y2="20" stroke="currentColor" strokeWidth="1"/>
        </svg>
      );
    case SlideArchetype.BigNumber:
      return (
        <svg viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClass}>
          <rect x="2" y="2" width="36" height="26" rx="2" stroke="currentColor" strokeWidth="2"/>
          <text x="20" y="18" textAnchor="middle" fontSize="14" fontWeight="bold" fill="currentColor">42%</text>
          <line x1="10" y1="22" x2="30" y2="22" stroke="currentColor" strokeWidth="1"/>
        </svg>
      );
    case SlideArchetype.ThreeCol:
      return (
        <svg viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClass}>
          <rect x="2" y="2" width="36" height="26" rx="2" stroke="currentColor" strokeWidth="2"/>
          <rect x="4" y="6" width="9" height="18" rx="1" stroke="currentColor" strokeWidth="1"/>
          <rect x="15" y="6" width="9" height="18" rx="1" stroke="currentColor" strokeWidth="1"/>
          <rect x="26" y="6" width="9" height="18" rx="1" stroke="currentColor" strokeWidth="1"/>
        </svg>
      );
    case SlideArchetype.Title: // Hero
      return (
        <svg viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClass}>
          <rect x="2" y="2" width="36" height="26" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.8"/>
          <rect x="8" y="12" width="24" height="6" rx="1" fill="white"/>
        </svg>
      );
    case SlideArchetype.Comparison:
      return (
        <svg viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClass}>
          <rect x="2" y="2" width="36" height="26" rx="2" stroke="currentColor" strokeWidth="2"/>
          <rect x="4" y="6" width="15" height="18" rx="1" fill="currentColor" fillOpacity="0.1"/>
          <rect x="21" y="6" width="15" height="18" rx="1" fill="currentColor" fillOpacity="0.3"/>
        </svg>
      );
    case SlideArchetype.Timeline:
      return (
        <svg viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClass}>
          <rect x="2" y="2" width="36" height="26" rx="2" stroke="currentColor" strokeWidth="2"/>
          <line x1="6" y1="15" x2="34" y2="15" stroke="currentColor" strokeWidth="2"/>
          <circle cx="10" cy="15" r="2" fill="currentColor"/>
          <circle cx="20" cy="15" r="2" fill="currentColor"/>
          <circle cx="30" cy="15" r="2" fill="currentColor"/>
        </svg>
      );
    case SlideArchetype.GridCards:
      return (
        <svg viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClass}>
          <rect x="2" y="2" width="36" height="26" rx="2" stroke="currentColor" strokeWidth="2"/>
          <rect x="6" y="6" width="13" height="8" rx="1" stroke="currentColor" strokeWidth="1"/>
          <rect x="21" y="6" width="13" height="8" rx="1" stroke="currentColor" strokeWidth="1"/>
          <rect x="6" y="16" width="13" height="8" rx="1" stroke="currentColor" strokeWidth="1"/>
          <rect x="21" y="16" width="13" height="8" rx="1" stroke="currentColor" strokeWidth="1"/>
        </svg>
      );
    case SlideArchetype.SectionHeader:
      return (
        <svg viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClass}>
          <rect x="2" y="2" width="36" height="26" rx="2" stroke="currentColor" strokeWidth="2"/>
          <rect x="2" y="10" width="36" height="10" fill="currentColor" fillOpacity="0.8"/>
          <line x1="6" y1="15" x2="26" y2="15" stroke="white" strokeWidth="2"/>
        </svg>
      );
    case SlideArchetype.Checklist:
      return (
        <svg viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClass}>
          <rect x="2" y="2" width="36" height="26" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M8 10L10 12L14 8" stroke="currentColor" strokeWidth="2" fill="none"/>
          <line x1="16" y1="10" x2="32" y2="10" stroke="currentColor" strokeWidth="1"/>
          <path d="M8 16L10 18L14 14" stroke="currentColor" strokeWidth="2" fill="none"/>
          <line x1="16" y1="16" x2="32" y2="16" stroke="currentColor" strokeWidth="1"/>
          <path d="M8 22L10 24L14 20" stroke="currentColor" strokeWidth="2" fill="none"/>
          <line x1="16" y1="22" x2="32" y2="22" stroke="currentColor" strokeWidth="1"/>
        </svg>
      );
    case SlideArchetype.DoDont:
      return (
        <svg viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClass}>
          <rect x="2" y="2" width="36" height="26" rx="2" stroke="currentColor" strokeWidth="2"/>
          <line x1="20" y1="2" x2="20" y2="28" stroke="currentColor" strokeWidth="1"/>
          <path d="M8 10L10 12L14 8" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M26 8L32 14M32 8L26 14" stroke="currentColor" strokeWidth="2"/>
        </svg>
      );
    case SlideArchetype.Table:
      return (
        <svg viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClass}>
          <rect x="2" y="2" width="36" height="26" rx="2" stroke="currentColor" strokeWidth="2"/>
          <line x1="2" y1="10" x2="38" y2="10" stroke="currentColor" strokeWidth="1"/>
          <line x1="2" y1="18" x2="38" y2="18" stroke="currentColor" strokeWidth="1"/>
          <line x1="14" y1="2" x2="14" y2="28" stroke="currentColor" strokeWidth="1"/>
          <line x1="26" y1="2" x2="26" y2="28" stroke="currentColor" strokeWidth="1"/>
        </svg>
      );
    case SlideArchetype.ImageCenter:
      return (
        <svg viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClass}>
          <rect x="2" y="2" width="36" height="26" rx="2" stroke="currentColor" strokeWidth="2"/>
          <rect x="8" y="6" width="24" height="12" rx="1" fill="currentColor" fillOpacity="0.2"/>
          <line x1="8" y1="22" x2="32" y2="22" stroke="currentColor" strokeWidth="2"/>
        </svg>
      );
    case SlideArchetype.Exercise: // ProcessSteps
      return (
        <svg viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClass}>
          <rect x="2" y="2" width="36" height="26" rx="2" stroke="currentColor" strokeWidth="2"/>
          <circle cx="8" cy="15" r="3" stroke="currentColor" strokeWidth="1"/>
          <circle cx="20" cy="15" r="3" stroke="currentColor" strokeWidth="1"/>
          <circle cx="32" cy="15" r="3" stroke="currentColor" strokeWidth="1"/>
          <line x1="11" y1="15" x2="17" y2="15" stroke="currentColor" strokeWidth="1"/>
          <line x1="23" y1="15" x2="29" y2="15" stroke="currentColor" strokeWidth="1"/>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={commonClass}>
          <rect x="2" y="2" width="36" height="26" rx="2" stroke="currentColor" strokeWidth="2"/>
          <text x="20" y="18" textAnchor="middle" fontSize="8" fill="currentColor">?</text>
        </svg>
      );
  }
};

const SlideLayoutSelector: React.FC<SlideLayoutSelectorProps> = ({ currentType, onSelect }) => {
  const options: LayoutOption[] = [
    { type: SlideArchetype.Explainer, label: 'Listă (Standard)', icon: <LayoutIcon type={SlideArchetype.Explainer} /> },
    { type: SlideArchetype.ImageLeft, label: 'Imagine Stânga', icon: <LayoutIcon type={SlideArchetype.ImageLeft} /> },
    { type: SlideArchetype.ImageRight, label: 'Imagine Dreapta', icon: <LayoutIcon type={SlideArchetype.ImageRight} /> },
    { type: SlideArchetype.FullImage, label: 'Full Imagine', icon: <LayoutIcon type={SlideArchetype.FullImage} /> },
    { type: SlideArchetype.Quote, label: 'Citat', icon: <LayoutIcon type={SlideArchetype.Quote} /> },
    { type: SlideArchetype.BigNumber, label: 'Număr Mare', icon: <LayoutIcon type={SlideArchetype.BigNumber} /> },
    { type: SlideArchetype.ThreeCol, label: '3 Coloane', icon: <LayoutIcon type={SlideArchetype.ThreeCol} /> },
    { type: SlideArchetype.Title, label: 'Copertă', icon: <LayoutIcon type={SlideArchetype.Title} /> },
    { type: SlideArchetype.Comparison, label: 'Comparație', icon: <LayoutIcon type={SlideArchetype.Comparison} /> },
    { type: SlideArchetype.Timeline, label: 'Cronologie', icon: <LayoutIcon type={SlideArchetype.Timeline} /> },
    { type: SlideArchetype.GridCards, label: 'Carduri', icon: <LayoutIcon type={SlideArchetype.GridCards} /> },
    { type: SlideArchetype.SectionHeader, label: 'Titlu Secțiune', icon: <LayoutIcon type={SlideArchetype.SectionHeader} /> },
    { type: SlideArchetype.Checklist, label: 'Checklist', icon: <LayoutIcon type={SlideArchetype.Checklist} /> },
    { type: SlideArchetype.DoDont, label: "Do & Don't", icon: <LayoutIcon type={SlideArchetype.DoDont} /> },
    { type: SlideArchetype.Table, label: 'Tabel', icon: <LayoutIcon type={SlideArchetype.Table} /> },
    { type: SlideArchetype.ImageCenter, label: 'Imagine Centru', icon: <LayoutIcon type={SlideArchetype.ImageCenter} /> },
    { type: SlideArchetype.Exercise, label: 'Pași Proces', icon: <LayoutIcon type={SlideArchetype.Exercise} /> },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 p-2">
      {options.map((opt) => (
        <button
          key={opt.type}
          onClick={() => onSelect(opt.type)}
          className={`group relative flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
            currentType === opt.type
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-1 ring-primary-500'
              : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
          title={opt.label}
        >
          <div className="w-12 h-9 relative">
            {opt.icon}
            {currentType === opt.type && (
              <div className="absolute -top-1 -right-1 bg-primary-500 text-white rounded-full p-0.5">
                <Check size={10} />
              </div>
            )}
          </div>
          <span className="text-[10px] font-medium text-center leading-tight text-gray-600 dark:text-gray-300">
            {opt.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default SlideLayoutSelector;
