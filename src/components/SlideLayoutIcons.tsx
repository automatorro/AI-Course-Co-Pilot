import React from 'react';

interface IconProps {
    className?: string;
}

export const TitleIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 40 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="36" height="20" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="8" y="10" width="24" height="2" rx="1" fill="currentColor" />
        <rect x="12" y="14" width="16" height="1.5" rx="0.75" fill="currentColor" opacity="0.5" />
    </svg>
);

export const ExplainerIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 40 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="36" height="20" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="6" y="6" width="16" height="2" rx="1" fill="currentColor" />
        <rect x="6" y="10" width="28" height="1.5" rx="0.75" fill="currentColor" opacity="0.5" />
        <rect x="6" y="13" width="26" height="1.5" rx="0.75" fill="currentColor" opacity="0.5" />
        <rect x="6" y="16" width="20" height="1.5" rx="0.75" fill="currentColor" opacity="0.5" />
    </svg>
);

export const ImageLeftIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 40 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="36" height="20" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="2" y="2" width="14" height="20" rx="1" fill="currentColor" opacity="0.2" />
        <rect x="20" y="6" width="14" height="2" rx="1" fill="currentColor" />
        <rect x="20" y="10" width="14" height="1.5" rx="0.75" fill="currentColor" opacity="0.5" />
        <rect x="20" y="13" width="12" height="1.5" rx="0.75" fill="currentColor" opacity="0.5" />
        <rect x="20" y="16" width="10" height="1.5" rx="0.75" fill="currentColor" opacity="0.5" />
    </svg>
);

export const ImageRightIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 40 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="36" height="20" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="24" y="2" width="14" height="20" rx="1" fill="currentColor" opacity="0.2" />
        <rect x="6" y="6" width="14" height="2" rx="1" fill="currentColor" />
        <rect x="6" y="10" width="14" height="1.5" rx="0.75" fill="currentColor" opacity="0.5" />
        <rect x="6" y="13" width="12" height="1.5" rx="0.75" fill="currentColor" opacity="0.5" />
        <rect x="6" y="16" width="10" height="1.5" rx="0.75" fill="currentColor" opacity="0.5" />
    </svg>
);

export const FullImageIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 40 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="36" height="20" rx="1" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="20" cy="12" r="4" stroke="currentColor" opacity="0.5" />
        <path d="M6 18L12 12L18 18" stroke="currentColor" opacity="0.5" />
    </svg>
);

export const QuoteIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 40 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="36" height="20" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <path d="M14 8L14 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <rect x="18" y="9" width="14" height="2" rx="1" fill="currentColor" />
        <rect x="18" y="13" width="10" height="1.5" rx="0.75" fill="currentColor" opacity="0.5" />
    </svg>
);

export const BigNumberIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 40 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="36" height="20" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <text x="20" y="14" fontSize="10" fontWeight="bold" textAnchor="middle" fill="currentColor">42</text>
        <rect x="14" y="16" width="12" height="1.5" rx="0.75" fill="currentColor" opacity="0.5" />
    </svg>
);

export const ThreeColIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 40 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="36" height="20" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="5" y="6" width="8" height="12" rx="1" fill="currentColor" opacity="0.1" />
        <rect x="16" y="6" width="8" height="12" rx="1" fill="currentColor" opacity="0.1" />
        <rect x="27" y="6" width="8" height="12" rx="1" fill="currentColor" opacity="0.1" />
    </svg>
);

export const ComparisonIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 40 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="36" height="20" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="5" y="6" width="13" height="12" rx="1" fill="currentColor" opacity="0.1" />
        <rect x="22" y="6" width="13" height="12" rx="1" fill="currentColor" opacity="0.1" />
        <path d="M20 6V18" stroke="currentColor" strokeDasharray="2 2" />
    </svg>
);

export const TimelineIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 40 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="36" height="20" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 12H34" stroke="currentColor" strokeWidth="1" />
        <circle cx="10" cy="12" r="1.5" fill="currentColor" />
        <circle cx="20" cy="12" r="1.5" fill="currentColor" />
        <circle cx="30" cy="12" r="1.5" fill="currentColor" />
    </svg>
);

export const GridCardsIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 40 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="36" height="20" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="6" y="6" width="12" height="5" rx="1" fill="currentColor" opacity="0.2" />
        <rect x="22" y="6" width="12" height="5" rx="1" fill="currentColor" opacity="0.2" />
        <rect x="6" y="13" width="12" height="5" rx="1" fill="currentColor" opacity="0.2" />
        <rect x="22" y="13" width="12" height="5" rx="1" fill="currentColor" opacity="0.2" />
    </svg>
);

export const SectionHeaderIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 40 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="36" height="20" rx="1" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="10" y="10" width="20" height="2" rx="1" fill="currentColor" />
        <rect x="15" y="14" width="10" height="1.5" rx="0.75" fill="currentColor" opacity="0.5" />
    </svg>
);

export const ChecklistIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 40 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="36" height="20" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 8L10 10L14 6" stroke="currentColor" strokeWidth="1.5" />
        <rect x="16" y="7" width="18" height="1.5" rx="0.75" fill="currentColor" opacity="0.5" />
        <path d="M8 14L10 16L14 12" stroke="currentColor" strokeWidth="1.5" />
        <rect x="16" y="13" width="16" height="1.5" rx="0.75" fill="currentColor" opacity="0.5" />
    </svg>
);

export const TableIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 40 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="36" height="20" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="6" y="6" width="28" height="12" rx="1" stroke="currentColor" strokeWidth="0.5" />
        <path d="M6 10H34" stroke="currentColor" strokeWidth="0.5" />
        <path d="M6 14H34" stroke="currentColor" strokeWidth="0.5" />
        <path d="M15 6V18" stroke="currentColor" strokeWidth="0.5" />
        <path d="M25 6V18" stroke="currentColor" strokeWidth="0.5" />
    </svg>
);

export const AgendaIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 40 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="36" height="20" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="8" y="6" width="24" height="2" rx="1" fill="currentColor" />
        <circle cx="8" cy="11" r="1.5" fill="currentColor" opacity="0.5" />
        <rect x="12" y="10.5" width="20" height="1.5" rx="0.75" fill="currentColor" opacity="0.5" />
        <circle cx="8" cy="15" r="1.5" fill="currentColor" opacity="0.5" />
        <rect x="12" y="14.5" width="20" height="1.5" rx="0.75" fill="currentColor" opacity="0.5" />
    </svg>
);

export const GenericIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 40 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="36" height="20" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="6" y="6" width="10" height="12" rx="1" fill="currentColor" opacity="0.1" />
        <rect x="18" y="6" width="16" height="2" rx="1" fill="currentColor" opacity="0.5" />
        <rect x="18" y="10" width="14" height="1.5" rx="0.75" fill="currentColor" opacity="0.3" />
    </svg>
);
