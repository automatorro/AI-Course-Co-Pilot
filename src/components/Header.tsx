import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/I18nContext';
import { supabase } from '../services/supabaseClient';
import { Sun, Moon, LogOut, BookOpen, CreditCard, User as UserIcon, LayoutDashboard } from 'lucide-react';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { t, language, setLanguage } = useTranslation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await supabase.auth.signOut();
    navigate('/');
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-md z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="flex-shrink-0 flex items-center gap-2 text-2xl font-bold text-primary-600 dark:text-primary-400">
               <BookOpen size={28}/>
               <span>{t('header.title')}</span>
            </NavLink>
          </div>
          <div className="flex items-center gap-4">
            <select value={language} onChange={e => setLanguage(e.target.value)} className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="en">EN</option>
                <option value="ro">RO</option>
            </select>

            <button onClick={toggleTheme} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            
            {user ? (
                 <div className="relative" ref={dropdownRef}>
                    <button onClick={() => setIsDropdownOpen(prev => !prev)} className="flex items-center gap-2 p-2 rounded-full bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300">
                        <UserIcon size={20} />
                         {user.first_name && <span className="hidden sm:inline text-sm font-medium pr-2">{user.first_name}</span>}
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                            <div className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 border-b dark:border-gray-700">
                                <p className="font-semibold">Signed in as</p>
                                <p className="truncate">{user.email}</p>
                            </div>
                            <div className="py-1">
                                <NavLink to="/profile" onClick={() => setIsDropdownOpen(false)} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3">
                                  <UserIcon size={16} />
                                  {t('header.profile')}
                                </NavLink>
                                <NavLink to="/dashboard" onClick={() => setIsDropdownOpen(false)} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3">
                                  <LayoutDashboard size={16} />
                                  {t('header.dashboard')}
                                </NavLink>
                                <NavLink to="/billing" onClick={() => setIsDropdownOpen(false)} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3">
                                  <CreditCard size={16} />
                                  {t('header.billing')}
                                </NavLink>
                            </div>
                            <div className="py-1">
                                <div className="my-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3">
                                  <LogOut size={16} />
                                  {t('header.logout')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
              <NavLink to="/login" className="px-4 py-2 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                {t('header.login')}
              </NavLink>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;