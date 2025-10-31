import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/I18nContext';
import { supabase } from '../services/supabaseClient';
import { Sun, Moon, LogOut, BookOpen, CreditCard, User as UserIcon } from 'lucide-react';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { t, language, setLanguage } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };
  
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
             {user && (
                <div className="hidden md:flex items-center gap-4">
                    <NavLink to="/dashboard" className={({isActive}) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                        {t('header.dashboard')}
                    </NavLink>
                    <NavLink to="/billing" className={({isActive}) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                        {t('header.billing')}
                    </NavLink>
                </div>
            )}

            <select value={language} onChange={e => setLanguage(e.target.value)} className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="en">EN</option>
                <option value="ro">RO</option>
            </select>

            <button onClick={toggleTheme} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            
            {user ? (
                 <div className="relative group">
                    <button className="p-2 rounded-full bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300">
                        <UserIcon size={20} />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
                        <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b dark:border-gray-700">{user.email}</div>
                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                          <LogOut size={16} />
                          {t('header.logout')}
                        </button>
                    </div>
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